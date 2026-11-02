package com.smakbot.core.infrastructure.persistence.adapter;

import com.smakbot.core.domain.model.Tenant;
import com.smakbot.core.domain.ports.out.TenantRepositoryPort;
import com.smakbot.core.infrastructure.persistence.entity.TenantEntity;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataTenantRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class TenantJpaAdapter implements TenantRepositoryPort {

    private final SpringDataTenantRepository repo;

    public TenantJpaAdapter(SpringDataTenantRepository repo) {
        this.repo = repo;
    }

    @Override
    public Optional<Tenant> findById(String tenantId) {
        return repo.findById(tenantId).map(this::toDomain);
    }

    private Tenant toDomain(TenantEntity e) {
        return new Tenant(e.getId(), e.getName(), e.getCountry(), e.getCurrency(), e.getPhoneContact(), e.isActive());
    }
}
