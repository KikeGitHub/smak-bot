package com.smakbot.core.domain.model;

/**
 * Evento inmutable de auditoría y trazabilidad de un pedido.
 */
public record OrderAuditEvent(
        String action,
        String status,
        String timestamp,
        String note
) {}

