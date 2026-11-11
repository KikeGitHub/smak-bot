-- ============================================================================
-- V12: Sincronización oficial del Catálogo Real desde smakstore.com
-- Productos reales, descripciones completas, fotos de alta resolución Wix
-- y precios en moneda oficial de Honduras (Lempiras L.)
-- ============================================================================

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGF-503',
    'Silla de Ruedas Plegable Smak - Estructura Resistente y Confort',
    'Brinda movilidad, seguridad y autonomía a tus seres queridos con la silla de ruedas Smak. Diseñada para ofrecer un desplazamiento suave y confortable, es la solución ideal para el uso diario en el hogar o para traslados en Honduras.
Características Principales
 • Doble Sistema de Control: Ruedas traseras grandes con aros para autopropulsión del usuario y manubrios con frenos de mano para mayor seguridad del asistente.
 • Diseño Ergonómico y Confortable: Asiento y respaldo acolchados en tela sintética de alta resistencia, suave al tacto y muy fácil de limpiar.
 • Apoyabrazos y Reposapiés: Apoyabrazos con superficie acolchada y reposapiés individuales para una postura óptima y un ascenso o descenso más cómodo.
 • Bolsillo Posterior: Práctico compartimento en la parte trasera del respaldo para guardar documentos, medicamentos u objetos personales durante los trayectos.',
    3200.00,
    2790.00,
    45,
    '88 × 99 × 67 cm',
    '120 kg (Estructura de acero cromado y lona impermeable)',
    'Negro',
    'Salud y Cuidado',
    '["silla de ruedas", "ruedas", "plegable", "salud", "ortopedica", "zgf-503", "503"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_25b1c5d058b548d0aa0a256ded90d9b9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_5355bae28a104175bd1e1b56dbafff0a~mv2.png", "https://static.wixstatic.com/media/f6ccd1_dae9c24ef5e74b9687f83b184d52ac32~mv2.png", "https://static.wixstatic.com/media/f6ccd1_76ae7baa52e64039af2487800bc533a3~mv2.png", "https://static.wixstatic.com/media/f6ccd1_485395bbbe86465db7ae2b18cc9eb02e~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGF-503',
    'Silla de Ruedas Plegable Smak - Estructura Resistente y Confort',
    'Brinda movilidad, seguridad y autonomía a tus seres queridos con la silla de ruedas Smak. Diseñada para ofrecer un desplazamiento suave y confortable, es la solución ideal para el uso diario en el hogar o para traslados en Honduras.
Características Principales
 • Doble Sistema de Control: Ruedas traseras grandes con aros para autopropulsión del usuario y manubrios con frenos de mano para mayor seguridad del asistente.
 • Diseño Ergonómico y Confortable: Asiento y respaldo acolchados en tela sintética de alta resistencia, suave al tacto y muy fácil de limpiar.
 • Apoyabrazos y Reposapiés: Apoyabrazos con superficie acolchada y reposapiés individuales para una postura óptima y un ascenso o descenso más cómodo.
 • Bolsillo Posterior: Práctico compartimento en la parte trasera del respaldo para guardar documentos, medicamentos u objetos personales durante los trayectos.',
    3200.00,
    2790.00,
    45,
    '88 × 99 × 67 cm',
    '120 kg (Estructura de acero cromado y lona impermeable)',
    'Negro',
    'Salud y Cuidado',
    '["silla de ruedas", "ruedas", "plegable", "salud", "ortopedica", "zgf-503", "503"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_25b1c5d058b548d0aa0a256ded90d9b9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_5355bae28a104175bd1e1b56dbafff0a~mv2.png", "https://static.wixstatic.com/media/f6ccd1_dae9c24ef5e74b9687f83b184d52ac32~mv2.png", "https://static.wixstatic.com/media/f6ccd1_76ae7baa52e64039af2487800bc533a3~mv2.png", "https://static.wixstatic.com/media/f6ccd1_485395bbbe86465db7ae2b18cc9eb02e~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-950-NE-MP-4',
    'Set de 4 Sillas Metálicas Tolix Smak con Asiento de Madera - Negro Mate',
    'Aporta un toque industrial cálido y sofisticado a tu comedor, cafetería o espacio de trabajo con la silla metálica Smak. Su combinación de acero negro mate con la textura natural de la madera la convierte en una pieza resistente y llena de carácter para cualquier ambiente en Honduras.

Características Principales

 • Diseño Industrial: Estructura metálica en acabado negro mate combinada con un cálido asiento de madera de pino.
 • Materiales de Alta Durabilidad: Chasis metálico de gran firmeza complementado con una tapa de madera tratada para resistir el uso diario.
 • Versatilidad de Espacios: Perfecta para comedores residenciales, restaurantes, cafeterías, barras o áreas de home office.
 • Mantenimiento Sencillo: Superficie fácil de limpiar y conservar en excelentes condiciones.',
    4990.00,
    4290.00,
    30,
    '45 × 45 × 85 cm',
    '150 kg por silla (Acero estampado y madera maciza)',
    'Negro',
    'Sillas y Bancos',
    '["set 4 sillas", "juego 4 sillas", "sillas tolix", "tolix madera", "comedor", "skm-950-ne-mp-4", "950"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_0287a3c74c55474ea2c16d514aed8c44~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_bbf7e76140564929bf2a98df85f6968c~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_20f07e461c064e23826ec618a7b1289d~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_2c26235e7cdc4006b43371b2543014ef~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_16602381d2a54912b343c84355aac4ad~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_27c212440c4749c38413baf42e9a43e6~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_61280435440f4a22970ca7fe65c9dcbd~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_ed97d6c2199145e5b6a3f2b930cbbabd~mv2.jpeg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-950-NE-MP-4',
    'Set de 4 Sillas Metálicas Tolix Smak con Asiento de Madera - Negro Mate',
    'Aporta un toque industrial cálido y sofisticado a tu comedor, cafetería o espacio de trabajo con la silla metálica Smak. Su combinación de acero negro mate con la textura natural de la madera la convierte en una pieza resistente y llena de carácter para cualquier ambiente en Honduras.

Características Principales

 • Diseño Industrial: Estructura metálica en acabado negro mate combinada con un cálido asiento de madera de pino.
 • Materiales de Alta Durabilidad: Chasis metálico de gran firmeza complementado con una tapa de madera tratada para resistir el uso diario.
 • Versatilidad de Espacios: Perfecta para comedores residenciales, restaurantes, cafeterías, barras o áreas de home office.
 • Mantenimiento Sencillo: Superficie fácil de limpiar y conservar en excelentes condiciones.',
    4990.00,
    4290.00,
    30,
    '45 × 45 × 85 cm',
    '150 kg por silla (Acero estampado y madera maciza)',
    'Negro',
    'Sillas y Bancos',
    '["set 4 sillas", "juego 4 sillas", "sillas tolix", "tolix madera", "comedor", "skm-950-ne-mp-4", "950"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_0287a3c74c55474ea2c16d514aed8c44~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_bbf7e76140564929bf2a98df85f6968c~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_20f07e461c064e23826ec618a7b1289d~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_2c26235e7cdc4006b43371b2543014ef~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_16602381d2a54912b343c84355aac4ad~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_27c212440c4749c38413baf42e9a43e6~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_61280435440f4a22970ca7fe65c9dcbd~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_ed97d6c2199145e5b6a3f2b930cbbabd~mv2.jpeg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-959-CA-NE',
    'Silla con Apoya Pies Miles Premium Smak',
    'Disfruta del máximo confort en tu oficina, estudio o espacio de trabajo con la Silla con Apoya Pies Miles Premium de la marca Smak. Este producto se encuentra disponible en múltiples colores para que puedas elegir el que mejor se adapte a tu estilo y decoración.
Características Principales
 • Altura regulable mediante gas: Permite ajustar la altura del asiento de manera cómoda y precisa.
 • Confort superior: Cuenta con un asiento de espuma confortable y un elegante tapizado de ecocuero.
 • Apoya pies integrado: Ofrece un soporte adicional para descansar las piernas durante tus momentos de pausa o lectura.
 • Inclinación deseada: Permite reclinar el respaldo para adaptarse a tus necesidades de descanso o concentración.',
    3800.00,
    3390.00,
    120,
    '110 × 55 cm',
    '160 kg (Pistón clase 4 y base de acero cromado)',
    'Negro, Café',
    'Sillas y Bancos',
    '["silla ejecutiva", "sillon", "miles", "apoyapies", "reclinable", "oficina", "negro", "skm-959-ca-ne", "959"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f8376366097~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_c7e644f2d03540308fc0f9f80a710a5c~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_859d5295da6c41bc924b6c717b92df8d~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_36dceca5ba4b432fa7c579170315e59e~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_9bbd6f3d04784a12a15188c02c4b78ed~mv2.png", "https://static.wixstatic.com/media/f6ccd1_d3624821ed9c43ca9e309957cbe80c02~mv2.png", "https://static.wixstatic.com/media/f6ccd1_2c5eb12f38b642c887f2f4ba4d86e019~mv2.png", "https://static.wixstatic.com/media/f6ccd1_3cc4353424e74c1b8ab843be821a3621~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-959-CA-NE',
    'Silla con Apoya Pies Miles Premium Smak',
    'Disfruta del máximo confort en tu oficina, estudio o espacio de trabajo con la Silla con Apoya Pies Miles Premium de la marca Smak. Este producto se encuentra disponible en múltiples colores para que puedas elegir el que mejor se adapte a tu estilo y decoración.
Características Principales
 • Altura regulable mediante gas: Permite ajustar la altura del asiento de manera cómoda y precisa.
 • Confort superior: Cuenta con un asiento de espuma confortable y un elegante tapizado de ecocuero.
 • Apoya pies integrado: Ofrece un soporte adicional para descansar las piernas durante tus momentos de pausa o lectura.
 • Inclinación deseada: Permite reclinar el respaldo para adaptarse a tus necesidades de descanso o concentración.',
    3800.00,
    3390.00,
    120,
    '110 × 55 cm',
    '160 kg (Pistón clase 4 y base de acero cromado)',
    'Negro, Café',
    'Sillas y Bancos',
    '["silla ejecutiva", "sillon", "miles", "apoyapies", "reclinable", "oficina", "negro", "skm-959-ca-ne", "959"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f8376366097~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_c7e644f2d03540308fc0f9f80a710a5c~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_859d5295da6c41bc924b6c717b92df8d~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_36dceca5ba4b432fa7c579170315e59e~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_9bbd6f3d04784a12a15188c02c4b78ed~mv2.png", "https://static.wixstatic.com/media/f6ccd1_d3624821ed9c43ca9e309957cbe80c02~mv2.png", "https://static.wixstatic.com/media/f6ccd1_2c5eb12f38b642c887f2f4ba4d86e019~mv2.png", "https://static.wixstatic.com/media/f6ccd1_3cc4353424e74c1b8ab843be821a3621~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-959-CA-MA',
    'Silla con Apoya Pies Miles Premium Smak - Café',
    '',
    3800.00,
    3390.00,
    35,
    '110 × 55 cm',
    '160 kg (Pistón clase 4 y base cromada)',
    'Café',
    'Sillas y Bancos',
    '["silla ejecutiva", "sillon", "miles", "marron", "cafe", "apoyapies", "skm-959-ca-ma"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-959-CA-MA',
    'Silla con Apoya Pies Miles Premium Smak - Café',
    '',
    3800.00,
    3390.00,
    35,
    '110 × 55 cm',
    '160 kg (Pistón clase 4 y base cromada)',
    'Café',
    'Sillas y Bancos',
    '["silla ejecutiva", "sillon", "miles", "marron", "cafe", "apoyapies", "skm-959-ca-ma"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGB-210-NE',
    'Hamaca de Jardín con Toldo Smak | Soporta hasta 260 kg',
    'Transforma tu patio, terraza o jardín en un espacio de descanso y confort con la Hamaca de Jardín con Toldo Smak. Diseñada para ofrecer máxima comodidad al aire libre, combina una sólida estructura de acero con un toldo protector que te resguarda del sol y la lluvia, permitiéndote disfrutar del clima de Honduras con total tranquilidad.
Características Principales
 • Alta Capacidad de Carga (260 kg): Estructura metálica reforzada que soporta hasta 260 kg, ideal para compartir momentos de descanso en familia o con amigos.
 • Lona Impermeable con Protección UV: Techo y asiento confeccionados en lona de alta calidad, resistente al agua y diseñada para bloquear los rayos UV, protegiéndote del sol directo.
 • Estructura de Acero Estable: Fabricada con marcos de acero resistentes que brindan firmeza, firmeza de balanceo y larga vida útil a la intemperie.
 • Incluye 2 Almohadones: Viene equipada con dos cojines decorativos y de confort para brindar un mayor soporte lumbar o de cabeza al descansar.
 • Fácil de Limpiar y Mantener: Las telas y la superficie del marco se limpian fácilmente con un paño húmedo o agua jabonosa suave.',
    4200.00,
    3650.00,
    15,
    '170 × 110 × 153 cm',
    '260 kg (Para 2 a 3 personas)',
    'Negro',
    'Muebles y Organización',
    '["hamaca", "columpio", "jardin", "toldo", "techo", "terraza", "zgb-210", "210"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_342210b9a8cc491dbf83f06c20a5de8d~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_b9cf5b19198540daa38722e43bbb6832~mv2.png", "https://static.wixstatic.com/media/f6ccd1_b78a4f6b324747b1914a75edeb05a87d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_095788aa54284327a7e9c45ddd998449~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e71acc3147774a88a735a07f855635d4~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGB-210-NE',
    'Hamaca de Jardín con Toldo Smak | Soporta hasta 260 kg',
    'Transforma tu patio, terraza o jardín en un espacio de descanso y confort con la Hamaca de Jardín con Toldo Smak. Diseñada para ofrecer máxima comodidad al aire libre, combina una sólida estructura de acero con un toldo protector que te resguarda del sol y la lluvia, permitiéndote disfrutar del clima de Honduras con total tranquilidad.
Características Principales
 • Alta Capacidad de Carga (260 kg): Estructura metálica reforzada que soporta hasta 260 kg, ideal para compartir momentos de descanso en familia o con amigos.
 • Lona Impermeable con Protección UV: Techo y asiento confeccionados en lona de alta calidad, resistente al agua y diseñada para bloquear los rayos UV, protegiéndote del sol directo.
 • Estructura de Acero Estable: Fabricada con marcos de acero resistentes que brindan firmeza, firmeza de balanceo y larga vida útil a la intemperie.
 • Incluye 2 Almohadones: Viene equipada con dos cojines decorativos y de confort para brindar un mayor soporte lumbar o de cabeza al descansar.
 • Fácil de Limpiar y Mantener: Las telas y la superficie del marco se limpian fácilmente con un paño húmedo o agua jabonosa suave.',
    4200.00,
    3650.00,
    15,
    '170 × 110 × 153 cm',
    '260 kg (Para 2 a 3 personas)',
    'Negro',
    'Muebles y Organización',
    '["hamaca", "columpio", "jardin", "toldo", "techo", "terraza", "zgb-210", "210"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_342210b9a8cc491dbf83f06c20a5de8d~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_b9cf5b19198540daa38722e43bbb6832~mv2.png", "https://static.wixstatic.com/media/f6ccd1_b78a4f6b324747b1914a75edeb05a87d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_095788aa54284327a7e9c45ddd998449~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e71acc3147774a88a735a07f855635d4~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGM-032-NENE',
    'Set de Mesas de Centro Nido Smak - Acabado Símil Mármol',
    'Renueva tu sala con este elegante y versátil set de dos mesas de la marca Smak. Su diseño moderno y funcionalidad te permiten adaptarlas a cualquier espacio, brindándote una superficie cómoda y estilizada para tu hogar en Honduras.
