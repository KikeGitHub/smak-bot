package com.smakbot.core.infrastructure.adapter.out.tts;

import com.smakbot.core.domain.ports.out.TextToSpeechPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Adaptador de síntesis de voz (TTS) conectado al servicio FastAPI de Codespaces.
 * Limpia el markdown antes de sintetizar para que la locución sea 100% natural.
 */
@Component
public class EdgeTtsAdapter implements TextToSpeechPort {

    private static final Logger log = LoggerFactory.getLogger(EdgeTtsAdapter.class);

    private final String ttsUrl;
    private final RestTemplate restTemplate;

    public EdgeTtsAdapter(
            @Value("${smakbot.transcription.tts-url:https://automatic-space-dollop-976prv4wg4ghpqqx-8000.app.github.dev/v1/tts/synthesize}") String ttsUrl) {
        this.ttsUrl = ttsUrl;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(15000);
        this.restTemplate = new RestTemplate(factory);
    }

    @Override
    public byte[] synthesize(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }

        try {
            String speechText = cleanForSpeech(text);
            if (speechText.isBlank()) {
                return null;
            }

            log.info("Sintetizando voz TTS para texto ({} caracteres) hacia {}", speechText.length(), ttsUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of(
                    "text", speechText,
                    "voice", "es-MX-DaliaNeural"
            );

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            byte[] audioBytes = restTemplate.postForObject(ttsUrl, request, byte[].class);

            if (audioBytes != null && audioBytes.length > 0) {
                log.info("Audio TTS sintetizado exitosamente ({} bytes)", audioBytes.length);
                return audioBytes;
            }
        } catch (Exception ex) {
            log.warn("No se pudo sintetizar voz con el servicio TTS (Codespace offline o endpoint no listo): {}", ex.getMessage());
        }
        return null;
    }

    /**
     * Remueve formato Markdown, URLs, viñetas y emojis para que la voz no deletree caracteres extraños.
     */
    private String cleanForSpeech(String text) {
        String s = text.replaceAll("\\[([^\\]]+)\\]\\([^\\)]+\\)", "$1"); // enlaces a texto plano
        s = s.replaceAll("https?://\\S+", ""); // eliminar urls crudas
        s = s.replaceAll("[*#_~`]", ""); // markdown
        s = s.replaceAll("[•·-]", ", "); // viñetas a pausas de coma
        s = s.replaceAll("[\\p{So}\\p{Cn}]", ""); // emojis
        s = s.replaceAll("\\s+", " ").trim();
        return s;
    }
}
