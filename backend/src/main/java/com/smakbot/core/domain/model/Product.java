package com.smakbot.core.domain.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/** Producto del catálogo de un tenant. */
public record Product(
        UUID id,
        String tenantId,
        String sku,
        String name,
        String description,
        BigDecimal regularPrice,
        BigDecimal salePrice,
        int stock,
        String dimensions,
        String weightLimit,
        String colors,
        String category,
        List<String> keywords,
        List<String> images,
        boolean active
) {
    public Product {
        keywords = keywords == null ? List.of() : List.copyOf(keywords);
        images = images == null ? List.of() : List.copyOf(images);
        salePrice = salePrice == null ? BigDecimal.ZERO : salePrice;
    }

    public boolean inStock() {
        return stock > 0;
    }

    /** Precio regular; si no existe se estima +15% como en el Oráculo. */
    public BigDecimal effectiveRegularPrice() {
        if (regularPrice != null && regularPrice.signum() > 0) {
            return regularPrice;
        }
        return salePrice.multiply(BigDecimal.valueOf(1.15)).setScale(0, java.math.RoundingMode.HALF_UP);
    }

    /** Clave de familia (primeros 2 segmentos del SKU, ej. SKM-956) para agrupar variantes de color. */
    public String familyKey() {
        if (sku == null) return "";
        String[] parts = sku.split("-");
        return parts.length >= 2 ? parts[0] + "-" + parts[1] : sku;
    }

    public List<String> firstImages(int n) {
        return images.subList(0, Math.min(n, images.size()));
    }

    public Product withStock(int newStock) {
        return new Product(id, tenantId, sku, name, description, regularPrice, salePrice,
                Math.max(0, newStock), dimensions, weightLimit, colors, category, keywords, images, active);
    }
}
