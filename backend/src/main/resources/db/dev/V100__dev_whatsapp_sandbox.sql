-- =====================================================================
-- Seed SOLO para perfil "dev": configuración sandbox de WhatsApp.
-- Ubicación: classpath:db/dev (no se ejecuta en producción).
-- Reemplazar access_token / phone_number_id por los de Meta Developers.
-- =====================================================================
INSERT INTO whatsapp_configs (tenant_id, phone_number_id, waba_id, access_token, verify_token, app_secret)
VALUES ('smak', 'SANDBOX_PHONE_NUMBER_ID', 'SANDBOX_WABA_ID', 'CHANGE_ME_META_ACCESS_TOKEN', 'smakbot-verify-dev', NULL)
ON CONFLICT (tenant_id) DO NOTHING;
