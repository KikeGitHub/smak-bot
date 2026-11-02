package com.smakbot.core.domain.ports.in;

import com.smakbot.core.domain.model.BotReply;
import com.smakbot.core.domain.model.IncomingMessage;

/** Caso de uso principal: procesar un mensaje entrante de cualquier canal. */
public interface ProcessMessageUseCase {

    BotReply process(IncomingMessage message);

    /** Reinicia la memoria conversacional (botón "nueva conversación" del widget). */
    void resetSession(IncomingMessage identity);
}
