package com.smakbot.core.domain.ports.out;

import com.smakbot.core.domain.model.Tenant;

import java.util.Optional;

public interface TenantRepositoryPort {
    Optional<Tenant> findById(String tenantId);
}
