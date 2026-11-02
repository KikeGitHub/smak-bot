package com.smakbot.core.application.service;

import com.smakbot.core.domain.exception.ResourceNotFoundException;
import com.smakbot.core.domain.model.Order;
import com.smakbot.core.domain.model.OrderStatus;
import com.smakbot.core.domain.ports.in.ManageOrderUseCase;
import com.smakbot.core.domain.ports.out.OrderRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService implements ManageOrderUseCase {

    private final OrderRepositoryPort orderRepo;

    public OrderService(OrderRepositoryPort orderRepo) {
        this.orderRepo = orderRepo;
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
        Order existing = orderRepo.findById(tenantId, orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + orderId));
        Order updated = existing.withStatus(status, trackingNumber, carrier);
        return orderRepo.save(updated);
    }
}
