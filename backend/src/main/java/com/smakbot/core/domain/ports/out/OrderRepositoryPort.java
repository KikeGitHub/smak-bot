package com.smakbot.core.domain.ports.out;

import com.smakbot.core.domain.model.Order;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepositoryPort {

    Order save(Order order);

    List<Order> findByTenant(String tenantId);

    Optional<Order> findById(String tenantId, UUID id);

    /** Busca por número de pedido (SMAK-ORD-1001) o guía de rastreo (CAEX-...), sin distinguir mayúsculas. */
    Optional<Order> findByNumberOrTracking(String tenantId, String code);

    /** Busca órdenes recientes pertenecientes a un cliente (por sesión/WhatsApp o teléfono). */
    List<Order> findRecentForCustomer(String tenantId, String sourceSessionId, String phoneDigits);

    long countByTenant(String tenantId);

    boolean existsByOrderNumber(String orderNumber);
}
