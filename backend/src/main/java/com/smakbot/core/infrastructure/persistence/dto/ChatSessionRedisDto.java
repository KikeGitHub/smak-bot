package com.smakbot.core.infrastructure.persistence.dto;

import com.smakbot.core.domain.model.Channel;
import com.smakbot.core.domain.model.ChatSession;
import com.smakbot.core.domain.model.CheckoutDraft;
import com.smakbot.core.domain.model.CheckoutStep;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO optimizado para serialización JSON y almacenamiento de sesiones conversacionales en Redis.
 */
public class ChatSessionRedisDto {

    private String id;
    private String tenantId;
    private String channel;
    private String step;
    private String selectedSku;
    private String lastOrderNumber;
    private CheckoutDraft checkout;
    private OffsetDateTime lastInteraction;
    private String activeCategory;
    private List<String> offeredSkus = new ArrayList<>();
    private int fallbackCount;

    public ChatSessionRedisDto() {
    }

    public static ChatSessionRedisDto fromDomain(ChatSession session) {
        if (session == null) return null;
        ChatSessionRedisDto dto = new ChatSessionRedisDto();
        dto.setId(session.getId());
        dto.setTenantId(session.getTenantId());
        dto.setChannel(session.getChannel() != null ? session.getChannel().name() : null);
        dto.setStep(session.getStep() != null ? session.getStep().name() : CheckoutStep.IDLE.name());
        dto.setSelectedSku(session.getSelectedSku());
        dto.setLastOrderNumber(session.getLastOrderNumber());
        dto.setCheckout(session.getCheckout());
        dto.setLastInteraction(session.getLastInteraction());
        dto.setActiveCategory(session.getActiveCategory());
        dto.setOfferedSkus(session.getOfferedSkus() != null ? new ArrayList<>(session.getOfferedSkus()) : new ArrayList<>());
        dto.setFallbackCount(session.getFallbackCount());
        return dto;
    }

    public ChatSession toDomain() {
        Channel ch = channel != null ? Channel.valueOf(channel) : Channel.WHATSAPP;
        ChatSession session = new ChatSession(id, tenantId, ch);
        if (step != null) {
            try {
                session.setStep(CheckoutStep.valueOf(step));
            } catch (Exception e) {
                session.setStep(CheckoutStep.IDLE);
            }
        }
        session.setSelectedSku(selectedSku);
        session.setLastOrderNumber(lastOrderNumber);
        session.setCheckout(checkout);
        session.setLastInteraction(lastInteraction);
        session.setActiveCategory(activeCategory);
        session.setOfferedSkus(offeredSkus != null ? offeredSkus : new ArrayList<>());
        session.setFallbackCount(fallbackCount);
        return session;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getStep() { return step; }
    public void setStep(String step) { this.step = step; }

    public String getSelectedSku() { return selectedSku; }
    public void setSelectedSku(String selectedSku) { this.selectedSku = selectedSku; }

    public String getLastOrderNumber() { return lastOrderNumber; }
    public void setLastOrderNumber(String lastOrderNumber) { this.lastOrderNumber = lastOrderNumber; }

    public CheckoutDraft getCheckout() { return checkout; }
    public void setCheckout(CheckoutDraft checkout) { this.checkout = checkout; }

    public OffsetDateTime getLastInteraction() { return lastInteraction; }
    public void setLastInteraction(OffsetDateTime lastInteraction) { this.lastInteraction = lastInteraction; }

    public String getActiveCategory() { return activeCategory; }
    public void setActiveCategory(String activeCategory) { this.activeCategory = activeCategory; }

    public List<String> getOfferedSkus() { return offeredSkus; }
    public void setOfferedSkus(List<String> offeredSkus) { this.offeredSkus = offeredSkus; }

    public int getFallbackCount() { return fallbackCount; }
    public void setFallbackCount(int fallbackCount) { this.fallbackCount = fallbackCount; }
}
