package com.smakbot.core.infrastructure.persistence.adapter;

import com.smakbot.core.domain.model.Order;
import com.smakbot.core.domain.model.OrderStatus;
import com.smakbot.core.domain.ports.out.OrderRepositoryPort;
import com.smakbot.core.infrastructure.persistence.entity.OrderEntity;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataOrderRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class OrderJpaAdapter implements OrderRepositoryPort {

    private final SpringDataOrderRepository repo;

    public OrderJpaAdapter(SpringDataOrderRepository repo) {
        this.repo = repo;
    }

    @Override
    public Order save(Order o) {
        OrderEntity entity = (o.id() != null)
                ? repo.findById(o.id()).orElseGet(OrderEntity::new)
                : new OrderEntity();

        entity.setTenantId(o.tenantId());
        entity.setOrderNumber(o.orderNumber());
        entity.setCustomerName(o.customerName());
        entity.setCustomerPhone(o.customerPhone());
        entity.setDeliveryAddress(o.deliveryAddress());
        entity.setGpsLatitude(o.gpsLatitude());
        entity.setGpsLongitude(o.gpsLongitude());
        entity.setGpsMapUrl(o.gpsMapUrl());
        entity.setProductSku(o.productSku());
        entity.setProductName(o.productName());
        entity.setQuantity(o.quantity());
        entity.setUnitPrice(o.unitPrice());
        entity.setTotal(o.total());
        entity.setStatus(o.status() != null ? o.status().name() : OrderStatus.PENDIENTE.name());
        entity.setRequiresInvoice(o.requiresInvoice());
        entity.setRtn(o.rtn());
        entity.setBusinessName(o.businessName());
        entity.setTrackingNumber(o.trackingNumber());
        entity.setTrackingCarrier(o.trackingCarrier() != null ? o.trackingCarrier() : "Cargo Expreso");
        entity.setSourceChannel(o.sourceChannel() != null ? o.sourceChannel() : "WEB");
        entity.setSourceSessionId(o.sourceSessionId());
        entity.setClientIp(o.clientIp());
        entity.setCancellationReason(o.cancellationReason());
        entity.setCancelledBy(o.cancelledBy());
        entity.setCancelledAt(o.cancelledAt());
        entity.setAuditHistory(o.auditHistory() != null ? new ArrayList<>(o.auditHistory()) : new ArrayList<>());

        OrderEntity saved = repo.save(entity);
        return toDomain(saved);
    }

    @Override
    public List<Order> findByTenant(String tenantId) {
        return repo.findByTenantIdOrderByCreatedAtDesc(tenantId).stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Order> findById(String tenantId, UUID id) {
        return repo.findByTenantIdAndId(tenantId, id).map(this::toDomain);
    }

    @Override
    public Optional<Order> findByNumberOrTracking(String tenantId, String code) {
        return repo.findByTenantIdAndNumberOrTracking(tenantId, code).map(this::toDomain);
    }

    @Override
    public List<Order> findRecentForCustomer(String tenantId, String sourceSessionId, String phoneDigits) {
        String cleanSession = sourceSessionId != null ? sourceSessionId.trim() : "";
        String cleanPhone = phoneDigits != null ? phoneDigits.replaceAll("\\D", "") : "";
        if (cleanPhone.length() > 8) {
            cleanPhone = cleanPhone.substring(cleanPhone.length() - 8);
        }
        if (cleanSession.isBlank() && cleanPhone.length() < 8) {
            return List.of();
        }
        return repo.findRecentForCustomer(tenantId, cleanSession, cleanPhone).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public long countByTenant(String tenantId) {
        return repo.countByTenantId(tenantId);
    }

    @Override
    public boolean existsByOrderNumber(String orderNumber) {
        return repo.existsByOrderNumber(orderNumber);
    }

    private Order toDomain(OrderEntity e) {
        OrderStatus st;
        try {
            st = e.getStatus() != null ? OrderStatus.valueOf(e.getStatus()) : OrderStatus.PENDIENTE;
        } catch (IllegalArgumentException ex) {
            st = OrderStatus.PENDIENTE;
        }

        return new Order(
                e.getId(), e.getTenantId(), e.getOrderNumber(), e.getCustomerName(), e.getCustomerPhone(),
                e.getDeliveryAddress(), e.getGpsLatitude(), e.getGpsLongitude(), e.getGpsMapUrl(),
                e.getProductSku(), e.getProductName(), e.getQuantity(), e.getUnitPrice(), e.getTotal(),
                st, e.isRequiresInvoice(), e.getRtn(), e.getBusinessName(),
                e.getTrackingNumber(), e.getTrackingCarrier(), e.getCreatedAt(),
                e.getSourceChannel(), e.getSourceSessionId(), e.getClientIp(),
                e.getCancellationReason(), e.getCancelledBy(), e.getCancelledAt(),
                e.getAuditHistory() != null ? List.copyOf(e.getAuditHistory()) : List.of()
        );
    }
}