Características Principales
 • Diseño tipo nido: El set incluye dos mesas redondas de diferentes proporciones que permiten colocar la más pequeña parcialmente debajo de la más grande.
 • Superficie elegante: Ambas mesas cuentan con una superficie clara adornada con vetas, simulando un sofisticado acabado en mármol.
 • Estructura resistente: El soporte está fabricado con una base de metal tubular en un contrastante color negro.
 • Base abierta: La estructura metálica tiene un diseño semi-circular abierto en la parte inferior, lo que hace posible su acomodo en conjunto.
 • Estilo versátil: Por su estética contemporánea, son ideales para colocarse frente a un sofá en el área de la sala de estar.',
    2800.00,
    2450.00,
    40,
    '70×45 cm y 50×38 cm',
    '50 kg por mesa (Acero y cubierta símil mármol)',
    'Blanco, Negro',
    'Muebles y Organización',
    '["mesas de centro", "mesas nido", "marmol", "sala", "doncaster", "zgm-032", "032"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_64b93d3a16c1468cba141776aada33c3~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e91d7101f4414098b49c59675019961d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e4bb54b9d4694581a13c3d5e45804711~mv2.jpg", "https://static.wixstatic.com/media/f6ccd1_9953fdd6ec7647dfa1c87a690ef4aedd~mv2.jpg", "https://static.wixstatic.com/media/f6ccd1_04d776c508744476b5681289a0b1ac40~mv2.png", "https://static.wixstatic.com/media/f6ccd1_c527d216e44247e7b75941a6e4a4b8c2~mv2.png", "https://static.wixstatic.com/media/f6ccd1_21980b49d9d143e6a73b72e1157afe97~mv2.jpg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGM-032-NENE',
    'Set de Mesas de Centro Nido Smak - Acabado Símil Mármol',
    'Renueva tu sala con este elegante y versátil set de dos mesas de la marca Smak. Su diseño moderno y funcionalidad te permiten adaptarlas a cualquier espacio, brindándote una superficie cómoda y estilizada para tu hogar en Honduras.
Características Principales
 • Diseño tipo nido: El set incluye dos mesas redondas de diferentes proporciones que permiten colocar la más pequeña parcialmente debajo de la más grande.
 • Superficie elegante: Ambas mesas cuentan con una superficie clara adornada con vetas, simulando un sofisticado acabado en mármol.
 • Estructura resistente: El soporte está fabricado con una base de metal tubular en un contrastante color negro.
 • Base abierta: La estructura metálica tiene un diseño semi-circular abierto en la parte inferior, lo que hace posible su acomodo en conjunto.
 • Estilo versátil: Por su estética contemporánea, son ideales para colocarse frente a un sofá en el área de la sala de estar.',
    2800.00,
    2450.00,
    40,
    '70×45 cm y 50×38 cm',
    '50 kg por mesa (Acero y cubierta símil mármol)',
    'Blanco, Negro',
    'Muebles y Organización',
    '["mesas de centro", "mesas nido", "marmol", "sala", "doncaster", "zgm-032", "032"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_64b93d3a16c1468cba141776aada33c3~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e91d7101f4414098b49c59675019961d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e4bb54b9d4694581a13c3d5e45804711~mv2.jpg", "https://static.wixstatic.com/media/f6ccd1_9953fdd6ec7647dfa1c87a690ef4aedd~mv2.jpg", "https://static.wixstatic.com/media/f6ccd1_04d776c508744476b5681289a0b1ac40~mv2.png", "https://static.wixstatic.com/media/f6ccd1_c527d216e44247e7b75941a6e4a4b8c2~mv2.png", "https://static.wixstatic.com/media/f6ccd1_21980b49d9d143e6a73b72e1157afe97~mv2.jpg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-972-NE',
    'Silla Tolix con Respaldo Smak - Negro',
    'Eleva el estilo de tu barra de cocina, desayunador o negocio en Honduras con la silla alta estilo Tolix de la marca Smak. Su diseño metálico en acabado negro mate combina a la perfección la estética industrial moderna con la máxima resistencia para el día a día.
Características Principales
 • Estructura Metálica: Fabricada completamente en metal de alta durabilidad para garantizar estabilidad y una larga vida útil.
 • Diseño Ergonómico con Respaldo: Cuenta con un respaldo integrado y un práctico apoya pies que brindan mayor confort durante su uso.
 • Patas Antideslizantes: Incorpora protecciones en las patas para prevenir deslizamientos y proteger tus pisos contra rayones.
 • Resistencia y Ligereza: Soporta un peso máximo de hasta 110 kg con un cuerpo ligero de tan solo 5 kg, lo que facilita su traslado y acomodo.
 • Uso Versátil: Excelente opción para barras residenciales, comedores altos, cafeterías, bares o restaurantes.',
    1300.00,
    1090.00,
    50,
    '45 × 45 × 100 cm',
    '150 kg (Acero prensado de alta resistencia)',
    'Negro',
    'Sillas y Bancos',
    '["silla tolix", "banco tolix", "respaldo", "barra", "metalico", "negro", "skm-972-ne", "972"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_1540af973aab4a1c97832e727296e2c4~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_59e896ed019a47668a2e46d577225281~mv2.png", "https://static.wixstatic.com/media/f6ccd1_67a0cce93c20463e914bb0af3468a72d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_522ccc24d9924dbcb7510ea60521f81b~mv2.png", "https://static.wixstatic.com/media/f6ccd1_0fe037c544c64b67b703a05bbd9b93ce~mv2.png", "https://static.wixstatic.com/media/f6ccd1_46da196b6bf5464e9874a20829342658~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7ea3803a93264bd291f1fde7de4c1be4~mv2.webp"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-972-NE',
    'Silla Tolix con Respaldo Smak - Negro',
    'Eleva el estilo de tu barra de cocina, desayunador o negocio en Honduras con la silla alta estilo Tolix de la marca Smak. Su diseño metálico en acabado negro mate combina a la perfección la estética industrial moderna con la máxima resistencia para el día a día.
Características Principales
 • Estructura Metálica: Fabricada completamente en metal de alta durabilidad para garantizar estabilidad y una larga vida útil.
 • Diseño Ergonómico con Respaldo: Cuenta con un respaldo integrado y un práctico apoya pies que brindan mayor confort durante su uso.
 • Patas Antideslizantes: Incorpora protecciones en las patas para prevenir deslizamientos y proteger tus pisos contra rayones.
 • Resistencia y Ligereza: Soporta un peso máximo de hasta 110 kg con un cuerpo ligero de tan solo 5 kg, lo que facilita su traslado y acomodo.
 • Uso Versátil: Excelente opción para barras residenciales, comedores altos, cafeterías, bares o restaurantes.',
    1300.00,
    1090.00,
    50,
    '45 × 45 × 100 cm',
    '150 kg (Acero prensado de alta resistencia)',
    'Negro',
    'Sillas y Bancos',
    '["silla tolix", "banco tolix", "respaldo", "barra", "metalico", "negro", "skm-972-ne", "972"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_1540af973aab4a1c97832e727296e2c4~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_59e896ed019a47668a2e46d577225281~mv2.png", "https://static.wixstatic.com/media/f6ccd1_67a0cce93c20463e914bb0af3468a72d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_522ccc24d9924dbcb7510ea60521f81b~mv2.png", "https://static.wixstatic.com/media/f6ccd1_0fe037c544c64b67b703a05bbd9b93ce~mv2.png", "https://static.wixstatic.com/media/f6ccd1_46da196b6bf5464e9874a20829342658~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7ea3803a93264bd291f1fde7de4c1be4~mv2.webp"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-953-NE-MP',
    'Banco Alto Estilo Tolix Smak con Respaldo y Asiento de Madera - Negro Mate',
    'Transforma tu barra, isla de cocina o negocio en Honduras con el banco alto Smak, un mueble de estética industrial que fusiona la robustez del acero en negro mate con la calidez de un asiento de madera natural.
Características Principales
 • Diseño Industrial Urbano: Silueta estilizada de líneas limpias, ideal para barras de cocina, comedores altos, cafeterías o terrazas techadas.
 • Respaldo Ergonómico: Incorpora un práctico respaldo bajo metálico que proporciona mayor soporte y comodidad al sentarse.
 • Combinación de Materiales: Estructura de acero ultra resistente en tono negro mate con asiento superior en madera tratada de acabado rústico.
 • Apoyapiés Integrado: Cuenta con barras transversales reforzadas que sirven como apoyapiés, ofreciendo estabilidad y confort prolongado.',
    1450.00,
    1250.00,
    85,
    '45 × 45 × 100 cm',
    '150 kg (Madera maciza y acero al carbono)',
    'Negro',
    'Sillas y Bancos',
    '["taburete", "tolix", "banco alto", "respaldo madera", "asiento madera", "pino", "skm-953-ne-mp", "953"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_b50b5e1d3aa7419aad4825f45c78e984~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_ae6904da449f475e97db94d828a4f2f8~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_20f07e461c064e23826ec618a7b1289d~mv2.jpeg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-953-NE-MP',
    'Banco Alto Estilo Tolix Smak con Respaldo y Asiento de Madera - Negro Mate',
    'Transforma tu barra, isla de cocina o negocio en Honduras con el banco alto Smak, un mueble de estética industrial que fusiona la robustez del acero en negro mate con la calidez de un asiento de madera natural.
Características Principales
 • Diseño Industrial Urbano: Silueta estilizada de líneas limpias, ideal para barras de cocina, comedores altos, cafeterías o terrazas techadas.
 • Respaldo Ergonómico: Incorpora un práctico respaldo bajo metálico que proporciona mayor soporte y comodidad al sentarse.
 • Combinación de Materiales: Estructura de acero ultra resistente en tono negro mate con asiento superior en madera tratada de acabado rústico.
 • Apoyapiés Integrado: Cuenta con barras transversales reforzadas que sirven como apoyapiés, ofreciendo estabilidad y confort prolongado.',
    1450.00,
    1250.00,
    85,
    '45 × 45 × 100 cm',
    '150 kg (Madera maciza y acero al carbono)',
    'Negro',
    'Sillas y Bancos',
    '["taburete", "tolix", "banco alto", "respaldo madera", "asiento madera", "pino", "skm-953-ne-mp", "953"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_b50b5e1d3aa7419aad4825f45c78e984~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_ae6904da449f475e97db94d828a4f2f8~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_20f07e461c064e23826ec618a7b1289d~mv2.jpeg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-941-NE',
    'Silla Metálica Estilo Tolix Smak - Negro Mate',
    'Dale un toque industrial y moderno a tu comedor, terraza o negocio en Honduras con la silla metálica Smak, diseñada para combinar máxima durabilidad con un estilo atemporal. Características Principales Estilo Industrial: Diseño clásico metálico en acabado negro mate, ideal para comedores, cafeterías, restaurantes y espacios de home office . Estructura Robusta: Construcción 100% metálica resistente al uso diario y fácil de limpiar. Detalles Funcionales: Asiento con perforaciones para ventilación y flujo de aire, junto con patas con protecciones para cuidar tus pisos de rayones. Diseño Apilable: Permite guardar y optimizar espacio de almacenamiento rápidamente cuando no esté en uso.',
    1190.00,
    990.00,
    60,
    '45 × 45 × 85 cm',
    '150 kg (100% acero estampado)',
    'Negro',
    'Sillas y Bancos',
    '["silla tolix", "silla metalica", "negro mate", "comedor", "terraza", "skm-941-ne", "941"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_34b4fca8a6174da39d5573e512a43a09~mv2.png", "https://static.wixstatic.com/media/f6ccd1_bda261db88594662a2430aec045e95e9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_83f2a8a05c7741cab0305a981a207b1f~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7c384c05ab4342d1a62a44ea275ce68a~mv2.jpg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-941-NE',
    'Silla Metálica Estilo Tolix Smak - Negro Mate',
    'Dale un toque industrial y moderno a tu comedor, terraza o negocio en Honduras con la silla metálica Smak, diseñada para combinar máxima durabilidad con un estilo atemporal. Características Principales Estilo Industrial: Diseño clásico metálico en acabado negro mate, ideal para comedores, cafeterías, restaurantes y espacios de home office . Estructura Robusta: Construcción 100% metálica resistente al uso diario y fácil de limpiar. Detalles Funcionales: Asiento con perforaciones para ventilación y flujo de aire, junto con patas con protecciones para cuidar tus pisos de rayones. Diseño Apilable: Permite guardar y optimizar espacio de almacenamiento rápidamente cuando no esté en uso.',
    1190.00,
    990.00,
    60,
    '45 × 45 × 85 cm',
    '150 kg (100% acero estampado)',
    'Negro',
    'Sillas y Bancos',
    '["silla tolix", "silla metalica", "negro mate", "comedor", "terraza", "skm-941-ne", "941"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_34b4fca8a6174da39d5573e512a43a09~mv2.png", "https://static.wixstatic.com/media/f6ccd1_bda261db88594662a2430aec045e95e9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_83f2a8a05c7741cab0305a981a207b1f~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7c384c05ab4342d1a62a44ea275ce68a~mv2.jpg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGM-017-NE',
    'Sillón Reclinable Individual Nobby Negro | Giratorio 360° y 3 Posiciones',
    'Transforma tu espacio de descanso y entretenimiento con el Sillón Reclinable Nobby.  

¿Buscas comodidad sin ocupar demasiado espacio? El sillón individual Nobby es el complemento perfecto para tu sala, dormitorio o área de lectura en casa u oficina. Su diseño inteligente combina un sistema de giro de 360° y un respaldo reclinable en 3 posiciones, dándote el soporte ideal para ver televisión, leer o simplemente relajarte después de un largo día de trabajo.  

A diferencia de los sillones tradicionales, cuenta con una base metálica piramidal muy robusta que garantiza máxima estabilidad y un toque moderno y elegante para tu hogar.',
    4500.00,
    3890.00,
    20,
    '57 × 60 × 87 cm',
    '160 kg (Giratorio 360 y reclinable 3 posiciones)',
    'Negro',
    'Sillas y Bancos',
    '["sofa", "sillon reclinable", "giratorio", "nobby", "individual", "360", "zgm-017", "017"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_9fd2b3db632f4ce986a21435eb1e4851~mv2.jpg", "https://static.wixstatic.com/media/f6ccd1_af8b847ddb5a4c95b12518ecc7acf934~mv2.png", "https://static.wixstatic.com/media/f6ccd1_075b25c352044c86beaf31ef1a5b668b~mv2.png", "https://static.wixstatic.com/media/f6ccd1_53c52bd6fe214f8cb67189c455d3eada~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f1ceefea6e084a7fa59c6db6428605db~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGM-017-NE',
    'Sillón Reclinable Individual Nobby Negro | Giratorio 360° y 3 Posiciones',
    'Transforma tu espacio de descanso y entretenimiento con el Sillón Reclinable Nobby.  

