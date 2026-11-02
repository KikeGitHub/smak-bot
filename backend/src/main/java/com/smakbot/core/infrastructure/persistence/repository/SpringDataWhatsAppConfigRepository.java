package com.smakbot.core.infrastructure.persistence.repository;

import com.smakbot.core.infrastructure.persistence.entity.WhatsAppConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpringDataWhatsAppConfigRepository extends JpaRepository<WhatsAppConfigEntity, String> {
    Optional<WhatsAppConfigEntity> findByPhoneNumberId(String phoneNumberId);
    Optional<WhatsAppConfigEntity> findByVerifyToken(String verifyToken);
}
