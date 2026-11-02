package com.smakbot.core.infrastructure.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Payload de mensaje entrante desde el Widget Web.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatMessageRequest {

    private String tenantId;
    private String sessionId;
    private String message;
    private LocationPayload location;

    public ChatMessageRequest() {
    }

    public ChatMessageRequest(String message, LocationPayload location) {
        this.message = message;
        this.location = location;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocationPayload getLocation() {
        return location;
    }

    public void setLocation(LocationPayload location) {
        this.location = location;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LocationPayload {
        private Double lat;
        private Double lng;
        private String address;

        public LocationPayload() {
        }

        public LocationPayload(Double lat, Double lng, String address) {
            this.lat = lat;
            this.lng = lng;
            this.address = address;
        }

        public Double getLat() {
            return lat;
        }

        public void setLat(Double lat) {
            this.lat = lat;
        }

        public Double getLng() {
            return lng;
        }

        public void setLng(Double lng) {
            this.lng = lng;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }
}
