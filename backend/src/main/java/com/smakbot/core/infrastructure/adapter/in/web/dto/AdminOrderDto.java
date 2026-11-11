package com.smakbot.core.infrastructure.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.smakbot.core.domain.model.OrderAuditEvent;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminOrderDto {

    private UUID id;
    private String tenantId;
    private String orderNumber;
    private String customerName;
    private String customerPhone;
    private String deliveryAddress;
    private Double gpsLatitude;
    private Double gpsLongitude;
    private String gpsMapUrl;
    private String productSku;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal total;
    private String status;
    private Boolean requiresInvoice;
    private String rtn;
    private String businessName;
    private String trackingNumber;
    private String trackingCarrier;
    private String sourceChannel;
    private String sourceSessionId;
    private String clientIp;
    private String cancellationReason;
    private String cancelledBy;
    private Instant cancelledAt;
    private AuditDto audit;
    private Instant createdAt;

    public AdminOrderDto() {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AuditDto {
        private String ip;
        private String userAgent;
        private String source;
        private Instant createdAt;
        private List<OrderAuditEvent> history;

        public AuditDto() {}

        public AuditDto(String ip, String userAgent, String source, Instant createdAt, List<OrderAuditEvent> history) {
            this.ip = ip;
            this.userAgent = userAgent;
            this.source = source;
            this.createdAt = createdAt;
            this.history = history;
        }

        public String getIp() { return ip; }
        public void setIp(String ip) { this.ip = ip; }
        public String getUserAgent() { return userAgent; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public Instant getCreatedAt() { return createdAt; }
        public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
        public List<OrderAuditEvent> getHistory() { return history; }
        public void setHistory(List<OrderAuditEvent> history) { this.history = history; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public Double getGpsLatitude() { return gpsLatitude; }
    public void setGpsLatitude(Double gpsLatitude) { this.gpsLatitude = gpsLatitude; }
    public Double getGpsLongitude() { return gpsLongitude; }
    public void setGpsLongitude(Double gpsLongitude) { this.gpsLongitude = gpsLongitude; }
    public String getGpsMapUrl() { return gpsMapUrl; }
    public void setGpsMapUrl(String gpsMapUrl) { this.gpsMapUrl = gpsMapUrl; }
    public String getProductSku() { return productSku; }
    public void setProductSku(String productSku) { this.productSku = productSku; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Boolean getRequiresInvoice() { return requiresInvoice; }
    public void setRequiresInvoice(Boolean requiresInvoice) { this.requiresInvoice = requiresInvoice; }
    public String getRtn() { return rtn; }
    public void setRtn(String rtn) { this.rtn = rtn; }
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public String getTrackingCarrier() { return trackingCarrier; }
    public void setTrackingCarrier(String trackingCarrier) { this.trackingCarrier = trackingCarrier; }
    public String getSourceChannel() { return sourceChannel; }
    public void setSourceChannel(String sourceChannel) { this.sourceChannel = sourceChannel; }
    public String getSourceSessionId() { return sourceSessionId; }
    public void setSourceSessionId(String sourceSessionId) { this.sourceSessionId = sourceSessionId; }
    public String getClientIp() { return clientIp; }
    public void setClientIp(String clientIp) { this.clientIp = clientIp; }
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    public String getCancelledBy() { return cancelledBy; }
    public void setCancelledBy(String cancelledBy) { this.cancelledBy = cancelledBy; }
    public Instant getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(Instant cancelledAt) { this.cancelledAt = cancelledAt; }
    public AuditDto getAudit() { return audit; }
    public void setAudit(AuditDto audit) { this.audit = audit; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
