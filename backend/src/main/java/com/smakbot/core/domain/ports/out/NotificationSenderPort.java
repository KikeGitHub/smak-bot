package com.smakbot.core.domain.ports.out;

import com.smakbot.core.domain.model.WhatsAppConfig;
import java.util.List;

/** Envío de mensajes salientes al canal (Meta Graph API). */
public interface NotificationSenderPort {

    void sendText(WhatsAppConfig config, String to, String text);

    void sendImage(WhatsAppConfig config, String to, String imageUrl, String caption);

    void sendAudio(WhatsAppConfig config, String to, String audioUrl);

    void sendAudio(WhatsAppConfig config, String to, byte[] audioBytes, String mimeType);

    void sendInteractiveButtons(WhatsAppConfig config, String to, String text, List<WhatsAppButton> buttons);

    /**
     * Envía una plantilla tipo carrusel (tarjetas deslizables horizontales con imágenes) mediante Meta WhatsApp Cloud API.
     * Retorna true si el despacho tuvo éxito (o se simuló en sandbox), o false si falló para activar el fallback a álbum nativo.
     */
    boolean sendCarouselTemplate(WhatsAppConfig config, String to, String templateName, String languageCode, String bodyText, List<CarouselCard> cards);

    byte[] downloadMedia(WhatsAppConfig config, String mediaId);

    void markAsReadAndTyping(WhatsAppConfig config, String messageId);

    record WhatsAppButton(String id, String title) {}

    record CarouselCard(int cardIndex, String imageUrl, String bodyText, String buttonPayload) {
        public CarouselCard(int cardIndex, String imageUrl) {
            this(cardIndex, imageUrl, null, null);
        }
        public CarouselCard(int cardIndex, String imageUrl, String bodyText) {
            this(cardIndex, imageUrl, bodyText, null);
        }
    }
}

