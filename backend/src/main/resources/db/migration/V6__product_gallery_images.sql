-- ============================================================================
-- V6: Enriquecer catálogo con múltiples imágenes para galerías en WhatsApp
-- ============================================================================

UPDATE products
SET images = '[
  "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80"
]'::jsonb
WHERE sku = 'SKM-955-CA-NE';

UPDATE products
SET images = '[
  "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580481077197-94a4c5a9386d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=800&q=80"
]'::jsonb
WHERE sku = 'SKM-959-CA-NE';

UPDATE products
SET images = '[
  "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80"
]'::jsonb
WHERE sku = 'ZGS-946-120x30x180';
