package com.smakbot.core.domain.model;

/** Comercio / negocio registrado en la plataforma (multitenant) con scope parametrizable. */
public record Tenant(
        String id,
        String name,
        String country,
        String currency,
        String phoneContact,
        boolean active,
        String businessType,
        String botPersona,
        String scopePolicy,
        String orderPrefix
) {
    public Tenant(String id, String name, String country, String currency, String phoneContact, boolean active) {
        this(id, name, country, currency, phoneContact, active, null, null, null, null);
    }

    /** Número de contacto solo con dígitos, útil para enlaces wa.me. */
    public String phoneDigits() {
        return phoneContact == null ? "" : phoneContact.replaceAll("\\D", "");
    }

    public String effectiveOrderPrefix() {
        if (orderPrefix != null && !orderPrefix.isBlank()) {
            return orderPrefix;
        }
        return (id != null && id.toLowerCase().contains("calzado")) ? "CALZ-ORD" : "SMAK-ORD";
    }
}
