export const STORAGE_KEY = "smakbot-demo-v4";

export const TENANTS = [
  {
    id: "smak",
    name: "SMAK Muebles",
    category: "Muebles y hogar",
    initials: "S",
    accent: "#0e7a62",
    products: [
        {
                "id": "prod-1",
                "sku": "SKM-955-CA-NE",
                "name": "Silla Gamer Rom CA Negro/Negro",
                "regularPrice": 3600,
                "salePrice": 3190,
                "stock": 232,
                "dimensions": "130 × 52 cm",
                "weightLimit": "160 kg (Estructura de acero tubular reforzado)",
                "colors": "Rosa con Blanco y Negra",
                "category": "Sillas y Bancos",
                "keywords": [
                        "silla gamer",
                        "gamer",
                        "rom",
                        "reclinable",
                        "videojuegos",
                        "negro",
                        "skm-955-ca-ne",
                        "955"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd42217c9dd8~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-2",
                "sku": "SKM-959-CA-NE",
                "name": "Sillón Ejecutivo Miles Negro con Apoyapiés",
                "regularPrice": 3800,
                "salePrice": 3390,
                "stock": 179,
                "dimensions": "110 × 55 cm",
                "weightLimit": "160 kg (Pistón clase 4 y base de acero cromado)",
                "colors": "Negro y Café",
                "category": "Sillas y Bancos",
                "keywords": [
                        "silla ejecutiva",
                        "sillon",
                        "miles",
                        "apoyapies",
                        "reclinable",
                        "oficina",
                        "negro",
                        "skm-959-ca-ne",
                        "959"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f87aa9ec241~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-3",
                "sku": "SKM-959-CA-MA",
                "name": "Sillón Ejecutivo Miles Marrón con Apoyapiés",
                "regularPrice": 3800,
                "salePrice": 3390,
                "stock": 39,
                "dimensions": "110 × 55 cm",
                "weightLimit": "160 kg (Pistón clase 4 y base cromada)",
                "colors": "Negro y Café",
                "category": "Sillas y Bancos",
                "keywords": [
                        "silla ejecutiva",
                        "sillon",
                        "miles",
                        "marron",
                        "cafe",
                        "apoyapies",
                        "skm-959-ca-ma"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f87aa9ec241~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-4",
                "sku": "SKM-956-CA-NE",
                "name": "Silla Ergonómica Wynn con Apoyapiés Negro",
                "regularPrice": 3400,
                "salePrice": 2950,
                "stock": 76,
                "dimensions": "120 × 52 cm",
                "weightLimit": "140 kg (Malla de nylon de alta tenacidad)",
                "colors": "Negro y Gris",
                "category": "Sillas y Bancos",
                "keywords": [
                        "silla ergonomica",
                        "wynn",
                        "apoyapies",
                        "oficina",
                        "malla",
                        "negro",
                        "skm-956-ca-ne",
                        "956"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe6643274ee8c~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-5",
                "sku": "SKM-956-CA-GR",
                "name": "Silla Ergonómica Wynn con Apoyapiés Gris",
                "regularPrice": 3400,
                "salePrice": 2950,
                "stock": 38,
                "dimensions": "120 × 52 cm",
                "weightLimit": "140 kg (Malla de nylon y pistón reforzado)",
                "colors": "Negro y Gris",
                "category": "Sillas y Bancos",
                "keywords": [
                        "silla ergonomica",
                        "wynn",
                        "apoyapies",
                        "gris",
                        "oficina",
                        "skm-956-ca-gr"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe6643274ee8c~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-6",
                "sku": "SKM-935-NE",
                "name": "Silla de Despacho Ezri Negra",
                "regularPrice": 2100,
                "salePrice": 1790,
                "stock": 133,
                "dimensions": "47 × 92 cm",
                "weightLimit": "120 kg (Uso de oficina y escritorio)",
                "colors": "Negro",
                "category": "Sillas y Bancos",
                "keywords": [
                        "silla",
                        "despacho",
                        "ezri",
                        "oficina",
                        "escritorio",
                        "giratoria",
                        "negro",
                        "skm-935-ne",
                        "935"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852ebfa40a7a~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
                ]
        },
        {
                "id": "prod-7",
                "sku": "SKM-953-NE-MP",
                "name": "Taburete Tolix Negro con Respaldo y Asiento de Madera",
                "regularPrice": 1450,
                "salePrice": 1250,
                "stock": 296,
                "dimensions": "45 × 45 × 100 cm",
                "weightLimit": "150 kg (Madera maciza y acero al carbono)",
                "colors": "Negro",
                "category": "Sillas y Bancos",
                "keywords": [
                        "taburete",
                        "tolix",
                        "banco",
                        "respaldo madera",
                        "asiento madera",
                        "pino",
                        "skm-953-ne-mp",
                        "953"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_585455612c3744408a737c745f312c3c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
                ]
        },
        {
                "id": "prod-8",
                "sku": "SKM-952-NE-MP",
                "name": "Taburete Alto Tolix Negro Pino (Sin Respaldo)",
                "regularPrice": 1100,
                "salePrice": 950,
                "stock": 173,
                "dimensions": "45 × 45 × 76 cm",
                "weightLimit": "150 kg (Estructura de acero prensado con cruz inferior)",
                "colors": "Negro",
                "category": "Sillas y Bancos",
                "keywords": [
                        "taburete",
                        "alto",
                        "tolix",
                        "banco",
                        "pino",
                        "madera",
                        "barra",
                        "skm-952-ne-mp",
                        "952"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
                ]
        },
        {
                "id": "prod-9",
                "sku": "SKM-951-NE",
                "name": "Taburete Tolix Negro Simple (Metálico)",
                "regularPrice": 990,
                "salePrice": 850,
                "stock": 29,
                "dimensions": "39 × 76 cm",
                "weightLimit": "150 kg (100% acero estampado)",
                "colors": "Negro",
                "category": "Sillas y Bancos",
                "keywords": [
                        "taburete",
                        "tolix",
                        "banco",
                        "simple",
                        "metalico",
                        "negro",
                        "skm-951-ne",
                        "951"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_0fe037c544c64b67b703a05bbd9b93ce~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
                ]
        },
        {
                "id": "prod-10",
                "sku": "SKM-972-NE",
                "name": "Taburete Tolix Negro con Respaldo",
                "regularPrice": 1300,
                "salePrice": 1090,
                "stock": 20,
                "dimensions": "45 × 45 × 100 cm",
                "weightLimit": "150 kg por banco (Acero prensado)",
                "colors": "Negro y Gris",
                "category": "Sillas y Bancos",
                "keywords": [
                        "taburete",
                        "tolix",
                        "banco",
                        "respaldo",
                        "barra",
                        "metalico",
                        "negro",
                        "skm-972-ne",
                        "972"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
                ]
        },
        {
                "id": "prod-11",
                "sku": "SKM-972-GR",
                "name": "Taburete Tolix Gris con Respaldo",
                "regularPrice": 1300,
                "salePrice": 1090,
                "stock": 2,
                "dimensions": "45 × 45 × 100 cm",
                "weightLimit": "150 kg por banco (Acero prensado)",
                "colors": "Negro y Gris",
                "category": "Sillas y Bancos",
                "keywords": [
                        "taburete",
                        "tolix",
                        "banco",
                        "respaldo",
                        "gris",
                        "metalico",
                        "skm-972-gr"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
                ]
        },
        {
                "id": "prod-12",
                "sku": "ZGS-926-NE",
                "name": "Taburete Elam Negro",
                "regularPrice": 1400,
                "salePrice": 1190,
                "stock": 11,
                "dimensions": "32 × 47/61 cm",
                "weightLimit": "120 kg (Pistón a gas reforzado)",
                "colors": "Negro",
                "category": "Sillas y Bancos",
                "keywords": [
                        "taburete",
                        "elam",
                        "banco",
                        "barra",
                        "giratorio",
                        "zgs-926",
                        "926"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_53b24274ff094c6c8351fee0e5a97ca3~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-13",
                "sku": "ZGS-101-NE",
                "name": "Taburete Kira Negro con Respaldo",
                "regularPrice": 1500,
                "salePrice": 1290,
                "stock": 21,
                "dimensions": "38 × 40 × 63/83 cm",
                "weightLimit": "130 kg (Pistón hidráulico de uso pesado)",
                "colors": "Negro",
                "category": "Sillas y Bancos",
                "keywords": [
                        "taburete",
                        "kira",
                        "banco",
                        "barra",
                        "giratorio",
                        "zgs-101",
                        "101"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_17b38c26f362413ea77815f7efe4ff39~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
                ]
        },
        {
                "id": "prod-14",
                "sku": "ZGS-946-120x30x180",
                "name": "Estantería de Metal y Madera 120×30×180cm",
                "regularPrice": 3200,
                "salePrice": 2850,
                "stock": 49,
                "dimensions": "120 × 30 × 180 cm",
                "weightLimit": "80 kg por nivel (Uso comercial y residencial)",
                "colors": "Metálico con madera",
                "category": "Muebles y Organización",
                "keywords": [
                        "estanteria",
                        "estante",
                        "librero",
                        "repisa",
                        "organizacion",
                        "madera",
                        "pino",
                        "metal",
                        "negro",
                        "zgs-946",
                        "946"
                ],
                "images": [
                        "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85"
                ]
        },
        {
                "id": "prod-15",
                "sku": "ZGS-944-120x80x75",
                "name": "Mesa de Comedor de Madera y Hierro 120×80×75cm",
                "regularPrice": 3400,
                "salePrice": 2990,
                "stock": 35,
                "dimensions": "120 × 80 × 75 cm",
                "weightLimit": "150 kg (Madera maciza y hierro estructural)",
                "colors": "Negro",
                "category": "Muebles y Organización",
                "keywords": [
                        "mesa",
                        "comedor",
                        "madera",
                        "hierro",
                        "pino",
                        "negro",
                        "zgs-944",
                        "944"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_f79ac4221ee04cc2a5a4d743a3dca3d6~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-16",
                "sku": "ZGS-943-120x60x75",
                "name": "Escritorio de Madera y Hierro 120×60×75cm",
                "regularPrice": 2600,
                "salePrice": 2250,
                "stock": 68,
                "dimensions": "120 × 60 × 75 cm",
                "weightLimit": "120 kg (Estructura de acero al carbono y madera)",
                "colors": "Negro",
                "category": "Muebles y Organización",
                "keywords": [
                        "escritorio",
                        "mesa de trabajo",
                        "home office",
                        "madera",
                        "hierro",
                        "pino",
                        "negro",
                        "zgs-943",
                        "943"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_4c4a8d50efa54afaabbd8e9227f6ba6f~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-17",
                "sku": "ZGM-032-NENE",
                "name": "Juego 2 Mesas Redondas Auxiliares Mármol Negro Doncaster",
                "regularPrice": 2800,
                "salePrice": 2450,
                "stock": 38,
                "dimensions": "45×70 y 50×38 cm",
                "weightLimit": "50 kg por mesa (Acero y cubierta símil mármol templado)",
                "colors": "Negro",
                "category": "Muebles y Organización",
                "keywords": [
                        "mesas",
                        "nido",
                        "marmol",
                        "doncaster",
                        "sala",
                        "centro",
                        "auxiliares",
                        "zgm-032",
                        "032"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_e91d7101f4414098b49c596b6b80153f~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-18",
                "sku": "ZGM-017-NE",
                "name": "Sofá Silla Reclinable 1 Cuerpo Giratorio 360° Nobby Negra",
                "regularPrice": 4500,
                "salePrice": 3890,
                "stock": 4,
                "dimensions": "57 × 60 × 87 cm",
                "weightLimit": "160 kg (Estructura interna de acero y reclinable)",
                "colors": "Negro",
                "category": "Sillas y Bancos",
                "keywords": [
                        "sofa",
                        "sillon",
                        "reclinable",
                        "giratorio",
                        "nobby",
                        "1 cuerpo",
                        "zgm-017",
                        "017"
                ],
                "images": [
                        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
                ]
        },
        {
                "id": "prod-19",
                "sku": "ZGF-503",
                "name": "Silla de Ruedas Plegable Smak",
                "regularPrice": 3200,
                "salePrice": 2790,
                "stock": 71,
                "dimensions": "88 × 99 × 67 cm",
                "weightLimit": "120 kg (Estructura de acero cromado y lona impermeable)",
                "colors": "Negro con plateado",
                "category": "Salud y Cuidado",
                "keywords": [
                        "silla de ruedas",
                        "ruedas",
                        "plegable",
                        "salud",
                        "ortopedica",
                        "zgf-503",
                        "503"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_25b1c5d058b548d0aa0a2569527ec651~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
                ]
        },
        {
                "id": "prod-20",
                "sku": "ZGB-210-NE",
                "name": "Hamaca Jardín con Techo y Almohadas Negro",
                "regularPrice": 4200,
                "salePrice": 3650,
                "stock": 6,
                "dimensions": "59 × 61 × 46 cm",
                "weightLimit": "200 kg (Para 2-3 personas)",
                "colors": "Negro",
                "category": "Muebles y Organización",
                "keywords": [
                        "hamaca",
                        "columpio",
                        "jardin",
                        "techo",
                        "almohadas",
                        "zgb-210",
                        "210"
                ],
                "images": [
                        "https://images.unsplash.com/photo-1587588354456-ae376af71a25?auto=format&fit=crop&w=800&q=80"
                ]
        },
        {
                "id": "prod-21",
                "sku": "ZGB-148-NM",
                "name": "Pileta de Cocina Multifuncional Negro Mate Savadir",
                "regularPrice": 4600,
                "salePrice": 3990,
                "stock": 52,
                "dimensions": "75 × 45 cm",
                "weightLimit": "Acero inoxidable 304 nano-recubierto anti-grasa",
                "colors": "Negro",
                "category": "Cocina y Baño",
                "keywords": [
                        "pileta",
                        "lavatrastos",
                        "fregadero",
                        "cocina",
                        "negro mate",
                        "savadir",
                        "zgb-148",
                        "148"
                ],
                "images": [
                        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
                ]
        },
        {
                "id": "prod-22",
                "sku": "ZGB-146-NM",
                "name": "Monocomando con Salida Flexible Negro Mate Todd",
                "regularPrice": 1350,
                "salePrice": 1090,
                "stock": 12,
                "dimensions": "40 × 25.4 cm",
                "weightLimit": "Latón macizo con manguera de silicona grado alimenticio",
                "colors": "Negro",
                "category": "Cocina y Baño",
                "keywords": [
                        "grifo",
                        "monocomando",
                        "llave",
                        "flexible",
                        "negro mate",
                        "todd",
                        "zgb-146-nm"
                ],
                "images": [
                        "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=800&q=80"
                ]
        },
        {
                "id": "prod-23",
                "sku": "ZGB-146-INOX",
                "name": "Monocomando con Salida Flexible Inox Todd",
                "regularPrice": 1350,
                "salePrice": 1090,
                "stock": 15,
                "dimensions": "40 × 25.4 cm",
                "weightLimit": "Acero inoxidable SUS 304 cepillado",
                "colors": "Metálico",
                "category": "Cocina y Baño",
                "keywords": [
                        "grifo",
                        "monocomando",
                        "llave",
                        "flexible",
                        "inox",
                        "acero",
                        "todd",
                        "zgb-146-inox"
                ],
                "images": [
                        "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=800&q=80"
                ]
        },
        {
                "id": "prod-24",
                "sku": "ZGS-707",
                "name": "Escalera Tipo Andamio Multipropósito 16 Escalones + Plancha",
                "regularPrice": 3800,
                "salePrice": 3350,
                "stock": 12,
                "dimensions": "34 × 120/440 cm",
                "weightLimit": "150 kg (Aluminio de aviación 6063)",
                "colors": "Metálico",
                "category": "Escaleras",
                "keywords": [
                        "escalera",
                        "andamio",
                        "16 escalones",
                        "plancha",
                        "aluminio",
                        "multiproposito",
                        "plegable",
                        "zgs-707",
                        "707"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_298a5327119e41eca093ab5b636ff305~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
                ]
        },
        {
                "id": "prod-25",
                "sku": "ZGS-622",
                "name": "Carro de Carga Plegable 90 KG",
                "regularPrice": 1200,
                "salePrice": 990,
                "stock": 28,
                "dimensions": "30 × 24 × 71/107 cm",
                "weightLimit": "90 kg (200 lbs)",
                "colors": "Metálico",
                "category": "Muebles y Organización",
                "keywords": [
                        "carro",
                        "carga",
                        "plegable",
                        "carretilla",
                        "90 kg",
                        "maletas",
                        "zgs-622",
                        "622"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_f34e9dcc099b420b9d8bc1788775f0a0~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-26",
                "sku": "ZGS-534-RS",
                "name": "Bicicleta Infantil Rosa Rin 14",
                "regularPrice": 2200,
                "salePrice": 1890,
                "stock": 2,
                "dimensions": "102 × 70/78 cm",
                "weightLimit": "35 kg (Estructura de acero reforzado)",
                "colors": "Rosa",
                "category": "Salud y Cuidado",
                "keywords": [
                        "bici",
                        "bicicleta",
                        "rosa",
                        "rin 14",
                        "ninas",
                        "infantil",
                        "zgs-534",
                        "534"
                ],
                "images": [
                        "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80"
                ]
        },
        {
                "id": "prod-27",
                "sku": "SKM-955-CA-NE-BL",
                "name": "Silla Gamer Rom CA Negro/Blanco",
                "regularPrice": 3600,
                "salePrice": 3190,
                "stock": 0,
                "dimensions": "130 × 52 cm",
                "weightLimit": "160 kg",
                "colors": "Negro con Blanco",
                "category": "Sillas y Bancos",
                "keywords": [
                        "silla gamer",
                        "blanco",
                        "rom",
                        "skm-955-ca-ne-bl"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd42217c9dd8~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        },
        {
                "id": "prod-28",
                "sku": "SKM-955-CA-NE-RO",
                "name": "Silla Gamer Rom CA Negro/Rojo",
                "regularPrice": 3600,
                "salePrice": 3190,
                "stock": 0,
                "dimensions": "130 × 52 cm",
                "weightLimit": "160 kg",
                "colors": "Negro con Rojo",
                "category": "Sillas y Bancos",
                "keywords": [
                        "silla gamer",
                        "rojo",
                        "rom",
                        "skm-955-ca-ne-ro"
                ],
                "images": [
                        "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd42217c9dd8~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
                ]
        }
],
    rules: [
      {
            "id": "rule-stock-sku",
            "name": "Consulta de Stock por SKU",
            "type": "parametric",
            "category": "Inventario",
            "enabled": true,
            "trainingPhrases": [
                  "tienen stock para el sku {sku}",
                  "hay stock del sku {sku}",
                  "tienen stock de {sku}",
                  "hay stock para el sku {sku}",
                  "disponibilidad del sku {sku}",
                  "stock de {sku}",
                  "tienen {sku}",
                  "hay {sku}",
                  "tienen disponible {sku}",
                  "inventario de {sku}"
            ],
            "responseInStock": "¡Sí, tenemos disponible! Del SKU **{sku}** ({name}) nos quedan **{stock} unidades** a precio de oferta L.{salePrice}. ¿Deseas hacer tu pedido ahora?",
            "responseOutOfStock": "El producto **{name}** (SKU: {sku}) se encuentra actualmente **agotado**. 📦 Si gustas te anotamos para avisarte en la próxima reposición.",
            "responseNotFound": "No encontré ningún producto con el SKU **{sku}** en nuestro inventario. Escribe *'ver catálogo'* para conocer nuestros códigos activos."
      },
      {
            "id": "rule-catalogo",
            "name": "Ver Catálogo de Productos",
            "type": "static",
            "category": "Catálogo",
            "enabled": true,
            "trainingPhrases": [
                  "ver catalogo",
                  "que productos tienen",
                  "cuales son los productos",
                  "muestrame que venden",
                  "lista de articulos",
                  "catalogo completo",
                  "que tienen en venta",
                  "mostrar muebles"
            ],
            "response": "Actualmente tenemos estos productos en catálogo:",
            "action": "show_catalog"
      },
      {
            "id": "rule-envios",
            "name": "Tiempos de Entrega a Domicilio",
            "type": "static",
            "category": "Envíos",
            "enabled": true,
            "trainingPhrases": [
                  "como hacen los envios",
                  "cuanto tarda el envio",
                  "hacen entregas a domicilio",
                  "tiempo de entrega",
                  "cuanto se tardan en llegar",
                  "envian a domicilio",
                  "cuanto tiempo se tardan en venir a dejar",
                  "cuanto tardan en traerlo a la casa"
            ],
            "response": "🚚 **Tiempos de Entrega:** Tenemos envío a todos los lugares del país y realizamos la entrega entre 1 y 2 días posteriores a tu confirmación de pedido a través de Cargo Expreso con pago en efectivo contra entrega."
      },
      {
            "id": "rule-costo-envio",
            "name": "Costo de Envío Gratis",
            "type": "static",
            "category": "Envíos",
            "enabled": true,
            "trainingPhrases": [
                  "cuanto cuesta el envio",
                  "cuanto cobran de envio",
                  "costo de envio",
                  "precio del envio",
                  "cobran el flete",
                  "el envio es gratis",
                  "cuanto vale el flete"
            ],
            "response": "🚚 **Costo de Envío:** ¡El envío es **completamente gratuito** a cualquier parte del país! Solo cancelas el valor del producto al recibirlo en efectivo."
      },
      {
            "id": "rule-forza",
            "name": "Envíos por Forza u otra Paquetería",
            "type": "static",
            "category": "Envíos",
            "enabled": true,
            "trainingPhrases": [
                  "haces envios por forza",
                  "hacen envios por forza",
                  "envian por forza",
                  "mandan por forza",
                  "otra paqueteria",
                  "haces envios por forza u otra paqueteria",
                  "pueden mandar por forza",
                  "usan forza"
            ],
            "response": "📦 **Transportadora:** No, únicamente realizamos entregas a través de **Cargo Expreso**."
      },
      {
            "id": "rule-islands",
            "name": "Entregas en Roatán, Útila e Islas de la Bahía",
            "type": "static",
            "category": "Envíos",
            "enabled": true,
            "trainingPhrases": [
                  "envian a roatan",
                  "islas de la bahia",
                  "envios a ceiba",
                  "entregan en el muelle",
                  "hacen envios a guanaja",
                  "utila",
                  "roatan",
                  "entregas en roatan utila o isla de la bahia",
                  "muelle de cabotaje",
                  "ferry galaxy",
                  "utila dream"
            ],
            "response": "🏝️ **Entregas en Roatán, Útila o Islas de la Bahía:**\nPara Roatán o Útila, solo hacemos envíos con **transferencia previa**.\nUna vez nos hace llegar el comprobante de transferencia bancaria, nosotros enviamos el producto hacia el **muelle de cabotaje de La Ceiba** con la indicación de subir el paquete al ferry que usted diga (Utila Dream, Galaxy Wave, etc.).\n⚠️ **Nota:** No cubrimos el costo del ferry (corre por cuenta del cliente)."
      },
      {
            "id": "rule-tarjetas",
            "name": "Pago con Tarjeta de Crédito / Débito",
            "type": "static",
            "category": "Pagos",
            "enabled": true,
            "trainingPhrases": [
                  "aceptan tarjeta",
                  "aceptan tarjeta de credito",
                  "se puede pagar con tarjeta",
                  "pago con tarjeta",
                  "puedo pagar con tarjeta",
                  "tarjeta de debito",
                  "pago con tarjeta de debito"
            ],
            "response": "💳 **Forma de Pago con Tarjeta:** No aceptamos pagos con tarjeta, solo pago en efectivo contra entrega y se le paga al operador de Cargo Expreso o por transferencia electrónica previa, pero la transferencia debe confirmarse antes de realizar el envío."
      },
      {
            "id": "rule-transferencia",
            "name": "Pago con Transferencia Bancaria",
            "type": "static",
            "category": "Pagos",
            "enabled": true,
            "trainingPhrases": [
                  "puedo pagar con transferencia",
                  "puedo pagar por transferencia",
                  "aceptan transferencia",
                  "pago con transferencia",
                  "transferencia bancaria",
                  "cuentas para transferir",
                  "datos de transferencia",
                  "cuenta de banco"
            ],
            "response": "🏦 **Pago con Transferencia:** Sí aceptamos pagos con transferencia pero se tendría que realizar previo al envío del paquete.\n\nCuentas empresariales oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):\n• BAC Credomatic (Cheques): 742-108-951\n• Banco Ficohsa (Cheques): 2000-098-432\n• Banco Atlántida (Ahorros): 110-045-892\n• Banpaís (Cheques): 01-501-002345\n\nUna vez realizado el depósito o transferencia, nos compartes el comprobante por este chat para proceder con el despacho inmediato."
      },
      {
            "id": "rule-pagos",
            "name": "Métodos y Formas de Pago",
            "type": "static",
            "category": "Pagos",
            "enabled": true,
            "trainingPhrases": [
                  "como puedo pagar",
                  "formas de pago",
                  "metodos de pago",
                  "aceptan pago contra entrega",
                  "puedo pagar en efectivo"
            ],
            "response": "Aceptamos dos formas de pago:\n1. **Efectivo contra entrega:** Le pagas directamente al motorista de Cargo Expreso al recibir en tu puerta.\n2. **Transferencia bancaria electrónica previa:** Confirmada antes de despachar el paquete."
      },
      {
            "id": "rule-nuevas",
            "name": "Condición: ¿Son nuevas?",
            "type": "static",
            "category": "Políticas",
            "enabled": true,
            "trainingPhrases": [
                  "son nuevas",
                  "son nuevos",
                  "los muebles son nuevos",
                  "los productos son nuevos",
                  "es nuevo o de segunda",
                  "venden cosas usadas"
            ],
            "response": "✨ **Condición del Producto:** Sí, todos nuestros productos son nuevos 100% de fábrica en su caja original sellada."
      },
      {
            "id": "rule-garantia",
            "name": "Garantía de Productos",
            "type": "static",
            "category": "Políticas",
            "enabled": true,
            "trainingPhrases": [
                  "tienen garantia",
                  "cuanto tiempo de garantia",
                  "garantia",
                  "que garantia tienen",
                  "si viene quebrado",
                  "si sale defectuoso"
            ],
            "response": "🛡️ **Garantía:** Cuentan con garantía únicamente contra defectos de fabricación."
      },
      {
            "id": "rule-mejor-precio",
            "name": "Mejor Precio / Descuento por Volumen",
            "type": "static",
            "category": "Precios",
            "enabled": true,
            "trainingPhrases": [
                  "mejor precio",
                  "cual es el mejor precio",
                  "me dan descuento",
                  "hacen descuento",
                  "precio si compro varios",
                  "precio por mayor",
                  "rebaja",
                  "cuanto es lo menos"
            ],
            "response": "🏷️ **Mejor Precio:** El precio especial sería equivalente a la cantidad de piezas solicitadas por el cliente. Si necesitas ordenar varias piezas o mayoreo, indícanos cuántas unidades deseas y con gusto te cotizamos."
      },
      {
            "id": "rule-ubicacion",
            "name": "¿Dónde se encuentran ubicados?",
            "type": "static",
            "category": "Ubicación",
            "enabled": true,
            "trainingPhrases": [
                  "donde se encuentran ubicados",
                  "donde estan ubicados",
                  "direccion de la tienda",
                  "tienen tienda fisica",
                  "ubicacion de la tienda",
                  "donde queda el local",
                  "donde estan",
                  "puerto cortes"
            ],
            "response": "📍 **Ubicación Física:** Nos encontramos ubicados en **Plaza Krisale, Puerto Cortés, Honduras**.\n\n¡Realizamos envíos gratuitos a domicilio a cualquier parte del país vía Cargo Expreso!"
      },
      {
            "id": "rule-horarios-agencias",
            "name": "Horarios de Entrega y Agencias Cargo Expreso",
            "type": "static",
            "category": "Envíos",
            "enabled": true,
            "trainingPhrases": [
                  "a que hora llega mi paquete",
                  "en que horario me entregan",
                  "a que hora vienen",
                  "entregan en sabado",
                  "entregan los sabados",
                  "puedo recoger en agencia",
                  "retiro en agencia cargo expreso"
            ],
            "response": "🚚 **Horarios y Agencias:** El repartidor de Cargo Expreso se pondrá en contacto contigo por llamada telefónica para coordinar el horario de entrega en tu domicilio (Lunes a Viernes de 8am a 5pm, Sábados medio día hasta las 12pm). Si necesitas horario específico, puedes solicitar retiro en cualquier oficina o agencia de Cargo Expreso de tu ciudad."
      }
],
    synonyms: {
      precio: ["presio", "rebaja", "cuanto cuesta", "cuanto vale", "costo", "valor", "cotizacion", "precio final", "tarifa", "descuento"],
      stock: ["disponible", "disponibilidad", "existencia", "inventario", "unidades", "quedan", "hay", "tienen", "piezas", "existencias"],
      dimensiones: [
        "dimenciones", "dimencion", "dimension", "dimensiones",
        "medidas", "medida", "mide", "miden", "medir", "cuanto mide", "cuanto miden",
        "tamano", "tamaño", "talla", "tallas",
        "alto", "altura", "ancho", "anchura", "largo", "longitud", "profundidad", "fondo",
        "centimetros", "metros", "cm", "mts"
      ],
      peso: ["cuanto aguanta", "cuanto soporta", "resistencia", "capacidad", "soporta", "kilos", "libras", "peso maximo", "carga"],
      fotos: ["fotos reales", "imagenes", "fotografias", "galeria", "mostrar fotos", "ver", "foto", "ver catalogo con fotos"],
      envio: ["entrega", "despacho", "flete", "cargo expreso", "encomienda", "paqueteria", "domicilio", "reparto"],
      pago: ["efectivo", "transferencia", "tarjeta", "contra entrega", "deposito", "forma de pago", "metodo de pago", "cuotas"],
      asesor: ["humano", "persona", "operador", "atencion al cliente", "vendedor", "agente", "ejecutivo", "alguien real"],
      garantia: ["garantía", "seguro", "defecto", "falla", "cobertura", "reclamo", "garantizado"],
      horario: ["horarios", "a que hora abren", "cuando atienden", "atencion", "horario de atencion", "abierto"],
      ubicacion: ["donde estan", "direccion", "sucursal", "local", "tienda", "ubicacion", "plaza", "mapa"],
      factura: ["facturacion", "rtn", "cai", "fiscal", "comprobante", "recibo"]
    },
    campaigns: [
      {
        id: "camp-fb-ad-silla-gamer",
        platform: "facebook",
        channel: "Facebook Ads (CTWA)",
        type: "ad",
        sourceId: "12020584738290123",
        url: "https://www.facebook.com/share/p/196jarUnqz/?mibextid=wwXIfr",
        headline: "Silla Gamer Rom CA Negro/Negro",
        body: "Hola, tenemos la Silla Gamer Rom CA Negro/Negro. ¿Te interesa saber más?",
        sku: "SKM-955-CA-NE",
        description: "Anuncio de Meta Ads (Facebook/Instagram) - Click to WhatsApp"
      },
      {
        id: "camp-fb-post-estante",
        platform: "facebook",
        channel: "Facebook Post Orgánico",
        type: "post",
        sourceId: "196jarUnqz",
        url: "https://www.facebook.com/share/p/196jarUnqz/?mibextid=wwXIfr",
        headline: "Publicación: Estantería de Metal y Madera 120x30x180cm",
        body: "¡Nuevo ingreso! Estantería 120x30x180 cm pino y metal en oferta especial.",
        sku: "ZGS-946-120x30x180",
        description: "Enlace compartido de post en Facebook"
      },
      {
        id: "camp-ig-escritorio",
        platform: "instagram",
        channel: "Instagram Reel",
        type: "ad",
        sourceId: "12020993847291100",
        url: "https://www.instagram.com/reel/C3x918LqZ/",
        headline: "Escritorio de Madera y Hierro 120x60cm",
        body: "Transforma tu espacio de trabajo con nuestro escritorio de madera y hierro.",
        sku: "ZGS-943-120x60x75",
        description: "Campaña Instagram Reels - Click to WhatsApp"
      }
    ]
  },
  {
    id: "calzado",
    name: "Calzado Express",
    category: "Calzado y accesorios",
    initials: "C",
    accent: "#6155c8",
    products: [
      {
        id: "prod-c1",
        sku: "TEN-01",
        name: "Tenis Urban Flex Running",
        regularPrice: 980,
        salePrice: 850,
        stock: 24,
        dimensions: "Tallas 36–44",
        weightLimit: "Uso diario deportivo y running",
        keywords: ["tenis", "zapatos", "calzado", "sneakers", "running", "deportivos"],
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-c2",
        sku: "BOT-02",
        name: "Botas Explorer Waterproof Cuero",
        regularPrice: 1500,
        salePrice: 1320,
        stock: 8,
        dimensions: "Tallas 38–43",
        weightLimit: "Cuero genuino, suela todo terreno",
        keywords: ["botas", "montana", "cuero", "calzado", "waterproof", "outdoor"],
        images: [
          "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-c3",
        sku: "SAN-03",
        name: "Sandalias Classic Comfort Anatómicas",
        regularPrice: 650,
        salePrice: 500,
        stock: 0,
        dimensions: "Tallas 35–41",
        weightLimit: "Planta ortopédica ultra liviana",
        keywords: ["sandalias", "playa", "verano", "descanso", "comodas"],
        images: [
          "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-c4",
        sku: "MOC-04",
        name: "Mocasines Italian Style Cuero",
        regularPrice: 1300,
        salePrice: 1150,
        stock: 14,
        dimensions: "Tallas 39–44",
        weightLimit: "Cuero vacuno, plantilla acolchada",
        keywords: ["mocasines", "formal", "cuero", "elegante", "oficina"],
        images: [
          "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-c5",
        sku: "DEP-05",
        name: "Zapatillas Sport Training Air Pro",
        regularPrice: 1100,
        salePrice: 920,
        stock: 35,
        dimensions: "Tallas 37–45",
        weightLimit: "Cámara de aire y malla transpirable",
        keywords: ["zapatillas", "training", "gym", "gimnasio", "deportivas"],
        images: [
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-c6",
        sku: "TAC-06",
        name: "Tacones Elegance Stiletto Nude",
        regularPrice: 1050,
        salePrice: 890,
        stock: 10,
        dimensions: "Tallas 35–40, Tacón 7 cm",
        weightLimit: "Acabado satín mate, plantilla confort",
        keywords: ["tacones", "zapatillas", "fiesta", "elegante", "nude", "stiletto"],
        images: [
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-c7",
        sku: "CAS-07",
        name: "Calzado Casual Slip-On Lona",
        regularPrice: 750,
        salePrice: 620,
        stock: 19,
        dimensions: "Tallas 36–43",
        weightLimit: "Lona reforzada, elásticos laterales",
        keywords: ["casual", "slip-on", "lona", "zapatos comodos", "diario"],
        images: [
          "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-c8",
        sku: "BOT-08",
        name: "Botines Chelsea Gamuza Café",
        regularPrice: 1650,
        salePrice: 1450,
        stock: 0,
        dimensions: "Tallas 39–44",
        weightLimit: "Gamuza tratada repelente al agua",
        keywords: ["botines", "chelsea", "gamuza", "moda", "estilo"],
        images: [
          "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=85"
        ]
      }
    ],
    rules: [
      {
        id: "rule-stock-sku-c",
        name: "Consulta de Stock por SKU",
        type: "parametric",
        category: "Inventario",
        enabled: true,
        trainingPhrases: [
          "tienen stock para el sku {sku}",
          "hay stock del sku {sku}",
          "tienen stock de {sku}",
          "hay stock para el sku {sku}",
          "stock del codigo {sku}",
          "tienen {sku}",
          "hay {sku}",
          "tallas disponibles de {sku}",
          "disponibilidad de {sku}"
        ],
        responseInStock: "¡Sí, tenemos existencias! Del calzado SKU **{sku}** ({name}) nos quedan **{stock} pares** a L.{salePrice}. ¿Qué talla necesitas?",
        responseOutOfStock: "El modelo **{name}** (SKU: {sku}) está temporalmente **agotado**. Puedes consultar otros modelos activos escribiendo *'ver catálogo'*.",
        responseNotFound: "No encontramos ningún calzado con el SKU **{sku}**. Escribe *'ver catálogo'* para ver la lista completa."
      },
      {
        id: "rule-catalogo-c",
        name: "Ver Catálogo de Calzado",
        type: "static",
        category: "Catálogo",
        enabled: true,
        trainingPhrases: [
          "ver catalogo",
          "que zapatos tienen",
          "muestrame los tenis",
          "lista de productos",
          "catalogo",
          "modelos disponibles",
          "que calzado venden"
        ],
        response: "Estos son los modelos disponibles en nuestra colección:",
        action: "show_catalog"
      },
      {
        id: "rule-envios-c",
        name: "Envíos y Entregas Nacionales",
        type: "static",
        category: "Envíos",
        enabled: true,
        trainingPhrases: [
          "envios a domicilio",
          "cuanto tarda la entrega",
          "tiempo de entrega",
          "hacen envios",
          "como me llega el paquete"
        ],
        response: "Envíos express en 24 a 48 horas a las principales ciudades de Honduras con Cargo Expreso. Flete gratis en compras de 2 o más pares."
      },
      {
        id: "rule-horarios-agencias-c",
        name: "Horarios de Entrega y Retiro en Agencias Cargo Expreso",
        type: "static",
        category: "Envíos",
        enabled: true,
        trainingPhrases: [
          "entregan en sabado",
          "entregan los sabados",
          "hacen entregas los sabados",
          "pueden entregar en horario especifico",
          "puedo pedir un horario especifico",
          "pueden entregar a una hora especifica",
          "a que hora entregan",
          "puedo recoger en agencia",
          "puedo retirar en agencia de cargo expreso",
          "oficinas de cargo expreso",
          "agencias de cargo expreso",
          "retirar en agencia"
        ],
        response: "🚚 **Horarios de Entrega con Cargo Expreso:**\n\n• **A domicilio:** De Lunes a Viernes de 8:00 AM a 5:00 PM, y **Sábados medio día** (hasta las 12:00 PM).\n• **Dependencia de la agencia:** Las rutas dependen de Cargo Expreso, por lo que **no depende de nosotros asegurar una hora exacta o día fijo en tiempo y forma**.\n\n💡 **Retiro en Agencia:** Si necesitas retirar a tu propio horario, te recomendamos enviarlo para **retiro en la agencia u oficina de Cargo Expreso más cercana**, donde puedes recogerlo cuando mejor te convenga (Sábados medio día)."
      },
      {
        id: "rule-transferencia-c",
        name: "Pago por Transferencia Bancaria",
        type: "static",
        category: "Pagos",
        enabled: true,
        trainingPhrases: [
          "puedo pagar con transferencia",
          "puedo pagar por transferencia",
          "se puede pagar con transferencia",
          "aceptan transferencia",
          "tienen transferencia",
          "pago por transferencia",
          "transferencia bancaria",
          "cuentas para transferir",
          "datos de transferencia"
        ],
        response: "¡Sí! Aceptamos transferencia bancaria a nuestras cuentas: BAC Credomatic (Cheques: 742-108-951), Ficohsa (2000-098-432) y Atlántida (110-045-892). También puedes pagar en efectivo contra entrega."
      },
      {
        id: "rule-pagos-c",
        name: "Pago Contra Entrega en Efectivo",
        type: "static",
        category: "Pagos",
        enabled: true,
        trainingPhrases: [
          "como puedo pagar",
          "formas de pago",
          "pago contra entrega",
          "se paga al recibir",
          "efectivo al repartidor"
        ],
        response: "¡Pagas hasta que lo tienes en tus manos! Aceptamos efectivo contra entrega con el repartidor o transferencia previa."
      },
      {
        id: "rule-tallas-c",
        name: "Guía de Tallas y Cambios de Talla",
        type: "static",
        category: "Políticas",
        enabled: true,
        trainingPhrases: [
          "que pasa si no me queda la talla",
          "cambio por talla",
          "guia de tallas",
          "vienen a la medida",
          "como saber mi talla"
        ],
        response: "Nuestros modelos vienen con horma estándar normal. Si al probártelos no te quedan perfectos, te cambiamos la talla sin costo adicional de flete."
      },
      {
        id: "rule-garantia-c",
        name: "Garantía de Calzado",
        type: "static",
        category: "Políticas",
        enabled: true,
        trainingPhrases: [
          "tienen garantia los zapatos",
          "si se despegan",
          "cuanto tiempo de garantia",
          "garantia"
        ],
        response: "Ofrecemos 30 días de garantía total por despegue de suela, costuras o defectos de fabricación."
      },
      {
        id: "rule-restriccion-regateo-c",
        name: "Bloqueo: No regateo de precios",
        type: "restriction",
        category: "Restricciones",
        enabled: true,
        trainingPhrases: [
          "me rebajas",
          "precio mas bajo",
          "haceme descuento",
          "cuanto es lo ultimo"
        ],
        response: "Nuestros precios ya tienen descuento directo de fábrica para ofrecer la mejor relación calidad-precio. Si llevas 3 o más pares, consulta con un asesor para precio de paquete."
      }
    ],
    synonyms: {
      precio: ["presio", "rebaja", "cuanto cuesta", "valor", "costo", "oferta", "precio final"],
      stock: ["disponible", "disponibilidad", "existencia", "pares", "quedan", "hay", "tienen", "inventario"],
      dimensiones: [
        "dimenciones", "dimencion", "dimension", "dimensiones",
        "talla", "tallas", "medidas", "medida", "tamano", "tamaño", "numero", "horma",
        "mide", "miden", "cuanto mide", "cuanto miden"
      ],
      fotos: ["fotos reales", "imagenes", "fotografias", "ver calzado", "ver tenis", "foto"],
      envio: ["entrega", "despacho", "cargo expreso", "flete", "a domicilio"],
      pago: ["efectivo", "transferencia", "contra entrega", "tarjeta"],
      asesor: ["humano", "persona", "operador", "atencion al cliente", "agente"]
    },
    campaigns: [
      {
        id: "camp-fb-ad-tenis",
        platform: "facebook",
        channel: "Facebook Ads (CTWA)",
        type: "ad",
        sourceId: "12020776655443322",
        url: "https://www.facebook.com/share/p/998tenisfb/?mibextid=wwXIfr",
        headline: "Tenis Urban Flex Running",
        body: "Lleva tus pasos al siguiente nivel con Tenis Urban Flex.",
        sku: "TEN-01",
        description: "Anuncio Facebook Ads - Tenis Running"
      }
    ]
  }
];
