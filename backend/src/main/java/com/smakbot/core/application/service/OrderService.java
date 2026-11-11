package com.smakbot.core.application.service;

import com.smakbot.core.domain.exception.BusinessRuleException;
import com.smakbot.core.domain.exception.ResourceNotFoundException;
import com.smakbot.core.domain.model.Order;
import com.smakbot.core.domain.model.OrderStatus;
import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.ports.in.ManageOrderUseCase;
import com.smakbot.core.domain.ports.out.OrderRepositoryPort;
import com.smakbot.core.domain.ports.out.ProductRepositoryPort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService implements ManageOrderUseCase {

    private final OrderRepositoryPort orderRepo;
    private final ProductRepositoryPort productRepo;

    @Autowired
    public OrderService(OrderRepositoryPort orderRepo, ProductRepositoryPort productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    public OrderService(OrderRepositoryPort orderRepo) {
        this(orderRepo, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> listOrders(String tenantId) {
        return orderRepo.findByTenant(tenantId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Order> findByNumberOrTracking(String tenantId, String code) {
        return orderRepo.findByNumberOrTracking(tenantId, code);
    }

    @Override
    @Transactional
    public Order updateStatus(String tenantId, UUID orderId, OrderStatus status, String trackingNumber, String carrier) {
        return updateStatus(tenantId, orderId, status, trackingNumber, carrier, null);
    }

    @Override
    @Transactional
    public Order updateStatus(
            String tenantId,
            UUID orderId,
            OrderStatus status,
            String trackingNumber,
            String carrier,
            String cancellationReason
    ) {
        Order existing = orderRepo.findById(tenantId, orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + orderId));

        if (status == OrderStatus.CANCELADO && (cancellationReason == null || cancellationReason.trim().length() < 4)) {
            throw new BusinessRuleException("El motivo de cancelación es obligatorio para cancelar un pedido.");
        }

        // Si se cancela desde estado PENDIENTE o EN_CAMINO, reponer inventario en BD
        if (status == OrderStatus.CANCELADO
                && existing.status() != OrderStatus.CANCELADO
                && existing.status() != OrderStatus.ENTREGADO
                && productRepo != null
                && existing.productSku() != null) {
            productRepo.findActiveByTenant(tenantId).stream()
                    .filter(p -> existing.productSku().equalsIgnoreCase(p.sku()))
                    .findFirst()
                    .ifPresent(prod -> {
                        Product restored = prod.withStock(prod.stock() + existing.quantity());
                        productRepo.save(restored);
                    });
        }

        Order updated = existing.withStatusUpdate(status, trackingNumber, carrier, cancellationReason, "ADMIN");
        return orderRepo.save(updated);
    }
}
