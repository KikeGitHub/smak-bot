package com.smakbot.core.application.engine;

import com.smakbot.core.domain.model.Product;

import java.util.List;

/** Respuesta intermedia de los componentes del motor (antes de anexar estado de sesión). */
public record Answer(String text, Product product, List<String> images) {

    public Answer {
        images = images == null ? List.of() : images;
    }

    public static Answer of(String text) {
        return new Answer(text, null, List.of());
    }

    public static Answer of(String text, Product product) {
        return new Answer(text, product, List.of());
    }

    public static Answer withImages(String text, Product product, List<String> images) {
        return new Answer(text, product, images);
    }
}
