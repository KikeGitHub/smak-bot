package com.smakbot.core.infrastructure.adapter.in.web.dto;

public class ImageUploadDto {
    private String base64File;
    private String type = "product";
    private String sku;
    private Integer index = 0;
    private String resourceName;

    public ImageUploadDto() {}

    public ImageUploadDto(String base64File, String type, String sku, Integer index, String resourceName) {
        this.base64File = base64File;
        this.type = type;
        this.sku = sku;
        this.index = index;
        this.resourceName = resourceName;
    }

    public String getBase64File() {
        return base64File;
    }

    public void setBase64File(String base64File) {
        this.base64File = base64File;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }
}

