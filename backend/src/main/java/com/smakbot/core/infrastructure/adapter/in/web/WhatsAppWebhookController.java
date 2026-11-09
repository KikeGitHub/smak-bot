package com.smakbot.core.infrastructure.adapter.in.web;

import com.smakbot.core.domain.model.BotReply;
import com.smakbot.core.domain.model.Channel;
import com.smakbot.core.domain.model.GeoLocation;
import com.smakbot.core.domain.model.IncomingMessage;
import com.smakbot.core.domain.model.WhatsAppConfig;
import com.smakbot.core.domain.ports.in.ProcessMessageUseCase;
import com.smakbot.core.domain.ports.out.NotificationSenderPort;
import com.smakbot.core.domain.ports.out.WhatsAppConfigRepositoryPort;
import com.smakbot.core.infrastructure.adapter.in.web.dto.WhatsAppWebhookPayload;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/whatsapp")
@Tag(name = "WhatsApp Cloud API Webhook", description = "Recepción de eventos y apretón de manos con Meta Graph API")
public class WhatsAppWebhookController {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppWebhookController.class);

    private final WhatsAppConfigRepositoryPort configRepositoryPort;
    private final ProcessMessageUseCase processMessageUseCase;
    private final NotificationSenderPort notificationSenderPort;
    private final com.smakbot.core.domain.ports.out.AudioTranscriptionPort audioTranscriptionPort;
    private final com.smakbot.core.domain.ports.out.TextToSpeechPort textToSpeechPort;
    private final com.smakbot.core.infrastructure.service.redis.WhatsAppIdempotencyService idempotencyService;

    public WhatsAppWebhookController(WhatsAppConfigRepositoryPort configRepositoryPort,
                                     ProcessMessageUseCase processMessageUseCase,
                                     NotificationSenderPort notificationSenderPort,
                                     com.smakbot.core.domain.ports.out.AudioTranscriptionPort audioTranscriptionPort,
                                     com.smakbot.core.domain.ports.out.TextToSpeechPort textToSpeechPort,
                                     com.smakbot.core.infrastructure.service.redis.WhatsAppIdempotencyService idempotencyService) {
        this.configRepositoryPort = configRepositoryPort;
        this.processMessageUseCase = processMessageUseCase;
        this.notificationSenderPort = notificationSenderPort;
        this.audioTranscriptionPort = audioTranscriptionPort;
        this.textToSpeechPort = textToSpeechPort;
        this.idempotencyService = idempotencyService;
    }

    @GetMapping("/webhook")
    @Operation(summary = "Verificación de Webhook (Meta Handshake)",
               description = "Responde a la solicitud de validación de URL de webhook de Meta devolviendo hub.challenge")
    public ResponseEntity<String> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
            @RequestParam("hub.challenge") String challenge) {

        log.info("Verificación de webhook recibida: mode={}, token={}", mode, token);

        if ("subscribe".equals(mode)) {
            boolean valid = configRepositoryPort.findByVerifyToken(token).isPresent();

            // O token de desarrollo por defecto
            if (valid || "smakbot_secret_token_2026".equals(token) || "smakbot-verify-dev".equals(token)) {
                log.info("Webhook de Meta verificado con éxito");
                return ResponseEntity.ok(challenge);
            }
        }

        log.warn("Verificación de webhook de Meta fallida. Token no coincide: {}", token);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification token mismatch");
    }

    @PostMapping("/webhook")
    @Operation(summary = "Recepción de eventos de WhatsApp",
               description = "Recibe mensajes entrantes, confirmaciones y ubicaciones GPS desde Meta Cloud API")
    public ResponseEntity<String> receiveWebhook(@RequestBody WhatsAppWebhookPayload payload) {
        // Responder HTTP 200 inmediatamente a Meta para cumplir con el SLA de < 3000ms
        processIncomingPayloadAsync(payload);
        return ResponseEntity.ok("EVENT_RECEIVED");
    }

    @Async("whatsappTaskExecutor")
    public void processIncomingPayloadAsync(WhatsAppWebhookPayload payload) {
        if (payload == null || payload.getEntry() == null) {
            return;
        }

        for (WhatsAppWebhookPayload.Entry entry : payload.getEntry()) {
            if (entry.getChanges() == null) continue;

            for (WhatsAppWebhookPayload.Change change : entry.getChanges()) {
                if (change.getValue() == null) continue;
                WhatsAppWebhookPayload.Value val = change.getValue();

                String phoneNumberId = (val.getMetadata() != null) ? val.getMetadata().getPhoneNumberId() : null;
                if (phoneNumberId == null || val.getMessages() == null) continue;

                // Buscar tenant asociado a este phone_number_id
                Optional<WhatsAppConfig> configOpt = configRepositoryPort.findByPhoneNumberId(phoneNumberId);
                if (configOpt.isEmpty()) {
                    log.warn("No existe configuración para phone_number_id [{}]. Usando tenant por defecto [smak] para desarrollo.", phoneNumberId);
                    configOpt = configRepositoryPort.findByTenantId("smak");
                }
                if (configOpt.isEmpty()) {
                    log.warn("No existe configuración de tenant disponible para procesar el mensaje.");
                    continue;
                }
                WhatsAppConfig config = configOpt.get();

                for (WhatsAppWebhookPayload.Message msg : val.getMessages()) {
                    if (msg.getId() != null && !idempotencyService.isFirstTime(msg.getId())) {
                        log.info("Mensaje duplicado de Meta ignorado para messageId: {}", msg.getId());
                        continue;
                    }
                    handleSingleMessage(config, val, msg);
                }
            }
        }
    }

    private void handleSingleMessage(WhatsAppConfig config, WhatsAppWebhookPayload.Value val, WhatsAppWebhookPayload.Message msg) {
        String from = msg.getFrom();
        String contactName = "Cliente WhatsApp";
        if (val.getContacts() != null && !val.getContacts().isEmpty()) {
            WhatsAppWebhookPayload.Contact c = val.getContacts().get(0);
            if (c.getProfile() != null && c.getProfile().getName() != null) {
                contactName = c.getProfile().getName();
            }
        }

        String messageText = "";
        GeoLocation location = null;

        if ("text".equalsIgnoreCase(msg.getType()) && msg.getText() != null) {
            messageText = msg.getText().getBody();
        } else if ("location".equalsIgnoreCase(msg.getType()) && msg.getLocation() != null) {
            WhatsAppWebhookPayload.Location loc = msg.getLocation();
            location = new GeoLocation(loc.getLatitude(), loc.getLongitude(), loc.getAddress());
            messageText = (loc.getAddress() != null && !loc.getAddress().isBlank())
                    ? loc.getAddress()
                    : "Ubicación GPS enviada";
        } else if ("interactive".equalsIgnoreCase(msg.getType()) && msg.getInteractive() != null) {
            if (msg.getInteractive().getButtonReply() != null) {
                String btnId = msg.getInteractive().getButtonReply().getId();
                String btnTitle = msg.getInteractive().getButtonReply().getTitle();
                if ("btn_confirm".equalsIgnoreCase(btnId)) {
                    messageText = "Confirmar";
                } else if ("btn_modify".equalsIgnoreCase(btnId)) {
                    messageText = "Modificar dirección";
                } else {
                    messageText = btnTitle != null ? btnTitle : btnId;
                }
            }
        }

        boolean isVoiceInput = ("audio".equalsIgnoreCase(msg.getType()) || "voice".equalsIgnoreCase(msg.getType())) && msg.getAudio() != null;
        if (isVoiceInput) {
            String mediaId = msg.getAudio().getId();
            String mimeType = msg.getAudio().getMimeType() != null ? msg.getAudio().getMimeType() : "audio/ogg";
            log.info("Nota de voz recibida de WhatsApp con MediaId: {}, descargando archivo de Meta...", mediaId);
            byte[] audioBytes = notificationSenderPort.downloadMedia(config, mediaId);
            if (audioBytes != null && audioBytes.length > 0) {
                log.info("Audio descargado con éxito de Meta ({} bytes). Transcribiendo con Whisper...", audioBytes.length);
                messageText = audioTranscriptionPort.transcribe(audioBytes, mimeType, "whatsapp_audio_" + mediaId + ".ogg");
            } else {
                log.warn("No se pudieron descargar los bytes del audio de Meta, ejecutando fallback de audio...");
                messageText = audioTranscriptionPort.transcribe(new byte[0], mimeType, "whatsapp_audio_" + mediaId + ".ogg");
            }
            log.info("Texto transcrito de nota de voz WA: '{}'", messageText);
        }

        log.info("Mensaje WA entrante de [{}] para tenant [{}]: '{}'", from, config.tenantId(), messageText);

        // Fase 2: Activar marca de leído e indicador de escritura en WhatsApp ("Escribiendo...")
        if (msg.getId() != null && !msg.getId().isBlank()) {
            notificationSenderPort.markAsReadAndTyping(config, msg.getId());
        }

        IncomingMessage incoming = new IncomingMessage(
                config.tenantId(),
                Channel.WHATSAPP,
                from,
                messageText,
                location
        );

        try {
            BotReply reply = processMessageUseCase.process(incoming);

            // Fase 2: Pausa orgánica (1.5 segundos) para simular tiempo de lectura y tipeo humano
            try {
                Thread.sleep(1500);
            } catch (InterruptedException ignored) {}

            // 1. Si el cliente envió audio, responder con nota de voz TTS sintetizada
            if (isVoiceInput) {
                log.info("Cliente envió nota de voz. Sintetizando respuesta con TTS...");
                byte[] voiceReplyBytes = textToSpeechPort.synthesize(reply.text());
                if (voiceReplyBytes != null && voiceReplyBytes.length > 0) {
                    notificationSenderPort.sendAudio(config, from, voiceReplyBytes, "audio/mpeg");
                }
            }

            // 2. Despachar respuesta complementaria (botones interactivos, imágenes o texto) hacia WhatsApp
            boolean isConfirmationStep = reply.step() == com.smakbot.core.domain.model.CheckoutStep.CONFIRM;
            java.util.List<String> images = (reply.images() != null) ? reply.images() : java.util.List.of();

            if (isConfirmationStep) {
                // Enviar botones interactivos nativos de WhatsApp para confirmación táctil
                java.util.List<NotificationSenderPort.WhatsAppButton> buttons = java.util.List.of(
                        new NotificationSenderPort.WhatsAppButton("btn_confirm", "✅ Confirmar"),
                        new NotificationSenderPort.WhatsAppButton("btn_modify", "✏️ Modificar")
                );
                notificationSenderPort.sendInteractiveButtons(config, from, reply.text(), buttons);
            } else if (images.size() == 1) {
                // Imagen individual: foto principal con el texto explicativo como pie de foto
                notificationSenderPort.sendImage(config, from, images.get(0), reply.text());
            } else if (images.size() > 1) {
                // Solicitud de galería completa: primero enviamos el mensaje de texto
                notificationSenderPort.sendText(config, from, reply.text());
                // Despachar imágenes consecutivas sin pie de foto para que WhatsApp forme la cuadrícula (álbum nativo)
                for (String extraImage : images) {
                    if (extraImage != null && !extraImage.isBlank()) {
                        try {
                            Thread.sleep(120);
                        } catch (InterruptedException ignored) {}
                        notificationSenderPort.sendImage(config, from, extraImage, null);
                    }
                }
            } else {
                notificationSenderPort.sendText(config, from, reply.text());
            }
        } catch (Exception ex) {
            log.error("Error al procesar mensaje WA de {}: {}", from, ex.getMessage(), ex);
        }
    }
}
