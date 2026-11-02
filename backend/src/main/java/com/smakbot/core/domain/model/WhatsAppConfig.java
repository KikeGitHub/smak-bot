package com.smakbot.core.domain.model;

/** Credenciales de WhatsApp Cloud API de un tenant. */
public record WhatsAppConfig(
        String tenantId,
        String phoneNumberId,
        String wabaId,
        String accessToken,
        String verifyToken,
        String appSecret
) {
}
