package com.smakbot.core.domain.ports.out;

import com.smakbot.core.domain.model.ChatSession;

import java.util.Optional;

public interface ChatSessionRepositoryPort {

    Optional<ChatSession> findById(String sessionId);

    ChatSession save(ChatSession session);

    void deleteById(String sessionId);
}
