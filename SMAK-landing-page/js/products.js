/**
 * ====================================================================
 * SMAK HONDURAS - CATÁLOGO DE PRODUCTOS & CONFIGURACIÓN
 * ====================================================================
 * 
 * Este archivo centraliza la configuración general y el catálogo de
 * productos de SMAK Honduras.
 * ====================================================================
 */

const SMAK_CONFIG = {
  "storeName": "SMAK Honduras",
  "slogan": "Creamos los espacios donde vives, trabajas y disfrutas",
  "whatsappNumber": "50498008559",
  "whatsappDisplay": "+504 9800-8559",
  "email": "smakhonduras@gmail.com",
  "schedule": "Lunes a Viernes: 9:00 am - 7:00 pm",
  "shippingNotice": "Envío gratis a toda Honduras vía Cargo Expreso",
  "address": "Plaza Krisale, Puerto Cortés, Honduras",
  "instagramUrl": "https://www.instagram.com/",
  "facebookUrl": "https://www.facebook.com/",
  "generalMessage": "¡Hola SMAK Honduras! Deseo consultar el catálogo y disponibilidad de productos."
};

const SMAK_CATEGORIES = [
  {
    "id": "all",
    "name": "Todos los Productos",
    "icon": "grid"
  },
  {
    "id": "Sillas y Bancos",
    "name": "Sillas y Bancos",
    "displayName": "SILLAS",
    "subtitle": "Línea Tolix, Ejecutivas y Bancos",
    "image": "https://static.wixstatic.com/media/f6ccd1_585455612c3744408a737c745f312c3c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
  },
  {
    "id": "Muebles y Organización",
    "name": "Muebles y Organización",
    "displayName": "MUEBLES",
    "subtitle": "Mesas Mármol, Escritorios y Percheros",
    "image": "https://static.wixstatic.com/media/f6ccd1_2c34eb84c77e430dbc3e36343249ddcd~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
  },
  {
    "id": "Cocina y Baño",
    "name": "Cocina y Baño",
    "displayName": "COCINA Y BAÑO",
    "subtitle": "Columnas de Ducha en Acero Inoxidable",
    "image": "https://static.wixstatic.com/media/f6ccd1_cede824b013d41a0bfcbd7b870bf6211~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
  },
  {
    "id": "Escaleras",
    "name": "Escaleras",
    "displayName": "ESCALERAS",
    "subtitle": "Aluminio Multipropósito de Alta Resistencia",
    "image": "https://static.wixstatic.com/media/f6ccd1_298a5327119e41eca093ab5b636ff305~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
  },
  {
    "id": "Salud y Cuidado",
    "name": "Salud y Cuidado",
    "displayName": "SALUD Y MOVILIDAD",
    "subtitle": "Sillas de Ruedas Plegables y Confort",
    "image": "https://static.wixstatic.com/media/f6ccd1_25b1c5d058b548d0aa0a256ded90d9b9~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
  }
];

