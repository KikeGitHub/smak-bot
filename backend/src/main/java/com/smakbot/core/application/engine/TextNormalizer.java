package com.smakbot.core.application.engine;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Normalización de texto en español. Port 1:1 de {@code clean}, {@code tokenize}, {@code stemSpanish}
 * y {@code matchPhrase} del Oráculo (js/bot-engine.js) para mantener paridad de comportamiento.
 */
public final class TextNormalizer {

    private static final Locale ES = Locale.forLanguageTag("es");
    private static final Pattern DIACRITICS = Pattern.compile("[\\u0300-\\u036f]");
    private static final Pattern PUNCT = Pattern.compile("[¿?¡!.,:;()\"'\\\\/]");
    private static final Pattern SPACES = Pattern.compile("\\s+");

    private static final Set<String> STOP_WORDS = Set.of(
            "de", "la", "el", "los", "las", "un", "una", "unos", "unas", "es", "son", "lo", "en", "por", "que",
            "se", "me", "te", "le", "y", "o", "al", "del", "a", "con", "para", "como", "si", "su", "sus", "mi",
            "mis", "tu", "tus");

    private static final java.util.Map<Pattern, String> TYPO_REPLACEMENTS = java.util.Map.ofEntries(
            // Abreviaciones de chat / SMS comunes en Honduras
            java.util.Map.entry(Pattern.compile("\\b[qk]\\b"), "que"),
            java.util.Map.entry(Pattern.compile("\\bke\\b"), "que"),
            java.util.Map.entry(Pattern.compile("\\bkhe\\b"), "que"),
            java.util.Map.entry(Pattern.compile("\\bd\\b"), "de"),
            java.util.Map.entry(Pattern.compile("\\bx\\b"), "por"),
            java.util.Map.entry(Pattern.compile("\\bxfa(?:vor)?\\b"), "por favor"),
            java.util.Map.entry(Pattern.compile("\\bpq\\b"), "porque"),
            java.util.Map.entry(Pattern.compile("\\btmb\\b"), "tambien"),
            java.util.Map.entry(Pattern.compile("\\btbn\\b"), "tambien"),
            java.util.Map.entry(Pattern.compile("\\b[kq]ier[oa](s)?\\b"), "quiero$1"),
            java.util.Map.entry(Pattern.compile("\\b[kq]er[oa](s)?\\b"), "quiero$1"),

            // Fonética y yeísmo de Sillas y Mobiliario (ej. "sia", "cia", "siya", "ciya" -> "silla")
            java.util.Map.entry(Pattern.compile("\\b(?:[sc]i[ay]s?|cias?|siyitas?|silletas?)\\b"), "silla"),
            java.util.Map.entry(Pattern.compile("\\b(?:[sc]iy[oó]n(?:es)?|ciy[oó]n(?:es)?)\\b"), "sillon"),
            java.util.Map.entry(Pattern.compile("\\bbutacas?\\b"), "silla"),
            java.util.Map.entry(Pattern.compile("\\bto[li]k[sz]?\\b"), "tolix"),
            java.util.Map.entry(Pattern.compile("\\btolis\\b"), "tolix"),
            java.util.Map.entry(Pattern.compile("\\bbanquit[ao]s?\\b"), "banco"),
            java.util.Map.entry(Pattern.compile("\\bbanquetas?\\b"), "banco"),

            // Cocina y baño
            java.util.Map.entry(Pattern.compile("\\blavaplatos?\\b"), "lavatrastos"),
            java.util.Map.entry(Pattern.compile("\\blavatrastes?\\b"), "lavatrastos"),
            java.util.Map.entry(Pattern.compile("\\bfregador(?:a|es)?\\b"), "fregadero"),
            java.util.Map.entry(Pattern.compile("\\btarjas?\\b"), "lavatrastos"),
            java.util.Map.entry(Pattern.compile("\\bpocetas?\\b"), "lavatrastos"),
            java.util.Map.entry(Pattern.compile("\\bmonomandos?\\b"), "monocomando"),

            // Gaming / Ergonomía / Oficina
            java.util.Map.entry(Pattern.compile("\\bge[yi]mer\\b"), "gamer"),
            java.util.Map.entry(Pattern.compile("\\bgueimer\\b"), "gamer"),
            java.util.Map.entry(Pattern.compile("\\byeymer\\b"), "gamer"),
            java.util.Map.entry(Pattern.compile("\\berconomic[ao]s?\\b"), "ergonomica"),
            java.util.Map.entry(Pattern.compile("\\bergonomic[ao]s?\\b"), "ergonomica"),
            java.util.Map.entry(Pattern.compile("\\bejecutiv[ao]s?\\b"), "ejecutiva"),

            // Carga y Jardín
            java.util.Map.entry(Pattern.compile("\\bcolumpios?\\b"), "hamaca"),
            java.util.Map.entry(Pattern.compile("\\bmecedoras?\\b"), "hamaca"),
            java.util.Map.entry(Pattern.compile("\\bdiablitos?\\b"), "carro de carga"),
            java.util.Map.entry(Pattern.compile("\\bcarretas?\\b"), "carretilla"),

            // Fonética de Precios, medidas y verbos hondureños
            java.util.Map.entry(Pattern.compile("\\bpre[sz]io(s)?\\b"), "precio$1"),
            java.util.Map.entry(Pattern.compile("\\bcuamto(s)?\\b"), "cuanto$1"),
            java.util.Map.entry(Pattern.compile("\\bresistens(?:ia|ias)?\\b"), "resistencia"),
            java.util.Map.entry(Pattern.compile("\\bgartis\\b"), "gratis"),
            java.util.Map.entry(Pattern.compile("\\bdimencion(es)?\\b"), "dimension$1"),
            java.util.Map.entry(Pattern.compile("\\benbio(s)?\\b"), "envio$1"),
            java.util.Map.entry(Pattern.compile("\\bconprar\\b"), "comprar"),
            java.util.Map.entry(Pattern.compile("\\bhorden\\b"), "orden"),
            java.util.Map.entry(Pattern.compile("\\btamanyo\\b"), "tamano"),
            java.util.Map.entry(Pattern.compile("\\bcolorez\\b"), "colores"),
            java.util.Map.entry(Pattern.compile("\\bdisponivle\\b"), "disponible"),
            java.util.Map.entry(Pattern.compile("\\bexistensia\\b"), "existencia"),
            java.util.Map.entry(Pattern.compile("\\bnesesit[oó]\\b"), "necesito"),
            java.util.Map.entry(Pattern.compile("\\bnesecit[oó]\\b"), "necesito"),
            java.util.Map.entry(Pattern.compile("\\bocupo\\b"), "necesito"),
            java.util.Map.entry(Pattern.compile("\\bwuen(?:as|os)?\\b"), "buenas"),
            java.util.Map.entry(Pattern.compile("\\bwen(?:as|os)?\\b"), "buenas")
    );

