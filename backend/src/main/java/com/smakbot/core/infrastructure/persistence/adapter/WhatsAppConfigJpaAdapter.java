package com.smakbot.core.infrastructure.persistence.adapter;

import com.smakbot.core.domain.model.WhatsAppConfig;
import com.smakbot.core.domain.ports.out.WhatsAppConfigRepositoryPort;
import com.smakbot.core.infrastructure.persistence.entity.WhatsAppConfigEntity;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataWhatsAppConfigRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class WhatsAppConfigJpaAdapter implements WhatsAppConfigRepositoryPort {

    private final SpringDataWhatsAppConfigRepository repo;

    public WhatsAppConfigJpaAdapter(SpringDataWhatsAppConfigRepository repo) {
        this.repo = repo;
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
        return new WhatsAppConfig(e.getTenantId(), e.getPhoneNumberId(), e.getWabaId(), e.getAccessToken(), e.getVerifyToken(), e.getAppSecret());
    }
}