¿Buscas comodidad sin ocupar demasiado espacio? El sillón individual Nobby es el complemento perfecto para tu sala, dormitorio o área de lectura en casa u oficina. Su diseño inteligente combina un sistema de giro de 360° y un respaldo reclinable en 3 posiciones, dándote el soporte ideal para ver televisión, leer o simplemente relajarte después de un largo día de trabajo.  

A diferencia de los sillones tradicionales, cuenta con una base metálica piramidal muy robusta que garantiza máxima estabilidad y un toque moderno y elegante para tu hogar.',
    4500.00,
    3890.00,
    20,
    '57 × 60 × 87 cm',
    '160 kg (Giratorio 360 y reclinable 3 posiciones)',
    'Negro',
    'Sillas y Bancos',
    '["sofa", "sillon reclinable", "giratorio", "nobby", "individual", "360", "zgm-017", "017"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_9fd2b3db632f4ce986a21435eb1e4851~mv2.jpg", "https://static.wixstatic.com/media/f6ccd1_af8b847ddb5a4c95b12518ecc7acf934~mv2.png", "https://static.wixstatic.com/media/f6ccd1_075b25c352044c86beaf31ef1a5b668b~mv2.png", "https://static.wixstatic.com/media/f6ccd1_53c52bd6fe214f8cb67189c455d3eada~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f1ceefea6e084a7fa59c6db6428605db~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-955-CA-NE',
    'Silla Gamer Smak - Giratoria 360º Reclinable',
    'Adquiere la Silla Gamer de la marca Smak, diseñada para brindar máxima comodidad en tus espacios de juego o trabajo. Este producto se encuentra disponible en múltiples colores para que elijas el que mejor se adapte a tu estilo.
Características Principales
 • Altura regulable con gas comprimido.
 • Giratoria con movilidad de 360 grados.
 • Apoyo lumbar para cuidar tu postura.
 • Inclinación deseada ajustable según tu preferencia.
 • Apoya brazos y cabeza incluidos.',
    3600.00,
    3190.00,
    90,
    '130 × 52 cm',
    '160 kg (Estructura de acero tubular reforzado)',
    'Negro/Negro, Rosa/Blanco',
    'Sillas y Bancos',
    '["silla gamer", "gamer", "rom", "reclinable", "videojuegos", "negro", "skm-955-ca-ne", "955"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd4204b526c4~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_055d8fc5832e44dd9d50f2017843687b~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_c74b8a4a31474c5c9dc1c72ce123b9e2~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_486150303ad6458b8ba1b3e5589f177a~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_75598e7b51da40b4b0e1010d8a064f79~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_f7c4db180f6e4eb7949b8ba0fd8989e6~mv2.png", "https://static.wixstatic.com/media/f6ccd1_6a70e0b4b354429490616d2a4bb041e4~mv2.png", "https://static.wixstatic.com/media/f6ccd1_75551172ff924e92a3e18665cb557379~mv2.png", "https://static.wixstatic.com/media/f6ccd1_86af6476ffda418f8eea82b2a3c493b8~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-955-CA-NE',
    'Silla Gamer Smak - Giratoria 360º Reclinable',
    'Adquiere la Silla Gamer de la marca Smak, diseñada para brindar máxima comodidad en tus espacios de juego o trabajo. Este producto se encuentra disponible en múltiples colores para que elijas el que mejor se adapte a tu estilo.
Características Principales
 • Altura regulable con gas comprimido.
 • Giratoria con movilidad de 360 grados.
 • Apoyo lumbar para cuidar tu postura.
 • Inclinación deseada ajustable según tu preferencia.
 • Apoya brazos y cabeza incluidos.',
    3600.00,
    3190.00,
    90,
    '130 × 52 cm',
    '160 kg (Estructura de acero tubular reforzado)',
    'Negro/Negro, Rosa/Blanco',
    'Sillas y Bancos',
    '["silla gamer", "gamer", "rom", "reclinable", "videojuegos", "negro", "skm-955-ca-ne", "955"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd4204b526c4~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_055d8fc5832e44dd9d50f2017843687b~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_c74b8a4a31474c5c9dc1c72ce123b9e2~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_486150303ad6458b8ba1b3e5589f177a~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_75598e7b51da40b4b0e1010d8a064f79~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_f7c4db180f6e4eb7949b8ba0fd8989e6~mv2.png", "https://static.wixstatic.com/media/f6ccd1_6a70e0b4b354429490616d2a4bb041e4~mv2.png", "https://static.wixstatic.com/media/f6ccd1_75551172ff924e92a3e18665cb557379~mv2.png", "https://static.wixstatic.com/media/f6ccd1_86af6476ffda418f8eea82b2a3c493b8~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-955-CA-NE-BL',
    'SKM-955-CA-NE-BL',
    '',
    3600.00,
    3190.00,
    25,
    '130 × 52 cm',
    '160 kg',
    'Negro',
    'Sillas y Bancos',
    '["silla gamer", "blanco", "rom", "skm-955-ca-ne-bl"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-955-CA-NE-BL',
    'SKM-955-CA-NE-BL',
    '',
    3600.00,
    3190.00,
    25,
    '130 × 52 cm',
    '160 kg',
    'Negro',
    'Sillas y Bancos',
    '["silla gamer", "blanco", "rom", "skm-955-ca-ne-bl"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-955-CA-NE-RO',
    'SKM-955-CA-NE-RO',
    '',
    3600.00,
    3190.00,
    25,
    '130 × 52 cm',
    '160 kg',
    'Negro',
    'Sillas y Bancos',
    '["silla gamer", "rojo", "rom", "skm-955-ca-ne-ro"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-955-CA-NE-RO',
    'SKM-955-CA-NE-RO',
    '',
    3600.00,
    3190.00,
    25,
    '130 × 52 cm',
    '160 kg',
    'Negro',
    'Sillas y Bancos',
    '["silla gamer", "rojo", "rom", "skm-955-ca-ne-ro"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-953-NE-MP-4',
    'Kit 4 Bancos Alto Estilo Tolix Smak con Respaldo y Asiento de Madera Negro Mate',
    'Transforma tu barra, isla de cocina o negocio en Honduras con el banco alto Smak, un mueble de estética industrial que fusiona la robustez del acero en negro mate con la calidez de un asiento de madera natural.

Características Principales

 • Diseño Industrial Urbano: Silueta estilizada de líneas limpias, ideal para barras de cocina, comedores altos, cafeterías o terrazas techadas.
 • Respaldo Ergonómico: Incorpora un práctico respaldo bajo metálico que proporciona mayor soporte y comodidad al sentarse.
 • Combinación de Materiales: Estructura de acero ultra resistente en tono negro mate con asiento superior en madera tratada de acabado rústico.
 • Apoyapiés Integrado: Cuenta con barras transversales reforzadas que sirven como apoyapiés, ofreciendo estabilidad y confort prolongado.',
    5400.00,
    4690.00,
    25,
    '45 × 45 × 100 cm',
    '150 kg por banco (Madera maciza y acero)',
    'Negro',
    'Sillas y Bancos',
    '["kit 4 bancos", "set 4 bancos", "taburetes tolix", "bancos barra", "skm-953-ne-mp-4"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_585455612c3744408a737c745f312c3c~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_ae6904da449f475e97db94d828a4f2f8~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_b50b5e1d3aa7419aad4825f45c78e984~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-953-NE-MP-4',
    'Kit 4 Bancos Alto Estilo Tolix Smak con Respaldo y Asiento de Madera Negro Mate',
    'Transforma tu barra, isla de cocina o negocio en Honduras con el banco alto Smak, un mueble de estética industrial que fusiona la robustez del acero en negro mate con la calidez de un asiento de madera natural.

Características Principales

 • Diseño Industrial Urbano: Silueta estilizada de líneas limpias, ideal para barras de cocina, comedores altos, cafeterías o terrazas techadas.
 • Respaldo Ergonómico: Incorpora un práctico respaldo bajo metálico que proporciona mayor soporte y comodidad al sentarse.
 • Combinación de Materiales: Estructura de acero ultra resistente en tono negro mate con asiento superior en madera tratada de acabado rústico.
 • Apoyapiés Integrado: Cuenta con barras transversales reforzadas que sirven como apoyapiés, ofreciendo estabilidad y confort prolongado.',
    5400.00,
    4690.00,
    25,
    '45 × 45 × 100 cm',
    '150 kg por banco (Madera maciza y acero)',
    'Negro',
    'Sillas y Bancos',
    '["kit 4 bancos", "set 4 bancos", "taburetes tolix", "bancos barra", "skm-953-ne-mp-4"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_585455612c3744408a737c745f312c3c~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_ae6904da449f475e97db94d828a4f2f8~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_b50b5e1d3aa7419aad4825f45c78e984~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGB-148-NM',
    'Fregadero Inteligente Multifuncional Smak Negro Mate (75 x 45 cm)',
    'Transforma tu cocina con la última tendencia en diseño y funcionalidad. Este fregadero de cocina multifuncional combina elegancia contemporánea con una estación de trabajo completa que optimiza el espacio, facilitando la preparación de alimentos y la limpieza diaria.

Características Destacadas
 • Sistema de Grifería 3 en 1: Grifo principal con cabezal extraíble y manguera retráctil, grifo secundario independiente para agua filtrada y salida de agua tipo cascada horizontal, ideal para lavar frutas y verduras delicadas.
 • Lava Vasos a Presión: Sistema integrado de enjuague rápido para copas, vasos y tazas que funciona por presión hacia abajo.
 • Estación de Trabajo Multinivel: Incluye tabla de cortar en madera de alta densidad y tina/escurridor secundario deslizable que se ajusta perfectamente a los rieles internos.
 • Accesorios Integrados: Equipado con dispensador de jabón líquido encastrado y perilla ergonómica para el control intuitivo del flujo de agua.
 • Silencioso y Anticondensación: Cuenta con paneles de aislamiento acústico en la parte exterior inferior para reducir el ruido del impacto del agua y proteger tus gabinetes contra la humedad.
 • Acabado Resistente: Fabricado con acero inoxidable de alto calibre en tono negro mate / gris grafito, resistente a arañazos, manchas de agua y corrosión.',
    4600.00,
    3990.00,
    40,
    '75 × 45 cm',
    'Acero inoxidable 304 nano-recubierto anti-grasa',
    'Negro',
    'Cocina y Baño',
    '["fregadero inteligente", "pileta", "lavatrastos", "cocina", "negro mate", "savadir", "zgb-148", "148"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_ba409218ad94453693e616248d4400ad~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_d230574cdc4a4ecdb0688936416aaa31~mv2.png", "https://static.wixstatic.com/media/f6ccd1_a8f172ba5fd8461db2dfe7f62d652b49~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9d02cc55b98849839251499198e5cbe9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7e4ac9af2b864d4f86603f22e521302b~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGB-148-NM',
    'Fregadero Inteligente Multifuncional Smak Negro Mate (75 x 45 cm)',
    'Transforma tu cocina con la última tendencia en diseño y funcionalidad. Este fregadero de cocina multifuncional combina elegancia contemporánea con una estación de trabajo completa que optimiza el espacio, facilitando la preparación de alimentos y la limpieza diaria.

Características Destacadas
 • Sistema de Grifería 3 en 1: Grifo principal con cabezal extraíble y manguera retráctil, grifo secundario independiente para agua filtrada y salida de agua tipo cascada horizontal, ideal para lavar frutas y verduras delicadas.
 • Lava Vasos a Presión: Sistema integrado de enjuague rápido para copas, vasos y tazas que funciona por presión hacia abajo.
 • Estación de Trabajo Multinivel: Incluye tabla de cortar en madera de alta densidad y tina/escurridor secundario deslizable que se ajusta perfectamente a los rieles internos.
 • Accesorios Integrados: Equipado con dispensador de jabón líquido encastrado y perilla ergonómica para el control intuitivo del flujo de agua.
 • Silencioso y Anticondensación: Cuenta con paneles de aislamiento acústico en la parte exterior inferior para reducir el ruido del impacto del agua y proteger tus gabinetes contra la humedad.
 • Acabado Resistente: Fabricado con acero inoxidable de alto calibre en tono negro mate / gris grafito, resistente a arañazos, manchas de agua y corrosión.',
    4600.00,
    3990.00,
    40,
    '75 × 45 cm',
    'Acero inoxidable 304 nano-recubierto anti-grasa',
    'Negro',
    'Cocina y Baño',
    '["fregadero inteligente", "pileta", "lavatrastos", "cocina", "negro mate", "savadir", "zgb-148", "148"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_ba409218ad94453693e616248d4400ad~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_d230574cdc4a4ecdb0688936416aaa31~mv2.png", "https://static.wixstatic.com/media/f6ccd1_a8f172ba5fd8461db2dfe7f62d652b49~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9d02cc55b98849839251499198e5cbe9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7e4ac9af2b864d4f86603f22e521302b~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGS-110-NE',
    'Taburete de Altura Ajustable con Respaldo Smak',
    'Eleva el estilo y la comodidad de tu hogar, barra de cocina o negocio en Honduras con el Taburete de Altura Ajustable Smak. Su diseño moderno y elegante en color negro aporta un toque sofisticado a cualquier espacio.
Características Principales
 • Altura regulable con gas comprimido: Ajusta fácilmente la altura del asiento según tus necesidades de manera suave y precisa.
 • Comodidad con respaldo acolchado: Diseñado con un patrón capitoné y un cómodo respaldo que brinda un excelente soporte lumbar.
 • Material de alta calidad: Tapizado en ecocuero, lo que garantiza durabilidad, un tacto suave y una limpieza rápida y sencilla.
 • Base cromada resistente: Cuenta con una sólida base redonda con acabado cromado brillante y un práctico apoya pies integrado para mayor relajación.
 • Movilidad de 360°: Su sistema de giro completo te permite moverte libremente en cualquier dirección sin levantarte.',
    1490.00,
    1250.00,
    40,
    '40 × 40 × 60/80 cm',
    '130 kg (Pistón hidráulico de gas)',
    'Negro',
    'Sillas y Bancos',
    '["taburete ajustable", "banco barra", "respaldo", "giratorio", "zgs-110-ne", "110"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_53b24274ff094c6c8351fee0e5a97ca3~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_63853b63a0ca4cb889b86936b30c12e1~mv2.png", "https://static.wixstatic.com/media/f6ccd1_8420589f72ea43d78f8d8ebb9cd6be63~mv2.png", "https://static.wixstatic.com/media/f6ccd1_67291f14441c495aa88aeb3ca6bf9ede~mv2.png", "https://static.wixstatic.com/media/f6ccd1_db035ea651a5483db5734cd1924ce4f5~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGS-110-NE',
    'Taburete de Altura Ajustable con Respaldo Smak',
    'Eleva el estilo y la comodidad de tu hogar, barra de cocina o negocio en Honduras con el Taburete de Altura Ajustable Smak. Su diseño moderno y elegante en color negro aporta un toque sofisticado a cualquier espacio.
