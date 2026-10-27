(() => {
  // js/seed-data.js
  var STORAGE_KEY = "smakbot-demo-v5";
  var TENANTS = [
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
          "dimensions": "130 \xD7 52 cm",
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
          "name": "Sill\xF3n Ejecutivo Miles Negro con Apoyapi\xE9s",
          "regularPrice": 3800,
          "salePrice": 3390,
          "stock": 179,
          "dimensions": "110 \xD7 55 cm",
          "weightLimit": "160 kg (Pist\xF3n clase 4 y base de acero cromado)",
          "colors": "Negro y Caf\xE9",
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
          "name": "Sill\xF3n Ejecutivo Miles Marr\xF3n con Apoyapi\xE9s",
          "regularPrice": 3800,
          "salePrice": 3390,
          "stock": 39,
          "dimensions": "110 \xD7 55 cm",
          "weightLimit": "160 kg (Pist\xF3n clase 4 y base cromada)",
          "colors": "Negro y Caf\xE9",
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
          "name": "Silla Ergon\xF3mica Wynn con Apoyapi\xE9s Negro",
          "regularPrice": 3400,
          "salePrice": 2950,
          "stock": 76,
          "dimensions": "120 \xD7 52 cm",
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
          "name": "Silla Ergon\xF3mica Wynn con Apoyapi\xE9s Gris",
          "regularPrice": 3400,
          "salePrice": 2950,
          "stock": 38,
          "dimensions": "120 \xD7 52 cm",
          "weightLimit": "140 kg (Malla de nylon y pist\xF3n reforzado)",
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
          "dimensions": "47 \xD7 92 cm",
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
          "dimensions": "45 \xD7 45 \xD7 100 cm",
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
          "dimensions": "45 \xD7 45 \xD7 76 cm",
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
          "name": "Taburete Tolix Negro Simple (Met\xE1lico)",
          "regularPrice": 990,
          "salePrice": 850,
          "stock": 29,
          "dimensions": "39 \xD7 76 cm",
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
          "dimensions": "45 \xD7 45 \xD7 100 cm",
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
          "dimensions": "45 \xD7 45 \xD7 100 cm",
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
          "dimensions": "32 \xD7 47/61 cm",
          "weightLimit": "120 kg (Pist\xF3n a gas reforzado)",
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
          "dimensions": "38 \xD7 40 \xD7 63/83 cm",
          "weightLimit": "130 kg (Pist\xF3n hidr\xE1ulico de uso pesado)",
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
          "name": "Estanter\xEDa de Metal y Madera 120\xD730\xD7180cm",
          "regularPrice": 3200,
          "salePrice": 2850,
          "stock": 49,
          "dimensions": "120 \xD7 30 \xD7 180 cm",
          "weightLimit": "80 kg por nivel (Uso comercial y residencial)",
          "colors": "Met\xE1lico con madera",
          "category": "Muebles y Organizaci\xF3n",
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
          "name": "Mesa de Comedor de Madera y Hierro 120\xD780\xD775cm",
          "regularPrice": 3400,
          "salePrice": 2990,
          "stock": 35,
          "dimensions": "120 \xD7 80 \xD7 75 cm",
          "weightLimit": "150 kg (Madera maciza y hierro estructural)",
          "colors": "Negro",
          "category": "Muebles y Organizaci\xF3n",
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
          "name": "Escritorio de Madera y Hierro 120\xD760\xD775cm",
          "regularPrice": 2600,
          "salePrice": 2250,
          "stock": 68,
          "dimensions": "120 \xD7 60 \xD7 75 cm",
          "weightLimit": "120 kg (Estructura de acero al carbono y madera)",
          "colors": "Negro",
          "category": "Muebles y Organizaci\xF3n",
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
          "name": "Juego 2 Mesas Redondas Auxiliares M\xE1rmol Negro Doncaster",
          "regularPrice": 2800,
          "salePrice": 2450,
          "stock": 38,
          "dimensions": "45\xD770 y 50\xD738 cm",
          "weightLimit": "50 kg por mesa (Acero y cubierta s\xEDmil m\xE1rmol templado)",
          "colors": "Negro",
          "category": "Muebles y Organizaci\xF3n",
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
          "name": "Sof\xE1 Silla Reclinable 1 Cuerpo Giratorio 360\xB0 Nobby Negra",
          "regularPrice": 4500,
          "salePrice": 3890,
          "stock": 4,
          "dimensions": "57 \xD7 60 \xD7 87 cm",
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
          "dimensions": "88 \xD7 99 \xD7 67 cm",
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
          "name": "Hamaca Jard\xEDn con Techo y Almohadas Negro",
          "regularPrice": 4200,
          "salePrice": 3650,
          "stock": 6,
          "dimensions": "59 \xD7 61 \xD7 46 cm",
          "weightLimit": "200 kg (Para 2-3 personas)",
          "colors": "Negro",
          "category": "Muebles y Organizaci\xF3n",
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
          "dimensions": "75 \xD7 45 cm",
          "weightLimit": "Acero inoxidable 304 nano-recubierto anti-grasa",
          "colors": "Negro",
          "category": "Cocina y Ba\xF1o",
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
          "dimensions": "40 \xD7 25.4 cm",
          "weightLimit": "Lat\xF3n macizo con manguera de silicona grado alimenticio",
          "colors": "Negro",
          "category": "Cocina y Ba\xF1o",
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
          "dimensions": "40 \xD7 25.4 cm",
          "weightLimit": "Acero inoxidable SUS 304 cepillado",
          "colors": "Met\xE1lico",
          "category": "Cocina y Ba\xF1o",
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
          "name": "Escalera Tipo Andamio Multiprop\xF3sito 16 Escalones + Plancha",
          "regularPrice": 3800,
          "salePrice": 3350,
          "stock": 12,
          "dimensions": "34 \xD7 120/440 cm",
          "weightLimit": "150 kg (Aluminio de aviaci\xF3n 6063)",
          "colors": "Met\xE1lico",
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
          "dimensions": "30 \xD7 24 \xD7 71/107 cm",
          "weightLimit": "90 kg (200 lbs)",
          "colors": "Met\xE1lico",
          "category": "Muebles y Organizaci\xF3n",
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
          "dimensions": "102 \xD7 70/78 cm",
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
          "dimensions": "130 \xD7 52 cm",
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
          "dimensions": "130 \xD7 52 cm",
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
          "responseInStock": "\xA1S\xED, tenemos disponible! Del SKU **{sku}** ({name}) nos quedan **{stock} unidades** a precio de oferta L.{salePrice}. \xBFDeseas hacer tu pedido ahora?",
          "responseOutOfStock": "El producto **{name}** (SKU: {sku}) se encuentra actualmente **agotado**. \u{1F4E6} Si gustas te anotamos para avisarte en la pr\xF3xima reposici\xF3n.",
          "responseNotFound": "No encontr\xE9 ning\xFAn producto con el SKU **{sku}** en nuestro inventario. Escribe *'ver cat\xE1logo'* para conocer nuestros c\xF3digos activos."
        },
        {
          "id": "rule-catalogo",
          "name": "Ver Cat\xE1logo de Productos",
          "type": "static",
          "category": "Cat\xE1logo",
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
          "response": "Actualmente tenemos estos productos en cat\xE1logo:",
          "action": "show_catalog"
        },
        {
          "id": "rule-envios",
          "name": "Tiempos de Entrega a Domicilio",
          "type": "static",
          "category": "Env\xEDos",
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
          "response": "\u{1F69A} **Tiempos de Entrega:** Tenemos env\xEDo a todos los lugares del pa\xEDs y realizamos la entrega entre 1 y 2 d\xEDas posteriores a tu confirmaci\xF3n de pedido a trav\xE9s de Cargo Expreso con pago en efectivo contra entrega."
        },
        {
          "id": "rule-costo-envio",
          "name": "Costo de Env\xEDo Gratis",
          "type": "static",
          "category": "Env\xEDos",
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
          "response": "\u{1F69A} **Costo de Env\xEDo:** \xA1El env\xEDo es **completamente gratuito** a cualquier parte del pa\xEDs! Solo cancelas el valor del producto al recibirlo en efectivo."
        },
        {
          "id": "rule-forza",
          "name": "Env\xEDos por Forza u otra Paqueter\xEDa",
          "type": "static",
          "category": "Env\xEDos",
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
          "response": "\u{1F4E6} **Transportadora:** No, \xFAnicamente realizamos entregas a trav\xE9s de **Cargo Expreso**."
        },
        {
          "id": "rule-islands",
          "name": "Entregas en Roat\xE1n, \xDAtila e Islas de la Bah\xEDa",
          "type": "static",
          "category": "Env\xEDos",
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
          "response": "\u{1F3DD}\uFE0F **Entregas en Roat\xE1n, \xDAtila o Islas de la Bah\xEDa:**\nPara Roat\xE1n o \xDAtila, solo hacemos env\xEDos con **transferencia previa**.\nUna vez nos hace llegar el comprobante de transferencia bancaria, nosotros enviamos el producto hacia el **muelle de cabotaje de La Ceiba** con la indicaci\xF3n de subir el paquete al ferry que usted diga (Utila Dream, Galaxy Wave, etc.).\n\u26A0\uFE0F **Nota:** No cubrimos el costo del ferry (corre por cuenta del cliente)."
        },
        {
          "id": "rule-tarjetas",
          "name": "Pago con Tarjeta de Cr\xE9dito / D\xE9bito",
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
          "response": "\u{1F4B3} **Forma de Pago con Tarjeta:** No aceptamos pagos con tarjeta, solo pago en efectivo contra entrega y se le paga al operador de Cargo Expreso o por transferencia electr\xF3nica previa, pero la transferencia debe confirmarse antes de realizar el env\xEDo."
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
          "response": "\u{1F3E6} **Pago con Transferencia:** S\xED aceptamos pagos con transferencia pero se tendr\xEDa que realizar previo al env\xEDo del paquete.\n\nCuentas empresariales oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):\n\u2022 BAC Credomatic (Cheques): 742-108-951\n\u2022 Banco Ficohsa (Cheques): 2000-098-432\n\u2022 Banco Atl\xE1ntida (Ahorros): 110-045-892\n\u2022 Banpa\xEDs (Cheques): 01-501-002345\n\nUna vez realizado el dep\xF3sito o transferencia, nos compartes el comprobante por este chat para proceder con el despacho inmediato."
        },
        {
          "id": "rule-pagos",
          "name": "M\xE9todos y Formas de Pago",
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
          "response": "Aceptamos dos formas de pago:\n1. **Efectivo contra entrega:** Le pagas directamente al motorista de Cargo Expreso al recibir en tu puerta.\n2. **Transferencia bancaria electr\xF3nica previa:** Confirmada antes de despachar el paquete."
        },
        {
          "id": "rule-nuevas",
          "name": "Condici\xF3n: \xBFSon nuevas?",
          "type": "static",
          "category": "Pol\xEDticas",
          "enabled": true,
          "trainingPhrases": [
            "son nuevas",
            "son nuevos",
            "los muebles son nuevos",
            "los productos son nuevos",
            "es nuevo o de segunda",
            "venden cosas usadas"
          ],
          "response": "\u2728 **Condici\xF3n del Producto:** S\xED, todos nuestros productos son nuevos 100% de f\xE1brica en su caja original sellada."
        },
        {
          "id": "rule-garantia",
          "name": "Garant\xEDa de Productos",
          "type": "static",
          "category": "Pol\xEDticas",
          "enabled": true,
          "trainingPhrases": [
            "tienen garantia",
            "cuanto tiempo de garantia",
            "garantia",
            "que garantia tienen",
            "si viene quebrado",
            "si sale defectuoso"
          ],
          "response": "\u{1F6E1}\uFE0F **Garant\xEDa:** Cuentan con garant\xEDa \xFAnicamente contra defectos de fabricaci\xF3n."
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
          "response": "\u{1F3F7}\uFE0F **Mejor Precio:** El precio especial ser\xEDa equivalente a la cantidad de piezas solicitadas por el cliente. Si necesitas ordenar varias piezas o mayoreo, ind\xEDcanos cu\xE1ntas unidades deseas y con gusto te cotizamos."
        },
        {
          "id": "rule-ubicacion",
          "name": "\xBFD\xF3nde se encuentran ubicados?",
          "type": "static",
          "category": "Ubicaci\xF3n",
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
          "response": "\u{1F4CD} **Ubicaci\xF3n F\xEDsica:** Nos encontramos ubicados en **Plaza Krisale, Puerto Cort\xE9s, Honduras**.\n\n\xA1Realizamos env\xEDos gratuitos a domicilio a cualquier parte del pa\xEDs v\xEDa Cargo Expreso!"
        },
        {
          "id": "rule-horarios-agencias",
          "name": "Horarios de Entrega y Agencias Cargo Expreso",
          "type": "static",
          "category": "Env\xEDos",
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
          "response": "\u{1F69A} **Horarios y Agencias:** El repartidor de Cargo Expreso se pondr\xE1 en contacto contigo por llamada telef\xF3nica para coordinar el horario de entrega en tu domicilio (Lunes a Viernes de 8am a 5pm, S\xE1bados medio d\xEDa hasta las 12pm). Si necesitas horario espec\xEDfico, puedes solicitar retiro en cualquier oficina o agencia de Cargo Expreso de tu ciudad."
        }
      ],
      synonyms: {
        precio: ["presio", "rebaja", "cuanto cuesta", "cuanto vale", "costo", "valor", "cotizacion", "precio final", "tarifa", "descuento"],
        stock: ["disponible", "disponibilidad", "existencia", "inventario", "unidades", "quedan", "hay", "tienen", "piezas", "existencias"],
        dimensiones: [
          "dimenciones",
          "dimencion",
          "dimension",
          "dimensiones",
          "medidas",
          "medida",
          "mide",
          "miden",
          "medir",
          "cuanto mide",
          "cuanto miden",
          "tamano",
          "tama\xF1o",
          "talla",
          "tallas",
          "alto",
          "altura",
          "ancho",
          "anchura",
          "largo",
          "longitud",
          "profundidad",
          "fondo",
          "centimetros",
          "metros",
          "cm",
          "mts"
        ],
        peso: ["cuanto aguanta", "cuanto soporta", "resistencia", "capacidad", "soporta", "kilos", "libras", "peso maximo", "carga"],
        fotos: ["fotos reales", "imagenes", "fotografias", "galeria", "mostrar fotos", "ver", "foto", "ver catalogo con fotos"],
        envio: ["entrega", "despacho", "flete", "cargo expreso", "encomienda", "paqueteria", "domicilio", "reparto"],
        pago: ["efectivo", "transferencia", "tarjeta", "contra entrega", "deposito", "forma de pago", "metodo de pago", "cuotas"],
        asesor: ["humano", "persona", "operador", "atencion al cliente", "vendedor", "agente", "ejecutivo", "alguien real"],
        garantia: ["garant\xEDa", "seguro", "defecto", "falla", "cobertura", "reclamo", "garantizado"],
        horario: ["horarios", "a que hora abren", "cuando atienden", "atencion", "horario de atencion", "abierto"],
        factura: ["facturacion", "rtn", "cai", "fiscal", "comprobante", "recibo"],
        colores: [
          "color",
          "colores",
          "tono",
          "tonos",
          "acabado",
          "acabados",
          "presentacion",
          "presentaciones",
          "en que color viene",
          "en que colores viene",
          "que colores hay",
          "que colores tienen",
          "otros colores",
          "mas colores",
          "otro color",
          "blanco",
          "negro",
          "cafe",
          "gris",
          "rosa",
          "marron",
          "inox",
          "madera"
        ],
        materiales: [
          "material",
          "materiales",
          "de que material es",
          "de que esta hecho",
          "armado",
          "armada",
          "desarmado",
          "desarmada",
          "herramientas",
          "llaves",
          "tornillos",
          "manual",
          "facil de armar",
          "viene armado",
          "viene armada"
        ]
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
          body: "Hola, tenemos la Silla Gamer Rom CA Negro/Negro. \xBFTe interesa saber m\xE1s?",
          sku: "SKM-955-CA-NE",
          description: "Anuncio de Meta Ads (Facebook/Instagram) - Click to WhatsApp"
        },
        {
          id: "camp-fb-post-estante",
          platform: "facebook",
          channel: "Facebook Post Org\xE1nico",
          type: "post",
          sourceId: "196jarUnqz",
          url: "https://www.facebook.com/share/p/196jarUnqz/?mibextid=wwXIfr",
          headline: "Publicaci\xF3n: Estanter\xEDa de Metal y Madera 120x30x180cm",
          body: "\xA1Nuevo ingreso! Estanter\xEDa 120x30x180 cm pino y metal en oferta especial.",
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
          description: "Campa\xF1a Instagram Reels - Click to WhatsApp"
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
          dimensions: "Tallas 36\u201344",
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
          dimensions: "Tallas 38\u201343",
          weightLimit: "Cuero genuino, suela todo terreno",
          keywords: ["botas", "montana", "cuero", "calzado", "waterproof", "outdoor"],
          images: [
            "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=900&q=85"
          ]
        },
        {
          id: "prod-c3",
          sku: "SAN-03",
          name: "Sandalias Classic Comfort Anat\xF3micas",
          regularPrice: 650,
          salePrice: 500,
          stock: 0,
          dimensions: "Tallas 35\u201341",
          weightLimit: "Planta ortop\xE9dica ultra liviana",
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
          dimensions: "Tallas 39\u201344",
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
          dimensions: "Tallas 37\u201345",
          weightLimit: "C\xE1mara de aire y malla transpirable",
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
          dimensions: "Tallas 35\u201340, Tac\xF3n 7 cm",
          weightLimit: "Acabado sat\xEDn mate, plantilla confort",
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
          dimensions: "Tallas 36\u201343",
          weightLimit: "Lona reforzada, el\xE1sticos laterales",
          keywords: ["casual", "slip-on", "lona", "zapatos comodos", "diario"],
          images: [
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=85"
          ]
        },
        {
          id: "prod-c8",
          sku: "BOT-08",
          name: "Botines Chelsea Gamuza Caf\xE9",
          regularPrice: 1650,
          salePrice: 1450,
          stock: 0,
          dimensions: "Tallas 39\u201344",
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
          responseInStock: "\xA1S\xED, tenemos existencias! Del calzado SKU **{sku}** ({name}) nos quedan **{stock} pares** a L.{salePrice}. \xBFQu\xE9 talla necesitas?",
          responseOutOfStock: "El modelo **{name}** (SKU: {sku}) est\xE1 temporalmente **agotado**. Puedes consultar otros modelos activos escribiendo *'ver cat\xE1logo'*.",
          responseNotFound: "No encontramos ning\xFAn calzado con el SKU **{sku}**. Escribe *'ver cat\xE1logo'* para ver la lista completa."
        },
        {
          id: "rule-catalogo-c",
          name: "Ver Cat\xE1logo de Calzado",
          type: "static",
          category: "Cat\xE1logo",
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
          response: "Estos son los modelos disponibles en nuestra colecci\xF3n:",
          action: "show_catalog"
        },
        {
          id: "rule-envios-c",
          name: "Env\xEDos y Entregas Nacionales",
          type: "static",
          category: "Env\xEDos",
          enabled: true,
          trainingPhrases: [
            "envios a domicilio",
            "cuanto tarda la entrega",
            "tiempo de entrega",
            "hacen envios",
            "como me llega el paquete"
          ],
          response: "Env\xEDos express en 24 a 48 horas a las principales ciudades de Honduras con Cargo Expreso. Flete gratis en compras de 2 o m\xE1s pares."
        },
        {
          id: "rule-horarios-agencias-c",
          name: "Horarios de Entrega y Retiro en Agencias Cargo Expreso",
          type: "static",
          category: "Env\xEDos",
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
          response: "\u{1F69A} **Horarios de Entrega con Cargo Expreso:**\n\n\u2022 **A domicilio:** De Lunes a Viernes de 8:00 AM a 5:00 PM, y **S\xE1bados medio d\xEDa** (hasta las 12:00 PM).\n\u2022 **Dependencia de la agencia:** Las rutas dependen de Cargo Expreso, por lo que **no depende de nosotros asegurar una hora exacta o d\xEDa fijo en tiempo y forma**.\n\n\u{1F4A1} **Retiro en Agencia:** Si necesitas retirar a tu propio horario, te recomendamos enviarlo para **retiro en la agencia u oficina de Cargo Expreso m\xE1s cercana**, donde puedes recogerlo cuando mejor te convenga (S\xE1bados medio d\xEDa)."
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
          response: "\xA1S\xED! Aceptamos transferencia bancaria a nuestras cuentas: BAC Credomatic (Cheques: 742-108-951), Ficohsa (2000-098-432) y Atl\xE1ntida (110-045-892). Tambi\xE9n puedes pagar en efectivo contra entrega."
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
          response: "\xA1Pagas hasta que lo tienes en tus manos! Aceptamos efectivo contra entrega con el repartidor o transferencia previa."
        },
        {
          id: "rule-tallas-c",
          name: "Gu\xEDa de Tallas y Cambios de Talla",
          type: "static",
          category: "Pol\xEDticas",
          enabled: true,
          trainingPhrases: [
            "que pasa si no me queda la talla",
            "cambio por talla",
            "guia de tallas",
            "vienen a la medida",
            "como saber mi talla"
          ],
          response: "Nuestros modelos vienen con horma est\xE1ndar normal. Si al prob\xE1rtelos no te quedan perfectos, te cambiamos la talla sin costo adicional de flete."
        },
        {
          id: "rule-garantia-c",
          name: "Garant\xEDa de Calzado",
          type: "static",
          category: "Pol\xEDticas",
          enabled: true,
          trainingPhrases: [
            "tienen garantia los zapatos",
            "si se despegan",
            "cuanto tiempo de garantia",
            "garantia"
          ],
          response: "Ofrecemos 30 d\xEDas de garant\xEDa total por despegue de suela, costuras o defectos de fabricaci\xF3n."
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
          response: "Nuestros precios ya tienen descuento directo de f\xE1brica para ofrecer la mejor relaci\xF3n calidad-precio. Si llevas 3 o m\xE1s pares, consulta con un asesor para precio de paquete."
        }
      ],
      synonyms: {
        precio: ["presio", "rebaja", "cuanto cuesta", "valor", "costo", "oferta", "precio final"],
        stock: ["disponible", "disponibilidad", "existencia", "pares", "quedan", "hay", "tienen", "inventario"],
        dimensiones: [
          "dimenciones",
          "dimencion",
          "dimension",
          "dimensiones",
          "talla",
          "tallas",
          "medidas",
          "medida",
          "tamano",
          "tama\xF1o",
          "numero",
          "horma",
          "mide",
          "miden",
          "cuanto mide",
          "cuanto miden"
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

  // js/storage-facade.js?v=5
  var clone = (value) => JSON.parse(JSON.stringify(value));
  function safeUuid() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "id-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
  }
  var StorageFacade = class {
    static read() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    static initialize() {
      const data = this.read();
      const isValidV5 = data && data.tenants && Object.values(data.tenants).every((t) => Array.isArray(t.products) && t.products.length >= 10 && t.products.some((p) => p.sku === "SKM-955-CA-NE") && t.synonyms && t.synonyms.colores);
      if (!isValidV5) {
        const tenants = Object.fromEntries(TENANTS.map((t) => [t.id, clone(t)]));
        const initialOrders = [
          { tenantId: "smak", name: "Mar\xEDa Fernanda L\xF3pez", address: "Col. Palmira, Tegucigalpa", phone: "+504 9876-1204", sku: "SKM-955-CA-NE", daysAgo: 0, location: { lat: 14.1025, lng: -87.195, mapUrl: "https://www.google.com/maps?q=14.1025,-87.1950", address: "Col. Palmira, Tegucigalpa" } },
          { tenantId: "smak", name: "Carlos Mendoza", address: "Residencial Las Uvas, Comayag\xFCela", phone: "+504 9452-6810", sku: "SKM-959-CA-NE", daysAgo: 1, location: { lat: 14.048, lng: -87.218, mapUrl: "https://www.google.com/maps?q=14.0480,-87.2180", address: "Residencial Las Uvas, Comayag\xFCela" } },
          { tenantId: "smak", name: "Andrea Pineda", address: "Barrio El Centro, San Pedro Sula", phone: "+504 9981-3472", sku: "ZGS-946-120x30x180", daysAgo: 2, location: { lat: 15.503, lng: -88.026, mapUrl: "https://www.google.com/maps?q=15.5030,-88.0260", address: "Barrio El Centro, San Pedro Sula" } },
          { tenantId: "smak", name: "Roberto C\xE1lix", address: "Col. El Toronjal, La Ceiba", phone: "+504 9711-4402", sku: "SKM-953-NE-MP", daysAgo: 3 },
          { tenantId: "smak", name: "Elena Ramos", address: "Lomas del Guijarro, Tegucigalpa", phone: "+504 8820-9150", sku: "ZGM-032-NENE", daysAgo: 4, location: { lat: 14.098, lng: -87.185, mapUrl: "https://www.google.com/maps?q=14.0980,-87.1850", address: "Lomas del Guijarro, Tegucigalpa" } },
          { tenantId: "smak", name: "David Banegas", address: "Col. Los \xC1lamos, San Pedro Sula", phone: "+504 9500-3321", sku: "ZGS-943-120x60x75", daysAgo: 5 },
          { tenantId: "calzado", name: "Jos\xE9 David Rivera", address: "Col. Trejo, San Pedro Sula", phone: "+504 9630-1175", sku: "TEN-01", daysAgo: 0, location: { lat: 15.498, lng: -88.039, mapUrl: "https://www.google.com/maps?q=15.4980,-88.0390", address: "Col. Trejo, San Pedro Sula" } },
          { tenantId: "calzado", name: "Sof\xEDa Castellanos", address: "Barrio R\xEDo de Piedras, San Pedro Sula", phone: "+504 9714-8206", sku: "BOT-02", daysAgo: 1 },
          { tenantId: "calzado", name: "Marlon Aguilar", address: "Col. Kennedy, Tegucigalpa", phone: "+504 9460-7719", sku: "MOC-04", daysAgo: 2, location: { lat: 14.058, lng: -87.185, mapUrl: "https://www.google.com/maps?q=14.0580,-87.1850", address: "Col. Kennedy, Tegucigalpa" } },
          { tenantId: "calzado", name: "Daniela Flores", address: "Res. Plaza, Tegucigalpa", phone: "+504 8890-5316", sku: "DEP-05", daysAgo: 3, location: { lat: 14.072, lng: -87.172, mapUrl: "https://www.google.com/maps?q=14.0720,-87.1720", address: "Res. Plaza, Tegucigalpa" } },
          { tenantId: "calzado", name: "Gabriela Santos", address: "Col. Miramar, La Ceiba", phone: "+504 9811-6624", sku: "TAC-06", daysAgo: 4 },
          { tenantId: "calzado", name: "Cristian Orellana", address: "Barrio El Centro, Choluteca", phone: "+504 9322-1088", sku: "CAS-07", daysAgo: 5 }
        ];
        const orders = initialOrders.map((sample, idx) => {
          const tenant = tenants[sample.tenantId];
          const prod = tenant?.products?.find((p) => p.sku === sample.sku) || tenant?.products?.[0];
          const prefix = sample.tenantId === "calzado" ? "CALZ-ORD" : "SMAK-ORD";
          const orderNum = `${prefix}-${String(1001 + idx).padStart(4, "0")}`;
          const quantity = sample.sku === "SKM-955-CA-NE" ? 1 : sample.sku === "SKM-953-NE-MP" ? 4 : 1;
          const quantityLabel = sample.sku === "SKM-953-NE-MP" ? "4 taburetes" : sample.sku === "SKM-955-CA-NE" ? "1 silla gamer" : "1 unidad";
          const requiresInvoice = idx === 0 || idx === 3;
          const trackingNumber = idx === 1 ? "CAEX-HN-948210" : idx > 2 ? "CAEX-HN-881290" : null;
          const status = idx === 1 ? "en_camino" : idx > 2 ? "entregado" : "pendiente";
          const createdIso = new Date(Date.now() - sample.daysAgo * 864e5).toISOString();
          return {
            id: safeUuid(),
            tenantId: sample.tenantId,
            orderNumber: orderNum,
            name: sample.name,
            address: sample.address,
            phone: sample.phone,
            productName: prod ? `${prod.name} (${prod.sku})` : "Producto",
            sku: prod ? prod.sku : "",
            quantity,
            quantityLabel,
            requiresInvoice,
            rtn: requiresInvoice ? "08011985123456" : null,
            businessName: requiresInvoice ? sample.name + " S. de R.L." : null,
            status,
            trackingNumber,
            trackingCarrier: "Cargo Expreso",
            total: (prod ? Number(prod.salePrice) : 0) * quantity,
            location: sample.location || null,
            isDemo: true,
            createdAt: createdIso,
            audit: {
              ip: "190.92.112.45 (Tegucigalpa, HN)",
              userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0",
              source: sample.location ? "whatsapp_bot" : "landing_page_widget",
              createdAt: createdIso,
              history: [
                {
                  action: "creacion_pedido",
                  status,
                  timestamp: createdIso,
                  note: `Pedido ${orderNum} creado. Factura: ${requiresInvoice ? "S\xED (con RTN)" : "No"}.`
                }
              ]
            }
          };
        });
        this.write({ activeTenantId: "smak", tenants, orders });
      } else {
        let modified = false;
        TENANTS.forEach((defT) => {
          const curTenant = data.tenants[defT.id];
          if (curTenant) {
            if (!Array.isArray(curTenant.campaigns) || !curTenant.campaigns.length) {
              curTenant.campaigns = clone(defT.campaigns || []);
              modified = true;
            }
            (defT.products || []).forEach((p) => {
              if (!curTenant.products.some((cp) => cp.sku === p.sku)) {
                curTenant.products.push(clone(p));
                modified = true;
              }
            });
            (defT.rules || []).forEach((defR) => {
              const curR = curTenant.rules.find((r) => r.id === defR.id);
              if (curR) {
                if (defR.id.includes("transferencia") || defR.id.includes("pagos") || defR.id.includes("tarjetas")) {
                  curR.response = defR.response;
                  curR.trainingPhrases = clone(defR.trainingPhrases);
                  modified = true;
                } else {
                  (defR.trainingPhrases || []).forEach((phrase) => {
                    if (!curR.trainingPhrases.includes(phrase)) {
                      curR.trainingPhrases.push(phrase);
                      modified = true;
                    }
                  });
                }
              } else {
                curTenant.rules.push(clone(defR));
                modified = true;
              }
            });
            if (defT.synonyms) {
              if (!curTenant.synonyms) {
                curTenant.synonyms = clone(defT.synonyms);
                modified = true;
              } else {
                Object.keys(defT.synonyms).forEach((k) => {
                  if (!curTenant.synonyms[k]) {
                    curTenant.synonyms[k] = clone(defT.synonyms[k]);
                    modified = true;
                  } else if (k === "dimensiones") {
                    (defT.synonyms[k] || []).forEach((word) => {
                      if (!curTenant.synonyms[k].includes(word)) {
                        curTenant.synonyms[k].push(word);
                        modified = true;
                      }
                    });
                  }
                });
              }
            }
          }
        });
        if (Array.isArray(data.orders)) {
          let orderCounter = 1e3 + data.orders.length;
          data.orders.forEach((o, idx) => {
            if (!o.orderNumber) {
              const prefix = o.tenantId === "calzado" ? "CALZ-ORD" : "SMAK-ORD";
              o.orderNumber = `${prefix}-${String(orderCounter - idx).padStart(4, "0")}`;
              modified = true;
            }
            if (o.quantity === void 0) {
              o.quantity = 1;
              o.quantityLabel = "1 unidad";
              modified = true;
            }
            if (o.requiresInvoice === void 0) {
              o.requiresInvoice = idx % 3 === 0;
              o.rtn = o.requiresInvoice ? "08011990" + String(1e5 + idx) : null;
              o.businessName = o.requiresInvoice ? o.name + " S.A." : null;
              modified = true;
            }
            if (!o.status) {
              o.status = o.trackingNumber ? "en_camino" : "pendiente";
              modified = true;
            }
            if (!o.audit) {
              o.audit = {
                ip: "190.92.112.45 (Tegucigalpa, HN)",
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0",
                source: o.source || (o.location ? "whatsapp_bot" : "landing_page_widget"),
                createdAt: o.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
                history: [
                  {
                    action: "creacion_pedido",
                    status: o.status,
                    timestamp: o.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
                    note: `Pedido ${o.orderNumber} registrado en el sistema.`
                  }
                ]
              };
              modified = true;
            }
          });
        }
        if (modified) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      }
    }
    static write(state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent("smakbot:data-changed", { detail: state }));
    }
    static getState() {
      this.initialize();
      return this.read();
    }
    static getTenants() {
      return Object.values(this.getState().tenants);
    }
    static getActiveTenantId() {
      return this.getState().activeTenantId || "smak";
    }
    static setActiveTenantId(id) {
      const state = this.getState();
      if (!state.tenants[id]) return;
      state.activeTenantId = id;
      this.write(state);
    }
    static getTenant(id = this.getActiveTenantId()) {
      const tenant = this.getState().tenants[id] || this.getState().tenants["smak"];
      if (tenant && !tenant.product && tenant.products?.length) {
        tenant.product = tenant.products[0];
      }
      return tenant;
    }
    // ---- PRODUCT MANAGEMENT (MULTI-SKU) ----
    static getProducts(id = this.getActiveTenantId()) {
      const tenant = this.getTenant(id);
      return clone(tenant.products || []);
    }
    static getProductBySku(sku, id = this.getActiveTenantId()) {
      const products = this.getProducts(id);
      const cleanSku = String(sku || "").trim().toLowerCase();
      return products.find((p) => String(p.sku || "").trim().toLowerCase() === cleanSku) || null;
    }
    static saveProduct(product, id = this.getActiveTenantId()) {
      const state = this.getState();
      const tenant = state.tenants[id];
      if (!tenant) return;
      if (!tenant.products) tenant.products = [];
      const p = clone(product);
      if (!p.id) p.id = "prod-" + safeUuid().slice(0, 8);
      p.sku = String(p.sku || "").trim().toUpperCase();
      const index = tenant.products.findIndex((item) => item.id === p.id || p.sku && item.sku?.toUpperCase() === p.sku);
      if (index >= 0) {
        tenant.products[index] = p;
      } else {
        tenant.products.push(p);
      }
      this.write(state);
      return p;
    }
    static deleteProduct(productId, id = this.getActiveTenantId()) {
      const state = this.getState();
      const tenant = state.tenants[id];
      if (!tenant || !tenant.products) return false;
      tenant.products = tenant.products.filter((p) => p.id !== productId && p.sku !== productId);
      this.write(state);
      return true;
    }
    // ---- DYNAMIC RULES & Q&A MANAGEMENT ----
    static getRules(id = this.getActiveTenantId()) {
      const tenant = this.getTenant(id);
      return clone(tenant.rules || []);
    }
    static saveRule(rule, id = this.getActiveTenantId()) {
      const state = this.getState();
      const tenant = state.tenants[id];
      if (!tenant) return;
      if (!tenant.rules) tenant.rules = [];
      const r = clone(rule);
      if (!r.id) r.id = "rule-" + safeUuid().slice(0, 8);
      if (r.enabled === void 0) r.enabled = true;
      const index = tenant.rules.findIndex((item) => item.id === r.id);
      if (index >= 0) {
        tenant.rules[index] = r;
      } else {
        tenant.rules.unshift(r);
      }
      this.write(state);
      return r;
    }
    static toggleRule(ruleId, id = this.getActiveTenantId()) {
      const state = this.getState();
      const tenant = state.tenants[id];
      if (!tenant || !tenant.rules) return;
      const rule = tenant.rules.find((r) => r.id === ruleId);
      if (rule) {
        rule.enabled = !rule.enabled;
        this.write(state);
      }
    }
    static deleteRule(ruleId, id = this.getActiveTenantId()) {
      const state = this.getState();
      const tenant = state.tenants[id];
      if (!tenant || !tenant.rules) return false;
      tenant.rules = tenant.rules.filter((r) => r.id !== ruleId);
      this.write(state);
      return true;
    }
    // ---- SYNONYMS MANAGEMENT (DYNAMIC GROUPS) ----
    static getSynonyms(id = this.getActiveTenantId()) {
      const tenant = this.getTenant(id);
      return clone(tenant.synonyms || {});
    }
    static saveSynonyms(synonyms, id = this.getActiveTenantId()) {
      const state = this.getState();
      if (!state.tenants[id]) return;
      state.tenants[id].synonyms = clone(synonyms);
      this.write(state);
    }
    static saveSynonymGroup(key, words, id = this.getActiveTenantId()) {
      const state = this.getState();
      if (!state.tenants[id]) return;
      if (!state.tenants[id].synonyms) state.tenants[id].synonyms = {};
      const cleanKey = String(key || "").trim().toLowerCase();
      const list = Array.isArray(words) ? words : String(words || "").split(",").map((w) => w.trim()).filter(Boolean);
      state.tenants[id].synonyms[cleanKey] = list;
      this.write(state);
    }
    static deleteSynonymGroup(key, id = this.getActiveTenantId()) {
      const state = this.getState();
      if (!state.tenants[id] || !state.tenants[id].synonyms) return;
      delete state.tenants[id].synonyms[key];
      this.write(state);
    }
    // ---- SOCIAL CAMPAIGNS & REFERRAL MAPPING ----
    static getCampaigns(id = this.getActiveTenantId()) {
      const tenant = this.getTenant(id);
      return clone(tenant.campaigns || []);
    }
    static saveCampaign(campaign, id = this.getActiveTenantId()) {
      const state = this.getState();
      const tenant = state.tenants[id];
      if (!tenant) return;
      if (!tenant.campaigns) tenant.campaigns = [];
      const c = clone(campaign);
      if (!c.id) c.id = "camp-" + safeUuid().slice(0, 8);
      c.sku = String(c.sku || "").trim().toUpperCase();
      const index = tenant.campaigns.findIndex((item) => item.id === c.id);
      if (index >= 0) {
        tenant.campaigns[index] = c;
      } else {
        tenant.campaigns.unshift(c);
      }
      this.write(state);
      return c;
    }
    static deleteCampaign(campaignId, id = this.getActiveTenantId()) {
      const state = this.getState();
      const tenant = state.tenants[id];
      if (!tenant || !tenant.campaigns) return false;
      tenant.campaigns = tenant.campaigns.filter((c) => c.id !== campaignId);
      this.write(state);
      return true;
    }
    static findCampaign(query, id = this.getActiveTenantId()) {
      const campaigns = this.getCampaigns(id);
      const q = String(query || "").trim().toLowerCase();
      if (!q) return null;
      return campaigns.find((c) => {
        const cUrl = String(c.url || "").toLowerCase();
        const cSourceId = String(c.sourceId || "").toLowerCase();
        return cUrl && q.includes(cUrl) || cUrl && cUrl.includes(q) || cSourceId && q.includes(cSourceId) || cSourceId && cSourceId === q;
      }) || null;
    }
    // ---- ORDERS ----
    static getOrders(id = this.getActiveTenantId()) {
      const orders = this.getState().orders || [];
      return id ? orders.filter((o) => o.tenantId === id) : orders;
    }
    static getOrder(orderId) {
      const state = this.getState();
      return (state.orders || []).find((o) => o.id === orderId || o.orderNumber === orderId) || null;
    }
    static getOrderByNumber(orderNumber) {
      if (!orderNumber) return null;
      const cleanNum = String(orderNumber).trim().toUpperCase();
      const state = this.getState();
      return (state.orders || []).find(
        (o) => o.orderNumber && o.orderNumber.toUpperCase() === cleanNum || o.trackingNumber && o.trackingNumber.toUpperCase() === cleanNum || o.id && o.id.toUpperCase() === cleanNum
      ) || null;
    }
    static generateOrderNumber(tenantId = this.getActiveTenantId()) {
      const state = this.getState();
      const orders = state.orders || [];
      const prefix = tenantId === "calzado" ? "CALZ-ORD" : "SMAK-ORD";
      const nextNum = 1001 + orders.length;
      return `${prefix}-${String(nextNum).padStart(4, "0")}`;
    }
    static saveOrder(order) {
      const state = this.getState();
      const tenantId = order.tenantId || state.activeTenantId || "smak";
      const orderNumber = order.orderNumber || this.generateOrderNumber(tenantId);
      const quantity = Number(order.quantity) > 0 ? Number(order.quantity) : 1;
      const quantityLabel = order.quantityLabel || `${quantity} ${quantity === 1 ? "unidad" : "unidades"}`;
      const requiresInvoice = Boolean(order.requiresInvoice);
      const rtn = requiresInvoice ? order.rtn || "08011990123456" : null;
      const businessName = requiresInvoice ? order.businessName || order.name : null;
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const newOrder = {
        ...clone(order),
        id: order.id || safeUuid(),
        tenantId,
        orderNumber,
        quantity,
        quantityLabel,
        requiresInvoice,
        rtn,
        businessName,
        status: order.status || (order.trackingNumber ? "en_camino" : "pendiente"),
        trackingNumber: order.trackingNumber || null,
        trackingCarrier: order.trackingCarrier || "Cargo Expreso",
        createdAt: order.createdAt || nowIso,
        audit: {
          ip: order.audit?.ip || "190.92.112.45 (Tegucigalpa, HN)",
          userAgent: order.audit?.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "Web / Simulator"),
          source: order.source || "whatsapp_bot",
          createdAt: nowIso,
          history: [
            {
              action: "creacion_pedido",
              status: "pendiente",
              timestamp: nowIso,
              note: `Pedido ${orderNumber} confirmado (${quantityLabel}). Facturaci\xF3n: ${requiresInvoice ? "S\xED (Factura con RTN)" : "No (Consumidor Final)"}.`
            }
          ]
        }
      };
      if (!Array.isArray(state.orders)) {
        state.orders = [];
      }
      state.orders.unshift(newOrder);
      this.write(state);
      return newOrder;
    }
    static updateOrderTracking(orderId, trackingNumber, carrier = "Cargo Expreso", notes = "") {
      const state = this.getState();
      const order = (state.orders || []).find((o) => o.id === orderId || o.orderNumber === orderId);
      if (!order) return null;
      const prevTracking = order.trackingNumber;
      order.trackingNumber = String(trackingNumber).trim().toUpperCase();
      order.trackingCarrier = carrier || "Cargo Expreso";
      order.status = "en_camino";
      if (!order.audit) {
        order.audit = { history: [] };
      }
      if (!Array.isArray(order.audit.history)) {
        order.audit.history = [];
      }
      order.audit.history.push({
        action: prevTracking ? "actualizacion_guia_rastreo" : "asignacion_guia_rastreo",
        status: "en_camino",
        trackingNumber: order.trackingNumber,
        carrier: order.trackingCarrier,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        note: notes || `Gu\xEDa asignada: ${order.trackingNumber} (${order.trackingCarrier}). Notificaci\xF3n al cliente preparada.`
      });
      this.write(state);
      const cleanPhone = String(order.phone || "").replace(/\D/g, "");
      const fullPhone = cleanPhone.startsWith("504") ? cleanPhone : "504" + cleanPhone;
      const piezasTxt = order.quantityLabel || `${order.quantity || 1} unidades`;
      const message = `\xA1Hola ${order.name}! \u{1F44B} Te confirmamos que tu pedido *${order.orderNumber}* (${piezasTxt} \xB7 ${order.productName}) ya va en camino a tu direcci\xF3n (${order.address}). \u{1F69A}\u{1F4E6}

Tu n\xFAmero de gu\xEDa de rastreo es: *${order.trackingNumber}* (${order.trackingCarrier}).
Monto total a pagar en efectivo contra entrega: *L.${Number(order.total).toLocaleString("es-HN")}*.
${order.requiresInvoice ? `\u{1F9FE} Tu factura con RTN (${order.rtn}) va adjunta en el paquete.
` : ""}Recuerda tener listo el pago al momento de recibir. Si tienes cualquier consulta, estamos a tu orden. \xA1Gracias por confiar en SMAK Honduras! \u2728`;
      const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
      return {
        order,
        whatsappUrl,
        message
      };
    }
    static seedDemoOrders() {
      const state = this.getState();
      const extraSamples = [
        { tenantId: "smak", name: "Karla Barahona", address: "Col. Trejo, San Pedro Sula", phone: "+504 9812-4011", sku: "SKM-955-CA-NE", quantity: 2, quantityLabel: "2 sillas gamer", requiresInvoice: true, rtn: "08011989004512", businessName: "Barahona Design Studio", location: { lat: 15.498, lng: -88.039, mapUrl: "https://www.google.com/maps?q=15.4980,-88.0390", address: "Col. Trejo, San Pedro Sula" } },
        { tenantId: "smak", name: "Javier Moncada", address: "Res. El Molin\xF3n, Tegucigalpa", phone: "+504 9740-8822", sku: "ZGS-943-120x60x75", quantity: 1, quantityLabel: "1 escritorio", requiresInvoice: false, trackingNumber: "CAEX-HN-948210", location: { lat: 14.09, lng: -87.18, mapUrl: "https://www.google.com/maps?q=14.0900,-87.1800", address: "Res. El Molin\xF3n, Tegucigalpa" } },
        { tenantId: "calzado", name: "Lorena Varela", address: "Barrio Medina, San Pedro Sula", phone: "+504 9600-5541", sku: "TEN-01", quantity: 1, quantityLabel: "1 par", requiresInvoice: false, location: { lat: 15.501, lng: -88.025, mapUrl: "https://www.google.com/maps?q=15.5010,-88.0250", address: "Barrio Medina, San Pedro Sula" } }
      ];
      let count = 0;
      for (const sample of extraSamples) {
        const tenant = state.tenants[sample.tenantId];
        const prod = tenant?.products?.find((p) => p.sku === sample.sku) || tenant?.products?.[0];
        const quantity = sample.quantity || 1;
        const total = prod ? Number(prod.salePrice) * quantity : 0;
        this.saveOrder({
          tenantId: sample.tenantId,
          name: sample.name,
          address: sample.address,
          phone: sample.phone,
          productName: prod ? `${prod.name} (${prod.sku})` : "Producto",
          sku: prod ? prod.sku : "",
          quantity,
          quantityLabel: sample.quantityLabel || `${quantity} unidades`,
          requiresInvoice: sample.requiresInvoice || false,
          rtn: sample.rtn || null,
          businessName: sample.businessName || null,
          trackingNumber: sample.trackingNumber || null,
          status: sample.trackingNumber ? "en_camino" : "pendiente",
          total,
          location: sample.location || null,
          isDemo: true
        });
        count++;
      }
      return count;
    }
    static resetToDefaults() {
      localStorage.removeItem(STORAGE_KEY);
      this.initialize();
      window.dispatchEvent(new CustomEvent("smakbot:data-changed"));
    }
  };
  StorageFacade.initialize();

  // js/location-service.js?v=5
  var LocationService = class {
    /**
     * Catálogo de ubicaciones predefinidas para pruebas en Honduras
     */
    static PRESETS = [
      {
        id: "teg_palmira",
        name: "Colonia Palmira, Tegucigalpa",
        city: "Tegucigalpa",
        department: "Francisco Moraz\xE1n",
        address: "Colonia Palmira, Ave. Rep\xFAblica de Chile, cerca de Embajada de M\xE9xico",
        lat: 14.1025,
        lng: -87.195,
        zone: "Urbana Central"
      },
      {
        id: "sps_andes",
        name: "Barrio Los Andes, San Pedro Sula",
        city: "San Pedro Sula",
        department: "Cort\xE9s",
        address: "Barrio Los Andes, 7ma Calle NO, entre 13 y 14 Avenida",
        lat: 15.512,
        lng: -88.028,
        zone: "Sector Noroeste"
      },
      {
        id: "teg_plaza",
        name: "Residencial Plaza, Tegucigalpa",
        city: "Tegucigalpa",
        department: "Francisco Moraz\xE1n",
        address: "Residencial Plaza, 2da Entrada, Bloque 14, Casa 25",
        lat: 14.072,
        lng: -87.172,
        zone: "Suroriente"
      },
      {
        id: "sps_trejo",
        name: "Colonia Trejo, San Pedro Sula",
        city: "San Pedro Sula",
        department: "Cort\xE9s",
        address: "Colonia Trejo, 10 Calle SO, Circunvalaci\xF3n",
        lat: 15.498,
        lng: -88.039,
        zone: "Sector Suroeste"
      },
      {
        id: "teg_kennedy",
        name: "Colonia Kennedy, Tegucigalpa",
        city: "Tegucigalpa",
        department: "Francisco Moraz\xE1n",
        address: "Colonia Kennedy, 1ra Entrada, cerca de Mercado Jacaleapa",
        lat: 14.058,
        lng: -87.185,
        zone: "Sector Kennedy"
      }
    ];
    /**
     * Genera el enlace de navegación directa a Google Maps
     */
    static getGoogleMapsUrl(lat, lng) {
      return `https://www.google.com/maps?q=${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;
    }
    /**
     * Genera un mapa estático o URL de imagen de previsualización
     */
    static getMapPreviewUrl(lat, lng) {
      return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=15&l=map&size=400,180&pt=${lng},${lat},pm2rdm`;
    }
    /**
     * Detecta si un texto contiene coordenadas o un enlace de Google Maps
     * @param {string} text 
     * @returns {Object|null}
     */
    static parseLocationFromText(text) {
      if (!text) return null;
      const str = String(text).trim();
      const gmapsQMatch = str.match(/https?:\/\/(?:www\.)?(?:google\.com\/maps|maps\.google\.com)\/[^?\s]*\?[^#\s]*q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/i);
      if (gmapsQMatch) {
        const lat = parseFloat(gmapsQMatch[1]);
        const lng = parseFloat(gmapsQMatch[2]);
        return {
          lat,
          lng,
          name: `Ubicaci\xF3n GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          address: `Coordenadas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          mapUrl: this.getGoogleMapsUrl(lat, lng),
          source: "google_maps_link"
        };
      }
      const shortLinkMatch = str.match(/https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps)\/([a-zA-Z0-9_\-]+)/i);
      if (shortLinkMatch) {
        return {
          lat: 14.1025,
          // Fallback representativo para demo
          lng: -87.195,
          name: "Ubicaci\xF3n compartida v\xEDa Google Maps",
          address: "Enlace de Google Maps verificado para entrega",
          mapUrl: shortLinkMatch[0],
          source: "google_maps_short"
        };
      }
      const coordMatch = str.match(/([+-]?\d{1,2}\.\d{3,8})[\s,]+([+-]?\d{1,3}\.\d{3,8})/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
          return {
            lat,
            lng,
            name: `Ubicaci\xF3n GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            address: `Coordenadas exactas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            mapUrl: this.getGoogleMapsUrl(lat, lng),
            source: "coordinates"
          };
        }
      }
      const cleanStr = str.toLowerCase();
      for (const preset of this.PRESETS) {
        if (cleanStr.includes(preset.name.toLowerCase()) || cleanStr.includes(preset.id)) {
          return {
            ...preset,
            mapUrl: this.getGoogleMapsUrl(preset.lat, preset.lng),
            source: "preset"
          };
        }
      }
      return null;
    }
    /**
     * Geocodificación Inversa (Reverse Geocoding)
     * Traduce lat, lng a nombre de colonia, calle y ciudad usando OpenStreetMap Nominatim
     */
    static async reverseGeocode(lat, lng) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        const resp = await fetch(url, {
          headers: { "Accept-Language": "es" },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!resp.ok) throw new Error("Error en servidor geogr\xE1fico");
        const data = await resp.json();
        const addr = data.address || {};
        const neighbourhood = addr.neighbourhood || addr.suburb || addr.quarter || addr.residential || "";
        const road = addr.road || "";
        const city = addr.city || addr.town || addr.village || addr.county || "Tegucigalpa";
        const state = addr.state || "";
        let formatted = [road, neighbourhood, city, state].filter(Boolean).join(", ");
        if (!formatted) {
          formatted = data.display_name?.split(",").slice(0, 3).join(",") || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        }
        return {
          address: formatted,
          name: neighbourhood ? `${neighbourhood}, ${city}` : city || "Ubicaci\xF3n GPS",
          city,
          raw: data
        };
      } catch {
        return {
          address: `Coordenadas: ${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`,
          name: "Ubicaci\xF3n GPS de Entrega",
          city: "Honduras",
          raw: null
        };
      }
    }
    /**
     * Obtiene la posición GPS en vivo del dispositivo del navegador
     */
    static async getCurrentPosition() {
      if (!navigator.geolocation) {
        throw new Error("Tu navegador no soporta geolocalizaci\xF3n.");
      }
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const geoData = await this.reverseGeocode(lat, lng);
            resolve({
              lat,
              lng,
              accuracy: pos.coords.accuracy,
              name: geoData.name,
              address: geoData.address,
              city: geoData.city,
              mapUrl: this.getGoogleMapsUrl(lat, lng),
              source: "device_gps"
            });
          },
          (err) => {
            let msg = "No se pudo obtener la ubicaci\xF3n.";
            if (err.code === 1) msg = "Permiso de ubicaci\xF3n denegado en el navegador.";
            if (err.code === 2) msg = "Ubicaci\xF3n no disponible en este dispositivo.";
            if (err.code === 3) msg = "Tiempo de espera agotado al consultar GPS.";
            reject(new Error(msg));
          },
          { enableHighAccuracy: true, timeout: 8e3, maximumAge: 6e4 }
        );
      });
    }
  };

  // js/speech-service.js?v=5
  var SpeechService = class _SpeechService {
    static currentController = null;
    static voices = [];
    static isSupported() {
      return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    }
    static getVoices() {
      if (!this.isSupported()) return [];
      if (!this.voices.length) {
        this.voices = window.speechSynthesis.getVoices() || [];
      }
      return this.voices;
    }
    /**
     * Obtiene la mejor voz en español disponible en el navegador
     */
    static getBestSpanishVoice() {
      const voices = this.getVoices();
      if (!voices.length) return null;
      const naturalVoice = voices.find(
        (v) => v.lang.startsWith("es") && (v.name.toLowerCase().includes("natural") || v.name.toLowerCase().includes("sabina") || v.name.toLowerCase().includes("dalia") || v.name.toLowerCase().includes("jorge") || v.name.toLowerCase().includes("google espa\xF1ol") || v.name.toLowerCase().includes("mexico"))
      );
      if (naturalVoice) return naturalVoice;
      const anyEs = voices.find((v) => v.lang.toLowerCase().startsWith("es"));
      if (anyEs) return anyEs;
      return voices[0] || null;
    }
    /**
     * Limpia el texto de formato Markdown, emojis y abreviaturas para una locución natural
     */
    static cleanTextForSpeech(text) {
      if (!text) return "";
      let clean2 = String(text).replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1").replace(/(\*\*|\*|__|_)/g, "").replace(/L\.\s*([\d,]+)/g, "$1 lempiras").replace(/[#•\-—]/g, " ").replace(/\bSKU\b/gi, "c\xF3digo").replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").replace(/\s+/g, " ").trim();
      return clean2;
    }
    /**
     * Estima la duración de reproducción en segundos según cantidad de palabras
     */
    static estimateDuration(text, rate = 1) {
      const clean2 = this.cleanTextForSpeech(text);
      const words = clean2.split(/\s+/).filter(Boolean).length;
      const seconds = Math.max(2, Math.round(words / 2.3 / rate));
      return seconds;
    }
    /**
     * Genera alturas para visualizador de onda de audio (waveform) de WhatsApp
     */
    static generateWaveform(count = 28) {
      const bars = [];
      for (let i = 0; i < count; i++) {
        const val = 20 + Math.round(Math.abs(Math.sin(i * 0.45) * 60) + Math.abs(Math.cos(i * 0.9) * 20));
        bars.push(Math.min(100, Math.max(20, val)));
      }
      return bars;
    }
    /**
     * Reproduce el texto usando SpeechSynthesis con eventos y actualización de progreso
     */
    static speak(text, { onStart, onProgress, onEnd, onError, rate = 1 } = {}) {
      if (!this.isSupported()) {
        onError?.(new Error("Tu navegador no soporta s\xEDntesis de voz (SpeechSynthesis)."));
        return null;
      }
      this.stop();
      const cleanText = this.cleanTextForSpeech(text);
      if (!cleanText) {
        onEnd?.();
        return null;
      }
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "es-MX";
      utterance.rate = rate;
      utterance.pitch = 1;
      const voice = this.getBestSpanishVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || "es-MX";
      }
      const estDuration = this.estimateDuration(cleanText, rate);
      let startTime = 0;
      let progressTimer = null;
      let isPlaying = false;
      _SpeechService.activeUtterance = utterance;
      const startPlayback = () => {
        if (isPlaying) return;
        isPlaying = true;
        startTime = Date.now();
        onStart?.({ duration: estDuration });
        progressTimer = setInterval(() => {
          if (!isPlaying) return;
          const elapsed = (Date.now() - startTime) / 1e3;
          const percent = Math.min(100, Math.round(elapsed / estDuration * 100));
          onProgress?.({ elapsed: Math.min(estDuration, elapsed), percent, duration: estDuration });
          if (elapsed >= estDuration + 1) {
            clearInterval(progressTimer);
          }
        }, 100);
      };
      utterance.onstart = startPlayback;
      utterance.onend = () => {
        isPlaying = false;
        if (progressTimer) clearInterval(progressTimer);
        onProgress?.({ elapsed: estDuration, percent: 100, duration: estDuration });
        onEnd?.();
        _SpeechService.currentController = null;
        _SpeechService.activeUtterance = null;
      };
      utterance.onerror = (e) => {
        isPlaying = false;
        if (progressTimer) clearInterval(progressTimer);
        onError?.(e);
        _SpeechService.currentController = null;
        _SpeechService.activeUtterance = null;
      };
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
        setTimeout(() => {
          if (!isPlaying) startPlayback();
        }, 150);
      } catch (err) {
        if (progressTimer) clearInterval(progressTimer);
        onError?.(err);
        return null;
      }
      const controller = {
        utterance,
        duration: estDuration,
        pause() {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            isPlaying = false;
          }
        },
        resume() {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            isPlaying = true;
          }
        },
        stop() {
          isPlaying = false;
          if (progressTimer) clearInterval(progressTimer);
          window.speechSynthesis.cancel();
          _SpeechService.currentController = null;
          onEnd?.();
        },
        setRate(newRate) {
          this.stop();
          return _SpeechService.speak(text, { onStart, onProgress, onEnd, onError, rate: newRate });
        }
      };
      _SpeechService.currentController = controller;
      return controller;
    }
    static stop() {
      if (this.currentController) {
        this.currentController.stop();
        this.currentController = null;
      }
      if (this.isSupported() && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    }
  };
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      SpeechService.voices = window.speechSynthesis.getVoices() || [];
    };
  }

  // js/bot-engine.js?v=5
  var clean = (s) => String(s || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!.,:;()"'\\/]/g, " ").trim();
  var tokenize = (s) => clean(s).split(/\s+/).filter(Boolean);
  var STOP_WORDS = /* @__PURE__ */ new Set(["de", "la", "el", "los", "las", "un", "una", "unos", "unas", "es", "son", "lo", "en", "por", "que", "se", "me", "te", "le", "y", "o", "al", "del", "a", "con", "para", "como", "si", "su", "sus", "mi", "mis", "tu", "tus"]);
  function matchPhrase(cleanInput, inTokens, phrase) {
    const cPhrase = clean(phrase);
    if (!cPhrase) return false;
    if (cleanInput.includes(cPhrase)) return true;
    const phraseTokens = tokenize(cPhrase);
    if (!phraseTokens.length) return false;
    const substantivePhraseTokens = phraseTokens.filter((t) => !STOP_WORDS.has(t) && t.length > 2);
    const targetTokens = substantivePhraseTokens.length > 0 ? substantivePhraseTokens : phraseTokens;
    const matchedCount = targetTokens.filter((pt) => {
      return inTokens.some((it) => {
        if (it === pt) return true;
        if (it.length >= 4 && pt.length >= 4) {
          const rootLen = Math.min(it.length, pt.length) - 1;
          return it.slice(0, rootLen) === pt.slice(0, rootLen);
        }
        return false;
      });
    }).length;
    return matchedCount / targetTokens.length >= 0.75;
  }
  var BotEngine = class {
    constructor() {
      this.voicePreferred = false;
      this.human = false;
      this.checkout = null;
      this.selectedProduct = null;
    }
    reset() {
      this.voicePreferred = false;
      this.human = false;
      this.checkout = null;
      this.selectedProduct = null;
    }
    startCheckout(product = null, initialQty = 1) {
      const tenant = StorageFacade.getTenant();
      const targetProduct = product || this.selectedProduct || tenant.products?.[0] || { name: "Producto", salePrice: 0, sku: "" };
      const orderNumber = StorageFacade.generateOrderNumber();
      const qty = Number(initialQty) > 0 ? Number(initialQty) : 1;
      this.checkout = {
        step: "name",
        product: targetProduct,
        orderNumber,
        quantity: qty,
        quantityLabel: "",
        total: Number(targetProduct.salePrice) * qty,
        name: "",
        recipientName: "",
        address: "",
        isAgencyPickup: false,
        phone: "",
        postalCode: null,
        location: null,
        requiresInvoice: false,
        rtn: null,
        businessName: null
      };
      return {
        text: `\xA1Excelente elecci\xF3n! Preparo tu orden (*N\xB0 ${orderNumber}*) para **${targetProduct.name}** (L.${Number(targetProduct.salePrice).toLocaleString("es-HN")}). \xBFA qu\xE9 nombre registramos tu pedido?`
      };
    }
    _buildOrderConfirmationResponse(c) {
      const prod = c.product;
      const invoiceTxt = c.requiresInvoice ? `S\xED (RTN: ${c.rtn} \xB7 ${c.businessName})` : "No (Consumidor Final)";
      const deliverySummary = c.isAgencyPickup ? `\u{1F3E2} Retiro en Agencia Cargo Expreso (${c.address})` : `${c.address}${c.location ? `
\u2022 \u{1F4CD} Mapa GPS: [Ver en Google Maps](${c.location.mapUrl})` : ""}`;
      return {
        text: `\u{1F4CB} **Resumen de tu pedido (${c.orderNumber})**:
\u2022 Producto: **${prod.name}** (SKU: ${prod.sku})
\u2022 Cantidad / Piezas: **${c.quantityLabel || c.quantity + " unid."}**
\u2022 Total a pagar: **L.${Number(c.total).toLocaleString("es-HN")}**
\u2022 Destinatario: ${c.recipientName || c.name}
\u2022 Entrega: ${deliverySummary}
\u2022 Contacto (Llamadas Cargo Expreso): ${c.phone}
\u2022 Facturaci\xF3n: **${invoiceTxt}**

Presiona el bot\xF3n abajo para confirmar tu compra con pago contra entrega.`,
        order: {
          orderNumber: c.orderNumber,
          name: c.name,
          recipientName: c.recipientName || c.name,
          address: c.address,
          isAgencyPickup: Boolean(c.isAgencyPickup),
          phone: c.phone,
          postalCode: c.postalCode || null,
          productName: `${prod.name} (${prod.sku})`,
          sku: prod.sku,
          quantity: c.quantity,
          quantityLabel: c.quantityLabel || `${c.quantity} unid.`,
          requiresInvoice: c.requiresInvoice,
          rtn: c.rtn,
          businessName: c.businessName,
          total: Number(c.total),
          location: c.location || null
        }
      };
    }
    confirmOrder() {
      const c = this.checkout;
      if (!c || c.step !== "confirm") return null;
      const saved = StorageFacade.saveOrder({
        orderNumber: c.orderNumber,
        name: c.name,
        recipientName: c.recipientName || c.name,
        address: c.address,
        isAgencyPickup: Boolean(c.isAgencyPickup),
        phone: c.phone,
        postalCode: c.postalCode || null,
        productName: c.product.name,
        sku: c.product.sku,
        quantity: c.quantity,
        quantityLabel: c.quantityLabel || `${c.quantity} unid.`,
        requiresInvoice: c.requiresInvoice,
        rtn: c.rtn,
        businessName: c.businessName,
        total: Number(c.total),
        location: c.location || null,
        source: "whatsapp_bot"
      });
      this.checkout = null;
      return saved;
    }
    _isConfirmIntent(cleanText, rawText) {
      const isQuestion = rawText.includes("?") || rawText.includes("\xBF") || /^(?:puedo|como|c[oó]mo|cu[aá]ndo|cuando|cu[aá]nto|cuanto|d[oó]nde|donde|qu[eé]|que|por qu[eé]|por que|aceptan|tienen|hay)\b/i.test(cleanText);
      if (isQuestion) return false;
      const explicitConfirm = ["confirmar", "confirmar pedido", "confirmar compra", "confirmo", "confirmo pedido", "proceder", "proceder con la compra", "cerrar pedido", "comprar ahora", "si confirmar", "si confirmo"].some((w) => cleanText.includes(w));
      if (explicitConfirm) return true;
      const exactConfirmWords = ["si", "ok", "listo", "correcto", "dale", "adelante", "comprar", "proceder", "de acuerdo", "perfecto", "va", "esta bien", "todo bien", "todo correcto", "mandelo", "envielo"];
      const isExact = exactConfirmWords.includes(cleanText);
      const startsWithOkOrSi = /^(?:si|ok|listo|dale|adelante)\b\s*(?:por favor|amigo|amiga|gracias|esta bien|proceda|mandelo|envielo)?$/i.test(cleanText);
      return isExact || startsWithOkOrSi;
    }
    _handleOrderModifications(c, rawText, cleanText, tokens, products = [], location = null) {
      const detectedLoc = location || (typeof LocationService !== "undefined" && LocationService.parseLocationFromText ? LocationService.parseLocationFromText(rawText) : null);
      if (detectedLoc) {
        const locName = detectedLoc.address || detectedLoc.name || `Ubicaci\xF3n GPS (${detectedLoc.lat.toFixed(4)}, ${detectedLoc.lng.toFixed(4)})`;
        c.address = locName;
        c.location = {
          lat: detectedLoc.lat,
          lng: detectedLoc.lng,
          name: detectedLoc.name || locName,
          address: locName,
          mapUrl: detectedLoc.mapUrl || (typeof LocationService !== "undefined" && LocationService.getGoogleMapsUrl ? LocationService.getGoogleMapsUrl(detectedLoc.lat, detectedLoc.lng) : `https://maps.google.com/?q=${detectedLoc.lat},${detectedLoc.lng}`)
        };
        return {
          modified: true,
          field: "location",
          ack: `\u270F\uFE0F \xA1Listo! Hemos actualizado tu ubicaci\xF3n GPS de entrega a: **${locName}** \u{1F4CD}`
        };
      }
      const isAddressPromptOnly = /^(?:cambiar|modificar|corregir)?\s*(?:la\s+)?(?:direccion|entrega|ubicacion)$/i.test(cleanText.trim());
      if (isAddressPromptOnly) {
        c.step = "address";
        return {
          redirect: true,
          prompt: `Por favor comp\xE1rtenos tu nueva direcci\xF3n de entrega detallada (o presiona el bot\xF3n \u{1F4CD} abajo para enviar tu ubicaci\xF3n GPS):

\u2022 **Nombre del destinatario**
\u2022 **Calle y n\xFAmero de casa / referencia**
\u2022 **Colonia, barrio o sector**
\u2022 **Ciudad / Municipio**
\u2022 **C\xF3digo postal**`
        };
      }
      const addressChangeMatch = rawText.match(/(?:entregar|mandar|llevar|enviar)\b\s*(?:en|a)\s*[:\-]?\s*(.+)/i) || rawText.match(/(?:mi\s+nueva\s+direcci[oó]n\s+es|mi\s+direcci[oó]n\s+es)\s*[:\-]?\s*(.+)/i) || rawText.match(/(?:cambiar|modificar|corregir|actualizar)?\s*(?:la\s+)?(?:direcci[oó]n|entrega|ubicaci[oó]n)\b\s*(?:a|por|es|ser[ií]a)?\s*[:\-]?\s*(.+)/i);
      if (addressChangeMatch && addressChangeMatch[1] && addressChangeMatch[1].trim().length >= 6) {
        const newAddress = addressChangeMatch[1].trim();
        if (!newAddress.includes("?") && !newAddress.includes("\xBF") && !cleanText.startsWith("donde")) {
          c.address = newAddress;
          c.isAgencyPickup = this._isAgencyAddress(newAddress);
          const cpMatch = newAddress.match(/\b\d{5}\b/);
          if (cpMatch) c.postalCode = cpMatch[0];
          const ackText = c.isAgencyPickup ? `\u270F\uFE0F \xA1Listo! Hemos actualizado tu entrega para **retiro en agencia de Cargo Expreso**: **${c.address}** (Recordando que los s\xE1bados atienden \xFAnicamente medio d\xEDa).` : `\u270F\uFE0F \xA1Listo! Hemos actualizado tu direcci\xF3n de entrega a: **${c.address}**.`;
          return {
            modified: true,
            field: "address",
            ack: ackText
          };
        }
      }
      const isPhonePromptOnly = /^(?:cambiar|modificar|corregir)?\s*(?:el\s+)?(?:telefono|celular|cel|numero|num)$/i.test(cleanText.trim());
      if (isPhonePromptOnly) {
        c.step = "phone";
        return {
          redirect: true,
          prompt: `Por favor comp\xE1rtenos tu nuevo **n\xFAmero telef\xF3nico que reciba llamadas** para que Cargo Expreso coordine la entrega de tu paquete \u{1F4DE}:`
        };
      }
      const phoneChangeMatch = rawText.match(/(?:cambiar|modificar|corregir|actualizar)?\s*(?:el\s+)?(?:tel[eé]fono|celular|cel|n[uú]mero|num)\b\s*(?:a|por|es|ser[ií]a)?\s*[:\-]?\s*([+0-9\s\-]{8,20})/i) || rawText.match(/(?:mi\s+(?:nuevo\s+)?(?:tel[eé]fono|celular|cel|n[uú]mero)\s+es)\s*[:\-]?\s*([+0-9\s\-]{8,20})/i);
      const standalonePhone = rawText.trim().match(/^[+]?[\d\s\-]{8,16}$/);
      if (phoneChangeMatch && phoneChangeMatch[1] || standalonePhone && !cleanText.includes("rtn")) {
        const rawNum = phoneChangeMatch && phoneChangeMatch[1] || standalonePhone[0];
        const digits = rawNum.replace(/\D/g, "");
        if (digits.length >= 8 && digits.length <= 15) {
          c.phone = rawNum.trim();
          return {
            modified: true,
            field: "phone",
            ack: `\u270F\uFE0F \xA1Listo! Hemos actualizado tu n\xFAmero de contacto para llamadas de Cargo Expreso a: **${c.phone}** \u{1F4DE}.`
          };
        }
      }
      const isCancelInvoice = cleanText.includes("sin factura") || cleanText.includes("no quiero factura") || cleanText.includes("no ocupo factura") || cleanText.includes("ya no quiero factura") || cleanText.includes("factura no") || cleanText.includes("consumidor final");
      if (isCancelInvoice) {
        c.requiresInvoice = false;
        c.rtn = null;
        c.businessName = null;
        return {
          modified: true,
          field: "invoice",
          ack: `\u270F\uFE0F \xA1Listo! Se ha actualizado tu pedido a **Sin Factura (Consumidor Final)**.`
        };
      }
      const isInvoicePromptOnly = /^(?:cambiar|modificar|agregar|ocupo|quiero|poner|solicitar)?\s*(?:la\s+)?factura$/i.test(cleanText.trim());
      if (isInvoicePromptOnly) {
        c.step = "invoice_rtn";
        return {
          redirect: true,
          prompt: `\xA1Con gusto te emitimos factura fiscal! \u{1F9FE}

Por favor comp\xE1rtenos tu n\xFAmero de **RTN** (14 d\xEDgitos):`
        };
      }
      const rtnChangeMatch = rawText.match(/\b\d{14}\b/) || rawText.match(/\b\d{8,14}\b/);
      const hasInvoiceIntent = cleanText.includes("rtn") || cleanText.includes("factura") || cleanText.includes("razon social") || cleanText.includes("raz\xF3n social");
      if (hasInvoiceIntent && rtnChangeMatch) {
        c.requiresInvoice = true;
        c.rtn = rtnChangeMatch[0];
        const nameMatch = rawText.match(/(?:a\s+nombre\s+de|raz[oó]n\s+social\s*[:\-]?|empresa\s*[:\-]?)\s*([a-zA-Z0-9\s\.,&]+)/i);
        if (nameMatch && nameMatch[1]) {
          c.businessName = nameMatch[1].trim();
        } else if (!c.businessName) {
          c.businessName = c.recipientName || c.name;
        }
        return {
          modified: true,
          field: "invoice",
          ack: `\u270F\uFE0F \xA1Listo! Hemos actualizado los datos de facturaci\xF3n:
\u2022 **RTN:** ${c.rtn}
\u2022 **Raz\xF3n Social:** ${c.businessName}`
        };
      }
      const bizNameMatch = rawText.match(/(?:cambiar|modificar|corregir)?\s*(?:la\s+)?raz[oó]n\s+social\b\s*(?:a|por|es)?\s*[:\-]?\s*(.+)/i);
      if (bizNameMatch && bizNameMatch[1]) {
        c.requiresInvoice = true;
        c.businessName = bizNameMatch[1].trim();
        return {
          modified: true,
          field: "invoice",
          ack: `\u270F\uFE0F \xA1Listo! Hemos actualizado la raz\xF3n social para la factura a: **${c.businessName}**.`
        };
      }
      const isNamePromptOnly = /^(?:cambiar|modificar|corregir)?\s*(?:el\s+)?(?:nombre|destinatario)$/i.test(cleanText.trim());
      if (isNamePromptOnly) {
        c.step = "name";
        return {
          redirect: true,
          prompt: `Por favor ind\xEDcanos el nuevo nombre del **destinatario** (qui\xE9n recibe el paquete):`
        };
      }
      const nameChangeMatch = rawText.match(/(?:cambiar|modificar|corregir|actualizar)?\s*(?:el\s+)?(?:nombre|destinatario)\b\s*(?:a|por|es|ser[ií]a)?\s*[:\-]?\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40})/i) || rawText.match(/(?:a\s+nombre\s+de)\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40})/i) || rawText.match(/(?:el\s+destinatario\s+es)\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40})/i);
      if (nameChangeMatch && nameChangeMatch[1] && !hasInvoiceIntent && !cleanText.includes("transferencia")) {
        const candidateName = nameChangeMatch[1].trim();
        if (!candidateName.toLowerCase().includes("banco") && !candidateName.toLowerCase().includes("smak")) {
          c.recipientName = candidateName;
          c.name = candidateName;
          return {
            modified: true,
            field: "name",
            ack: `\u270F\uFE0F \xA1Listo! Hemos actualizado el nombre del destinatario a: **${c.recipientName}**.`
          };
        }
      }
      const isQtyPromptOnly = /^(?:cambiar|modificar|corregir)?\s*(?:la\s+)?(?:cantidad|piezas|unidades)$/i.test(cleanText.trim());
      if (isQtyPromptOnly) {
        c.step = "quantity";
        return {
          redirect: true,
          prompt: `\xBFCu\xE1ntas piezas o unidades deseas ordenar para **${c.product.name}**? (Ejemplo: *1 kit*, *2 l\xE1mparas*, *3 escritorios*... o solo el n\xFAmero):`
        };
      }
      const wordToNum = { una: 1, un: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10 };
      let detectedQty = null;
      let customQtyLabel = "";
      const qtyRegex = /(?:cambiar|modificar|actualizar)?\s*(?:la\s+)?(?:cantidad|piezas?|unidades?)\b\s*(?:a|por|es|ser[ií]a)?\s*[:\-]?\s*(\d+)/i;
      const matchExplicitQty = rawText.match(qtyRegex);
      if (matchExplicitQty && matchExplicitQty[1]) {
        detectedQty = parseInt(matchExplicitQty[1], 10);
        customQtyLabel = `${detectedQty} ${detectedQty === 1 ? "unidad" : "unidades"}`;
      } else {
        const qtyPhraseRegex = /(?:ponme|poner|agregame|agregar|agr[eé]game|solo\s+quiero|solo\s+deseo|solo|quiero|deseo|ser[ií]an?|mejor|bajar\s+a|subir\s+a|aumentar\s+a|cambiar\s+a)\s+(\d+|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b\s*([a-záéíóúñ\s]+)?/i;
        const phraseMatch = rawText.match(qtyPhraseRegex);
        if (phraseMatch && !hasInvoiceIntent && !phoneChangeMatch && !addressChangeMatch) {
          const tokenVal = phraseMatch[1].toLowerCase();
          const numVal = wordToNum[tokenVal] || parseInt(tokenVal, 10);
          if (!isNaN(numVal) && numVal > 0 && numVal <= 100) {
            detectedQty = numVal;
            const noun = (phraseMatch[2] || "").trim().replace(/(?:por favor|gracias|amigo|amiga).*/i, "").trim();
            customQtyLabel = noun ? `${detectedQty} ${noun}` : `${detectedQty} ${detectedQty === 1 ? "unidad" : "unidades"}`;
          }
        }
      }
      if (detectedQty !== null && detectedQty > 0) {
        c.quantity = detectedQty;
        c.quantityLabel = customQtyLabel || `${detectedQty} ${detectedQty === 1 ? "unidad" : "unidades"}`;
        const unitPrice = Number(c.product.salePrice || c.unitPrice || 0);
        c.total = unitPrice * detectedQty;
        return {
          modified: true,
          field: "quantity",
          ack: `\u270F\uFE0F \xA1Listo! Hemos actualizado la cantidad a **${c.quantityLabel}** (Nuevo total: **L.${Number(c.total).toLocaleString("es-HN")}**).`
        };
      }
      const isProductChangeIntent = ["cambiar por", "cambiar a", "mejor el", "mejor la", "cambiar producto", "quiero el", "quiero la", "en vez de", "en lugar de"].some((p) => cleanText.includes(p));
      if (isProductChangeIntent && products.length) {
        for (const p of products) {
          if (cleanText.includes(clean(p.name)) || p.sku && cleanText.includes(clean(p.sku))) {
            if (p.sku !== c.product.sku) {
              c.product = p;
              const unitPrice = Number(p.salePrice || p.price || 0);
              c.total = unitPrice * c.quantity;
              c.quantityLabel = `${c.quantity} ${c.quantity === 1 ? "unidad" : "unidades"}`;
              return {
                modified: true,
                field: "product",
                ack: `\u270F\uFE0F \xA1Listo! Hemos cambiado el producto de tu pedido a **${p.name}** (Nuevo total: **L.${Number(c.total).toLocaleString("es-HN")}**).`
              };
            }
          }
        }
      }
      return { modified: false };
    }
    _formatResponse(res, isVoice = false) {
      if (!res) return res;
      if (isVoice) {
        res.audioReply = true;
        res.speechText = SpeechService.cleanTextForSpeech(res.text);
      }
      return res;
    }
    // Extract SKU from user message, Meta Ad referral, or social URL
    extractSku(rawText, products = [], { referral = null, campaigns = [] } = {}) {
      if (referral) {
        if (referral.source_id && campaigns.length) {
          const camp = campaigns.find((c) => String(c.sourceId) === String(referral.source_id) || String(c.id) === String(referral.source_id));
          if (camp) {
            const prod = products.find((p) => p.sku?.toUpperCase() === camp.sku?.toUpperCase());
            return { sku: camp.sku.toUpperCase(), product: prod || null, source: "facebook_ad", referral, campaign: camp };
          }
        }
        const searchTarget = clean(`${referral.headline || ""} ${referral.body || ""}`);
        for (const p of products) {
          const pClean = clean(p.name);
          const keywords = (p.keywords || []).map(clean);
          if (p.sku && searchTarget.includes(clean(p.sku))) {
            return { sku: p.sku.toUpperCase(), product: p, source: "facebook_ad", referral };
          }
          if (searchTarget.includes(pClean) || pClean.includes(searchTarget) || keywords.some((k) => k.length > 2 && searchTarget.includes(k))) {
            return { sku: p.sku?.toUpperCase() || "", product: p, source: "facebook_ad", referral };
          }
        }
      }
      const urlMatch = rawText.match(/https?:\/\/[^\s]+/i);
      if (urlMatch) {
        const fullUrl = urlMatch[0];
        const skuParamMatch = fullUrl.match(/[?&](?:sku|ref)=([a-zA-Z0-9_\-]+)/i);
        if (skuParamMatch && skuParamMatch[1]) {
          const cand = skuParamMatch[1].toUpperCase();
          const found = products.find((p) => p.sku?.toUpperCase() === cand);
          return { sku: cand, product: found || null, source: "url_param", url: fullUrl };
        }
        const fbShareMatch = fullUrl.match(/facebook\.com\/share\/p\/([a-zA-Z0-9_\-]+)/i);
        const igMatch = fullUrl.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_\-]+)/i);
        const postToken = fbShareMatch && fbShareMatch[1] || igMatch && igMatch[1] || null;
        if (campaigns.length) {
          const camp = campaigns.find((c) => {
            const cUrl = String(c.url || "").toLowerCase();
            const cSourceId = String(c.sourceId || "").toLowerCase();
            return cUrl && (fullUrl.toLowerCase().includes(cUrl) || cUrl.includes(fullUrl.toLowerCase())) || postToken && (cSourceId === postToken.toLowerCase() || cUrl.includes(postToken.toLowerCase()));
          });
          if (camp) {
            const prod = products.find((p) => p.sku?.toUpperCase() === camp.sku?.toUpperCase());
            return { sku: camp.sku.toUpperCase(), product: prod || null, source: "social_link", platform: camp.platform || "Facebook", campaign: camp, url: fullUrl };
          }
        }
      }
      const bracketMatch = rawText.match(/\[(?:sku:?\s*)?([a-zA-Z0-9_\-xX]{2,35})\]/i);
      if (bracketMatch && bracketMatch[1]) {
        const candidate = bracketMatch[1].trim().toUpperCase();
        const found = products.find((p) => p.sku?.toUpperCase() === candidate);
        if (found) {
          return { sku: candidate, product: found, explicit: true, source: "deep_link" };
        }
      }
      const explicitMatch = rawText.match(/(?:sku|c[oó]digo|codigo|art[ií]culo|articulo|ref|modelo)\s*[:#\-]?\s*([a-zA-Z0-9_\-xX]{2,35})/i);
      if (explicitMatch && explicitMatch[1]) {
        const candidate = explicitMatch[1].trim().toUpperCase();
        const found = products.find((p) => p.sku?.toUpperCase() === candidate);
        return { sku: candidate, product: found || null, explicit: true };
      }
      const cRawUpper = rawText.toUpperCase();
      for (const p of products) {
        if (p.sku && (cRawUpper.includes(p.sku.toUpperCase()) || new RegExp(`\\b${p.sku.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(rawText))) {
          return { sku: p.sku.toUpperCase(), product: p, explicit: false };
        }
      }
      const cleanMsg = clean(rawText);
      const GENERIC_ATTR_WORDS = /* @__PURE__ */ new Set(["negro", "negra", "blanco", "blanca", "cafe", "marron", "gris", "rosa", "rojo", "roja", "madera", "metal", "hierro", "acero", "precio", "medidas", "colores", "tamano", "fotos"]);
      for (const p of products) {
        const pClean = clean(p.name);
        if (pClean && (cleanMsg.includes(pClean) || matchPhrase(cleanMsg, tokenize(cleanMsg), pClean))) {
          return { sku: p.sku?.toUpperCase() || "", product: p, explicit: false };
        }
        const keywords = (p.keywords || []).map(clean).filter((k) => !GENERIC_ATTR_WORDS.has(k) && k.length > 2);
        if (keywords.some((k) => cleanMsg.includes(k))) {
          return { sku: p.sku?.toUpperCase() || "", product: p, explicit: false };
        }
      }
      return null;
    }
    // Check synonym matching
    matchesSynonym(wordList, synonyms, concept, cleanText = "") {
      const synList = synonyms[concept] || [];
      const targetTerms = [concept, ...synList].map(clean);
      return targetTerms.some((term) => {
        if (term.includes(" ")) {
          return cleanText ? cleanText.includes(term) : false;
        }
        return wordList.some((word) => {
          if (term === word) return true;
          if (word.length >= 4 && term.length >= 4) {
            const rootLen = Math.min(word.length, term.length) - 1;
            return word.slice(0, rootLen) === term.slice(0, rootLen);
          }
          return false;
        });
      });
    }
    // Colors intent detection
    _isColorIntent(cleanText, tokens, synonyms = {}) {
      const directWords = ["color", "colores", "tono", "tonos", "acabado", "acabados", "presentacion", "presentaciones"];
      if (tokens.some((t) => directWords.includes(t))) return true;
      const phrases = [
        "que colores hay",
        "que colores tienen",
        "en que colores viene",
        "en que color viene",
        "que color viene",
        "de que color es",
        "que color es",
        "colores disponibles",
        "otros colores",
        "mas colores",
        "otro color",
        "que tonos hay",
        "cuales colores hay",
        "hay otros colores",
        "tienen mas colores",
        "que colores manejan",
        "tienen en color",
        "viene en color",
        "que color tiene",
        "tienen colores"
      ];
      if (phrases.some((p) => cleanText.includes(p))) return true;
      const colorNames = ["blanco", "blanca", "negro", "negra", "marron", "cafe", "gris", "rosa", "rosado", "rojo", "roja", "azul", "verde", "amarillo", "dorado", "plateado", "inox", "madera"];
      const hasColorWord = tokens.some((t) => colorNames.includes(t));
      if (hasColorWord) {
        const colorQueryTriggers = ["tienen", "hay", "viene", "la tienen", "lo tienen", "la hay", "lo hay", "color", "tono", "en", "acabado", "busco", "quiero"];
        if (colorQueryTriggers.some((w) => cleanText.includes(w)) || tokens.length <= 3) {
          return true;
        }
      }
      return this.matchesSynonym(tokens, synonyms, "colores", cleanText);
    }
    _handleColorQuery(rawText, cleanText, tokens, currentProduct, allProducts = []) {
      const colorNames = [
        { key: "blanco", forms: ["blanco", "blanca", "white"] },
        { key: "negro", forms: ["negro", "negra", "black"] },
        { key: "cafe", forms: ["cafe", "cafes", "marron", "marrones", "marr\xF3n", "brown"] },
        { key: "gris", forms: ["gris", "grises", "grey", "gray"] },
        { key: "rosa", forms: ["rosa", "rosado", "rosada", "pink"] },
        { key: "rojo", forms: ["rojo", "roja", "red"] },
        { key: "azul", forms: ["azul", "azules", "blue"] },
        { key: "verde", forms: ["verde", "verdes", "green"] },
        { key: "amarillo", forms: ["amarillo", "amarilla", "yellow"] },
        { key: "dorado", forms: ["dorado", "dorada", "oro", "gold"] },
        { key: "plateado", forms: ["plateado", "plateada", "plata", "silver"] },
        { key: "inox", forms: ["inox", "inoxidable", "acero"] },
        { key: "madera", forms: ["madera", "pino", "natural", "wood"] }
      ];
      const detectedColors = colorNames.filter((c) => c.forms.some((f) => cleanText.includes(f)));
      if (currentProduct) {
        const prodColorsClean = clean(currentProduct.colors || "");
        const isAvailable = currentProduct.stock > 0 || Boolean(currentProduct.inStock);
        if (detectedColors.length > 0) {
          const matchesCurrent = detectedColors.some((c) => c.forms.some((f) => prodColorsClean.includes(f)));
          if (matchesCurrent) {
            return {
              text: `\u{1F3A8} **\xA1S\xED, disponible!**

El producto **${currentProduct.name}** (SKU: ${currentProduct.sku}) cuenta en nuestro cat\xE1logo con el acabado oficial en: **${currentProduct.colors}**.

\u2022 \u{1F3F7}\uFE0F **Precio:** L.${Number(currentProduct.salePrice || currentProduct.price).toLocaleString("es-HN")}
\u2022 \u{1F4CF} **Medidas:** ${currentProduct.dimensions || "Est\xE1ndar"}
\u2022 \u{1F69A} **Env\xEDo:** \xA1Totalmente GRATIS a todo el pa\xEDs v\xEDa Cargo Expreso!
\u2022 \u{1F4B5} **Pago:** En efectivo contra entrega al recibir en tu puerta.

\xBFDeseas que preparemos tu pedido o tienes alguna otra duda?`,
              product: currentProduct,
              images: currentProduct.images?.slice(0, 2) || []
            };
          } else {
            const targetColorKey = detectedColors[0].key;
            const altProduct = allProducts.find((p) => p.sku !== currentProduct.sku && clean(p.colors || "").includes(targetColorKey));
            let altText = "";
            if (altProduct) {
              altText = `

\u{1F4A1} **Variante disponible en ese color:** Contamos con **${altProduct.name}** (SKU: ${altProduct.sku}) que viene en acabado **${altProduct.colors}** a precio especial de **L.${Number(altProduct.salePrice || altProduct.price).toLocaleString("es-HN")}**.`;
            }
            const askedLabel = detectedColors.map((c) => c.key).join(" / ");
            return {
              text: `\u{1F3A8} Para el modelo **${currentProduct.name}** (SKU: ${currentProduct.sku}), el acabado registrado en f\xE1brica es \xFAnicamente: **${currentProduct.colors || "Negro"}** (no viene en ${askedLabel}).${altText}

Si necesitas un modelo o color personalizado, puedo comunicarte con un ejecutivo comercial.`,
              product: currentProduct
            };
          }
        }
        return {
          text: `\u{1F3A8} **Colores disponibles para ${currentProduct.name} (SKU: ${currentProduct.sku}):**

En nuestro cat\xE1logo de f\xE1brica, este modelo viene en acabado oficial: **${currentProduct.colors || "Negro"}**.

\u2022 \u{1F3F7}\uFE0F **Precio:** L.${Number(currentProduct.salePrice || currentProduct.price).toLocaleString("es-HN")}
\u2022 \u{1F4CF} **Dimensiones:** ${currentProduct.dimensions || "Est\xE1ndar"}
\u2022 \u{1F4E6} **Disponibilidad:** ${isAvailable ? `\u2705 \xA1${currentProduct.stock || "Unidades"} en stock!` : "\u26A0\uFE0F Agotado"}

\xBFDeseas conocer las medidas, fotograf\xEDas reales o preparar tu pedido?`,
          product: currentProduct,
          images: currentProduct.images?.slice(0, 2) || []
        };
      }
      const categoryKeywords = [
        { name: "Sillas y Sillones", words: ["silla", "sillas", "sillon", "sillones", "gamer", "oficina"] },
        { name: "Taburetes y Bancos Tolix", words: ["taburete", "taburetes", "banco", "bancos", "tolix"] },
        { name: "Muebles, Mesas y Escritorios", words: ["escritorio", "escritorios", "mesa", "mesas", "estante", "estanteria"] },
        { name: "Duchas y Grifer\xEDa", words: ["ducha", "duchas", "grifo", "monocomando", "pileta"] },
        { name: "Escaleras y Carga", words: ["escalera", "escaleras", "carro", "carga"] }
      ];
      const matchedCat = categoryKeywords.find((c) => c.words.some((w) => cleanText.includes(w)));
      if (matchedCat) {
        const filtered = allProducts.filter((p) => {
          const pClean = clean(`${p.name} ${p.category || ""}`);
          return matchedCat.words.some((w) => pClean.includes(w));
        });
        const itemsList = filtered.slice(0, 5).map((p) => `\u2022 **${p.name}** (${p.sku}): Acabado **${p.colors || "Negro"}**`).join("\n");
        return {
          text: `\u{1F3A8} **Colores disponibles en la l\xEDnea de ${matchedCat.name}:**

${itemsList}

\xBFPor qu\xE9 modelo en espec\xEDfico te gustar\xEDa consultar?`
        };
      }
      const topItems = allProducts.slice(0, 6).map((p) => `\u2022 **${p.name}** (${p.sku}): **${p.colors || "Negro"}**`).join("\n");
      return {
        text: `\u{1F3A8} **Gu\xEDa de Colores y Acabados de SMAK Honduras:**

Contamos con acabados de alta durabilidad en pintura electrost\xE1tica, acero inoxidable y maderas tratadas:

${topItems}

\xBFPor qu\xE9 producto en espec\xEDfico deseas consultar sus colores?`
      };
    }
    // Material & assembly intent detection
    _isMaterialIntent(cleanText, tokens, synonyms = {}) {
      const directWords = [
        "material",
        "materiales",
        "madera",
        "hierro",
        "acero",
        "aluminio",
        "marmol",
        "nylon",
        "armado",
        "armada",
        "desarmado",
        "desarmada",
        "herramientas",
        "llaves",
        "tornillos",
        "manual"
      ];
      if (tokens.some((t) => directWords.includes(t))) return true;
      const phrases = [
        "de que material es",
        "que material es",
        "de que esta hecho",
        "de que esta fabricado",
        "es de madera",
        "es de metal",
        "es de plastico",
        "es de hierro",
        "es de acero",
        "viene armado",
        "viene armada",
        "viene desarmado",
        "viene desarmada",
        "viene en caja",
        "trae herramientas",
        "trae llaves",
        "trae tornillos",
        "incluye herramientas",
        "es facil de armar",
        "como se arma",
        "requiere armado",
        "manual de armado"
      ];
      if (phrases.some((p) => cleanText.includes(p))) return true;
      return this.matchesSynonym(tokens, synonyms, "materiales", cleanText);
    }
    _handleMaterialQuery(rawText, cleanText, tokens, currentProduct) {
      if (!currentProduct) {
        return {
          text: `\u{1F4E6} **Materiales y Ensamble en SMAK Honduras:**

\u2022 Todos nuestros productos son **100% nuevos de paquete** y vienen en su caja sellada con empaque reforzado.
\u2022 **Materiales de alta durabilidad:** Estructuras de acero al carbono, pintura electrost\xE1tica horneada anticorrosiva, acero inoxidable 304, madera tratada y aleaci\xF3n de aluminio aeroespacial.
\u2022 **Armado sencillo:** Vienen listos para ensamblar con su **manual gr\xE1fico paso a paso y kit de herramientas (llaves Allen y tornillos)** incluidas.

\xBFPor el material de qu\xE9 producto en espec\xEDfico deseas consultar?`
        };
      }
      let matDetail = "Estructura de alta resistencia y acabados pr\xE9mium.";
      const pCat = clean(currentProduct.category || "");
      const pName = clean(currentProduct.name || "");
      if (pName.includes("gamer") || pName.includes("sillon") || pName.includes("silla") || pCat.includes("silla")) {
        matDetail = "Estructura interna de acero tubular reforzado, pist\xF3n hidr\xE1ulico clase 4 certificado, tapizado en PU pr\xE9mium / malla de nylon de alta tenacidad y base reforzada con ruedas silenciosas 360\xB0.";
      } else if (pName.includes("tolix") || pName.includes("taburete") || pName.includes("banco")) {
        matDetail = "Acero al carbono forjado con pintura electrost\xE1tica anticorrosiva horneada, y asiento reforzado (en modelos con madera, pino natural tratado de alta densidad).";
      } else if (pName.includes("estanteria") || pName.includes("estante") || pName.includes("escritorio") || pName.includes("mesa")) {
        matDetail = "Bastidor estructural de hierro industrial con pintura electrost\xE1tica mate y superficie de madera melam\xEDnica de alta densidad resistente al agua y peso (o m\xE1rmol sint\xE9tico en mesas auxiliares).";
      } else if (pName.includes("ducha") || pName.includes("pileta") || pName.includes("monocomando")) {
        matDetail = "Cuerpo en Acero Inoxidable 304 quir\xFArgico anticorrosivo con acabado negro mate o cepillado inox, cartucho cer\xE1mico anti-fugas y boquillas de silicona anticalc\xE1rea.";
      } else if (pName.includes("escalera")) {
        matDetail = "Aleaci\xF3n de aluminio estructural de grado aeroespacial, bisagras autom\xE1ticas de bloqueo de seguridad y zapatas de goma antideslizantes.";
      } else if (pName.includes("ruedas")) {
        matDetail = "Chasis de acero al carbono plegable con cruceta reforzada, frenos bilaterales de estacionamiento y tapicer\xEDa en lona Oxford transpirable e impermeable.";
      }
      return {
        text: `\u{1F4E6} **Materiales y Ensamble de ${currentProduct.name} (${currentProduct.sku}):**

\u2022 **Materiales:** ${matDetail}
\u2022 **Condici\xF3n:** 100% nuevo de f\xE1brica en caja original sellada.
\u2022 **Armado f\xE1cil:** Viene desarmado para protecci\xF3n durante el env\xEDo e incluye su **manual gr\xE1fico paso a paso** y el **kit completo de herramientas (llaves Allen y torniller\xEDa)**. Se arma en pocos minutos sin herramientas adicionales.

\xBFTe gustar\xEDa ordenar el tuyo o consultar alguna otra caracter\xEDstica?`,
        product: currentProduct
      };
    }
    // Price intent detection
    _isPriceIntent(cleanText, tokens, synonyms = {}) {
      if (["costo de envio", "precio del envio", "cuanto vale el envio", "cobran envio"].some((p) => cleanText.includes(p))) {
        return false;
      }
      const phrases = [
        "cuanto cuesta",
        "cuanto vale",
        "a cuanto sale",
        "a cuanto esta",
        "cual es el precio",
        "cual es el valor",
        "a como sale",
        "en cuanto sale",
        "en cuanto me lo dejan",
        "a como me lo deja",
        "que precio tiene",
        "precio de"
      ];
      if (phrases.some((p) => cleanText.includes(p))) return true;
      const directWords = ["precio", "precios", "costo", "valor"];
      if (tokens.some((t) => directWords.includes(t))) return true;
      return this.matchesSynonym(tokens, synonyms, "precio", cleanText);
    }
    _handlePriceQuery(rawText, cleanText, tokens, currentProduct) {
      if (!currentProduct) {
        return {
          text: `\u{1F3F7}\uFE0F **Precios en SMAK Honduras:**

Nuestros precios van desde **L.1,050** en taburetes y organizadores, hasta **L.3,390** en sillones ejecutivos con apoyapi\xE9s y columnas de ducha de acero inoxidable.

\xA1Todos incluyen **env\xEDo gratuito** a nivel nacional y pago en efectivo contra entrega!

\xBFPor el precio de qu\xE9 art\xEDculo en espec\xEDfico deseas consultar?`
        };
      }
      const saleP = Number(currentProduct.salePrice || currentProduct.price || 0);
      const regP = Number(currentProduct.regularPrice || Math.round(saleP * 1.15));
      return {
        text: `\u{1F3F7}\uFE0F **Precio de ${currentProduct.name} (SKU: ${currentProduct.sku}):**

\u2022 **Precio de oferta especial:** **L.${saleP.toLocaleString("es-HN")}** *(Precio regular: L.${regP.toLocaleString("es-HN")})*
\u2022 \u{1F3A8} **Color registrado:** **${currentProduct.colors || "Negro"}**
\u2022 \u{1F69A} **Costo de env\xEDo:** \xA1Completamente **GRATIS** a cualquier parte de Honduras v\xEDa Cargo Expreso!
\u2022 \u{1F4B5} **Forma de pago:** Pagas en efectivo **contra entrega** al recibir en tu puerta (o transferencia bancaria previa).

\xBFDeseas que preparemos tu pedido o tienes alguna duda de colores o medidas?`,
        product: currentProduct
      };
    }
    // Weight & durability intent
    _isWeightIntent(cleanText, tokens, synonyms = {}) {
      const phrases = [
        "cuanto peso aguanta",
        "cuanto peso soporta",
        "cual es el peso maximo",
        "peso maximo",
        "soporte de peso",
        "que peso aguanta",
        "que peso soporta",
        "cuanto aguanta",
        "cuanto soporta"
      ];
      if (phrases.some((p) => cleanText.includes(p))) return true;
      const directWords = ["resistencia", "soporta", "aguanta", "kilos", "libras", "resiste"];
      if (tokens.some((t) => directWords.includes(t)) && !cleanText.includes("transferencia")) return true;
      return this.matchesSynonym(tokens, synonyms, "peso", cleanText);
    }
    _handleWeightQuery(rawText, cleanText, tokens, currentProduct) {
      if (!currentProduct) {
        return {
          text: `\u{1F4AA} Todos nuestros productos de mobiliario y equipamiento cuentan con est\xE1ndares de alta resistencia para uso comercial y residencial intensivo. \xBFPor qu\xE9 art\xEDculo en particular deseas consultar su capacidad?`
        };
      }
      return {
        text: `\u{1F4AA} **Capacidad y Resistencia de ${currentProduct.name} (${currentProduct.sku}):**

\u2022 **Soporte certificado:** **${currentProduct.weightLimit || "150 kg / Uso comercial y residencial de alta resistencia"}**
\u2022 **Estructura:** Dise\xF1ada con est\xE1ndares de m\xE1xima durabilidad y estabilidad.

\xBFDeseas consultar medidas, colores o hacer tu pedido?`,
        product: currentProduct
      };
    }
    // Gratitude detection
    _isGratitude(cleanText, tokens) {
      const phrases = ["muchas gracias", "mil gracias", "te lo agradezco", "muy amable", "ok gracias", "vale gracias"];
      if (phrases.some((p) => cleanText.includes(p))) return true;
      return tokens.includes("gracias") && tokens.length <= 4;
    }
    // Dimension and measurement intent detection
    _isDimensionIntent(cleanText, tokens, synonyms = {}) {
      const directWords = [
        "dimension",
        "dimensiones",
        "dimencion",
        "dimenciones",
        "medida",
        "medidas",
        "mide",
        "miden",
        "medir",
        "tamano",
        "altura",
        "alto",
        "ancho",
        "anchura",
        "largo",
        "longitud",
        "profundidad",
        "fondo",
        "cm",
        "centimetros",
        "metros"
      ];
      if (tokens.some((t) => directWords.includes(t))) return true;
      const phrases = [
        "cuanto mide",
        "cuanto miden",
        "que medida",
        "que medidas",
        "cuales son las medidas",
        "cuales son las dimensiones",
        "cuales son las dimenciones",
        "medidas de",
        "medida de",
        "dimensiones de",
        "dimenciones de",
        "dimension de",
        "dimencion de",
        "que tamano tiene",
        "tamano del",
        "tamano de la"
      ];
      if (phrases.some((p) => cleanText.includes(p))) return true;
      return this.matchesSynonym(tokens, synonyms, "dimensiones", cleanText);
    }
    // Detection of Agency Pickup Addresses (Cargo Expreso / Delivery agencies in Honduras)
    _isAgencyAddress(rawText) {
      if (!rawText) return false;
      if (rawText.includes("?") || rawText.includes("\xBF")) return false;
      const text = clean(rawText);
      if (/^(?:tienen|donde|d[oó]nde|cu[aá]l|cual|cu[aá]ndo|cuando|a qu[eé]|a que|horario|qu[eé]|que)\b/i.test(text)) {
        return false;
      }
      const agencyTerms = [
        "agencia",
        "oficina",
        "sucursal",
        "ocurre",
        "bodega",
        "punto caex",
        "retirar en agencia",
        "recoger en agencia",
        "retiro en agencia",
        "reclamar en agencia",
        "reclamar en oficina",
        "retirar en oficina",
        "recoger en oficina"
      ];
      const hasAgencyTerm = agencyTerms.some((t) => text.includes(t));
      if (!hasAgencyTerm) return false;
      const carrierOrHonduras = [
        "cargo",
        "expreso",
        "caex",
        "paqueteria",
        "delivery",
        "encomienda",
        "tegucigalpa",
        "san pedro",
        "sps",
        "ceiba",
        "choluteca",
        "comayagua",
        "danli",
        "juticalpa",
        "progreso",
        "puerto cortes",
        "siguatepeque",
        "santa rosa",
        "la granja",
        "kennedy",
        "los andes",
        "centro",
        "circunvalacion",
        "toncontin"
      ];
      const hasCarrierOrLoc = carrierOrHonduras.some((t) => text.includes(t));
      return hasCarrierOrLoc || text.length >= 10;
    }
    // Detection of Delivery Schedule / Specific Hours / Saturdays Queries
    _isScheduleDeliveryQuery(cleanText, tokens) {
      const schedulePhrases = [
        "horario especifico",
        "hora especifica",
        "hora exacta",
        "horario exacto",
        "a que hora",
        "que hora",
        "a que horas",
        "que horas",
        "pueden entregar a las",
        "puedo pedir horario",
        "puedo pedir hora",
        "pueden venir a las",
        "en la tarde",
        "en la manana",
        "por la tarde",
        "por la manana",
        "despues de las",
        "antes de las",
        "medio dia",
        "dia especifico",
        "que dia",
        "puedo elegir dia",
        "puedo escoger dia",
        "sabado",
        "sabados",
        "los sabados",
        "el sabado",
        "sabado en la tarde",
        "sabados en la tarde",
        "sabado por la tarde"
      ];
      if (schedulePhrases.some((p) => cleanText.includes(p))) return true;
      const hasTimeWord = tokens.some((t) => ["horario", "hora", "horas", "sabado", "sabados"].includes(t));
      const hasDeliveryContext = cleanText.includes("especific") || cleanText.includes("entrega") || cleanText.includes("venir") || cleanText.includes("llegar") || cleanText.includes("tarde") || cleanText.includes("medio dia");
      return Boolean(hasTimeWord && hasDeliveryContext);
    }
    // Detection of Agency Pickup General Inquiries
    _isAgencyPickupQuery(cleanText, tokens) {
      const agencyPhrases = [
        "recoger en agencia",
        "retirar en agencia",
        "pasar a recoger",
        "pasar a traer",
        "recoger en oficina",
        "retirar en oficina",
        "oficinas de cargo",
        "agencias de cargo",
        "agencia de cargo",
        "oficina de cargo",
        "mandar a agencia",
        "mandar a oficina",
        "enviar a agencia",
        "enviar a oficina",
        "agencias de delivery",
        "agencia de delivery",
        "oficina cargo expreso",
        "agencia cargo expreso",
        "ocurre",
        "sucursal cargo expreso"
      ];
      return agencyPhrases.some((p) => cleanText.includes(p));
    }
    _getPolicyResponse(cleanText, tokens) {
      if (["roatan", "utila", "guanaja", "islas de la bahia", "isla de la bahia", "islas bahia", "ferry", "galaxy wave", "utila dream", "muelle de cabotaje", "cabotaje"].some((t) => cleanText.includes(t))) {
        return `\u{1F3DD}\uFE0F **Entregas en Roat\xE1n, \xDAtila o Islas de la Bah\xEDa:**
Para Roat\xE1n o \xDAtila, solo hacemos env\xEDos con **transferencia previa**.
Una vez nos hace llegar el comprobante de transferencia bancaria, nosotros enviamos el producto hacia el **muelle de cabotaje de La Ceiba** con la indicaci\xF3n de subir el paquete al ferry que usted diga (Utila Dream, Galaxy Wave, etc.).
\u26A0\uFE0F **Nota:** No cubrimos el costo del ferry (el flete mar\xEDtimo corre por cuenta del cliente).`;
      }
      if (["forza", "otra paqueteria", "otras paqueterias", "otra empresa", "otra agencia", "fedex", "dhl", "rapido cargo"].some((t) => cleanText.includes(t))) {
        return `\u{1F4E6} **Transportadora:** No, \xFAnicamente realizamos entregas a trav\xE9s de **Cargo Expreso**.`;
      }
      if (["tarjeta", "tarjetas", "visa", "mastercard", "pos", "datafast", "link de pago"].some((t) => cleanText.includes(t))) {
        return `\u{1F4B3} **Forma de Pago con Tarjeta:** No aceptamos pagos con tarjeta, solo pago en efectivo contra entrega y se le paga al operador de Cargo Expreso o por transferencia electr\xF3nica previa, pero la transferencia debe confirmarse antes de realizar el env\xEDo.`;
      }
      if ((cleanText.includes("donde") || cleanText.includes("ubicacion") || cleanText.includes("sucursal") || cleanText.includes("tienda fisica") || cleanText.includes("local")) && !cleanText.includes("direccion de entrega") && (cleanText.includes("estan") || cleanText.includes("encuentran") || cleanText.includes("queda") || cleanText.includes("tienda") || cleanText.includes("puerto cortes") || cleanText.includes("local"))) {
        return `\u{1F4CD} **Ubicaci\xF3n F\xEDsica:** Nos encontramos ubicados en **Plaza Krisale, Puerto Cort\xE9s, Honduras**.

\xA1Realizamos env\xEDos gratuitos a domicilio a cualquier parte del pa\xEDs v\xEDa Cargo Expreso!`;
      }
      if (["costo de envio", "cuanto cobran", "cuanto vale el envio", "precio del envio", "cobran envio", "cobran el envio", "el envio es gratis", "flete"].some((t) => cleanText.includes(t))) {
        return `\u{1F69A} **Costo de Env\xEDo:** \xA1El env\xEDo es **completamente gratuito** a cualquier parte del pa\xEDs! Solo cancelas el valor del producto al recibirlo en efectivo contra entrega.`;
      }
      if (["garantia", "garantias", "defecto", "desperfecto"].some((t) => cleanText.includes(t))) {
        return `\u{1F6E1}\uFE0F **Garant\xEDa:** Cuentan con garant\xEDa \xFAnicamente contra **defectos de fabricaci\xF3n**.`;
      }
      if (["son nuevas", "son nuevos", "muebles nuevos", "productos nuevos", "es nuevo", "usado", "de segunda"].some((t) => cleanText.includes(t))) {
        return `\u2728 **Condici\xF3n del Producto:** S\xED, todos nuestros productos son **100% nuevos de f\xE1brica** en su caja original sellada.`;
      }
      if (["mejor precio", "descuento", "rebaja", "cuanto es lo menos", "mayoreo", "por mayor"].some((t) => cleanText.includes(t))) {
        return `\u{1F3F7}\uFE0F **Mejor Precio:** El precio especial ser\xEDa equivalente a la cantidad de piezas solicitadas por el cliente. Si necesitas ordenar varias piezas o mayoreo, ind\xEDcanos cu\xE1ntas unidades deseas y con gusto te cotizamos.`;
      }
      return null;
    }
    _getScheduleAndAgencyExplanation() {
      return `\u{1F69A} **Informaci\xF3n sobre Horarios y Agencias de Cargo Expreso:**

\u2022 **Ruta a domicilio:** Las entregas se realizan de Lunes a Viernes de 8:00 AM a 5:00 PM, y los **S\xE1bados \xFAnicamente medio d\xEDa** (hasta las 12:00 PM).
\u2022 **Dependencia de la agencia:** Como las entregas se coordinan con la empresa de transporte (**Cargo Expreso / agencias de delivery en Honduras**), las rutas dependen directamente de su log\xEDstica diaria. Por esta raz\xF3n, **no depende de nosotros garantizar un horario espec\xEDfico o d\xEDa fijo en tiempo y forma** (el motorista siempre te llamar\xE1 antes de llegar a tu domicilio).

\u{1F4A1} **Recomendaci\xF3n (Retiro en Agencia):** Si necesitas un horario muy espec\xEDfico o no est\xE1s seguro de estar en casa, **te sugerimos solicitar el paquete para retiro en una agencia u oficina de Cargo Expreso** en tu ciudad. Tu paquete te esperar\xE1 en ventanilla para recogerlo a tu conveniencia (ten presente que los s\xE1bados tambi\xE9n atienden medio d\xEDa).`;
    }
    async reply(message, opts = {}) {
      const isVoice = Boolean(opts.audio || opts.audioTranscript || this.voicePreferred);
      const result = await this._internalReply(message, opts);
      return this._formatResponse(result, isVoice);
    }
    async _internalReply(message, { audio = false, audioTranscript = false, referral = null, location = null } = {}) {
      const rawText = String(message || "").trim();
      const cleanText = clean(rawText);
      const tokens = tokenize(rawText);
      if (!cleanText && !referral && !location) {
        return { text: "Hola, \xBFen qu\xE9 puedo ayudarte hoy?" };
      }
      const tenant = StorageFacade.getTenant();
      const synonyms = tenant.synonyms || {};
      if (!audioTranscript && (audio || tokens.some((t) => ["audio", "voz"].includes(t)) || cleanText.includes("no se leer"))) {
        this.voicePreferred = true;
        return {
          text: "\xA1Con gusto! Te responder\xE9 tambi\xE9n con una nota de voz para que sea m\xE1s f\xE1cil.",
          audio: true
        };
      }
      if (this.human) {
        return {
          text: "Tu conversaci\xF3n est\xE1 asignada a un asesor comercial. Un miembro de nuestro equipo responder\xE1 en breve.",
          human: true
        };
      }
      if (this.checkout) {
        const c = this.checkout;
        if (c.step === "name") {
          const policy = this._getPolicyResponse(cleanText, tokens);
          if (policy) {
            return {
              text: `${policy}

Para preparar tu orden, \xBFa qu\xE9 nombre registramos el pedido?`
            };
          }
          if (cleanText.includes("transferencia") || cleanText.includes("transfer") || cleanText.includes("como pago")) {
            return {
              text: `\xA1S\xED, aceptamos transferencia bancaria y efectivo contra entrega! \u{1F3E6}

Cuentas oficiales (SMAK Honduras S. de R.L.):
\u2022 BAC: 742-108-951 \xB7 Ficohsa: 2000-098-432 \xB7 Atl\xE1ntida: 110-045-892

Para preparar tu orden, \xBFa qu\xE9 nombre registramos el pedido?`
            };
          }
          if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
            const expl = this._getScheduleAndAgencyExplanation();
            return {
              text: `${expl}

Para preparar tu orden, \xBFa qu\xE9 nombre registramos el pedido?`
            };
          }
          if (this._isColorIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F3A8} **Colores de ${p.name} (${p.sku}):** En cat\xE1logo oficial viene en acabado: **${p.colors || "Negro"}**.

Para preparar tu orden, \xBFa qu\xE9 nombre registramos el pedido?`
            };
          }
          if (this._isPriceIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F3F7}\uFE0F **Precio de ${p.name} (${p.sku}):** **L.${Number(p.salePrice).toLocaleString("es-HN")}** con env\xEDo gratuito.

Para preparar tu orden, \xBFa qu\xE9 nombre registramos el pedido?`
            };
          }
          if (this._isMaterialIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F4E6} **Materiales y Ensamble de ${p.name}:** 100% nuevo de f\xE1brica en caja sellada con manual gr\xE1fico y herramientas de armado incluidas.

Para preparar tu orden, \xBFa qu\xE9 nombre registramos el pedido?`
            };
          }
          if (this._isDimensionIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F4CF} **Medidas de ${p.name} (${p.sku}):** **${p.dimensions || "Est\xE1ndar"}** (Soporte: ${p.weightLimit || "Uso comercial y residencial"}).

Para preparar tu orden, \xBFa qu\xE9 nombre registramos el pedido?`
            };
          }
          c.name = rawText.trim();
          c.recipientName = c.name;
          c.step = "quantity";
          return {
            text: `Gracias, ${c.name}. \xBFCu\xE1ntas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el n\xFAmero):`
          };
        }
        if (c.step === "quantity") {
          const policy = this._getPolicyResponse(cleanText, tokens);
          if (policy) {
            return {
              text: `${policy}

\xBFCu\xE1ntas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el n\xFAmero):`
            };
          }
          if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
            const expl = this._getScheduleAndAgencyExplanation();
            return {
              text: `${expl}

