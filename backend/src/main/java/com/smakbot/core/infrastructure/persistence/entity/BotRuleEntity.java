package com.smakbot.core.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bot_rules")
public class BotRuleEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "tenant_id", nullable = false, length = 50)
    private String tenantId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 50)
    private String type;

    @Column
    private Boolean enabled = true;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "training_phrases", nullable = false, columnDefinition = "jsonb")
    private List<String> trainingPhrases = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String response;

    @Column(name = "response_in_stock", columnDefinition = "TEXT")
    private String responseInStock;

    @Column(name = "response_out_of_stock", columnDefinition = "TEXT")
    private String responseOutOfStock;

    @Column(name = "response_not_found", columnDefinition = "TEXT")
    private String responseNotFound;

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
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    public List<String> getTrainingPhrases() { return trainingPhrases; }
    public void setTrainingPhrases(List<String> trainingPhrases) { this.trainingPhrases = trainingPhrases; }
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public String getResponseInStock() { return responseInStock; }
    public void setResponseInStock(String responseInStock) { this.responseInStock = responseInStock; }
    public String getResponseOutOfStock() { return responseOutOfStock; }
    public void setResponseOutOfStock(String responseOutOfStock) { this.responseOutOfStock = responseOutOfStock; }
    public String getResponseNotFound() { return responseNotFound; }
    public void setResponseNotFound(String responseNotFound) { this.responseNotFound = responseNotFound; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}

