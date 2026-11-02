package com.smakbot.core.domain.exception;

/** Violación de una regla de negocio (ej. SKU duplicado). Se traduce a HTTP 409. */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}
