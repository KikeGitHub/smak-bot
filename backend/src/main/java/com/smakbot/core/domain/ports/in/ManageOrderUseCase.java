package com.smakbot.core.domain.ports.in;

import com.smakbot.core.domain.model.Order;
import com.smakbot.core.domain.model.OrderStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Gestión y consulta de pedidos (backoffice + rastreo público). */
public interface ManageOrderUseCase {

    List<Order> listOrders(String tenantId);

    Optional<Order> findByNumberOrTracking(String tenantId, String code);

    Order updateStatus(String tenantId, UUID orderId, OrderStatus status, String trackingNumber, String carrier);

    Order updateStatus(String tenantId, UUID orderId, OrderStatus status, String trackingNumber, String carrier, String cancellationReason);
}
