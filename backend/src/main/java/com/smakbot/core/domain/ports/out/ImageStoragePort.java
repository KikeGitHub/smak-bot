package com.smakbot.core.domain.ports.out;

public interface ImageStoragePort {

    record ImageResult(
            String url,
            String publicId,
            String format,
            Integer width,
            Integer height,
            Long bytes,
            String storage
    ) {}

    /**
     * Sube una imagen de producto a Cloudinary (carpeta smak/products) con optimización 800x800 auto.
     * Si Cloudinary no está configurado o falla, recurre a almacenamiento local.
     */
    ImageResult uploadProductImage(byte[] imageBytes, String originalFilename, String sku, int index);

    /**
     * Sube una imagen genérica especificando subcarpeta bajo /smak.
     */
    ImageResult uploadImage(byte[] imageBytes, String originalFilename, String subfolder, String customName);

    /**
     * Recupera un archivo local si fue guardado en el fallback local.
     */
    byte[] loadLocalFile(String filename);

    /**
     * Resuelve el tipo MIME para servir archivos locales.
     */
    String determineMimeType(String filename);
}

