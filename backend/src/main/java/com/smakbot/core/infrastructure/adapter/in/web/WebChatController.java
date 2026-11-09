package com.smakbot.core.infrastructure.adapter.in.web;

import com.smakbot.core.domain.model.BotReply;
import com.smakbot.core.domain.model.Channel;
import com.smakbot.core.domain.model.GeoLocation;
import com.smakbot.core.domain.model.IncomingMessage;
import com.smakbot.core.domain.model.Order;
import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.ports.in.ManageOrderUseCase;
import com.smakbot.core.domain.ports.in.ProcessMessageUseCase;
import com.smakbot.core.domain.ports.out.ChatSessionRepositoryPort;
import com.smakbot.core.infrastructure.adapter.in.web.dto.ChatMessageRequest;
import com.smakbot.core.infrastructure.adapter.in.web.dto.ChatMessageResponse;
import com.smakbot.core.infrastructure.adapter.in.web.dto.OrderTrackingResponse;
import com.smakbot.core.infrastructure.adapter.in.web.dto.ResetSessionRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/chat")
@Tag(name = "Web Chat Widget", description = "Endpoints para el widget conversacional integrado en sitios web")
public class WebChatController {

    private final ProcessMessageUseCase processMessageUseCase;
    private final ManageOrderUseCase manageOrderUseCase;
    private final ChatSessionRepositoryPort sessionRepositoryPort;

    public WebChatController(ProcessMessageUseCase processMessageUseCase,
                             ManageOrderUseCase manageOrderUseCase,
                             ChatSessionRepositoryPort sessionRepositoryPort) {
        this.processMessageUseCase = processMessageUseCase;
        this.manageOrderUseCase = manageOrderUseCase;
        this.sessionRepositoryPort = sessionRepositoryPort;
    }

    @PostMapping("/message")
    @Operation(summary = "Procesar mensaje del usuario en el widget web",
               description = "Recibe mensajes de texto o ubicaciones geográficas y retorna la respuesta del motor comercial")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @Parameter(description = "Identificador del comercio / tenant")
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @Parameter(description = "Identificador persistente de la sesión del visitante")
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId,
            @RequestBody ChatMessageRequest request) {

        String effectiveTenantId = (request.getTenantId() != null && !request.getTenantId().isBlank())
                ? request.getTenantId()
                : tenantId;

        String effectiveSessionId = (request.getSessionId() != null && !request.getSessionId().isBlank())
                ? request.getSessionId()
                : ((sessionId != null && !sessionId.isBlank()) ? sessionId : "web-session-" + UUID.randomUUID());

        GeoLocation location = null;
        if (request.getLocation() != null) {
            location = new GeoLocation(
                    request.getLocation().getLat(),
                    request.getLocation().getLng(),
                    request.getLocation().getAddress()
            );
        }

        IncomingMessage incoming = new IncomingMessage(
                effectiveTenantId,
                Channel.WEB,
                effectiveSessionId,
                request.getMessage() != null ? request.getMessage() : "",
                location
        );

        BotReply reply = processMessageUseCase.process(incoming);

        ChatMessageResponse response = mapToResponse(reply);
        return ResponseEntity.ok()
                .header("X-Session-ID", effectiveSessionId)
                .body(response);
    }

    @GetMapping("/tracking/{code}")
    @Operation(summary = "Rastrear pedido",
               description = "Consulta el estado y guía de un pedido por número SMAK-ORD-XXXX o código CAEX-XXXX")
    public ResponseEntity<OrderTrackingResponse> trackOrder(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @PathVariable("code") String code) {

        Optional<Order> orderOpt = manageOrderUseCase.findByNumberOrTracking(tenantId, code);
        return orderOpt.map(order -> ResponseEntity.ok(mapToTrackingResponse(order)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/reset")
    @Operation(summary = "Reiniciar sesión conversacional",
               description = "Limpia el estado y borrador de compra de la sesión actual")
    public ResponseEntity<Void> resetSession(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @RequestHeader("X-Session-ID") String sessionId,
            @RequestBody(required = false) ResetSessionRequest body) {

        String compositeId = tenantId + ":WEB:" + sessionId;
        sessionRepositoryPort.deleteById(compositeId);
        return ResponseEntity.noContent().build();
    }

    private ChatMessageResponse mapToResponse(BotReply reply) {
        ChatMessageResponse.ProductSummaryDto productDto = null;
        if (reply.product() != null) {
            Product p = reply.product();
            String img = (p.images() != null && !p.images().isEmpty()) ? p.images().get(0) : null;
            productDto = new ChatMessageResponse.ProductSummaryDto(
                    p.sku(),
                    p.name(),
                    p.salePrice(),
                    p.dimensions(),
                    p.colors(),
                    img
            );
        }

        ChatMessageResponse.OrderSummaryDto orderDto = null;
        if (reply.confirmedOrder() != null) {
            Order o = reply.confirmedOrder();
            orderDto = new ChatMessageResponse.OrderSummaryDto(
                    o.orderNumber(),
                    o.customerName(),
                    o.customerPhone(),
                    o.deliveryAddress(),
                    o.productSku(),
                    o.productName(),
                    o.quantity(),
                    o.total(),
                    o.status() != null ? o.status().name() : null,
                    o.trackingNumber(),
                    o.trackingCarrier()
            );
        }

        List<ChatMessageResponse.QuickButtonDto> buttonDtos = new java.util.ArrayList<>();
        if (reply.step() == com.smakbot.core.domain.model.CheckoutStep.CONFIRM) {
            buttonDtos.add(new ChatMessageResponse.QuickButtonDto("btn_confirm", "¡Sí, confirmo el pedido!", "CONFIRM_ORDER"));
            buttonDtos.add(new ChatMessageResponse.QuickButtonDto("btn_modify", "Modificar datos", "MODIFY_ORDER"));
        }

        String firstImage = (reply.images() != null && !reply.images().isEmpty()) ? reply.images().get(0) : null;

        return new ChatMessageResponse(
                reply.text(),
                reply.step() != null ? reply.step().name() : null,
                firstImage,
                reply.images(),
                productDto,
                orderDto,
                buttonDtos
        );
    }

    private OrderTrackingResponse mapToTrackingResponse(Order order) {
        OrderTrackingResponse dto = new OrderTrackingResponse();
        dto.setOrderNumber(order.orderNumber());
        dto.setCustomerName(order.customerName());
        dto.setCustomerPhone(order.customerPhone());
        dto.setDeliveryAddress(order.deliveryAddress());
        dto.setProductSku(order.productSku());
        dto.setProductName(order.productName());
        dto.setQuantity(order.quantity());
        dto.setUnitPrice(order.unitPrice());
        dto.setTotal(order.total());
        dto.setStatus(order.status() != null ? order.status().name() : null);
        dto.setTrackingNumber(order.trackingNumber());
        dto.setTrackingCarrier(order.trackingCarrier());
        dto.setGpsMapUrl(order.gpsMapUrl());
        dto.setCreatedAt(order.createdAt() != null ? order.createdAt().toInstant() : null);
        return dto;
    }
}
