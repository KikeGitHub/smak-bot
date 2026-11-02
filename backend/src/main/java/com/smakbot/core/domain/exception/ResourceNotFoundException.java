package com.smakbot.core.domain.exception;

/** Recurso inexistente (tenant, pedido, etc.). Se traduce a HTTP 404. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
