package com.smakbot.core.domain.model;

/**
 * Estados de la conversación. Los pasos de checkout replican 1:1 los del Oráculo
 * (bot-engine.js: name → quantity → address → phone → requires_invoice → invoice_rtn → invoice_business_name → confirm).
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
    /** Conversación transferida a un asesor humano: el bot queda en pausa. */
    HUMAN;

    public boolean isCheckout() {
        return this != IDLE && this != HUMAN;
    }
}
