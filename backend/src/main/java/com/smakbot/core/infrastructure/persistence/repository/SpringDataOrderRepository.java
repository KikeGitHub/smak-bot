package com.smakbot.core.infrastructure.persistence.repository;

import com.smakbot.core.infrastructure.persistence.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataOrderRepository extends JpaRepository<OrderEntity, UUID> {
    List<OrderEntity> findByTenantIdOrderByCreatedAtDesc(String tenantId);
    Optional<OrderEntity> findByTenantIdAndId(String tenantId, UUID id);
    long countByTenantId(String tenantId);
    boolean existsByOrderNumber(String orderNumber);

    @Query("SELECT o FROM OrderEntity o WHERE o.tenantId = :tenantId AND (UPPER(o.orderNumber) = UPPER(:code) OR UPPER(o.trackingNumber) = UPPER(:code))")
    Optional<OrderEntity> findByTenantIdAndNumberOrTracking(@Param("tenantId") String tenantId, @Param("code") String code);
}
