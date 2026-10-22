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
    precio: ["costo", "cuesta", "valor", "cuanto", "vale", "presio"],
    stock: ["disponible", "disponibilidad", "quedan", "hay", "tienen", "existencia", "inventario"],
    envio: ["entrega", "entregas", "envios", "domicilio", "casa", "tardan", "tarda", "flete", "cargo expreso"],
    pago: ["pagar", "efectivo", "contra entrega", "tarjeta", "transferencia"],
    fotos: ["foto", "imagenes", "ver", "fotografias"],
    asesor: ["humano", "persona", "operador", "contacto", "agente", "telefono", "whatsapp"]
  };

  function matchesConcept(tokens, concept) {
    const list = SYNONYMS[concept] || [];
    const targets = [concept, ...list].map(clean);
    return tokens.some(t => targets.some(target => t === target || (t.length >= 4 && target.length >= 4 && t.includes(target))));
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

    startCheckout(product = null, initialQty = 1) {
      const allProducts = window.SMAK_PRODUCTS || [];
      const prod = product || this.selectedProduct || allProducts[0] || { name: "Mueble SMAK", category: "Muebles y Organización" };
      const unitPrice = prod.price || DEFAULT_PRICES[prod.category] || 1500;
      const qty = Number(initialQty) > 0 ? Number(initialQty) : 1;

      // Generate order number connecting to existing state or sequential
      let orderNumber = "SMAK-ORD-1001";
      try {
        const saved = localStorage.getItem("smakbot-demo-v3");
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

      return {
        text: `📋 **Resumen de tu pedido (${c.orderNumber})**:\n• Producto: **${prod.name}**\n• Cantidad / Piezas: **${c.quantityLabel || (c.quantity + " unid.")}**\n• Total a pagar: **L.${Number(c.total).toLocaleString("es-HN")}**\n• Destinatario: ${c.recipientName || c.name}\n• Entrega: ${c.address}\n• Contacto (Llamadas Cargo Expreso): ${c.phone}\n• Facturación: **${invoiceTxt}**\n\nPresiona el botón abajo para confirmar tu compra contra entrega.`,
        order: {
          orderNumber: c.orderNumber,
          name: c.name,
          recipientName: c.recipientName || c.name,
          address: c.address,
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

      // Sincronizar en localStorage bajo smakbot-demo-v3 para que aparezca en el panel admin.html
      try {
        const storageKey = "smakbot-demo-v3";
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

      const explicitConfirm = ["confirmar", "confirmar pedido", "confirmar compra", "confirmo", "confirmo pedido", "proceder", "proceder con la compra", "cerrar pedido", "comprar ahora", "si confirmar", "si confirmo"].some(w => cleanText.includes(w));
      if (explicitConfirm) return true;

      const exactConfirmWords = ["si", "ok", "listo", "correcto", "dale", "adelante", "comprar", "proceder", "de acuerdo", "perfecto", "va", "esta bien", "todo bien", "todo correcto", "mandelo", "envielo"];
      const isExact = exactConfirmWords.includes(cleanText);
      const startsWithOkOrSi = /^(?:si|ok|listo|dale|adelante)\b\s*(?:por favor|amigo|amiga|gracias|esta bien|proceda|mandelo|envielo)?$/i.test(cleanText);

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
          const cpMatch = newAddress.match(/\b\d{5}\b/);
          if (cpMatch) c.postalCode = cpMatch[0];
          return {
            modified: true,
            field: "address",
            ack: `✏️ ¡Listo! Hemos actualizado tu dirección de entrega a: **${c.address}**.`
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
          c.name = rawText.trim();
          c.recipientName = c.name;
          c.step = "quantity";
          return {
            text: `Mucho gusto, ${c.name}. ¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):`
          };
        }
        if (c.step === "quantity") {
          const match = rawText.match(/\d+/);
          const q = match ? Math.max(1, parseInt(match[0], 10)) : 1;
          c.quantity = q;
          c.quantityLabel = rawText.trim() || `${q} ${q === 1 ? 'unidad' : 'unidades'}`;
          c.total = c.unitPrice * q;
          c.step = "address";
          return {
            text: `Anotado: **${c.quantityLabel}** (Total: L.${c.total.toLocaleString("es-HN")}).\n\n🚚 Para coordinar la entrega a domicilio con **Cargo Expreso**, por favor compártenos los datos de tu dirección en Honduras:\n\n1. **Nombre del destinatario:** (quién recibe el paquete)\n2. **Calle y número de casa / referencia:**\n3. **Colonia, barrio o sector:**\n4. **Ciudad / Municipio:**\n5. **Código postal:** (opcional o de tu zona)\n\n💡 *Ejemplo:* ${c.name}, Calle Principal, Casa #15 frente a pulpería, Col. Palmira, Tegucigalpa, CP 11101`
          };
        }
        if (c.step === "address") {
          if (cleanText.includes("transferencia") || cleanText.includes("transfer")) {
            return {
              text: `¡Sí, aceptamos transferencia bancaria y efectivo contra entrega! 🏦\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP):`
            };
          }

          // Validación y condicionamiento de dirección en texto
          const cleaned = clean(rawText);
          const words = rawText.trim().split(/\s+/);
          const hasKeyword = ["col", "colonia", "barrio", "b°", "sector", "calle", "ave", "avenida", "casa", "bloque", "res", "residencial", "tegucigalpa", "san pedro", "sps", "ceiba", "choluteca", "comayagua", "frente", "cerca", "etapa", "aldea"].some(k => cleaned.includes(k));
          const isTooShort = rawText.trim().length < 12 || words.length < 3 || (!hasKeyword && words.length < 4);

          if (isTooShort) {
            return {
              text: `Para que **Cargo Expreso** pueda entregar tu paquete en tu puerta sin retrasos, por favor indícanos una dirección más detallada:\n\n• **Nombre del destinatario**\n• **Calle y número de casa / referencia**\n• **Colonia, barrio o sector**\n• **Ciudad / Municipio**\n• **Código postal**\n\n💡 *Ejemplo:* ${c.name}, Calle Principal, Casa #15 frente a pulpería, Col. Miramontes, Tegucigalpa.`
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
          if (cleanText.includes("transferencia") || cleanText.includes("transfer")) {
            return {
              text: `¡Sí, aceptamos transferencia bancaria y efectivo contra entrega! 🏦\n\nPara continuar, compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega 📞:`
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
          const saved = localStorage.getItem("smakbot-demo-v3");
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
      // 2. Intención de Compra / Iniciar Checkout
      if (tokens.some(t => ["comprar", "ordenar", "pedido", "pedir"].includes(t)) || cleanText.includes("hacer pedido")) {
        const prod = this.findProduct(rawText) || this.selectedProduct;
        return this.startCheckout(prod);
      }

      // 3. Consulta de Producto Específico
      const prod = this.findProduct(rawText);
      if (prod) {
        this.selectedProduct = prod;
        const price = prod.price || DEFAULT_PRICES[prod.category] || 1500;
        const featuresText = (prod.features || []).slice(0, 3).map(f => `• ${f}`).join("\n");
        return {
          text: `¡Sí, tenemos disponible! **${prod.name}**:\n\n🏷️ **Precio:** L.${price.toLocaleString("es-HN")}\n✅ **Estado:** ${prod.inStock ? "Disponible para entrega inmediata" : "Agotado temporalmente"}\n\n**Detalles:**\n${featuresText}\n\n¿Deseas que preparemos tu pedido o tienes alguna duda adicional?`,
          product: {
            ...prod,
            price
          }
        };
      }

      // 4. Consulta de Catálogo General
      if (tokens.some(t => ["catalogo", "productos", "modelos"].includes(t)) || cleanText.includes("que venden") || cleanText.includes("ver catalogo")) {
        const allProducts = window.SMAK_PRODUCTS || [];
        const topSamples = allProducts.slice(0, 5);
        return {
          text: `📦 **Catálogo Destacado de SMAK Honduras**:\n\nContamos con mobiliario prémium para hogar, oficina y proyectos comerciales. Aquí tienes algunos de nuestros artículos más solicitados:`,
          catalog: topSamples
        };
      }

      // 5. Tiempos de Entrega y Envíos
      if (matchesConcept(tokens, "envio") || cleanText.includes("tiempo") || cleanText.includes("cuanto tardan")) {
        return {
          text: `🚚 **Información de Envíos en Honduras**:\n\n• **Tegucigalpa y San Pedro Sula:** 1 a 2 días hábiles (entrega el mismo día si ordenas temprano).\n• **Resto del país:** 2 a 3 días hábiles a través de Cargo Expreso a domicilio.\n💵 **Pago seguro:** Cancelas en efectivo **contra entrega** al recibir el producto en tu puerta.`
        };
      }

      // 5b. Consulta de Transferencia Bancaria
      const isTransferQuery = cleanText.includes("transferencia") || cleanText.includes("transfer") || (cleanText.includes("cuenta") && (cleanText.includes("banco") || cleanText.includes("transferir") || cleanText.includes("depositar")));
      if (isTransferQuery) {
        const activeProd = this.selectedProduct || (this.checkout ? this.checkout.product : null) || (window.SMAK_PRODUCTS && window.SMAK_PRODUCTS[0]);
        return {
          text: `¡Sí, aceptamos transferencia bancaria! 🏦\n\nPuedes realizar tu pago a cualquiera de nuestras cuentas oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):\n\n• **BAC Credomatic (Cheques):** 742-108-951\n• **Banco Ficohsa (Cheques):** 2000-098-432\n• **Banco Atlántida (Ahorros):** 110-045-892\n• **Banpaís (Cheques):** 01-501-002345\n\nPuedes pagar vía transferencia y adjuntar tu comprobante por el chat, o pagar en efectivo contra entrega al recibir tu paquete en tu puerta.\n\n¿Deseas realizar tu pedido${activeProd ? ` para **${activeProd.name}**` : ''}?`,
          product: activeProd || null
        };
      }

      // 6. Métodos de Pago
      if (matchesConcept(tokens, "pago") || cleanText.includes("como se paga")) {
        return {
          text: `💳 **Formas de Pago**:\n\n1. **Pago contra entrega en efectivo:** Pagas al recibir tu paquete en tu domicilio.\n2. **Transferencia bancaria previa:** A nuestras cuentas en BAC (742-108-951), Ficohsa (2000-098-432) o Atlántida (110-045-892).\n\nTodos nuestros pedidos incluyen garantía de satisfacción y factura fiscal con RTN.`
        };
      }

      // 7. Pregunta de Precio General
      if (matchesConcept(tokens, "precio")) {
        const activeProd = this.selectedProduct || (this.checkout ? this.checkout.product : null);
        if (activeProd) {
          const price = activeProd.price || DEFAULT_PRICES[activeProd.category] || 1500;
          return {
            text: `El producto **${activeProd.name}** tiene un precio de **L.${price.toLocaleString("es-HN")}** con entrega contra entrega disponible.`
          };
        }
        return {
          text: `Nuestros precios van desde **L.1,050** en sillas y organizadores, hasta **L.2,400** en escritorios ejecutivos y juegos de bancos Tolix. ¿Por qué artículo en particular deseas cotizar?`
        };
      }

      // 8. Contacto con Asesor Humano
      if (matchesConcept(tokens, "asesor")) {
        const waNum = (window.SMAK_CONFIG && window.SMAK_CONFIG.whatsappNumber) || "50498008559";
        return {
          text: `¡Con gusto! Puedes contactar de inmediato a un asesor comercial de SMAK Honduras vía WhatsApp:\n\n📲 **WhatsApp Directo:** [+504 9800-8559](https://wa.me/${waNum}?text=${encodeURIComponent("Hola SMAK Honduras, deseo hablar con un asesor comercial")})\n\nNuestro horario de atención es de Lunes a Viernes de 9:00 am a 7:00 pm.`
        };
      }

      // 9. Bloqueo de Regateo (Guardrails)
      if (cleanText.includes("rebajas") || cleanText.includes("descuento") || cleanText.includes("cuanto lo ultimo") || cleanText.includes("regateo")) {
        return {
          text: `Nuestros precios ya cuentan con descuento directo de fábrica para garantizar la máxima calidad en acero y madera tratada. Si necesitas una cotización por volumen (3 unidades o más), te comunicamos con un asesor.`
        };
      }

      // 10. Saludos
      if (tokens.some(t => ["hola", "buenas", "buen", "dia", "tardes", "noches"].includes(t))) {
        return {
          text: `¡Hola! 👋 Qué gusto saludarte.\n\nSoy el asistente virtual de **SMAK Honduras**. ¿En qué puedo orientarte hoy?\n\n• Ver productos destacados (*"ver catálogo"*)\n• Consultar stock (*"¿Tienen bancos Tolix?"*)\n• Tiempos de entrega y formas de pago contra entrega.`
        };
      }

      // 11. Fallback inteligente
      return {
        text: `Puedo informarte sobre stock disponible, tiempos de entrega a domicilio, precios de mobiliario (Sillas Tolix, escritorios, percheros, etc.) o coordinar tu compra contra entrega. ¿Qué te gustaría consultar?`
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
          <div><b>Entrega:</b> ${o.address}</div>
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
          { label: "🏷️ ¿Tienen stock?", query: "¿Tienen stock disponible?" },
          { label: "🚚 Envíos y entregas", query: "¿Cuánto tardan los envíos?" },
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
