package com.smakbot.core.infrastructure.persistence.repository;

import com.smakbot.core.infrastructure.persistence.entity.CampaignEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringDataCampaignRepository extends JpaRepository<CampaignEntity, String> {
    List<CampaignEntity> findByTenantIdOrderByCreatedAtAsc(String tenantId);
}

