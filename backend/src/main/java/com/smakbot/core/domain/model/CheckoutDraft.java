package com.smakbot.core.domain.model;

import java.math.BigDecimal;

/**
 * Borrador de pedido mientras el cliente recorre el checkout conversacional.
 * Es un contenedor de estado mutable (equivalente a {@code this.checkout} del Oráculo) que se
 * serializa como JSON dentro de {@code chat_sessions.session_data}.
 */
public class CheckoutDraft {
    public String orderNumber;
    public String productSku;
    public String productName;
    public BigDecimal unitPrice = BigDecimal.ZERO;
    public int quantity = 1;
    public String quantityLabel = "";
    public BigDecimal total = BigDecimal.ZERO;
    public String name = "";
    public String recipientName = "";
    public String address = "";
    public boolean agencyPickup;
    public String phone = "";
    public String postalCode;
    public GeoLocation location;
    public boolean requiresInvoice;
    public String rtn;
    public String businessName;
    public String pendingAlternativeProductSku;

    public static CheckoutDraft start(Product product, int quantity, String orderNumber) {
        CheckoutDraft d = new CheckoutDraft();
        d.orderNumber = orderNumber;
        d.applyProduct(product);
        d.quantity = Math.max(1, quantity);
        d.recalculate();
        return d;
    }

    public void applyProduct(Product product) {
        this.productSku = product.sku();
        this.productName = product.name();
        this.unitPrice = product.salePrice();
        this.pendingAlternativeProductSku = null;
        recalculate();
    }

    public void addProductBundle(Product additionalProduct) {
        this.productName = this.productName + " + " + additionalProduct.name();
        this.productSku = this.productSku + " + " + additionalProduct.sku();
        this.total = this.total.add(additionalProduct.salePrice());
        this.quantityLabel = (this.quantityLabel != null && !this.quantityLabel.isBlank())
                ? this.quantityLabel + " + 1 unid. " + additionalProduct.name()
                : this.quantity + " unid. + 1 unid. " + additionalProduct.name();
        this.pendingAlternativeProductSku = null;
    }

    public void recalculate() {
        this.total = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    public String effectiveQuantityLabel() {
        return (quantityLabel == null || quantityLabel.isBlank()) ? quantity + " unid." : quantityLabel;
    }

    public String effectiveRecipient() {
        return (recipientName == null || recipientName.isBlank()) ? name : recipientName;
    }
}
