package com.smakbot.core.domain.model;

/** Comercio / negocio registrado en la plataforma (multitenant). */
public record Tenant(
        String id,
        String name,
        String country,
        String currency,
        String phoneContact,
        boolean active
) {
    /** Número de contacto solo con dígitos, útil para enlaces wa.me. */
    public String phoneDigits() {
        return phoneContact == null ? "" : phoneContact.replaceAll("\\D", "");
    }
}
