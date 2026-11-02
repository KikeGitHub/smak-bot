package com.smakbot.core.infrastructure.adapter.out.meta;

import com.smakbot.core.domain.model.WhatsAppConfig;
import com.smakbot.core.domain.ports.out.NotificationSenderPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Adaptador de salida para la API de Meta WhatsApp Cloud.
 * En modo sandbox / local (outboundEnabled = false), simula el envío e imprime en log.
 */
@Component
public class MetaGraphClientAdapter implements NotificationSenderPort {

    private static final Logger log = LoggerFactory.getLogger(MetaGraphClientAdapter.class);

    private final String graphBaseUrl;
    private final boolean outboundEnabled;
    private final RestClient restClient;

    public MetaGraphClientAdapter(
            @Value("${smakbot.meta.graph-base-url:https://graph.facebook.com/v20.0}") String graphBaseUrl,
            @Value("${smakbot.meta.outbound-enabled:false}") boolean outboundEnabled) {
        this.graphBaseUrl = graphBaseUrl;
        this.outboundEnabled = outboundEnabled;
        this.restClient = RestClient.builder().build();
    }

    private String normalizeRecipient(String to) {
        if (to == null) {
            return null;
        }
        String clean = to.replaceAll("[^0-9]", "");
        // Para números de México: WhatsApp entrega 521XXXXXXXXXX (13 dígitos) en el webhook entrante,
        // pero la API de Meta / Sandbox exige 52XXXXXXXXXX (12 dígitos) para coincidir con la lista de autorizados.
        if (clean.startsWith("521") && clean.length() == 13) {
            return "52" + clean.substring(3);
        }
        return clean;
    }