\xBFCu\xE1ntas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el n\xFAmero):`
            };
          }
          if (this._isColorIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F3A8} **Colores de ${p.name} (${p.sku}):** En cat\xE1logo oficial viene en acabado: **${p.colors || "Negro"}**.

\xBFCu\xE1ntas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el n\xFAmero):`
            };
          }
          if (this._isPriceIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F3F7}\uFE0F **Precio de ${p.name} (${p.sku}):** **L.${Number(p.salePrice).toLocaleString("es-HN")}** con env\xEDo gratuito.

\xBFCu\xE1ntas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el n\xFAmero):`
            };
          }
          if (this._isMaterialIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F4E6} **Materiales y Ensamble de ${p.name}:** 100% nuevo de f\xE1brica en caja sellada con manual gr\xE1fico y herramientas de armado incluidas.

\xBFCu\xE1ntas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el n\xFAmero):`
            };
          }
          if (this._isDimensionIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F4CF} **Medidas de ${p.name} (${p.sku}):** **${p.dimensions || "Est\xE1ndar"}** (Soporte: ${p.weightLimit || "Uso comercial y residencial"}).

\xBFCu\xE1ntas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el n\xFAmero):`
            };
          }
          const match = rawText.match(/\d+/);
          const q = match ? Math.max(1, parseInt(match[0], 10)) : 1;
          c.quantity = q;
          c.quantityLabel = rawText.trim() || `${q} ${q === 1 ? "unidad" : "unidades"}`;
          c.total = Number(c.product.salePrice) * q;
          c.step = "address";
          return {
            text: `Anotado: **${c.quantityLabel}** (Total: L.${Number(c.total).toLocaleString("es-HN")}).

