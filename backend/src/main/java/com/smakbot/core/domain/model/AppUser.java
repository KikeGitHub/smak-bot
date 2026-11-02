package com.smakbot.core.domain.model;

import java.util.UUID;

public record AppUser(
        UUID id,
        String username,
        String passwordHash,
        String fullName,
        String role,
        String tenantId,
        boolean active
) {
    public boolean isSuperAdmin() {
        return "ROLE_SUPER_ADMIN".equalsIgnoreCase(role) || "SUPER_ADMIN".equalsIgnoreCase(role);
    }
}
