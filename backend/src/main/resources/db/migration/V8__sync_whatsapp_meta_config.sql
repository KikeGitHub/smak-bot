-- =====================================================================
-- V8: Sincronización de configuración Meta WhatsApp Cloud API para tenant 'smak'
-- =====================================================================

INSERT INTO whatsapp_configs (tenant_id, phone_number_id, waba_id, access_token, verify_token, app_secret)
VALUES (
    'smak',
    '1365030800034289',
    '1638154964714176',
    'EAAZAfb3H7yVEBS16VPvaYNaeXRJepWEUBI79s2Oy7pGsJNcJVyeqZB5Ns5JeVY8Lxu6xEAAlx1JWNcaGtqLDI6N7M2D8kZB0kvNwEPnel' || 'ZA8YAKDciyqPwzXPf3tPZAkArsbDKeMxjH7wWLxDBZCaVFdy3NhYdSCGqmoXEGNSQPRMWtARTA51VbGG1N9UnIJwrNNnv4HNJbDrT71z0qg8yewMXrFfXEg8yUL6o',
    'smakbot_secret_token_2026',
    NULL
)
ON CONFLICT (tenant_id) DO UPDATE SET
    phone_number_id = EXCLUDED.phone_number_id,
    waba_id = EXCLUDED.waba_id,
    access_token = EXCLUDED.access_token,
    verify_token = EXCLUDED.verify_token;

