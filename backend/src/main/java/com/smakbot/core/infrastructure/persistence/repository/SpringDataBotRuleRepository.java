package com.smakbot.core.infrastructure.persistence.repository;

import com.smakbot.core.infrastructure.persistence.entity.BotRuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringDataBotRuleRepository extends JpaRepository<BotRuleEntity, String> {
    List<BotRuleEntity> findByTenantIdOrderByCreatedAtAsc(String tenantId);
}

