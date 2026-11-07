package com.smakbot.core.infrastructure.persistence.repository;

import com.smakbot.core.infrastructure.persistence.entity.SynonymEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpringDataSynonymRepository extends JpaRepository<SynonymEntity, UUID> {
    List<SynonymEntity> findByTenantIdOrderByConceptAsc(String tenantId);
    Optional<SynonymEntity> findByTenantIdAndConceptIgnoreCase(String tenantId, String concept);

    @Transactional
    void deleteByTenantIdAndConceptIgnoreCase(String tenantId, String concept);
}

