package com.smakbot.core.infrastructure.service.redis;

import com.smakbot.core.infrastructure.config.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;

/**
 * Servicio de lista negra de tokens JWT en Redis.
 * Permite invalidar tokens de inmediato al hacer Logout administrativo.
 */
@Service
public class JwtBlacklistService {

    private static final Logger log = LoggerFactory.getLogger(JwtBlacklistService.class);
    private static final String KEY_PREFIX = "smakbot:jwt:blacklist:";

    private final StringRedisTemplate redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtBlacklistService(StringRedisTemplate redisTemplate, JwtTokenProvider jwtTokenProvider) {
        this.redisTemplate = redisTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Invalida un token añadiéndolo a Redis con un TTL igual al tiempo que le reste de vigencia.
     */
    public void blacklist(String token) {
        if (token == null || token.isBlank()) return;

        try {
            long remainingMs = jwtTokenProvider.getRemainingValidityMilliseconds(token);
            if (remainingMs <= 0) {
                log.debug("Token ya ha expirado, no se requiere blacklisting en Redis");
                return;
            }

            String hash = hashToken(token);
            String key = KEY_PREFIX + hash;
            redisTemplate.opsForValue().set(key, "revoked", Duration.ofMillis(remainingMs));
            log.info("Token JWT revocado en Redis exitosamente. TTL restante: {} ms", remainingMs);
        } catch (Exception ex) {
            log.warn("Error al registrar token en blacklist de Redis: {}", ex.getMessage());
        }
    }

    /**
     * Comprueba si el token se encuentra en la lista negra de Redis.
     */
    public boolean isBlacklisted(String token) {
        if (token == null || token.isBlank()) return false;

        try {
            String hash = hashToken(token);
            String key = KEY_PREFIX + hash;
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception ex) {
            log.warn("Redis no disponible para validar blacklist de JWT. Fallback a validación de firma: {}", ex.getMessage());
            return false;
        }
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return String.valueOf(token.hashCode());
        }
    }
}
