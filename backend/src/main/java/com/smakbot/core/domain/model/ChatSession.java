package com.smakbot.core.domain.model;

import java.time.OffsetDateTime;

/**
 * Sesión conversacional (memoria del bot) por cliente/canal/tenant.
 * Id compuesto: {@code tenantId:CHANNEL:customerId} para garantizar aislamiento multitenant.
 */
public class ChatSession {
    private final String id;
    private final String tenantId;
    private final Channel channel;
    private CheckoutStep step = CheckoutStep.IDLE;
    private String selectedSku;
    private String lastOrderNumber;
    private CheckoutDraft checkout;
    private OffsetDateTime lastInteraction;

    public ChatSession(String id, String tenantId, Channel channel) {
        this.id = id;
        this.tenantId = tenantId;
        this.channel = channel;
    }

    public static String buildId(String tenantId, Channel channel, String customerId) {
        return tenantId + ":" + channel.name() + ":" + customerId;
    }

    public void startCheckout(CheckoutDraft draft) {
        this.checkout = draft;
        this.step = CheckoutStep.NAME;
    }

    public void completeCheckout(String orderNumber) {
        this.lastOrderNumber = orderNumber;
        this.checkout = null;
        this.step = CheckoutStep.IDLE;
    }

    public void handoverToHuman() {
        this.step = CheckoutStep.HUMAN;
    }

    public void reset() {
        this.step = CheckoutStep.IDLE;
        this.selectedSku = null;
        this.checkout = null;
    }

    public boolean isHuman() {
        return step == CheckoutStep.HUMAN;
    }

    public boolean inCheckout() {
        return checkout != null && step.isCheckout();
    }

    public String getId() { return id; }
    public String getTenantId() { return tenantId; }
    public Channel getChannel() { return channel; }
    public CheckoutStep getStep() { return step; }
    public void setStep(CheckoutStep step) { this.step = step; }
    public String getSelectedSku() { return selectedSku; }
    public void setSelectedSku(String selectedSku) { this.selectedSku = selectedSku; }
    public String getLastOrderNumber() { return lastOrderNumber; }
    public void setLastOrderNumber(String lastOrderNumber) { this.lastOrderNumber = lastOrderNumber; }
    public CheckoutDraft getCheckout() { return checkout; }
    public void setCheckout(CheckoutDraft checkout) { this.checkout = checkout; }
    public OffsetDateTime getLastInteraction() { return lastInteraction; }
    public void setLastInteraction(OffsetDateTime lastInteraction) { this.lastInteraction = lastInteraction; }
}
