package com.smakbot.core.infrastructure.adapter.in.web;

import com.smakbot.core.domain.ports.out.ImageStoragePort;
import com.smakbot.core.domain.ports.out.ImageStoragePort.ImageResult;
import com.smakbot.core.infrastructure.adapter.in.web.dto.ImageResponseDto;
import com.smakbot.core.infrastructure.adapter.in.web.dto.ImageUploadDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

@RestController
@RequestMapping("/api/v1/images")
@Tag(name = "Image Management", description = "Carga y gestión de imágenes con Cloudinary (carpeta /smak) y fallback local")
public class ImageController {

    private static final Logger log = LoggerFactory.getLogger(ImageController.class);

    private final ImageStoragePort imageStoragePort;

    public ImageController(ImageStoragePort imageStoragePort) {
        this.imageStoragePort = imageStoragePort;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir imagen vía Multipart",
               description = "Sube un archivo de imagen a Cloudinary en /smak/products (hasta 5 por producto)")
    public ResponseEntity<ImageResponseDto> uploadMultipart(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "index", defaultValue = "0") int index,
            @RequestParam(value = "folder", defaultValue = "products") String folder) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] bytes = file.getBytes();
            String originalName = file.getOriginalFilename();

            ImageResult result;
            if (sku != null && !sku.isBlank()) {
                result = imageStoragePort.uploadProductImage(bytes, originalName, sku, index);
            } else {
                result = imageStoragePort.uploadImage(bytes, originalName, folder, null);
            }

            return ResponseEntity.ok(mapToDto(result));
        } catch (Exception e) {
            log.error("Error al procesar subida multipart: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/upload-base64", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Subir imagen en formato Base64",
               description = "Decodifica una cadena Base64 (con o sin prefijo data:image) y la almacena en Cloudinary")
    public ResponseEntity<ImageResponseDto> uploadBase64(@RequestBody ImageUploadDto dto) {
        if (dto.getBase64File() == null || dto.getBase64File().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            String rawBase64 = dto.getBase64File();
            String ext = "jpg";

            // Detectar y limpiar prefijo Data URI: data:image/png;base64,
            if (rawBase64.contains(",")) {
                String header = rawBase64.substring(0, rawBase64.indexOf(','));
                if (header.contains("image/png")) ext = "png";
                else if (header.contains("image/webp")) ext = "webp";
                else if (header.contains("image/gif")) ext = "gif";
                rawBase64 = rawBase64.substring(rawBase64.indexOf(',') + 1);
            }

            // Limpiar espacios en blanco o saltos de línea
            rawBase64 = rawBase64.replaceAll("\\s+", "");
            byte[] bytes = Base64.getDecoder().decode(rawBase64);

            String fakeName = (dto.getResourceName() != null ? dto.getResourceName() : "upload") + "." + ext;
            int safeIndex = dto.getIndex() != null ? dto.getIndex() : 0;

            ImageResult result;
            if (dto.getSku() != null && !dto.getSku().isBlank()) {
                result = imageStoragePort.uploadProductImage(bytes, fakeName, dto.getSku(), safeIndex);
            } else {
                result = imageStoragePort.uploadImage(bytes, fakeName, dto.getType(), dto.getResourceName());
            }

            return ResponseEntity.ok(mapToDto(result));
        } catch (Exception e) {
            log.error("Error al decodificar y subir imagen Base64: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/file/{filename:.+}")
    @Operation(summary = "Servir archivo local de contingencia",
               description = "Entrega archivos guardados en el almacenamiento local en caso de que Cloudinary esté inactivo")
    public ResponseEntity<byte[]> getLocalFile(@PathVariable("filename") String filename) {
        byte[] bytes = imageStoragePort.loadLocalFile(filename);
        if (bytes == null || bytes.length == 0) {
            return ResponseEntity.notFound().build();
        }

        String mimeType = imageStoragePort.determineMimeType(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, mimeType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(bytes);
    }

    private ImageResponseDto mapToDto(ImageResult r) {
        return new ImageResponseDto(
                r.url(),
                r.publicId(),
                r.format(),
                r.width(),
                r.height(),
                r.bytes(),
                r.storage()
        );
    }
}

