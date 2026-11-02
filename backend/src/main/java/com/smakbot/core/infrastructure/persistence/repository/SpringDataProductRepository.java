package com.smakbot.core.infrastructure.persistence.repository;

import com.smakbot.core.infrastructure.persistence.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataProductRepository extends JpaRepository<ProductEntity, UUID> {
    List<ProductEntity> findByTenantIdAndActiveTrue(String tenantId);
    boolean existsByTenantIdAndSkuIgnoreCase(String tenantId, String sku);
    Optional<ProductEntity> findByTenantIdAndSkuIgnoreCase(String tenantId, String sku);
}
