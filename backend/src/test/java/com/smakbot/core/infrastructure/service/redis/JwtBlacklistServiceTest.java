package com.smakbot.core.infrastructure.service.redis;

import com.smakbot.core.infrastructure.config.security.JwtTokenProvider;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtBlacklistServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    private JwtBlacklistService blacklistService;

    @BeforeEach
    void setUp() {
        blacklistService = new JwtBlacklistService(redisTemplate, jwtTokenProvider);
    }

    @Test
    void blacklist_savesTokenHashWithRemainingTtl() {
        String token = "sample.jwt.token";
        when(jwtTokenProvider.getRemainingValidityMilliseconds(token)).thenReturn(3600000L); // 1 hora
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        blacklistService.blacklist(token);

        verify(valueOperations).set(anyString(), eq("revoked"), any(Duration.class));
    }

    @Test
    void isBlacklisted_returnsTrue_whenKeyExistsInRedis() {
        String token = "sample.jwt.token";
        when(redisTemplate.hasKey(anyString())).thenReturn(Boolean.TRUE);

        boolean blacklisted = blacklistService.isBlacklisted(token);

        assertTrue(blacklisted);
    }

    @Test
    void isBlacklisted_returnsFalse_whenKeyNotInRedis() {
        String token = "valid.jwt.token";
        when(redisTemplate.hasKey(anyString())).thenReturn(Boolean.FALSE);

        boolean blacklisted = blacklistService.isBlacklisted(token);

        assertFalse(blacklisted);
    }

    @Test
    void isBlacklisted_returnsFalseGracefully_onRedisFailure() {
        String token = "sample.jwt.token";
        when(redisTemplate.hasKey(anyString())).thenThrow(new RedisConnectionFailureException("Redis offline"));

        boolean blacklisted = blacklistService.isBlacklisted(token);

        assertFalse(blacklisted, "Debe degradar a false para no bloquear usuarios si Redis cae");
    }
}