    @Override
    public void sendText(WhatsAppConfig config, String to, String text) {
        if (config == null || to == null || text == null) {
            log.warn("Parámetros incompletos para envío de texto a WhatsApp");
            return;
        }

        String recipient = normalizeRecipient(to);

        if (!outboundEnabled) {
            log.info("[SANDBOX META WA] -> Para: {} (orig: {}) | PhoneID: {} | Mensaje:\n{}", recipient, to, config.phoneNumberId(), text);
            return;
        }

        try {
            String url = String.format("%s/%s/messages", graphBaseUrl, config.phoneNumberId());

            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "recipient_type", "individual",
                    "to", recipient,
                    "type", "text",
                    "text", Map.of("preview_url", false, "body", text)
            );

            restClient.post()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.accessToken())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Mensaje de texto enviado con éxito vía Meta a {} (orig: {})", recipient, to);
        } catch (Exception ex) {
            log.error("Error al enviar mensaje vía Meta Graph API a {} (orig: {}): {}", recipient, to, ex.getMessage(), ex);
        }
    }

    @Override
    public void sendImage(WhatsAppConfig config, String to, String imageUrl, String caption) {
        if (config == null || to == null || imageUrl == null) {
            log.warn("Parámetros incompletos para envío de imagen a WhatsApp");
            return;
        }

        String recipient = normalizeRecipient(to);

        if (!outboundEnabled) {
            log.info("[SANDBOX META WA IMAGE] -> Para: {} (orig: {}) | URL: {} | Pie:\n{}", recipient, to, imageUrl, caption);
            return;
        }

        try {
            String url = String.format("%s/%s/messages", graphBaseUrl, config.phoneNumberId());

            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "recipient_type", "individual",
                    "to", recipient,
                    "type", "image",
                    "image", Map.of("link", imageUrl, "caption", caption != null ? caption : "")
            );

            restClient.post()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.accessToken())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Imagen enviada con éxito vía Meta a {} (orig: {})", recipient, to);
        } catch (Exception ex) {
            log.error("Error al enviar imagen vía Meta Graph API a {} (orig: {}): {}", recipient, to, ex.getMessage(), ex);
            // Fallback de resiliencia: si falla la imagen (e.g. CDN no accesible), asegurar que el cliente reciba la respuesta en texto
            if (caption != null && !caption.isBlank()) {
                log.info("Ejecutando fallback de resiliencia: enviando texto plano a {}", recipient);
                sendText(config, recipient, caption);
            }
        }
    }

    @Override
    public void sendAudio(WhatsAppConfig config, String to, String audioUrl) {
        if (config == null || to == null || audioUrl == null) {
            log.warn("Parámetros incompletos para envío de audio a WhatsApp");
            return;
        }

        String recipient = normalizeRecipient(to);

        if (!outboundEnabled) {
            log.info("[SANDBOX META WA AUDIO] -> Para: {} (orig: {}) | URL de Audio: {}", recipient, to, audioUrl);
            return;
        }

        try {
            String url = String.format("%s/%s/messages", graphBaseUrl, config.phoneNumberId());

            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "recipient_type", "individual",
                    "to", recipient,
                    "type", "audio",
                    "audio", Map.of("link", audioUrl)
            );

            restClient.post()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.accessToken())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Nota de voz enviada con éxito vía Meta a {} (orig: {})", recipient, to);
        } catch (Exception ex) {
            log.error("Error al enviar audio vía Meta Graph API a {} (orig: {}): {}", recipient, to, ex.getMessage(), ex);
        }
    }

    @Override
    public void sendAudio(WhatsAppConfig config, String to, byte[] audioBytes, String mimeType) {
        if (config == null || to == null || audioBytes == null || audioBytes.length == 0) {
            log.warn("Parámetros incompletos para envío de binario de audio a WhatsApp");
            return;
        }

        String recipient = normalizeRecipient(to);

        if (!outboundEnabled) {
            log.info("[SANDBOX META WA AUDIO BINARY] -> Para: {} (orig: {}) | Bytes: {} | Mime: {}",
                    recipient, to, audioBytes.length, mimeType);
            return;
        }

        try {
            // 1. Subir el binario de audio a Meta Cloud API para obtener un Media ID
            String uploadUrl = String.format("%s/%s/media", graphBaseUrl, config.phoneNumberId());

            org.springframework.util.MultiValueMap<String, Object> form = new org.springframework.util.LinkedMultiValueMap<>();
            form.add("messaging_product", "whatsapp");
            form.add("type", mimeType != null ? mimeType : "audio/mpeg");

            org.springframework.core.io.ByteArrayResource fileResource = new org.springframework.core.io.ByteArrayResource(audioBytes) {
                @Override
                public String getFilename() {
                    return "voice_reply.mp3";
                }
            };
            form.add("file", fileResource);

            com.fasterxml.jackson.databind.JsonNode uploadRes = restClient.post()
                    .uri(uploadUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.accessToken())
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(form)
                    .retrieve()
                    .body(com.fasterxml.jackson.databind.JsonNode.class);

            if (uploadRes != null && uploadRes.has("id")) {
                String mediaId = uploadRes.get("id").asText();
                log.info("Audio subido a Meta con éxito (MediaId: {}). Despachando a WhatsApp...", mediaId);

                // 2. Despachar el mensaje de audio a WhatsApp usando el mediaId subido
                String messageUrl = String.format("%s/%s/messages", graphBaseUrl, config.phoneNumberId());
                Map<String, Object> payload = Map.of(
                        "messaging_product", "whatsapp",
                        "recipient_type", "individual",
                        "to", recipient,
                        "type", "audio",
                        "audio", Map.of("id", mediaId)
                );

                restClient.post()
                        .uri(messageUrl)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(payload)
                        .retrieve()
                        .toBodilessEntity();

                log.info("Nota de voz en audio enviada con éxito vía Meta a {} (orig: {})", recipient, to);
            } else {
                log.error("Respuesta inesperada al subir audio a Meta: {}", uploadRes);
            }
        } catch (Exception ex) {
            log.error("Error al enviar audio binario vía Meta Graph API a {} (orig: {}): {}", recipient, to, ex.getMessage(), ex);
        }
    }

    @Override
    public void sendInteractiveButtons(WhatsAppConfig config, String to, String text, java.util.List<WhatsAppButton> buttons) {
        if (config == null || to == null || text == null || buttons == null || buttons.isEmpty()) {
            log.warn("Parámetros incompletos para envío de botones interactivos a WhatsApp");
            return;
        }

        String recipient = normalizeRecipient(to);

        if (!outboundEnabled) {
            log.info("[SANDBOX META WA BUTTONS] -> Para: {} (orig: {}) | PhoneID: {} | Botones: {} | Texto:\n{}",
                    recipient, to, config.phoneNumberId(), buttons, text);
            return;
        }

        try {
            String url = String.format("%s/%s/messages", graphBaseUrl, config.phoneNumberId());

            // Meta Cloud API limita el body text de mensajes interactivos a 1024 caracteres
            String bodyText = text.length() > 1024 ? text.substring(0, 1021) + "..." : text;

            // Formatear botones (Meta Cloud API permite máximo 3 botones de respuesta rápida)
            java.util.List<Map<String, Object>> buttonsPayload = buttons.stream()
                    .limit(3)
                    .map(btn -> Map.<String, Object>of(
                            "type", "reply",
                            "reply", Map.of(
                                    "id", btn.id(),
                                    "title", btn.title().length() > 20 ? btn.title().substring(0, 20) : btn.title()
                            )
                    ))
                    .toList();

            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "recipient_type", "individual",
                    "to", recipient,
                    "type", "interactive",
                    "interactive", Map.of(
                            "type", "button",
                            "body", Map.of("text", bodyText),
                            "action", Map.of("buttons", buttonsPayload)
                    )
            );

            restClient.post()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.accessToken())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Mensaje interactivo con {} botones enviado con éxito vía Meta a {} (orig: {})", buttons.size(), recipient, to);
        } catch (Exception ex) {
            log.error("Error al enviar mensaje interactivo vía Meta Graph API a {} (orig: {}): {}", recipient, to, ex.getMessage(), ex);
            // Fallback de resiliencia: si falla la entrega interactiva, enviar el texto plano
            log.info("Ejecutando fallback de resiliencia: enviando texto plano a {}", recipient);
            sendText(config, recipient, text);
        }
    }

    @Override
    public byte[] downloadMedia(WhatsAppConfig config, String mediaId) {
        if (config == null || mediaId == null || mediaId.isBlank()) {
            return null;
        }

        try {
            // 1. Consultar metadatos del medio para obtener la URL de descarga temporal
            String metadataUrl = String.format("%s/%s", graphBaseUrl, mediaId);
            com.fasterxml.jackson.databind.JsonNode metaRes = restClient.get()
                    .uri(metadataUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.accessToken())
                    .retrieve()
                    .body(com.fasterxml.jackson.databind.JsonNode.class);

            if (metaRes != null && metaRes.has("url")) {
                String downloadUrl = metaRes.get("url").asText();
                // 2. Descargar el archivo binario real de audio autenticado con el token de Meta
                return restClient.get()
                        .uri(downloadUrl)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.accessToken())
                        .retrieve()
                        .body(byte[].class);
            }
        } catch (Exception ex) {
            log.error("Error al descargar archivo multimedia {} de Meta Graph API: {}", mediaId, ex.getMessage());
        }
        return null;
    }
}