\u{1F69A} Para coordinar la entrega con **Cargo Expreso**, por favor comp\xE1rtenos tus datos de entrega:

\u2022 **Entrega a domicilio:** Destinatario, Calle y n\xFAmero de casa / referencia, Colonia o barrio, Ciudad y C\xF3digo postal (o presiona el bot\xF3n \u{1F4CD} abajo para enviar tu ubicaci\xF3n GPS de WhatsApp).
\u2022 **\xBFPrefieres retirar en agencia?** Puedes indicarnos la **oficina o agencia de Cargo Expreso** de tu ciudad donde prefieres retirar (teniendo en cuenta que los s\xE1bados trabajan medio d\xEDa).

\u{1F4A1} *Ejemplo domicilio:* ${c.name}, Calle Principal #15 frente a pulper\xEDa, Col. Palmira, Tegucigalpa, CP 11101
\u{1F4A1} *Ejemplo agencia:* Agencia Cargo Expreso San Pedro Sula Centro`
          };
        }
        if (c.step === "address") {
          const policy = this._getPolicyResponse(cleanText, tokens);
          if (policy) {
            return {
              text: `${policy}

Continuemos con la entrega: comp\xE1rtenos tu direcci\xF3n completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o env\xEDa tu ubicaci\xF3n GPS \u{1F4CD}:`
            };
          }
          if (cleanText.includes("transferencia") || cleanText.includes("transfer")) {
            return {
              text: `\xA1S\xED, aceptamos transferencia bancaria y efectivo contra entrega! \u{1F3E6}

