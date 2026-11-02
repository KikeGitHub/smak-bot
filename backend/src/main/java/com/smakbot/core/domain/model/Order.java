package com.smakbot.core.domain.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/** Pedido confirmado y persistido. */
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
        OffsetDateTime createdAt
) {
    public static Order fromDraft(String tenantId, CheckoutDraft d) {
        return new Order(
                null, tenantId, d.orderNumber, d.effectiveRecipient(), d.phone, d.address,
                d.location != null ? d.location.lat() : null,
                d.location != null ? d.location.lng() : null,
                d.location != null ? d.location.resolvedMapUrl() : null,
                d.productSku, d.productName, d.quantity, d.unitPrice, d.total,
                OrderStatus.PENDIENTE, d.requiresInvoice, d.rtn, d.businessName,
                null, "Cargo Expreso", null
        );
    }

    public Order withStatus(OrderStatus newStatus, String newTracking, String newCarrier) {
        return new Order(id, tenantId, orderNumber, customerName, customerPhone, deliveryAddress,
                gpsLatitude, gpsLongitude, gpsMapUrl, productSku, productName, quantity, unitPrice, total,
                newStatus, requiresInvoice, rtn, businessName,
                newTracking != null ? newTracking : trackingNumber,
                newCarrier != null ? newCarrier : trackingCarrier,
                createdAt);
    }
}
