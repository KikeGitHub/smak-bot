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

    private ProductMatcher() {
    }

    public static Optional<Match> extract(String rawText, List<Product> products) {
        if (rawText == null || rawText.isBlank() || products.isEmpty()) return Optional.empty();

        Matcher bracket = BRACKET.matcher(rawText);
        if (bracket.find()) {
            Optional<Product> found = bySku(products, bracket.group(1).trim());
            if (found.isPresent()) return Optional.of(new Match(found.get(), true));
        }

        Matcher explicit = EXPLICIT.matcher(rawText);
        if (explicit.find()) {
            Optional<Product> found = bySku(products, explicit.group(1).trim());
            if (found.isPresent()) return Optional.of(new Match(found.get(), true));
        }

        String upper = rawText.toUpperCase();
        Optional<Product> skuHit = products.stream()
                .filter(p -> p.sku() != null && upper.contains(p.sku().toUpperCase()))
                .max(java.util.Comparator.comparingInt(p -> p.sku().length()));
        if (skuHit.isPresent()) {
            return Optional.of(new Match(skuHit.get(), false));
        }

        String cleanMsg = clean(rawText);
        List<String> msgTokens = tokenize(cleanMsg);
        for (Product p : products) {
            String pClean = clean(p.name());
            if (!pClean.isEmpty() && (cleanMsg.contains(pClean) || matchPhrase(cleanMsg, msgTokens, pClean))) {
                return Optional.of(new Match(p, false));
            }
            boolean keywordHit = p.keywords().stream()
                    .map(TextNormalizer::clean)
                    .filter(k -> !GENERIC_ATTR_WORDS.contains(k) && k.length() > 2)
                    .anyMatch(cleanMsg::contains);
            if (keywordHit) return Optional.of(new Match(p, false));
        }
        return Optional.empty();
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