Características Principales
 • Altura regulable con gas comprimido: Ajusta fácilmente la altura del asiento según tus necesidades de manera suave y precisa.
 • Comodidad con respaldo acolchado: Diseñado con un patrón capitoné y un cómodo respaldo que brinda un excelente soporte lumbar.
 • Material de alta calidad: Tapizado en ecocuero, lo que garantiza durabilidad, un tacto suave y una limpieza rápida y sencilla.
 • Base cromada resistente: Cuenta con una sólida base redonda con acabado cromado brillante y un práctico apoya pies integrado para mayor relajación.
 • Movilidad de 360°: Su sistema de giro completo te permite moverte libremente en cualquier dirección sin levantarte.',
    1490.00,
    1250.00,
    40,
    '40 × 40 × 60/80 cm',
    '130 kg (Pistón hidráulico de gas)',
    'Negro',
    'Sillas y Bancos',
    '["taburete ajustable", "banco barra", "respaldo", "giratorio", "zgs-110-ne", "110"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_53b24274ff094c6c8351fee0e5a97ca3~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_63853b63a0ca4cb889b86936b30c12e1~mv2.png", "https://static.wixstatic.com/media/f6ccd1_8420589f72ea43d78f8d8ebb9cd6be63~mv2.png", "https://static.wixstatic.com/media/f6ccd1_67291f14441c495aa88aeb3ca6bf9ede~mv2.png", "https://static.wixstatic.com/media/f6ccd1_db035ea651a5483db5734cd1924ce4f5~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGS-101-NE',
    'Taburete Rectangular Smak - Negro',
    'Dale un toque moderno y elegante a tu barra de cocina, desayunador o negocio con el Taburete Rectangular Kira de la marca Smak. Diseñado pensando tanto en el estilo como en la practicidad, este asiento es la opción ideal para renovar cualquier espacio en tu hogar.
Características Principales
 • Comodidad Superior: El asiento está fabricado en ecocuero, dándole un acabado premium y facilitando su limpieza. Además, la estructura cuenta con un práctico apoya pies integrado para mayor descanso durante su uso.
 • Totalmente Ajustable: Incorpora un sistema de gas comprimido que permite regular la elevación de manera suave y sin esfuerzo. Puedes ajustar su altura total desde los 63 cm hasta los 83 cm, adaptándose perfectamente a diferentes mesas o barras.
 • Libertad de Movimiento: Su diseño incluye un eje con giro de 360°. Esta función es ideal para interactuar cómodamente en cualquier dirección sin tener que mover la base de la silla.
 • Resistente y Ligero: Este modelo destaca por su peso ligero de tan solo 3 kg, lo que facilita moverlo por la habitación. A pesar de su ligereza, su robusta estructura está diseñada para soportar una carga máxima de hasta 120 kg.',
    1500.00,
    1290.00,
    35,
    '38 × 40 × 63/83 cm',
    '130 kg (Pistón hidráulico de uso pesado)',
    'Negro',
    'Sillas y Bancos',
    '["taburete", "kira", "banco", "barra", "giratorio", "zgs-101", "101"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_0f7615b9cad448dab081790a1f370944~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_a9cab04f66c94755b6931be48fbe8fbb~mv2.png", "https://static.wixstatic.com/media/f6ccd1_6d5f5adcf42d4a9d9a471e325723e3e0~mv2.png", "https://static.wixstatic.com/media/f6ccd1_a942faa0ee884c5ea65fafb3ff54cc6c~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7ce4fb10e25f4084b1aa1f0ede7aef40~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGS-101-NE',
    'Taburete Rectangular Smak - Negro',
    'Dale un toque moderno y elegante a tu barra de cocina, desayunador o negocio con el Taburete Rectangular Kira de la marca Smak. Diseñado pensando tanto en el estilo como en la practicidad, este asiento es la opción ideal para renovar cualquier espacio en tu hogar.
Características Principales
 • Comodidad Superior: El asiento está fabricado en ecocuero, dándole un acabado premium y facilitando su limpieza. Además, la estructura cuenta con un práctico apoya pies integrado para mayor descanso durante su uso.
 • Totalmente Ajustable: Incorpora un sistema de gas comprimido que permite regular la elevación de manera suave y sin esfuerzo. Puedes ajustar su altura total desde los 63 cm hasta los 83 cm, adaptándose perfectamente a diferentes mesas o barras.
 • Libertad de Movimiento: Su diseño incluye un eje con giro de 360°. Esta función es ideal para interactuar cómodamente en cualquier dirección sin tener que mover la base de la silla.
 • Resistente y Ligero: Este modelo destaca por su peso ligero de tan solo 3 kg, lo que facilita moverlo por la habitación. A pesar de su ligereza, su robusta estructura está diseñada para soportar una carga máxima de hasta 120 kg.',
    1500.00,
    1290.00,
    35,
    '38 × 40 × 63/83 cm',
    '130 kg (Pistón hidráulico de uso pesado)',
    'Negro',
    'Sillas y Bancos',
    '["taburete", "kira", "banco", "barra", "giratorio", "zgs-101", "101"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_0f7615b9cad448dab081790a1f370944~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_a9cab04f66c94755b6931be48fbe8fbb~mv2.png", "https://static.wixstatic.com/media/f6ccd1_6d5f5adcf42d4a9d9a471e325723e3e0~mv2.png", "https://static.wixstatic.com/media/f6ccd1_a942faa0ee884c5ea65fafb3ff54cc6c~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7ce4fb10e25f4084b1aa1f0ede7aef40~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-935-NE',
    'Silla Ejecutiva Ezri Smak Office',
    '¡Eleva tu productividad y cuida tu postura! La Silla Ejecutiva Mesh de Smak Office es la pieza de mobiliario corporativo perfecta para tu oficina o tu espacio de home office. Diseñada para brindarte el máximo confort durante largas jornadas de trabajo o estudio, esta silla combina un estilo moderno con características ergonómicas indispensables.
Beneficios y Características Principales:
 • Frescura garantizada: Su respaldo está fabricado con malla transpirable (mesh), lo que permite una excelente circulación del aire para mantenerte fresco en todo momento.
 • Asiento ultra confortable: Cuenta con un cojín relleno de espuma de alta densidad, diseñado para evitar la fatiga sin importar cuántas horas pases sentado.
 • Cuidado para tu espalda: Incorpora un diseño con apoyo lumbar curvo que se adapta a la forma natural de tu columna, además de cómodos apoya brazos para relajar la tensión en los hombros.
 • Ajuste personalizado: Sistema de altura regulable fácil de usar, permitiendo que la silla se adapte perfectamente a la altura de tu escritorio.
 • Movilidad y elegancia: Su robusta base metálica cromada cuenta con 5 ruedas giratorias de deslizamiento suave, ideales para moverte libremente por tu área de trabajo.',
    2100.00,
    1790.00,
    80,
    '47 × 92 cm',
    '120 kg (Uso de oficina y escritorio)',
    'Negro',
    'Sillas y Bancos',
    '["silla", "despacho", "ezri", "oficina", "escritorio", "giratoria", "negro", "skm-935-ne", "935"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852795b7166c~mv2.png", "https://static.wixstatic.com/media/f6ccd1_0825632ae3ac4d2c9318cae3995b1d04~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e1b9104fcc82432da0faaf403cc2bd53~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-935-NE',
    'Silla Ejecutiva Ezri Smak Office',
    '¡Eleva tu productividad y cuida tu postura! La Silla Ejecutiva Mesh de Smak Office es la pieza de mobiliario corporativo perfecta para tu oficina o tu espacio de home office. Diseñada para brindarte el máximo confort durante largas jornadas de trabajo o estudio, esta silla combina un estilo moderno con características ergonómicas indispensables.
Beneficios y Características Principales:
 • Frescura garantizada: Su respaldo está fabricado con malla transpirable (mesh), lo que permite una excelente circulación del aire para mantenerte fresco en todo momento.
 • Asiento ultra confortable: Cuenta con un cojín relleno de espuma de alta densidad, diseñado para evitar la fatiga sin importar cuántas horas pases sentado.
 • Cuidado para tu espalda: Incorpora un diseño con apoyo lumbar curvo que se adapta a la forma natural de tu columna, además de cómodos apoya brazos para relajar la tensión en los hombros.
 • Ajuste personalizado: Sistema de altura regulable fácil de usar, permitiendo que la silla se adapte perfectamente a la altura de tu escritorio.
 • Movilidad y elegancia: Su robusta base metálica cromada cuenta con 5 ruedas giratorias de deslizamiento suave, ideales para moverte libremente por tu área de trabajo.',
    2100.00,
    1790.00,
    80,
    '47 × 92 cm',
    '120 kg (Uso de oficina y escritorio)',
    'Negro',
    'Sillas y Bancos',
    '["silla", "despacho", "ezri", "oficina", "escritorio", "giratoria", "negro", "skm-935-ne", "935"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852795b7166c~mv2.png", "https://static.wixstatic.com/media/f6ccd1_0825632ae3ac4d2c9318cae3995b1d04~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e1b9104fcc82432da0faaf403cc2bd53~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'EZRY123',
    'Silla de Oficina Ergonómica Ezry Negra',
    'Silla ejecutiva de oficina con respaldo transpirable, soporte lumbar, ruedas giratorias 360, altura ajustable y resistencia de hasta 230 lbs. Oferta L.995 con envío gratis.',
    1290.00,
    995.00,
    50,
    '47 × 92 cm',
    '230 lbs (104 kg)',
    'Negro',
    'Sillas y Bancos',
    '["ezry123", "ezry", "ezri", "ezri123", "silla de oficina", "silla economica", "silla 995", "silla de escritorio", "silla giratoria", "silla negra", "silla transpirable"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852795b7166c~mv2.png", "https://static.wixstatic.com/media/f6ccd1_0825632ae3ac4d2c9318cae3995b1d04~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e1b9104fcc82432da0faaf403cc2bd53~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'EZRY123',
    'Silla de Oficina Ergonómica Ezry Negra',
    'Silla ejecutiva de oficina con respaldo transpirable, soporte lumbar, ruedas giratorias 360, altura ajustable y resistencia de hasta 230 lbs. Oferta L.995 con envío gratis.',
    1290.00,
    995.00,
    50,
    '47 × 92 cm',
    '230 lbs (104 kg)',
    'Negro',
    'Sillas y Bancos',
    '["ezry123", "ezry", "ezri", "ezri123", "silla de oficina", "silla economica", "silla 995", "silla de escritorio", "silla giratoria", "silla negra", "silla transpirable"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852795b7166c~mv2.png", "https://static.wixstatic.com/media/f6ccd1_0825632ae3ac4d2c9318cae3995b1d04~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e1b9104fcc82432da0faaf403cc2bd53~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-972-NE-4',
    'Kit de 4 Bancos Taburete Tolix con Respaldo Smak - Negro',
    'Eleva el estilo de tu barra de cocina, desayunador o negocio en Honduras con la silla alta estilo Tolix de la marca Smak. Su diseño metálico en acabado negro mate combina a la perfección la estética industrial moderna con la máxima resistencia para el día a día.

Características Principales

 • Estructura Metálica: Fabricada completamente en metal de alta durabilidad para garantizar estabilidad y una larga vida útil.
 • Diseño Ergonómico con Respaldo: Cuenta con un respaldo integrado y un práctico apoya pies que brindan mayor confort durante su uso.
 • Patas Antideslizantes: Incorpora protecciones en las patas para prevenir deslizamientos y proteger tus pisos contra rayones.
 • Resistencia y Ligereza: Soporta un peso máximo de hasta 110 kg con un cuerpo ligero de tan solo 5 kg, lo que facilita su traslado y acomodo.
 • Uso Versátil: Excelente opción para barras residenciales, comedores altos, cafeterías, bares o restaurantes.',
    4800.00,
    3990.00,
    20,
    '45 × 45 × 100 cm',
    '150 kg por banco (Acero prensado)',
    'Negro',
    'Sillas y Bancos',
    '["kit 4 bancos tolix", "set 4 bancos", "taburetes tolix", "respaldo", "skm-972-ne-4"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png", "https://static.wixstatic.com/media/f6ccd1_59e896ed019a47668a2e46d577225281~mv2.png", "https://static.wixstatic.com/media/f6ccd1_67a0cce93c20463e914bb0af3468a72d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_522ccc24d9924dbcb7510ea60521f81b~mv2.png", "https://static.wixstatic.com/media/f6ccd1_0fe037c544c64b67b703a05bbd9b93ce~mv2.png", "https://static.wixstatic.com/media/f6ccd1_46da196b6bf5464e9874a20829342658~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7ea3803a93264bd291f1fde7de4c1be4~mv2.webp"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-972-NE-4',
    'Kit de 4 Bancos Taburete Tolix con Respaldo Smak - Negro',
    'Eleva el estilo de tu barra de cocina, desayunador o negocio en Honduras con la silla alta estilo Tolix de la marca Smak. Su diseño metálico en acabado negro mate combina a la perfección la estética industrial moderna con la máxima resistencia para el día a día.

Características Principales

 • Estructura Metálica: Fabricada completamente en metal de alta durabilidad para garantizar estabilidad y una larga vida útil.
 • Diseño Ergonómico con Respaldo: Cuenta con un respaldo integrado y un práctico apoya pies que brindan mayor confort durante su uso.
 • Patas Antideslizantes: Incorpora protecciones en las patas para prevenir deslizamientos y proteger tus pisos contra rayones.
 • Resistencia y Ligereza: Soporta un peso máximo de hasta 110 kg con un cuerpo ligero de tan solo 5 kg, lo que facilita su traslado y acomodo.
 • Uso Versátil: Excelente opción para barras residenciales, comedores altos, cafeterías, bares o restaurantes.',
    4800.00,
    3990.00,
    20,
    '45 × 45 × 100 cm',
    '150 kg por banco (Acero prensado)',
    'Negro',
    'Sillas y Bancos',
    '["kit 4 bancos tolix", "set 4 bancos", "taburetes tolix", "respaldo", "skm-972-ne-4"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png", "https://static.wixstatic.com/media/f6ccd1_59e896ed019a47668a2e46d577225281~mv2.png", "https://static.wixstatic.com/media/f6ccd1_67a0cce93c20463e914bb0af3468a72d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_522ccc24d9924dbcb7510ea60521f81b~mv2.png", "https://static.wixstatic.com/media/f6ccd1_0fe037c544c64b67b703a05bbd9b93ce~mv2.png", "https://static.wixstatic.com/media/f6ccd1_46da196b6bf5464e9874a20829342658~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7ea3803a93264bd291f1fde7de4c1be4~mv2.webp"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-941-NE-4',
    'Set de 4 Sillas Metálicas Estilo Tolix Smak - Negro Mate',
    'Dale un toque industrial y moderno a tu comedor, terraza o negocio en Honduras con la silla metálica Smak, diseñada para combinar máxima durabilidad con un estilo atemporal.

Características Principales

 • Estilo Industrial: Diseño clásico metálico en acabado negro mate, ideal para comedores, cafeterías, restaurantes y espacios de home office.
 • Estructura Robusta: Construcción 100% metálica resistente al uso diario y fácil de limpiar.
 • Detalles Funcionales: Asiento con perforaciones para ventilación y flujo de aire, junto con patas con protecciones para cuidar tus pisos de rayones.
 • Diseño Apilable: Permite guardar y optimizar espacio de almacenamiento rápidamente cuando no esté en uso.',
    4200.00,
    3590.00,
    25,
    '45 × 45 × 85 cm',
    '150 kg por silla (100% acero estampado)',
    'Negro',
    'Sillas y Bancos',
    '["set 4 sillas tolix", "juego 4 sillas", "sillas metalicas", "comedor industrial", "skm-941-ne-4"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e5f7a1c7dfc24bb69c17efe4e11becff~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_34b4fca8a6174da39d5573e512a43a09~mv2.png", "https://static.wixstatic.com/media/f6ccd1_bda261db88594662a2430aec045e95e9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_83f2a8a05c7741cab0305a981a207b1f~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7c384c05ab4342d1a62a44ea275ce68a~mv2.jpg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-941-NE-4',
    'Set de 4 Sillas Metálicas Estilo Tolix Smak - Negro Mate',
    'Dale un toque industrial y moderno a tu comedor, terraza o negocio en Honduras con la silla metálica Smak, diseñada para combinar máxima durabilidad con un estilo atemporal.

