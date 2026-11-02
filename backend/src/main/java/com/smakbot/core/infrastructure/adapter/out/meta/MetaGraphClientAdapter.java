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

    @Override
    public void sendText(WhatsAppConfig config, String to, String text) {
        if (config == null || to == null || text == null) {
            log.warn("Parámetros incompletos para envío de texto a WhatsApp");
            return;
        }

        if (!outboundEnabled) {
            log.info("[SANDBOX META WA] -> Para: {} | PhoneID: {} | Mensaje:\n{}", to, config.phoneNumberId(), text);
            return;
        }

        try {
            String url = String.format("%s/%s/messages", graphBaseUrl, config.phoneNumberId());

            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "recipient_type", "individual",
                    "to", to,
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

            log.info("Mensaje de texto enviado con éxito vía Meta a {}", to);
        } catch (Exception ex) {
            log.error("Error al enviar mensaje vía Meta Graph API a {}: {}", to, ex.getMessage(), ex);
        }
    }

    @Override
    public void sendImage(WhatsAppConfig config, String to, String imageUrl, String caption) {
        if (config == null || to == null || imageUrl == null) {
            log.warn("Parámetros incompletos para envío de imagen a WhatsApp");
            return;
        }

        if (!outboundEnabled) {
            log.info("[SANDBOX META WA IMAGE] -> Para: {} | URL: {} | Pie:\n{}", to, imageUrl, caption);
            return;
        }

        try {
            String url = String.format("%s/%s/messages", graphBaseUrl, config.phoneNumberId());

            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "recipient_type", "individual",
                    "to", to,
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

            log.info("Imagen enviada con éxito vía Meta a {}", to);
        } catch (Exception ex) {
            log.error("Error al enviar imagen vía Meta Graph API a {}: {}", to, ex.getMessage(), ex);
        }
    }

    @Override
    public void sendAudio(WhatsAppConfig config, String to, String audioUrl) {
        if (config == null || to == null || audioUrl == null) {
            log.warn("Parámetros incompletos para envío de audio a WhatsApp");
            return;
        }

        if (!outboundEnabled) {
            log.info("[SANDBOX META WA AUDIO] -> Para: {} | URL de Audio: {}", to, audioUrl);
            return;
        }

        try {
            String url = String.format("%s/%s/messages", graphBaseUrl, config.phoneNumberId());

            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "recipient_type", "individual",
                    "to", to,
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

            log.info("Nota de voz enviada con éxito vía Meta a {}", to);
        } catch (Exception ex) {
            log.error("Error al enviar audio vía Meta Graph API a {}: {}", to, ex.getMessage(), ex);
        }
    }
}

