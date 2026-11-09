package com.smakbot.core.infrastructure.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.util.List;

/**
 * Respuesta del motor conversacional hacia el Widget Web.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatMessageResponse {

    private String text;
    private String step;
    private String imageUrl;
    private List<String> images;
    private ProductSummaryDto product;
    private OrderSummaryDto order;
    private List<QuickButtonDto> buttons;

    public ChatMessageResponse() {
    }

    public ChatMessageResponse(String text, String step, String imageUrl, ProductSummaryDto product, OrderSummaryDto order, List<QuickButtonDto> buttons) {
        this(text, step, imageUrl, null, product, order, buttons);
    }

    public ChatMessageResponse(String text, String step, String imageUrl, List<String> images, ProductSummaryDto product, OrderSummaryDto order, List<QuickButtonDto> buttons) {
        this.text = text;
        this.step = step;
        this.imageUrl = imageUrl;
        this.images = images;
        this.product = product;
        this.order = order;
        this.buttons = buttons;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getStep() {
        return step;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public ProductSummaryDto getProduct() {
        return product;
    }

    public void setProduct(ProductSummaryDto product) {
        this.product = product;
    }

    public OrderSummaryDto getOrder() {
        return order;
    }

    public void setOrder(OrderSummaryDto order) {
        this.order = order;
    }

    public List<QuickButtonDto> getButtons() {
        return buttons;
    }

    public void setButtons(List<QuickButtonDto> buttons) {
        this.buttons = buttons;
    }

    public static class ProductSummaryDto {
        private String sku;
        private String name;
        private BigDecimal salePrice;
        private String dimensions;
        private String colors;
        private String imageUrl;

        public ProductSummaryDto() {
        }

        public ProductSummaryDto(String sku, String name, BigDecimal salePrice, String dimensions, String colors, String imageUrl) {
            this.sku = sku;
            this.name = name;
            this.salePrice = salePrice;
            this.dimensions = dimensions;
            this.colors = colors;
            this.imageUrl = imageUrl;
        }

        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public BigDecimal getSalePrice() { return salePrice; }
        public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }
        public String getDimensions() { return dimensions; }
        public void setDimensions(String dimensions) { this.dimensions = dimensions; }
        public String getColors() { return colors; }
        public void setColors(String colors) { this.colors = colors; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    public static class OrderSummaryDto {
        private String orderNumber;
        private String customerName;
        private String customerPhone;
        private String deliveryAddress;
        private String productSku;
        private String productName;
        private Integer quantity;
        private BigDecimal total;
        private String status;
        private String trackingNumber;
        private String trackingCarrier;

        public OrderSummaryDto() {
        }

        public OrderSummaryDto(String orderNumber, String customerName, String customerPhone, String deliveryAddress,
                               String productSku, String productName, Integer quantity, BigDecimal total,
                               String status, String trackingNumber, String trackingCarrier) {
            this.orderNumber = orderNumber;
            this.customerName = customerName;
            this.customerPhone = customerPhone;
            this.deliveryAddress = deliveryAddress;
            this.productSku = productSku;
            this.productName = productName;
            this.quantity = quantity;
            this.total = total;
            this.status = status;
            this.trackingNumber = trackingNumber;
            this.trackingCarrier = trackingCarrier;
        }

        public String getOrderNumber() { return orderNumber; }
        public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerPhone() { return customerPhone; }
        public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
        public String getDeliveryAddress() { return deliveryAddress; }
        public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
        public String getProductSku() { return productSku; }
        public void setProductSku(String productSku) { this.productSku = productSku; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getTotal() { return total; }
        public void setTotal(BigDecimal total) { this.total = total; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getTrackingNumber() { return trackingNumber; }
        public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
        public String getTrackingCarrier() { return trackingCarrier; }
        public void setTrackingCarrier(String trackingCarrier) { this.trackingCarrier = trackingCarrier; }
    }

    public static class QuickButtonDto {
        private String id;
        private String title;
        private String payload;

        public QuickButtonDto() {
        }

        public QuickButtonDto(String id, String title, String payload) {
            this.id = id;
            this.title = title;
            this.payload = payload;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getPayload() { return payload; }
        public void setPayload(String payload) { this.payload = payload; }
    }
}
