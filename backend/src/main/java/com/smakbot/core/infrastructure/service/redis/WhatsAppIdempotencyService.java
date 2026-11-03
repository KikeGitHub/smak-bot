package com.smakbot.core.infrastructure.service.redis;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Servicio de Idempotencia para Webhooks de Meta (WhatsApp Cloud API).
 * Garantiza que si Meta reintenta enviar el mismo webhook por latencia,
 * no se ejecuten flujos duplicados ni se le responda dos veces al usuario.
 */
@Service
public class WhatsAppIdempotencyService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppIdempotencyService.class);
    private static final String KEY_PREFIX = "smakbot:meta:msg:";

    private final StringRedisTemplate stringRedisTemplate;
    private final Duration ttl;

    public WhatsAppIdempotencyService(
            StringRedisTemplate stringRedisTemplate,
            @Value("${smakbot.redis.idempotency-ttl-minutes:5}") long ttlMinutes) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.ttl = Duration.ofMinutes(ttlMinutes);
    }

    /**
     * Verifica de forma atómica (SETNX) si el mensaje es recibido por primera vez.
     * Si Redis no está disponible, se aplica degradación elegante permitiendo procesar el mensaje.
     *
     * @param messageId ID único emitido por Meta (ej. wamid.HBg...)
     * @return true si es el primer procesamiento; false si es un duplicado detectado
     */
    public boolean isFirstTime(String messageId) {
        if (messageId == null || messageId.isBlank()) {
            return true;
        }

        try {
            String key = KEY_PREFIX + messageId;
            Boolean isNew = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", ttl);
            return Boolean.TRUE.equals(isNew);
        } catch (Exception ex) {
            log.warn("Redis no disponible para validar idempotencia del mensaje [{}]. Fallback a procesamiento directo. Motivo: {}",
                    messageId, ex.getMessage());
            return true;
        }
    }
}
