package com.smakbot.core.infrastructure.adapter.out.openai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smakbot.core.domain.ports.out.ProductVisionPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Adaptador de visión multimodal basado en OpenAI GPT-4o-mini.
 * Extrae SKU (ej. EZRY123), producto y precio de banners publicitarios y fotografías enviadas por clientes.
 */
@Component
public class OpenAiProductVisionAdapter implements ProductVisionPort {

    private static final Logger log = LoggerFactory.getLogger(OpenAiProductVisionAdapter.class);

    private final String openAiApiKey;
    private final String openAiModel;
    private final String openAiBaseUrl;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public OpenAiProductVisionAdapter(
            @Value("${smakbot.openai.api-key:}") String openAiApiKey,
            @Value("${smakbot.openai.model:gpt-4o-mini}") String openAiModel,
            @Value("${smakbot.openai.base-url:https://api.openai.com/v1}") String openAiBaseUrl,
            ObjectMapper objectMapper) {
        this.openAiApiKey = openAiApiKey != null ? openAiApiKey.trim() : "";
        this.openAiModel = (openAiModel != null && !openAiModel.isBlank()) ? openAiModel.trim() : "gpt-4o-mini";
        this.openAiBaseUrl = (openAiBaseUrl != null && !openAiBaseUrl.isBlank()) ? openAiBaseUrl.trim() : "https://api.openai.com/v1";
        this.objectMapper = objectMapper;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(8000);
        requestFactory.setReadTimeout(25000);
        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    public boolean isConfigured() {
        return !openAiApiKey.isBlank() && !openAiApiKey.startsWith("CHANGE_ME");
    }

    @Override
    public ProductVisionResult analyzeImage(byte[] imageBytes, String mimeType, String caption) {
        if (imageBytes == null || imageBytes.length == 0) {
            log.warn("Bytes de imagen vacíos en análisis visual de producto.");
            return new ProductVisionResult(null, null, null, caption);
        }

        if (!isConfigured()) {
            log.warn("OPENAI_API_KEY no configurada; omitiendo análisis visual multimodal de producto.");
            return new ProductVisionResult(null, null, null, caption);
        }

        try {
            String effectiveMime = (mimeType != null && !mimeType.isBlank()) ? mimeType : "image/jpeg";
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String dataUrl = "data:" + effectiveMime + ";base64," + base64Image;

            String systemPrompt = """
                    Eres un asistente de visión comercial para una tienda de comercio electrónico en Honduras (SMAK).
                    Tu función es analizar la imagen o banner publicitario que el cliente envió por WhatsApp porque le interesa comprar o cotizar ese producto.
                    Debes extraer con máxima precisión:
                    1. "sku": Código alfanumérico visible de referencia o SKU (por ejemplo: EZRY123, SKM-956, ZGS-534, etc.). Revisa especialmente las esquinas, textos pequeños o identificadores del producto. Si no hay ningún SKU o código visible, pon null.
                    2. "productName": Nombre o tipo del producto principal visible en la imagen (por ejemplo: "Silla de Oficina", "Lavabo metros", "Bicicleta Infantil", "Escritorio").
                    3. "detectedPrice": Precio numérico en Lempiras visible en la imagen si existe (ejemplo: 995.0), o null si no se aprecia.
                    4. "summary": Resumen breve de 1 línea de lo observado en la imagen.
                    
                    Responde ÚNICAMENTE en JSON con estos campos exactos.
                    """;

            String userTextPrompt = "Por favor identifica el producto, SKU y precio de esta imagen. "
                    + (caption != null && !caption.isBlank() ? "El cliente escribió junto a la foto: \"" + caption + "\"." : "");

            List<Map<String, Object>> userContent = List.of(
                    Map.of("type", "text", "text", userTextPrompt),
                    Map.of("type", "image_url", "image_url", Map.of("url", dataUrl, "detail", "high"))
            );

            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("model", openAiModel);
            requestBody.put("temperature", 0.1);
            requestBody.put("max_tokens", 350);
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userContent)
            ));
            requestBody.put("response_format", Map.of("type", "json_object"));

            JsonNode responseNode = restClient.post()
                    .uri(openAiBaseUrl + "/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(JsonNode.class);

            if (responseNode != null && responseNode.has("choices") && !responseNode.get("choices").isEmpty()) {
                String contentJson = responseNode.get("choices").get(0).path("message").path("content").asText("");
                if (!contentJson.isBlank()) {
                    JsonNode parsed = objectMapper.readTree(contentJson);
                    String sku = parsed.hasNonNull("sku") ? parsed.get("sku").asText().trim() : null;
                    String productName = parsed.hasNonNull("productName") ? parsed.get("productName").asText().trim() : null;
                    Double detectedPrice = parsed.hasNonNull("detectedPrice") ? parsed.get("detectedPrice").asDouble() : null;
                    String summary = parsed.hasNonNull("summary") ? parsed.get("summary").asText().trim() : caption;

                    // Limpieza de SKU (remover comillas o espacios extras)
                    if (sku != null) {
                        sku = sku.replaceAll("[\"']", "").trim();
                        if (sku.equalsIgnoreCase("null") || sku.isBlank()) {
                            sku = null;
                        }
                    }

                    log.info("Visión GPT-4o-mini completada -> SKU: [{}], Producto: [{}], Precio: [{}], Resumen: [{}]",
                            sku, productName, detectedPrice, summary);

                    return new ProductVisionResult(sku, productName, detectedPrice, summary);
                }
            }

            log.warn("Respuesta vacía o inesperada de OpenAI Vision para imagen.");
        } catch (Exception ex) {
            log.error("Error al procesar análisis visual con OpenAI GPT-4o-mini: {}", ex.getMessage(), ex);
        }

        return new ProductVisionResult(null, null, null, caption);
    }
}

