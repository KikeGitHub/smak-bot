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

    private TextNormalizer() {
    }

    public static String clean(String s) {
        if (s == null) return "";
        String lower = s.toLowerCase(ES);
        String nfd = Normalizer.normalize(lower, Normalizer.Form.NFD);
        String noDiacritics = DIACRITICS.matcher(nfd).replaceAll("");
        return PUNCT.matcher(noDiacritics).replaceAll(" ").trim();
    }

    public static List<String> tokenize(String s) {
        String c = clean(s);
        if (c.isEmpty()) return List.of();
        return Arrays.stream(SPACES.split(c)).filter(t -> !t.isEmpty()).toList();
    }

    public static String stem(String w) {
        String s = w == null ? "" : w.trim();
        if (s.endsWith("es") && s.length() > 4) return s.substring(0, s.length() - 2);
        if (s.endsWith("s") && s.length() > 3) return s.substring(0, s.length() - 1);
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
