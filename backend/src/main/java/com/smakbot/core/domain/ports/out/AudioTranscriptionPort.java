package com.smakbot.core.domain.ports.out;

/**
 * Puerto de salida para transcripción de audio (Speech-to-Text).
 * Permite procesar notas de voz recibidas desde WhatsApp o el Widget Web
 * convirtiendo el stream de audio a texto mediante Whisper u otro motor STT.
 */
public interface AudioTranscriptionPort {

    /**
     * Transcribe un archivo o payload de audio a texto.
     *
     * @param audioBytes bytes del archivo de audio (ogg, mp3, webm, etc.)
     * @param mimeType   tipo MIME del audio (ej. audio/ogg; codecs=opus)
     * @param fileName   nombre referencial del archivo
     * @return texto transcrito en lenguaje natural
     */
    String transcribe(byte[] audioBytes, String mimeType, String fileName);
}
