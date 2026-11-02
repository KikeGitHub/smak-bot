package com.smakbot.core.domain.model;

import java.util.List;

/**
 * Respuesta del motor conversacional, agnóstica de canal.
 *
 * @param text           texto con markdown ligero (**negrita**, [link](url)) como en el Oráculo
 * @param step           estado de la conversación tras procesar el mensaje
 * @param product        producto en contexto (si aplica)
 * @param images         imágenes a mostrar
 * @param orderDraft     resumen de pedido pendiente de confirmar (paso CONFIRM)
 * @param confirmedOrder pedido recién persistido
 * @param location       ubicación registrada (eco para el cliente)
 * @param human          true si la conversación quedó con un asesor humano
 */
public record BotReply(
        String text,
        CheckoutStep step,
        Product product,
        List<String> images,
        CheckoutDraft orderDraft,
        Order confirmedOrder,
        GeoLocation location,
        boolean human
) {
    public BotReply {
        images = images == null ? List.of() : List.copyOf(images);
    }

    public static Builder text(String text) {
        return new Builder(text);
    }

    public static final class Builder {
        private final String text;
        private Product product;
        private List<String> images = List.of();
        private CheckoutDraft orderDraft;
        private Order confirmedOrder;
        private GeoLocation location;
        private boolean human;

        private Builder(String text) { this.text = text; }

        public Builder product(Product p) { this.product = p; return this; }
        public Builder images(List<String> i) { this.images = i; return this; }
        public Builder orderDraft(CheckoutDraft d) { this.orderDraft = d; return this; }
        public Builder confirmedOrder(Order o) { this.confirmedOrder = o; return this; }
        public Builder location(GeoLocation l) { this.location = l; return this; }
        public Builder human(boolean h) { this.human = h; return this; }

        public BotReply build(CheckoutStep step) {
            return new BotReply(text, step, product, images, orderDraft, confirmedOrder, location, human);
        }
    }
}
