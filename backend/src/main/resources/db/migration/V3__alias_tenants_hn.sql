-- =====================================================================
-- V3: Soporte para identificadores de tenant estándar HN
-- =====================================================================

INSERT INTO tenants (id, name, country, currency, phone_contact, is_active)
VALUES ('tenant-hn-muebles', 'Muebles Elegancia HN', 'HN', 'L.', '+50498008559', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active)
SELECT 'tenant-hn-muebles', sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
FROM products WHERE tenant_id = 'smak'
ON CONFLICT (tenant_id, sku) DO NOTHING;

INSERT INTO tenants (id, name, country, currency, phone_contact, is_active)
VALUES ('tenant-hn-calzado', 'Calzado y Moda HN', 'HN', 'L.', '+50498008559', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active)
SELECT 'tenant-hn-calzado', sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
FROM products WHERE tenant_id = 'calzado'
ON CONFLICT (tenant_id, sku) DO NOTHING;
