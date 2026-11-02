package com.smakbot.core.domain.model;

/** Ubicación GPS compartida por el cliente (pin de WhatsApp o botón del widget). */
public record GeoLocation(Double lat, Double lng, String address, String mapUrl) {

    public GeoLocation(Double lat, Double lng, String address) {
        this(lat, lng, address, null);
    }

    public String resolvedMapUrl() {
        if (mapUrl != null && !mapUrl.isBlank()) return mapUrl;
        return "https://maps.google.com/?q=" + lat + "," + lng;
    }

    public String resolvedAddress() {
        if (address != null && !address.isBlank()) return address;
        return String.format(java.util.Locale.US, "Ubicación GPS (%.4f, %.4f)", lat, lng);
    }
}
