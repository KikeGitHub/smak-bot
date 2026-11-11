package com.smakbot.core.infrastructure.adapter.in.web;

import com.smakbot.core.domain.model.Order;
import com.smakbot.core.domain.model.OrderStatus;
import com.smakbot.core.domain.ports.in.ManageOrderUseCase;
import com.smakbot.core.infrastructure.adapter.in.web.dto.AdminOrderDto;
import com.smakbot.core.infrastructure.adapter.in.web.dto.UpdateOrderStatusRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/orders")
@Tag(name = "Admin Order Management", description = "Gestión multitenant de pedidos comerciales y guías de envío CAEX")
public class AdminOrderController {

    private final ManageOrderUseCase manageOrderUseCase;

    public AdminOrderController(ManageOrderUseCase manageOrderUseCase) {
        this.manageOrderUseCase = manageOrderUseCase;
    }

    @GetMapping
    @Operation(summary = "Listar pedidos del tenant",
               description = "Obtiene los pedidos registrados en PostgreSQL para el panel administrativo")
    public ResponseEntity<List<AdminOrderDto>> listOrders(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {

        List<Order> orders = manageOrderUseCase.listOrders(tenantId);
        List<AdminOrderDto> dtos = orders.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Actualizar estado, guía o cancelación de pedido",
               description = "Permite cambiar el estado de la orden, asignar número de guía CAEX o registrar cancelación con motivo")
    public ResponseEntity<AdminOrderDto> updateStatus(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @PathVariable("id") UUID id,
            @RequestBody UpdateOrderStatusRequest request) {

        OrderStatus newStatus = null;
        if (request.getStatus() != null) {
            try {
                newStatus = OrderStatus.valueOf(request.getStatus().toUpperCase());
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().build();
            }
        }

        Order updated = manageOrderUseCase.updateStatus(
                tenantId,
                id,
                newStatus,
                request.getTrackingNumber(),
                request.getTrackingCarrier(),
                request.getCancellationReason()
        );

        return ResponseEntity.ok(mapToDto(updated));
    }

    private AdminOrderDto mapToDto(Order o) {
        AdminOrderDto dto = new AdminOrderDto();
        dto.setId(o.id());
        dto.setTenantId(o.tenantId());
        dto.setOrderNumber(o.orderNumber());
        dto.setCustomerName(o.customerName());
        dto.setCustomerPhone(o.customerPhone());
        dto.setDeliveryAddress(o.deliveryAddress());
        dto.setGpsLatitude(o.gpsLatitude());
        dto.setGpsLongitude(o.gpsLongitude());
        dto.setGpsMapUrl(o.gpsMapUrl());
        dto.setProductSku(o.productSku());
        dto.setProductName(o.productName());
        dto.setQuantity(o.quantity());
        dto.setUnitPrice(o.unitPrice());
        dto.setTotal(o.total());
        dto.setStatus(o.status() != null ? o.status().name() : null);
        dto.setRequiresInvoice(o.requiresInvoice());
        dto.setRtn(o.rtn());
        dto.setBusinessName(o.businessName());
        dto.setTrackingNumber(o.trackingNumber());
        dto.setTrackingCarrier(o.trackingCarrier());
        dto.setSourceChannel(o.sourceChannel());
        dto.setSourceSessionId(o.sourceSessionId());
        dto.setClientIp(o.clientIp());
        dto.setCancellationReason(o.cancellationReason());
        dto.setCancelledBy(o.cancelledBy());
        dto.setCancelledAt(o.cancelledAt() != null ? o.cancelledAt().toInstant() : null);
        dto.setCreatedAt(o.createdAt() != null ? o.createdAt().toInstant() : null);

        String sourceLabel = (o.sourceChannel() != null ? o.sourceChannel() : "WEB")
                + (o.sourceSessionId() != null && !o.sourceSessionId().isBlank() ? " (" + o.sourceSessionId() + ")" : "");
        dto.setAudit(new AdminOrderDto.AuditDto(
                o.clientIp() != null ? o.clientIp() : "No registrada",
                o.sourceSessionId(),
                sourceLabel,
                o.createdAt() != null ? o.createdAt().toInstant() : null,
                o.auditHistory()
        ));
        return dto;
    }
}
