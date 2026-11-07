package com.smakbot.core.infrastructure.persistence.adapter;

import com.smakbot.core.domain.model.WhatsAppConfig;
import com.smakbot.core.domain.ports.out.WhatsAppConfigRepositoryPort;
import com.smakbot.core.infrastructure.persistence.entity.WhatsAppConfigEntity;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataWhatsAppConfigRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class WhatsAppConfigJpaAdapter implements WhatsAppConfigRepositoryPort {

    private final SpringDataWhatsAppConfigRepository repo;
    private final String envPhoneNumberId;
    private final String envWabaId;
    private final String envAccessToken;
    private final String envVerifyToken;

    public WhatsAppConfigJpaAdapter(
            SpringDataWhatsAppConfigRepository repo,
            @Value("${smakbot.meta.phone-number-id:}") String envPhoneNumberId,
            @Value("${smakbot.meta.waba-id:}") String envWabaId,
            @Value("${smakbot.meta.access-token:}") String envAccessToken,
            @Value("${smakbot.meta.verify-token:}") String envVerifyToken) {
        this.repo = repo;
        this.envPhoneNumberId = envPhoneNumberId;
        this.envWabaId = envWabaId;
        this.envAccessToken = envAccessToken;
        this.envVerifyToken = envVerifyToken;
    }

    @Override
    public Optional<WhatsAppConfig> findByPhoneNumberId(String phoneNumberId) {
        return repo.findByPhoneNumberId(phoneNumberId).map(this::toDomain);
    }

    @Override
    public Optional<WhatsAppConfig> findByVerifyToken(String verifyToken) {
        return repo.findByVerifyToken(verifyToken).map(this::toDomain);
    }

    @Override
    public Optional<WhatsAppConfig> findByTenantId(String tenantId) {
        return repo.findById(tenantId).map(this::toDomain);
    }

    private WhatsAppConfig toDomain(WhatsAppConfigEntity e) {
        String phoneId = (envPhoneNumberId != null && !envPhoneNumberId.isBlank()) ? envPhoneNumberId : e.getPhoneNumberId();
        String waba = (envWabaId != null && !envWabaId.isBlank()) ? envWabaId : e.getWabaId();
        String token = (envAccessToken != null && !envAccessToken.isBlank()) ? envAccessToken : e.getAccessToken();
        String verify = (envVerifyToken != null && !envVerifyToken.isBlank()) ? envVerifyToken : e.getVerifyToken();
        return new WhatsAppConfig(e.getTenantId(), phoneId, waba, token, verify, e.getAppSecret());
    }
}
