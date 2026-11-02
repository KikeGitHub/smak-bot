-- =====================================================================
-- V7: Enriquecimiento de keywords y modismos hondureños para SMAK Muebles
-- Añade modismos, sinónimos populares ("sia", "cia", "lavaplato", etc.)
-- =====================================================================

UPDATE products
SET keywords = keywords || '["sia gamer", "cia gamer", "siya gamer", "asiento gamer", "butaca gamer", "silla gamer", "silla de juegos", "videojuegos", "gaming"]'::jsonb
WHERE tenant_id = 'smak' AND sku LIKE 'SKM-955%';

UPDATE products
SET keywords = keywords || '["sia ejecutiva", "cia ejecutiva", "silla ejecutiva", "sillon ejecutivo", "silla de oficina", "silla para computadora", "silla con apoyapies", "cuero"]'::jsonb
WHERE tenant_id = 'smak' AND sku LIKE 'SKM-959%';

UPDATE products
SET keywords = keywords || '["sia ergonomica", "cia ergonomica", "silla ergonomica", "silla de malla", "soporte lumbar", "silla para espalda", "ergonomica"]'::jsonb
WHERE tenant_id = 'smak' AND sku LIKE 'SKM-956%';

UPDATE products
SET keywords = keywords || '["sia de despacho", "silla de despacho", "silla economica", "silla giratoria", "silla de escritorio"]'::jsonb
WHERE tenant_id = 'smak' AND sku = 'SKM-935-NE';

UPDATE products
SET keywords = keywords || '["sia de ruedas", "silla de ruedas", "ruedas", "silla ortopedica", "plegable"]'::jsonb
WHERE tenant_id = 'smak' AND sku = 'ZGF-503';

UPDATE products
SET keywords = keywords || '["banquito", "banquitos", "banqueta", "banquetas", "banco para barra", "taburete tolix", "tolik", "asiento barra", "desayunador"]'::jsonb
WHERE tenant_id = 'smak' AND (sku LIKE 'SKM-951%' OR sku LIKE 'SKM-952%' OR sku LIKE 'SKM-953%' OR sku LIKE 'SKM-97%' OR sku LIKE 'ZGS-926%' OR sku LIKE 'ZGS-101%');

UPDATE products
SET keywords = keywords || '["lavaplato", "lavaplatos", "lavatraste", "lavatrastes", "fregador", "fregadora", "fregadero", "tarja", "poceta", "pileta de cocina", "savadir"]'::jsonb
WHERE tenant_id = 'smak' AND sku = 'ZGB-148-NM';

UPDATE products
SET keywords = keywords || '["grifo", "grifos", "llave", "llaves", "chorro", "monocomando", "griferia", "llave de cocina", "todd"]'::jsonb
WHERE tenant_id = 'smak' AND sku LIKE 'ZGB-146%';

UPDATE products
SET keywords = keywords || '["mesa de trabajo", "mesa para computadora", "escritorio para pc", "home office"]'::jsonb
WHERE tenant_id = 'smak' AND sku = 'ZGS-943-120x60x75';

UPDATE products
SET keywords = keywords || '["mesa para comedor", "mesa de 4 puestos", "mesa comedor"]'::jsonb
WHERE tenant_id = 'smak' AND sku = 'ZGS-944-120x80x75';

UPDATE products
SET keywords = keywords || '["librero", "repisa", "estante", "organizador", "estanteria de hierro y madera"]'::jsonb
WHERE tenant_id = 'smak' AND sku = 'ZGS-946-120x30x180';

UPDATE products
SET keywords = keywords || '["carretilla", "diablito", "zorra", "carretilla de carga", "carro de carga"]'::jsonb
WHERE tenant_id = 'smak' AND sku = 'ZGS-622';

UPDATE products
SET keywords = keywords || '["columpio", "columpio de jardin", "mecedora", "hamaca con techo"]'::jsonb
WHERE tenant_id = 'smak' AND sku = 'ZGB-210-NE';

UPDATE products SET keywords = (
    SELECT jsonb_agg(DISTINCT elem)
    FROM jsonb_array_elements_text(keywords) AS elem
) WHERE tenant_id = 'smak';
