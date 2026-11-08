package com.smakbot.core.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tenants")
public class TenantEntity {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 10)
    private String country;

    @Column(length = 10)
    private String currency;

    @Column(name = "phone_contact", length = 50)
    private String phoneContact;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "business_type", length = 150)
    private String businessType;

    @Column(name = "bot_persona", columnDefinition = "TEXT")
    private String botPersona;

    @Column(name = "scope_policy", columnDefinition = "TEXT")
    private String scopePolicy;

    @Column(name = "order_prefix", length = 20)
    private String orderPrefix;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    public void onPrePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (updatedAt == null) updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPhoneContact() { return phoneContact; }
    public void setPhoneContact(String phoneContact) { this.phoneContact = phoneContact; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }
    public String getBotPersona() { return botPersona; }
    public void setBotPersona(String botPersona) { this.botPersona = botPersona; }
    public String getScopePolicy() { return scopePolicy; }
    public void setScopePolicy(String scopePolicy) { this.scopePolicy = scopePolicy; }
    public String getOrderPrefix() { return orderPrefix; }
    public void setOrderPrefix(String orderPrefix) { this.orderPrefix = orderPrefix; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