Características Principales

 • Estilo Industrial: Diseño clásico metálico en acabado negro mate, ideal para comedores, cafeterías, restaurantes y espacios de home office.
 • Estructura Robusta: Construcción 100% metálica resistente al uso diario y fácil de limpiar.
 • Detalles Funcionales: Asiento con perforaciones para ventilación y flujo de aire, junto con patas con protecciones para cuidar tus pisos de rayones.
 • Diseño Apilable: Permite guardar y optimizar espacio de almacenamiento rápidamente cuando no esté en uso.',
    4200.00,
    3590.00,
    25,
    '45 × 45 × 85 cm',
    '150 kg por silla (100% acero estampado)',
    'Negro',
    'Sillas y Bancos',
    '["set 4 sillas tolix", "juego 4 sillas", "sillas metalicas", "comedor industrial", "skm-941-ne-4"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e5f7a1c7dfc24bb69c17efe4e11becff~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_34b4fca8a6174da39d5573e512a43a09~mv2.png", "https://static.wixstatic.com/media/f6ccd1_bda261db88594662a2430aec045e95e9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_83f2a8a05c7741cab0305a981a207b1f~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7c384c05ab4342d1a62a44ea275ce68a~mv2.jpg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGB-105-NE',
    'Perchero Organizador de Ropa Smak',
    'Mantén tu habitación ordenada con este Perchero Organizador de Ropa de la marca Smak. Es una excelente opción de organización que brinda estilo y funcionalidad para tu espacio en el hogar.
Características Principales
 • Organización versátil: Su diseño de doble barra es ideal para colgar prendas cortas y largas.
 • Almacenamiento extra: Incluye un práctico estante inferior diseñado para colocar calzado, etc..
 • Material resistente: Está fabricado en acero inoxidable para una mayor durabilidad.
 • Gran capacidad: Su estructura robusta permite soportar hasta 33 Kg de peso.
 • Instalación rápida: Es un mueble sumamente fácil de armar.',
    1450.00,
    1190.00,
    40,
    '110 × 40 × 150 cm',
    '40 kg (Estructura de acero tubular)',
    'Negro',
    'Muebles y Organización',
    '["perchero", "organizador de ropa", "closet abierto", "estante ropa", "zgb-105-ne", "105"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_2c34eb84c77e430dbc3e36343249ddcd~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_b14e0bfaf54342d393d319141baab5c5~mv2.png", "https://static.wixstatic.com/media/f6ccd1_6d9bf1461b00486293a22b590968abf1~mv2.png", "https://static.wixstatic.com/media/f6ccd1_15767f8b18ee4fffa099219f18333889~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGB-105-NE',
    'Perchero Organizador de Ropa Smak',
    'Mantén tu habitación ordenada con este Perchero Organizador de Ropa de la marca Smak. Es una excelente opción de organización que brinda estilo y funcionalidad para tu espacio en el hogar.
Características Principales
 • Organización versátil: Su diseño de doble barra es ideal para colgar prendas cortas y largas.
 • Almacenamiento extra: Incluye un práctico estante inferior diseñado para colocar calzado, etc..
 • Material resistente: Está fabricado en acero inoxidable para una mayor durabilidad.
 • Gran capacidad: Su estructura robusta permite soportar hasta 33 Kg de peso.
 • Instalación rápida: Es un mueble sumamente fácil de armar.',
    1450.00,
    1190.00,
    40,
    '110 × 40 × 150 cm',
    '40 kg (Estructura de acero tubular)',
    'Negro',
    'Muebles y Organización',
    '["perchero", "organizador de ropa", "closet abierto", "estante ropa", "zgb-105-ne", "105"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_2c34eb84c77e430dbc3e36343249ddcd~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_b14e0bfaf54342d393d319141baab5c5~mv2.png", "https://static.wixstatic.com/media/f6ccd1_6d9bf1461b00486293a22b590968abf1~mv2.png", "https://static.wixstatic.com/media/f6ccd1_15767f8b18ee4fffa099219f18333889~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGB-014-NE',
    'Clóset Armable y Portátil Color Negro Smak',
    'Mantén tu ropa organizada y protegida con este práctico clóset armable y portátil de la marca Smak. Es la solución perfecta para optimizar el espacio en tu habitación, ofreciendo un diseño ligero, funcional y fácil de adaptar a cualquier ambiente en tu hogar.
Características Principales
 • Distribución eficiente: El diseño incluye espacios diseñados específicamente para colgadores, permitiendo que tu ropa se mantenga sin arrugas.
 • Almacenamiento extra: Cuenta con múltiples estantes ideales para acomodar ropa doblada, zapatos o cajas organizadoras.
 • Máxima protección: Está equipado con una cubierta protectora de tela no tejida, la cual mantiene todo tu guardarropa completamente libre de polvo.
 • Higiene y cuidado: Los materiales de fabricación aseguran que el clóset sea muy fácil de limpiar.
 • Instalación práctica: Este mueble requiere armado, lo que facilita su transporte e instalación en cualquier habitación donde lo necesites.',
    1650.00,
    1390.00,
    35,
    '105 × 45 × 170 cm',
    '50 kg (Tubos de acero y tela impermeable)',
    'Negro',
    'Muebles y Organización',
    '["closet armable", "ropero portatil", "armario tela", "guardaropa", "zgb-014-ne", "014"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_3b7dfccaeb68495a99dbed6b653936ce~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_bbae1d54a96c4325b8a85a3b931ca81e~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9d845973e15b4ca4a0b47c014204fc92~mv2.png", "https://static.wixstatic.com/media/f6ccd1_8ea5cc8401d9494fbd446f9751f165f0~mv2.png", "https://static.wixstatic.com/media/f6ccd1_c10b29bb51004f8b9982d1c31ba7ba96~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGB-014-NE',
    'Clóset Armable y Portátil Color Negro Smak',
    'Mantén tu ropa organizada y protegida con este práctico clóset armable y portátil de la marca Smak. Es la solución perfecta para optimizar el espacio en tu habitación, ofreciendo un diseño ligero, funcional y fácil de adaptar a cualquier ambiente en tu hogar.
Características Principales
 • Distribución eficiente: El diseño incluye espacios diseñados específicamente para colgadores, permitiendo que tu ropa se mantenga sin arrugas.
 • Almacenamiento extra: Cuenta con múltiples estantes ideales para acomodar ropa doblada, zapatos o cajas organizadoras.
 • Máxima protección: Está equipado con una cubierta protectora de tela no tejida, la cual mantiene todo tu guardarropa completamente libre de polvo.
 • Higiene y cuidado: Los materiales de fabricación aseguran que el clóset sea muy fácil de limpiar.
 • Instalación práctica: Este mueble requiere armado, lo que facilita su transporte e instalación en cualquier habitación donde lo necesites.',
    1650.00,
    1390.00,
    35,
    '105 × 45 × 170 cm',
    '50 kg (Tubos de acero y tela impermeable)',
    'Negro',
    'Muebles y Organización',
    '["closet armable", "ropero portatil", "armario tela", "guardaropa", "zgb-014-ne", "014"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_3b7dfccaeb68495a99dbed6b653936ce~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_bbae1d54a96c4325b8a85a3b931ca81e~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9d845973e15b4ca4a0b47c014204fc92~mv2.png", "https://static.wixstatic.com/media/f6ccd1_8ea5cc8401d9494fbd446f9751f165f0~mv2.png", "https://static.wixstatic.com/media/f6ccd1_c10b29bb51004f8b9982d1c31ba7ba96~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGS-684',
    'Banco de Trabajo Plegable Smak | Capacidad 100 kg',
    'Optimiza tus proyectos de taller o bricolaje en casa con el Banco de Trabajo Plegable Smak, la herramienta ideal para quienes buscan estabilidad, precisión y practicidad en un diseño compacto. Perfecto para profesionales de la carpintería, construcción o entusiastas del DIY en Honduras que necesitan maximizar su espacio de trabajo.
Características Principales
 • Diseño Plegable y Portátil: Se pliega en segundos para guardarlo fácilmente en el garaje, bodega o transportarlo en la paila de tu carro hacia cualquier sitio de trabajo.
 • Superficie de Melamina Resistente: Panel de madera recubierto en melamina de alta durabilidad, diseñada para resistir el uso constante y facilitar la limpieza.
 • 2 Prensas Ajustables Independientes: Manejo preciso mediante manivelas individuales que permiten sujetar firmemente piezas irregulares, tablas o tubos.
 • Escala Métrica y Guía Integrada: Incluye mediciones impresas directamente en la mesa para tomar medidas y calcular ángulos de forma rápida sin necesidad de un metro adicional.
 • Estructura Metálica de Alta Resistencia: Diseñado con bases firmes que soportan con seguridad hasta 100 kg de carga distribuida.',
    1890.00,
    1590.00,
    25,
    '60.5 × 63 × 75.5 cm',
    '100 kg (Mesa de trabajo y mordazas)',
    'Negro',
    'Muebles y Organización',
    '["banco de trabajo", "mesa de taller", "plegable", "herramientas", "bricolaje", "zgs-684", "684"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_f8f7b86a935743ca9b2c6fd5f9d125c2~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_51700d9526fe4384a87011e84855055f~mv2.png", "https://static.wixstatic.com/media/f6ccd1_ca62ec3ee22041d8b2396777d09edc21~mv2.png", "https://static.wixstatic.com/media/f6ccd1_62b5338cd5954d8abe48c4afd3291cf4~mv2.png", "https://static.wixstatic.com/media/f6ccd1_89068d5a272e4e9d9e7648007723ece3~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGS-684',
    'Banco de Trabajo Plegable Smak | Capacidad 100 kg',
    'Optimiza tus proyectos de taller o bricolaje en casa con el Banco de Trabajo Plegable Smak, la herramienta ideal para quienes buscan estabilidad, precisión y practicidad en un diseño compacto. Perfecto para profesionales de la carpintería, construcción o entusiastas del DIY en Honduras que necesitan maximizar su espacio de trabajo.
Características Principales
 • Diseño Plegable y Portátil: Se pliega en segundos para guardarlo fácilmente en el garaje, bodega o transportarlo en la paila de tu carro hacia cualquier sitio de trabajo.
 • Superficie de Melamina Resistente: Panel de madera recubierto en melamina de alta durabilidad, diseñada para resistir el uso constante y facilitar la limpieza.
 • 2 Prensas Ajustables Independientes: Manejo preciso mediante manivelas individuales que permiten sujetar firmemente piezas irregulares, tablas o tubos.
 • Escala Métrica y Guía Integrada: Incluye mediciones impresas directamente en la mesa para tomar medidas y calcular ángulos de forma rápida sin necesidad de un metro adicional.
 • Estructura Metálica de Alta Resistencia: Diseñado con bases firmes que soportan con seguridad hasta 100 kg de carga distribuida.',
    1890.00,
    1590.00,
    25,
    '60.5 × 63 × 75.5 cm',
    '100 kg (Mesa de trabajo y mordazas)',
    'Negro',
    'Muebles y Organización',
    '["banco de trabajo", "mesa de taller", "plegable", "herramientas", "bricolaje", "zgs-684", "684"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_f8f7b86a935743ca9b2c6fd5f9d125c2~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_51700d9526fe4384a87011e84855055f~mv2.png", "https://static.wixstatic.com/media/f6ccd1_ca62ec3ee22041d8b2396777d09edc21~mv2.png", "https://static.wixstatic.com/media/f6ccd1_62b5338cd5954d8abe48c4afd3291cf4~mv2.png", "https://static.wixstatic.com/media/f6ccd1_89068d5a272e4e9d9e7648007723ece3~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGS-926-NE',
    'Silla Bar con Respaldo y Altura Ajustable Smak',
    'Añade funcionalidad, comodidad y estilo a tu hogar, oficina o negocio con la Silla Bar con Respaldo y Ruedas Smak. Es el complemento ideal para barras, escritorios, estudios o salones de belleza en Honduras.
Características Principales
 • Altura regulable con gas comprimido: Su mecanismo permite adaptar la altura de manera suave y precisa según tus necesidades.
 • Diseño ergonómico: Cuenta con un respaldo cómodo y un asiento tapizado en ecocuero, lo que facilita su limpieza y garantiza durabilidad.
 • Movilidad y soporte: Dispone de una elegante base cromada con ruedas resistentes y un práctico anillo apoya pies.
 • Rotación completa: Ofrece giro de 360° para brindarte total libertad de movimiento en cualquier dirección.',
    1400.00,
    1190.00,
    30,
    '32 × 47/61 cm',
    '120 kg (Pistón a gas reforzado)',
    'Negro',
    'Sillas y Bancos',
    '["silla bar", "taburete elam", "banco barra", "giratorio", "zgs-926", "926"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_17b38c26f362413ea77815f7efe4ff39~mv2.png", "https://static.wixstatic.com/media/f6ccd1_cc521a665ebb4de09037d772ec96944e~mv2.png", "https://static.wixstatic.com/media/f6ccd1_fd22ad5008464251a386bcb2eeef06a6~mv2.png", "https://static.wixstatic.com/media/f6ccd1_3bfa07fc75cf425885322cd487295909~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f6d0b2c10ecd475d991edc5eb9470f8f~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f90e84e35a984e36996be0b377ffb406~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGS-926-NE',
    'Silla Bar con Respaldo y Altura Ajustable Smak',
    'Añade funcionalidad, comodidad y estilo a tu hogar, oficina o negocio con la Silla Bar con Respaldo y Ruedas Smak. Es el complemento ideal para barras, escritorios, estudios o salones de belleza en Honduras.
Características Principales
 • Altura regulable con gas comprimido: Su mecanismo permite adaptar la altura de manera suave y precisa según tus necesidades.
 • Diseño ergonómico: Cuenta con un respaldo cómodo y un asiento tapizado en ecocuero, lo que facilita su limpieza y garantiza durabilidad.
 • Movilidad y soporte: Dispone de una elegante base cromada con ruedas resistentes y un práctico anillo apoya pies.
 • Rotación completa: Ofrece giro de 360° para brindarte total libertad de movimiento en cualquier dirección.',
    1400.00,
    1190.00,
    30,
    '32 × 47/61 cm',
    '120 kg (Pistón a gas reforzado)',
    'Negro',
    'Sillas y Bancos',
    '["silla bar", "taburete elam", "banco barra", "giratorio", "zgs-926", "926"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_17b38c26f362413ea77815f7efe4ff39~mv2.png", "https://static.wixstatic.com/media/f6ccd1_cc521a665ebb4de09037d772ec96944e~mv2.png", "https://static.wixstatic.com/media/f6ccd1_fd22ad5008464251a386bcb2eeef06a6~mv2.png", "https://static.wixstatic.com/media/f6ccd1_3bfa07fc75cf425885322cd487295909~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f6d0b2c10ecd475d991edc5eb9470f8f~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f90e84e35a984e36996be0b377ffb406~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGS-622',
    'Diablo Carro de Carga Plegable de Aluminio Smak | Capacidad 90 kg',
    'Facilita el transporte de cajas, mercadería y cargas pesadas sin lastimar tu espalda con el Diablo Carro de Carga Plegable de Aluminio Smak. Diseñado para brindar la máxima resistencia con el menor peso posible, es el aliado ideal para negocios, bodegas, servicios de entrega, mudanzas o para las tareas pesadas del hogar en Honduras.
