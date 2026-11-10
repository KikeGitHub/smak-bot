package com.smakbot.core.domain.ports.out;

/**
 * Puerto de salida para análisis e identificación visual de productos en imágenes (promocionales, catálogos o fotos).
 */
public interface ProductVisionPort {

    ProductVisionResult analyzeImage(byte[] imageBytes, String mimeType, String caption);

    record ProductVisionResult(
            String sku,
            String productName,
            Double detectedPrice,
            String summary
    ) {
        public boolean hasSku() {
            return sku != null && !sku.isBlank();
        }

        public boolean hasProduct() {
            return (productName != null && !productName.isBlank()) || hasSku();
        }
    }
}