Continuemos con la entrega: comp\xE1rtenos tu direcci\xF3n completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o env\xEDa tu ubicaci\xF3n GPS \u{1F4CD}:`
            };
          }
          if (this._isColorIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F3A8} **Colores de ${p.name} (${p.sku}):** En cat\xE1logo oficial viene en acabado: **${p.colors || "Negro"}**.

Continuemos con la entrega: comp\xE1rtenos tu direcci\xF3n completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o env\xEDa tu ubicaci\xF3n GPS \u{1F4CD}:`
            };
          }
          if (this._isPriceIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F3F7}\uFE0F **Precio de ${p.name} (${p.sku}):** **L.${Number(p.salePrice).toLocaleString("es-HN")}** con env\xEDo gratuito.

Continuemos con la entrega: comp\xE1rtenos tu direcci\xF3n completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o env\xEDa tu ubicaci\xF3n GPS \u{1F4CD}:`
            };
          }
          if (this._isMaterialIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F4E6} **Materiales y Ensamble de ${p.name}:** 100% nuevo de f\xE1brica en caja sellada con manual gr\xE1fico y herramientas de armado incluidas.

Continuemos con la entrega: comp\xE1rtenos tu direcci\xF3n completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o env\xEDa tu ubicaci\xF3n GPS \u{1F4CD}:`
            };
          }
          if (this._isDimensionIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F4CF} **Medidas de ${p.name} (${p.sku}):** **${p.dimensions || "Est\xE1ndar"}** (Soporte: ${p.weightLimit || "Uso comercial y residencial"}).

