package com.smakbot.core.domain.model;

public enum OrderStatus {
    PENDIENTE("🕒 Pendiente de despacho en bodega"),
    EN_CAMINO("🚚 En camino a tu domicilio"),
    ENTREGADO("✅ Entregado con éxito"),
    CANCELADO("❌ Cancelado");

    private final String label;

    OrderStatus(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
