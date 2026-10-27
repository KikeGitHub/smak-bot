/**
 * ====================================================================
 * SMAK HONDURAS - WEB BOT CONVERSATIONAL WIDGET
 * Motor conversacional integrado en la vitrina web (Showroom)
 * ====================================================================
 */

(function () {
  // Limpieza y normalización léxica
  const clean = s => String(s || "")
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,:;()"'\\/]/g, " ")
    .trim();

  const tokenize = s => clean(s).split(/\s+/).filter(Boolean);

  // Diccionario de sinónimos para el bot web
  const SYNONYMS = {
    precio: [
      "costo", "cuesta", "valor", "cuanto", "vale", "presio", "rebaja", "cuanto cuesta", "cuanto vale", "cotizacion", "precio final", "tarifa", "descuento",
      "a como sale", "en cuanto sale", "en cuanto me sale", "que cuesta", "cuanto es", "que precio tiene", "a como me lo deja", "a como lo dan",
      "a como esta", "ultimo precio", "precio neto", "promocion", "oferta", "ofertas", "lo menos", "cuanto es lo menos", "descuentos", "rebajas",
      "precio especial", "precio por mayor", "precio por mayoreo", "si compro varios", "precio de oferta"
    ],
    stock: [
      "disponible", "disponibilidad", "quedan", "hay", "tienen", "existencia", "inventario", "unidades", "piezas", "existencias",
      "todavia tienen", "aun tienen", "les queda", "en stock", "stock real", "tienen en existencia", "tienen disponible", "cuantas piezas quedan",
      "cuantas unidades hay", "tienen en bodega", "hay disponible"
    ],
    dimensiones: [
      "dimenciones", "dimencion", "dimension", "dimensiones",
      "medidas", "medida", "mide", "miden", "medir", "cuanto mide", "cuanto miden",
      "tamano", "tamaño", "talla", "tallas",
      "alto", "altura", "ancho", "anchura", "largo", "longitud", "profundidad", "fondo",
      "cm", "centimetros", "metros", "mts", "especificaciones", "ficha tecnica"
    ],
    peso: [
      "cuanto aguanta", "cuanto soporta", "resistencia", "capacidad", "soporta", "kilos", "libras", "peso maximo", "carga",
      "peso soporta", "que peso aguanta", "soporte de peso", "resiste", "firmeza", "capacidad de peso"
    ],
    colores: [
      "color", "colores", "tono", "tonos", "acabado", "acabados", "presentacion", "presentaciones",
      "en que color viene", "en que colores viene", "que colores hay", "que colores tienen",
      "otros colores", "mas colores", "otro color", "blanco", "blanca", "negro", "negra", "cafe", "marron", "gris", "rosa", "rosado", "rojo", "roja", "azul", "dorado", "plateado", "inox", "madera"
    ],
    materiales: [
      "material", "materiales", "de que material es", "de que esta hecho", "armado", "armada",
      "desarmado", "desarmada", "herramientas", "llaves", "tornillos", "manual", "facil de armar", "viene armado", "viene armada",
      "ensamble", "como se arma", "calidad", "acero", "hierro", "aluminio", "madera", "melamina", "malla", "cuero", "pino"
    ],
    envio: [
      "entrega", "entregas", "envios", "domicilio", "casa", "tardan", "tarda", "flete", "cargo expreso", "despacho", "encomienda", "paqueteria", "reparto",
      "cuanto tardan", "cuando llega", "tiempo de entrega", "cobertura", "a mi casa", "a mi puerta",
      "cuanto tiempo tarda", "envian a", "entregan en", "envio gratis", "flete gratis", "venir a dejar", "venirme a dejar",
      "cuanto cobran de envio", "precio de envio", "costo de envio", "envian a todo el pais"
    ],
    pago: [
      "pagar", "pagos", "efectivo", "contra entrega", "tarjeta", "transferencia", "deposito", "forma de pago", "metodo de pago", "cuotas",
      "pagar al recibir", "contraentrega", "al recibir", "le pago al motorista", "como se paga", "como puedo pagar",
      "transfer", "pago contra entrega", "puedo transferir", "transferencia bancaria", "cuentas de banco", "bac", "ficohsa", "atlantida", "banpais",
      "link de pago", "tarjeta de credito", "tarjeta de debito", "efectivo al recibir"
    ],
    direccion: [
      "direccion", "direcciones", "ubicacion", "ubicaciones", "donde entregar", "donde enviar", "lugar de entrega", "destino",
      "calle", "colonia", "barrio", "avenida", "bloque", "casa", "residencial", "sector", "gps", "coordenadas", "mapa",
      "agencia", "sucursal cargo expreso", "oficina cargo expreso", "recoger en agencia", "retiro en agencia", "ocurre", "punto caex",
      "retirar en oficina", "pasar a recoger", "pasar a traer"
    ],
    fotos: [
      "foto", "imagenes", "ver", "fotografias", "fotos reales", "galeria", "mostrar fotos", "ver catalogo con fotos",
      "imagenes reales", "foto real", "fotos del producto", "tienen fotos", "mas fotos", "mandame fotos", "mostrar imagenes"
    ],
    asesor: [
      "humano", "persona", "operador", "contacto", "agente", "telefono", "whatsapp", "atencion al cliente", "vendedor", "ejecutivo", "alguien real",
      "hablar con una persona", "asesor de ventas", "quiero hablar con un humano", "representante", "contacto directo"
    ],
    garantia: [
      "garantía", "seguro", "defecto", "falla", "cobertura", "reclamo", "garantizado",
      "si viene roto", "si sale malo", "si viene defectuoso", "cambio", "devolucion", "respaldo", "si sale con falla", "garantia de fabrica"
    ],
    horario: [
      "horarios", "a que hora abren", "cuando atienden", "atencion", "horario de atencion", "abierto",
      "a que hora entregan", "a que hora vienen", "horario de entrega", "sabado", "sabados", "medio dia", "por la tarde", "por la manana"
    ],
    factura: [
      "facturacion", "rtn", "cai", "fiscal", "comprobante", "recibo",
      "a nombre de empresa", "con sar", "razon social", "factura con rtn", "ocupo factura", "dan factura", "factura legal"
    ],
    compra: [
      "comprar", "pedido", "ordenar", "orden", "quiero comprar", "hacer pedido", "hacer el pedido",
      "quiero pedir", "quiero ordenar", "me interesa comprar", "lo quiero", "la quiero", "lo compro", "la compro",
      "quiero uno", "quiero una", "me lo llevo", "me la llevo", "apartar", "mandar pedido", "deseo comprar",
      "confirmar", "confirmar pedido", "confirmo", "confirmo pedido", "dale viaje", "adelante con el pedido"
    ]
  };

  const stemSpanish = w => {
    const s = String(w || "").trim();
    if (s.endsWith("es") && s.length > 4) return s.slice(0, -2);
    if (s.endsWith("s") && s.length > 3) return s.slice(0, -1);
    return s;
  };

  function matchesConcept(tokens, concept, cleanText = "") {
    const list = SYNONYMS[concept] || [];
    const targets = [concept, ...list].map(clean);
    return targets.some(term => {
      if (term.includes(" ")) {
        return cleanText ? cleanText.includes(term) : false;
      }
      const stemTerm = stemSpanish(term);
      return tokens.some(word => {
        if (term === word) return true;
        if (stemTerm.length >= 3 && stemTerm === stemSpanish(word)) return true;
        return false;
      });
    });
  }

  // Precios representativos de catálogo para checkout en lempiras
  const DEFAULT_PRICES = {
    "Sillas y Bancos": 1250,
    "Muebles y Organización": 1950,
    "Cocina y Baño": 2850,
    "Escaleras": 2200,
    "Salud y Cuidado": 3500
  };

  class WebBotEngine {
    constructor() {
      this.checkout = null;
      this.selectedProduct = null;
    }

    reset() {
      this.checkout = null;
      this.selectedProduct = null;
    }

    // Colors intent detection
    _isColorIntent(cleanText, tokens) {
      const directWords = ["color", "colores", "tono", "tonos", "acabado", "acabados", "presentacion", "presentaciones"];
      if (tokens.some(t => directWords.includes(t))) return true;

      const phrases = [
        "que colores hay", "que colores tienen", "en que colores viene", "en que color viene",
        "que color viene", "de que color es", "que color es", "colores disponibles",
        "otros colores", "mas colores", "otro color", "que tonos hay", "cuales colores hay",
        "hay otros colores", "tienen mas colores", "que colores manejan", "tienen en color",
        "viene en color", "que color tiene", "tienen colores"
      ];
      if (phrases.some(p => cleanText.includes(p))) return true;

      const colorNames = ["blanco", "blanca", "negro", "negra", "marron", "cafe", "gris", "rosa", "rosado", "rojo", "roja", "azul", "verde", "amarillo", "dorado", "plateado", "inox", "madera"];
      const hasColorWord = tokens.some(t => colorNames.includes(t));
      if (hasColorWord) {
        const colorQueryTriggers = ["tienen", "hay", "viene", "la tienen", "lo tienen", "la hay", "lo hay", "color", "tono", "en", "acabado", "busco", "quiero"];
        if (colorQueryTriggers.some(w => cleanText.includes(w)) || tokens.length <= 3) {
          return true;
        }
      }

      return matchesConcept(tokens, "colores");
    }

    _handleColorQuery(rawText, cleanText, tokens, currentProduct, allProducts = []) {
      const colorNames = [
        { key: "blanco", forms: ["blanco", "blanca", "white"] },
        { key: "negro", forms: ["negro", "negra", "black"] },
        { key: "cafe", forms: ["cafe", "cafes", "marron", "marrones", "marrón", "brown"] },
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

      const detectedColors = colorNames.filter(c => c.forms.some(f => cleanText.includes(f)));

      if (currentProduct) {
        const prodColorsClean = clean(currentProduct.colors || "");
        const price = currentProduct.price || DEFAULT_PRICES[currentProduct.category] || 1500;
        const isAvailable = currentProduct.inStock || (currentProduct.stock > 0);

        if (detectedColors.length > 0) {
          const matchesCurrent = detectedColors.some(c => c.forms.some(f => prodColorsClean.includes(f)));

          if (matchesCurrent) {
            return {
              text: `🎨 **¡Sí, disponible!**\n\nEl producto **${currentProduct.name}** cuenta en nuestro catálogo con el acabado oficial en: **${currentProduct.colors}**.\n\n• 🏷️ **Precio:** L.${price.toLocaleString("es-HN")}\n• 📏 **Medidas:** ${currentProduct.dimensions || "Estándar según ficha técnica"}\n• 🚚 **Envío:** ¡Totalmente GRATIS a todo el país vía Cargo Expreso!\n• 💵 **Pago:** En efectivo contra entrega al recibir en tu puerta.\n\n¿Deseas que preparemos tu pedido o tienes alguna otra duda?`,
              product: currentProduct,
              images: currentProduct.gallery?.slice(0, 2) || (currentProduct.image ? [currentProduct.image] : [])
            };
          } else {
            const targetColorKey = detectedColors[0].key;
            const altProduct = allProducts.find(p => p.sku !== currentProduct.sku && clean(p.colors || "").includes(targetColorKey));

            let altText = "";
            if (altProduct) {
              const altPrice = altProduct.price || DEFAULT_PRICES[altProduct.category] || 1500;
              altText = `\n\n💡 **Variante disponible en ese color:** Contamos con **${altProduct.name}** (SKU: ${altProduct.sku}) que viene en acabado **${altProduct.colors}** a precio de **L.${altPrice.toLocaleString("es-HN")}**.`;
            }

            const askedLabel = detectedColors.map(c => c.key).join(" / ");
            return {
              text: `🎨 Para el modelo **${currentProduct.name}** (${currentProduct.sku || 'Catálogo'}), el acabado registrado en fábrica es únicamente: **${currentProduct.colors || "Negro"}** (no viene en ${askedLabel}).${altText}\n\nSi necesitas un modelo o color personalizado, puedo comunicarte con un ejecutivo comercial.`,
              product: currentProduct
            };
          }
        }

        // General color query for current product
        return {
          text: `🎨 **Colores disponibles para ${currentProduct.name} (${currentProduct.sku || 'Catálogo'}):**\n\nEn nuestro catálogo de fábrica, este modelo viene en acabado oficial: **${currentProduct.colors || "Negro"}**.\n\n• 🏷️ **Precio:** L.${price.toLocaleString("es-HN")}\n• 📏 **Dimensiones:** ${currentProduct.dimensions || "Estándar según ficha técnica"}\n• 📦 **Disponibilidad:** ${isAvailable ? "✅ En stock para entrega inmediata" : "⚠️ Agotado"}\n\n¿Deseas conocer las medidas, fotografías reales o preparar tu pedido?`,
          product: currentProduct,
          images: currentProduct.gallery?.slice(0, 2) || (currentProduct.image ? [currentProduct.image] : [])
        };
      }

      // No product active: check if category mentioned
      const categoryKeywords = [
        { name: "Sillas y Sillones", words: ["silla", "sillas", "sillon", "sillones", "gamer", "oficina"] },
        { name: "Taburetes y Bancos Tolix", words: ["taburete", "taburetes", "banco", "bancos", "tolix"] },
        { name: "Muebles, Mesas y Escritorios", words: ["escritorio", "escritorios", "mesa", "mesas", "estante", "estanteria"] },
        { name: "Duchas y Grifería", words: ["ducha", "duchas", "grifo", "monocomando", "pileta"] },
        { name: "Escaleras y Carga", words: ["escalera", "escaleras", "carro", "carga"] }
      ];

      const matchedCat = categoryKeywords.find(c => c.words.some(w => cleanText.includes(w)));
      if (matchedCat) {
        const filtered = allProducts.filter(p => {
          const pClean = clean(`${p.name} ${p.category || ""}`);
          return matchedCat.words.some(w => pClean.includes(w));
        });
        const itemsList = filtered.slice(0, 5).map(p => `• **${p.name}** (${p.sku || 'Catálogo'}): Acabado **${p.colors || "Negro"}**`).join("\n");
        return {
          text: `🎨 **Colores disponibles en la línea de ${matchedCat.name}:**\n\n${itemsList}\n\n¿Por qué modelo en específico te gustaría consultar?`
        };
      }

      // General catalog color overview
      const topItems = allProducts.slice(0, 6).map(p => `• **${p.name}**: **${p.colors || "Negro"}**`).join("\n");
      return {
        text: `🎨 **Guía de Colores y Acabados de SMAK Honduras:**\n\nContamos con acabados de alta durabilidad en pintura electrostática, acero inoxidable y maderas tratadas:\n\n${topItems}\n\n¿Por qué producto en específico deseas consultar sus colores?`
      };
    }

    // Material & assembly intent detection
    _isMaterialIntent(cleanText, tokens) {
      const directWords = [
        "material", "materiales", "madera", "hierro", "acero", "aluminio", "marmol", "nylon",
        "armado", "armada", "desarmado", "desarmada", "herramientas", "llaves", "tornillos", "manual"
      ];
      if (tokens.some(t => directWords.includes(t))) return true;

      const phrases = [
        "de que material es", "que material es", "de que esta hecho", "de que esta fabricado",
        "es de madera", "es de metal", "es de plastico", "es de hierro", "es de acero",
        "viene armado", "viene armada", "viene desarmado", "viene desarmada", "viene en caja",
        "trae herramientas", "trae llaves", "trae tornillos", "incluye herramientas",
        "es facil de armar", "como se arma", "requiere armado", "manual de armado"
      ];
      if (phrases.some(p => cleanText.includes(p))) return true;

      return matchesConcept(tokens, "materiales");
    }

    _handleMaterialQuery(rawText, cleanText, tokens, currentProduct) {
      if (!currentProduct) {
        return {
          text: `📦 **Materiales y Ensamble en SMAK Honduras:**\n\n• Todos nuestros productos son **100% nuevos de paquete** y vienen en su caja sellada con empaque reforzado.\n• **Materiales de alta durabilidad:** Estructuras de acero al carbono, pintura electrostática horneada anticorrosiva, acero inoxidable 304, madera tratada y aleación de aluminio aeroespacial.\n• **Armado sencillo:** Vienen listos para ensamblar con su **manual gráfico paso a paso y kit de herramientas (llaves Allen y tornillos)** incluidas.\n\n¿Por el material de qué producto en específico deseas consultar?`
        };
      }

      let matDetail = "Estructura de alta resistencia y acabados prémium.";
      const pCat = clean(currentProduct.category || "");
      const pName = clean(currentProduct.name || "");
      if (pName.includes("gamer") || pName.includes("sillon") || pName.includes("silla") || pCat.includes("silla")) {
        matDetail = "Estructura interna de acero tubular reforzado, pistón hidráulico clase 4 certificado, tapizado en PU prémium / malla de nylon de alta tenacidad y base reforzada con ruedas silenciosas 360°.";
      } else if (pName.includes("tolix") || pName.includes("taburete") || pName.includes("banco")) {
        matDetail = "Acero al carbono forjado con pintura electrostática anticorrosiva horneada, y asiento reforzado (en modelos con madera, pino natural tratado de alta densidad).";
      } else if (pName.includes("estanteria") || pName.includes("estante") || pName.includes("escritorio") || pName.includes("mesa")) {
        matDetail = "Bastidor estructural de hierro industrial con pintura electrostática mate y superficie de madera melamínica de alta densidad resistente al agua y peso (o mármol sintético en mesas auxiliares).";
      } else if (pName.includes("ducha") || pName.includes("pileta") || pName.includes("monocomando")) {
        matDetail = "Cuerpo en Acero Inoxidable 304 quirúrgico anticorrosivo con acabado negro mate o cepillado inox, cartucho cerámico anti-fugas y boquillas de silicona anticalcárea.";
      } else if (pName.includes("escalera")) {
        matDetail = "Aleación de aluminio estructural de grado aeroespacial, bisagras automáticas de bloqueo de seguridad y zapatas de goma antideslizantes.";
      } else if (pName.includes("ruedas")) {
        matDetail = "Chasis de acero al carbono plegable con cruceta reforzada, frenos bilaterales de estacionamiento y tapicería en lona Oxford transpirable e impermeable.";
      }

      return {
        text: `📦 **Materiales y Ensamble de ${currentProduct.name} (${currentProduct.sku || 'Catálogo'}):**\n\n• **Materiales:** ${matDetail}\n• **Condición:** 100% nuevo de fábrica en caja original sellada.\n• **Armado fácil:** Viene desarmado para protección durante el envío e incluye su **manual gráfico paso a paso** y el **kit completo de herramientas (llaves Allen y tornillería)**. Se arma en pocos minutos sin herramientas adicionales.\n\n¿Te gustaría ordenar el tuyo o consultar alguna otra característica?`,
        product: currentProduct
      };
    }

    // Price intent detection
    _isPriceIntent(cleanText, tokens) {
      if (["costo de envio", "precio del envio", "cuanto vale el envio", "cobran envio"].some(p => cleanText.includes(p))) {
        return false;
      }

      const phrases = [
        "cuanto cuesta", "cuanto vale", "a cuanto sale", "a cuanto esta",
        "cual es el precio", "cual es el valor", "a como sale", "en cuanto sale",
        "en cuanto me lo dejan", "a como me lo deja", "que precio tiene", "precio de"
      ];
      if (phrases.some(p => cleanText.includes(p))) return true;

      const directWords = ["precio", "precios", "costo", "valor"];
      if (tokens.some(t => directWords.includes(t))) return true;

      return matchesConcept(tokens, "precio", cleanText);
    }

    _handlePriceQuery(rawText, cleanText, tokens, currentProduct) {
      if (!currentProduct) {
        return {
          text: `🏷️ **Precios en SMAK Honduras:**\n\nNuestros precios van desde **L.1,050** en taburetes y organizadores, hasta **L.3,390** en sillones ejecutivos con apoyapiés y columnas de ducha de acero inoxidable.\n\n¡Todos incluyen **envío gratuito** a nivel nacional y pago en efectivo contra entrega!\n\n¿Por el precio de qué artículo en específico deseas consultar?`
        };
      }

      const saleP = Number(currentProduct.price || DEFAULT_PRICES[currentProduct.category] || 1500);
      const regP = Number(currentProduct.regularPrice || Math.round(saleP * 1.15));

      return {
        text: `🏷️ **Precio de ${currentProduct.name} (${currentProduct.sku || 'Catálogo'}):**\n\n• **Precio de oferta especial:** **L.${saleP.toLocaleString("es-HN")}** *(Precio regular: L.${regP.toLocaleString("es-HN")})*\n• 🎨 **Color registrado:** **${currentProduct.colors || "Negro"}**\n• 🚚 **Costo de envío:** ¡Completamente **GRATIS** a cualquier parte de Honduras vía Cargo Expreso!\n• 💵 **Forma de pago:** Pagas en efectivo **contra entrega** al recibir en tu puerta (o transferencia bancaria previa).\n\n¿Deseas que preparemos tu pedido o tienes alguna duda de colores o medidas?`,
        product: currentProduct
      };
    }

    // Weight & durability intent
    _isWeightIntent(cleanText, tokens) {
      const phrases = [
        "cuanto peso aguanta", "cuanto peso soporta", "cual es el peso maximo",
        "peso maximo", "soporte de peso", "que peso aguanta", "que peso soporta",
        "cuanto aguanta", "cuanto soporta"
      ];
      if (phrases.some(p => cleanText.includes(p))) return true;

      const directWords = ["resistencia", "soporta", "aguanta", "kilos", "libras", "resiste"];
      if (tokens.some(t => directWords.includes(t)) && !cleanText.includes("transferencia")) return true;

      return matchesConcept(tokens, "peso", cleanText);
    }

    _handleWeightQuery(rawText, cleanText, tokens, currentProduct) {
      if (!currentProduct) {
        return {
          text: `💪 Todos nuestros productos de mobiliario y equipamiento cuentan con estándares de alta resistencia para uso comercial y residencial intensivo. ¿Por qué artículo en particular deseas consultar su capacidad?`
        };
      }
      return {
        text: `💪 **Capacidad y Resistencia de ${currentProduct.name} (${currentProduct.sku || 'Catálogo'}):**\n\n• **Soporte certificado:** **${currentProduct.weightLimit || "150 kg / Uso comercial y residencial de alta resistencia"}**\n• **Estructura:** Diseñada con estándares de máxima durabilidad y estabilidad.\n\n¿Deseas consultar medidas, colores o hacer tu pedido?`,
        product: currentProduct
      };
    }

    // Gratitude detection
    _isGratitude(cleanText, tokens) {
      const phrases = ["muchas gracias", "mil gracias", "te lo agradezco", "muy amable", "ok gracias", "vale gracias"];
      if (phrases.some(p => cleanText.includes(p))) return true;
      return tokens.includes("gracias") && tokens.length <= 4;
    }

    _isDimensionIntent(cleanText, tokens) {
      const directWords = [
        "dimension", "dimensiones", "dimencion", "dimenciones",
        "medida", "medidas", "mide", "miden", "medir",
        "tamano", "altura", "alto", "ancho", "anchura", "largo", "longitud", "profundidad", "fondo", "cm", "centimetros", "metros"
      ];
      if (tokens.some(t => directWords.includes(t))) return true;

      const phrases = [
        "cuanto mide", "cuanto miden", "que medida", "que medidas",
        "cuales son las medidas", "cuales son las dimensiones", "cuales son las dimenciones",
        "medidas de", "medida de", "dimensiones de", "dimenciones de",
        "dimension de", "dimencion de", "que tamano tiene", "tamano del", "tamano de la"
      ];
      if (phrases.some(p => cleanText.includes(p))) return true;

      return matchesConcept(tokens, "dimensiones", cleanText);
    }

    // Detección de retiro en oficinas / agencias de Cargo Expreso o Delivery en Honduras
    _isAgencyAddress(rawText) {
      if (!rawText) return false;
      if (rawText.includes("?") || rawText.includes("¿")) return false;
      const text = clean(rawText);
      if (/^(?:tienen|donde|d[oó]nde|cu[aá]l|cual|cu[aá]ndo|cuando|a qu[eé]|a que|horario|qu[eé]|que)\b/i.test(text)) {
        return false;
      }
      const agencyTerms = [
        "agencia", "oficina", "sucursal", "ocurre", "bodega", "punto caex",
        "retirar en agencia", "recoger en agencia", "retiro en agencia",
        "reclamar en agencia", "reclamar en oficina", "retirar en oficina", "recoger en oficina"
      ];
      const hasAgencyTerm = agencyTerms.some(t => text.includes(t));
      if (!hasAgencyTerm) return false;

      const carrierOrHonduras = [
        "cargo", "expreso", "caex", "paqueteria", "delivery", "encomienda",
        "tegucigalpa", "san pedro", "sps", "ceiba", "choluteca", "comayagua",
        "danli", "juticalpa", "progreso", "puerto cortes", "siguatepeque", "santa rosa",
        "la granja", "kennedy", "los andes", "centro", "circunvalacion", "toncontin"
      ];
      const hasCarrierOrLoc = carrierOrHonduras.some(t => text.includes(t));
      return hasCarrierOrLoc || text.length >= 10;
    }

    // Detección de consultas sobre horarios específicos, sábados y días de entrega
    _isScheduleDeliveryQuery(cleanText, tokens) {
      const schedulePhrases = [
        "horario especifico", "hora especifica", "hora exacta", "horario exacto",
        "a que hora", "que hora", "a que horas", "que horas",
        "pueden entregar a las", "puedo pedir horario", "puedo pedir hora", "pueden venir a las",
        "en la tarde", "en la manana", "por la tarde", "por la manana",
        "despues de las", "antes de las", "medio dia",
        "dia especifico", "que dia", "puedo elegir dia", "puedo escoger dia",
        "sabado", "sabados", "los sabados", "el sabado", "sabado en la tarde", "sabados en la tarde", "sabado por la tarde"
      ];
      if (schedulePhrases.some(p => cleanText.includes(p))) return true;

      const hasTimeWord = tokens.some(t => ["horario", "hora", "horas", "sabado", "sabados"].includes(t));
      const hasDeliveryContext = cleanText.includes("especific") || cleanText.includes("entrega") || cleanText.includes("venir") || cleanText.includes("llegar") || cleanText.includes("tarde") || cleanText.includes("medio dia");
      return Boolean(hasTimeWord && hasDeliveryContext);
    }

    // Detección de consultas generales sobre retiro en agencia
    _isAgencyPickupQuery(cleanText, tokens) {
      const agencyPhrases = [
        "recoger en agencia", "retirar en agencia", "pasar a recoger", "pasar a traer",
        "recoger en oficina", "retirar en oficina", "oficinas de cargo", "agencias de cargo",
        "agencia de cargo", "oficina de cargo", "mandar a agencia", "mandar a oficina",
        "enviar a agencia", "enviar a oficina", "agencias de delivery", "agencia de delivery",
        "oficina cargo expreso", "agencia cargo expreso", "ocurre", "sucursal cargo expreso"
      ];
      return agencyPhrases.some(p => cleanText.includes(p));
    }

    _getPolicyResponse(cleanText, tokens) {
      // 1. Roatán / Útila / Islas de la Bahía
      if (["roatan", "utila", "guanaja", "islas de la bahia", "isla de la bahia", "islas bahia", "ferry", "galaxy wave", "utila dream", "muelle de cabotaje", "cabotaje"].some(t => cleanText.includes(t))) {
        return `🏝️ **Entregas en Roatán, Útila o Islas de la Bahía:**\nPara Roatán o Útila, solo hacemos envíos con **transferencia previa**.\nUna vez nos hace llegar el comprobante de transferencia bancaria, nosotros enviamos el producto hacia el **muelle de cabotaje de La Ceiba** con la indicación de subir el paquete al ferry que usted diga (Utila Dream, Galaxy Wave, etc.).\n⚠️ **Nota:** No cubrimos el costo del ferry (corre por cuenta del cliente).`;
      }

      // 2. Forza u otra paquetería
      if (["forza", "otra paqueteria", "otras paqueterias", "otra empresa", "otra agencia", "fedex", "dhl", "rapido cargo"].some(t => cleanText.includes(t))) {
        return `📦 **Transportadora:** No, únicamente realizamos entregas a través de **Cargo Expreso**.`;
      }

      // 3. Tarjeta de crédito / débito
      if (["tarjeta", "tarjetas", "visa", "mastercard", "pos", "datafast", "link de pago", "credomatic", "terminal"].some(t => cleanText.includes(t))) {
        return `💳 **Forma de Pago con Tarjeta:** No aceptamos pagos con tarjeta, solo pago en efectivo contra entrega y se le paga al operador de Cargo Expreso o por transferencia electrónica previa, pero la transferencia debe confirmarse antes de realizar el envío.`;
      }

      // 4. Ubicación física / Tienda
      if ((cleanText.includes("donde") || cleanText.includes("ubicacion") || cleanText.includes("sucursal") || cleanText.includes("tienda fisica") || cleanText.includes("local") || cleanText.includes("sala de ventas")) && !cleanText.includes("direccion de entrega") && (cleanText.includes("estan") || cleanText.includes("encuentran") || cleanText.includes("queda") || cleanText.includes("tienda") || cleanText.includes("puerto cortes") || cleanText.includes("local") || cleanText.includes("sala"))) {
        return `📍 **Ubicación Física:** Nos encontramos ubicados en **Plaza Krisale, Puerto Cortés, Honduras**.\n\n¡Realizamos envíos gratuitos a domicilio a cualquier parte del país vía Cargo Expreso!`;
      }

      // 5. Costo de envío
      if (["costo de envio", "cuanto cobran", "cuanto vale el envio", "precio del envio", "cobran envio", "cobran el envio", "el envio es gratis", "flete", "flete gratis", "cuanto cobran de flete", "cobran por traerlo", "hay que pagar envio", "el envio tiene costo"].some(t => cleanText.includes(t))) {
        return `🚚 **Costo de Envío:** ¡El envío es **completamente gratuito** a cualquier parte del país! Solo cancelas el valor del producto al recibirlo en efectivo contra entrega.`;
      }

      // 6. Garantía
      if (["garantia", "garantias", "defecto", "desperfecto", "si viene roto", "si sale malo", "si viene quebrado", "falla de fabrica", "si sale con falla"].some(t => cleanText.includes(t))) {
        return `🛡️ **Garantía:** Cuentan con garantía únicamente contra **defectos de fabricación**.`;
      }

      // 7. ¿Son nuevas?
      if (["son nuevas", "son nuevos", "muebles nuevos", "productos nuevos", "es nuevo", "usado", "de segunda", "de paquete", "sellado", "sellados"].some(t => cleanText.includes(t))) {
        return `✨ **Condición del Producto:** Sí, todos nuestros productos son **100% nuevos de fábrica** en su caja original sellada.`;
      }

      // 8. Mejor precio / descuento
      if (["mejor precio", "descuento", "rebaja", "cuanto es lo menos", "mayoreo", "por mayor", "en cuanto me lo deja", "si compro varios", "precio especial"].some(t => cleanText.includes(t))) {
        return `🏷️ **Mejor Precio:** El precio especial sería equivalente a la cantidad de piezas solicitadas por el cliente. Si necesitas ordenar varias piezas o mayoreo, indícanos cuántas unidades deseas y con gusto te cotizamos.`;
      }

      return null;
    }

    _getScheduleAndAgencyExplanation() {
      return `🚚 **Información sobre Horarios y Agencias de Cargo Expreso:**\n\n• **Ruta a domicilio:** Las entregas se realizan de Lunes a Viernes de 8:00 AM a 5:00 PM, y los **Sábados únicamente medio día** (hasta las 12:00 PM).\n• **Dependencia de la agencia:** Como las entregas se coordinan con la empresa de transporte (**Cargo Expreso / agencias de delivery en Honduras**), las rutas dependen directamente de su logística diaria. Por esta razón, **no depende de nosotros garantizar un horario específico o día fijo en tiempo y forma** (el motorista siempre te llamará antes de llegar a tu domicilio).\n\n💡 **Recomendación (Retiro en Agencia):** Si necesitas un horario muy específico o no estás seguro de estar en casa, **te sugerimos solicitar el paquete para retiro en una agencia u oficina de Cargo Expreso** en tu ciudad. Tu paquete te esperará en ventanilla para recogerlo a tu conveniencia (ten presente que los sábados también atienden medio día).`;
    }

    startCheckout(product = null, initialQty = 1) {
      const allProducts = window.SMAK_PRODUCTS || [];
      const prod = product || this.selectedProduct || allProducts[0] || { name: "Mueble SMAK", category: "Muebles y Organización" };
      const unitPrice = prod.price || DEFAULT_PRICES[prod.category] || 1500;
      const qty = Number(initialQty) > 0 ? Number(initialQty) : 1;

      // Generate order number connecting to existing state or sequential
      let orderNumber = "SMAK-ORD-1001";
      try {
        const saved = localStorage.getItem("smakbot-demo-v5");
        if (saved) {
          const state = JSON.parse(saved);
          const count = Array.isArray(state.orders) ? state.orders.length : 0;
          orderNumber = `SMAK-ORD-${String(1001 + count).padStart(4, "0")}`;
        }
      } catch (e) {}

      this.checkout = {
        step: "name",
        product: prod,
        orderNumber,
        unitPrice,
        quantity: qty,
        quantityLabel: "",
        total: unitPrice * qty,
        name: "",
        recipientName: "",
        address: "",
        isAgencyPickup: false,
        phone: "",
        postalCode: null,
        requiresInvoice: false,
        rtn: null,
        businessName: null
      };

      return {
        text: `¡Excelente elección! Preparo tu orden (*N° ${orderNumber}*) para **${prod.name}** (*L.${unitPrice.toLocaleString("es-HN")}*).\n\n¿A qué nombre registramos tu pedido?`
      };
    }

    _buildOrderConfirmation(c) {
      const prod = c.product;
      const invoiceTxt = c.requiresInvoice 
        ? `Sí (RTN: ${c.rtn} · ${c.businessName})` 
        : "No (Consumidor Final)";
      const deliverySummary = c.isAgencyPickup
        ? `🏢 Retiro en Agencia Cargo Expreso (${c.address})`
        : c.address;

      return {
        text: `📋 **Resumen de tu pedido (${c.orderNumber})**:\n• Producto: **${prod.name}**\n• Cantidad / Piezas: **${c.quantityLabel || (c.quantity + " unid.")}**\n• Total a pagar: **L.${Number(c.total).toLocaleString("es-HN")}**\n• Destinatario: ${c.recipientName || c.name}\n• Entrega: ${deliverySummary}\n• Contacto (Llamadas Cargo Expreso): ${c.phone}\n• Facturación: **${invoiceTxt}**\n\nPresiona el botón abajo para confirmar tu compra contra entrega.`,
        order: {
          orderNumber: c.orderNumber,
          name: c.name,
          recipientName: c.recipientName || c.name,
          address: c.address,
          isAgencyPickup: Boolean(c.isAgencyPickup),
          phone: c.phone,
          postalCode: c.postalCode || null,
          productName: prod.name,
          sku: prod.sku || "",
          quantity: c.quantity,
          quantityLabel: c.quantityLabel || `${c.quantity} unid.`,
          requiresInvoice: c.requiresInvoice,
          rtn: c.rtn,
          businessName: c.businessName,
          total: Number(c.total),
          price: Number(c.total)
        }
      };
    }

    confirmOrder() {
      const c = this.checkout;
      if (!c || c.step !== "confirm") return null;

      const nowIso = new Date().toISOString();
      const orderData = {
        id: "web-" + Date.now(),
        tenantId: "smak",
        orderNumber: c.orderNumber,
        name: c.name,
        recipientName: c.recipientName || c.name,
        address: c.address,
        isAgencyPickup: Boolean(c.isAgencyPickup),
        phone: c.phone,
        postalCode: c.postalCode || null,
        productName: c.product.name,
        sku: c.product.id ? c.product.id.slice(0, 8).toUpperCase() : "SMAK-WEB",
        quantity: c.quantity,
        quantityLabel: c.quantityLabel || `${c.quantity} unid.`,
        requiresInvoice: c.requiresInvoice,
        rtn: c.rtn,
        businessName: c.businessName,
        total: c.total,
        status: "pendiente",
        trackingNumber: null,
        trackingCarrier: "Cargo Expreso",
        source: "landing_page_widget",
        createdAt: nowIso,
        audit: {
          ip: "190.92.112.45 (Tegucigalpa, HN)",
          userAgent: navigator.userAgent || "Web Client",
          source: "landing_page_widget",
          createdAt: nowIso,
          history: [
            {
              action: "creacion_pedido",
              status: "pendiente",
              timestamp: nowIso,
              note: `Pedido ${c.orderNumber} creado desde Showroom Web (${c.quantityLabel || c.quantity + ' unid.'}). Facturación: ${c.requiresInvoice ? 'Sí (con RTN)' : 'No'}.`
            }
          ]
        }
      };

      // Sincronizar en localStorage bajo smakbot-demo-v5 para que aparezca en el panel admin.html
      try {
        const storageKey = "smakbot-demo-v5";
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const state = JSON.parse(saved);
          if (Array.isArray(state.orders)) {
            state.orders.unshift(orderData);
            localStorage.setItem(storageKey, JSON.stringify(state));
            window.dispatchEvent(new CustomEvent("smakbot:data-changed"));
          }
        }
      } catch (e) {
        console.warn("Storage sync error:", e);
      }

      this.checkout = null;
      return orderData;
    }

    _isConfirmIntent(cleanText, rawText) {
      const isQuestion = rawText.includes("?") || rawText.includes("¿") || 
        /^(?:puedo|como|c[oó]mo|cu[aá]ndo|cuando|cu[aá]nto|cuanto|d[oó]nde|donde|qu[eé]|que|por qu[eé]|por que|aceptan|tienen|hay)\b/i.test(cleanText);
      if (isQuestion) return false;

      const explicitConfirm = [
        "confirmar", "confirmar pedido", "confirmar compra", "confirmo", "confirmo pedido", "confirmo mi compra",
        "proceder", "proceder con la compra", "proceder con el pedido", "cerrar pedido", "cerrar compra", "comprar ahora",
        "si confirmar", "si confirmo", "si deseo comprar", "adelante con el pedido", "hagan el envio", "hacer el envio",
        "mandelo", "mandemelo", "envielo", "envienlo", "dale viaje", "todo correcto", "todo bien", "esta perfecto",
        "lo quiero", "la quiero", "si lo quiero", "si la quiero"
      ].some(w => cleanText.includes(w));
      if (explicitConfirm) return true;

      const exactConfirmWords = [
        "si", "ok", "listo", "correcto", "dale", "adelante", "comprar", "proceder", "de acuerdo",
        "perfecto", "va", "esta bien", "todo bien", "todo correcto", "mandelo", "envielo", "claro",
        "por favor", "si claro", "si gracias", "si por favor"
      ];
      const isExact = exactConfirmWords.includes(cleanText);
      const startsWithOkOrSi = /^(?:si|ok|listo|dale|adelante|claro)\b\s*(?:por favor|amigo|amiga|gracias|esta bien|proceda|mandelo|envielo|confirmado)?$/i.test(cleanText);

      return (isExact || startsWithOkOrSi);
    }

    _handleOrderModifications(c, rawText, cleanText, tokens, products = [], location = null) {
      // 1. Ubicación GPS / Location
      if (location) {
        const locName = location.address || location.name || "Ubicación GPS registrada";
        c.address = locName;
        c.location = location;
        return {
          modified: true,
          field: "location",
          ack: `✏️ ¡Listo! Hemos actualizado tu ubicación de entrega a: **${locName}** 📍`
        };
      }

      // 2. Modificación de Dirección (Texto)
      const isAddressPromptOnly = /^(?:cambiar|modificar|corregir)?\s*(?:la\s+)?(?:direccion|entrega|ubicacion)$/i.test(cleanText.trim());
      if (isAddressPromptOnly) {
        c.step = "address";
        return {
          redirect: true,
          prompt: `Por favor compártenos tu nueva dirección de entrega detallada:\n\n• **Nombre del destinatario**\n• **Calle y número de casa / referencia**\n• **Colonia, barrio o sector**\n• **Ciudad / Municipio**\n• **Código postal**`
        };
      }

      const addressChangeMatch = rawText.match(/(?:entregar|mandar|llevar|enviar)\b\s*(?:en|a)\s*[:\-]?\s*(.+)/i) ||
                                 rawText.match(/(?:mi\s+nueva\s+direcci[oó]n\s+es|mi\s+direcci[oó]n\s+es)\s*[:\-]?\s*(.+)/i) ||
                                 rawText.match(/(?:cambiar|modificar|corregir|actualizar)?\s*(?:la\s+)?(?:direcci[oó]n|entrega|ubicaci[oó]n)\b\s*(?:a|por|es|ser[ií]a)?\s*[:\-]?\s*(.+)/i);
      if (addressChangeMatch && addressChangeMatch[1] && addressChangeMatch[1].trim().length >= 6) {
        const newAddress = addressChangeMatch[1].trim();
        if (!newAddress.includes("?") && !newAddress.includes("¿") && !cleanText.startsWith("donde")) {
          c.address = newAddress;
          c.isAgencyPickup = this._isAgencyAddress(newAddress);
          const cpMatch = newAddress.match(/\b\d{5}\b/);
          if (cpMatch) c.postalCode = cpMatch[0];
          const ackText = c.isAgencyPickup
            ? `✏️ ¡Listo! Hemos actualizado tu entrega para **retiro en agencia de Cargo Expreso**: **${c.address}** (Recordando que los sábados atienden únicamente medio día).`
            : `✏️ ¡Listo! Hemos actualizado tu dirección de entrega a: **${c.address}**.`;
          return {
            modified: true,
            field: "address",
            ack: ackText
          };
        }
      }

      // 3. Modificación de Teléfono
      const isPhonePromptOnly = /^(?:cambiar|modificar|corregir)?\s*(?:el\s+)?(?:telefono|celular|cel|numero|num)$/i.test(cleanText.trim());
      if (isPhonePromptOnly) {
        c.step = "phone";
        return {
          redirect: true,
          prompt: `Por favor compártenos tu nuevo **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega 📞:`
        };
      }

      const phoneChangeMatch = rawText.match(/(?:cambiar|modificar|corregir|actualizar)?\s*(?:el\s+)?(?:tel[eé]fono|celular|cel|n[uú]mero|num)\b\s*(?:a|por|es|ser[ií]a)?\s*[:\-]?\s*([+0-9\s\-]{8,20})/i) ||
                               rawText.match(/(?:mi\s+(?:nuevo\s+)?(?:tel[eé]fono|celular|cel|n[uú]mero)\s+es)\s*[:\-]?\s*([+0-9\s\-]{8,20})/i);
      const standalonePhone = rawText.trim().match(/^[+]?[\d\s\-]{8,16}$/);

      if ((phoneChangeMatch && phoneChangeMatch[1]) || (standalonePhone && !cleanText.includes("rtn"))) {
        const rawNum = (phoneChangeMatch && phoneChangeMatch[1]) || standalonePhone[0];
        const digits = rawNum.replace(/\D/g, "");
        if (digits.length >= 8 && digits.length <= 15) {
          c.phone = rawNum.trim();
          return {
            modified: true,
            field: "phone",
            ack: `✏️ ¡Listo! Hemos actualizado tu número de contacto para llamadas de Cargo Expreso a: **${c.phone}** 📞.`
          };
        }
      }

      // 4. Modificación de Facturación / RTN / Razón Social
      const isCancelInvoice = cleanText.includes("sin factura") || cleanText.includes("no quiero factura") || cleanText.includes("no ocupo factura") || cleanText.includes("ya no quiero factura") || cleanText.includes("factura no") || cleanText.includes("consumidor final");
      if (isCancelInvoice) {
        c.requiresInvoice = false;
        c.rtn = null;
        c.businessName = null;
        return {
          modified: true,
          field: "invoice",
          ack: `✏️ ¡Listo! Se ha actualizado tu pedido a **Sin Factura (Consumidor Final)**.`
        };
      }

      const isInvoicePromptOnly = /^(?:cambiar|modificar|agregar|ocupo|quiero|poner|solicitar)?\s*(?:la\s+)?factura$/i.test(cleanText.trim());
      if (isInvoicePromptOnly) {
        c.step = "invoice_rtn";
        return {
          redirect: true,
          prompt: `¡Con gusto te emitimos factura fiscal! 🧾\n\nPor favor compártenos tu número de **RTN** (14 dígitos):`
        };
      }

      const rtnChangeMatch = rawText.match(/\b\d{14}\b/) || rawText.match(/\b\d{8,14}\b/);
      const hasInvoiceIntent = cleanText.includes("rtn") || cleanText.includes("factura") || cleanText.includes("razon social") || cleanText.includes("razón social");
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
          ack: `✏️ ¡Listo! Hemos actualizado los datos de facturación:\n• **RTN:** ${c.rtn}\n• **Razón Social:** ${c.businessName}`
        };
      }

      const bizNameMatch = rawText.match(/(?:cambiar|modificar|corregir)?\s*(?:la\s+)?raz[oó]n\s+social\b\s*(?:a|por|es)?\s*[:\-]?\s*(.+)/i);
      if (bizNameMatch && bizNameMatch[1]) {
        c.requiresInvoice = true;
        c.businessName = bizNameMatch[1].trim();
        return {
          modified: true,
          field: "invoice",
          ack: `✏️ ¡Listo! Hemos actualizado la razón social para la factura a: **${c.businessName}**.`
        };
      }

      // 5. Modificación de Nombre / Destinatario
      const isNamePromptOnly = /^(?:cambiar|modificar|corregir)?\s*(?:el\s+)?(?:nombre|destinatario)$/i.test(cleanText.trim());
      if (isNamePromptOnly) {
        c.step = "name";
        return {
          redirect: true,
          prompt: `Por favor indícanos el nuevo nombre del **destinatario** (quién recibe el paquete):`
        };
      }

      const nameChangeMatch = rawText.match(/(?:cambiar|modificar|corregir|actualizar)?\s*(?:el\s+)?(?:nombre|destinatario)\b\s*(?:a|por|es|ser[ií]a)?\s*[:\-]?\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40})/i) ||
                              rawText.match(/(?:a\s+nombre\s+de)\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40})/i) ||
                              rawText.match(/(?:el\s+destinatario\s+es)\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40})/i);
      if (nameChangeMatch && nameChangeMatch[1] && !hasInvoiceIntent && !cleanText.includes("transferencia")) {
        const candidateName = nameChangeMatch[1].trim();
        if (!candidateName.toLowerCase().includes("banco") && !candidateName.toLowerCase().includes("smak")) {
          c.recipientName = candidateName;
          c.name = candidateName;
          return {
            modified: true,
            field: "name",
            ack: `✏️ ¡Listo! Hemos actualizado el nombre del destinatario a: **${c.recipientName}**.`
          };
        }
      }

      // 6. Modificación de Cantidad / Piezas
      const isQtyPromptOnly = /^(?:cambiar|modificar|corregir)?\s*(?:la\s+)?(?:cantidad|piezas|unidades)$/i.test(cleanText.trim());
      if (isQtyPromptOnly) {
        c.step = "quantity";
        return {
          redirect: true,
          prompt: `¿Cuántas piezas o unidades deseas ordenar para **${c.product.name}**? (Ejemplo: *1 kit*, *2 lámparas*, *3 escritorios*... o solo el número):`
        };
      }

      const wordToNum = { una: 1, un: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10 };
      let detectedQty = null;
      let customQtyLabel = "";

      const qtyRegex = /(?:cambiar|modificar|actualizar)?\s*(?:la\s+)?(?:cantidad|piezas?|unidades?)\b\s*(?:a|por|es|ser[ií]a)?\s*[:\-]?\s*(\d+)/i;
      const matchExplicitQty = rawText.match(qtyRegex);
      if (matchExplicitQty && matchExplicitQty[1]) {
        detectedQty = parseInt(matchExplicitQty[1], 10);
        customQtyLabel = `${detectedQty} ${detectedQty === 1 ? 'unidad' : 'unidades'}`;
      } else {
        const qtyPhraseRegex = /(?:ponme|poner|agregame|agregar|agr[eé]game|solo\s+quiero|solo\s+deseo|solo|quiero|deseo|ser[ií]an?|mejor|bajar\s+a|subir\s+a|aumentar\s+a|cambiar\s+a)\s+(\d+|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b\s*([a-záéíóúñ\s]+)?/i;
        const phraseMatch = rawText.match(qtyPhraseRegex);
        if (phraseMatch && !hasInvoiceIntent && !phoneChangeMatch && !addressChangeMatch) {
          const tokenVal = phraseMatch[1].toLowerCase();
          const numVal = wordToNum[tokenVal] || parseInt(tokenVal, 10);
          if (!isNaN(numVal) && numVal > 0 && numVal <= 100) {
            detectedQty = numVal;
            const noun = (phraseMatch[2] || "").trim().replace(/(?:por favor|gracias|amigo|amiga).*/i, "").trim();
            customQtyLabel = noun ? `${detectedQty} ${noun}` : `${detectedQty} ${detectedQty === 1 ? 'unidad' : 'unidades'}`;
          }
        }
      }

      if (detectedQty !== null && detectedQty > 0) {
        c.quantity = detectedQty;
        c.quantityLabel = customQtyLabel || `${detectedQty} ${detectedQty === 1 ? 'unidad' : 'unidades'}`;
        const unitPrice = Number(c.product.price || c.unitPrice || DEFAULT_PRICES[c.product.category] || 1500);
        c.total = unitPrice * detectedQty;
        return {
          modified: true,
          field: "quantity",
          ack: `✏️ ¡Listo! Hemos actualizado la cantidad a **${c.quantityLabel}** (Nuevo total: **L.${Number(c.total).toLocaleString("es-HN")}**).`
        };
      }

      // 7. Modificación de Producto
      const isProductChangeIntent = ["cambiar por", "cambiar a", "mejor el", "mejor la", "cambiar producto", "quiero el", "quiero la", "en vez de", "en lugar de"].some(p => cleanText.includes(p));
      if (isProductChangeIntent) {
        const allProds = (products && products.length) ? products : (window.SMAK_PRODUCTS || []);
        for (const p of allProds) {
          if (cleanText.includes(clean(p.name)) || (p.id && cleanText.includes(clean(p.id)))) {
            if (p.id !== c.product.id) {
              c.product = p;
              const unitPrice = Number(p.price || DEFAULT_PRICES[p.category] || 1500);
              c.unitPrice = unitPrice;
              c.total = unitPrice * c.quantity;
              c.quantityLabel = `${c.quantity} ${c.quantity === 1 ? 'unidad' : 'unidades'}`;
              return {
                modified: true,
                field: "product",
                ack: `✏️ ¡Listo! Hemos cambiado el producto de tu pedido a **${p.name}** (Nuevo total: **L.${Number(c.total).toLocaleString("es-HN")}**).`
              };
            }
          }
        }
      }

      return { modified: false };
    }


    findProduct(query) {
      const allProducts = window.SMAK_PRODUCTS || [];
      if (!allProducts.length) return null;

      const q = clean(query);
      if (!q) return null;

      // 0. Coincidencia por SKU exacto o contenido
      const skuFound = allProducts.find(p => p.sku && (q.includes(clean(p.sku)) || clean(p.sku).includes(q)));
      if (skuFound) return skuFound;

      // 1. Coincidencia exacta o contenida por nombre
      let found = allProducts.find(p => clean(p.name).includes(q) || q.includes(clean(p.name)));
      if (found) return found;

      // 2. Coincidencia por términos clave (Tolix, Escritorio, Perchero, Regadera, Escalera, Banco, etc.)
      const keywords = ["tolix", "banco", "taburete", "silla", "escritorio", "mesa", "perchero", "regadera", "ducha", "drenaje", "escalera", "ruedas"];
      for (const kw of keywords) {
        if (q.includes(kw)) {
          found = allProducts.find(p => clean(p.name).includes(kw));
          if (found) return found;
        }
      }

      return null;
    }

    reply(message) {
      const rawText = String(message || "").trim();
      const cleanText = clean(rawText);
      const tokens = tokenize(rawText);

      if (!cleanText) {
        return { text: "¡Hola! ¿En qué puedo ayudarte hoy sobre nuestro catálogo de muebles y equipamiento?" };
      }

      // 1. Checkout conversacional
      if (this.checkout) {
        const c = this.checkout;
        if (c.step === "name") {
          const policy = this._getPolicyResponse(cleanText, tokens);
          if (policy) {
            return {
              text: `${policy}\n\nPara preparar tu orden, ¿a qué nombre registramos tu pedido?`
            };
          }
          if (cleanText.includes("transferencia") || cleanText.includes("transfer") || cleanText.includes("como pago")) {
            return {
              text: `¡Sí, aceptamos transferencia bancaria y efectivo contra entrega! 🏦\n\nCuentas oficiales (SMAK Honduras S. de R.L.):\n• BAC: 742-108-951 · Ficohsa: 2000-098-432 · Atlántida: 110-045-892\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?`
            };
          }
          if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
            const expl = this._getScheduleAndAgencyExplanation();
            return {
              text: `${expl}\n\nPara preparar tu orden, ¿a qué nombre registramos tu pedido?`
            };
          }
          if (this._isColorIntent(cleanText, tokens, SYNONYMS)) {
            const cq = this._handleColorQuery(rawText, cleanText, tokens, c.product, window.SMAK_PRODUCTS || []);
            return {
              text: `${cq.text}\n\nPara preparar tu orden, ¿a qué nombre registramos tu pedido?`
            };
          }
          if (this._isPriceIntent(cleanText, tokens)) {
            const pq = this._handlePriceQuery(rawText, cleanText, tokens, c.product);
            return {
              text: `${pq.text}\n\nPara preparar tu orden, ¿a qué nombre registramos tu pedido?`
            };
          }
          if (this._isMaterialIntent(cleanText, tokens)) {
            const mq = this._handleMaterialQuery(rawText, cleanText, tokens, c.product);
            return {
              text: `${mq.text}\n\nPara preparar tu orden, ¿a qué nombre registramos tu pedido?`
            };
          }
          if (this._isDimensionIntent(cleanText, tokens)) {
            const p = c.product;
            return {
              text: `📏 **Medidas de ${p.name}:** **${p.dimensions || 'Estándar según ficha técnica'}** (Capacidad: ${p.weightLimit || 'Uso comercial y residencial'}).\n\nPara preparar tu orden, ¿a qué nombre registramos tu pedido?`
            };
          }
          c.name = rawText.trim();
          c.recipientName = c.name;
          c.step = "quantity";
          return {
            text: `Mucho gusto, ${c.name}. ¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):`
          };
        }
        if (c.step === "quantity") {
          const policy = this._getPolicyResponse(cleanText, tokens);
          if (policy) {
            return {
              text: `${policy}\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):`
            };
          }
          if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
            const expl = this._getScheduleAndAgencyExplanation();
            return {
              text: `${expl}\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):`
            };
          }
          if (this._isColorIntent(cleanText, tokens, SYNONYMS)) {
            const cq = this._handleColorQuery(rawText, cleanText, tokens, c.product, window.SMAK_PRODUCTS || []);
            return {
              text: `${cq.text}\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):`
            };
          }
          if (this._isPriceIntent(cleanText, tokens)) {
            const pq = this._handlePriceQuery(rawText, cleanText, tokens, c.product);
            return {
              text: `${pq.text}\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):`
            };
          }
          if (this._isMaterialIntent(cleanText, tokens)) {
            const mq = this._handleMaterialQuery(rawText, cleanText, tokens, c.product);
            return {
              text: `${mq.text}\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):`
            };
          }
          if (this._isDimensionIntent(cleanText, tokens)) {
            const p = c.product;
            return {
              text: `📏 **Medidas de ${p.name}:** **${p.dimensions || 'Estándar según ficha técnica'}** (Capacidad: ${p.weightLimit || 'Uso comercial y residencial'}).\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):`
            };
          }
          let q = 1;
          const match = rawText.match(/\d+/);
          if (match) {
            q = Math.max(1, parseInt(match[0], 10));
          } else {
            const numWords = { "un": 1, "uno": 1, "una": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5, "seis": 6, "diez": 10, "docena": 12 };
            for (const [w, val] of Object.entries(numWords)) {
              if (tokens.includes(w)) {
                q = val;
                break;
              }
            }
          }
          c.quantity = q;
          c.quantityLabel = rawText.trim() || `${q} ${q === 1 ? 'unidad' : 'unidades'}`;
          c.total = c.unitPrice * q;
          c.step = "address";
          return {
            text: `Anotado: **${c.quantityLabel}** (Total: L.${c.total.toLocaleString("es-HN")}).\n\n🚚 Para coordinar la entrega con **Cargo Expreso**, por favor compártenos tus datos de entrega en Honduras:\n\n• **Entrega a domicilio:** Destinatario, Calle y número de casa / referencia, Colonia o barrio, Ciudad y Código postal.\n• **¿Prefieres retirar en agencia?** Puedes indicarnos la **oficina o agencia de Cargo Expreso** de tu ciudad donde prefieres retirar (recordando que los sábados trabajan medio día).\n\n💡 *Ejemplo domicilio:* ${c.name}, Calle Principal #15 frente a pulpería, Col. Palmira, Tegucigalpa, CP 11101\n💡 *Ejemplo agencia:* Agencia Cargo Expreso San Pedro Sula Centro`
          };
        }
        if (c.step === "address") {
          // 1. Detección directa de entrega en agencia u oficina Cargo Expreso (Ocurre)
          if (this._isAgencyAddress(rawText)) {
            c.isAgencyPickup = true;
            c.address = rawText.trim();
            c.recipientName = c.recipientName || c.name;
            c.step = "phone";
            return {
              text: `¡Excelente elección! 🏢 Registrado para **retiro en agencia de Cargo Expreso**:\n\n📌 **Agencia de retiro:** ${c.address}\n👤 **Destinatario para reclamar en ventanilla:** ${c.recipientName}\n\n⚠️ **Horarios de agencia:** Atienden de Lunes a Viernes (8:00 AM - 5:00 PM) y los **Sábados únicamente medio día** (hasta las 12:00 PM).\n\n📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega y notificarte la guía de rastreo?\n\n⚠️ **Importante:** Cargo Expreso coordina y avisa la llegada del paquete **únicamente vía llamada telefónica** (asegúrate de que la línea pueda recibir llamadas directas).`
            };
          }

          // 2. Dirección en texto válida (con indicadores de dirección o referencia geográfica hondureña)
          const cleaned = clean(rawText);
          const words = rawText.trim().split(/\s+/);
          const hondurasGeoKeywords = [
            "col", "colonia", "barrio", "b°", "sector", "calle", "ave", "avenida", "casa", "bloque", "res", "residencial",
            "tegucigalpa", "san pedro", "sps", "ceiba", "choluteca", "comayagua", "frente", "cerca", "etapa", "aldea",
            "puerto cortes", "villanueva", "progreso", "la lima", "danli", "juticalpa", "siguatepeque", "santa rosa", "copan",
            "catacamas", "tocoa", "olanchito", "tela", "bulevar", "blvd", "plaza", "pulperia", "esquina", "circunvalacion",
            "toncontin", "pedregal", "kennedy", "hato", "miramontes", "palmira", "lomas", "prado", "san felipe"
          ];
          const hasKeyword = hondurasGeoKeywords.some(k => cleaned.includes(k));

          if (hasKeyword && words.length >= 3) {
            c.address = rawText.trim();
            const cpMatch = rawText.match(/\b\d{5}\b/);
            if (cpMatch) c.postalCode = cpMatch[0];
            c.recipientName = c.recipientName || c.name;
            c.step = "phone";
            return {
              text: `¡Dirección registrada con éxito! 📦\n\n📌 **Dirección de entrega:** ${c.address}\n👤 **Destinatario:** ${c.recipientName}\n\n📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega?\n\n⚠️ **Importante:** Cargo Expreso coordina la entrega **únicamente vía llamada telefónica** antes de llegar a tu domicilio (asegúrate de que la línea pueda recibir llamadas directas).`
            };
          }

          // 3. Preguntas o dudas que el usuario pueda tener en este paso (solo si no es una dirección)
          const policy = this._getPolicyResponse(cleanText, tokens);
          if (policy) {
            return {
              text: `${policy}\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP):`
            };
          }
          if (cleanText.includes("transferencia") || cleanText.includes("transfer")) {
            return {
              text: `¡Sí, aceptamos transferencia bancaria y efectivo contra entrega! 🏦\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP):`
            };
          }
          if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
            const expl = this._getScheduleAndAgencyExplanation();
            return {
              text: `${expl}\n\n📍 Para continuar con tu orden, indícanos si prefieres que lo enviemos a tu **dirección de domicilio** (con destinatario, colonia y ciudad) o la **oficina/agencia de Cargo Expreso** donde pasarás a retirar:`
            };
          }
          if (this._isColorIntent(cleanText, tokens, SYNONYMS)) {
            const cq = this._handleColorQuery(rawText, cleanText, tokens, c.product, window.SMAK_PRODUCTS || []);
            return {
              text: `${cq.text}\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP):`
            };
          }
          if (this._isPriceIntent(cleanText, tokens)) {
            const pq = this._handlePriceQuery(rawText, cleanText, tokens, c.product);
            return {
              text: `${pq.text}\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP):`
            };
          }
          if (this._isMaterialIntent(cleanText, tokens)) {
            const mq = this._handleMaterialQuery(rawText, cleanText, tokens, c.product);
            return {
              text: `${mq.text}\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP):`
            };
          }
          if (this._isDimensionIntent(cleanText, tokens)) {
            const p = c.product;
            return {
              text: `📏 **Medidas de ${p.name}:** **${p.dimensions || 'Estándar según ficha técnica'}** (Capacidad: ${p.weightLimit || 'Uso comercial y residencial'}).\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP):`
            };
          }

          // 4. Validación general sin palabras clave pero con suficiente longitud
          const isTooShort = rawText.trim().length < 12 || words.length < 3;
          if (isTooShort) {
            return {
              text: `Para que **Cargo Expreso** pueda entregar tu paquete sin retrasos, por favor indícanos una dirección más detallada:\n\n• **A domicilio:** Nombre del destinatario, Calle y casa / referencia, Colonia o barrio, y Ciudad / Municipio.\n• **En agencia:** Oficina o sucursal de Cargo Expreso de tu ciudad donde prefieres retirar en ventanilla.\n\n💡 *Ejemplo domicilio:* ${c.name}, Calle Principal, Casa #15 frente a pulpería, Col. Miramontes, Tegucigalpa.\n💡 *Ejemplo agencia:* Agencia Cargo Expreso San Pedro Sula Centro.`
            };
          }

          c.address = rawText.trim();
          const cpMatch = rawText.match(/\b\d{5}\b/);
          if (cpMatch) c.postalCode = cpMatch[0];
          c.recipientName = c.recipientName || c.name;
          c.step = "phone";
          return {
            text: `¡Dirección registrada con éxito! 📦\n\n📌 **Dirección de entrega:** ${c.address}\n👤 **Destinatario:** ${c.recipientName}\n\n📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega?\n\n⚠️ **Importante:** Cargo Expreso coordina la entrega **únicamente vía llamada telefónica** antes de llegar a tu domicilio (asegúrate de que la línea pueda recibir llamadas directas).`
          };
        }
        if (c.step === "phone") {
          const policy = this._getPolicyResponse(cleanText, tokens);
          if (policy) {
            return {
              text: `${policy}\n\nPara continuar, compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega 📞:`
            };
          }
          if (cleanText.includes("transferencia") || cleanText.includes("transfer")) {
            return {
              text: `¡Sí, aceptamos transferencia bancaria y efectivo contra entrega! 🏦\n\nPara continuar, compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega 📞:`
            };
          }
          if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
            const expl = this._getScheduleAndAgencyExplanation();
            return {
              text: `${expl}\n\nPara continuar: compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega 📞:`
            };
          }
          if (this._isColorIntent(cleanText, tokens, SYNONYMS)) {
            const cq = this._handleColorQuery(rawText, cleanText, tokens, c.product, window.SMAK_PRODUCTS || []);
            return {
              text: `${cq.text}\n\nContinuemos: compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega 📞:`
            };
          }
          if (this._isPriceIntent(cleanText, tokens)) {
            const pq = this._handlePriceQuery(rawText, cleanText, tokens, c.product);
            return {
              text: `${pq.text}\n\nContinuemos: compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega 📞:`
            };
          }
          if (this._isMaterialIntent(cleanText, tokens)) {
            const mq = this._handleMaterialQuery(rawText, cleanText, tokens, c.product);
            return {
              text: `${mq.text}\n\nContinuemos: compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega 📞:`
            };
          }
          if (this._isDimensionIntent(cleanText, tokens)) {
            const p = c.product;
            return {
              text: `📏 **Medidas de ${p.name}:** **${p.dimensions || 'Estándar según ficha técnica'}** (Capacidad: ${p.weightLimit || 'Uso comercial y residencial'}).\n\nContinuemos: compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega 📞:`
            };
          }

          const phoneDigits = rawText.replace(/\D/g, "");
          if (phoneDigits.length < 8) {
            return {
              text: `Por favor compártenos un número telefónico válido de al menos 8 dígitos (ejemplo: **9800-8559** o **+504 9876-5432**).\n\n⚠️ **Recordatorio importante:** Cargo Expreso **solo coordina las entregas mediante llamada telefónica** directa al destinatario. Es indispensable contar con un número activo para llamadas para recibir el paquete.`
            };
          }

          c.phone = rawText.trim();
          c.step = "requires_invoice";
          return {
            text: `Teléfono registrado para llamadas: **${c.phone}** 📞\n\n¿Requieres factura con RTN para tu pedido? (Responde *Sí* o *No*):`
          };
        }
        if (c.step === "requires_invoice") {
          const cleaned = clean(rawText);
          const wantsInvoice = cleaned.includes("si") || cleaned.includes("factura") || cleaned.includes("rtn") || cleaned.includes("requiero") || cleaned.includes("ocupo");
          if (wantsInvoice) {
            c.step = "invoice_rtn";
            return {
              text: `Por favor compártenos tu número de **RTN** (14 dígitos):`
            };
          } else {
            c.requiresInvoice = false;
            c.rtn = null;
            c.businessName = null;
            c.step = "confirm";
            return this._buildOrderConfirmation(c);
          }
        }
        if (c.step === "invoice_rtn") {
          c.requiresInvoice = true;
          const rtnMatch = rawText.match(/\d{14}/) || rawText.match(/\d{8,14}/);
          c.rtn = rtnMatch ? rtnMatch[0] : rawText.trim();
          c.step = "invoice_business_name";
          return {
            text: `RTN registrado: **${c.rtn}**.\n\n¿Cuál es el **Nombre o Razón Social** de la empresa para la factura?`
          };
        }
        if (c.step === "invoice_business_name") {
          c.businessName = rawText.trim() || c.name;
          c.step = "confirm";
          return this._buildOrderConfirmation(c);
        }
        if (c.step === "confirm") {
          const products = window.SMAK_PRODUCTS || [];

          // 1. Modificación de datos ya confirmados (cantidad, dirección, teléfono, facturación, destinatario o producto)
          const mod = this._handleOrderModifications(c, rawText, cleanText, tokens, products, null);
          if (mod.redirect) {
            return { text: mod.prompt };
          }
          if (mod.modified) {
            const confirmation = this._buildOrderConfirmation(c);
            return {
              text: `${mod.ack}\n\n${confirmation.text}`,
              order: confirmation.order
            };
          }

          // 2. Intención genuina de confirmación de compra
          if (this._isConfirmIntent(cleanText, rawText)) {
            const saved = this.confirmOrder();
            return {
              text: `¡Muchas gracias, ${saved ? saved.name : "estimado cliente"}! 🎉 Tu pedido **${saved ? saved.orderNumber : ""}** (${saved ? saved.quantityLabel : "1 unid."}) ha quedado formalmente registrado en nuestro sistema backend. En breve te notificaremos cuando la guía de rastreo sea asignada.`
            };
          }

          // 3. Responder a cualquier pregunta manteniendo el resumen y el botón de confirmación
          const answer = this._getGeneralAnswer(rawText, cleanText, tokens);
          const confirmation = this._buildOrderConfirmation(c);
          const replyText = `${answer.text || ""}\n\n👇 **Tu pedido (${c.orderNumber}) sigue listo para ser confirmado:**`;

          return {
            ...answer,
            text: replyText,
            order: confirmation.order
          };
        }
      }

      // 1b. Consulta de Rastreo / Estado de Pedido
      const trackingRegex = /(?:smak-ord-\d+|caex-[a-z0-9-]+)/i;
      const matchedCode = rawText.match(trackingRegex);
      if (matchedCode || ((tokens.some(t => ["rastreo", "guia", "tracking", "paquete"].includes(t)) || cleanText.includes("mi pedido")) && (cleanText.includes("donde") || cleanText.includes("estado") || cleanText.includes("numero")))) {
        try {
          const saved = localStorage.getItem("smakbot-demo-v5");
          if (saved) {
            const state = JSON.parse(saved);
            const orders = Array.isArray(state.orders) ? state.orders : [];
            const searchStr = matchedCode ? matchedCode[0].toUpperCase() : null;
            const order = searchStr 
              ? orders.find(o => (o.orderNumber && o.orderNumber.toUpperCase() === searchStr) || (o.trackingNumber && o.trackingNumber.toUpperCase() === searchStr))
              : orders[0];
            if (order) {
              const statusMap = {
                pendiente: "🕒 Pendiente de despacho en bodega",
                en_camino: "🚚 En camino a tu domicilio",
                entregado: "✅ Entregado con éxito"
              };
              const statusText = statusMap[order.status] || "🚚 En proceso de entrega";
              const trackingText = order.trackingNumber 
                ? `• Guía de rastreo: **${order.trackingNumber}** (${order.trackingCarrier || "Cargo Expreso"})\n• Despachado por: Cargo Expreso Honduras`
                : "• Guía de rastreo: *Asignándose para despacho en el siguiente lote.*";
              return {
                text: `📦 **Información de tu Pedido (${order.orderNumber})**:\n\n• Estado: **${statusText}**\n• Cliente: ${order.name}\n• Detalle: ${order.quantityLabel || (order.quantity + " unid.")} · ${order.productName}\n• Dirección: ${order.address}\n• Total contra entrega: **L.${Number(order.total).toLocaleString("es-HN")}**\n${trackingText}\n\nSi requieres soporte adicional, un asesor puede atenderte.`
              };
            }
          }
        } catch (e) {}
      }

      return this._getGeneralAnswer(rawText, cleanText, tokens);
    }

    _getGeneralAnswer(rawText, cleanText, tokens) {
      const allProducts = window.SMAK_PRODUCTS || [];

      // 1c. Políticas de Negocio y FAQs de SMAK (Roatán, Forza, Tarjeta, Ubicación, Envío Gratis, Garantía, Nuevos, Mejor precio)
      const policy = this._getPolicyResponse(cleanText, tokens);
      if (policy) {
        const activeProd = this.selectedProduct || (this.checkout ? this.checkout.product : null) || allProducts[0];
        return {
          text: `${policy}\n\n¿Deseas realizar tu pedido${activeProd ? ` para **${activeProd.name}**` : ''}?`,
          product: activeProd || null
        };
      }

      // 2. Transferencia Bancaria
      const isTransferQuery = cleanText.includes("transferencia") || cleanText.includes("transfer") || (cleanText.includes("cuenta") && (cleanText.includes("banco") || cleanText.includes("transferir") || cleanText.includes("depositar")));
      if (isTransferQuery) {
        const activeProd = this.selectedProduct || (this.checkout ? this.checkout.product : null) || allProducts[0];
        return {
          text: `¡Sí, aceptamos transferencia bancaria! 🏦\n\nPuedes realizar tu pago a cualquiera de nuestras cuentas oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):\n\n• **BAC Credomatic (Cheques):** 742-108-951\n• **Banco Ficohsa (Cheques):** 2000-098-432\n• **Banco Atlántida (Ahorros):** 110-045-892\n• **Banpaís (Cheques):** 01-501-002345\n\nPuedes pagar vía transferencia y adjuntar tu comprobante por el chat, o pagar en efectivo contra entrega al recibir tu paquete en tu puerta.\n\n¿Deseas realizar tu pedido${activeProd ? ` para **${activeProd.name}**` : ''}?`,
          product: activeProd || null
        };
      }

      // 3. Contacto con Asesor Humano / Ejecutivo
      const asesorKeywords = ["asesor", "humano", "ejecutivo", "agente", "vendedor", "representante", "persona"];
      const wantsHumanDirectly = asesorKeywords.some(k => {
        if (k.includes(" ")) return cleanText.includes(k);
        return tokens.includes(k);
      });
      if (wantsHumanDirectly) {
        this.human = true;
        const waNum = (window.SMAK_CONFIG && window.SMAK_CONFIG.whatsappNumber) || "50498008559";
        return {
          text: `¡Con gusto! Te transfiero con un asesor comercial humano especializado de SMAK Honduras:\n\n📲 **WhatsApp Directo:**\n[+504 9800-8559](https://wa.me/${waNum}?text=${encodeURIComponent("Hola SMAK Honduras, deseo hablar con un asesor comercial")})\n\n*(Un ejecutivo revisará tu mensaje de inmediato para atenderte).*`,
          human: true
        };
      }

      // Identificar si hay producto mencionado o en contexto activo
      const foundInMsg = this.findProduct(rawText);
      if (foundInMsg) {
        this.selectedProduct = foundInMsg;
      }
      const currentProduct = this.selectedProduct || (this.checkout ? this.checkout.product : null);

      // 4. Intención de Compra / Iniciar Checkout
      if (tokens.some(t => ["comprar", "ordenar", "pedido", "pedir"].includes(t)) || cleanText.includes("hacer pedido")) {
        return this.startCheckout(currentProduct);
      }

      // 5. Consulta de Colores
      if (this._isColorIntent(cleanText, tokens, SYNONYMS)) {
        return this._handleColorQuery(rawText, cleanText, tokens, currentProduct, allProducts);
      }

      // 6. Consulta de Precio
      if (this._isPriceIntent(cleanText, tokens)) {
        return this._handlePriceQuery(rawText, cleanText, tokens, currentProduct);
      }

      // 7. Consulta de Dimensiones y Medidas
      if (this._isDimensionIntent(cleanText, tokens)) {
        if (currentProduct) {
          const price = currentProduct.price || DEFAULT_PRICES[currentProduct.category] || 1500;
          const dims = currentProduct.dimensions || "Dimensiones estándar según ficha técnica";
          const weight = currentProduct.weightLimit || "100 kg / Uso comercial y residencial";
          return {
            text: `📏 **Medidas y Dimensiones de ${currentProduct.name} (${currentProduct.sku || 'Catálogo'}):**\n\n• **Dimensiones:** **${dims}**\n• **Capacidad / Resistencia:** ${weight}\n• 🎨 **Color oficial:** **${currentProduct.colors || 'Negro'}**\n• 🏷️ **Precio:** **L.${price.toLocaleString("es-HN")}**\n• 📦 **Disponibilidad:** ${currentProduct.inStock ? "✅ En stock para entrega inmediata" : "⚠️ Consultar tiempo de entrega"}\n\n¿Deseas que preparemos tu pedido contra entrega o tienes alguna otra duda?`,
            product: currentProduct,
            images: currentProduct.gallery?.slice(0, 2) || (currentProduct.image ? [currentProduct.image] : [])
          };
        } else {
          const samples = allProducts.slice(0, 6).map(p => `• **${p.name}**: **${p.dimensions || 'Estándar según ficha técnica'}**`).join("\n");
          return {
            text: `📏 **Guía de Medidas y Dimensiones de SMAK Honduras:**\n\nAquí tienes las dimensiones exactas de nuestros artículos más solicitados:\n\n${samples}\n\n¿Por las medidas de qué producto en específico deseas consultar?`
          };
        }
      }

      // 8. Consulta de Materiales y Ensamble
      if (this._isMaterialIntent(cleanText, tokens)) {
        return this._handleMaterialQuery(rawText, cleanText, tokens, currentProduct);
      }

      // 9. Consulta de Peso y Resistencia
      if (this._isWeightIntent(cleanText, tokens)) {
        return this._handleWeightQuery(rawText, cleanText, tokens, currentProduct);
      }

      // 10. Consulta de Producto Específico encontrado en este mensaje
      if (foundInMsg) {
        const price = foundInMsg.price || DEFAULT_PRICES[foundInMsg.category] || 1500;
        const featuresText = (foundInMsg.features || []).slice(0, 3).map(f => `• ${f}`).join("\n");
        return {
          text: `¡Sí, tenemos disponible! **${foundInMsg.name}** (${foundInMsg.sku || 'Catálogo'}):\n\n🏷️ **Precio:** L.${price.toLocaleString("es-HN")}\n🎨 **Color:** ${foundInMsg.colors || 'Negro'}\n📏 **Dimensiones:** ${foundInMsg.dimensions || 'Estándar'}\n✅ **Estado:** ${foundInMsg.inStock ? "Disponible para entrega inmediata" : "Agotado temporalmente"}\n\n**Detalles:**\n${featuresText}\n\n¿Deseas que preparemos tu pedido o tienes alguna duda adicional?`,
          product: foundInMsg
        };
      }

      // 11. Consulta de Catálogo General
      if (tokens.some(t => ["catalogo", "productos", "modelos"].includes(t)) || cleanText.includes("que venden") || cleanText.includes("ver catalogo") || cleanText.includes("que tienen")) {
        const topSamples = allProducts.slice(0, 5);
        return {
          text: `📦 **Catálogo Destacado de SMAK Honduras**:\n\nContamos con mobiliario prémium para hogar, oficina y proyectos comerciales. Aquí tienes algunos de nuestros artículos más solicitados:`,
          catalog: topSamples
        };
      }

      // 12. Horarios Específicos, Sábados y Retiro en Agencia Cargo Expreso
      if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
        const expl = this._getScheduleAndAgencyExplanation();
        return {
          text: `${expl}\n\n¿Deseas que preparemos tu pedido${currentProduct ? ` para **${currentProduct.name}**` : ''}?`,
          product: currentProduct || null
        };
      }

      // 13. Tiempos de Entrega y Envíos
      if (matchesConcept(tokens, "envio") || cleanText.includes("tiempo") || cleanText.includes("cuanto tardan")) {
        return {
          text: `🚚 **Información de Envíos en Honduras**:\n\n• **Tegucigalpa y San Pedro Sula:** 1 a 2 días hábiles (entrega el mismo día si ordenas temprano).\n• **Resto del país:** 2 a 3 días hábiles a través de Cargo Expreso a domicilio.\n💵 **Pago seguro:** Cancelas en efectivo **contra entrega** al recibir el producto en tu puerta.`
        };
      }

      // 14. Métodos de Pago
      if (matchesConcept(tokens, "pago") || cleanText.includes("como se paga")) {
        return {
          text: `💳 **Formas de Pago**:\n\n1. **Pago contra entrega en efectivo:** Pagas al recibir tu paquete en tu domicilio.\n2. **Transferencia bancaria previa:** A nuestras cuentas en BAC (742-108-951), Ficohsa (2000-098-432) o Atlántida (110-045-892).\n\nTodos nuestros pedidos incluyen garantía de satisfacción y factura fiscal con RTN.`
        };
      }

      // 15. Bloqueo de Regateo (Guardrails)
      if (cleanText.includes("rebajas") || cleanText.includes("descuento") || cleanText.includes("cuanto lo ultimo") || cleanText.includes("regateo")) {
        return {
          text: `Nuestros precios ya cuentan con descuento directo de fábrica para garantizar la máxima calidad en acero y madera tratada. Si necesitas una cotización por volumen (3 unidades o más), te comunicamos con un asesor.`
        };
      }

      // 16. Agradecimientos
      if (this._isGratitude(cleanText, tokens)) {
        return {
          text: `¡Con muchísimo gusto! 😊 Estamos a tu entera disposición. Si deseas apartar algún producto, revisar colores, medidas o necesitas comunicarte con un asesor comercial, escríbenos en cualquier momento.`
        };
      }

      // 16b. Compra / Iniciar Checkout
      const isPurchaseIntent = tokens.some(t => ["comprar", "pedido", "ordenar", "orden"].includes(t)) ||
        ["hacer pedido", "hacer el pedido", "quiero pedir", "quiero ordenar", "quiero comprar", "lo quiero", "la quiero", "lo compro", "la compro", "me lo llevo", "me la llevo", "quiero uno", "quiero una", "deseo comprar", "deseo ordenar", "me interesa comprar", "apartar"].some(p => cleanText.includes(p)) ||
        matchesConcept(tokens, "compra", cleanText);
      if (isPurchaseIntent) {
        return this.startCheckout(currentProduct);
      }

      // 17. Saludos
      if (tokens.some(t => ["hola", "buenas", "buen", "dia", "tardes", "noches"].includes(t))) {
        return {
          text: `¡Hola! 👋 Qué gusto saludarte.\n\nSoy el asistente virtual de **SMAK Honduras**. ¿En qué puedo orientarte hoy?\n\n• Ver productos destacados (*"ver catálogo"*)\n• Consultar stock y colores (*"¿Qué colores hay de la silla gamer?"*)\n• Medidas y materiales (*"¿Qué medidas tiene el escritorio?"*)\n• Tiempos de entrega y compra contra entrega.`
        };
      }

      // 18. Fallback -> Derivación inmediata a Asesor Comercial / Ejecutivo
      this.human = true;
      const waNum = (window.SMAK_CONFIG && window.SMAK_CONFIG.whatsappNumber) || "50498008559";
      const waLink = `https://wa.me/${waNum}?text=${encodeURIComponent(`Hola SMAK Honduras, tengo una consulta especial: "${rawText.slice(0, 80)}"`)}`;

      return {
        text: `👨‍💼 **Atención con Ejecutivo de Ventas SMAK Honduras:**\n\nNo tengo una respuesta exacta registrada en nuestro catálogo automatizado para tu consulta: *"${rawText}"*.\n\nHe transferido esta conversación a un **asesor comercial especializado** para atenderte de forma personalizada.\n\n📲 **Escríbenos directamente a WhatsApp:**\n[+504 9800-8559](${waLink})\n\n*(Un ejecutivo revisará tu mensaje de inmediato para darte información detallada).*`,
        human: true
      };
    }
  }

  window.WebBotEngine = WebBotEngine;

  // ---- CONTROLADOR DEL WIDGET EN EL DOM ----
  function initWebBotUI() {
    const engine = new WebBotEngine();

    // Inyectar HTML del widget si no existe en el DOM
    if (!document.getElementById("webBotWidget")) {
      const widgetHTML = `
        <!-- Floating Launcher Button -->
        <button id="webBotLauncher" class="web-bot-launcher" type="button" aria-label="Abrir asistente virtual SMAK">
          <div class="web-bot-launcher-icon">✨</div>
          <div class="web-bot-launcher-text">
            <span class="web-bot-launcher-title">Asistente SMAK</span>
            <span class="web-bot-launcher-subtitle">
              <span class="web-bot-status-dot"></span> En línea
            </span>
          </div>
          <span class="web-bot-launcher-badge">IA</span>
        </button>

        <!-- Chat Widget Window -->
        <div id="webBotWidget" class="web-bot-window" role="dialog" aria-modal="true" aria-labelledby="webBotHeaderTitle">
          <!-- Header -->
          <div class="web-bot-header">
            <div class="web-bot-header-info">
              <div class="web-bot-avatar">S</div>
              <div class="web-bot-header-text">
                <h3 id="webBotHeaderTitle">SMAK Honduras</h3>
                <p>Asistente de Ventas & Pedidos</p>
              </div>
            </div>
            <div class="web-bot-header-actions">
              <button id="webBotResetBtn" class="web-bot-btn-icon" title="Reiniciar conversación" type="button">↺</button>
              <button id="webBotCloseBtn" class="web-bot-btn-icon" title="Cerrar chat" type="button">✕</button>
            </div>
          </div>

          <!-- Messages Feed -->
          <div id="webBotFeed" class="web-bot-body"></div>

          <!-- Footer / Composer -->
          <div class="web-bot-footer">
            <form id="webBotForm" class="web-bot-form">
              <input id="webBotInput" class="web-bot-input" autocomplete="off" placeholder="Escribe tu duda o producto (ej: 'Tolix')...">
              <button type="submit" class="web-bot-send-btn" aria-label="Enviar mensaje">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
            <div class="web-bot-disclaimer">Asistente oficial &bull; Pago contra entrega en todo Honduras</div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", widgetHTML);
    }

    const launcher = document.getElementById("webBotLauncher");
    const widget = document.getElementById("webBotWidget");
    const closeBtn = document.getElementById("webBotCloseBtn");
    const resetBtn = document.getElementById("webBotResetBtn");
    const feed = document.getElementById("webBotFeed");
    const form = document.getElementById("webBotForm");
    const input = document.getElementById("webBotInput");

    function formatText(text) {
      let safe = String(text ?? "")
        .replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#D97706;font-weight:700;text-decoration:underline;">$1</a>');
      return safe;
    }

    function addBubble(text, isUser = false, extra = {}) {
      const row = document.createElement("div");
      row.className = `web-bot-row ${isUser ? "user" : "bot"}`;

      const bubble = document.createElement("div");
      bubble.className = "web-bot-bubble";

      const content = document.createElement("div");
      content.style.whiteSpace = "pre-wrap";
      content.innerHTML = formatText(text);
      bubble.append(content);

      // Product Card
      if (extra.product) {
        const prod = extra.product;
        const card = document.createElement("div");
        card.className = "web-bot-product-card";
        card.innerHTML = `
          <img src="${prod.image || ''}" alt="${prod.name}" class="web-bot-product-img">
          <div class="web-bot-product-details">
            <div class="web-bot-product-title">${prod.name}</div>
            <div class="web-bot-product-meta">
              <span class="web-bot-product-badge ${prod.inStock ? '' : 'out'}">${prod.inStock ? '✓ En Stock' : 'Agotado'}</span>
              <span class="web-bot-product-price">L.${Number(prod.price || 1500).toLocaleString('es-HN')}</span>
            </div>
            <div class="web-bot-product-actions">
              <button type="button" class="web-bot-btn-buy" data-action="buy-prod">🛍 Comprar ahora</button>
            </div>
          </div>
        `;
        card.querySelector('[data-action="buy-prod"]')?.addEventListener("click", () => {
          sendUserMessage(`Quiero comprar ${prod.name}`);
        });
        bubble.append(card);
      }

      // Catalog items
      if (extra.catalog && extra.catalog.length) {
        const list = document.createElement("div");
        list.className = "web-bot-catalog-list";
        extra.catalog.forEach(item => {
          const itemEl = document.createElement("div");
          itemEl.className = "web-bot-catalog-item";
          itemEl.innerHTML = `
            <span style="font-weight:600;color:#0F172A;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-width:210px;">${item.name}</span>
            <button type="button" class="web-bot-catalog-btn">Ver Stock</button>
          `;
          itemEl.querySelector(".web-bot-catalog-btn")?.addEventListener("click", () => {
            sendUserMessage(`¿Tienen stock para ${item.name}?`);
          });
          list.append(itemEl);
        });
        bubble.append(list);
      }

      // Order confirmation card
      if (extra.order) {
        const o = extra.order;
        const oCard = document.createElement("div");
        oCard.className = "web-bot-order-card";
        oCard.innerHTML = `
          <div class="web-bot-order-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>📦 Confirmación de Pedido</span>
            <span style="background:#D97706;color:#FFF;padding:2px 6px;border-radius:4px;font-size:10px;font-family:monospace;">${o.orderNumber || 'SMAK-ORD'}</span>
          </div>
          <div><b>Destinatario:</b> ${o.recipientName || o.name}</div>
          <div><b>Producto:</b> ${o.productName}</div>
          <div><b>Piezas / Cantidad:</b> <span style="color:#D97706;font-weight:700;">${o.quantityLabel || (o.quantity + " unid.")}</span></div>
          <div><b>Entrega:</b> ${o.isAgencyPickup ? `🏢 Retiro en Agencia Cargo Expreso (${o.address})` : o.address}</div>
          <div><b>Teléfono (Llamadas Cargo Expreso):</b> <span style="font-weight:600;color:#0F172A;">${o.phone}</span></div>
          <div><b>Facturación:</b> <span style="background:${o.requiresInvoice ? '#FEF3C7' : '#F1F5F9'};color:${o.requiresInvoice ? '#92400E' : '#475569'};padding:1px 6px;border-radius:4px;font-size:11px;font-weight:600;">${o.requiresInvoice ? `Sí (RTN: ${o.rtn || 'Con RTN'})` : 'No (Consumidor Final)'}</span></div>
          <div style="font-weight:700;color:#0F172A;font-size:13px;margin-top:6px;padding-top:4px;border-top:1px dashed #E2E8F0;">Total a pagar: L.${Number(o.total || o.price || 0).toLocaleString('es-HN')}</div>
          <button type="button" class="web-bot-order-confirm-btn" data-action="confirm-order">✓ Confirmar pedido contra entrega</button>
        `;
        const confirmBtn = oCard.querySelector('[data-action="confirm-order"]');
        confirmBtn?.addEventListener("click", () => {
          const saved = engine.confirmOrder();
          confirmBtn.disabled = true;
          confirmBtn.textContent = "✓ Pedido confirmado con éxito";
          setTimeout(() => {
            addBubble(`¡Muchísimas gracias, ${saved ? saved.name : "estimado cliente"}! 🎉\n\nTu pedido *${saved ? saved.orderNumber : ""}* (${saved ? saved.quantityLabel : "1 unid."}) ha quedado formalmente registrado en nuestro sistema backend. En breve te notificaremos la guía de rastreo cuando sea despachado.`, false);
          }, 300);
        });
        bubble.append(oCard);
      }

      // Quick chips on welcome message
      if (extra.chips) {
        const chipsContainer = document.createElement("div");
        chipsContainer.className = "web-bot-quick-chips";
        const chipOptions = [
          { label: "📦 Ver catálogo", query: "ver catálogo" },
          { label: "📏 Medidas y dimensiones", query: "¿Cuáles son las medidas y dimensiones?" },
          { label: "🏷️ ¿Tienen stock?", query: "¿Tienen stock disponible?" },
          { label: "🚚 Envíos y entregas", query: "¿Cuánto tardan los envíos?" },
          { label: "🏢 Agencias y horarios", query: "¿Puedo pedir horario específico o retirar en agencia de Cargo Expreso?" },
          { label: "💳 Formas de pago", query: "¿Cuáles son las formas de pago?" },
          { label: "👤 Hablar con asesor", query: "Quiero hablar con un asesor" }
        ];
        chipOptions.forEach(opt => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "web-bot-chip";
          chip.textContent = opt.label;
          chip.addEventListener("click", () => {
            sendUserMessage(opt.query);
          });
          chipsContainer.append(chip);
        });
        bubble.append(chipsContainer);
      }

      const timeEl = document.createElement("span");
      timeEl.className = "web-bot-time";
      timeEl.textContent = new Date().toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit" });
      bubble.append(timeEl);

      row.append(bubble);
      feed.append(row);
      feed.scrollTop = feed.scrollHeight;
    }

    function showTypingIndicator() {
      const typing = document.createElement("div");
      typing.id = "webBotTyping";
      typing.className = "web-bot-row bot";
      typing.innerHTML = `
        <div class="web-bot-typing">
          <span class="web-bot-typing-dot"></span>
          <span class="web-bot-typing-dot"></span>
          <span class="web-bot-typing-dot"></span>
        </div>
      `;
      feed.append(typing);
      feed.scrollTop = feed.scrollHeight;
    }

    function removeTypingIndicator() {
      document.getElementById("webBotTyping")?.remove();
    }

    function sendUserMessage(text) {
      if (!text.trim()) return;
      addBubble(text, true);
      input.value = "";
      showTypingIndicator();

      setTimeout(() => {
        removeTypingIndicator();
        const answer = engine.reply(text);
        addBubble(answer.text, false, answer);
      }, 400);
    }

    function resetConversation() {
      engine.reset();
      feed.replaceChildren();
      addBubble(`¡Hola! 👋 Bienvenido a **SMAK Honduras**.\n\nSoy tu asistente virtual para la tienda web. Puedo ayudarte a consultar disponibilidad, tiempos de entrega y coordinar tu pedido con pago contra entrega.`, false, { chips: true });
    }

    // Toggle Chat Visibility
    launcher.addEventListener("click", () => {
      const isActive = widget.classList.toggle("active");
      if (isActive) {
        if (!feed.children.length) {
          resetConversation();
        }
        setTimeout(() => input.focus(), 250);
      }
    });

    closeBtn.addEventListener("click", () => {
      widget.classList.remove("active");
    });

    resetBtn.addEventListener("click", () => {
      resetConversation();
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      sendUserMessage(input.value);
    });

    // Exponer API global para abrir el bot desde cualquier botón de la página
    window.openSmakBot = function (query = "") {
      widget.classList.add("active");
      if (!feed.children.length) {
        resetConversation();
      }
      if (query) {
        setTimeout(() => sendUserMessage(query), 300);
      } else {
        input.focus();
      }
    };
  }

  // Inicializar al cargar el DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWebBotUI);
  } else {
    initWebBotUI();
  }
})();
