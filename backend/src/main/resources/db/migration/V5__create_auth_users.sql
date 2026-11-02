-- =====================================================================
-- V5: Módulo de Autenticación Multitenant con JWT y Usuarios del Sistema
-- =====================================================================

CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'ROLE_SUPER_ADMIN', 'ROLE_TENANT_ADMIN'
    tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users(username);
CREATE INDEX IF NOT EXISTS idx_app_users_tenant ON app_users(tenant_id);

-- ---------------------------------------------------------------------
-- SEED USERS:
-- 1. admin: Super Usuario (pass: 123qwe...)
-- 2. SMAK-Admin: Administrador de SMAK Muebles (pass: Admin123)
-- ---------------------------------------------------------------------

INSERT INTO app_users (id, username, password_hash, full_name, role, tenant_id, is_active)
VALUES (
    gen_random_uuid(),
    'admin',
    '$2a$10$icSPk2GkQ5T73GR4qGW7UOIM9daboymSyrQr59ENyAGiU40mpkFEy',
    'Super Administrador SMAKBOT',
    'ROLE_SUPER_ADMIN',
    NULL,
    TRUE
)
ON CONFLICT (username) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    tenant_id = EXCLUDED.tenant_id,
    is_active = EXCLUDED.is_active;

INSERT INTO app_users (id, username, password_hash, full_name, role, tenant_id, is_active)
VALUES (
    gen_random_uuid(),
    'SMAK-Admin',
    '$2a$10$tVrWBi3WEeJukj2N4zFIjeQjBOaWNa42o/mE5DRP4CocJmMJqaN5K',
    'Administrador SMAK Muebles',
    'ROLE_TENANT_ADMIN',
    'smak',
    TRUE
)
ON CONFLICT (username) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    tenant_id = EXCLUDED.tenant_id,
    is_active = EXCLUDED.is_active;
