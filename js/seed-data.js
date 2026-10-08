export const STORAGE_KEY = "smakbot-demo-v3";

export const TENANTS = [
  {
    id: "smak",
    name: "SMAK Muebles",
    category: "Muebles y hogar",
    initials: "S",
    accent: "#0e7a62",
    products: [
      {
        id: "prod-1",
        sku: "EST-01",
        name: "Estante Organizador Premium",
        regularPrice: 1200,
        salePrice: 1050,
        stock: 18,
        dimensions: "120 × 60 × 30 cm",
        weightLimit: "150 lbs",
        keywords: ["estante", "organizador", "repisa", "madera", "librero"],
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
          "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-2",
        sku: "ESC-02",
        name: "Escritorio Minimalista Nórdico",
        regularPrice: 2400,
        salePrice: 1990,
        stock: 6,
        dimensions: "140 × 70 × 75 cm",
        weightLimit: "200 lbs",
        keywords: ["escritorio", "mesa", "trabajo", "oficina", "computadora"],
        images: [
          "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-3",
        sku: "SILL-03",
        name: "Silla Ergonómica Pro Confort",
        regularPrice: 1800,
        salePrice: 1550,
        stock: 0,
        dimensions: "65 × 65 × 115 cm",
        weightLimit: "260 lbs",
        keywords: ["silla", "ergonomica", "oficina", "sillon", "soporte lumbar"],
        images: [
          "https://images.unsplash.com/photo-1580481077195-c9a918e38817?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-4",
        sku: "MESA-04",
        name: "Mesa de Centro Industrial",
        regularPrice: 1500,
        salePrice: 1280,
        stock: 12,
        dimensions: "90 × 50 × 45 cm",
        weightLimit: "100 lbs",
        keywords: ["mesa", "centro", "sala", "hierro", "madera industrial"],
        images: [
          "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-5",
        sku: "LAMP-05",
        name: "Lámpara de Pie Articulada Nórdica",
        regularPrice: 950,
        salePrice: 780,
        stock: 25,
        dimensions: "Altura 160 cm, Base 28 cm",
        weightLimit: "Bombilla LED E27 incluida",
        keywords: ["lampara", "pie", "iluminacion", "luz", "sala", "lectura"],
        images: [
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-6",
        sku: "REP-06",
        name: "Repisas Flotantes Set x3 Hexagonal",
        regularPrice: 600,
        salePrice: 480,
        stock: 30,
        dimensions: "Grande 35cm, Mediana 30cm, Pequeña 25cm",
        weightLimit: "25 lbs por módulo",
        keywords: ["repisas", "flotantes", "decoracion", "pared", "set"],
        images: [
          "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-7",
        sku: "CLO-07",
        name: "Clóset Armario Modular 3 Puertas",
        regularPrice: 4200,
        salePrice: 3750,
        stock: 3,
        dimensions: "180 × 120 × 50 cm",
        weightLimit: "300 lbs distribuidas",
        keywords: ["closet", "armario", "ropero", "habitacion", "ropa"],
        images: [
          "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-8",
        sku: "SOF-08",
        name: "Sofá Cama Reclinable Velvet Gris",
        regularPrice: 5200,
        salePrice: 4600,
        stock: 0,
        dimensions: "190 × 85 × 85 cm (Abierto 190 × 110 cm)",
        weightLimit: "450 lbs",
        keywords: ["sofa", "cama", "sala", "velvet", "sillon cama"],
        images: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85"
        ]
      }
    ],
    rules: [
      {
        id: "rule-stock-sku",
        name: "Consulta de Stock por SKU",
        type: "parametric",
        category: "Inventario",
        enabled: true,
        trainingPhrases: [
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
        responseInStock: "¡Sí, tenemos disponible! Del SKU **{sku}** ({name}) nos quedan **{stock} unidades** a precio de oferta L.{salePrice}. ¿Deseas hacer tu pedido ahora?",
        responseOutOfStock: "El producto **{name}** (SKU: {sku}) se encuentra **agotado** por el momento. 📦 Si gustas te anotamos para avisarte en la próxima reposición.",
        responseNotFound: "No encontré ningún producto con el SKU **{sku}** en nuestro inventario. Escribe *'ver catálogo'* para conocer nuestros códigos activos."
      },
      {
        id: "rule-catalogo",
        name: "Ver Catálogo de Productos",
        type: "static",
        category: "Catálogo",
        enabled: true,
        trainingPhrases: [
          "ver catalogo",
          "que productos tienen",
          "cuales son los productos",
          "muestrame que venden",
          "lista de articulos",
          "catalogo completo",
          "que tienen en venta",
          "mostrar muebles"
        ],
        response: "Actualmente tenemos estos productos en catálogo:",
        action: "show_catalog"
      },
      {
        id: "rule-envios",
        name: "Tiempos y Costos de Envío General",
        type: "static",
        category: "Envíos",
        enabled: true,
        trainingPhrases: [
          "como hacen los envios",
          "cuanto tarda el envio",
          "hacen entregas a domicilio",
          "cuanto cuesta el envio",
          "flete y entrega",
          "envian a domicilio"
        ],
        response: "Hacemos envíos rápidos a todo el país con Cargo Expreso. El tiempo estimado es de 1 a 2 días hábiles y el flete es gratis en compras mayores a L.1,500."
      },
      {
        id: "rule-envio-express",
        name: "Envío Express Mismo Día",
        type: "static",
        category: "Envíos",
        enabled: true,
        trainingPhrases: [
          "tienen envio para hoy",
          "entrega express",
          "lo necesito hoy mismo",
          "envio urgente",
          "pueden entregar hoy"
        ],
        response: "En Tegucigalpa y San Pedro Sula contamos con mensajería express para entrega el mismo día si realizas tu pedido antes de la 1:00 PM con un recargo de L.80."
      },
      {
        id: "rule-pagos",
        name: "Métodos y Formas de Pago",
        type: "static",
        category: "Pagos",
        enabled: true,
        trainingPhrases: [
          "como puedo pagar",
          "formas de pago",
          "aceptan pago contra entrega",
          "puedo pagar en efectivo",
          "transferencia bancaria",
          "que metodos de pago tienen"
        ],
        response: "Puedes pagar en efectivo contra entrega al recibir tu pedido en la puerta de tu casa, o bien vía transferencia bancaria (Ficohsa, BAC, Atlántida o Banpaís)."
      },
      {
        id: "rule-tarjetas",
        name: "Pago con Tarjeta de Crédito / Cuotas",
        type: "static",
        category: "Pagos",
        enabled: true,
        trainingPhrases: [
          "aceptan tarjeta de credito",
          "se puede pagar con tarjeta",
          "tienen tasa cero",
          "tienen cuotas sin intereses",
          "link de pago con tarjeta"
        ],
        response: "¡Sí! Aceptamos tarjetas Visa y Mastercard mediante enlace de pago seguro de BAC Credomatic, con opción a 3 y 6 cuotas con 0% de interés."
      },
      {
        id: "rule-ubicacion",
        name: "Ubicación de Tienda y Sucursal",
        type: "static",
        category: "Ubicación",
        enabled: true,
        trainingPhrases: [
          "donde estan ubicados",
          "direccion de la tienda",
          "tienen tienda fisica",
          "ubicacion sucursal",
          "donde queda el local",
          "como llegar"
        ],
        response: "Nuestra sala de exhibición y punto de retiro principal está ubicada en Plaza Krisale, Boulevard Morazán. Contamos con amplio estacionamiento."
      },
      {
        id: "rule-horarios",
        name: "Horarios de Atención al Cliente",
        type: "static",
        category: "Ubicación",
        enabled: true,
        trainingPhrases: [
          "que horario tienen",
          "a que hora abren",
          "a que hora cierran",
          "atienden domingos",
          "estan abiertos hoy"
        ],
        response: "Atendemos de lunes a sábado de 8:30 AM a 6:00 PM ininterrumpidamente, y domingos de 10:00 AM a 4:00 PM."
      },
      {
        id: "rule-islands",
        name: "Regla para Roatán e Islas de la Bahía",
        type: "static",
        category: "Envíos",
        enabled: true,
        trainingPhrases: [
          "envian a roatan",
          "islas de la bahia",
          "envios a ceiba",
          "entregan en el muelle",
          "hacen envios a guanaja",
          "utila"
        ],
        response: "Para Roatán e Islas de la Bahía solicitamos transferencia previa y coordinamos la entrega en el muelle de cabotaje de La Ceiba con la naviera o embarcación de tu preferencia."
      },
      {
        id: "rule-garantia",
        name: "Garantía de Fábrica",
        type: "static",
        category: "Políticas",
        enabled: true,
        trainingPhrases: [
          "tienen garantia",
          "cuanto tiempo de garantia",
          "si viene quebrado",
          "garantia de los muebles",
          "que pasa si sale defectuoso"
        ],
        response: "Todos nuestros muebles tienen 60 días de garantía total contra cualquier desperfecto de fábrica, herrajes o daño durante el flete."
      },
      {
        id: "rule-devoluciones",
        name: "Política de Cambios y Devoluciones",
        type: "static",
        category: "Políticas",
        enabled: true,
        trainingPhrases: [
          "puedo cambiar el producto",
          "politica de cambios",
          "si no cabe en mi sala",
          "devolucion de dinero"
        ],
        response: "Tienes hasta 7 días posteriores a la entrega para solicitar cambio de modelo o talla siempre que el artículo conserve su empaque y esté en óptimas condiciones."
      },
      {
        id: "rule-factura",
        name: "Facturación Legal y RTN",
        type: "static",
        category: "Políticas",
        enabled: true,
        trainingPhrases: [
          "dan factura con cai",
          "necesito factura con rtn",
          "facturacion fiscal sar",
          "emiten factura para empresa"
        ],
        response: "Emitimos factura legal autorizada por el SAR con número CAI para crédito fiscal. Solo indícanos tu RTN y razón social al momento de confirmar."
      },
      {
        id: "rule-restriccion-descuento",
        name: "Bloqueo: Descuentos no autorizados",
        type: "restriction",
        category: "Restricciones",
        enabled: true,
        trainingPhrases: [
          "me rebaja mas",
          "dejame mas barato",
          "haceme otro descuento",
          "precio de mayoreo",
          "rebajame",
          "cuanto es lo menos"
        ],
        response: "Nuestros precios ya cuentan con el descuento especial directo de promoción. Si deseas cotización de mayoreo por volumen, te puedo transferir con un asesor comercial."
      },
      {
        id: "rule-restriccion-canje",
        name: "Bloqueo: No se aceptan cambios por artículos usados",
        type: "restriction",
        category: "Restricciones",
        enabled: true,
        trainingPhrases: [
          "aceptan articulos a cambio",
          "tengo un mueble usado para canje",
          "hacen trueque",
          "agarran usado como parte de pago"
        ],
        response: "Solo comercializamos artículos 100% nuevos de paquete y no recibimos artículos de segunda mano como forma de pago."
      }
    ],
    synonyms: {
      precio: ["presio", "rebaja", "cuanto cuesta", "cuanto vale", "costo", "valor", "cotizacion", "precio final", "tarifa", "descuento"],
      stock: ["disponible", "disponibilidad", "existencia", "inventario", "unidades", "quedan", "hay", "tienen", "piezas", "existencias"],
      dimensiones: ["medidas", "tamano", "talla", "tallas", "alto", "ancho", "largo", "dimension", "fondo", "centimetros", "metros"],
      peso: ["cuanto aguanta", "cuanto soporta", "resistencia", "capacidad", "soporta", "kilos", "libras", "peso maximo", "carga"],
      fotos: ["fotos reales", "imagenes", "fotografias", "galeria", "mostrar fotos", "ver", "foto", "ver catalogo con fotos"],
      envio: ["entrega", "despacho", "flete", "cargo expreso", "encomienda", "paqueteria", "domicilio", "reparto"],
      pago: ["efectivo", "transferencia", "tarjeta", "contra entrega", "deposito", "forma de pago", "metodo de pago", "cuotas"],
      asesor: ["humano", "persona", "operador", "atencion al cliente", "vendedor", "agente", "ejecutivo", "alguien real"],
      garantia: ["garantía", "seguro", "defecto", "falla", "cobertura", "reclamo", "garantizado"],
      horario: ["horarios", "a que hora abren", "cuando atienden", "atencion", "horario de atencion", "abierto"],
      ubicacion: ["donde estan", "direccion", "sucursal", "local", "tienda", "ubicacion", "plaza", "mapa"],
      factura: ["facturacion", "rtn", "cai", "fiscal", "comprobante", "recibo"]
    }
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
      dimensiones: ["talla", "tallas", "medidas", "tamano", "numero", "horma"],
      fotos: ["fotos reales", "imagenes", "fotografias", "ver calzado", "ver tenis", "foto"],
      envio: ["entrega", "despacho", "cargo expreso", "flete", "a domicilio"],
      pago: ["efectivo", "transferencia", "contra entrega", "tarjeta"],
      asesor: ["humano", "persona", "operador", "atencion al cliente", "agente"]
    }
  }
];