Continuemos con la entrega: comp\xE1rtenos tu direcci\xF3n completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o env\xEDa tu ubicaci\xF3n GPS \u{1F4CD}:`
            };
          }
          if (this._isAgencyAddress(rawText)) {
            c.isAgencyPickup = true;
            c.address = rawText.trim();
            c.recipientName = c.recipientName || c.name;
            c.step = "phone";
            return {
              text: `\xA1Excelente elecci\xF3n! \u{1F3E2} Registrado para **retiro en agencia de Cargo Expreso**:

\u{1F4CC} **Agencia de retiro:** ${c.address}
\u{1F464} **Destinatario para reclamar en ventanilla:** ${c.recipientName}

\u26A0\uFE0F **Horarios de agencia:** Atienden de Lunes a Viernes (8:00 AM - 5:00 PM) y los **S\xE1bados \xFAnicamente medio d\xEDa** (hasta las 12:00 PM).

\u{1F4DE} \xBFA qu\xE9 **n\xFAmero telef\xF3nico que reciba llamadas** te contactamos para coordinar la entrega y notificarte la gu\xEDa de rastreo?

\u26A0\uFE0F **Importante:** Cargo Expreso coordina y avisa la llegada del paquete **\xFAnicamente v\xEDa llamada telef\xF3nica** (aseg\xFArate de que la l\xEDnea pueda recibir llamadas directas).`
            };
          }
          if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
            const expl = this._getScheduleAndAgencyExplanation();
            return {
              text: `${expl}