Su sistema plegable de un solo toque y su mango telescópico te permiten ajustarlo a tu medida y guardarlo fácilmente en la paila, el baúl del carro o detrás de una puerta sin ocupar espacio.
Características Principales
 • Estructura de Aluminio Liviana y Resistente: Fabricado en aluminio de alta durabilidad que soporta trabajo pesado manteniendo una estructura ágil y fácil de maniobrar.
 • Altura Regulable: Cuenta con un mango telescópico que se ajusta desde 70 cm (altura mínima) hasta 110 cm (altura máxima) para adaptarse cómodamente a la estatura del usuario y a diferentes tipos de carga.
 • Ruedas de Goma Maciza: Garantizan un rodamiento suave y silencioso sobre diversos tipos de piso (concreto, adoquín, azulejo), libres de mantenimiento y totalmente a prueba de pinchazos.
 • Gran Capacidad de Carga (90 kg): Diseñado para soportar con total estabilidad hasta 90 kilos (aprox. 198 lbs) distribuida en su pala reforzada.
 • Pala Amplia y Plegable: Base metálica de 25 x 35 cm que ofrece un excelente punto de apoyo para cajas grandes, garrafones, sacos y electrodomésticos.
 • Diseño Ultra Compacto: Tanto la base como las ruedas se pliegan hacia adentro para guardarse en espacios reducidos o llevarlo contigo a cualquier lugar de trabajo.',
    1200.00,
    990.00,
    50,
    '30 × 24 × 71/107 cm',
    '90 kg (200 lbs)',
    'Negro',
    'Muebles y Organización',
    '["carro de carga", "diablo", "plegable", "carretilla", "aluminio", "90 kg", "zgs-622", "622"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_86523fe262b54b66b5559ad4a8ed516e~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7e1b0e4e37d14e08b94f0e0cf8b1a522~mv2.png", "https://static.wixstatic.com/media/f6ccd1_6eb34532285c4dd2b4a2535857ca1c1b~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGS-622',
    'Diablo Carro de Carga Plegable de Aluminio Smak | Capacidad 90 kg',
    'Facilita el transporte de cajas, mercadería y cargas pesadas sin lastimar tu espalda con el Diablo Carro de Carga Plegable de Aluminio Smak. Diseñado para brindar la máxima resistencia con el menor peso posible, es el aliado ideal para negocios, bodegas, servicios de entrega, mudanzas o para las tareas pesadas del hogar en Honduras.
Su sistema plegable de un solo toque y su mango telescópico te permiten ajustarlo a tu medida y guardarlo fácilmente en la paila, el baúl del carro o detrás de una puerta sin ocupar espacio.
Características Principales
 • Estructura de Aluminio Liviana y Resistente: Fabricado en aluminio de alta durabilidad que soporta trabajo pesado manteniendo una estructura ágil y fácil de maniobrar.
 • Altura Regulable: Cuenta con un mango telescópico que se ajusta desde 70 cm (altura mínima) hasta 110 cm (altura máxima) para adaptarse cómodamente a la estatura del usuario y a diferentes tipos de carga.
 • Ruedas de Goma Maciza: Garantizan un rodamiento suave y silencioso sobre diversos tipos de piso (concreto, adoquín, azulejo), libres de mantenimiento y totalmente a prueba de pinchazos.
 • Gran Capacidad de Carga (90 kg): Diseñado para soportar con total estabilidad hasta 90 kilos (aprox. 198 lbs) distribuida en su pala reforzada.
 • Pala Amplia y Plegable: Base metálica de 25 x 35 cm que ofrece un excelente punto de apoyo para cajas grandes, garrafones, sacos y electrodomésticos.
 • Diseño Ultra Compacto: Tanto la base como las ruedas se pliegan hacia adentro para guardarse en espacios reducidos o llevarlo contigo a cualquier lugar de trabajo.',
    1200.00,
    990.00,
    50,
    '30 × 24 × 71/107 cm',
    '90 kg (200 lbs)',
    'Negro',
    'Muebles y Organización',
    '["carro de carga", "diablo", "plegable", "carretilla", "aluminio", "90 kg", "zgs-622", "622"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_86523fe262b54b66b5559ad4a8ed516e~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7e1b0e4e37d14e08b94f0e0cf8b1a522~mv2.png", "https://static.wixstatic.com/media/f6ccd1_6eb34532285c4dd2b4a2535857ca1c1b~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGB-146-NM',
    'Grifo Monocomando Extensible de Acero Inoxidable Smak | Negro Mate',
    'Moderniza tu cocina con el Grifo Monocomando Extensible Smak, una combinación perfecta de diseño vanguardista y funcionalidad superior. Su elegante acabado en negro mate le otorga un toque contemporáneo a cualquier lavatrastos, mientras que su manguera extraíble y cuello alto facilitan la limpieza de ollas voluminosas y el lavado diario de tu vajilla con total comodidad.
Características Principales
 • Manguera Extensible Integrada: Permite dirigir el flujo de agua exactamente adonde lo necesitas, llegando a cada rincón del lavatrastos o llenando recipientes fuera de él.
 • 2 Modos de Salida de Agua: Cambia fácilmente entre modo chorro (salida continua e ideal para llenar ollas rápidamente) y modo spray (ducha suave óptima para enjuagar vajilla, frutas y verduras).
 • Rotación Completa de 360°: El cuello gira libremente en todas las direcciones, brindando máxima flexibilidad en lavatrastos de una o dos pozas.
 • Fabricación en Acero Inoxidable: Estructura robusta y duradera, resistente a la corrosión, el óxido y las manchas de agua para un acabado impecable por más tiempo.
 • Manejo Monocomando Práctico: Regula el caudal y la temperatura del agua de forma suave y precisa con una sola mano.
 • Fácil Instalación: Diseñado para montarse de manera rápida y sencilla en conexiones estándar de cocina.',
    1350.00,
    1090.00,
    30,
    '40 × 25.4 cm',
    'Latón macizo y manguera siliconada extraíble',
    'Negro Mate, Gris Inox',
    'Cocina y Baño',
    '["grifo monocomando", "llave lavatrastos", "grifo extensible", "negro mate", "todd", "zgb-146-nm"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_f837bab47cfe4210a6faec455b7a1db2~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_752e126ead3b483b83092baff39628c4~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f767869322af418e900f0ebf5a5e17c5~mv2.png", "https://static.wixstatic.com/media/f6ccd1_425d4e4cbdaa4840a88df040b3544e5a~mv2.png", "https://static.wixstatic.com/media/f6ccd1_70af60c3906f452ba14ab91569c1d865~mv2.png", "https://static.wixstatic.com/media/f6ccd1_296c0ac742c34dda93a0a482d81bba3c~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_120acc2080694546959e9af3888c9623~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f07e5e3d60a746d7954475ffe4a12610~mv2.png", "https://static.wixstatic.com/media/f6ccd1_32e9fd433aa74047947c9bc8fdbb1f30~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGB-146-NM',
    'Grifo Monocomando Extensible de Acero Inoxidable Smak | Negro Mate',
    'Moderniza tu cocina con el Grifo Monocomando Extensible Smak, una combinación perfecta de diseño vanguardista y funcionalidad superior. Su elegante acabado en negro mate le otorga un toque contemporáneo a cualquier lavatrastos, mientras que su manguera extraíble y cuello alto facilitan la limpieza de ollas voluminosas y el lavado diario de tu vajilla con total comodidad.
Características Principales
 • Manguera Extensible Integrada: Permite dirigir el flujo de agua exactamente adonde lo necesitas, llegando a cada rincón del lavatrastos o llenando recipientes fuera de él.
 • 2 Modos de Salida de Agua: Cambia fácilmente entre modo chorro (salida continua e ideal para llenar ollas rápidamente) y modo spray (ducha suave óptima para enjuagar vajilla, frutas y verduras).
 • Rotación Completa de 360°: El cuello gira libremente en todas las direcciones, brindando máxima flexibilidad en lavatrastos de una o dos pozas.
 • Fabricación en Acero Inoxidable: Estructura robusta y duradera, resistente a la corrosión, el óxido y las manchas de agua para un acabado impecable por más tiempo.
 • Manejo Monocomando Práctico: Regula el caudal y la temperatura del agua de forma suave y precisa con una sola mano.
 • Fácil Instalación: Diseñado para montarse de manera rápida y sencilla en conexiones estándar de cocina.',
    1350.00,
    1090.00,
    30,
    '40 × 25.4 cm',
    'Latón macizo y manguera siliconada extraíble',
    'Negro Mate, Gris Inox',
    'Cocina y Baño',
    '["grifo monocomando", "llave lavatrastos", "grifo extensible", "negro mate", "todd", "zgb-146-nm"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_f837bab47cfe4210a6faec455b7a1db2~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_752e126ead3b483b83092baff39628c4~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f767869322af418e900f0ebf5a5e17c5~mv2.png", "https://static.wixstatic.com/media/f6ccd1_425d4e4cbdaa4840a88df040b3544e5a~mv2.png", "https://static.wixstatic.com/media/f6ccd1_70af60c3906f452ba14ab91569c1d865~mv2.png", "https://static.wixstatic.com/media/f6ccd1_296c0ac742c34dda93a0a482d81bba3c~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_120acc2080694546959e9af3888c9623~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f07e5e3d60a746d7954475ffe4a12610~mv2.png", "https://static.wixstatic.com/media/f6ccd1_32e9fd433aa74047947c9bc8fdbb1f30~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGB-146-INOX',
    'Grifo Monocomando Extensible de Acero Inoxidable Smak | Inox Cepillado',
    '',
    1350.00,
    1090.00,
    30,
    '40 × 25.4 cm',
    'Acero inoxidable SUS 304 cepillado',
    'Inox',
    'Cocina y Baño',
    '["grifo monocomando", "llave extensible", "inox", "acero inoxidable", "zgb-146-inox"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGB-146-INOX',
    'Grifo Monocomando Extensible de Acero Inoxidable Smak | Inox Cepillado',
    '',
    1350.00,
    1090.00,
    30,
    '40 × 25.4 cm',
    'Acero inoxidable SUS 304 cepillado',
    'Inox',
    'Cocina y Baño',
    '["grifo monocomando", "llave extensible", "inox", "acero inoxidable", "zgb-146-inox"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGM-030-NE-NE',
    'Mesa Auxiliar de Arrime Smak - Acabado Símil Mármol Negro',
    'Transforma tu sala con esta moderna y práctica mesa auxiliar de la marca Smak. Gracias a su inteligente diseño, es el mueble perfecto para acercar a tu sofá o sillón, brindándote una superficie cómoda para tu taza de café, el control remoto o tu laptop sin ocupar mucho espacio. Es el complemento ideal que une el estilo contemporáneo con la funcionalidad que tu hogar necesita.

Características Principales

 • Superficie elegante: Fabricada con una tapa de madera MDF que luce un sofisticado acabado símil mármol.
 • Estructura resistente: Soporte fabricado con una base de metal sólida y duradera.
 • Toque premium: Cuenta con un acabado laqueado que resalta los detalles del diseño.
 • Mantenimiento práctico: Su superficie es muy fácil de limpiar en el día a día.
 • Uso recomendado: Diseñada específicamente como mesa de arrime para el área del living o sala de estar.
 • Instalación: El producto requiere armado antes de su uso.',
    1290.00,
    990.00,
    40,
    '45 × 30 × 60 cm',
    '25 kg (Acero al carbono y acabado símil mármol)',
    'Negro',
    'Muebles y Organización',
    '["mesa de arrime", "mesa auxiliar", "mesa lateral", "sofa", "cama", "marmol negro", "zgm-030-ne-ne"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_efc071bdbd544b258f3316a031689996~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e03ca97eb51f4c49af2ae92d7d54e4d3~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9a1f668fc9e54774ae1b98bbd50f2f80~mv2.png", "https://static.wixstatic.com/media/f6ccd1_95a0975839b64e18ac9f208697d118e2~mv2.webp"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGM-030-NE-NE',
    'Mesa Auxiliar de Arrime Smak - Acabado Símil Mármol Negro',
    'Transforma tu sala con esta moderna y práctica mesa auxiliar de la marca Smak. Gracias a su inteligente diseño, es el mueble perfecto para acercar a tu sofá o sillón, brindándote una superficie cómoda para tu taza de café, el control remoto o tu laptop sin ocupar mucho espacio. Es el complemento ideal que une el estilo contemporáneo con la funcionalidad que tu hogar necesita.

Características Principales

 • Superficie elegante: Fabricada con una tapa de madera MDF que luce un sofisticado acabado símil mármol.
 • Estructura resistente: Soporte fabricado con una base de metal sólida y duradera.
 • Toque premium: Cuenta con un acabado laqueado que resalta los detalles del diseño.
 • Mantenimiento práctico: Su superficie es muy fácil de limpiar en el día a día.
 • Uso recomendado: Diseñada específicamente como mesa de arrime para el área del living o sala de estar.
 • Instalación: El producto requiere armado antes de su uso.',
    1290.00,
    990.00,
    40,
    '45 × 30 × 60 cm',
    '25 kg (Acero al carbono y acabado símil mármol)',
    'Negro',
    'Muebles y Organización',
    '["mesa de arrime", "mesa auxiliar", "mesa lateral", "sofa", "cama", "marmol negro", "zgm-030-ne-ne"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_efc071bdbd544b258f3316a031689996~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e03ca97eb51f4c49af2ae92d7d54e4d3~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9a1f668fc9e54774ae1b98bbd50f2f80~mv2.png", "https://static.wixstatic.com/media/f6ccd1_95a0975839b64e18ac9f208697d118e2~mv2.webp"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGS-707',
    'Escalera Multipropósito de Aluminio Smak 16 Escalones',
    '¡Lleva tus proyectos al siguiente nivel con la Escalera Multipropósito de Aluminio Smak! Diseñada para brindar máxima funcionalidad y seguridad, esta escalera es la herramienta definitiva para el hogar, el taller o la construcción en Honduras.
