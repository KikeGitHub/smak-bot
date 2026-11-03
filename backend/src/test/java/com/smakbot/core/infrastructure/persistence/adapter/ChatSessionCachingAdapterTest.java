package com.smakbot.core.infrastructure.persistence.adapter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.smakbot.core.domain.model.Channel;
import com.smakbot.core.domain.model.ChatSession;
import com.smakbot.core.domain.model.CheckoutDraft;
import com.smakbot.core.domain.model.CheckoutStep;
import com.smakbot.core.infrastructure.persistence.dto.ChatSessionRedisDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatSessionCachingAdapterTest {

    @Mock
    private ChatSessionJpaAdapter jpaAdapter;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    private ObjectMapper objectMapper;
    private ChatSessionCachingAdapter adapter;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        adapter = new ChatSessionCachingAdapter(jpaAdapter, redisTemplate, objectMapper, 45, 24);
    }

    @Test
    void findById_returnsSessionFromRedis_whenCacheHit() throws Exception {
        String sessionId = "smak:WHATSAPP:5215512345678";
        ChatSession domainSession = new ChatSession(sessionId, "smak", Channel.WHATSAPP);
        domainSession.setSelectedSku("SILLA-001");
        domainSession.setStep(CheckoutStep.IDLE);
        ChatSessionRedisDto dto = ChatSessionRedisDto.fromDomain(domainSession);
        String json = objectMapper.writeValueAsString(dto);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("smakbot:session:" + sessionId)).thenReturn(json);

        Optional<ChatSession> result = adapter.findById(sessionId);

        assertTrue(result.isPresent());
        assertEquals("SILLA-001", result.get().getSelectedSku());
    }

    @Test
    void findById_fetchesFromJpaAndCaches_whenCacheMiss() {
        String sessionId = "smak:WHATSAPP:5215512345678";
        ChatSession jpaSession = new ChatSession(sessionId, "smak", Channel.WHATSAPP);
        jpaSession.setSelectedSku("ESCRITORIO-002");
        jpaSession.setLastInteraction(OffsetDateTime.now().minusMinutes(10)); // reciente

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("smakbot:session:" + sessionId)).thenReturn(null);
        when(jpaAdapter.findById(sessionId)).thenReturn(Optional.of(jpaSession));

        Optional<ChatSession> result = adapter.findById(sessionId);

        assertTrue(result.isPresent());
        assertEquals("ESCRITORIO-002", result.get().getSelectedSku());
        verify(valueOperations).set(eq("smakbot:session:" + sessionId), anyString(), any(Duration.class));
    }

    @Test
    void findById_resetsStaleSession_whenOlderThan45Minutes() {
        String sessionId = "smak:WHATSAPP:5215512345678";
        ChatSession jpaSession = new ChatSession(sessionId, "smak", Channel.WHATSAPP);
        jpaSession.setSelectedSku("SILLA-OBSOLETA");
        jpaSession.setLastInteraction(OffsetDateTime.now().minusMinutes(120)); // 2 horas de antigüedad

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("smakbot:session:" + sessionId)).thenReturn(null);
        when(jpaAdapter.findById(sessionId)).thenReturn(Optional.of(jpaSession));

        Optional<ChatSession> result = adapter.findById(sessionId);

        assertTrue(result.isPresent());
        assertNull(result.get().getSelectedSku(), "La memoria del producto obsoleto debe haberse reseteado");
        assertEquals(CheckoutStep.IDLE, result.get().getStep());
        verify(jpaAdapter).save(jpaSession);
    }

    @Test
    void findById_fallsBackToJpa_whenRedisFails() {
        String sessionId = "smak:WHATSAPP:5215512345678";
        ChatSession jpaSession = new ChatSession(sessionId, "smak", Channel.WHATSAPP);
        jpaSession.setSelectedSku("SILLA-RESILIENTE");

        when(redisTemplate.opsForValue()).thenThrow(new RedisConnectionFailureException("Redis timeout"));
        when(jpaAdapter.findById(sessionId)).thenReturn(Optional.of(jpaSession));

        Optional<ChatSession> result = adapter.findById(sessionId);

        assertTrue(result.isPresent());
        assertEquals("SILLA-RESILIENTE", result.get().getSelectedSku());
    }

    @Test
    void save_persistsInJpaAndRedis() {
        String sessionId = "smak:WHATSAPP:5215512345678";
        ChatSession session = new ChatSession(sessionId, "smak", Channel.WHATSAPP);
        session.setSelectedSku("MESA-003");

        when(jpaAdapter.save(session)).thenReturn(session);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        ChatSession saved = adapter.save(session);

        assertEquals("MESA-003", saved.getSelectedSku());
        verify(jpaAdapter).save(session);
        verify(valueOperations).set(eq("smakbot:session:" + sessionId), anyString(), eq(Duration.ofMinutes(45)));
    }
}
