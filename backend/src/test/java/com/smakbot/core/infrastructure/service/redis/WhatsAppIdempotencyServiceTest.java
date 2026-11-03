package com.smakbot.core.infrastructure.service.redis;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WhatsAppIdempotencyServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    private WhatsAppIdempotencyService idempotencyService;

    @BeforeEach
    void setUp() {
        idempotencyService = new WhatsAppIdempotencyService(redisTemplate, 5);
    }

    @Test
    void isFirstTime_returnsTrue_whenKeyDoesNotExist() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.setIfAbsent(eq("smakbot:meta:msg:wamid.12345"), eq("1"), any(Duration.class)))
                .thenReturn(Boolean.TRUE);

        boolean result = idempotencyService.isFirstTime("wamid.12345");

        assertTrue(result);
    }

    @Test
    void isFirstTime_returnsFalse_whenKeyAlreadyExistsInRedis() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.setIfAbsent(eq("smakbot:meta:msg:wamid.12345"), eq("1"), any(Duration.class)))
                .thenReturn(Boolean.FALSE);

        boolean result = idempotencyService.isFirstTime("wamid.12345");

        assertFalse(result, "Debe retornar false para mensajes duplicados");
    }

    @Test
    void isFirstTime_returnsTrueGracefully_whenRedisFails() {
        when(redisTemplate.opsForValue()).thenThrow(new RedisConnectionFailureException("Connection refused"));

        boolean result = idempotencyService.isFirstTime("wamid.12345");

        assertTrue(result, "En caso de falla de Redis, debe degradar elegantemente permitiendo el mensaje");
    }

    @Test
    void isFirstTime_returnsTrue_whenMessageIdIsNull() {
        assertTrue(idempotencyService.isFirstTime(null));
        assertTrue(idempotencyService.isFirstTime(""));
    }
}
