/**
 * ====================================================================
 * SMAK HONDURAS - CATÁLOGO DE PRODUCTOS & CONFIGURACIÓN
 * ====================================================================
 * 
 * Este archivo centraliza la configuración general y el catálogo de
 * productos de SMAK Honduras.
 * 
 * CÓMO AGREGAR UN PRODUCTO:
 * Copia uno de los bloques de producto dentro del arreglo SMAK_PRODUCTS
 * y cambia su nombre, categoría, fotos y características.
 * 
 * CÓMO QUITAR UN PRODUCTO:
 * Simplemente borra el bloque del producto deseado o cambia "inStock: false".
 * ====================================================================
 */

const SMAK_CONFIG = {
  storeName: "SMAK Honduras",
  slogan: "Creamos los espacios donde vives, trabajas y disfrutas",
  // WhatsApp oficial (formato internacional sin signos: 50498008559)
  whatsappNumber: "50498008559",
  whatsappDisplay: "+504 9800-8559",
  email: "smakhonduras@gmail.com",
  schedule: "Lunes a Viernes: 9:00 am - 7:00 pm",
  shippingNotice: "Envíos disponibles a toda Honduras",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  // Mensaje base para consultas generales de WhatsApp
  generalMessage: "¡Hola SMAK Honduras! Deseo consultar el catálogo y disponibilidad de productos."
};

const SMAK_CATEGORIES = [
  { id: "all", name: "Todos los Productos", icon: "grid" },
  { 
    id: "Sillas y Bancos", 
    name: "Sillas y Bancos", 
    displayName: "SILLAS",
    subtitle: "Línea Tolix, Ejecutivas y Bancos",
    image: "https://static.wixstatic.com/media/f6ccd1_585455612c3744408a737c745f312c3c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
  },
  { 
    id: "Muebles y Organización", 
    name: "Muebles y Organización", 
    displayName: "MUEBLES",
    subtitle: "Mesas Mármol, Escritorios y Percheros",
    image: "https://static.wixstatic.com/media/f6ccd1_2c34eb84c77e430dbc3e36343249ddcd~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
  },
  { 
    id: "Cocina y Baño", 
    name: "Cocina y Baño", 
    displayName: "COCINA Y BAÑO",
    subtitle: "Columnas de Ducha en Acero Inoxidable",
    image: "https://static.wixstatic.com/media/f6ccd1_cede824b013d41a0bfcbd7b870bf6211~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
  },
  { 
    id: "Escaleras", 
    name: "Escaleras", 
    displayName: "ESCALERAS",
    subtitle: "Aluminio Multipropósito de Alta Resistencia",
    image: "https://static.wixstatic.com/media/f6ccd1_298a5327119e41eca093ab5b636ff305~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
  },
  { 
    id: "Salud y Cuidado", 
    name: "Salud y Cuidado", 
    displayName: "SALUD Y MOVILIDAD",
    subtitle: "Sillas de Ruedas Plegables y Confort",
    image: "https://static.wixstatic.com/media/f6ccd1_25b1c5d058b548d0aa0a256ded90d9b9~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
  }
];

