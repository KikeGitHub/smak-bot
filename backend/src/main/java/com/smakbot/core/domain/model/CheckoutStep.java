package com.smakbot.core.domain.model;

/**
 * Estados de la conversación. Los pasos de checkout replican el flujo secuencial estricto:
 * NAME → QUANTITY (si no es explícita) → ADDRESS → PHONE → REQUIRES_INVOICE → INVOICE_RTN → INVOICE_BUSINESS_NAME → CONFIRM.
 */
public enum CheckoutStep {
    IDLE,
    NAME,
    QUANTITY,
    ADDRESS,
    PHONE,
    REQUIRES_INVOICE,
    INVOICE_RTN,
    INVOICE_BUSINESS_NAME,
    CONFIRM,
    /** Esperando motivo de cancelación para registrar el estado CANCELADO con trazabilidad. */
    CANCEL_REASON,
    /** Conversación transferida a un asesor humano: el bot queda en pausa. */
    HUMAN;

    public boolean isCheckout() {
        return this != IDLE && this != HUMAN && this != CANCEL_REASON;
    }
}
