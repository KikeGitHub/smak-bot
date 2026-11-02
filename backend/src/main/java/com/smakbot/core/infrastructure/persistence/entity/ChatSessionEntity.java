package com.smakbot.core.infrastructure.persistence.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "chat_sessions")
public class ChatSessionEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "tenant_id", nullable = false, length = 50)
    private String tenantId;

    @Column(nullable = false, length = 20)
    private String channel;

    @Column(name = "current_step", length = 40)
    private String currentStep = "IDLE";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "session_data", columnDefinition = "jsonb")
    private Map<String, Object> sessionData = new HashMap<>();

    @Column(name = "last_interaction")
    private OffsetDateTime lastInteraction;

    @PrePersist
    @PreUpdate
    public void onSave() {
        if (lastInteraction == null) lastInteraction = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getCurrentStep() { return currentStep; }
    public void setCurrentStep(String currentStep) { this.currentStep = currentStep; }
    public Map<String, Object> getSessionData() { return sessionData; }
    public void setSessionData(Map<String, Object> sessionData) { this.sessionData = sessionData; }
    public OffsetDateTime getLastInteraction() { return lastInteraction; }
    public void setLastInteraction(OffsetDateTime lastInteraction) { this.lastInteraction = lastInteraction; }
}