const SMAK_PRODUCTS = [
  {
    "id": "e9bff60d-ce89-44a1-83e1-0e0a4471646d",
    "name": "Kit de 4 Bancos Taburete Tolix con Respaldo Smak - Negro",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_9b3b6d535e2f44ce874c930c6439971a~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_59e896ed019a47668a2e46d577225281~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_67a0cce93c20463e914bb0af3468a72d~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_522ccc24d9924dbcb7510ea60521f81b~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_0fe037c544c64b67b703a05bbd9b93ce~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Línea industrial icónica Tolix: estructura de acero al carbono tratada con pintura horneada de alta durabilidad. Perfecta para comedores modernos, barras residenciales, cafeterías y restaurantes.",
    "features": [
      "Acero prensado de alta resistencia con refuerzos inferiores en cruz",
      "Asiento ergonómico reforzado con ranuras de fácil manipulación",
      "Topes protectores de goma antideslizantes para proteger el piso",
      "Diseño apilable / fácil mantenimiento"
    ]
  },
  {
    "id": "f6904b50-8404-405c-90d3-3d39291a0ec1",
    "name": "Kit 4 Bancos Alto Estilo Tolix Smak con Respaldo y Asiento de Madera Negro Mate",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_585455612c3744408a737c745f312c3c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_585455612c3744408a737c745f312c3c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_ae6904da449f475e97db94d828a4f2f8~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_b50b5e1d3aa7419aad4825f45c78e984~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
    ],
    "description": "Línea industrial icónica Tolix: estructura de acero al carbono tratada con pintura horneada de alta durabilidad. Perfecta para comedores modernos, barras residenciales, cafeterías y restaurantes.",
    "features": [
      "Acero prensado de alta resistencia con refuerzos inferiores en cruz",
      "Asiento de madera maciza tratada con barniz protector",
      "Topes protectores de goma antideslizantes para proteger el piso",
      "Diseño apilable / fácil mantenimiento"
    ]
  },
  {
    "id": "20ccd6a1-e83f-45ab-ac5a-850009742278",
    "name": "Set de 4 Sillas Metálicas Tolix Smak con Asiento de Madera - Negro Mate",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_0287a3c74c55474ea2c16d514aed8c44~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_0287a3c74c55474ea2c16d514aed8c44~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_bbf7e76140564929bf2a98df85f6968c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_20f07e461c064e23826ec618a7b1289d~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_2c26235e7cdc4006b43371b2543014ef~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_16602381d2a54912b343c84355aac4ad~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
    ],
    "description": "Línea industrial icónica Tolix: estructura de acero al carbono tratada con pintura horneada de alta durabilidad. Perfecta para comedores modernos, barras residenciales, cafeterías y restaurantes.",
    "features": [
      "Acero prensado de alta resistencia con refuerzos inferiores en cruz",
      "Asiento de madera maciza tratada con barniz protector",
      "Topes protectores de goma antideslizantes para proteger el piso",
      "Diseño apilable / fácil mantenimiento"
    ]
  },
  {
    "id": "32ca80d6-80e1-4967-9d66-d3c6ce2ade12",
    "name": "Set de 4 Sillas Metálicas Estilo Tolix Smak - Negro Mate",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_e5f7a1c7dfc24bb69c17efe4e11becff~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e5f7a1c7dfc24bb69c17efe4e11becff~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
      "https://static.wixstatic.com/media/f6ccd1_34b4fca8a6174da39d5573e512a43a09~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_bda261db88594662a2430aec045e95e9~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_83f2a8a05c7741cab0305a981a207b1f~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_7c384c05ab4342d1a62a44ea275ce68a~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg"
    ],
    "description": "Línea industrial icónica Tolix: estructura de acero al carbono tratada con pintura horneada de alta durabilidad. Perfecta para comedores modernos, barras residenciales, cafeterías y restaurantes.",
    "features": [
      "Acero prensado de alta resistencia con refuerzos inferiores en cruz",
      "Asiento ergonómico reforzado con ranuras de fácil manipulación",
      "Topes protectores de goma antideslizantes para proteger el piso",
      "Diseño apilable / fácil mantenimiento"
    ]
  },
  {
    "id": "eec08e24-64df-43e6-bc8f-e5e1f5dc50c8",
    "name": "Barral Columna de Ducha Ajustable Smak - Acero Inoxidable (Negro Mate)",
    "category": "Cocina y Baño",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_cede824b013d41a0bfcbd7b870bf6211~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_cede824b013d41a0bfcbd7b870bf6211~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_771c9938820247119c84a05e573d2500~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_dbbe2c4a8a464f028794bb098278cfeb~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_9e95fb3908fb48d78e6a5fd9893a5942~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_d76e233b8d6c48f8ab0b0876f03bf0c0~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Columna de ducha ajustable prémium SMAK elaborada en acero inoxidable grado 304 con elegante acabado negro mate antihuellas y anticalcáreo.",
    "features": [
      "Acero inoxidable 304 con recubrimiento de alta duración",
      "Cabezal de lluvia ultrafino con boquillas de silicona autolimpiantes",
      "Ducha de mano ergonómica con manguera reforzada flexible",
      "Barral de altura regulable y selector de flujo preciso"
    ]
  },
  {
    "id": "09894bc9-484e-49f4-ae35-bf194ad497da",
    "name": "Taburete de Altura Ajustable con Respaldo Smak",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_53b24274ff094c6c8351fee0e5a97ca3~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_53b24274ff094c6c8351fee0e5a97ca3~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
      "https://static.wixstatic.com/media/f6ccd1_63853b63a0ca4cb889b86936b30c12e1~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_8420589f72ea43d78f8d8ebb9cd6be63~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_67291f14441c495aa88aeb3ca6bf9ede~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_db035ea651a5483db5734cd1924ce4f5~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Mobiliario y equipamiento con estándar prémium SMAK, fabricado con materiales de alta resistencia, acabados refinados y un diseño moderno que realza cualquier ambiente.",
    "features": [
      "Estructura robusta de máxima estabilidad y duración",
      "Pintura electrostática y acabados de alta resistencia al uso continuo",
      "Garantía directa de SMAK Honduras",
      "Disponibilidad para envíos a todo el territorio hondureño"
    ]
  },
  {
    "id": "975bdf0e-5c14-4d1a-adae-9dd30786b5e7",
    "name": "Silla Bar con Respaldo y Altura Ajustable Smak",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_17b38c26f362413ea77815f7efe4ff39~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_17b38c26f362413ea77815f7efe4ff39~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_cc521a665ebb4de09037d772ec96944e~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_fd22ad5008464251a386bcb2eeef06a6~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_3bfa07fc75cf425885322cd487295909~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_f6d0b2c10ecd475d991edc5eb9470f8f~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Mobiliario y equipamiento con estándar prémium SMAK, fabricado con materiales de alta resistencia, acabados refinados y un diseño moderno que realza cualquier ambiente.",
    "features": [
      "Estructura robusta de máxima estabilidad y duración",
      "Pintura electrostática y acabados de alta resistencia al uso continuo",
      "Garantía directa de SMAK Honduras",
      "Disponibilidad para envíos a todo el territorio hondureño"
    ]
  },
  {
    "id": "e17d8fa8-9703-4288-ae18-436c8a7cbc20",
    "name": "Taburete Rectangular Smak - Negro",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_0f7615b9cad448dab081790a1f370944~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_0f7615b9cad448dab081790a1f370944~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
      "https://static.wixstatic.com/media/f6ccd1_a9cab04f66c94755b6931be48fbe8fbb~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_6d5f5adcf42d4a9d9a471e325723e3e0~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_a942faa0ee884c5ea65fafb3ff54cc6c~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_7ce4fb10e25f4084b1aa1f0ede7aef40~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Mobiliario y equipamiento con estándar prémium SMAK, fabricado con materiales de alta resistencia, acabados refinados y un diseño moderno que realza cualquier ambiente.",
    "features": [
      "Estructura robusta de máxima estabilidad y duración",
      "Pintura electrostática y acabados de alta resistencia al uso continuo",
      "Garantía directa de SMAK Honduras",
      "Disponibilidad para envíos a todo el territorio hondureño"
    ]
  },
  {
    "id": "86529642-55a2-4175-a030-8576c81e7c38",
    "name": "Carrito Organizador de Metal Smak - 3 Niveles con Ruedas",
    "category": "Muebles y Organización",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_f34e9dcc099b420b9d8bc176c70f06c6~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_f34e9dcc099b420b9d8bc176c70f06c6~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
      "https://static.wixstatic.com/media/f6ccd1_24fb3fbd8b2e4a5988a1e5b96b290c8d~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_44a230b490984e9a820303057e22c152~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_77688f03eca149899fff6b4b63e81111~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_87e4e0bee90c4f65820255c7ea5d7429~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Carrito organizador rodante de 3 niveles en metal reforzado con ruedas giratorias de 360º y frenos de seguridad. Ideal para cocina, baño, oficina, estética o talleres.",
    "features": [
      "Bandejas de metal ventiladas con gran capacidad de carga",
      "Ruedas giratorias 360º con sistema de freno",
      "Pintura electrostática resistente al óxido y rayaduras",
      "Estructura compacta de fácil ensamble y limpieza"
    ]
  },
  {
    "id": "f5d1fdf3-8eed-4d1d-8352-7b4e6cb4449b",
    "name": "Escalera Multipropósito de Aluminio Smak 16 Escalones",
    "category": "Escaleras",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_298a5327119e41eca093ab5b636ff305~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_298a5327119e41eca093ab5b636ff305~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_7055262eb0484c64b24a632eed964935~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_c5e7f09fe4b5490f918f133e93c17c74~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_3906a8bda2e14536a8231396ac55a74a~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Escalera multipropósito de 16 escalones construida en aluminio aeronáutico de alta resistencia. Configurable en más de 8 posiciones distintas (tijera, recta, andamio y plataforma).",
    "features": [
      "Aluminio ultrarresistente y ligero de grado profesional",
      "Bloqueos de seguridad automáticos reforzados en cada bisagra",
      "Peldaños estriados antideslizantes de máxima tracción",
      "Capacidad de carga garantizada hasta 150 kg"
    ]
  },
  {
    "id": "fc7b73e4-74fa-4491-a4a0-e9f52eb4ff3a",
    "name": "Silla de Ruedas Plegable Smak - Estructura Resistente y Confort",
    "category": "Salud y Cuidado",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_25b1c5d058b548d0aa0a256ded90d9b9~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_25b1c5d058b548d0aa0a256ded90d9b9~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_5355bae28a104175bd1e1b56dbafff0a~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_dae9c24ef5e74b9687f83b184d52ac32~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_76ae7baa52e64039af2487800bc533a3~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_485395bbbe86465db7ae2b18cc9eb02e~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Silla de ruedas plegable de alta resistencia SMAK, diseñada para proporcionar máxima comodidad, movilidad asistida y transporte seguro para usuarios y familiares.",
    "features": [
      "Chasis de acero esmaltado con plegado ultracompacto para cajuela",
      "Tapicería acolchada impermeable de fácil higienización",
      "Frenos de seguridad bilaterales de accionamiento intuitivo",
      "Reposapiés y apoyabrazos diseñados para máximo confort"
    ]
  },
  {
    "id": "d0e35a7d-dfed-4d18-8ab5-9c59814bd325",
    "name": "Silla Tolix con Respaldo Smak - Negro",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_1540af973aab4a1c97832e727296e2c4~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_1540af973aab4a1c97832e727296e2c4~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
      "https://static.wixstatic.com/media/f6ccd1_59e896ed019a47668a2e46d577225281~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_67a0cce93c20463e914bb0af3468a72d~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_522ccc24d9924dbcb7510ea60521f81b~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_0fe037c544c64b67b703a05bbd9b93ce~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Línea industrial icónica Tolix: estructura de acero al carbono tratada con pintura horneada de alta durabilidad. Perfecta para comedores modernos, barras residenciales, cafeterías y restaurantes.",
    "features": [
      "Acero prensado de alta resistencia con refuerzos inferiores en cruz",
      "Asiento ergonómico reforzado con ranuras de fácil manipulación",
      "Topes protectores de goma antideslizantes para proteger el piso",
      "Diseño apilable / fácil mantenimiento"
    ]
  },
  {
    "id": "33414446-227c-4fab-87a8-0c4c290d39ba",
    "name": "Banco Alto Estilo Tolix Smak con Respaldo y Asiento de Madera - Negro Mate",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_05e3e3f9d650496295eb83f88062824f~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_b50b5e1d3aa7419aad4825f45c78e984~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_ae6904da449f475e97db94d828a4f2f8~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_20f07e461c064e23826ec618a7b1289d~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
    ],
    "description": "Línea industrial icónica Tolix: estructura de acero al carbono tratada con pintura horneada de alta durabilidad. Perfecta para comedores modernos, barras residenciales, cafeterías y restaurantes.",
    "features": [
      "Acero prensado de alta resistencia con refuerzos inferiores en cruz",
      "Asiento de madera maciza tratada con barniz protector",
      "Topes protectores de goma antideslizantes para proteger el piso",
      "Diseño apilable / fácil mantenimiento"
    ]
  },
  {
    "id": "3e4ce701-a46c-41bd-83b2-913d370531d1",
    "name": "Silla Metálica Tolix Smak con Asiento de Madera - Negro Mate",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_2c26235e7cdc4006b43371b2543014ef~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_2c26235e7cdc4006b43371b2543014ef~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_bbf7e76140564929bf2a98df85f6968c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_16602381d2a54912b343c84355aac4ad~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_27c212440c4749c38413baf42e9a43e6~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_61280435440f4a22970ca7fe65c9dcbd~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
    ],
    "description": "Línea industrial icónica Tolix: estructura de acero al carbono tratada con pintura horneada de alta durabilidad. Perfecta para comedores modernos, barras residenciales, cafeterías y restaurantes.",
    "features": [
      "Acero prensado de alta resistencia con refuerzos inferiores en cruz",
      "Asiento de madera maciza tratada con barniz protector",
      "Topes protectores de goma antideslizantes para proteger el piso",
      "Diseño apilable / fácil mantenimiento"
    ]
  },
  {
    "id": "921ae859-6147-4ba4-b1e2-28a5959e1910",
    "name": "Silla Metálica Estilo Tolix Smak - Negro Mate",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_34b4fca8a6174da39d5573e512a43a09~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_34b4fca8a6174da39d5573e512a43a09~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_bda261db88594662a2430aec045e95e9~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_83f2a8a05c7741cab0305a981a207b1f~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_7c384c05ab4342d1a62a44ea275ce68a~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg"
    ],
    "description": "Línea industrial icónica Tolix: estructura de acero al carbono tratada con pintura horneada de alta durabilidad. Perfecta para comedores modernos, barras residenciales, cafeterías y restaurantes.",
    "features": [
      "Acero prensado de alta resistencia con refuerzos inferiores en cruz",
      "Asiento ergonómico reforzado con ranuras de fácil manipulación",
      "Topes protectores de goma antideslizantes para proteger el piso",
      "Diseño apilable / fácil mantenimiento"
    ]
  },
  {
    "id": "9f3ec513-05b3-48b0-97f8-917a00277f62",
    "name": "Silla Ejecutiva Ezri Smak Office",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852795b7166c~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852795b7166c~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_0825632ae3ac4d2c9318cae3995b1d04~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_e1b9104fcc82432da0faaf403cc2bd53~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Silla ergonómica de oficina y ejecutiva de alta gama con soporte lumbar regulable, reposapiés extensible y mecanismo de inclinación sincrónica para jornadas laborales confortables.",
    "features": [
      "Malla transpirable de alta tensión o tapizado prémium",
      "Reposapiés integrado retráctil para momentos de descanso",
      "Regulación de altura neumática y reposabrazos confortables",
      "Base de estrella reforzada con ruedas aptas para todo tipo de piso"
    ]
  },
  {
    "id": "b4384821-66b6-4b07-855b-b92673a4e6a7",
    "name": "Set de Mesas de Centro Nido Smak - Acabado Símil Mármol",
    "category": "Muebles y Organización",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_e91d7101f4414098b49c59675019961d~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e91d7101f4414098b49c59675019961d~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_e4bb54b9d4694581a13c3d5e45804711~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_9953fdd6ec7647dfa1c87a690ef4aedd~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_04d776c508744476b5681289a0b1ac40~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_64b93d3a16c1468cba141776aada33c3~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Mesa auxiliar y centro con tablero de diseño símil mármol y base de herrería geométrica. Aporta un toque moderno y sofisticado a salas de estar, recepciones o dormitorios.",
    "features": [
      "Tablero con recubrimiento de alta resistencia a rayaduras y líquidos",
      "Estructura metálica lacada en negro mate anticorrosivo",
      "Diseño funcional y versátil para diversos estilos de decoración",
      "Topes niveladores en las patas para mayor estabilidad"
    ]
  },
  {
    "id": "138906d5-9299-4c11-a46d-a87d4d68673d",
    "name": "Mesa Auxiliar de Arrime Smak - Acabado Símil Mármol Negro",
    "category": "Muebles y Organización",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_efc071bdbd544b258f3316a031689996~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_efc071bdbd544b258f3316a031689996~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_e03ca97eb51f4c49af2ae92d7d54e4d3~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_9a1f668fc9e54774ae1b98bbd50f2f80~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_95a0975839b64e18ac9f208697d118e2~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp"
    ],
    "description": "Mesa auxiliar y centro con tablero de diseño símil mármol y base de herrería geométrica. Aporta un toque moderno y sofisticado a salas de estar, recepciones o dormitorios.",
    "features": [
      "Tablero con recubrimiento de alta resistencia a rayaduras y líquidos",
      "Estructura metálica lacada en negro mate anticorrosivo",
      "Diseño funcional y versátil para diversos estilos de decoración",
      "Topes niveladores en las patas para mayor estabilidad"
    ]
  },
  {
    "id": "187b3acb-b0c2-4f15-8058-0f69cf493e13",
    "name": "Escritorio de Madera y Hierro 120x60cm Smak",
    "category": "Muebles y Organización",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_4c4a8d50efa54afaabbd8e9cdab674f4~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_4c4a8d50efa54afaabbd8e9cdab674f4~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_ee0596e95e8c4953b9a9a261b4b1f424~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_ad09a9e8bfc24e1bab5da4027c5caa1a~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_f4a63b71dccf45aea7a301c47000690e~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_5f2e0f2f73ee495791e3804b4eab131d~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Mesa de diseño industrial que fusiona madera cálida con perfilería de hierro reforzado. Robusta, atemporal y pensada para uso intensivo diario.",
    "features": [
      "Cubierta de alta densidad con acabado texturizado madera natural",
      "Estructura de hierro estructural con uniones reforzadas",
      "Fácil de limpiar y resistente al desgaste continuo",
      "Espacio amplio para trabajo, estudio o reuniones"
    ]
  },
  {
    "id": "47b664e4-aed9-4fb2-b0d1-3f2a5893ed1f",
    "name": "Mesa Comedor de Madera y Hierro 120x80cm Smak",
    "category": "Muebles y Organización",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_f79ac4221ee04cc2a5a4d744a1cf4c2f~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_f79ac4221ee04cc2a5a4d744a1cf4c2f~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
      "https://static.wixstatic.com/media/f6ccd1_544481ebc2d4438387c5ad9a948e15ed~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_2c45835317344d99b339fa9e002d28d5~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_2c7c5b77acc74a248b77e94808b23077~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_5ece2a926d6a49418de719c30bbe1f44~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Mesa de diseño industrial que fusiona madera cálida con perfilería de hierro reforzado. Robusta, atemporal y pensada para uso intensivo diario.",
    "features": [
      "Cubierta de alta densidad con acabado texturizado madera natural",
      "Estructura de hierro estructural con uniones reforzadas",
      "Fácil de limpiar y resistente al desgaste continuo",
      "Espacio amplio para trabajo, estudio o reuniones"
    ]
  },
  {
    "id": "0c198428-679f-4072-8420-4dedc667b2b6",
    "name": "Silla con Apoya Pies Miles Premium Smak",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f8376366097~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_ab6cf8e2ba824f42bb241f8376366097~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_c7e644f2d03540308fc0f9f80a710a5c~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_859d5295da6c41bc924b6c717b92df8d~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_36dceca5ba4b432fa7c579170315e59e~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_9bbd6f3d04784a12a15188c02c4b78ed~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Silla ergonómica de oficina y ejecutiva de alta gama con soporte lumbar regulable, reposapiés extensible y mecanismo de inclinación sincrónica para jornadas laborales confortables.",
    "features": [
      "Malla transpirable de alta tensión o tapizado prémium",
      "Reposapiés integrado retráctil para momentos de descanso",
      "Regulación de altura neumática y reposabrazos confortables",
      "Base de estrella reforzada con ruedas aptas para todo tipo de piso"
    ]
  },
  {
    "id": "c4b9bab1-dff9-47cf-93e6-a83e7958f408",
    "name": "Silla Ergonómica Ejecutiva Wynn con Apoya Pies Smak",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe66832b37b9b~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e976bd6d652542d28e2fe66832b37b9b~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_636ed51dee0044d7b4bda6507f7879cf~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_e943065f17b944b29536d3c553106d7d~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_ca3bd7f469334d8fa458797bcdecc96c~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_732b7144906f43eba6a96408f6d86528~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Silla ergonómica de oficina y ejecutiva de alta gama con soporte lumbar regulable, reposapiés extensible y mecanismo de inclinación sincrónica para jornadas laborales confortables.",
    "features": [
      "Malla transpirable de alta tensión o tapizado prémium",
      "Reposapiés integrado retráctil para momentos de descanso",
      "Regulación de altura neumática y reposabrazos confortables",
      "Base de estrella reforzada con ruedas aptas para todo tipo de piso"
    ]
  },
  {
    "id": "52149fe7-08eb-4f1c-bef3-39bff9fa9c2c",
    "name": "Silla Gamer Smak - Giratoria 360º Reclinable",
    "category": "Sillas y Bancos",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd4204b526c4~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_e39be5490da5499d8aebdd4204b526c4~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_055d8fc5832e44dd9d50f2017843687b~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_c74b8a4a31474c5c9dc1c72ce123b9e2~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_486150303ad6458b8ba1b3e5589f177a~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg",
      "https://static.wixstatic.com/media/f6ccd1_75598e7b51da40b4b0e1010d8a064f79~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpg"
    ],
    "description": "Silla Gamer ergonómica SMAK diseñada para sesiones prolongadas de juego o trabajo. Mecanismo reclinable hasta 135º, giro de 360º y cojines lumbares y cervicales ajustables.",
    "features": [
      "Reclinación ajustable con bloqueo multiposición",
      "Tapizado en piel sintética prémium transpirable de alta densidad",
      "Pistón hidráulico de gas clase 4 con soporte hasta 150 kg",
      "Ruedas dobles de deslizamiento suave y silencioso"
    ]
  },
  {
    "id": "6e6162f3-1ea0-43a0-981d-970431d2aa9e",
    "name": "Perchero Organizador de Ropa Smak",
    "category": "Muebles y Organización",
    "badge": "",
    "inStock": true,
    "image": "https://static.wixstatic.com/media/f6ccd1_2c34eb84c77e430dbc3e36343249ddcd~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
    "gallery": [
      "https://static.wixstatic.com/media/f6ccd1_2c34eb84c77e430dbc3e36343249ddcd~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp",
      "https://static.wixstatic.com/media/f6ccd1_b14e0bfaf54342d393d319141baab5c5~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_6d9bf1461b00486293a22b590968abf1~mv2.png/v1/fit/w_500,h_500,q_90/file.png",
      "https://static.wixstatic.com/media/f6ccd1_15767f8b18ee4fffa099219f18333889~mv2.png/v1/fit/w_500,h_500,q_90/file.png"
    ],
    "description": "Solución de organización multifuncional y móvil para cocina, recámara, oficina o estética. Estructura de metal con pintura electrostática de alta resistencia.",
    "features": [
      "Bandejas de metal ventiladas con gran capacidad de almacenamiento",
      "Ruedas giratorias 360º con frenos de seguridad",
      "Fácil armado y desplazamiento suave",
      "Diseño compacto que optimiza los espacios reducidos"
    ]
  }
];

// Exportación compatible para navegadores
if (typeof window !== "undefined") {
  window.SMAK_CONFIG = SMAK_CONFIG;
  window.SMAK_CATEGORIES = SMAK_CATEGORIES;
  window.SMAK_PRODUCTS = SMAK_PRODUCTS;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SMAK_CONFIG, SMAK_CATEGORIES, SMAK_PRODUCTS };
}