\u{1F4CD} Para continuar con tu orden, ind\xEDcanos si prefieres que lo enviemos a tu **direcci\xF3n de domicilio** (con destinatario, colonia y ciudad) o la **oficina/agencia de Cargo Expreso** donde pasar\xE1s a retirar:`
            };
          }
          const detectedLoc2 = location || LocationService.parseLocationFromText(rawText);
          if (detectedLoc2) {
            const locName = detectedLoc2.address || detectedLoc2.name || `Ubicaci\xF3n GPS (${detectedLoc2.lat.toFixed(4)}, ${detectedLoc2.lng.toFixed(4)})`;
            c.address = locName;
            c.recipientName = c.recipientName || c.name;
            c.location = {
              lat: detectedLoc2.lat,
              lng: detectedLoc2.lng,
              name: detectedLoc2.name || locName,
              address: locName,
              mapUrl: detectedLoc2.mapUrl || LocationService.getGoogleMapsUrl(detectedLoc2.lat, detectedLoc2.lng)
            };
            c.step = "phone";
            return {
              text: `\xA1Ubicaci\xF3n GPS registrada con \xE9xito! \u{1F4CD}

\u{1F4CC} **Direcci\xF3n de entrega:** ${locName}
\u{1F5FA}\uFE0F [Ver en Google Maps](${c.location.mapUrl})
\u{1F464} **Destinatario:** ${c.recipientName}

\u{1F4DE} \xBFA qu\xE9 **n\xFAmero telef\xF3nico que reciba llamadas** te contactamos para coordinar la entrega?

\u26A0\uFE0F **Importante:** Cargo Expreso coordina la entrega **\xFAnicamente v\xEDa llamada telef\xF3nica** antes de llegar a tu domicilio (aseg\xFArate de que la l\xEDnea pueda recibir llamadas directas).`,
              location: c.location
            };
          }
          const cleaned = clean(rawText);
          const words = rawText.trim().split(/\s+/);
          const hasKeyword = ["col", "colonia", "barrio", "b\xB0", "sector", "calle", "ave", "avenida", "casa", "bloque", "res", "residencial", "tegucigalpa", "san pedro", "sps", "ceiba", "choluteca", "comayagua", "frente", "cerca", "etapa", "aldea"].some((k) => cleaned.includes(k));
          const isTooShort = rawText.trim().length < 12 || words.length < 3 || !hasKeyword && words.length < 4;
          if (isTooShort) {
            return {
              text: `Para que **Cargo Expreso** pueda entregar tu paquete sin retrasos, por favor ind\xEDcanos una direcci\xF3n m\xE1s detallada (o presiona el bot\xF3n \u{1F4CD} abajo para enviar tu ubicaci\xF3n GPS):

\u2022 **A domicilio:** Nombre del destinatario, Calle y casa / referencia, Colonia o barrio, y Ciudad / Municipio.
\u2022 **En agencia:** Oficina o sucursal de Cargo Expreso de tu ciudad donde prefieres retirar en ventanilla.

\u{1F4A1} *Ejemplo domicilio:* ${c.name}, Calle Principal, Casa #15 frente a pulper\xEDa, Col. Miramontes, Tegucigalpa.
\u{1F4A1} *Ejemplo agencia:* Agencia Cargo Expreso San Pedro Sula Centro.`
            };
          }
          c.address = rawText.trim();
          const cpMatch = rawText.match(/\b\d{5}\b/);
          if (cpMatch) c.postalCode = cpMatch[0];
          c.recipientName = c.recipientName || c.name;
          c.step = "phone";
          return {
            text: `\xA1Direcci\xF3n registrada con \xE9xito! \u{1F4E6}

\u{1F4CC} **Direcci\xF3n de entrega:** ${c.address}
\u{1F464} **Destinatario:** ${c.recipientName}

\u{1F4DE} \xBFA qu\xE9 **n\xFAmero telef\xF3nico que reciba llamadas** te contactamos para coordinar la entrega?

\u26A0\uFE0F **Importante:** Cargo Expreso coordina la entrega **\xFAnicamente v\xEDa llamada telef\xF3nica** antes de llegar a tu domicilio (aseg\xFArate de que la l\xEDnea pueda recibir llamadas directas).`
          };
        }
        if (c.step === "phone") {
          const policy = this._getPolicyResponse(cleanText, tokens);
          if (policy) {
            return {
              text: `${policy}

Para continuar, comp\xE1rtenos tu **n\xFAmero telef\xF3nico que reciba llamadas** para que Cargo Expreso coordine la entrega de tu paquete \u{1F4DE}:`
            };
          }
          if (cleanText.includes("transferencia") || cleanText.includes("transfer")) {
            return {
              text: `\xA1S\xED, aceptamos transferencia bancaria y efectivo contra entrega! \u{1F3E6}

Para continuar, comp\xE1rtenos tu **n\xFAmero telef\xF3nico que reciba llamadas** para que Cargo Expreso coordine la entrega de tu paquete \u{1F4DE}:`
            };
          }
          if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
            const expl = this._getScheduleAndAgencyExplanation();
            return {
              text: `${expl}

Para continuar con tu pedido, comp\xE1rtenos tu **n\xFAmero telef\xF3nico que reciba llamadas** para coordinar la entrega con Cargo Expreso \u{1F4DE}:`
            };
          }
          if (this._isColorIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F3A8} **Colores de ${p.name} (${p.sku}):** En cat\xE1logo oficial viene en acabado: **${p.colors || "Negro"}**.

Continuemos con tu pedido: comp\xE1rtenos tu **n\xFAmero telef\xF3nico que reciba llamadas** para coordinar la entrega con Cargo Expreso \u{1F4DE}:`
            };
          }
          if (this._isPriceIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F3F7}\uFE0F **Precio de ${p.name} (${p.sku}):** **L.${Number(p.salePrice).toLocaleString("es-HN")}** con env\xEDo gratuito.

