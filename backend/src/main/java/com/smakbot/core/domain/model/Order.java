package com.smakbot.core.domain.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/** Pedido confirmado (o cancelado con trazabilidad) persistido en PostgreSQL. */
public record Order(
        UUID id,
        String tenantId,
        String orderNumber,
        String customerName,
        String customerPhone,
        String deliveryAddress,
        Double gpsLatitude,
        Double gpsLongitude,
        String gpsMapUrl,
        String productSku,
        String productName,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal total,
        OrderStatus status,
        boolean requiresInvoice,
        String rtn,
        String businessName,
        String trackingNumber,
        String trackingCarrier,
        OffsetDateTime createdAt,
        String sourceChannel,
        String sourceSessionId,
        String clientIp,
        String cancellationReason,
        String cancelledBy,
        OffsetDateTime cancelledAt,
        List<OrderAuditEvent> auditHistory
) {
    public static Order fromDraft(String tenantId, CheckoutDraft d) {
        return fromDraft(tenantId, d, "WEB", null, null);
    }

    public static Order fromDraft(
            String tenantId,
            CheckoutDraft d,
            String sourceChannel,
            String sourceSessionId,
            String clientIp
    ) {
        String channelLabel = (sourceChannel != null && !sourceChannel.isBlank()) ? sourceChannel : "WEB";
        String invoiceNote = d.requiresInvoice
                ? "Factura RTN: " + d.rtn + (d.businessName != null ? " (" + d.businessName + ")" : "")
                : "Consumidor Final";
        String initNote = "Pedido registrado en BD · Teléfono cliente: " + d.phone
                + " · Entrega: " + d.address
                + " · " + invoiceNote;

        List<OrderAuditEvent> events = List.of(new OrderAuditEvent(
                "CREATED",
                OrderStatus.PENDIENTE.name(),
                Instant.now().toString(),
                initNote
        ));

        return new Order(
                null, tenantId, d.orderNumber, d.effectiveRecipient(), d.phone, d.address,
                d.location != null ? d.location.lat() : null,
                d.location != null ? d.location.lng() : null,
                d.location != null ? d.location.resolvedMapUrl() : null,
                d.productSku, d.productName, d.quantity, d.unitPrice, d.total,
                OrderStatus.PENDIENTE, d.requiresInvoice, d.rtn, d.businessName,
                null, "Cargo Expreso", null,
                channelLabel, sourceSessionId, clientIp,
                null, null, null, events
        );
    }

    public static Order cancelledFromDraft(
            String tenantId,
            CheckoutDraft d,
            String sourceChannel,
            String sourceSessionId,
            String clientIp,
            String cancellationReason
    ) {
        String channelLabel = (sourceChannel != null && !sourceChannel.isBlank()) ? sourceChannel : "WEB";
        String reason = (cancellationReason != null && !cancellationReason.isBlank())
                ? cancellationReason.trim()
                : "Cancelado por el cliente antes de despachar";
        OffsetDateTime now = OffsetDateTime.now();

        List<OrderAuditEvent> events = List.of(new OrderAuditEvent(
                "CANCELLED",
                OrderStatus.CANCELADO.name(),
                Instant.now().toString(),
                "Pedido cancelado en checkout · Teléfono cliente: " + d.phone + " · Motivo: " + reason
        ));

        return new Order(
                null, tenantId, d.orderNumber, d.effectiveRecipient(), d.phone, d.address,
                d.location != null ? d.location.lat() : null,
                d.location != null ? d.location.lng() : null,
                d.location != null ? d.location.resolvedMapUrl() : null,
                d.productSku, d.productName, d.quantity, d.unitPrice, d.total,
                OrderStatus.CANCELADO, d.requiresInvoice, d.rtn, d.businessName,
                null, "Cargo Expreso", null,
                channelLabel, sourceSessionId, clientIp,
                reason, "CLIENTE (" + channelLabel + ")", now, events
        );
    }

    public Order withStatus(OrderStatus newStatus, String newTracking, String newCarrier) {
        return withStatusUpdate(newStatus, newTracking, newCarrier, null, "ADMIN");
    }

    public Order withStatusUpdate(
            OrderStatus newStatus,
            String newTracking,
            String newCarrier,
            String newCancellationReason,
            String actor
    ) {
        OrderStatus effectiveStatus = newStatus != null ? newStatus : this.status;
        String effectiveTracking = (newTracking != null && !newTracking.isBlank()) ? newTracking.trim() : trackingNumber;
        String effectiveCarrier = (newCarrier != null && !newCarrier.isBlank()) ? newCarrier.trim() : trackingCarrier;

        String effectiveReason = cancellationReason;
        String effectiveCancelledBy = cancelledBy;
        OffsetDateTime effectiveCancelledAt = cancelledAt;

        if (effectiveStatus == OrderStatus.CANCELADO) {
            if (newCancellationReason != null && !newCancellationReason.isBlank()) {
                effectiveReason = newCancellationReason.trim();
            }
            if (effectiveCancelledBy == null || (actor != null && !actor.isBlank())) {
                effectiveCancelledBy = (actor != null && !actor.isBlank()) ? actor : "ADMIN";
            }
            if (effectiveCancelledAt == null) {
                effectiveCancelledAt = OffsetDateTime.now();
            }
        }

        List<OrderAuditEvent> updatedEvents = auditHistory != null ? new ArrayList<>(auditHistory) : new ArrayList<>();
        StringBuilder note = new StringBuilder();
        note.append("Estado cambiado a ").append(effectiveStatus.name())
                .append(" por ").append(actor != null && !actor.isBlank() ? actor : "SISTEMA");
        if (effectiveTracking != null && !effectiveTracking.isBlank() && effectiveStatus != OrderStatus.CANCELADO) {
            note.append(" · Guía: ").append(effectiveTracking).append(" (").append(effectiveCarrier).append(")");
        }
        if (effectiveStatus == OrderStatus.CANCELADO && effectiveReason != null) {
            note.append(" · Motivo: ").append(effectiveReason);
        }
        updatedEvents.add(new OrderAuditEvent(
                effectiveStatus == OrderStatus.CANCELADO ? "CANCELLED" : "STATUS_UPDATED",
                effectiveStatus.name(),
                Instant.now().toString(),
                note.toString()
        ));

        return new Order(
                id, tenantId, orderNumber, customerName, customerPhone, deliveryAddress,
                gpsLatitude, gpsLongitude, gpsMapUrl, productSku, productName, quantity, unitPrice, total,
                effectiveStatus, requiresInvoice, rtn, businessName,
                effectiveTracking, effectiveCarrier, createdAt,
                sourceChannel, sourceSessionId, clientIp,
                effectiveReason, effectiveCancelledBy, effectiveCancelledAt,
                List.copyOf(updatedEvents)
        );
    }
}
