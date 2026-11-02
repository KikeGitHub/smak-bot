package com.smakbot.core.domain.ports.out;

import com.smakbot.core.domain.model.WhatsAppConfig;

import java.util.Optional;

public interface WhatsAppConfigRepositoryPort {

    Optional<WhatsAppConfig> findByPhoneNumberId(String phoneNumberId);

    Optional<WhatsAppConfig> findByVerifyToken(String verifyToken);

    Optional<WhatsAppConfig> findByTenantId(String tenantId);
}