¿Qué la hace única?
 • 10 Posiciones en Una: Olvídate de tener varias escaleras acumulando espacio. Con su sistema de bisagras inteligentes, puedes transformarla fácilmente en escalera de tijera, de extensión directa, de andamio (con las plataformas incluidas), de pared y muchas otras configuraciones para adaptarse a cualquier tarea.
 • Gran Alcance y Ligereza:
    • Altura Máxima: Alcanza hasta 440 cm en su posición de extensión total, ideal para trabajos en techos altos, fachadas o poda de árboles.
    • Peso: Pesa tan solo 12.7 kg, lo que la hace fácil de transportar y mover por una sola persona.
 • Diseño Compacto y Fácil Almacenamiento: Cuando no la estés usando, se pliega a un tamaño ultra compacto de 120 cm x 34.5 cm, perfecto para guardarla en cualquier clóset, garaje o incluso en el baúl del auto.
 • Incluye 2 Plataformas de Andamio de Acero Antideslizantes: Convierte tu escalera multipropósito en un andamio estable y seguro. Las dos plataformas de acero, con superficie perforada antideslizante, te brindan un área de trabajo cómoda y firme a diferentes alturas.
 • Materiales de Alta Calidad y Seguridad:
    • Fabricada con aluminio extruido de alta resistencia, que soporta hasta 150 kg (cumpliendo con estándares de seguridad internacionales).
    • Bisagras de bloqueo automático de alta resistencia que garantizan la estabilidad en cada posición.
    • Patas de goma antideslizantes para una mayor adherencia en cualquier tipo de suelo.',
    3800.00,
    3350.00,
    25,
    '34 × 120/440 cm',
    '150 kg (Aluminio de aviación 6063)',
    'Negro',
    'Escaleras',
    '["escalera multiproposito", "andamio", "16 escalones", "aluminio", "plegable", "zgs-707", "707"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_298a5327119e41eca093ab5b636ff305~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7055262eb0484c64b24a632eed964935~mv2.png", "https://static.wixstatic.com/media/f6ccd1_c5e7f09fe4b5490f918f133e93c17c74~mv2.png", "https://static.wixstatic.com/media/f6ccd1_3906a8bda2e14536a8231396ac55a74a~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGS-707',
    'Escalera Multipropósito de Aluminio Smak 16 Escalones',
    '¡Lleva tus proyectos al siguiente nivel con la Escalera Multipropósito de Aluminio Smak! Diseñada para brindar máxima funcionalidad y seguridad, esta escalera es la herramienta definitiva para el hogar, el taller o la construcción en Honduras.
¿Qué la hace única?
 • 10 Posiciones en Una: Olvídate de tener varias escaleras acumulando espacio. Con su sistema de bisagras inteligentes, puedes transformarla fácilmente en escalera de tijera, de extensión directa, de andamio (con las plataformas incluidas), de pared y muchas otras configuraciones para adaptarse a cualquier tarea.
 • Gran Alcance y Ligereza:
    • Altura Máxima: Alcanza hasta 440 cm en su posición de extensión total, ideal para trabajos en techos altos, fachadas o poda de árboles.
    • Peso: Pesa tan solo 12.7 kg, lo que la hace fácil de transportar y mover por una sola persona.
 • Diseño Compacto y Fácil Almacenamiento: Cuando no la estés usando, se pliega a un tamaño ultra compacto de 120 cm x 34.5 cm, perfecto para guardarla en cualquier clóset, garaje o incluso en el baúl del auto.
 • Incluye 2 Plataformas de Andamio de Acero Antideslizantes: Convierte tu escalera multipropósito en un andamio estable y seguro. Las dos plataformas de acero, con superficie perforada antideslizante, te brindan un área de trabajo cómoda y firme a diferentes alturas.
 • Materiales de Alta Calidad y Seguridad:
    • Fabricada con aluminio extruido de alta resistencia, que soporta hasta 150 kg (cumpliendo con estándares de seguridad internacionales).
    • Bisagras de bloqueo automático de alta resistencia que garantizan la estabilidad en cada posición.
    • Patas de goma antideslizantes para una mayor adherencia en cualquier tipo de suelo.',
    3800.00,
    3350.00,
    25,
    '34 × 120/440 cm',
    '150 kg (Aluminio de aviación 6063)',
    'Negro',
    'Escaleras',
    '["escalera multiproposito", "andamio", "16 escalones", "aluminio", "plegable", "zgs-707", "707"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_298a5327119e41eca093ab5b636ff305~mv2.png", "https://static.wixstatic.com/media/f6ccd1_7055262eb0484c64b24a632eed964935~mv2.png", "https://static.wixstatic.com/media/f6ccd1_c5e7f09fe4b5490f918f133e93c17c74~mv2.png", "https://static.wixstatic.com/media/f6ccd1_3906a8bda2e14536a8231396ac55a74a~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGB-107-NE',
    'Carrito Organizador de Metal Smak - 3 Niveles con Ruedas',
    '¿Falta de espacio en casa o en tu negocio? Mantén todo en perfecto orden y al alcance de tu mano con el Carrito Organizador de 3 Niveles de la marca Smak. Su diseño versátil, resistente y moderno lo convierte en el aliado perfecto para cualquier rincón de tu hogar u oficina en Honduras.
Ya sea que lo necesites para organizar la despensa de tu cocina, los artículos de higiene en el baño, los útiles escolares o incluso como estación de trabajo en un salón de belleza, este carrito se adapta a todas tus necesidades.
Características Principales
 • Estructura Resistente de Metal: Fabricado con materiales de alta calidad, su estructura metálica garantiza durabilidad y estabilidad para el uso diario.
 • Gran Capacidad de Carga: Soporta un total de hasta 30 kg, permitiéndote almacenar desde frascos y herramientas hasta libros y productos de limpieza pesados sin deformarse.
 • Movilidad Inteligente (4 Ruedas): Muévelo de una habitación a otra sin ningún esfuerzo gracias a sus 4 ruedas de giro suave y su asa superior ergonómica.
 • Sistema de Bloqueo Seguro: ¿Necesitas que se quede fijo en un solo lugar? Su sistema de bloqueo en las ruedas garantiza que el carrito no se mueva de manera accidental.
 • Almacenamiento Espacioso: Cuenta con 3 cajones tipo bandeja con bordes elevados que evitan que tus objetos se caigan mientras lo trasladas.',
    1150.00,
    890.00,
    60,
    '45 × 35 × 85 cm',
    '45 kg (15 kg por canasta)',
    'Negro',
    'Muebles y Organización',
    '["carrito organizador", "carrito 3 niveles", "ruedas", "cocina", "bano", "zgb-107-ne", "107"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_f34e9dcc099b420b9d8bc176c70f06c6~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_24fb3fbd8b2e4a5988a1e5b96b290c8d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_44a230b490984e9a820303057e22c152~mv2.png", "https://static.wixstatic.com/media/f6ccd1_77688f03eca149899fff6b4b63e81111~mv2.png", "https://static.wixstatic.com/media/f6ccd1_87e4e0bee90c4f65820255c7ea5d7429~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGB-107-NE',
    'Carrito Organizador de Metal Smak - 3 Niveles con Ruedas',
    '¿Falta de espacio en casa o en tu negocio? Mantén todo en perfecto orden y al alcance de tu mano con el Carrito Organizador de 3 Niveles de la marca Smak. Su diseño versátil, resistente y moderno lo convierte en el aliado perfecto para cualquier rincón de tu hogar u oficina en Honduras.
Ya sea que lo necesites para organizar la despensa de tu cocina, los artículos de higiene en el baño, los útiles escolares o incluso como estación de trabajo en un salón de belleza, este carrito se adapta a todas tus necesidades.
Características Principales
 • Estructura Resistente de Metal: Fabricado con materiales de alta calidad, su estructura metálica garantiza durabilidad y estabilidad para el uso diario.
 • Gran Capacidad de Carga: Soporta un total de hasta 30 kg, permitiéndote almacenar desde frascos y herramientas hasta libros y productos de limpieza pesados sin deformarse.
 • Movilidad Inteligente (4 Ruedas): Muévelo de una habitación a otra sin ningún esfuerzo gracias a sus 4 ruedas de giro suave y su asa superior ergonómica.
 • Sistema de Bloqueo Seguro: ¿Necesitas que se quede fijo en un solo lugar? Su sistema de bloqueo en las ruedas garantiza que el carrito no se mueva de manera accidental.
 • Almacenamiento Espacioso: Cuenta con 3 cajones tipo bandeja con bordes elevados que evitan que tus objetos se caigan mientras lo trasladas.',
    1150.00,
    890.00,
    60,
    '45 × 35 × 85 cm',
    '45 kg (15 kg por canasta)',
    'Negro',
    'Muebles y Organización',
    '["carrito organizador", "carrito 3 niveles", "ruedas", "cocina", "bano", "zgb-107-ne", "107"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_f34e9dcc099b420b9d8bc176c70f06c6~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_24fb3fbd8b2e4a5988a1e5b96b290c8d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_44a230b490984e9a820303057e22c152~mv2.png", "https://static.wixstatic.com/media/f6ccd1_77688f03eca149899fff6b4b63e81111~mv2.png", "https://static.wixstatic.com/media/f6ccd1_87e4e0bee90c4f65820255c7ea5d7429~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGB-203-NM',
    'Barral Columna de Ducha Ajustable Smak - Acero Inoxidable (Negro Mate)',
    'Transforma tu baño en un spa moderno y elegante. Con el nuevo sistema de columna de ducha Smak, disfrutarás de una experiencia de baño superior todos los días. Su sofisticado diseño en color negro mate no solo aporta un toque minimalista y contemporáneo a tu cuarto de baño, sino que está construido para durar gracias a sus materiales de primera calidad.

Características Principales:

 • Acero Inoxidable de Alta Calidad: Fabricado para resistir la humedad y la corrosión, garantizando durabilidad y un aspecto impecable a lo largo del tiempo.
 • Diseño Totalmente Ajustable: Cuenta con altura ajustable en la barra principal, adaptándose a la estatura de cualquier miembro de la familia para una comodidad total.
 • Doble Experiencia de Ducha: Incluye una amplia regadera superior tipo lluvia con cabezal ajustable en ángulo, y una práctica y moderna ducha de mano (teléfono).
 • Jabonero Incorporado: Olvídate del desorden. Incluye un estante jabonero directamente en la columna para tener tus productos de aseo personal siempre al alcance.
 • Limpieza Fácil: Su cabezal cuadrado (20x19 cm) está equipado con boquillas anticalcáreas que evitan la acumulación de sarro y facilitan la limpieza.',
    3200.00,
    2750.00,
    30,
    'Altura ajustable 80–120 cm',
    'Acero inoxidable SUS 304 negro mate anticalcáreo',
    'Negro',
    'Cocina y Baño',
    '["columna de ducha", "barral ducha", "regadera lluvia", "ducha telefono", "negro mate", "zgb-203-nm"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_cede824b013d41a0bfcbd7b870bf6211~mv2.png", "https://static.wixstatic.com/media/f6ccd1_771c9938820247119c84a05e573d2500~mv2.png", "https://static.wixstatic.com/media/f6ccd1_dbbe2c4a8a464f028794bb098278cfeb~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9e95fb3908fb48d78e6a5fd9893a5942~mv2.png", "https://static.wixstatic.com/media/f6ccd1_d76e233b8d6c48f8ab0b0876f03bf0c0~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGB-203-NM',
    'Barral Columna de Ducha Ajustable Smak - Acero Inoxidable (Negro Mate)',
    'Transforma tu baño en un spa moderno y elegante. Con el nuevo sistema de columna de ducha Smak, disfrutarás de una experiencia de baño superior todos los días. Su sofisticado diseño en color negro mate no solo aporta un toque minimalista y contemporáneo a tu cuarto de baño, sino que está construido para durar gracias a sus materiales de primera calidad.

Características Principales:

 • Acero Inoxidable de Alta Calidad: Fabricado para resistir la humedad y la corrosión, garantizando durabilidad y un aspecto impecable a lo largo del tiempo.
 • Diseño Totalmente Ajustable: Cuenta con altura ajustable en la barra principal, adaptándose a la estatura de cualquier miembro de la familia para una comodidad total.
 • Doble Experiencia de Ducha: Incluye una amplia regadera superior tipo lluvia con cabezal ajustable en ángulo, y una práctica y moderna ducha de mano (teléfono).
 • Jabonero Incorporado: Olvídate del desorden. Incluye un estante jabonero directamente en la columna para tener tus productos de aseo personal siempre al alcance.
 • Limpieza Fácil: Su cabezal cuadrado (20x19 cm) está equipado con boquillas anticalcáreas que evitan la acumulación de sarro y facilitan la limpieza.',
    3200.00,
    2750.00,
    30,
    'Altura ajustable 80–120 cm',
    'Acero inoxidable SUS 304 negro mate anticalcáreo',
    'Negro',
    'Cocina y Baño',
    '["columna de ducha", "barral ducha", "regadera lluvia", "ducha telefono", "negro mate", "zgb-203-nm"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_cede824b013d41a0bfcbd7b870bf6211~mv2.png", "https://static.wixstatic.com/media/f6ccd1_771c9938820247119c84a05e573d2500~mv2.png", "https://static.wixstatic.com/media/f6ccd1_dbbe2c4a8a464f028794bb098278cfeb~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9e95fb3908fb48d78e6a5fd9893a5942~mv2.png", "https://static.wixstatic.com/media/f6ccd1_d76e233b8d6c48f8ab0b0876f03bf0c0~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGS-944-120x80x75',
    'Mesa Comedor de Madera y Hierro 120x80cm Smak',
    'Actualiza tu comedor con la Mesa Comedor de Madera y Hierro de la marca Smak. Este mueble combina un diseño moderno, durabilidad y funcionalidad, ideal para optimizar y dar estilo a tus espacios en el hogar.
Características Principales
 • Tablero de roble: Fabricado con un elegante tablero de madera de roble.
 • Estructura de metal: Cuenta con una sólida estructura de metal que garantiza gran estabilidad y resistencia.
 • Patas antideslizantes: Incorpora patas antideslizantes para proteger el piso de tu hogar y brindar mayor seguridad.
 • Fácil de limpiar: Superficies prácticas que facilitan las labores de limpieza diaria.
 • Fácil de armar: Diseñado para un ensamblaje rápido y sin complicaciones.',
    3400.00,
    2990.00,
    20,
    '120 × 80 × 75 cm',
    '150 kg (Madera maciza y hierro estructural)',
    'Negro',
    'Muebles y Organización',
    '["mesa comedor", "madera y hierro", "comedor industrial", "pino", "zgs-944", "944"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_f79ac4221ee04cc2a5a4d744a1cf4c2f~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_544481ebc2d4438387c5ad9a948e15ed~mv2.png", "https://static.wixstatic.com/media/f6ccd1_2c45835317344d99b339fa9e002d28d5~mv2.png", "https://static.wixstatic.com/media/f6ccd1_2c7c5b77acc74a248b77e94808b23077~mv2.png", "https://static.wixstatic.com/media/f6ccd1_5ece2a926d6a49418de719c30bbe1f44~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGS-944-120x80x75',
    'Mesa Comedor de Madera y Hierro 120x80cm Smak',
    'Actualiza tu comedor con la Mesa Comedor de Madera y Hierro de la marca Smak. Este mueble combina un diseño moderno, durabilidad y funcionalidad, ideal para optimizar y dar estilo a tus espacios en el hogar.