const SMAK_PRODUCTS = [
  {
    "id": "prod-1",
    "sku": "SKM-955-CA-NE",
    "name": "Silla Gamer Rom CA Negro/Negro",
    "category": "Sillas y Bancos",
    "badge": "MÁS VENDIDO",
    "price": 3190,
    "regularPrice": 3600,
    "inStock": true,
    "stock": 232,
    "image": "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd42217c9dd8~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd42217c9dd8~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Silla Gamer Rom CA Negro/Negro (SKU: SKM-955-CA-NE). Acabado en Rosa con Blanco y Negra. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 130 × 52 cm",
      "Capacidad / soporte: 160 kg (Estructura de acero tubular reforzado)",
      "Color / acabado: Rosa con Blanco y Negra",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "130 × 52 cm",
    "weightLimit": "160 kg (Estructura de acero tubular reforzado)",
    "colors": "Rosa con Blanco y Negra"
  },
  {
    "id": "prod-2",
    "sku": "SKM-959-CA-NE",
    "name": "Sillón Ejecutivo Miles Negro con Apoyapiés",
    "category": "Sillas y Bancos",
    "badge": "MÁS VENDIDO",
    "price": 3390,
    "regularPrice": 3800,
    "inStock": true,
    "stock": 179,
    "image": "https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f87aa9ec241~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f87aa9ec241~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Sillón Ejecutivo Miles Negro con Apoyapiés (SKU: SKM-959-CA-NE). Acabado en Negro y Café. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 110 × 55 cm",
      "Capacidad / soporte: 160 kg (Pistón clase 4 y base de acero cromado)",
      "Color / acabado: Negro y Café",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "110 × 55 cm",
    "weightLimit": "160 kg (Pistón clase 4 y base de acero cromado)",
    "colors": "Negro y Café"
  },
  {
    "id": "prod-3",
    "sku": "SKM-959-CA-MA",
    "name": "Sillón Ejecutivo Miles Marrón con Apoyapiés",
    "category": "Sillas y Bancos",
    "badge": "OFERTA",
    "price": 3390,
    "regularPrice": 3800,
    "inStock": true,
    "stock": 39,
    "image": "https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f87aa9ec241~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f87aa9ec241~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Sillón Ejecutivo Miles Marrón con Apoyapiés (SKU: SKM-959-CA-MA). Acabado en Negro y Café. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 110 × 55 cm",
      "Capacidad / soporte: 160 kg (Pistón clase 4 y base cromada)",
      "Color / acabado: Negro y Café",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "110 × 55 cm",
    "weightLimit": "160 kg (Pistón clase 4 y base cromada)",
    "colors": "Negro y Café"
  },
  {
    "id": "prod-4",
    "sku": "SKM-956-CA-NE",
    "name": "Silla Ergonómica Wynn con Apoyapiés Negro",
    "category": "Sillas y Bancos",
    "badge": "OFERTA",
    "price": 2950,
    "regularPrice": 3400,
    "inStock": true,
    "stock": 76,
    "image": "https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe6643274ee8c~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe6643274ee8c~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Silla Ergonómica Wynn con Apoyapiés Negro (SKU: SKM-956-CA-NE). Acabado en Negro y Gris. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 120 × 52 cm",
      "Capacidad / soporte: 140 kg (Malla de nylon de alta tenacidad)",
      "Color / acabado: Negro y Gris",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "120 × 52 cm",
    "weightLimit": "140 kg (Malla de nylon de alta tenacidad)",
    "colors": "Negro y Gris"
  },
  {
    "id": "prod-5",
    "sku": "SKM-956-CA-GR",
    "name": "Silla Ergonómica Wynn con Apoyapiés Gris",
    "category": "Sillas y Bancos",
    "badge": "OFERTA",
    "price": 2950,
    "regularPrice": 3400,
    "inStock": true,
    "stock": 38,
    "image": "https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe6643274ee8c~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe6643274ee8c~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Silla Ergonómica Wynn con Apoyapiés Gris (SKU: SKM-956-CA-GR). Acabado en Negro y Gris. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 120 × 52 cm",
      "Capacidad / soporte: 140 kg (Malla de nylon y pistón reforzado)",
      "Color / acabado: Negro y Gris",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "120 × 52 cm",
    "weightLimit": "140 kg (Malla de nylon y pistón reforzado)",
    "colors": "Negro y Gris"
  },
  {
    "id": "prod-6",
    "sku": "SKM-935-NE",
    "name": "Silla de Despacho Ezri Negra",
    "category": "Sillas y Bancos",
    "badge": "MÁS VENDIDO",
    "price": 1790,
    "regularPrice": 2100,
    "inStock": true,
    "stock": 133,
    "image": "https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852ebfa40a7a~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852ebfa40a7a~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Silla de Despacho Ezri Negra (SKU: SKM-935-NE). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 47 × 92 cm",
      "Capacidad / soporte: 120 kg (Uso de oficina y escritorio)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "47 × 92 cm",
    "weightLimit": "120 kg (Uso de oficina y escritorio)",
    "colors": "Negro"
  },
  {
    "id": "prod-7",
    "sku": "SKM-953-NE-MP",
    "name": "Taburete Tolix Negro con Respaldo y Asiento de Madera",
    "category": "Sillas y Bancos",
    "badge": "MÁS VENDIDO",
    "price": 1250,
    "regularPrice": 1450,
    "inStock": true,
    "stock": 296,
    "image": "https://static.wixstatic.com/media/f6ccd1_585455612c3744408a737c745f312c3c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_585455612c3744408a737c745f312c3c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
    ],
    "description": "Taburete Tolix Negro con Respaldo y Asiento de Madera (SKU: SKM-953-NE-MP). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 45 × 45 × 100 cm",
      "Capacidad / soporte: 150 kg (Madera maciza y acero al carbono)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "45 × 45 × 100 cm",
    "weightLimit": "150 kg (Madera maciza y acero al carbono)",
    "colors": "Negro"
  },
  {
    "id": "prod-8",
    "sku": "SKM-952-NE-MP",
    "name": "Taburete Alto Tolix Negro Pino (Sin Respaldo)",
    "category": "Sillas y Bancos",
    "badge": "MÁS VENDIDO",
    "price": 950,
    "regularPrice": 1100,
    "inStock": true,
    "stock": 173,
    "image": "https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
    ],
    "description": "Taburete Alto Tolix Negro Pino (Sin Respaldo) (SKU: SKM-952-NE-MP). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 45 × 45 × 76 cm",
      "Capacidad / soporte: 150 kg (Estructura de acero prensado con cruz inferior)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "45 × 45 × 76 cm",
    "weightLimit": "150 kg (Estructura de acero prensado con cruz inferior)",
    "colors": "Negro"
  },
  {
    "id": "prod-9",
    "sku": "SKM-951-NE",
    "name": "Taburete Tolix Negro Simple (Metálico)",
    "category": "Sillas y Bancos",
    "badge": "OFERTA",
    "price": 850,
    "regularPrice": 990,
    "inStock": true,
    "stock": 29,
    "image": "https://static.wixstatic.com/media/f6ccd1_0fe037c544c64b67b703a05bbd9b93ce~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_0fe037c544c64b67b703a05bbd9b93ce~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Taburete Tolix Negro Simple (Metálico) (SKU: SKM-951-NE). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 39 × 76 cm",
      "Capacidad / soporte: 150 kg (100% acero estampado)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "39 × 76 cm",
    "weightLimit": "150 kg (100% acero estampado)",
    "colors": "Negro"
  },
  {
    "id": "prod-10",
    "sku": "SKM-972-NE",
    "name": "Taburete Tolix Negro con Respaldo",
    "category": "Sillas y Bancos",
    "badge": "OFERTA",
    "price": 1090,
    "regularPrice": 1300,
    "inStock": true,
    "stock": 20,
    "image": "https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Taburete Tolix Negro con Respaldo (SKU: SKM-972-NE). Acabado en Negro y Gris. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 45 × 45 × 100 cm",
      "Capacidad / soporte: 150 kg por banco (Acero prensado)",
      "Color / acabado: Negro y Gris",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "45 × 45 × 100 cm",
    "weightLimit": "150 kg por banco (Acero prensado)",
    "colors": "Negro y Gris"
  },
  {
    "id": "prod-11",
    "sku": "SKM-972-GR",
    "name": "Taburete Tolix Gris con Respaldo",
    "category": "Sillas y Bancos",
    "badge": "OFERTA",
    "price": 1090,
    "regularPrice": 1300,
    "inStock": true,
    "stock": 2,
    "image": "https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Taburete Tolix Gris con Respaldo (SKU: SKM-972-GR). Acabado en Negro y Gris. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 45 × 45 × 100 cm",
      "Capacidad / soporte: 150 kg por banco (Acero prensado)",
      "Color / acabado: Negro y Gris",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "45 × 45 × 100 cm",
    "weightLimit": "150 kg por banco (Acero prensado)",
    "colors": "Negro y Gris"
  },
  {
    "id": "prod-12",
    "sku": "ZGS-926-NE",
    "name": "Taburete Elam Negro",
    "category": "Sillas y Bancos",
    "badge": "OFERTA",
    "price": 1190,
    "regularPrice": 1400,
    "inStock": true,
    "stock": 11,
    "image": "https://static.wixstatic.com/media/f6ccd1_53b24274ff094c6c8351fee0e5a97ca3~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_53b24274ff094c6c8351fee0e5a97ca3~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Taburete Elam Negro (SKU: ZGS-926-NE). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 32 × 47/61 cm",
      "Capacidad / soporte: 120 kg (Pistón a gas reforzado)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "32 × 47/61 cm",
    "weightLimit": "120 kg (Pistón a gas reforzado)",
    "colors": "Negro"
  },
  {
    "id": "prod-13",
    "sku": "ZGS-101-NE",
    "name": "Taburete Kira Negro con Respaldo",
    "category": "Sillas y Bancos",
    "badge": "OFERTA",
    "price": 1290,
    "regularPrice": 1500,
    "inStock": true,
    "stock": 21,
    "image": "https://static.wixstatic.com/media/f6ccd1_17b38c26f362413ea77815f7efe4ff39~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_17b38c26f362413ea77815f7efe4ff39~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Taburete Kira Negro con Respaldo (SKU: ZGS-101-NE). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 38 × 40 × 63/83 cm",
      "Capacidad / soporte: 130 kg (Pistón hidráulico de uso pesado)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "38 × 40 × 63/83 cm",
    "weightLimit": "130 kg (Pistón hidráulico de uso pesado)",
    "colors": "Negro"
  },
  {
    "id": "prod-14",
    "sku": "ZGS-946-120x30x180",
    "name": "Estantería de Metal y Madera 120×30×180cm",
    "category": "Muebles y Organización",
    "badge": "OFERTA",
    "price": 2850,
    "regularPrice": 3200,
    "inStock": true,
    "stock": 49,
    "image": "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85",
    "gallery": [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85"
    ],
    "description": "Estantería de Metal y Madera 120×30×180cm (SKU: ZGS-946-120x30x180). Acabado en Metálico con madera. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 120 × 30 × 180 cm",
      "Capacidad / soporte: 80 kg por nivel (Uso comercial y residencial)",
      "Color / acabado: Metálico con madera",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "120 × 30 × 180 cm",
    "weightLimit": "80 kg por nivel (Uso comercial y residencial)",
    "colors": "Metálico con madera"
  },
  {
    "id": "prod-15",
    "sku": "ZGS-944-120x80x75",
    "name": "Mesa de Comedor de Madera y Hierro 120×80×75cm",
    "category": "Muebles y Organización",
    "badge": "OFERTA",
    "price": 2990,
    "regularPrice": 3400,
    "inStock": true,
    "stock": 35,
    "image": "https://static.wixstatic.com/media/f6ccd1_f79ac4221ee04cc2a5a4d743a3dca3d6~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_f79ac4221ee04cc2a5a4d743a3dca3d6~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Mesa de Comedor de Madera y Hierro 120×80×75cm (SKU: ZGS-944-120x80x75). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 120 × 80 × 75 cm",
      "Capacidad / soporte: 150 kg (Madera maciza y hierro estructural)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "120 × 80 × 75 cm",
    "weightLimit": "150 kg (Madera maciza y hierro estructural)",
    "colors": "Negro"
  },
  {
    "id": "prod-16",
    "sku": "ZGS-943-120x60x75",
    "name": "Escritorio de Madera y Hierro 120×60×75cm",
    "category": "Muebles y Organización",
    "badge": "OFERTA",
    "price": 2250,
    "regularPrice": 2600,
    "inStock": true,
    "stock": 68,
    "image": "https://static.wixstatic.com/media/f6ccd1_4c4a8d50efa54afaabbd8e9227f6ba6f~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_4c4a8d50efa54afaabbd8e9227f6ba6f~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Escritorio de Madera y Hierro 120×60×75cm (SKU: ZGS-943-120x60x75). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 120 × 60 × 75 cm",
      "Capacidad / soporte: 120 kg (Estructura de acero al carbono y madera)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "120 × 60 × 75 cm",
    "weightLimit": "120 kg (Estructura de acero al carbono y madera)",
    "colors": "Negro"
  },
  {
    "id": "prod-17",
    "sku": "ZGM-032-NENE",
    "name": "Juego 2 Mesas Redondas Auxiliares Mármol Negro Doncaster",
    "category": "Muebles y Organización",
    "badge": "OFERTA",
    "price": 2450,
    "regularPrice": 2800,
    "inStock": true,
    "stock": 38,
    "image": "https://static.wixstatic.com/media/f6ccd1_e91d7101f4414098b49c596b6b80153f~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e91d7101f4414098b49c596b6b80153f~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Juego 2 Mesas Redondas Auxiliares Mármol Negro Doncaster (SKU: ZGM-032-NENE). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 45×70 y 50×38 cm",
      "Capacidad / soporte: 50 kg por mesa (Acero y cubierta símil mármol templado)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "45×70 y 50×38 cm",
    "weightLimit": "50 kg por mesa (Acero y cubierta símil mármol templado)",
    "colors": "Negro"
  },
  {
    "id": "prod-18",
    "sku": "ZGM-017-NE",
    "name": "Sofá Silla Reclinable 1 Cuerpo Giratorio 360° Nobby Negra",
    "category": "Sillas y Bancos",
    "badge": "OFERTA",
    "price": 3890,
    "regularPrice": 4500,
    "inStock": true,
    "stock": 4,
    "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "Sofá Silla Reclinable 1 Cuerpo Giratorio 360° Nobby Negra (SKU: ZGM-017-NE). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 57 × 60 × 87 cm",
      "Capacidad / soporte: 160 kg (Estructura interna de acero y reclinable)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "57 × 60 × 87 cm",
    "weightLimit": "160 kg (Estructura interna de acero y reclinable)",
    "colors": "Negro"
  },
  {
    "id": "prod-19",
    "sku": "ZGF-503",
    "name": "Silla de Ruedas Plegable Smak",
    "category": "Salud y Cuidado",
    "badge": "OFERTA",
    "price": 2790,
    "regularPrice": 3200,
    "inStock": true,
    "stock": 71,
    "image": "https://static.wixstatic.com/media/f6ccd1_25b1c5d058b548d0aa0a2569527ec651~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_25b1c5d058b548d0aa0a2569527ec651~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Silla de Ruedas Plegable Smak (SKU: ZGF-503). Acabado en Negro con plateado. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 88 × 99 × 67 cm",
      "Capacidad / soporte: 120 kg (Estructura de acero cromado y lona impermeable)",
      "Color / acabado: Negro con plateado",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "88 × 99 × 67 cm",
    "weightLimit": "120 kg (Estructura de acero cromado y lona impermeable)",
    "colors": "Negro con plateado"
  },
  {
    "id": "prod-20",
    "sku": "ZGB-210-NE",
    "name": "Hamaca Jardín con Techo y Almohadas Negro",
    "category": "Muebles y Organización",
    "badge": "OFERTA",
    "price": 3650,
    "regularPrice": 4200,
    "inStock": true,
    "stock": 6,
    "image": "https://images.unsplash.com/photo-1587588354456-ae376af71a25?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1587588354456-ae376af71a25?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "Hamaca Jardín con Techo y Almohadas Negro (SKU: ZGB-210-NE). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 59 × 61 × 46 cm",
      "Capacidad / soporte: 200 kg (Para 2-3 personas)",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "59 × 61 × 46 cm",
    "weightLimit": "200 kg (Para 2-3 personas)",
    "colors": "Negro"
  },
  {
    "id": "prod-21",
    "sku": "ZGB-148-NM",
    "name": "Pileta de Cocina Multifuncional Negro Mate Savadir",
    "category": "Cocina y Baño",
    "badge": "OFERTA",
    "price": 3990,
    "regularPrice": 4600,
    "inStock": true,
    "stock": 52,
    "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "Pileta de Cocina Multifuncional Negro Mate Savadir (SKU: ZGB-148-NM). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 75 × 45 cm",
      "Capacidad / soporte: Acero inoxidable 304 nano-recubierto anti-grasa",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "75 × 45 cm",
    "weightLimit": "Acero inoxidable 304 nano-recubierto anti-grasa",
    "colors": "Negro"
  },
  {
    "id": "prod-22",
    "sku": "ZGB-146-NM",
    "name": "Monocomando con Salida Flexible Negro Mate Todd",
    "category": "Cocina y Baño",
    "badge": "OFERTA",
    "price": 1090,
    "regularPrice": 1350,
    "inStock": true,
    "stock": 12,
    "image": "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "Monocomando con Salida Flexible Negro Mate Todd (SKU: ZGB-146-NM). Acabado en Negro. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 40 × 25.4 cm",
      "Capacidad / soporte: Latón macizo con manguera de silicona grado alimenticio",
      "Color / acabado: Negro",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "40 × 25.4 cm",
    "weightLimit": "Latón macizo con manguera de silicona grado alimenticio",
    "colors": "Negro"
  },
  {
    "id": "prod-23",
    "sku": "ZGB-146-INOX",
    "name": "Monocomando con Salida Flexible Inox Todd",
    "category": "Cocina y Baño",
    "badge": "OFERTA",
    "price": 1090,
    "regularPrice": 1350,
    "inStock": true,
    "stock": 15,
    "image": "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "Monocomando con Salida Flexible Inox Todd (SKU: ZGB-146-INOX). Acabado en Metálico. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 40 × 25.4 cm",
      "Capacidad / soporte: Acero inoxidable SUS 304 cepillado",
      "Color / acabado: Metálico",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "40 × 25.4 cm",
    "weightLimit": "Acero inoxidable SUS 304 cepillado",
    "colors": "Metálico"
  },
  {
    "id": "prod-24",
    "sku": "ZGS-707",
    "name": "Escalera Tipo Andamio Multipropósito 16 Escalones + Plancha",
    "category": "Escaleras",
    "badge": "OFERTA",
    "price": 3350,
    "regularPrice": 3800,
    "inStock": true,
    "stock": 12,
    "image": "https://static.wixstatic.com/media/f6ccd1_298a5327119e41eca093ab5b636ff305~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_298a5327119e41eca093ab5b636ff305~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Escalera Tipo Andamio Multipropósito 16 Escalones + Plancha (SKU: ZGS-707). Acabado en Metálico. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 34 × 120/440 cm",
      "Capacidad / soporte: 150 kg (Aluminio de aviación 6063)",
      "Color / acabado: Metálico",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "34 × 120/440 cm",
    "weightLimit": "150 kg (Aluminio de aviación 6063)",
    "colors": "Metálico"
  },
  {
    "id": "prod-25",
    "sku": "ZGS-622",
    "name": "Carro de Carga Plegable 90 KG",
    "category": "Muebles y Organización",
    "badge": "OFERTA",
    "price": 990,
    "regularPrice": 1200,
    "inStock": true,
    "stock": 28,
    "image": "https://static.wixstatic.com/media/f6ccd1_f34e9dcc099b420b9d8bc1788775f0a0~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_f34e9dcc099b420b9d8bc1788775f0a0~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Carro de Carga Plegable 90 KG (SKU: ZGS-622). Acabado en Metálico. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 30 × 24 × 71/107 cm",
      "Capacidad / soporte: 90 kg (200 lbs)",
      "Color / acabado: Metálico",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "30 × 24 × 71/107 cm",
    "weightLimit": "90 kg (200 lbs)",
    "colors": "Metálico"
  },
  {
    "id": "prod-26",
    "sku": "ZGS-534-RS",
    "name": "Bicicleta Infantil Rosa Rin 14",
    "category": "Salud y Cuidado",
    "badge": "OFERTA",
    "price": 1890,
    "regularPrice": 2200,
    "inStock": true,
    "stock": 2,
    "image": "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80"
    ],
    "description": "Bicicleta Infantil Rosa Rin 14 (SKU: ZGS-534-RS). Acabado en Rosa. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 102 × 70/78 cm",
      "Capacidad / soporte: 35 kg (Estructura de acero reforzado)",
      "Color / acabado: Rosa",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "102 × 70/78 cm",
    "weightLimit": "35 kg (Estructura de acero reforzado)",
    "colors": "Rosa"
  },
  {
    "id": "prod-27",
    "sku": "SKM-955-CA-NE-BL",
    "name": "Silla Gamer Rom CA Negro/Blanco",
    "category": "Sillas y Bancos",
    "badge": "AGOTADO",
    "price": 3190,
    "regularPrice": 3600,
    "inStock": false,
    "stock": 0,
    "image": "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd42217c9dd8~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd42217c9dd8~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Silla Gamer Rom CA Negro/Blanco (SKU: SKM-955-CA-NE-BL). Acabado en Negro con Blanco. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 130 × 52 cm",
      "Capacidad / soporte: 160 kg",
      "Color / acabado: Negro con Blanco",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "130 × 52 cm",
    "weightLimit": "160 kg",
    "colors": "Negro con Blanco"
  },
  {
    "id": "prod-28",
    "sku": "SKM-955-CA-NE-RO",
    "name": "Silla Gamer Rom CA Negro/Rojo",
    "category": "Sillas y Bancos",
    "badge": "AGOTADO",
    "price": 3190,
    "regularPrice": 3600,
    "inStock": false,
    "stock": 0,
    "image": "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd42217c9dd8~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd42217c9dd8~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Silla Gamer Rom CA Negro/Rojo (SKU: SKM-955-CA-NE-RO). Acabado en Negro con Rojo. Ideal para entrega inmediata con Cargo Expreso.",
    "features": [
      "Medidas oficiales: 130 × 52 cm",
      "Capacidad / soporte: 160 kg",
      "Color / acabado: Negro con Rojo",
      "100% nuevo de fábrica con garantía contra defectos de fabricación"
    ],
    "dimensions": "130 × 52 cm",
    "weightLimit": "160 kg",
    "colors": "Negro con Rojo"
  }
];

// Helper para obtener dimensiones seguras
function getProductDimensions(p) {
  if (!p) return "Dimensiones estándar";
  return p.dimensions || "Dimensiones estándar según ficha técnica";
}

// Exportación para navegadores y entornos CommonJS (Node.js)
if (typeof window !== "undefined") {
  window.SMAK_CONFIG = SMAK_CONFIG;
  window.SMAK_CATEGORIES = SMAK_CATEGORIES;
  window.SMAK_PRODUCTS = SMAK_PRODUCTS;
  window.getProductDimensions = getProductDimensions;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SMAK_CONFIG, SMAK_CATEGORIES, SMAK_PRODUCTS, getProductDimensions };
}
