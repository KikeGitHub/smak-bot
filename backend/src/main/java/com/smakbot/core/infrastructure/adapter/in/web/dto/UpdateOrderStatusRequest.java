package com.smakbot.core.infrastructure.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateOrderStatusRequest {

    private String status;
    private String trackingNumber;
    private String trackingCarrier;

    public UpdateOrderStatusRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public String getTrackingCarrier() { return trackingCarrier; }
    public void setTrackingCarrier(String trackingCarrier) { this.trackingCarrier = trackingCarrier; }
}
