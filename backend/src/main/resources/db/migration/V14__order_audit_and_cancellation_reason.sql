-- ============================================================================
-- V14: Auditoría real de pedidos, motivo de cancelación, trazabilidad y FAQ horarios
-- ============================================================================

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS source_channel VARCHAR(30) DEFAULT 'WEB',
    ADD COLUMN IF NOT EXISTS source_session_id VARCHAR(150),
    ADD COLUMN IF NOT EXISTS client_ip VARCHAR(80),
    ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
    ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(50),
    ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS audit_history JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(tenant_id, customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_source_session ON orders(tenant_id, source_session_id);

-- Backfill de trazabilidad inicial en órdenes existentes que aún no tienen audit_history
UPDATE orders
SET audit_history = jsonb_build_array(
    jsonb_build_object(
        'action', 'CREATED',
        'status', COALESCE(status, 'PENDIENTE'),
        'timestamp', to_char(COALESCE(created_at, CURRENT_TIMESTAMP) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'note', CONCAT('Pedido registrado en BD · Teléfono cliente: ', customer_phone,
                       CASE WHEN tracking_number IS NOT NULL THEN CONCAT(' · Guía: ', tracking_number) ELSE '' END)
    )
)
WHERE audit_history IS NULL OR jsonb_array_length(audit_history) = 0;

-- Ampliar frases de entrenamiento para horarios de atención/entrega en BD
UPDATE bot_rules
SET training_phrases = training_phrases || '["horario","horarios","horario de atencion","a que hora atienden","a que hora abren"]'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE tenant_id IN ('smak', 'tenant-hn-muebles')
  AND name = 'Horarios de Entrega y Agencias Cargo Expreso'
  AND NOT (training_phrases @> '["horarios"]'::jsonb);

