package com.smakbot.core.domain.ports.out;

import com.smakbot.core.domain.model.WhatsAppConfig;

/** Envío de mensajes salientes al canal (Meta Graph API). */
public interface NotificationSenderPort {

    void sendText(WhatsAppConfig config, String to, String text);

    void sendImage(WhatsAppConfig config, String to, String imageUrl, String caption);

    void sendAudio(WhatsAppConfig config, String to, String audioUrl);

    void sendAudio(WhatsAppConfig config, String to, byte[] audioBytes, String mimeType);

    void sendInteractiveButtons(WhatsAppConfig config, String to, String text, java.util.List<WhatsAppButton> buttons);

    byte[] downloadMedia(WhatsAppConfig config, String mediaId);

    void markAsReadAndTyping(WhatsAppConfig config, String messageId);

    record WhatsAppButton(String id, String title) {}
}
