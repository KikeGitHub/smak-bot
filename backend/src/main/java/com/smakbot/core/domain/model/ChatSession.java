package com.smakbot.core.domain.model;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Sesión conversacional (memoria del bot) por cliente/canal/tenant.
 * Id compuesto: {@code tenantId:CHANNEL:customerId} para garantizar aislamiento multitenant.
 */
public class ChatSession {
    public static final int MAX_HISTORY_TURNS = 16;

    private final String id;
    private final String tenantId;
    private final Channel channel;
    private CheckoutStep step = CheckoutStep.IDLE;
    private String selectedSku;
    private String lastOrderNumber;
    private String pendingCancelOrderNumber;
    private CheckoutDraft checkout;
    private OffsetDateTime lastInteraction;
    private String activeCategory;
    private List<String> offeredSkus = new ArrayList<>();
    private List<ConversationTurn> history = new ArrayList<>();
    private int fallbackCount = 0;

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
        this.pendingCancelOrderNumber = null;
        this.checkout = null;
        this.activeCategory = null;
        this.offeredSkus.clear();
        this.history.clear();
        this.fallbackCount = 0;
    }

    public boolean isHuman() {
        return step == CheckoutStep.HUMAN;
    }

    public boolean inCheckout() {
        return checkout != null && step.isCheckout();
    }

    public void addTurn(String role, String content) {
        if (content == null || content.isBlank()) return;
        this.history.add(new ConversationTurn(role, content));
        while (this.history.size() > MAX_HISTORY_TURNS) {
            this.history.remove(0);
        }
    }

    public void addOfferedSku(String sku) {
        if (sku != null && !offeredSkus.contains(sku)) {
            offeredSkus.add(sku);
        }
    }

    public void addOfferedSkus(Collection<String> skus) {
        if (skus != null) {
            for (String s : skus) {
                addOfferedSku(s);
            }
        }
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
    public String getPendingCancelOrderNumber() { return pendingCancelOrderNumber; }
    public void setPendingCancelOrderNumber(String pendingCancelOrderNumber) { this.pendingCancelOrderNumber = pendingCancelOrderNumber; }
    public CheckoutDraft getCheckout() { return checkout; }
    public void setCheckout(CheckoutDraft checkout) { this.checkout = checkout; }
    public OffsetDateTime getLastInteraction() { return lastInteraction; }
    public void setLastInteraction(OffsetDateTime lastInteraction) { this.lastInteraction = lastInteraction; }
    public String getActiveCategory() { return activeCategory; }
    public void setActiveCategory(String activeCategory) { this.activeCategory = activeCategory; }
    public List<String> getOfferedSkus() { return offeredSkus; }
    public void setOfferedSkus(List<String> offeredSkus) {
        this.offeredSkus = (offeredSkus != null) ? new ArrayList<>(offeredSkus) : new ArrayList<>();
    }
    public List<ConversationTurn> getHistory() { return history; }
    public void setHistory(List<ConversationTurn> history) {
        this.history = (history != null) ? new ArrayList<>(history) : new ArrayList<>();
    }
    public int getFallbackCount() { return fallbackCount; }
    public void setFallbackCount(int fallbackCount) { this.fallbackCount = fallbackCount; }
}