    private TextNormalizer() {
    }

    /**
     * Calcula la distancia de Levenshtein entre dos cadenas de texto.
     */
    public static int levenshteinDistance(String a, String b) {
        if (a == null) a = "";
        if (b == null) b = "";
        int[] costs = new int[b.length() + 1];
        for (int j = 0; j < costs.length; j++) costs[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            costs[0] = i;
            int nw = i - 1;
            for (int j = 1; j <= b.length(); j++) {
                int cj = Math.min(1 + Math.min(costs[j], costs[j - 1]),
                        a.charAt(i - 1) == b.charAt(j - 1) ? nw : nw + 1);
                nw = costs[j];
                costs[j] = cj;
            }
        }
        return costs[b.length()];
    }

    /**
     * Retorna la similitud métrica entre 0.0 y 1.0 basada en Levenshtein.
     */
    public static double similarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        String a = clean(s1);
        String b = clean(s2);
        if (a.equals(b)) return 1.0;
        int maxLen = Math.max(a.length(), b.length());
        if (maxLen == 0) return 1.0;
        int dist = levenshteinDistance(a, b);
        return 1.0 - ((double) dist / maxLen);
    }

    public static String clean(String s) {
        if (s == null) return "";
        String lower = s.toLowerCase(ES);
        String nfd = Normalizer.normalize(lower, Normalizer.Form.NFD);
        String noDiacritics = DIACRITICS.matcher(nfd).replaceAll("");
        String cleaned = PUNCT.matcher(noDiacritics).replaceAll(" ").trim();
        for (java.util.Map.Entry<Pattern, String> entry : TYPO_REPLACEMENTS.entrySet()) {
            cleaned = entry.getKey().matcher(cleaned).replaceAll(entry.getValue());
        }
        return cleaned;
    }

    public static List<String> tokenize(String s) {
        String c = clean(s);
        if (c.isEmpty()) return List.of();
        return Arrays.stream(SPACES.split(c)).filter(t -> !t.isEmpty()).toList();
    }

    public static String stem(String w) {
        String s = w == null ? "" : w.trim();
        if (s.endsWith("es") && s.length() > 4) s = s.substring(0, s.length() - 2);
        else if (s.endsWith("s") && s.length() > 3) s = s.substring(0, s.length() - 1);
        if ((s.endsWith("a") || s.endsWith("o")) && s.length() > 4) {
            s = s.substring(0, s.length() - 1);
        }
        return s;
    }

    /** Coincidencia flexible: ≥75% de las palabras sustantivas de la frase presentes (con singular/plural). */
    public static boolean matchPhrase(String cleanInput, List<String> inTokens, String phrase) {
        String cPhrase = clean(phrase);
        if (cPhrase.isEmpty()) return false;
        if (cleanInput.contains(cPhrase)) return true;

        List<String> phraseTokens = tokenize(cPhrase);
        if (phraseTokens.isEmpty()) return false;
        List<String> substantive = phraseTokens.stream()
                .filter(t -> !STOP_WORDS.contains(t) && t.length() > 2).toList();
        List<String> target = substantive.isEmpty() ? phraseTokens : substantive;

        long matched = target.stream()
                .filter(pt -> inTokens.stream().anyMatch(it -> it.equals(pt) || stem(it).equals(stem(pt))))
                .count();
        return ((double) matched / target.size()) >= 0.75;
    }

    public static boolean containsAny(String text, String... needles) {
        for (String n : needles) {
            if (text.contains(n)) return true;
        }
        return false;
    }

    public static boolean containsAny(String text, List<String> needles) {
        for (String n : needles) {
            if (text.contains(n)) return true;
        }
        return false;
    }

    public static boolean anyToken(List<String> tokens, String... words) {
        for (String w : words) {
            if (tokens.contains(w)) return true;
        }
        return false;
    }
}
