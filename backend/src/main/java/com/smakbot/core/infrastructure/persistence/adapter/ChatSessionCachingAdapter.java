package com.smakbot.core.infrastructure.persistence.adapter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smakbot.core.domain.model.ChatSession;
import com.smakbot.core.domain.ports.out.ChatSessionRepositoryPort;
import com.smakbot.core.infrastructure.persistence.dto.ChatSessionRedisDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Optional;

/**
 * Adaptador de repositorio de sesiones conversacionales con caché inteligente en Redis y persistencia en PostgreSQL.
 * Implementa el patrón Decorator con Graceful Degradation:
 * - Cachea sesiones en Redis con TTL de 45 minutos (o 24 horas si está en checkout activo).
 * - Si Redis expira o no encuentra la sesión, consulta PostgreSQL. Si la última interacción fue > 45 minutos atrás
 *   y no está en checkout, resetea la memoria conversacional evitando retención indefinida de productos.
 * - Si Redis se cae o no responde, degrada elegantemente a PostgreSQL sin interrumpir al cliente.
 */
@Primary
@Component
public class ChatSessionCachingAdapter implements ChatSessionRepositoryPort {

    private static final Logger log = LoggerFactory.getLogger(ChatSessionCachingAdapter.class);
    private static final String KEY_PREFIX = "smakbot:session:";

    private final ChatSessionJpaAdapter jpaAdapter;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final Duration sessionTtl;
    private final Duration checkoutTtl;

    public ChatSessionCachingAdapter(
            ChatSessionJpaAdapter jpaAdapter,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper,
            @Value("${smakbot.redis.session-ttl-minutes:45}") long sessionTtlMinutes,
            @Value("${smakbot.redis.checkout-ttl-hours:24}") long checkoutTtlHours) {
        this.jpaAdapter = jpaAdapter;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.sessionTtl = Duration.ofMinutes(sessionTtlMinutes);
        this.checkoutTtl = Duration.ofHours(checkoutTtlHours);
    }

    @Override
    public Optional<ChatSession> findById(String sessionId) {
        String key = KEY_PREFIX + sessionId;

        // 1. Intento de lectura ultrarrápida en Redis (< 1ms)
        try {
            String json = redisTemplate.opsForValue().get(key);
            if (json != null && !json.isBlank()) {
                ChatSessionRedisDto dto = objectMapper.readValue(json, ChatSessionRedisDto.class);
                log.debug("ChatSession [{}] recuperada desde caché Redis", sessionId);
                return Optional.ofNullable(dto.toDomain());
            }
        } catch (Exception ex) {
            log.warn("Fallo o indisponibilidad de Redis al leer sesión [{}]. Fallback a PostgreSQL: {}", sessionId, ex.getMessage());
        }

        // 2. Cache miss o fallo de Redis: buscar en PostgreSQL
        Optional<ChatSession> sessionOpt = jpaAdapter.findById(sessionId);
        if (sessionOpt.isPresent()) {
            ChatSession session = sessionOpt.get();

            // 3. TTL Lógico: Si la última interacción superó el TTL y no está en checkout, resetear memoria conversacional
            if (session.getLastInteraction() != null && !session.inCheckout()) {
                long minutesPassed = Duration.between(session.getLastInteraction(), OffsetDateTime.now()).toMinutes();
                if (minutesPassed >= sessionTtl.toMinutes()) {
                    log.info("Sesión [{}] inactiva por {} min (límite: {} min). Reseteando memoria de producto obsoleta.",
                            sessionId, minutesPassed, sessionTtl.toMinutes());
                    session.reset();
                    jpaAdapter.save(session);
                }
            }

            // Cachear el estado en Redis para subsecuentes mensajes de la conversación
            writeToRedis(session);
            return Optional.of(session);
        }

        return Optional.empty();
    }

    @Override
    public ChatSession save(ChatSession session) {
        // 1. Persistencia permanente en PostgreSQL
        ChatSession saved = jpaAdapter.save(session);

        // 2. Actualización de memoria activa en Redis con TTL inteligente
        writeToRedis(saved);

        return saved;
    }

    @Override
    public void deleteById(String sessionId) {
        jpaAdapter.deleteById(sessionId);
        try {
            redisTemplate.delete(KEY_PREFIX + sessionId);
        } catch (Exception ex) {
            log.warn("No se pudo eliminar clave Redis para sesión [{}]: {}", sessionId, ex.getMessage());
        }
    }

    private void writeToRedis(ChatSession session) {
        if (session == null || session.getId() == null) return;
        String key = KEY_PREFIX + session.getId();
        try {
            ChatSessionRedisDto dto = ChatSessionRedisDto.fromDomain(session);
            String json = objectMapper.writeValueAsString(dto);
            Duration ttl = session.inCheckout() ? checkoutTtl : sessionTtl;
            redisTemplate.opsForValue().set(key, json, ttl);
            log.debug("ChatSession [{}] guardada en Redis con TTL de {} segundos", session.getId(), ttl.toSeconds());
        } catch (Exception ex) {
            log.warn("Error guardando sesión [{}] en Redis. Se conserva en PostgreSQL: {}", session.getId(), ex.getMessage());
        }
    }
}
