package com.smakbot.core.domain.model;

/**
 * Un turno individual en el historial de conversación (usuario o asistente).
 */
public record ConversationTurn(
        String role,
        String content
) {
}

