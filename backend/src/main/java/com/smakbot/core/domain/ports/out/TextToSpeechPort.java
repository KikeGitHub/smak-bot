package com.smakbot.core.domain.ports.out;

/**
 * Puerto de salida para síntesis de voz (Text-to-Speech).
 * Convierte texto generado por el motor de ventas en bytes de audio reproducibles.
 */
public interface TextToSpeechPort {

    byte[] synthesize(String text);
}
