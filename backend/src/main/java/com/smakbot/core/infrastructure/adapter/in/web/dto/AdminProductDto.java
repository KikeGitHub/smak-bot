package com.smakbot.core.infrastructure.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminProductDto {

    private UUID id;
    private String tenantId;
    private String sku;
    private String name;
    private String description;
    private BigDecimal regularPrice;
    private BigDecimal salePrice;
    private Integer stock;
    private String dimensions;
    private String weightLimit;
    private String colors;
    private String category;
    private List<String> keywords;
    private List<String> images;
    private Boolean active;

    public AdminProductDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getRegularPrice() { return regularPrice; }
    public void setRegularPrice(BigDecimal regularPrice) { this.regularPrice = regularPrice; }
    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getDimensions() { return dimensions; }
    public void setDimensions(String dimensions) { this.dimensions = dimensions; }
    public String getWeightLimit() { return weightLimit; }
    public void setWeightLimit(String weightLimit) { this.weightLimit = weightLimit; }
    public String getColors() { return colors; }
    public void setColors(String colors) { this.colors = colors; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
