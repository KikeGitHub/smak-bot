export const STORAGE_KEY = "smakbot-demo-v2";

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
        keywords: ["estante", "organizador", "repisa", "madera"],
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
        keywords: ["escritorio", "mesa", "trabajo", "oficina"],
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
        keywords: ["silla", "ergonomica", "oficina", "sillon"],
        images: [
          "https://images.unsplash.com/photo-1580481077195-c9a918e38817?auto=format&fit=crop&w=900&q=85"
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
          "hay {sku}"
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
          "catalogo completo"
        ],
        response: "Actualmente tenemos estos productos en catálogo:",
        action: "show_catalog"
      },
      {
        id: "rule-envios",
        name: "Tiempos y Costos de Envío",
        type: "static",
        category: "Envíos",
        enabled: true,
        trainingPhrases: [
          "como hacen los envios",
          "cuanto tarda el envio",
          "hacen entregas a domicilio",
          "cuanto cuesta el envio",
          "flete y entrega"
        ],
        response: "Envíos rápidos a todo el país con Cargo Expreso. Tiempo estimado de 1 a 2 días hábiles y flete gratis en compras seleccionadas."
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
          "transferencia bancaria"
        ],
        response: "Puedes pagar en efectivo contra entrega al recibir tu pedido, o bien vía transferencia bancaria (Ficohsa, BAC o Atlántida)."
      },
      {
        id: "rule-ubicacion",
        name: "Ubicación de Sucursal",
        type: "static",
        category: "Ubicación",
        enabled: true,
        trainingPhrases: [
          "donde estan ubicados",
          "direccion de la tienda",
          "tienen tienda fisica",
          "ubicacion sucursal"
        ],
        response: "Nuestra sala de exhibición y punto de retiro principal está en Plaza Krisale. ¡Te esperamos con gusto!"
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
          "entregan en el muelle"
        ],
        response: "Para Roatán e Islas de la Bahía solicitamos transferencia previa y coordinamos la entrega en el muelle de cabotaje de La Ceiba con la naviera que prefieras."
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
          "devoluciones y reclamos"
        ],
        response: "Todos nuestros productos tienen 30 días de garantía total contra cualquier desperfecto de fábrica o daños durante el transporte."
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
          "rebajame"
        ],
        response: "Nuestros precios ya cuentan con el descuento especial directo de promoción. Si deseas cotización de mayoreo por volumen, te puedo transferir con un asesor comercial."
      }
    ],
    synonyms: {
      precio: ["presio", "rebaja", "cuanto cuesta", "cuanto vale", "costo", "valor", "cotizacion"],
      stock: ["disponible", "disponibilidad", "existencia", "inventario", "unidades", "quedan", "hay"],
      dimensiones: ["medidas", "tamano", "talla", "tallas", "alto", "ancho", "largo", "dimension"],
      peso: ["cuanto aguanta", "cuanto soporta", "resistencia", "capacidad", "soporta", "kilos", "libras"],
      fotos: ["fotos reales", "imagenes", "fotografias", "galeria", "mostrar fotos", "ver"],
      envio: ["entrega", "despacho", "flete", "cargo expreso", "encomienda", "paqueteria"],
      pago: ["efectivo", "transferencia", "tarjeta", "contra entrega", "deposito"],
      asesor: ["humano", "persona", "operador", "atencion al cliente", "vendedor", "agente"]
    }
  },
  {
    id: "calzado",
    name: "Calzado Express",
    category: "Calzado",
    initials: "C",
    accent: "#6155c8",
    products: [
      {
        id: "prod-c1",
        sku: "TEN-01",
        name: "Tenis Urban Flex",
        regularPrice: 980,
        salePrice: 850,
        stock: 24,
        dimensions: "Tallas 36–44",
        weightLimit: "Uso diario deportivo",
        keywords: ["tenis", "zapatos", "calzado", "sneakers"],
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-c2",
        sku: "BOT-02",
        name: "Botas Explorer Waterproof",
        regularPrice: 1500,
        salePrice: 1320,
        stock: 8,
        dimensions: "Tallas 38–43",
        weightLimit: "Suela de alto impacto",
        keywords: ["botas", "montana", "cuero", "calzado"],
        images: [
          "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=900&q=85"
        ]
      },
      {
        id: "prod-c3",
        sku: "SAN-03",
        name: "Sandalias Classic Comfort",
        regularPrice: 650,
        salePrice: 500,
        stock: 0,
        dimensions: "Tallas 35–41",
        weightLimit: "Planta ortopédica ligera",
        keywords: ["sandalias", "playa", "verano", "descanso"],
        images: [
          "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=900&q=85"
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
          "hay {sku}"
        ],
        responseInStock: "¡Sí, tenemos existencias! Del calzado SKU **{sku}** ({name}) nos quedan **{stock} pares** a L.{salePrice}. ¿Qué talla necesitas?",
        responseOutOfStock: "El modelo **{name}** (SKU: {sku}) está temporalmente **agotado**. Puedes consultar otros modelos activos.",
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
          "catalogo"
        ],
        response: "Estos son los modelos disponibles en nuestra colección:",
        action: "show_catalog"
      },
      {
        id: "rule-envios-c",
        name: "Envíos y Entregas",
        type: "static",
        category: "Envíos",
        enabled: true,
        trainingPhrases: [
          "envios a domicilio",
          "cuanto tarda la entrega",
          "tiempo de entrega"
        ],
        response: "Envíos express en 1 a 2 días hábiles en las principales ciudades de Honduras."
      },
      {
        id: "rule-pagos-c",
        name: "Pago Contra Entrega",
        type: "static",
        category: "Pagos",
        enabled: true,
        trainingPhrases: [
          "como puedo pagar",
          "formas de pago",
          "pago contra entrega"
        ],
        response: "Puedes pagar en efectivo contra entrega en tu puerta o por transferencia antes del despacho."
      }
    ],
    synonyms: {
      precio: ["presio", "rebaja", "cuanto cuesta", "valor", "costo"],
      stock: ["disponible", "disponibilidad", "existencia", "pares", "quedan", "hay"],
      dimensiones: ["talla", "tallas", "medidas", "tamano", "numero"],
      fotos: ["fotos reales", "imagenes", "fotografias", "ver calzado"],
      envio: ["entrega", "despacho", "cargo expreso"],
      asesor: ["humano", "persona", "operador", "atencion al cliente"]
    }
  }
];