Características Principales
 • Tablero de roble: Fabricado con un elegante tablero de madera de roble.
 • Estructura de metal: Cuenta con una sólida estructura de metal que garantiza gran estabilidad y resistencia.
 • Patas antideslizantes: Incorpora patas antideslizantes para proteger el piso de tu hogar y brindar mayor seguridad.
 • Fácil de limpiar: Superficies prácticas que facilitan las labores de limpieza diaria.
 • Fácil de armar: Diseñado para un ensamblaje rápido y sin complicaciones.',
    3400.00,
    2990.00,
    20,
    '120 × 80 × 75 cm',
    '150 kg (Madera maciza y hierro estructural)',
    'Negro',
    'Muebles y Organización',
    '["mesa comedor", "madera y hierro", "comedor industrial", "pino", "zgs-944", "944"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_f79ac4221ee04cc2a5a4d744a1cf4c2f~mv2.webp", "https://static.wixstatic.com/media/f6ccd1_544481ebc2d4438387c5ad9a948e15ed~mv2.png", "https://static.wixstatic.com/media/f6ccd1_2c45835317344d99b339fa9e002d28d5~mv2.png", "https://static.wixstatic.com/media/f6ccd1_2c7c5b77acc74a248b77e94808b23077~mv2.png", "https://static.wixstatic.com/media/f6ccd1_5ece2a926d6a49418de719c30bbe1f44~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-950-NE-MP',
    'Silla Metálica Tolix Smak con Asiento de Madera - Negro Mate',
    'Aporta un toque industrial cálido y sofisticado a tu comedor, cafetería o espacio de trabajo con la silla metálica Smak. Su combinación de acero negro mate con la textura natural de la madera la convierte en una pieza resistente y llena de carácter para cualquier ambiente en Honduras.
Características Principales
 • Diseño Industrial: Estructura metálica en acabado negro mate combinada con un cálido asiento de madera de pino.
 • Materiales de Alta Durabilidad: Chasis metálico de gran firmeza complementado con una tapa de madera tratada para resistir el uso diario.
 • Versatilidad de Espacios: Perfecta para comedores residenciales, restaurantes, cafeterías, barras o áreas de home office.
 • Mantenimiento Sencillo: Superficie fácil de limpiar y conservar en excelentes condiciones.',
    1390.00,
    1190.00,
    60,
    '45 × 45 × 85 cm',
    '150 kg (Acero estampado y madera de pino)',
    'Negro',
    'Sillas y Bancos',
    '["silla tolix madera", "silla comedor", "negro mate", "asiento madera", "skm-950-ne-mp", "950"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_2c26235e7cdc4006b43371b2543014ef~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_bbf7e76140564929bf2a98df85f6968c~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_16602381d2a54912b343c84355aac4ad~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_27c212440c4749c38413baf42e9a43e6~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_61280435440f4a22970ca7fe65c9dcbd~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_ed97d6c2199145e5b6a3f2b930cbbabd~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_20f07e461c064e23826ec618a7b1289d~mv2.jpeg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-950-NE-MP',
    'Silla Metálica Tolix Smak con Asiento de Madera - Negro Mate',
    'Aporta un toque industrial cálido y sofisticado a tu comedor, cafetería o espacio de trabajo con la silla metálica Smak. Su combinación de acero negro mate con la textura natural de la madera la convierte en una pieza resistente y llena de carácter para cualquier ambiente en Honduras.
Características Principales
 • Diseño Industrial: Estructura metálica en acabado negro mate combinada con un cálido asiento de madera de pino.
 • Materiales de Alta Durabilidad: Chasis metálico de gran firmeza complementado con una tapa de madera tratada para resistir el uso diario.
 • Versatilidad de Espacios: Perfecta para comedores residenciales, restaurantes, cafeterías, barras o áreas de home office.
 • Mantenimiento Sencillo: Superficie fácil de limpiar y conservar en excelentes condiciones.',
    1390.00,
    1190.00,
    60,
    '45 × 45 × 85 cm',
    '150 kg (Acero estampado y madera de pino)',
    'Negro',
    'Sillas y Bancos',
    '["silla tolix madera", "silla comedor", "negro mate", "asiento madera", "skm-950-ne-mp", "950"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_2c26235e7cdc4006b43371b2543014ef~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_bbf7e76140564929bf2a98df85f6968c~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_16602381d2a54912b343c84355aac4ad~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_27c212440c4749c38413baf42e9a43e6~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_61280435440f4a22970ca7fe65c9dcbd~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_ed97d6c2199145e5b6a3f2b930cbbabd~mv2.jpeg", "https://static.wixstatic.com/media/f6ccd1_20f07e461c064e23826ec618a7b1289d~mv2.jpeg"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-956-CA-NE',
    'Silla Ergonómica Ejecutiva Wynn con Apoya Pies Smak',
    'Disfruta del máximo confort y rendimiento en tu espacio de trabajo o zona de juego con la Silla Gamer Ejecutiva Wynn con Apoya Pies de la marca Smak Office. Este modelo se encuentra disponible en múltiples colores para combinar a la perfección con tu estilo y decoración.
Características Principales
 • Altura regulable mediante gas: Permite ajustar la altura de la silla de forma sencilla y segura.
 • Malla transpirable y asiento de espuma confortable: Materiales diseñados para ofrecer frescura y comodidad prolongada.
 • Apoyo lumbar: Diseñado ergonómicamente para cuidar tu postura durante largas horas.
 • Inclinación deseada: Permite reclinar el respaldo según el nivel de descanso o concentración que necesites.
 • Apoya brazos y cabeza: Brinda un soporte completo para relajar los brazos, el cuello y la cabeza.
 • Apoya pies integrado: Ofrece un extra de comodidad para tus momentos de descanso.',
    3400.00,
    2950.00,
    60,
    '120 × 52 cm',
    '140 kg (Malla de nylon de alta tenacidad)',
    'Negro, Gris',
    'Sillas y Bancos',
    '["silla ergonomica", "wynn", "apoyapies", "oficina", "malla", "negro", "skm-956-ca-ne", "956"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe66832b37b9b~mv2.png", "https://static.wixstatic.com/media/f6ccd1_636ed51dee0044d7b4bda6507f7879cf~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e943065f17b944b29536d3c553106d7d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_ca3bd7f469334d8fa458797bcdecc96c~mv2.png", "https://static.wixstatic.com/media/f6ccd1_732b7144906f43eba6a96408f6d86528~mv2.png", "https://static.wixstatic.com/media/f6ccd1_3eb6c36619604914aa134b3544bc52dd~mv2.png", "https://static.wixstatic.com/media/f6ccd1_28d1a0d8851f4aae849e4cd0c817dec2~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9ee793a9a4884febbc7fe78f42a37fa9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_c57d07c511274e7d9392b4147ba74891~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-956-CA-NE',
    'Silla Ergonómica Ejecutiva Wynn con Apoya Pies Smak',
    'Disfruta del máximo confort y rendimiento en tu espacio de trabajo o zona de juego con la Silla Gamer Ejecutiva Wynn con Apoya Pies de la marca Smak Office. Este modelo se encuentra disponible en múltiples colores para combinar a la perfección con tu estilo y decoración.
Características Principales
 • Altura regulable mediante gas: Permite ajustar la altura de la silla de forma sencilla y segura.
 • Malla transpirable y asiento de espuma confortable: Materiales diseñados para ofrecer frescura y comodidad prolongada.
 • Apoyo lumbar: Diseñado ergonómicamente para cuidar tu postura durante largas horas.
 • Inclinación deseada: Permite reclinar el respaldo según el nivel de descanso o concentración que necesites.
 • Apoya brazos y cabeza: Brinda un soporte completo para relajar los brazos, el cuello y la cabeza.
 • Apoya pies integrado: Ofrece un extra de comodidad para tus momentos de descanso.',
    3400.00,
    2950.00,
    60,
    '120 × 52 cm',
    '140 kg (Malla de nylon de alta tenacidad)',
    'Negro, Gris',
    'Sillas y Bancos',
    '["silla ergonomica", "wynn", "apoyapies", "oficina", "malla", "negro", "skm-956-ca-ne", "956"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe66832b37b9b~mv2.png", "https://static.wixstatic.com/media/f6ccd1_636ed51dee0044d7b4bda6507f7879cf~mv2.png", "https://static.wixstatic.com/media/f6ccd1_e943065f17b944b29536d3c553106d7d~mv2.png", "https://static.wixstatic.com/media/f6ccd1_ca3bd7f469334d8fa458797bcdecc96c~mv2.png", "https://static.wixstatic.com/media/f6ccd1_732b7144906f43eba6a96408f6d86528~mv2.png", "https://static.wixstatic.com/media/f6ccd1_3eb6c36619604914aa134b3544bc52dd~mv2.png", "https://static.wixstatic.com/media/f6ccd1_28d1a0d8851f4aae849e4cd0c817dec2~mv2.png", "https://static.wixstatic.com/media/f6ccd1_9ee793a9a4884febbc7fe78f42a37fa9~mv2.png", "https://static.wixstatic.com/media/f6ccd1_c57d07c511274e7d9392b4147ba74891~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-956-CA-GR',
    'Silla Ergonómica Ejecutiva Wynn con Apoya Pies Smak - Gris',
    '',
    3400.00,
    2950.00,
    30,
    '120 × 52 cm',
    '140 kg (Malla de nylon y pistón reforzado)',
    'Gris',
    'Sillas y Bancos',
    '["silla ergonomica", "wynn", "apoyapies", "gris", "oficina", "skm-956-ca-gr"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-956-CA-GR',
    'Silla Ergonómica Ejecutiva Wynn con Apoya Pies Smak - Gris',
    '',
    3400.00,
    2950.00,
    30,
    '120 × 52 cm',
    '140 kg (Malla de nylon y pistón reforzado)',
    'Gris',
    'Sillas y Bancos',
    '["silla ergonomica", "wynn", "apoyapies", "gris", "oficina", "skm-956-ca-gr"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGS-943-120x60x75',
    'Escritorio de Madera y Hierro 120x60cm Smak',
    'Optimiza tu espacio de trabajo o estudio con el Escritorio de Madera y Hierro de la marca Smak. Este mueble combina un diseño moderno y funcional, perfecto para cualquier ambiente en el hogar u oficina.
Características Principales
 • Fácil de armar: Diseñado para un ensamblaje rápido y sencillo.
 • Fácil de limpiar: Superficies prácticas que facilitan el mantenimiento diario.
 • Tablero de roble: Superficie resistente y con un acabado elegante en madera de roble.
 • Estructura de metal: Soporte robusto que garantiza mayor estabilidad y durabilidad.
 • Patas antideslizantes: Protegen el suelo de tu hogar y evitan deslizamientos indeseados.',
    2600.00,
    2250.00,
    35,
    '120 × 60 × 75 cm',
    '120 kg (Estructura de acero al carbono y madera)',
    'Negro',
    'Muebles y Organización',
    '["escritorio", "mesa de trabajo", "home office", "madera", "hierro", "zgs-943", "943"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_4c4a8d50efa54afaabbd8e9cdab674f4~mv2.png", "https://static.wixstatic.com/media/f6ccd1_ee0596e95e8c4953b9a9a261b4b1f424~mv2.png", "https://static.wixstatic.com/media/f6ccd1_ad09a9e8bfc24e1bab5da4027c5caa1a~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f4a63b71dccf45aea7a301c47000690e~mv2.png", "https://static.wixstatic.com/media/f6ccd1_5f2e0f2f73ee495791e3804b4eab131d~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGS-943-120x60x75',
    'Escritorio de Madera y Hierro 120x60cm Smak',
    'Optimiza tu espacio de trabajo o estudio con el Escritorio de Madera y Hierro de la marca Smak. Este mueble combina un diseño moderno y funcional, perfecto para cualquier ambiente en el hogar u oficina.
Características Principales
 • Fácil de armar: Diseñado para un ensamblaje rápido y sencillo.
 • Fácil de limpiar: Superficies prácticas que facilitan el mantenimiento diario.
 • Tablero de roble: Superficie resistente y con un acabado elegante en madera de roble.
 • Estructura de metal: Soporte robusto que garantiza mayor estabilidad y durabilidad.
 • Patas antideslizantes: Protegen el suelo de tu hogar y evitan deslizamientos indeseados.',
    2600.00,
    2250.00,
    35,
    '120 × 60 × 75 cm',
    '120 kg (Estructura de acero al carbono y madera)',
    'Negro',
    'Muebles y Organización',
    '["escritorio", "mesa de trabajo", "home office", "madera", "hierro", "zgs-943", "943"]'::jsonb,
    '["https://static.wixstatic.com/media/f6ccd1_4c4a8d50efa54afaabbd8e9cdab674f4~mv2.png", "https://static.wixstatic.com/media/f6ccd1_ee0596e95e8c4953b9a9a261b4b1f424~mv2.png", "https://static.wixstatic.com/media/f6ccd1_ad09a9e8bfc24e1bab5da4027c5caa1a~mv2.png", "https://static.wixstatic.com/media/f6ccd1_f4a63b71dccf45aea7a301c47000690e~mv2.png", "https://static.wixstatic.com/media/f6ccd1_5f2e0f2f73ee495791e3804b4eab131d~mv2.png"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-951-NE',
    'SKM-951-NE',
    '',
    990.00,
    850.00,
    29,
    '39 × 76 cm',
    '150 kg (100% acero estampado)',
    'Negro',
    'Sillas y Bancos',
    '["taburete", "tolix", "banco simple", "metalico", "negro", "skm-951-ne", "951"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-951-NE',
    'SKM-951-NE',
    '',
    990.00,
    850.00,
    29,
    '39 × 76 cm',
    '150 kg (100% acero estampado)',
    'Negro',
    'Sillas y Bancos',
    '["taburete", "tolix", "banco simple", "metalico", "negro", "skm-951-ne", "951"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'SKM-952-NE-MP',
    'SKM-952-NE-MP',
    '',
    1100.00,
    950.00,
    35,
    '45 × 45 × 76 cm',
    '150 kg (Acero prensado y tapa de pino)',
    'Negro',
    'Sillas y Bancos',
    '["taburete alto", "tolix pino", "banco madera", "barra", "skm-952-ne-mp", "952"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'SKM-952-NE-MP',
    'SKM-952-NE-MP',
    '',
    1100.00,
    950.00,
    35,
    '45 × 45 × 76 cm',
    '150 kg (Acero prensado y tapa de pino)',
    'Negro',
    'Sillas y Bancos',
    '["taburete alto", "tolix pino", "banco madera", "barra", "skm-952-ne-mp", "952"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'smak',
    'ZGS-534-RS',
    'ZGS-534-RS',
    '',
    2200.00,
    1890.00,
    10,
    '102 × 70/78 cm',
    '35 kg (Estructura de acero reforzado)',
    'Negro',
    'Salud y Cuidado',
    '["bici", "bicicleta", "rosa", "rin 14", "ninas", "infantil", "zgs-534", "534"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (
    tenant_id, sku, name, description, regular_price, sale_price, stock, dimensions, weight_limit, colors, category, keywords, images, is_active
) VALUES (
    'tenant-hn-muebles',
    'ZGS-534-RS',
    'ZGS-534-RS',
    '',
    2200.00,
    1890.00,
    10,
    '102 × 70/78 cm',
    '35 kg (Estructura de acero reforzado)',
    'Negro',
    'Salud y Cuidado',
    '["bici", "bicicleta", "rosa", "rin 14", "ninas", "infantil", "zgs-534", "534"]'::jsonb,
    '["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    TRUE
) ON CONFLICT (tenant_id, sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    dimensions = EXCLUDED.dimensions,
    weight_limit = EXCLUDED.weight_limit,
    colors = EXCLUDED.colors,
    category = EXCLUDED.category,
    keywords = EXCLUDED.keywords,
    images = EXCLUDED.images,
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP;
