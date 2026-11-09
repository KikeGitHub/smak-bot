package com.smakbot.core.infrastructure.adapter.in.web.dto;

public class ImageResponseDto {
    private String url;
    private String publicId;
    private String format;
    private Integer width;
    private Integer height;
    private Long bytes;
    private String storage; // "cloudinary" o "local"

    public ImageResponseDto() {}

    public ImageResponseDto(String url, String publicId, String format, Integer width, Integer height, Long bytes, String storage) {
        this.url = url;
        this.publicId = publicId;
        this.format = format;
        this.width = width;
        this.height = height;
        this.bytes = bytes;
        this.storage = storage;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Long getBytes() {
        return bytes;
    }

    public void setBytes(Long bytes) {
        this.bytes = bytes;
    }

    public String getStorage() {
        return storage;
    }

    public void setStorage(String storage) {
        this.storage = storage;
    }
}

