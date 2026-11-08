package com.smakbot.core.infrastructure.persistence.adapter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smakbot.core.domain.model.Channel;
import com.smakbot.core.domain.model.ChatSession;
import com.smakbot.core.domain.model.CheckoutDraft;
import com.smakbot.core.domain.model.CheckoutStep;
import com.smakbot.core.domain.model.ConversationTurn;
import com.smakbot.core.domain.ports.out.ChatSessionRepositoryPort;
import com.smakbot.core.infrastructure.persistence.entity.ChatSessionEntity;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataChatSessionRepository;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Component
public class ChatSessionJpaAdapter implements ChatSessionRepositoryPort {

    private final SpringDataChatSessionRepository repo;
    private final ObjectMapper objectMapper;

    public ChatSessionJpaAdapter(SpringDataChatSessionRepository repo, ObjectMapper objectMapper) {
        this.repo = repo;
        this.objectMapper = objectMapper;
    }

    @Override
    public Optional<ChatSession> findById(String sessionId) {
        return repo.findById(sessionId).map(this::toDomain);
    }

    @Override
    public ChatSession save(ChatSession session) {
        ChatSessionEntity entity = repo.findById(session.getId()).orElseGet(ChatSessionEntity::new);
        entity.setId(session.getId());
        entity.setTenantId(session.getTenantId());
        entity.setChannel(session.getChannel().name());
        entity.setCurrentStep(session.getStep().name());
        entity.setLastInteraction(session.getLastInteraction());

        Map<String, Object> data = new HashMap<>();
        if (session.getSelectedSku() != null) data.put("selectedSku", session.getSelectedSku());
        if (session.getLastOrderNumber() != null) data.put("lastOrderNumber", session.getLastOrderNumber());
        if (session.getActiveCategory() != null) data.put("activeCategory", session.getActiveCategory());
        if (session.getOfferedSkus() != null && !session.getOfferedSkus().isEmpty()) {
            data.put("offeredSkus", session.getOfferedSkus());
        }
        if (session.getHistory() != null && !session.getHistory().isEmpty()) {
            List<Map<String, Object>> historyMaps = objectMapper.convertValue(session.getHistory(), new TypeReference<>() {});
            data.put("history", historyMaps);
        }
        if (session.getFallbackCount() > 0) {
            data.put("fallbackCount", session.getFallbackCount());
        }
        if (session.getCheckout() != null) {
            Map<String, Object> draftMap = objectMapper.convertValue(session.getCheckout(), new TypeReference<>() {});
            data.put("checkout", draftMap);
        }
        entity.setSessionData(data);

        ChatSessionEntity saved = repo.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(String sessionId) {
        repo.deleteById(sessionId);
    }

    private ChatSession toDomain(ChatSessionEntity e) {
        Channel channel = Channel.valueOf(e.getChannel());
        ChatSession s = new ChatSession(e.getId(), e.getTenantId(), channel);
        if (e.getCurrentStep() != null) {
            try {
                s.setStep(CheckoutStep.valueOf(e.getCurrentStep()));
            } catch (IllegalArgumentException ignored) {
                s.setStep(CheckoutStep.IDLE);
            }
        }
        s.setLastInteraction(e.getLastInteraction());

        Map<String, Object> data = e.getSessionData();
        if (data != null) {
            if (data.get("selectedSku") instanceof String sku) s.setSelectedSku(sku);
            if (data.get("lastOrderNumber") instanceof String lon) s.setLastOrderNumber(lon);
            if (data.get("activeCategory") instanceof String cat) s.setActiveCategory(cat);
            if (data.get("fallbackCount") instanceof Number fc) s.setFallbackCount(fc.intValue());
            if (data.get("offeredSkus") instanceof List<?> list) {
                List<String> skus = list.stream().filter(Objects::nonNull).map(Object::toString).toList();
                s.setOfferedSkus(skus);
            }
            if (data.get("history") != null) {
                try {
                    List<ConversationTurn> turns = objectMapper.convertValue(data.get("history"), new TypeReference<List<ConversationTurn>>() {});
                    s.setHistory(turns);
                } catch (Exception ignored) {
                }
            }
            if (data.get("checkout") != null) {
                try {
                    CheckoutDraft draft = objectMapper.convertValue(data.get("checkout"), CheckoutDraft.class);
                    s.setCheckout(draft);
                } catch (Exception ignored) {
                }
            }
        }
        return s;
    }
}