Continuemos con tu pedido: comp\xE1rtenos tu **n\xFAmero telef\xF3nico que reciba llamadas** para coordinar la entrega con Cargo Expreso \u{1F4DE}:`
            };
          }
          if (this._isMaterialIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F4E6} **Materiales y Ensamble de ${p.name}:** 100% nuevo de f\xE1brica en caja sellada con manual gr\xE1fico y herramientas de armado incluidas.

Continuemos con tu pedido: comp\xE1rtenos tu **n\xFAmero telef\xF3nico que reciba llamadas** para coordinar la entrega con Cargo Expreso \u{1F4DE}:`
            };
          }
          if (this._isDimensionIntent(cleanText, tokens, synonyms)) {
            const p = c.product;
            return {
              text: `\u{1F4CF} **Medidas de ${p.name} (${p.sku}):** **${p.dimensions || "Est\xE1ndar"}** (Soporte: ${p.weightLimit || "Uso comercial y residencial"}).

Continuemos con tu pedido: comp\xE1rtenos tu **n\xFAmero telef\xF3nico que reciba llamadas** para coordinar la entrega con Cargo Expreso \u{1F4DE}:`
            };
          }
          const phoneDigits = rawText.replace(/\D/g, "");
          if (phoneDigits.length < 8) {
            return {
              text: `Por favor comp\xE1rtenos un n\xFAmero telef\xF3nico v\xE1lido de al menos 8 d\xEDgitos (ejemplo: **9800-8559** o **+504 9876-5432**).

\u26A0\uFE0F **Recordatorio importante:** Cargo Expreso **solo coordina las entregas mediante llamada telef\xF3nica** directa al destinatario. Es indispensable contar con un n\xFAmero activo para llamadas para recibir el paquete.`
            };
          }
          c.phone = rawText.trim();
          c.step = "requires_invoice";
          return {
            text: `Tel\xE9fono registrado para llamadas: **${c.phone}** \u{1F4DE}

\xBFRequieres factura con RTN para tu pedido? (Responde *S\xED* o *No*):`
          };
        }
        if (c.step === "requires_invoice") {
          const cleaned = clean(rawText);
          const wantsInvoice = cleaned.includes("si") || cleaned.includes("factura") || cleaned.includes("rtn") || cleaned.includes("requiero") || cleaned.includes("ocupo");
          if (wantsInvoice) {
            c.step = "invoice_rtn";
            return {
              text: `Por favor comp\xE1rtenos tu n\xFAmero de **RTN** (14 d\xEDgitos):`
            };
          } else {
            c.requiresInvoice = false;
            c.rtn = null;
            c.businessName = null;
            c.step = "confirm";
            return this._buildOrderConfirmationResponse(c);
          }
        }
        if (c.step === "invoice_rtn") {
          c.requiresInvoice = true;
          const rtnMatch = rawText.match(/\d{14}/) || rawText.match(/\d{8,14}/);
          c.rtn = rtnMatch ? rtnMatch[0] : rawText.trim();
          c.step = "invoice_business_name";
          return {
            text: `RTN registrado: **${c.rtn}**.

\xBFCu\xE1l es el **Nombre o Raz\xF3n Social** de la empresa para la factura?`
          };
        }
        if (c.step === "invoice_business_name") {
          c.businessName = rawText.trim() || c.name;
          c.step = "confirm";
          return this._buildOrderConfirmationResponse(c);
        }
        if (c.step === "confirm") {
          const tenant2 = StorageFacade.getTenant();
          const products = tenant2.products || [];
          const mod = this._handleOrderModifications(c, rawText, cleanText, tokens, products, location);
          if (mod.redirect) {
            return { text: mod.prompt };
          }
          if (mod.modified) {
            const confirmation2 = this._buildOrderConfirmationResponse(c);
            return {
              text: `${mod.ack}

${confirmation2.text}`,
              order: confirmation2.order
            };
          }
          if (this._isConfirmIntent(cleanText, rawText)) {
            const saved = this.confirmOrder();
            return {
              text: `\xA1Muchas gracias, ${saved.name}! \u{1F389} Tu pedido **${saved.orderNumber}** (${saved.quantityLabel || "1 unid."}) ha quedado formalmente registrado en nuestro sistema backend. En breve te notificaremos cuando la gu\xEDa de rastreo sea asignada.`
            };
          }
          const answer = await this._getGeneralAnswer(rawText, cleanText, tokens, { referral, location });
          const confirmation = this._buildOrderConfirmationResponse(c);
          const replyText = `${answer.text || ""}

\u{1F447} **Tu pedido (${c.orderNumber}) sigue listo para confirmar:**`;
          return {
            ...answer,
            text: replyText,
            order: confirmation.order
          };
        }
      }
      const trackingRegex = /(?:smak-ord-\d+|calz-ord-\d+|caex-[a-z0-9-]+)/i;
      const matchedCode = rawText.match(trackingRegex);
      if (matchedCode || (tokens.some((t) => ["rastreo", "guia", "tracking", "paquete"].includes(t)) || cleanText.includes("mi pedido")) && (cleanText.includes("donde") || cleanText.includes("estado") || cleanText.includes("numero"))) {
        const codeToSearch = matchedCode ? matchedCode[0] : null;
        let order = codeToSearch ? StorageFacade.getOrderByNumber(codeToSearch) : null;
        if (!order) {
          const recentOrders = StorageFacade.getOrders();
          order = recentOrders[0];
        }
        if (order) {
          const statusMap = {
            pendiente: "\u{1F552} Pendiente de despacho en bodega",
            en_camino: "\u{1F69A} En camino a tu domicilio",
            entregado: "\u2705 Entregado con \xE9xito"
          };
          const statusText = statusMap[order.status] || "\u{1F69A} En proceso de entrega";
          const trackingText = order.trackingNumber ? `\u2022 Gu\xEDa de rastreo: **${order.trackingNumber}** (${order.trackingCarrier || "Cargo Expreso"})
\u2022 Transportadora: Cargo Expreso a domicilio` : "\u2022 Gu\xEDa de rastreo: *En preparaci\xF3n para despacho en el siguiente lote.*";
          return {
            text: `\u{1F4E6} **Informaci\xF3n de tu Pedido (${order.orderNumber})**:

\u2022 Estado: **${statusText}**
\u2022 Cliente: ${order.name}
\u2022 Detalle: ${order.quantityLabel || order.quantity + " unid."} \xB7 ${order.productName}
\u2022 Direcci\xF3n: ${order.address}
\u2022 Total contra entrega: **L.${Number(order.total).toLocaleString("es-HN")}**
${trackingText}

Si requieres apoyo de un asesor, escribe *asesor* en cualquier momento.`
          };
        }
      }
      const detectedLoc = location || LocationService.parseLocationFromText(rawText);
      if (detectedLoc && !this.checkout) {
        const locName = detectedLoc.address || detectedLoc.name || "tu ubicaci\xF3n";
        const mapUrl = detectedLoc.mapUrl || LocationService.getGoogleMapsUrl(detectedLoc.lat, detectedLoc.lng);
        return {
          text: `\xA1Ubicaci\xF3n detectada! \u{1F4CD} Veo que te encuentras en **${locName}**.

\u{1F69A} **Cobertura de Entrega:** \xA1S\xED, tenemos cobertura completa a domicilio en tu zona a trav\xE9s de Cargo Expreso!
\u{1F4B5} **Pago Seguro:** Cancelas en efectivo contra entrega al recibir tu paquete.

\xBFTe gustar\xEDa ver nuestro cat\xE1logo completo o hacer el pedido de alg\xFAn producto?`,
          location: {
            lat: detectedLoc.lat,
            lng: detectedLoc.lng,
            name: locName,
            address: locName,
            mapUrl
          }
        };
      }
      return await this._getGeneralAnswer(rawText, cleanText, tokens, { referral, location });
    }
    async _getGeneralAnswer(rawText, cleanText, tokens, { referral = null, location = null } = {}) {
      const tenant = StorageFacade.getTenant();
      const products = tenant.products || [];
      const rules = tenant.rules || [];
      const synonyms = tenant.synonyms || {};
      const campaigns = tenant.campaigns || [];
      const skuExtraction = this.extractSku(rawText, products, { referral, campaigns });
      if (referral && skuExtraction && skuExtraction.product) {
        const prod = skuExtraction.product;
        this.selectedProduct = prod;
        const isAvailable = prod.stock > 0;
        return {
          text: `\xA1Hola! \u{1F44B} Qu\xE9 gusto saludarte.

Veo que nos escribes desde nuestro anuncio en **Facebook / Instagram** por el **${prod.name} (SKU: ${prod.sku})**.

${isAvailable ? `\u2705 **Disponibilidad:** \xA1Tenemos **${prod.stock} unidades en stock**!
\u{1F3F7}\uFE0F **Precio Especial:** **L.${Number(prod.salePrice).toLocaleString("es-HN")}** *(precio regular: L.${Number(prod.regularPrice).toLocaleString("es-HN")})*
\u{1F69A} **Entrega:** Env\xEDos a todo el pa\xEDs con pago contra entrega.` : `\u26A0\uFE0F El producto **${prod.name}** (SKU: ${prod.sku}) se encuentra actualmente **agotado**.`}

\xBFTe gustar\xEDa apartar el tuyo o prefieres revisar medidas o fotograf\xEDas reales?`,
          product: prod,
          images: prod.images?.slice(0, 2) || [],
          source: "facebook_ad",
          referral
        };
      }
      if (skuExtraction && skuExtraction.source === "social_link" && skuExtraction.product) {
        const prod = skuExtraction.product;
        this.selectedProduct = prod;
        const platformName = skuExtraction.platform === "instagram" ? "Instagram" : "Facebook";
        return {
          text: `\xA1Hola! \u{1F50D} Detect\xE9 el enlace de la publicaci\xF3n en **${platformName}** para el producto **${prod.name} (SKU: ${prod.sku})**.

\u2705 **Stock disponible:** **${prod.stock} unidades**
\u{1F3F7}\uFE0F **Precio de Oferta:** **L.${Number(prod.salePrice).toLocaleString("es-HN")}**
\u{1F4E6} **Medidas / Especificaci\xF3n:** ${prod.dimensions || "Consultar"}

\xA1No necesitas escribir el c\xF3digo! Ya tengo tu producto seleccionado. \xBFDeseas hacer tu pedido o ver fotos reales?`,
          product: prod,
          images: prod.images?.slice(0, 2) || [],
          source: "social_link",
          url: skuExtraction.url
        };
      }
      if (skuExtraction && skuExtraction.source === "deep_link" && skuExtraction.product) {
        const prod = skuExtraction.product;
        this.selectedProduct = prod;
        return {
          text: `\xA1Hola! \u{1F44B} Con gusto te atiendo para el **${prod.name} (SKU: ${prod.sku})**.

\u2705 **Stock:** **${prod.stock} unidades disponibles**
\u{1F3F7}\uFE0F **Precio Especial:** **L.${Number(prod.salePrice).toLocaleString("es-HN")}**
\u{1F69A} **Env\xEDos:** Cobertura nacional con pago contra entrega.

\xBFDeseas que preparemos tu pedido o tienes alguna duda de medidas?`,
          product: prod,
          images: prod.images?.slice(0, 2) || [],
          source: "deep_link"
        };
      }
      const asesorKeywords = ["asesor", "humano", "persona", "operador", "agente", ...synonyms.asesor || []].map(clean);
      const wantsHumanDirectly = asesorKeywords.some((k) => {
        if (k.includes(" ")) return cleanText.includes(k);
        return tokens.includes(k);
      });
      if (wantsHumanDirectly) {
        this.human = true;
        const encodedMsg2 = encodeURIComponent("Hola SMAK Honduras, deseo hablar con un asesor comercial");
        return {
          text: `Te transfiero de inmediato con un asesor humano. El asistente autom\xE1tico ha quedado en pausa.

\u{1F4F2} **WhatsApp Directo:**
[+504 9800-8559](https://wa.me/50498008559?text=${encodedMsg2})`,
          human: true
        };
      }
      const isTransferQuery = cleanText.includes("transferencia") || cleanText.includes("transfer") || cleanText.includes("cuenta") && (cleanText.includes("banco") || cleanText.includes("transferir") || cleanText.includes("depositar"));
      if (isTransferQuery) {
        const activeProd = this.selectedProduct || (this.checkout ? this.checkout.product : null) || products[0];
        return {
          text: `\xA1S\xED, aceptamos transferencia bancaria! \u{1F3E6}

Puedes realizar tu pago a cualquiera de nuestras cuentas oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):

\u2022 **BAC Credomatic (Cheques):** 742-108-951
\u2022 **Banco Ficohsa (Cheques):** 2000-098-432
\u2022 **Banco Atl\xE1ntida (Ahorros):** 110-045-892
\u2022 **Banpa\xEDs (Cheques):** 01-501-002345

Puedes pagar v\xEDa transferencia bancaria y compartirnos tu comprobante por este chat, o si prefieres tambi\xE9n puedes pagar en efectivo contra entrega al recibir tu producto en la puerta de tu casa.

\xBFDeseas que preparemos tu pedido${activeProd ? ` para **${activeProd.name}**` : ""}?`,
          product: activeProd || null
        };
      }
      const restrictionRules = rules.filter((r) => r.enabled && r.type === "restriction");
      for (const rule of restrictionRules) {
        const match = rule.trainingPhrases.some((phrase) => matchPhrase(cleanText, tokens, phrase));
        if (match) {
          return { text: rule.response, isRestriction: true };
        }
      }
      if (skuExtraction?.product) {
        this.selectedProduct = skuExtraction.product;
      }
      const currentProduct = skuExtraction && skuExtraction.product || this.selectedProduct || (this.checkout ? this.checkout.product : null) || null;
      if (this._isColorIntent(cleanText, tokens, synonyms)) {
        return this._handleColorQuery(rawText, cleanText, tokens, currentProduct, products);
      }
      if (this._isPriceIntent(cleanText, tokens, synonyms)) {
        return this._handlePriceQuery(rawText, cleanText, tokens, currentProduct);
      }
      const isDimensionQuery = this._isDimensionIntent(cleanText, tokens, synonyms);
      if (isDimensionQuery) {
        const targetProd = currentProduct;
        if (targetProd) {
          this.selectedProduct = targetProd;
          const isAvailable = targetProd.stock > 0 || Boolean(targetProd.inStock);
          const isCalzado = tenant.id === "calzado";
          let detailNote = "";
          if (cleanText.includes("drenaje") || cleanText.includes("crenaje") || targetProd.sku === "REG-10") {
            detailNote = "\n\u2022 **Drenaje lineal de piso:** 16 \xD7 2.5 cm (acero inoxidable 304, desag\xFCe continuo y sello anti-olores).";
          }
          const dimensionText = `\u{1F4CF} **Medidas y Especificaciones de ${targetProd.name} (SKU: ${targetProd.sku}):**

\u2022 **${isCalzado ? "Tallas disponibles" : "Dimensiones"}:** **${targetProd.dimensions || "Est\xE1ndar seg\xFAn especificaci\xF3n t\xE9cnica"}**
\u2022 **${isCalzado ? "Especificaci\xF3n" : "Capacidad / Soporte"}:** ${targetProd.weightLimit || "Uso comercial y residencial"}${detailNote}
\u2022 \u{1F3A8} **Color oficial:** **${targetProd.colors || "Negro"}**
\u2022 \u{1F3F7}\uFE0F **Precio de oferta:** **L.${Number(targetProd.salePrice || targetProd.price).toLocaleString("es-HN")}**
\u2022 \u{1F4E6} **Disponibilidad:** ${isAvailable ? `\u2705 \xA1${targetProd.stock || "Unidades"} en stock!` : "\u26A0\uFE0F Agotado temporalmente"}

\xBFDeseas que preparemos tu pedido contra entrega o prefieres consultar algo m\xE1s?`;
          return {
            text: dimensionText,
            product: targetProd,
            images: targetProd.images?.slice(0, 2) || []
          };
        } else {
          const sampleItems = products.slice(0, 6).map((p) => `\u2022 **${p.name}** (${p.sku}): **${p.dimensions || "Est\xE1ndar"}** *(Capacidad: ${p.weightLimit || "Est\xE1ndar"})*`).join("\n");
          return {
            text: `\u{1F4CF} **Gu\xEDa de Medidas y Dimensiones de ${tenant.name}:**

Aqu\xED tienes las dimensiones exactas de nuestros productos m\xE1s destacados:

${sampleItems}

\xBFPor las medidas o especificaciones de qu\xE9 producto en espec\xEDfico deseas consultar?`,
            catalog: products.slice(0, 6)
          };
        }
      }
      if (this._isMaterialIntent(cleanText, tokens, synonyms)) {
        return this._handleMaterialQuery(rawText, cleanText, tokens, currentProduct);
      }
      if (this._isWeightIntent(cleanText, tokens, synonyms)) {
        return this._handleWeightQuery(rawText, cleanText, tokens, currentProduct);
      }
      const isPhotoQuery = this.matchesSynonym(tokens, synonyms, "fotos") || tokens.some((t) => ["foto", "fotos", "imagen", "imagenes", "verlo"].includes(t));
      if (isPhotoQuery && currentProduct) {
        let drainageNote = "";
        if (cleanText.includes("drenaje") || cleanText.includes("crenaje") || cleanText.includes("para que") || currentProduct.sku === "REG-10") {
          drainageNote = "\n\n\u{1F6BF} **\xBFPara qu\xE9 sirve el drenaje lineal (16 \xD7 2.5 cm)?**\nEs una rejilla de piso en acero inoxidable 304 que permite un desag\xFCe r\xE1pido y continuo en la ducha, evita encharcamientos, atrapa residuos y cuenta con sello anti-olores.";
        }
        return {
          text: `\xA1Claro! Aqu\xED tienes fotograf\xEDas reales de **${currentProduct.name}** (${currentProduct.sku}):

\u{1F3F7}\uFE0F **Precio:** L.${Number(currentProduct.salePrice || currentProduct.price).toLocaleString("es-HN")}
\u{1F4E6} **Medidas / Detalle:** ${currentProduct.dimensions || "Est\xE1ndar"}
\u{1F3A8} **Color:** ${currentProduct.colors || "Negro"}${drainageNote}

\u2705 **Disponibilidad:** ${currentProduct.stock > 0 ? `${currentProduct.stock} unidades en stock` : "Agotado"}. \xBFDeseas hacer tu pedido?`,
          product: currentProduct,
          images: currentProduct.images || []
        };
      }
      const policyAns = this._getPolicyResponse(cleanText, tokens);
      if (policyAns) {
        return {
          text: `${policyAns}

\xBFDeseas que preparemos tu pedido${currentProduct ? ` para **${currentProduct.name}**` : ""}?`,
          product: currentProduct || null
        };
      }
      if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
        const expl = this._getScheduleAndAgencyExplanation();
        return {
          text: `${expl}

\xBFDeseas que preparemos tu pedido${currentProduct ? ` para **${currentProduct.name}**` : ""}?`,
          product: currentProduct || null
        };
      }
      const isShippingQuery = tokens.some((t) => ["envio", "envios", "entrega", "entregas", "tardan", "tarda", "tiempo", "domicilio", "casa", "dias"].includes(t)) || cleanText.includes("venir a dejar") || cleanText.includes("venirme a dejar") || cleanText.includes("cuanto tiempo");
      if (isShippingQuery && currentProduct) {
        return {
          text: `\xA1Hola! Con gusto te informamos sobre el **${currentProduct.name} (SKU: ${currentProduct.sku})**:

\u{1F69A} **Tiempo de entrega:** Nuestro tiempo estimado de entrega a domicilio es de **1 a 2 d\xEDas h\xE1biles** a todo el pa\xEDs v\xEDa Cargo Expreso (en Tegucigalpa y San Pedro Sula podemos coordinar entrega el mismo d\xEDa si realizas tu pedido temprano).

\u{1F4B5} **Pago seguro:** Pagas en efectivo **contra entrega** al recibir el paquete en la puerta de tu casa.

\u2705 Tenemos **${currentProduct.stock} unidades en stock** a precio de oferta **L.${Number(currentProduct.salePrice || currentProduct.price).toLocaleString("es-HN")}**. \xBFA qu\xE9 ciudad y colonia ser\xEDa tu entrega?`,
          product: currentProduct,
          images: currentProduct.images?.slice(0, 1) || []
        };
      }
      const isStockQuery = tokens.some((t) => ["stock", "disponible", "disponibilidad", "quedan", "hay", "existencia", "inventario", "tienen"].includes(t)) || this.matchesSynonym(tokens, synonyms, "stock");
      if (skuExtraction || isStockQuery && currentProduct) {
        const targetProd = skuExtraction && skuExtraction.product || currentProduct;
        if (targetProd) {
          this.selectedProduct = targetProd;
          const isAvailable = targetProd.stock > 0;
          return {
            text: isAvailable ? `\xA1S\xED, tenemos disponible! Del SKU **${targetProd.sku}** (${targetProd.name}) nos quedan **${targetProd.stock} unidades** a L.${Number(targetProd.salePrice).toLocaleString("es-HN")}.

\u{1F3A8} **Color:** ${targetProd.colors || "Negro"}
\u{1F4CF} **Medidas:** ${targetProd.dimensions || "Est\xE1ndar"}

\xBFDeseas que preparemos tu pedido o tienes alguna duda?` : `El producto **${targetProd.name}** (SKU: ${targetProd.sku}) se encuentra actualmente **agotado**.`,
            product: targetProd,
            images: targetProd.images?.slice(0, 2) || []
          };
        }
      }
      const isCatalogQuery = tokens.some((t) => ["catalogo", "productos", "modelos", "articulos"].includes(t)) || cleanText.includes("que venden") || cleanText.includes("ver catalogo") || cleanText.includes("que tienen");
      if (isCatalogQuery) {
        const catalogItems = products.map((p) => `\u2022 **${p.sku}** \xB7 ${p.name} \u2014 *L.${Number(p.salePrice).toLocaleString("es-HN")}* (${p.stock > 0 ? `${p.stock} en stock` : "Agotado"})`).join("\n");
        return {
          text: `\u{1F4E6} **Cat\xE1logo de ${tenant.name}**:

${catalogItems}

Puedes preguntarme por cualquiera de ellos (por ejemplo: *"\xBFTienen stock para la Silla Gamer?"* o *"\xBFEn qu\xE9 colores viene el sill\xF3n ejecutivo?"*).`,
          catalog: products
        };
      }
      const activeRules = rules.filter((r) => r.enabled && r.type !== "restriction" && r.type !== "parametric");
      for (const rule of activeRules) {
        const isMatched = rule.trainingPhrases.some((phrase) => matchPhrase(cleanText, tokens, phrase));
        if (isMatched) {
          if (rule.action === "show_catalog") {
            const catalogItems = products.map((p) => `\u2022 **${p.sku}** \xB7 ${p.name} \u2014 *L.${Number(p.salePrice).toLocaleString("es-HN")}* (${p.stock > 0 ? `${p.stock} en stock` : "Agotado"})`).join("\n");
            return {
              text: `${rule.response}

${catalogItems}`,
              catalog: products
            };
          }
          return { text: rule.response };
        }
      }
      if (tokens.some((t) => ["comprar", "pedido", "ordenar", "quiero", "orden"].includes(t)) || cleanText.includes("hacer pedido")) {
        return this.startCheckout(currentProduct);
      }
      if (this._isGratitude(cleanText, tokens)) {
        return {
          text: `\xA1Con much\xEDsimo gusto! \u{1F60A} Estamos a tu entera disposici\xF3n. Si deseas apartar alg\xFAn producto, revisar colores, medidas o necesitas comunicarte con un asesor comercial, escr\xEDbenos en cualquier momento.`
        };
      }
      if (tokens.some((t) => ["hola", "buenas", "buen", "dia", "tardes", "noches"].includes(t))) {
        const topSku = products[0]?.sku || "SKM-955-CA-NE";
        return {
          text: `\xA1Hola! \u{1F44B} Soy el asistente de ventas de **${tenant.name}**.

Puedes consultarme por:
\u2022 Ver nuestro cat\xE1logo completo (*"ver cat\xE1logo"*)
\u2022 Disponibilidad y colores (*"\xBFQu\xE9 colores hay de la Silla Gamer?"*)
\u2022 Precios, medidas, formas de pago y env\xEDos.

\xBFQu\xE9 te gustar\xEDa consultar hoy?`
        };
      }
      this.human = true;
      const encodedMsg = encodeURIComponent(`Hola SMAK Honduras, requiero asistencia de un ejecutivo comercial sobre: "${rawText}"`);
      const waLink = `https://wa.me/50498008559?text=${encodedMsg}`;
      return {
        text: `No cuento con esa informaci\xF3n espec\xEDfica en mi cat\xE1logo automatizado.

Para responderte con exactitud y ofrecerte una atenci\xF3n personalizada, **te comunico de inmediato con un ejecutivo comercial de SMAK Honduras** \u{1F464}:

\u{1F4F2} **Contactar a Ejecutivo Comercial:**
[+504 9800-8559](${waLink})

*(Un asesor humano de nuestro equipo continuar\xE1 tu conversaci\xF3n en breve)*`,
        human: true
      };
    }
  };

  // app-admin.js
  var $ = (s) => document.querySelector(s);
  var $$ = (s) => document.querySelectorAll(s);
  var money = (n) => Number(n || 0).toLocaleString("es-HN");
  var escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var activeCategoryFilter = "all";
  var testEngine = new BotEngine();
  function renderTenantOptions() {
    const select = $("#tenant-select");
    select.innerHTML = "";
    StorageFacade.getTenants().forEach((t) => {
      const o = document.createElement("option");
      o.value = t.id;
      o.textContent = t.name;
      select.append(o);
    });
    select.value = StorageFacade.getActiveTenantId();
  }
  function updateHeaderAndBadges() {
    const tenant = StorageFacade.getTenant();
    $("#tenant-title").textContent = tenant.name;
    $("#tenant-category").textContent = tenant.category;
    $("#tenant-badge-icon").textContent = tenant.initials || "\u2726";
    const products = StorageFacade.getProducts();
    const rules = StorageFacade.getRules();
    const synonyms = StorageFacade.getSynonyms();
    const orders = StorageFacade.getOrders();
    const campaigns = StorageFacade.getCampaigns();
    $("#sidebar-products-count").textContent = `${products.length} productos`;
    $("#nav-count-products").textContent = products.length;
    $("#nav-count-rules").textContent = rules.length;
    $("#nav-count-campaigns").textContent = campaigns.length;
    $("#nav-count-synonyms").textContent = Object.keys(synonyms).length;
    $("#nav-count-orders").textContent = orders.length;
    $("#badge-total-products").textContent = `${products.length} art\xEDculos`;
    $("#badge-total-rules").textContent = `${rules.length} reglas activas`;
    $("#badge-total-campaigns").textContent = `${campaigns.length} enlaces activos`;
    $("#badge-total-synonyms").textContent = `${Object.keys(synonyms).length} conceptos`;
  }
  function renderAll() {
    updateHeaderAndBadges();
    renderProducts();
    renderRules();
    renderCampaigns();
    renderSynonyms();
    renderOrders();
    updateSmartLinkGenerator();
  }
  function renderProducts() {
    const products = StorageFacade.getProducts();
    const tbody = $("#products-table-body");
    if (!products.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-slate-400">No hay productos en el cat\xE1logo. Haz clic en "\uFF0B Nuevo Producto" para agregar uno.</td></tr>`;
      return;
    }
    tbody.innerHTML = products.map((p) => {
      const firstImg = p.images?.[0] || "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=150&q=80";
      const isAvailable = Number(p.stock) > 0;
      const stockBadge = isAvailable ? `<span class="badge bg-emerald-100 text-emerald-800">${p.stock} unidades</span>` : `<span class="badge bg-rose-100 text-rose-800">Agotado (0)</span>`;
      return `
      <tr class="hover:bg-slate-50/70 transition">
        <td class="py-3 px-4">
          <img src="${escapeHtml(firstImg)}" class="h-11 w-11 rounded-xl object-cover border border-slate-200" alt="Foto">
        </td>
        <td class="py-3 px-4 font-mono font-bold text-slate-900">
          <span class="rounded-lg bg-slate-100 px-2 py-1">${escapeHtml(p.sku)}</span>
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-800">${escapeHtml(p.name)}</div>
          <div class="text-[11px] text-slate-400 truncate max-w-[220px]">${(p.keywords || []).map((k) => `#${escapeHtml(k)}`).join(" ")}</div>
        </td>
        <td class="py-3 px-4 text-slate-400 line-through">L.${money(p.regularPrice)}</td>
        <td class="py-3 px-4 font-bold text-emerald-700">L.${money(p.salePrice)}</td>
        <td class="py-3 px-4">${stockBadge}</td>
        <td class="py-3 px-4 text-slate-600">
          <div>${escapeHtml(p.dimensions || "\u2014")}</div>
          <div class="text-[10px] text-slate-400">${escapeHtml(p.weightLimit || "")}</div>
        </td>
        <td class="py-3 px-4 text-right space-x-1">
          <button data-action="edit-product" data-id="${escapeHtml(p.id)}" class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">Editar</button>
          <button data-action="delete-product" data-id="${escapeHtml(p.id)}" class="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">Borrar</button>
        </td>
      </tr>
    `;
    }).join("");
  }
  $("#btn-open-new-product").addEventListener("click", () => {
    $("#modal-product-title").textContent = "Agregar Nuevo Producto al Cat\xE1logo";
    $("#form-product").reset();
    $("#prod-id").value = "";
    openModal("#modal-product");
  });
  $("#products-table-body").addEventListener("click", (e) => {
    const editBtn = e.target.closest('[data-action="edit-product"]');
    const delBtn = e.target.closest('[data-action="delete-product"]');
    if (editBtn) {
      const id = editBtn.dataset.id;
      const product = StorageFacade.getProducts().find((p) => p.id === id);
      if (!product) return;
      $("#modal-product-title").textContent = `Editar Producto: ${product.sku}`;
      $("#prod-id").value = product.id;
      $("#prod-sku").value = product.sku;
      $("#prod-name").value = product.name;
      $("#prod-reg-price").value = product.regularPrice;
      $("#prod-sale-price").value = product.salePrice;
      $("#prod-stock").value = product.stock;
      $("#prod-dimensions").value = product.dimensions || "";
      $("#prod-weight").value = product.weightLimit || "";
      $("#prod-keywords").value = (product.keywords || []).join(", ");
      $("#prod-images").value = (product.images || []).join("\n");
      openModal("#modal-product");
    }
    if (delBtn) {
      const id = delBtn.dataset.id;
      if (confirm("\xBFEst\xE1s seguro de eliminar este producto del cat\xE1logo?")) {
        StorageFacade.deleteProduct(id);
        notify("Producto eliminado del cat\xE1logo.");
        renderAll();
      }
    }
  });
  $("#form-product").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = $("#prod-id").value;
    const productData = {
      id: id || void 0,
      sku: $("#prod-sku").value.trim().toUpperCase(),
      name: $("#prod-name").value.trim(),
      regularPrice: Number($("#prod-reg-price").value),
      salePrice: Number($("#prod-sale-price").value),
      stock: Number($("#prod-stock").value),
      dimensions: $("#prod-dimensions").value.trim(),
      weightLimit: $("#prod-weight").value.trim(),
      keywords: $("#prod-keywords").value.split(",").map((k) => k.trim()).filter(Boolean),
      images: $("#prod-images").value.split("\n").map((u) => u.trim()).filter(Boolean)
    };
    StorageFacade.saveProduct(productData);
    closeModal("#modal-product");
    notify("Producto guardado exitosamente.");
    renderAll();
  });
  function renderRules() {
    const allRules = StorageFacade.getRules();
    const container = $("#rules-container");
    const filtered = activeCategoryFilter === "all" ? allRules : allRules.filter((r) => r.category?.toLowerCase() === activeCategoryFilter.toLowerCase());
    if (!filtered.length) {
      container.innerHTML = `<div class="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">No hay reglas en la categor\xEDa seleccionada.</div>`;
      return;
    }
    container.innerHTML = filtered.map((r) => {
      let typeBadge = `<span class="badge bg-emerald-100 text-emerald-800">FAQ Est\xE1tica</span>`;
      if (r.type === "parametric") {
        typeBadge = `<span class="badge bg-purple-100 text-purple-800">Param\xE9trica (SKU)</span>`;
      } else if (r.type === "restriction") {
        typeBadge = `<span class="badge bg-amber-100 text-amber-800">Restricci\xF3n (Qu\xE9 NO decir)</span>`;
      }
      const phrasesHtml = (r.trainingPhrases || []).map(
        (p) => `<span class="inline-block rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700">${escapeHtml(p)}</span>`
      ).join(" ");
      let responsePreview = escapeHtml(r.response || "");
      if (r.type === "parametric") {
        responsePreview = `<b>Con stock:</b> ${escapeHtml(r.responseInStock || "")}<br><b class="text-rose-600">Sin stock:</b> ${escapeHtml(r.responseOutOfStock || "")}`;
      }
      const isChecked = r.enabled !== false ? "checked" : "";
      return `
      <div class="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-900 text-sm">${escapeHtml(r.name)}</h3>
              ${typeBadge}
              <span class="badge bg-slate-100 text-slate-600 text-[10px]">${escapeHtml(r.category || "General")}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
              <input type="checkbox" data-action="toggle-rule" data-id="${escapeHtml(r.id)}" ${isChecked} class="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500">
              <span>${r.enabled !== false ? "Activa" : "Pausada"}</span>
            </label>
            <button data-action="edit-rule" data-id="${escapeHtml(r.id)}" class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">Editar</button>
            <button data-action="delete-rule" data-id="${escapeHtml(r.id)}" class="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">Borrar</button>
          </div>
        </div>

        <div class="mt-3 text-xs">
          <p class="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Frases Disparadoras (${r.trainingPhrases?.length || 0}):</p>
          <div class="mt-1 flex flex-wrap gap-1.5">${phrasesHtml}</div>
        </div>

        <div class="mt-3 text-xs bg-slate-50 rounded-xl p-3 border border-slate-100 text-slate-700 leading-relaxed">
          <p class="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">Respuesta configurada:</p>
          ${responsePreview}
        </div>
      </div>
    `;
    }).join("");
  }
  $$(".rule-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".rule-filter-btn").forEach((b) => {
        b.classList.remove("bg-slate-900", "text-white");
        b.classList.add("bg-slate-100", "text-slate-600");
      });
      btn.classList.add("bg-slate-900", "text-white");
      btn.classList.remove("bg-slate-100", "text-slate-600");
      activeCategoryFilter = btn.dataset.category;
      renderRules();
    });
  });
  $("#rule-type").addEventListener("change", (e) => {
    const type = e.target.value;
    if (type === "parametric") {
      $("#rule-static-box").classList.add("hidden");
      $("#rule-parametric-box").classList.remove("hidden");
      $("#rule-response").removeAttribute("required");
    } else {
      $("#rule-static-box").classList.remove("hidden");
      $("#rule-parametric-box").classList.add("hidden");
      $("#rule-response").setAttribute("required", "true");
    }
  });
  $("#btn-open-new-rule").addEventListener("click", () => {
    $("#modal-rule-title").textContent = "Crear Nueva Pregunta / Regla";
    $("#form-rule").reset();
    $("#rule-id").value = "";
    $("#rule-type").value = "static";
    $("#rule-static-box").classList.remove("hidden");
    $("#rule-parametric-box").classList.add("hidden");
    openModal("#modal-rule");
  });
  $("#rules-container").addEventListener("click", (e) => {
    const toggleCheckbox = e.target.closest('[data-action="toggle-rule"]');
    const editBtn = e.target.closest('[data-action="edit-rule"]');
    const delBtn = e.target.closest('[data-action="delete-rule"]');
    if (toggleCheckbox) {
      const id = toggleCheckbox.dataset.id;
      StorageFacade.toggleRule(id);
      notify("Estado de regla actualizado.");
      renderAll();
      return;
    }
    if (editBtn) {
      const id = editBtn.dataset.id;
      const rule = StorageFacade.getRules().find((r) => r.id === id);
      if (!rule) return;
      $("#modal-rule-title").textContent = `Editar Regla: ${rule.name}`;
      $("#rule-id").value = rule.id;
      $("#rule-name").value = rule.name;
      $("#rule-category").value = rule.category || "Pol\xEDticas";
      $("#rule-type").value = rule.type || "static";
      $("#rule-phrases").value = (rule.trainingPhrases || []).join("\n");
      if (rule.type === "parametric") {
        $("#rule-static-box").classList.add("hidden");
        $("#rule-parametric-box").classList.remove("hidden");
        $("#rule-in-stock").value = rule.responseInStock || "";
        $("#rule-out-stock").value = rule.responseOutOfStock || "";
        $("#rule-not-found").value = rule.responseNotFound || "";
        $("#rule-response").removeAttribute("required");
      } else {
        $("#rule-static-box").classList.remove("hidden");
        $("#rule-parametric-box").classList.add("hidden");
        $("#rule-response").value = rule.response || "";
        $("#rule-response").setAttribute("required", "true");
      }
      openModal("#modal-rule");
    }
    if (delBtn) {
      const id = delBtn.dataset.id;
      if (confirm("\xBFEst\xE1s seguro de eliminar esta regla del bot?")) {
        StorageFacade.deleteRule(id);
        notify("Regla eliminada.");
        renderAll();
      }
    }
  });
  $("#form-rule").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = $("#rule-id").value;
    const type = $("#rule-type").value;
    const phrases = $("#rule-phrases").value.split(/[\n,]/).map((p) => p.trim()).filter(Boolean);
    const ruleData = {
      id: id || void 0,
      name: $("#rule-name").value.trim(),
      category: $("#rule-category").value,
      type,
      trainingPhrases: phrases,
      enabled: true
    };
    if (type === "parametric") {
      ruleData.responseInStock = $("#rule-in-stock").value.trim();
      ruleData.responseOutOfStock = $("#rule-out-stock").value.trim();
      ruleData.responseNotFound = $("#rule-not-found").value.trim();
    } else {
      ruleData.response = $("#rule-response").value.trim();
    }
    StorageFacade.saveRule(ruleData);
    closeModal("#modal-rule");
    notify("Regla guardada exitosamente.");
    renderAll();
  });
  function renderSynonyms() {
    const synonyms = StorageFacade.getSynonyms();
    const container = $("#synonyms-container");
    const keys = Object.keys(synonyms);
    if (!keys.length) {
      container.innerHTML = `<div class="col-span-full rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">No hay grupos de sin\xF3nimos configurados.</div>`;
      return;
    }
    container.innerHTML = keys.map((key) => {
      const words = synonyms[key] || [];
      const chips = words.map((w) => `
      <span class="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200/80 px-2 py-1 text-xs text-amber-900 font-medium">
        <span>${escapeHtml(w)}</span>
        <button type="button" data-action="remove-syn-word" data-concept="${escapeHtml(key)}" data-word="${escapeHtml(w)}" class="text-amber-500 hover:text-amber-800 text-[10px]">\u2715</button>
      </span>
    `).join("");
      return `
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <span class="font-bold text-slate-800 text-sm capitalize">\u{1F3F7} ${escapeHtml(key)}</span>
            <button type="button" data-action="delete-syn-group" data-concept="${escapeHtml(key)}" class="text-xs text-rose-500 hover:text-rose-700">Eliminar grupo</button>
          </div>
          <div class="mt-3 flex flex-wrap gap-1.5 min-h-[48px]">
            ${chips}
          </div>
        </div>

        <form data-action="add-syn-word-form" data-concept="${escapeHtml(key)}" class="mt-4 flex gap-1.5 pt-2 border-t border-slate-100">
          <input placeholder="+ Agregar sin\xF3nimo" class="control text-xs py-1.5 px-2.5">
          <button class="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition">\uFF0B</button>
        </form>
      </div>
    `;
    }).join("");
  }
  $("#btn-open-new-synonym").addEventListener("click", () => {
    $("#form-synonym").reset();
    openModal("#modal-synonym");
  });
  $("#form-synonym").addEventListener("submit", (e) => {
    e.preventDefault();
    const concept = $("#syn-concept").value.trim().toLowerCase();
    const words = $("#syn-words").value.split(",").map((w) => w.trim()).filter(Boolean);
    if (concept && words.length) {
      StorageFacade.saveSynonymGroup(concept, words);
      closeModal("#modal-synonym");
      notify(`Grupo "${concept}" agregado con ${words.length} sin\xF3nimos.`);
      renderAll();
    }
  });
  $("#synonyms-container").addEventListener("click", (e) => {
    const removeWordBtn = e.target.closest('[data-action="remove-syn-word"]');
    const deleteGroupBtn = e.target.closest('[data-action="delete-syn-group"]');
    if (removeWordBtn) {
      const concept = removeWordBtn.dataset.concept;
      const word = removeWordBtn.dataset.word;
      const synonyms = StorageFacade.getSynonyms();
      const list = (synonyms[concept] || []).filter((w) => w !== word);
      StorageFacade.saveSynonymGroup(concept, list);
      renderSynonyms();
      updateHeaderAndBadges();
    }
    if (deleteGroupBtn) {
      const concept = deleteGroupBtn.dataset.concept;
      if (confirm(`\xBFEliminar todo el grupo de sin\xF3nimos "${concept}"?`)) {
        StorageFacade.deleteSynonymGroup(concept);
        notify(`Grupo "${concept}" eliminado.`);
        renderAll();
      }
    }
  });
  $("#synonyms-container").addEventListener("submit", (e) => {
    const addWordForm = e.target.closest('[data-action="add-syn-word-form"]');
    if (addWordForm) {
      e.preventDefault();
      const concept = addWordForm.dataset.concept;
      const input = addWordForm.querySelector("input");
      const newWord = input.value.trim();
      if (newWord) {
        const synonyms = StorageFacade.getSynonyms();
        const list = synonyms[concept] || [];
        if (!list.includes(newWord)) {
          list.push(newWord);
          StorageFacade.saveSynonymGroup(concept, list);
          input.value = "";
          renderSynonyms();
        }
      }
    }
  });
  function renderCampaigns() {
    const campaigns = StorageFacade.getCampaigns();
    const products = StorageFacade.getProducts();
    const tbody = $("#campaigns-table-body");
    if (!tbody) return;
    if (!campaigns.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-slate-400">No hay campa\xF1as ni enlaces vinculados. Haz clic en "\uFF0B Nueva Campa\xF1a / Enlace" para registrar uno.</td></tr>`;
      return;
    }
    tbody.innerHTML = campaigns.map((c) => {
      let platformBadge = `<span class="badge bg-blue-100 text-blue-800">Facebook Ads</span>`;
      if (c.platform === "facebook_post" || c.type === "post") {
        platformBadge = `<span class="badge bg-indigo-100 text-indigo-800">Facebook Post</span>`;
      } else if (c.platform === "instagram") {
        platformBadge = `<span class="badge bg-pink-100 text-pink-800">Instagram</span>`;
      } else if (c.platform === "tiktok") {
        platformBadge = `<span class="badge bg-slate-900 text-white">TikTok</span>`;
      }
      const prod = products.find((p) => p.sku === c.sku);
      const prodName = prod ? prod.name : "Producto no encontrado";
      return `
      <tr class="hover:bg-slate-50/70 transition">
        <td class="py-3 px-4">${platformBadge}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-800">${escapeHtml(c.headline || "Campa\xF1a")}</div>
          <div class="text-[11px] text-slate-400 truncate max-w-[220px]">${escapeHtml(c.description || "")}</div>
        </td>
        <td class="py-3 px-4 font-mono text-[11px] text-slate-600">
          <span class="rounded bg-slate-100 px-2 py-1 truncate max-w-[200px] inline-block align-middle" title="${escapeHtml(c.url || c.sourceId)}">${escapeHtml(c.sourceId || c.url)}</span>
        </td>
        <td class="py-3 px-4">
          <span class="badge bg-emerald-50 text-emerald-800 font-mono font-bold">${escapeHtml(c.sku)}</span>
          <span class="text-[11px] text-slate-600 ml-1 font-medium truncate max-w-[150px] inline-block align-middle">${escapeHtml(prodName)}</span>
        </td>
        <td class="py-3 px-4 text-right space-x-1">
          <button data-action="copy-sku-link" data-sku="${escapeHtml(c.sku)}" class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition" title="Copiar link wa.me con este SKU">Copiar Link wa.me</button>
          <button data-action="delete-campaign" data-id="${escapeHtml(c.id)}" class="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">Borrar</button>
        </td>
      </tr>
    `;
    }).join("");
  }
  function updateSmartLinkGenerator() {
    const select = $("#smart-link-product");
    const output = $("#smart-link-output");
    if (!select || !output) return;
    const products = StorageFacade.getProducts();
    const currentVal = select.value;
    select.innerHTML = "";
    products.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.sku;
      opt.textContent = `${p.sku} \xB7 ${p.name}`;
      select.append(opt);
    });
    if (currentVal && products.some((p) => p.sku === currentVal)) {
      select.value = currentVal;
    }
    const selectedSku = select.value || products[0]?.sku || "SKM-955-CA-NE";
    const phone = "50487331949";
    const text = `Hola, me interesa el producto [SKU: ${selectedSku}]`;
    output.value = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }
  if ($("#smart-link-product")) {
    $("#smart-link-product").addEventListener("change", (e) => {
      const selectedSku = e.target.value;
      const phone = "50487331949";
      const text = `Hola, me interesa el producto [SKU: ${selectedSku}]`;
      $("#smart-link-output").value = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    });
  }
  if ($("#btn-copy-smart-link")) {
    $("#btn-copy-smart-link").addEventListener("click", async () => {
      const val = $("#smart-link-output").value;
      try {
        await navigator.clipboard.writeText(val);
        notify("\xA1Enlace wa.me copiado al portapapeles!");
      } catch {
        notify("Enlace copiado.");
      }
    });
  }
  if ($("#btn-open-new-campaign")) {
    $("#btn-open-new-campaign").addEventListener("click", () => {
      $("#form-campaign").reset();
      $("#camp-id").value = "";
      const skuSelect = $("#camp-sku");
      skuSelect.innerHTML = "";
      StorageFacade.getProducts().forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.sku;
        opt.textContent = `${p.sku} \xB7 ${p.name}`;
        skuSelect.append(opt);
      });
      openModal("#modal-campaign");
    });
  }
  if ($("#campaigns-table-body")) {
    $("#campaigns-table-body").addEventListener("click", async (e) => {
      const copyBtn = e.target.closest('[data-action="copy-sku-link"]');
      const delBtn = e.target.closest('[data-action="delete-campaign"]');
      if (copyBtn) {
        const sku = copyBtn.dataset.sku;
        const link = `https://wa.me/50487331949?text=${encodeURIComponent(`Hola, me interesa el producto [SKU: ${sku}]`)}`;
        try {
          await navigator.clipboard.writeText(link);
          notify(`\xA1Enlace copiado para SKU ${sku}!`);
        } catch {
          notify("Enlace copiado.");
        }
      }
      if (delBtn) {
        const id = delBtn.dataset.id;
        if (confirm("\xBFEst\xE1s seguro de eliminar este enlace de campa\xF1a?")) {
          StorageFacade.deleteCampaign(id);
          notify("Campa\xF1a eliminada.");
          renderAll();
        }
      }
    });
  }
  if ($("#form-campaign")) {
    $("#form-campaign").addEventListener("submit", (e) => {
      e.preventDefault();
      const id = $("#camp-id").value;
      const urlOrId = $("#camp-url").value.trim();
      const fbShareMatch = urlOrId.match(/facebook\.com\/share\/p\/([a-zA-Z0-9_\-]+)/i);
      const sourceId = fbShareMatch && fbShareMatch[1] ? fbShareMatch[1] : urlOrId.startsWith("http") ? urlOrId.replace(/^https?:\/\/[^\/]+\//, "") : urlOrId;
      const campData = {
        id: id || void 0,
        platform: $("#camp-platform").value,
        headline: $("#camp-headline").value.trim(),
        url: urlOrId,
        sourceId,
        sku: $("#camp-sku").value,
        description: $("#camp-desc").value.trim()
      };
      StorageFacade.saveCampaign(campData);
      closeModal("#modal-campaign");
      notify("Campa\xF1a vinculada al SKU exitosamente.");
      renderAll();
    });
  }
  $("#tester-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = $("#tester-input").value.trim();
    if (!question) return;
    const tenant = StorageFacade.getTenant();
    const products = StorageFacade.getProducts();
    const campaigns = StorageFacade.getCampaigns();
    const skuInfo = testEngine.extractSku(question, products, { campaigns });
    const answer = await testEngine.reply(question);
    const resultBox = $("#tester-result");
    resultBox.classList.remove("hidden");
    let detectedRule = "Regla de consulta / Fallback general";
    if (skuInfo) {
      if (skuInfo.source === "facebook_ad") {
        detectedRule = `Atribuci\xF3n Meta Ads (Producto: ${skuInfo.product?.name || skuInfo.sku})`;
      } else if (skuInfo.source === "social_link") {
        detectedRule = `Enlace de Red Social Detectado (Producto: ${skuInfo.product?.name || skuInfo.sku})`;
      } else if (skuInfo.source === "deep_link") {
        detectedRule = `Enlace Deep Link con SKU (Producto: ${skuInfo.product?.name || skuInfo.sku})`;
      } else {
        detectedRule = skuInfo.product ? `Consulta de Stock Param\xE9trica (Producto: ${skuInfo.product.name})` : `Consulta de Stock (SKU: ${skuInfo.sku} no registrado)`;
      }
    } else if (answer.isRestriction) {
      detectedRule = "Regla de Restricci\xF3n / Lo que NO decir";
    }
    $("#tester-rule-name").textContent = detectedRule;
    $("#tester-sku-badge").textContent = skuInfo ? `SKU Detectado: ${skuInfo.sku}` : "SKU: No detectado";
    $("#tester-response-text").textContent = answer.text;
  });
  function renderOrders() {
    const orders = StorageFacade.getOrders();
    const tbody = $("#orders");
    $("#order-count").textContent = orders.length;
    if (!orders.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-slate-400">Todav\xEDa no hay pedidos registrados. Confirma una compra desde el simulador o carga pedidos demo.</td></tr>`;
      return;
    }
    tbody.innerHTML = orders.map((o) => {
      const mapUrl = o.location?.mapUrl || (o.address && o.address.startsWith("http") ? o.address : null);
      const piezasTxt = o.quantityLabel || `${o.quantity || 1} unid.`;
      const orderNum = o.orderNumber || "ORD-SMAK";
      let statusBadge = "";
      if (o.status === "en_camino" || o.trackingNumber) {
        statusBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">\u{1F69A} En camino</span>`;
      } else if (o.status === "entregado") {
        statusBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">\u2713 Entregado</span>`;
      } else {
        statusBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">\u{1F552} Pendiente</span>`;
      }
      let invoiceBadge = "";
      if (o.requiresInvoice) {
        invoiceBadge = `
        <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200" title="RTN: ${escapeHtml(o.rtn || "")} \xB7 ${escapeHtml(o.businessName || "")}">
          \u{1F9FE} S\xED
        </span>
        ${o.rtn ? `<div class="font-mono text-[9px] text-slate-400 mt-0.5 truncate max-w-[120px]" title="RTN: ${escapeHtml(o.rtn)}">RTN: ${escapeHtml(o.rtn)}</div>` : ""}
      `;
      } else {
        invoiceBadge = `<span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">No</span>`;
      }
      return `
    <tr class="hover:bg-slate-50 transition">
      <td class="px-4 py-3">
        <div class="font-mono font-bold text-indigo-700 text-xs">${escapeHtml(orderNum)}</div>
        <div class="mt-1">${statusBadge}</div>
        <div class="text-[10px] text-slate-400 mt-1">${new Date(o.createdAt).toLocaleString("es-HN", { dateStyle: "short", timeStyle: "short" })}</div>
      </td>
      <td class="px-4 py-3">
        <div class="font-bold text-slate-900">${escapeHtml(o.recipientName || o.name)}</div>
        <div class="font-mono text-xs text-indigo-700 font-semibold mt-0.5">\u{1F4DE} ${escapeHtml(o.phone)}</div>
      </td>
      <td class="px-4 py-3 text-slate-600">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200/80">${escapeHtml(piezasTxt)}</span>
          ${o.sku ? `<span class="font-mono text-[10px] rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 font-semibold">${escapeHtml(o.sku)}</span>` : ""}
        </div>
        <div class="font-medium text-slate-800 mt-1 text-xs">${escapeHtml(o.productName)}</div>
      </td>
      <td class="px-4 py-3">
        ${invoiceBadge}
      </td>
      <td class="px-4 py-3 text-slate-600 max-w-[180px]">
        <div class="font-medium text-slate-800 line-clamp-2 text-xs">${escapeHtml(o.address || "\u2014")}</div>
        ${mapUrl ? `<a href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer" class="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 hover:bg-emerald-200 transition">\u{1F4CD} Google Maps</a>` : ""}
      </td>
      <td class="px-4 py-3 font-bold text-emerald-700 whitespace-nowrap">L.${money(o.total)}</td>
      <td class="px-4 py-3 text-center">
        ${o.trackingNumber ? `
          <div class="flex flex-col items-center gap-1">
            <span class="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-2 py-0.5">\u{1F69A} ${escapeHtml(o.trackingNumber)}</span>
            <div class="flex items-center gap-1 mt-0.5">
              <button type="button" class="btn-notify-wa px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition shadow-sm" data-id="${o.id}" title="Reenviar mensaje de WhatsApp al cliente">\u{1F4F2} WhatsApp</button>
              <button type="button" class="btn-edit-trk px-1.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[10px]" data-id="${o.id}" title="Editar gu\xEDa">\u270F\uFE0F</button>
              <button type="button" class="btn-view-audit px-1.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[10px]" data-id="${o.id}" title="Ver auditor\xEDa">\u{1F50D}</button>
            </div>
          </div>
        ` : `
          <div class="flex items-center justify-center gap-1.5">
            <button type="button" class="btn-assign-trk flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 transition shadow-sm" data-id="${o.id}">
              <span>\u{1F69A} Asignar Gu\xEDa</span>
            </button>
            <button type="button" class="btn-view-audit px-1.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[10px]" data-id="${o.id}" title="Ver auditor\xEDa">\u{1F50D}</button>
          </div>
        `}
      </td>
    </tr>
  `;
    }).join("");
  }
  var currentTrackingOrder = null;
  function updateTrackingPreview(order) {
    if (!order) return;
    const trk = $("#tracking-number-input").value.trim().toUpperCase() || "CAEX-HN-XXXXXX";
    const carrier = $("#tracking-carrier-select").value || "Cargo Expreso";
    const piezasTxt = order.quantityLabel || `${order.quantity || 1} unidades`;
    const invoiceLine = order.requiresInvoice ? `\u{1F9FE} Tu factura con RTN (${order.rtn}) va adjunta en el paquete.
` : "";
    const msg = `\xA1Hola ${order.name}! \u{1F44B} Te confirmamos que tu pedido *${order.orderNumber}* (${piezasTxt} \xB7 ${order.productName}) ya va en camino a tu direcci\xF3n (${order.address}). \u{1F69A}\u{1F4E6}

Tu n\xFAmero de gu\xEDa de rastreo es: *${trk}* (${carrier}).
Monto total a pagar en efectivo contra entrega: *L.${Number(order.total).toLocaleString("es-HN")}*.
${invoiceLine}Recuerda tener listo el pago al momento de recibir. Si tienes cualquier consulta, estamos a tu orden. \xA1Gracias por confiar en SMAK Honduras! \u2728`;
    $("#tracking-preview-message").value = msg;
  }
  $("#orders").addEventListener("click", (e) => {
    const assignBtn = e.target.closest(".btn-assign-trk");
    const editBtn = e.target.closest(".btn-edit-trk");
    const notifyBtn = e.target.closest(".btn-notify-wa");
    const auditBtn = e.target.closest(".btn-view-audit");
    if (assignBtn || editBtn) {
      const orderId = (assignBtn || editBtn).dataset.id;
      const order = StorageFacade.getOrder(orderId);
      if (!order) return;
      currentTrackingOrder = order;
      $("#tracking-order-id").value = order.id;
      $("#trk-order-number").textContent = order.orderNumber;
      $("#trk-order-total").textContent = `L.${money(order.total)}`;
      $("#trk-customer-name").textContent = order.name;
      $("#trk-customer-phone").textContent = order.phone;
      $("#trk-customer-product").textContent = `${order.quantityLabel || order.quantity + " unid."} \xB7 ${order.productName}`;
      $("#trk-customer-address").textContent = order.address;
      $("#tracking-number-input").value = order.trackingNumber || "";
      $("#tracking-carrier-select").value = order.trackingCarrier || "Cargo Expreso";
      updateTrackingPreview(order);
      openModal("#modal-tracking");
      setTimeout(() => $("#tracking-number-input").focus(), 150);
    } else if (notifyBtn) {
      const orderId = notifyBtn.dataset.id;
      const order = StorageFacade.getOrder(orderId);
      if (!order || !order.trackingNumber) return;
      const result = StorageFacade.updateOrderTracking(order.id, order.trackingNumber, order.trackingCarrier);
      if (result && result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank");
        notify(`\u{1F4F2} Notificaci\xF3n WhatsApp enviada para ${order.orderNumber}`);
      }
    } else if (auditBtn) {
      const orderId = auditBtn.dataset.id;
      const order = StorageFacade.getOrder(orderId);
      if (!order) return;
      const audit = order.audit || {};
      const history = Array.isArray(audit.history) ? audit.history : [];
      const sourceLabel = order.source === "landing_page_widget" ? "Showroom Web App (SWAP)" : "Simulador WhatsApp";
      const auditHtml = `
      <div class="grid sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">N\xB0 Pedido</span>
          <span class="font-mono font-bold text-indigo-700 text-sm">${escapeHtml(order.orderNumber)}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Canal / Origen</span>
          <span class="font-bold text-slate-800">${escapeHtml(sourceLabel)}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Cliente & Tel\xE9fono</span>
          <span class="font-medium text-slate-800">${escapeHtml(order.name)} (${escapeHtml(order.phone)})</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Piezas / Producto</span>
          <span class="font-medium text-slate-800">${escapeHtml(order.quantityLabel || order.quantity + " unid.")} \xB7 ${escapeHtml(order.productName)}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">IP de Auditor\xEDa</span>
          <span class="font-mono text-slate-700">${escapeHtml(audit.ip || "190.92.112.45")}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Facturaci\xF3n</span>
          <span class="font-semibold ${order.requiresInvoice ? "text-emerald-700" : "text-slate-600"}">
            ${order.requiresInvoice ? `S\xED (RTN: ${escapeHtml(order.rtn || "\u2014")} \xB7 ${escapeHtml(order.businessName || "\u2014")})` : "No (Consumidor Final)"}
          </span>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-2">Historial de Eventos & Trazabilidad:</h4>
        <div class="space-y-2 border-l-2 border-indigo-200 pl-3 ml-2">
          ${history.length ? history.map((h) => `
            <div class="relative">
              <div class="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
              <div class="text-[11px] font-bold text-slate-800">${escapeHtml(h.action || "evento")} \xB7 <span class="font-normal text-slate-400">${new Date(h.timestamp).toLocaleString("es-HN")}</span></div>
              <div class="text-[11px] text-slate-600">${escapeHtml(h.note || "Actualizaci\xF3n de registro.")}</div>
            </div>
          `).join("") : `
            <div class="text-slate-400">Sin eventos adicionales registrados.</div>
          `}
        </div>
      </div>
    `;
      $("#audit-modal-body").innerHTML = auditHtml;
      openModal("#modal-audit");
    }
  });
  $("#tracking-number-input")?.addEventListener("input", () => {
    updateTrackingPreview(currentTrackingOrder);
  });
  $("#tracking-carrier-select")?.addEventListener("change", () => {
    updateTrackingPreview(currentTrackingOrder);
  });
  $("#form-tracking")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const orderId = $("#tracking-order-id").value;
    const trackingNumber = $("#tracking-number-input").value.trim();
    const carrier = $("#tracking-carrier-select").value;
    if (!orderId || !trackingNumber) return;
    const result = StorageFacade.updateOrderTracking(orderId, trackingNumber, carrier);
    closeModal("#modal-tracking");
    if (result && result.whatsappUrl) {
      window.open(result.whatsappUrl, "_blank");
      notify(`\u2705 Gu\xEDa ${trackingNumber} asignada y WhatsApp abierto con mensaje.`);
    } else {
      notify(`\u2705 Gu\xEDa ${trackingNumber} asignada correctamente.`);
    }
    renderOrders();
  });
  $("#seed-orders").addEventListener("click", () => {
    const added = StorageFacade.seedDemoOrders();
    notify(added ? `Se agregaron ${added} pedidos de prueba.` : "Los pedidos de prueba ya est\xE1n cargados.");
    renderOrders();
    updateHeaderAndBadges();
  });
  $("#btn-reset-demo").addEventListener("click", () => {
    if (confirm("\xBFDeseas restaurar todos los productos, reglas y sin\xF3nimos a los valores de f\xE1brica originales?")) {
      StorageFacade.resetToDefaults();
      notify("Datos restablecidos a los valores demo originales.");
      renderTenantOptions();
      renderAll();
    }
  });
  function openModal(selector) {
    const modal = $(selector);
    modal.classList.remove("hidden");
  }
  function closeModal(selector) {
    const modal = $(selector);
    modal.classList.add("hidden");
  }
  $$(".btn-close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#modal-product, #modal-rule, #modal-synonym, #modal-campaign, #modal-tracking, #modal-audit").forEach((m) => m.classList.add("hidden"));
    });
  });
  function notify(message) {
    const n = $("#notice");
    $("#notice-msg").textContent = message;
    n.classList.remove("hidden");
    setTimeout(() => n.classList.add("hidden"), 3e3);
  }
  $("#tenant-select").addEventListener("change", (e) => {
    StorageFacade.setActiveTenantId(e.target.value);
    testEngine.reset();
    renderAll();
  });
  window.addEventListener("smakbot:data-changed", () => {
    renderTenantOptions();
    renderAll();
  });
  window.addEventListener("storage", () => {
    renderTenantOptions();
    renderAll();
  });
  renderTenantOptions();
  renderAll();
})();
