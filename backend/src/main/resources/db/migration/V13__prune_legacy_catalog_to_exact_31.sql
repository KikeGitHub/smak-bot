-- ============================================================================
-- V13: Depuración estricta del catálogo de SMAK a los 31 productos reales
-- extraídos de https://www.smakstore.com/
-- Consolida variantes de color y SKU promocionales como palabras clave/sinónimos
-- sobre los 31 productos principales y elimina los 11 registros heredados/duplicados.
-- ============================================================================

-- 1. Enriquecer keywords de los productos principales con los SKU de variantes/promos
UPDATE products
SET keywords = '["silla", "despacho", "ezri", "ezry", "ezry123", "ezri123", "oficina", "escritorio", "giratoria", "negro", "skm-935-ne", "935", "silla 995"]'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE tenant_id IN ('smak', 'tenant-hn-muebles') AND sku = 'SKM-935-NE';

UPDATE products
SET keywords = '["silla gamer", "gamer", "rom", "reclinable", "videojuegos", "negro", "rosa", "blanco", "skm-955-ca-ne", "skm-955-ca-ne-bl", "skm-955-ca-ne-ro", "955"]'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE tenant_id IN ('smak', 'tenant-hn-muebles') AND sku = 'SKM-955-CA-NE';

UPDATE products
SET keywords = '["silla ergonomica", "wynn", "apoyapies", "oficina", "malla", "negro", "gris", "skm-956-ca-ne", "skm-956-ca-gr", "956"]'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE tenant_id IN ('smak', 'tenant-hn-muebles') AND sku = 'SKM-956-CA-NE';

UPDATE products
SET keywords = '["silla ejecutiva", "sillon", "miles", "apoyapies", "reclinable", "oficina", "negro", "cafe", "marron", "skm-959-ca-ne", "skm-959-ca-ma", "959"]'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE tenant_id IN ('smak', 'tenant-hn-muebles') AND sku = 'SKM-959-CA-NE';

UPDATE products
SET keywords = '["grifo monocomando", "llave lavatrastos", "grifo extensible", "negro mate", "gris inox", "inox", "todd", "zgb-146-nm", "zgb-146-inox", "146"]'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE tenant_id IN ('smak', 'tenant-hn-muebles') AND sku = 'ZGB-146-NM';

-- 2. Registrar sinónimo oficial para que el SKU promocional EZRY123 apunte a SKM-935-NE sin duplicar fila en catálogo
INSERT INTO synonyms (tenant_id, concept, words)
VALUES (
    'smak',
    'Silla Ejecutiva Ezri (SKM-935-NE)',
    '["ezry123", "ezry", "ezri123", "ezri", "silla ejecutiva ezri", "silla de oficina ezri"]'::jsonb
) ON CONFLICT (tenant_id, concept) DO UPDATE SET
    words = EXCLUDED.words,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO synonyms (tenant_id, concept, words)
VALUES (
    'tenant-hn-muebles',
    'Silla Ejecutiva Ezri (SKM-935-NE)',
    '["ezry123", "ezry", "ezri123", "ezri", "silla ejecutiva ezri", "silla de oficina ezri"]'::jsonb
) ON CONFLICT (tenant_id, concept) DO UPDATE SET
    words = EXCLUDED.words,
    updated_at = CURRENT_TIMESTAMP;

-- 3. Eliminar los 11 productos heredados, placeholders sin descripción o variantes duplicadas
DELETE FROM products
WHERE tenant_id IN ('smak', 'tenant-hn-muebles')
  AND sku NOT IN (
    'SKM-935-NE',
    'SKM-941-NE',
    'SKM-941-NE-4',
    'SKM-950-NE-MP',
    'SKM-950-NE-MP-4',
    'SKM-953-NE-MP',
    'SKM-953-NE-MP-4',
    'SKM-955-CA-NE',
    'SKM-956-CA-NE',
    'SKM-959-CA-NE',
    'SKM-972-NE',
    'SKM-972-NE-4',
    'ZGB-014-NE',
    'ZGB-105-NE',
    'ZGB-107-NE',
    'ZGB-146-NM',
    'ZGB-148-NM',
    'ZGB-203-NM',
    'ZGB-210-NE',
    'ZGF-503',
    'ZGM-017-NE',
    'ZGM-030-NE-NE',
    'ZGM-032-NENE',
    'ZGS-101-NE',
    'ZGS-110-NE',
    'ZGS-622',
    'ZGS-684',
    'ZGS-707',
    'ZGS-926-NE',
    'ZGS-943-120x60x75',
    'ZGS-944-120x80x75'
  );

-- 4. Limpiar campañas huérfanas que referenciaban productos eliminados (ej. Estantería ZGS-946-120x30x180)
DELETE FROM campaigns
WHERE tenant_id IN ('smak', 'tenant-hn-muebles')
  AND sku NOT IN (
    SELECT sku FROM products WHERE tenant_id = campaigns.tenant_id
  );
