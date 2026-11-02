package com.smakbot.core.domain.model;

/** Mensaje entrante agnóstico de canal (WhatsApp o Web). */
public record IncomingMessage(
        String tenantId,
        Channel channel,
        String customerId,
        String text,
        GeoLocation location
) {
    public IncomingMessage {
        text = text == null ? "" : text;
    }

    public String sessionId() {
        return ChatSession.buildId(tenantId, channel, customerId);
    }
}
