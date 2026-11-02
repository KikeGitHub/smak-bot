package com.smakbot.core.application.engine;

import com.smakbot.core.domain.model.Product;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.smakbot.core.application.engine.TextNormalizer.clean;
import static com.smakbot.core.application.engine.TextNormalizer.matchPhrase;
import static com.smakbot.core.application.engine.TextNormalizer.tokenize;

/**
 * Identificación del producto mencionado en un mensaje. Port de {@code extractSku} (pasos 2-5) del Oráculo.
 * Los pasos de referral de Meta Ads / campañas se reservan para una iteración posterior (no hay tabla en el SDD).
 */
public final class ProductMatcher {

    private static final Pattern BRACKET = Pattern.compile("\\[(?:sku:?\\s*)?([a-zA-Z0-9_\\-xX]{2,35})]", Pattern.CASE_INSENSITIVE);
    private static final Pattern EXPLICIT = Pattern.compile(
            "(?:sku|c[oó]digo|codigo|art[ií]culo|articulo|ref|modelo)\\s*[:#\\-]?\\s*([a-zA-Z0-9_\\-xX]{2,35})",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);

    /** Palabras genéricas (colores, atributos y familias) que no deben identificar un producto concreto. */
    private static final Set<String> GENERIC_ATTR_WORDS = Set.of(
            "negro", "negra", "blanco", "blanca", "cafe", "marron", "gris", "rosa", "rojo", "roja",
            "madera", "metal", "hierro", "acero", "precio", "medidas", "colores", "tamano", "fotos",
            "silla", "sillas", "sillon", "sillones", "taburete", "taburetes", "banco", "bancos",
            "escritorio", "escritorios", "mueble", "muebles", "estante", "estantes", "estanteria",
            "estanterias", "repisa", "repisas", "cocina", "bano", "banos", "griferia", "piletas",
            "despacho", "oficina", "barra", "hogar");

    public record Match(Product product, boolean explicit) {
    }

    public record ScoredProduct(Product product, int score) {
    }

    private ProductMatcher() {
    }

    public static Optional<Match> extract(String rawText, List<Product> products) {
        if (rawText == null || rawText.isBlank() || products.isEmpty()) return Optional.empty();

        // 1. Bracket [SKU]
        Matcher bracket = BRACKET.matcher(rawText);
        if (bracket.find()) {
            Optional<Product> found = bySku(products, bracket.group(1).trim());
            if (found.isPresent()) return Optional.of(new Match(found.get(), true));
        }

        // 2. Explicit prefix SKU:...
        Matcher explicit = EXPLICIT.matcher(rawText);
        if (explicit.find()) {
            Optional<Product> found = bySku(products, explicit.group(1).trim());
            if (found.isPresent()) return Optional.of(new Match(found.get(), true));
        }

        // 3. Direct SKU containment in text
        String upper = rawText.toUpperCase();
        Optional<Product> skuHit = products.stream()
                .filter(p -> p.sku() != null && upper.contains(p.sku().toUpperCase()))
                .max(java.util.Comparator.comparingInt(p -> p.sku().length()));
        if (skuHit.isPresent()) {
            return Optional.of(new Match(skuHit.get(), false));
        }

        String cleanMsg = clean(rawText);
        List<String> msgTokens = tokenize(cleanMsg);
        if (msgTokens.isEmpty()) return Optional.empty();

        // 4. Exact product clean name or phrase match
        for (Product p : products) {
            String pClean = clean(p.name());
            if (!pClean.isEmpty() && (cleanMsg.contains(pClean) || matchPhrase(cleanMsg, msgTokens, pClean))) {
                return Optional.of(new Match(p, false));
            }
            List<String> pTokens = tokenize(pClean).stream().filter(t -> t.length() > 2).toList();
            for (int i = 0; i < pTokens.size() - 1; i++) {
                String bigram = pTokens.get(i) + " " + pTokens.get(i + 1);
                if (cleanMsg.contains(bigram)) {
                    return Optional.of(new Match(p, false));
                }
            }
        }

        // 5. Distinctive token fuzzy & LIKE matching across products
        List<ScoredProduct> scored = scoreProducts(cleanMsg, msgTokens, products);
        if (!scored.isEmpty()) {
            ScoredProduct top = scored.get(0);
            if (top.score() >= 70) {
                return Optional.of(new Match(top.product(), false));
            }
        }

        return Optional.empty();
    }

    /**
     * Retorna los mejores productos candidatos ordenados por relevancia (para sugerencias "Quizás quisiste decir").
     */
    public static List<Product> findCandidates(String rawText, List<Product> products, int limit) {
        if (rawText == null || rawText.isBlank() || products.isEmpty()) return List.of();
        String cleanMsg = clean(rawText);
        List<String> msgTokens = tokenize(cleanMsg);
        List<ScoredProduct> scored = scoreProducts(cleanMsg, msgTokens, products);
        return scored.stream()
                .filter(sp -> sp.score() >= 40)
                .limit(limit)
                .map(ScoredProduct::product)
                .toList();
    }

