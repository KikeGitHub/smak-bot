package com.smakbot.core.domain.model;

/** Mensaje entrante agnóstico de canal (WhatsApp o Web) con metadata de auditoría opcional. */
public record IncomingMessage(
        String tenantId,
        Channel channel,
        String customerId,
        String text,
        GeoLocation location,
        String clientIp
) {
    public IncomingMessage {
        text = text == null ? "" : text;
    }

    public IncomingMessage(
            String tenantId,
            Channel channel,
            String customerId,
            String text,
            GeoLocation location
    ) {
        this(tenantId, channel, customerId, text, location, null);
    }

    public String sessionId() {
        return ChatSession.buildId(tenantId, channel, customerId);
    }
}
