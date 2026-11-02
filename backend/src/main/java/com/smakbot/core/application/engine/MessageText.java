package com.smakbot.core.application.engine;

import java.util.List;

/** Texto entrante pre-procesado una sola vez por mensaje. */
public record MessageText(String raw, String clean, List<String> tokens) {

    public static MessageText of(String raw) {
        String r = raw == null ? "" : raw.trim();
        return new MessageText(r, TextNormalizer.clean(r), TextNormalizer.tokenize(r));
    }

    public boolean has(String fragment) {
        return clean.contains(fragment);
    }

    public boolean hasAny(String... fragments) {
        return TextNormalizer.containsAny(clean, fragments);
    }

    public boolean hasAny(List<String> fragments) {
        return TextNormalizer.containsAny(clean, fragments);
    }

    public boolean token(String... words) {
        return TextNormalizer.anyToken(tokens, words);
    }

    public boolean isQuestion() {
        return raw.contains("?") || raw.contains("¿");
    }
}
