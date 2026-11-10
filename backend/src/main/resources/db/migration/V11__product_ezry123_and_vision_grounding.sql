-- V11: Registro de SKU promocional EZRY123 y enriquecimiento para búsqueda visual
INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'EZRY123',
    'Silla de Oficina Ergonómica Ezry Negra',
    'Silla ejecutiva de oficina con respaldo transpirable, soporte lumbar, ruedas giratorias 360, altura ajustable y resistencia de hasta 230 lbs.',
    1290.00,
    995.00,
    48,
    '47 × 92 cm',
    '230 lbs (104 kg)',
    'Negro',
    'Sillas y Bancos',
    '["ezry123","ezry","ezri","ezri123","silla de oficina","silla economica","silla 995","silla de escritorio","silla giratoria","silla negra","silla transpirable"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    weight_limit = EXCLUDED.weight_limit,
    stock = EXCLUDED.stock,
    keywords = EXCLUDED.keywords;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'EZRY123',
    'Silla de Oficina Ergonómica Ezry Negra',
    'Silla ejecutiva de oficina con respaldo transpirable, soporte lumbar, ruedas giratorias 360, altura ajustable y resistencia de hasta 230 lbs.',
    1290.00,
    995.00,
    48,
    '47 × 92 cm',
    '230 lbs (104 kg)',
    'Negro',
    'Sillas y Bancos',
    '["ezry123","ezry","ezri","ezri123","silla de oficina","silla economica","silla 995","silla de escritorio","silla giratoria","silla negra","silla transpirable"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    weight_limit = EXCLUDED.weight_limit,
    stock = EXCLUDED.stock,
    keywords = EXCLUDED.keywords;

-- Añadir alias a la silla de despacho Ezri por si se consulta cruzada
UPDATE products
SET keywords = keywords || '["ezry123","ezry","ezri123","silla 995"]'::jsonb
WHERE sku = 'SKM-935-NE';
