package com.smakbot.core.infrastructure.adapter.out.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.smakbot.core.domain.ports.out.ImageStoragePort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Component
public class CloudinaryImageAdapter implements ImageStoragePort {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryImageAdapter.class);

    private final Cloudinary cloudinary;
    private final String baseFolder;
    private final String uploadDir;
    private final String backendUrl;

    public CloudinaryImageAdapter(
            @Autowired(required = false) Cloudinary cloudinary,
            @Value("${smakbot.cloudinary.folder:smak}") String baseFolder,
            @Value("${smakbot.uploads.dir:./uploads}") String uploadDir,
            @Value("${smakbot.uploads.backend-url:}") String backendUrl
    ) {
        this.cloudinary = cloudinary;
        this.baseFolder = (baseFolder != null && !baseFolder.isBlank()) ? baseFolder.trim() : "smak";
        this.uploadDir = (uploadDir != null && !uploadDir.isBlank()) ? uploadDir.trim() : "./uploads";
        this.backendUrl = (backendUrl != null) ? backendUrl.trim().replaceAll("/+$", "") : "";
    }

    @Override
    public ImageResult uploadProductImage(byte[] imageBytes, String originalFilename, String sku, int index) {
        String cleanSku = (sku != null && !sku.isBlank()) ? slugify(sku) : "prod";
        int safeIndex = Math.max(0, Math.min(index, 4)); // Limitar a rango 0-4 (5 fotos max)
        String publicId = String.format("prod_%s_%d", cleanSku, safeIndex);
        return uploadImage(imageBytes, originalFilename, "products", publicId);
    }

    @Override
    public ImageResult uploadImage(byte[] imageBytes, String originalFilename, String subfolder, String customName) {
        if (imageBytes == null || imageBytes.length == 0) {
            throw new IllegalArgumentException("El contenido de la imagen no puede estar vacío");
        }

        String sub = (subfolder != null && !subfolder.isBlank()) ? subfolder.trim() : "general";
        String targetFolder = baseFolder + "/" + sub;
        String cleanPublicId = (customName != null && !customName.isBlank()) ? slugify(customName) : "img_" + UUID.randomUUID().toString().substring(0, 8);

        // 1. Intentar subir a Cloudinary si está inicializado
        if (cloudinary != null) {
            try {
                log.info("Subiendo imagen a Cloudinary en carpeta '{}' con public_id '{}' ({} bytes)",
                        targetFolder, cleanPublicId, imageBytes.length);

                Transformation<?> transformation = new Transformation<>()
                        .width(800)
                        .height(800)
                        .crop("limit")
                        .quality("auto")
                        .fetchFormat("auto");

                Map<String, Object> params = ObjectUtils.asMap(
                        "folder", targetFolder,
                        "public_id", cleanPublicId,
                        "overwrite", true,
                        "unique_filename", false,
                        "transformation", transformation
                );

                @SuppressWarnings("unchecked")
                Map<String, Object> res = (Map<String, Object>) cloudinary.uploader().upload(imageBytes, params);

                String secureUrl = (String) res.get("secure_url");
                String publicId = (String) res.get("public_id");
                String format = (String) res.get("format");
                Integer width = res.get("width") instanceof Number ? ((Number) res.get("width")).intValue() : 800;
                Integer height = res.get("height") instanceof Number ? ((Number) res.get("height")).intValue() : 800;
                Long bytes = res.get("bytes") instanceof Number ? ((Number) res.get("bytes")).longValue() : (long) imageBytes.length;

                log.info("Imagen subida con éxito a Cloudinary: {}", secureUrl);
                return new ImageResult(secureUrl, publicId, format, width, height, bytes, "cloudinary");

            } catch (Exception ex) {
                log.warn("Error al subir a Cloudinary ({}). Activando almacenamiento local de contingencia.", ex.getMessage());
            }
        }

        // 2. Fallback de contingencia: Guardar en disco local
        return saveLocally(imageBytes, originalFilename, cleanPublicId);
    }

    private ImageResult saveLocally(byte[] imageBytes, String originalFilename, String baseName) {
        String ext = resolveExtension(originalFilename);
        String finalFilename = baseName + "." + ext;

        try {
            Path targetDir = Paths.get(uploadDir, baseFolder);
            Files.createDirectories(targetDir);

            Path destination = targetDir.resolve(finalFilename);
            try (FileOutputStream fos = new FileOutputStream(destination.toFile())) {
                fos.write(imageBytes);
            }

            String relativeUrl = "/api/v1/images/file/" + finalFilename;
            String fullUrl = !backendUrl.isBlank() ? backendUrl + relativeUrl : relativeUrl;

            log.info("Imagen guardada localmente como fallback en: {} (URL: {})", destination.toAbsolutePath(), fullUrl);
            return new ImageResult(fullUrl, finalFilename, ext, 800, 800, (long) imageBytes.length, "local");
        } catch (IOException e) {
            log.error("Fallo crítico al guardar imagen en disco local: {}", e.getMessage(), e);
            throw new RuntimeException("No se pudo guardar la imagen en Cloudinary ni en almacenamiento local", e);
        }
    }

    @Override
    public byte[] loadLocalFile(String filename) {
        if (filename == null || filename.isBlank()) return null;
        try {
            // Prevenir Path Traversal
            String safeName = new File(filename).getName();
            Path path = Paths.get(uploadDir, baseFolder, safeName);
            if (Files.exists(path) && Files.isReadable(path)) {
                return Files.readAllBytes(path);
            }
            // También intentar directamente en uploadDir
            Path pathDirect = Paths.get(uploadDir, safeName);
            if (Files.exists(pathDirect) && Files.isReadable(pathDirect)) {
                return Files.readAllBytes(pathDirect);
            }
        } catch (IOException e) {
            log.error("Error al leer archivo local {}: {}", filename, e.getMessage());
        }
        return null;
    }

    @Override
    public String determineMimeType(String filename) {
        if (filename == null) return "image/jpeg";
        String lower = filename.toLowerCase();
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".avif")) return "image/avif";
        return "image/jpeg";
    }

    private String resolveExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            if (ext.matches("^[a-z0-9]{3,4}$")) {
                return ext;
            }
        }
        return "jpg";
    }

    private String slugify(String input) {
        if (input == null || input.isBlank()) return "img";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");
        return normalized.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9_.-]", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "");
    }
}