    private static List<ScoredProduct> scoreProducts(String cleanMsg, List<String> msgTokens, List<Product> products) {
        // Filtrar tokens distintivos de la consulta del cliente (ignorar palabras genéricas)
        List<String> distinctiveMsgTokens = msgTokens.stream()
                .filter(t -> t.length() >= 3 && !GENERIC_ATTR_WORDS.contains(t))
                .toList();

        if (distinctiveMsgTokens.isEmpty()) {
            return List.of();
        }

        List<ScoredProduct> scoredList = new java.util.ArrayList<>();
        for (Product p : products) {
            int score = 0;
            String pClean = clean(p.name());
            List<String> pTokens = tokenize(pClean);
            List<String> pKeywords = p.keywords() != null ? p.keywords().stream().map(TextNormalizer::clean).toList() : List.of();

            // Verificación de keywords completas
            for (String kw : pKeywords) {
                if (kw.length() > 2 && !GENERIC_ATTR_WORDS.contains(kw)) {
                    if (cleanMsg.contains(kw)) {
                        score += 90;
                    } else if (kw.length() >= 4 && cleanMsg.length() >= 4 && (cleanMsg.contains(kw) || kw.contains(cleanMsg))) {
                        score += 60;
                    }
                }
            }

            // Puntuación por cada token distintivo del usuario
            for (String userTok : distinctiveMsgTokens) {
                String userStem = TextNormalizer.stem(userTok);
                boolean matchedTok = false;

                // Comparar contra tokens del nombre del producto
                for (String pTok : pTokens) {
                    if (pTok.length() < 3) continue;
                    String pStem = TextNormalizer.stem(pTok);
                    if (userTok.equals(pTok) || userStem.equals(pStem)) {
                        score += 80;
                        matchedTok = true;
                        break;
                    }
                    if (userTok.length() >= 4 && (pTok.contains(userTok) || userTok.contains(pTok))) {
                        score += 65;
                        matchedTok = true;
                        break;
                    }
                    if (userTok.length() >= 4 && pTok.length() >= 4 && TextNormalizer.similarity(userTok, pTok) >= 0.72) {
                        score += 55;
                        matchedTok = true;
                        break;
                    }
                }

                // Comparar contra keywords del producto
                if (!matchedTok) {
                    for (String kw : pKeywords) {
                        List<String> kwTokens = tokenize(kw);
                        for (String kwTok : kwTokens) {
                            if (kwTok.length() < 3) continue;
                            String kwStem = TextNormalizer.stem(kwTok);
                            if (userTok.equals(kwTok) || userStem.equals(kwStem)) {
                                score += 75;
                                matchedTok = true;
                                break;
                            }
                            if (userTok.length() >= 4 && kwTok.length() >= 4 && TextNormalizer.similarity(userTok, kwTok) >= 0.72) {
                                score += 50;
                                matchedTok = true;
                                break;
                            }
                        }
                        if (matchedTok) break;
                    }
                }
            }

            // Bonus de concordancia de categoría (ej: "silla" para sillas, "banco" para taburetes, "mesa" para mesas)
            if (score > 0) {
                boolean userMentionsChair = cleanMsg.contains("silla") || cleanMsg.contains("sillon");
                boolean userMentionsStool = cleanMsg.contains("taburete") || cleanMsg.contains("banco");
                boolean userMentionsTable = cleanMsg.contains("mesa") || cleanMsg.contains("escritorio");
                boolean userMentionsKitchen = cleanMsg.contains("cocina") || cleanMsg.contains("lavatrastos") || cleanMsg.contains("fregadero");

                if (userMentionsChair && (pClean.contains("silla") || pClean.contains("sillon"))) score += 20;
                if (userMentionsStool && (pClean.contains("taburete") || pClean.contains("banco") || pClean.contains("tolix"))) score += 20;
                if (userMentionsTable && (pClean.contains("mesa") || pClean.contains("escritorio"))) score += 20;
                if (userMentionsKitchen && (pClean.contains("pileta") || pClean.contains("cocina") || pClean.contains("monocomando"))) score += 20;

                // Preferencia por stock disponible
                if (p.inStock()) score += 5;
            }

            if (score > 0) {
                scoredList.add(new ScoredProduct(p, score));
            }
        }

        scoredList.sort((a, b) -> Integer.compare(b.score(), a.score()));
        return scoredList;
    }

    public static boolean mentionsRegisteredSku(String rawText, List<Product> products) {
        String upper = rawText.toUpperCase();
        String cleanText = clean(rawText);
        return products.stream().anyMatch(p -> p.sku() != null
                && (upper.contains(p.sku().toUpperCase()) || cleanText.contains(clean(p.sku()))));
    }

    public static boolean hasExplicitSkuPattern(String rawText) {
        return BRACKET.matcher(rawText).find() || EXPLICIT.matcher(rawText).find();
    }

    public static Optional<Product> bySku(List<Product> products, String sku) {
        if (sku == null) return Optional.empty();
        return products.stream().filter(p -> sku.equalsIgnoreCase(p.sku())).findFirst();
    }
}
