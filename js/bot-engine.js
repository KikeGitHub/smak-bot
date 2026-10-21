import { StorageFacade } from "./storage-facade.js?v=4";
import { LocationService } from "./location-service.js?v=4";
import { SpeechService } from "./speech-service.js?v=4";

const clean = s => String(s || "")
  .toLocaleLowerCase("es")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[¿?¡!.,:;()"'\\/]/g, " ")
  .trim();

const tokenize = s => clean(s).split(/\s+/).filter(Boolean);

const STOP_WORDS = new Set(['de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'es', 'son', 'lo', 'en', 'por', 'que', 'se', 'me', 'te', 'le', 'y', 'o', 'al', 'del', 'a']);

// Flexible phrase matcher with stop-word filtering & substantive keyword matching
function matchPhrase(cleanInput, inTokens, phrase) {
  const cPhrase = clean(phrase);
  if (!cPhrase) return false;
  if (cleanInput.includes(cPhrase)) return true;

  const phraseTokens = tokenize(cPhrase);
  if (!phraseTokens.length) return false;

  const substantivePhraseTokens = phraseTokens.filter(t => !STOP_WORDS.has(t) && t.length > 2);
  const targetTokens = substantivePhraseTokens.length > 0 ? substantivePhraseTokens : phraseTokens;

  const matchedCount = targetTokens.filter(pt => {
    return inTokens.some(it => {
      if (it === pt) return true;
      // Allow minor variations like rebaja / rebajas, envio / envios
      if (it.length >= 4 && pt.length >= 4) {
        const rootLen = Math.min(it.length, pt.length) - 1;
        return it.slice(0, rootLen) === pt.slice(0, rootLen);
      }
      return false;
    });
  }).length;

  return (matchedCount / targetTokens.length) >= 0.75;
}

export class BotEngine {
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
      address: "",
      phone: "",
      location: null,
      requiresInvoice: false,
      rtn: null,
      businessName: null
    };
    return {
      text: `¡Excelente elección! Preparo tu orden (*N° ${orderNumber}*) para **${targetProduct.name}** (L.${Number(targetProduct.salePrice).toLocaleString("es-HN")}). ¿A qué nombre registramos tu pedido?`
    };
  }

  _buildOrderConfirmationResponse(c) {
    const prod = c.product;
    const invoiceTxt = c.requiresInvoice 
      ? `Sí (RTN: ${c.rtn} · ${c.businessName})` 
      : "No (Consumidor Final)";

    return {
      text: `📋 **Resumen de tu pedido (${c.orderNumber})**:\n• Producto: **${prod.name}** (SKU: ${prod.sku})\n• Cantidad / Piezas: **${c.quantityLabel || (c.quantity + " unid.")}**\n• Total a pagar: **L.${Number(c.total).toLocaleString("es-HN")}**\n• Cliente: ${c.name}\n• Entrega: ${c.address}${c.location ? `\n• 📍 Mapa GPS: [Ver en Google Maps](${c.location.mapUrl})` : ""}\n• Contacto: ${c.phone}\n• Facturación: **${invoiceTxt}**\n\nPresiona el botón abajo para confirmar tu compra con pago contra entrega.`,
      order: {
        orderNumber: c.orderNumber,
        name: c.name,
        address: c.address,
        phone: c.phone,
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
      address: c.address,
      phone: c.phone,
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
    // 0. From Meta Click-to-WhatsApp Referral object (Official WhatsApp Cloud API)
    if (referral) {
      // 0a. Check source_id against campaign registry
      if (referral.source_id && campaigns.length) {
        const camp = campaigns.find(c => String(c.sourceId) === String(referral.source_id) || String(c.id) === String(referral.source_id));
        if (camp) {
          const prod = products.find(p => p.sku?.toUpperCase() === camp.sku?.toUpperCase());
          return { sku: camp.sku.toUpperCase(), product: prod || null, source: "facebook_ad", referral, campaign: camp };
        }
      }

      // 0b. Match headline or body against catalog names or keywords
      const searchTarget = clean(`${referral.headline || ""} ${referral.body || ""}`);
      for (const p of products) {
        const pClean = clean(p.name);
        const keywords = (p.keywords || []).map(clean);
        if (p.sku && searchTarget.includes(clean(p.sku))) {
          return { sku: p.sku.toUpperCase(), product: p, source: "facebook_ad", referral };
        }
        if (searchTarget.includes(pClean) || pClean.includes(searchTarget) || keywords.some(k => k.length > 2 && searchTarget.includes(k))) {
          return { sku: p.sku?.toUpperCase() || "", product: p, source: "facebook_ad", referral };
        }
      }
    }

    // 1. Social URLs inside message text (e.g. facebook.com/share/p/196jarUnqz, instagram.com/...)
    const urlMatch = rawText.match(/https?:\/\/[^\s]+/i);
    if (urlMatch) {
      const fullUrl = urlMatch[0];

      // Check query param ?sku= or ?ref=
      const skuParamMatch = fullUrl.match(/[?&](?:sku|ref)=([a-zA-Z0-9_\-]+)/i);
      if (skuParamMatch && skuParamMatch[1]) {
        const cand = skuParamMatch[1].toUpperCase();
        const found = products.find(p => p.sku?.toUpperCase() === cand);
        return { sku: cand, product: found || null, source: "url_param", url: fullUrl };
      }

      // Extract Facebook share post ID: facebook.com/share/p/196jarUnqz
      const fbShareMatch = fullUrl.match(/facebook\.com\/share\/p\/([a-zA-Z0-9_\-]+)/i);
      // Extract Instagram post/reel ID: instagram.com/(?:p|reel)/([a-zA-Z0-9_\-]+)
      const igMatch = fullUrl.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_\-]+)/i);
      const postToken = (fbShareMatch && fbShareMatch[1]) || (igMatch && igMatch[1]) || null;

      // Look up in campaigns registry
      if (campaigns.length) {
        const camp = campaigns.find(c => {
          const cUrl = String(c.url || "").toLowerCase();
          const cSourceId = String(c.sourceId || "").toLowerCase();
          return (cUrl && (fullUrl.toLowerCase().includes(cUrl) || cUrl.includes(fullUrl.toLowerCase()))) ||
                 (postToken && (cSourceId === postToken.toLowerCase() || cUrl.includes(postToken.toLowerCase())));
        });

        if (camp) {
          const prod = products.find(p => p.sku?.toUpperCase() === camp.sku?.toUpperCase());
          return { sku: camp.sku.toUpperCase(), product: prod || null, source: "social_link", platform: camp.platform || "Facebook", campaign: camp, url: fullUrl };
        }
      }
    }

    // 2. Deep-link bracketed SKU: "[SKU: EST-01]", "[EST-01]"
    const bracketMatch = rawText.match(/\[(?:sku:?\s*)?([a-zA-Z0-9_\-]{2,15})\]/i);
    if (bracketMatch && bracketMatch[1]) {
      const candidate = bracketMatch[1].trim().toUpperCase();
      const found = products.find(p => p.sku?.toUpperCase() === candidate);
      if (found) {
        return { sku: candidate, product: found, explicit: true, source: "deep_link" };
      }
    }

    // 3. Explicit pattern: "SKU XXX", "CODIGO XXX", "ARTICULO XXX"
    const explicitMatch = rawText.match(/(?:sku|c[oó]digo|codigo|art[ií]culo|articulo|ref|modelo)\s*[:#\-]?\s*([a-zA-Z0-9_\-]{2,15})/i);
    if (explicitMatch && explicitMatch[1]) {
      const candidate = explicitMatch[1].trim().toUpperCase();
      const found = products.find(p => p.sku?.toUpperCase() === candidate);
      return { sku: candidate, product: found || null, explicit: true };
    }

    // 4. Direct match with registered product SKUs in catalog
    for (const p of products) {
      if (p.sku && new RegExp(`\\b${p.sku}\\b`, "i").test(rawText)) {
        return { sku: p.sku.toUpperCase(), product: p, explicit: false };
      }
    }

    // 5. Match with product name keywords
    const cleanMsg = clean(rawText);
    for (const p of products) {
      const pClean = clean(p.name);
      const keywords = (p.keywords || []).map(clean);
      if (cleanMsg.includes(pClean) || keywords.some(k => k.length > 2 && cleanMsg.includes(k))) {
        return { sku: p.sku?.toUpperCase() || "", product: p, explicit: false };
      }
    }

    return null;
  }

  // Check synonym matching
  matchesSynonym(wordList, synonyms, concept) {
    const synList = synonyms[concept] || [];
    const targetTerms = [concept, ...synList].map(clean);
    return wordList.some(word => targetTerms.some(term => {
      if (term === word) return true;
      if (word.length >= 4 && term.length >= 4) {
        return word.includes(term) || term.includes(word);
      }
      return false;
    }));
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
      return { text: "Hola, ¿en qué puedo ayudarte hoy?" };
    }

    // 1. Audio mode request (only if not already an incoming transcribed audio)
    if (!audioTranscript && (audio || tokens.some(t => ["audio", "voz"].includes(t)) || cleanText.includes("no se leer"))) {
      this.voicePreferred = true;
      return {
        text: "¡Con gusto! Te responderé también con una nota de voz para que sea más fácil.",
        audio: true
      };
    }

    // 2. Already transferred to human
    if (this.human) {
      return {
        text: "Tu conversación está asignada a un asesor comercial. Un miembro de nuestro equipo responderá en breve.",
        human: true
      };
    }

    // 3. Checkout conversational flow
    if (this.checkout) {
      const c = this.checkout;
      if (c.step === "name") {
        c.name = rawText.trim();
        c.step = "quantity";
        return { 
          text: `Gracias, ${c.name}. ¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):` 
        };
      }
      if (c.step === "quantity") {
        const match = rawText.match(/\d+/);
        const q = match ? Math.max(1, parseInt(match[0], 10)) : 1;
        c.quantity = q;
        c.quantityLabel = rawText.trim() || `${q} ${q === 1 ? 'unidad' : 'unidades'}`;
        c.total = Number(c.product.salePrice) * q;
        c.step = "address";
        return {
          text: `Anotado: **${c.quantityLabel}** (Total: L.${Number(c.total).toLocaleString("es-HN")}). ¿Cuál es la dirección completa de entrega (ciudad y colonia)?\n\n💡 *Tip: Puedes presionar el botón 📍 abajo o enviar tu ubicación GPS de WhatsApp.*`
        };
      }
      if (c.step === "address") {
        const detectedLoc = location || LocationService.parseLocationFromText(rawText);
        if (detectedLoc) {
          const locName = detectedLoc.address || detectedLoc.name || `Ubicación GPS (${detectedLoc.lat.toFixed(4)}, ${detectedLoc.lng.toFixed(4)})`;
          c.address = locName;
          c.location = {
            lat: detectedLoc.lat,
            lng: detectedLoc.lng,
            name: detectedLoc.name || locName,
            address: locName,
            mapUrl: detectedLoc.mapUrl || LocationService.getGoogleMapsUrl(detectedLoc.lat, detectedLoc.lng)
          };
          c.step = "phone";
          return {
            text: `¡Ubicación de entrega recibida con éxito! 📍\n\n📌 **Dirección registrada:** ${locName}\n🗺️ [Ver en Google Maps](${c.location.mapUrl})\n\n¿A qué número de teléfono o WhatsApp te contactamos para coordinar la entrega?`,
            location: c.location
          };
        } else {
          c.address = rawText.trim();
          c.step = "phone";
          return { text: `Dirección registrada: ${c.address}.\n\n¿A qué número de teléfono o WhatsApp te contactamos para la entrega?` };
        }
      }
      if (c.step === "phone") {
        c.phone = rawText.trim();
        c.step = "requires_invoice";
        return {
          text: `¿Requieres factura con RTN para tu pedido? (Responde *Sí* o *No*):`
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
          return this._buildOrderConfirmationResponse(c);
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
        return this._buildOrderConfirmationResponse(c);
      }
    }

    // 3b. Tracking and order inquiry
    const trackingRegex = /(?:smak-ord-\d+|calz-ord-\d+|caex-[a-z0-9-]+)/i;
    const matchedCode = rawText.match(trackingRegex);
    if (matchedCode || ((tokens.some(t => ["rastreo", "guia", "tracking", "paquete"].includes(t)) || cleanText.includes("mi pedido")) && (cleanText.includes("donde") || cleanText.includes("estado") || cleanText.includes("numero")))) {
      const codeToSearch = matchedCode ? matchedCode[0] : null;
      let order = codeToSearch ? StorageFacade.getOrderByNumber(codeToSearch) : null;
      if (!order) {
        const recentOrders = StorageFacade.getOrders();
        order = recentOrders[0];
      }
      if (order) {
        const statusMap = {
          pendiente: "🕒 Pendiente de despacho en bodega",
          en_camino: "🚚 En camino a tu domicilio",
          entregado: "✅ Entregado con éxito"
        };
        const statusText = statusMap[order.status] || "🚚 En proceso de entrega";
        const trackingText = order.trackingNumber 
          ? `• Guía de rastreo: **${order.trackingNumber}** (${order.trackingCarrier || "Cargo Expreso"})\n• Transportadora: Cargo Expreso a domicilio`
          : "• Guía de rastreo: *En preparación para despacho en el siguiente lote.*";
        return {
          text: `📦 **Información de tu Pedido (${order.orderNumber})**:\n\n• Estado: **${statusText}**\n• Cliente: ${order.name}\n• Detalle: ${order.quantityLabel || (order.quantity + " unid.")} · ${order.productName}\n• Dirección: ${order.address}\n• Total contra entrega: **L.${Number(order.total).toLocaleString("es-HN")}**\n${trackingText}\n\nSi requieres apoyo de un asesor, escribe *asesor* en cualquier momento.`
        };
      }
    }


    // 3b. Location query outside of checkout
    const detectedLoc = location || LocationService.parseLocationFromText(rawText);
    if (detectedLoc && !this.checkout) {
      const locName = detectedLoc.address || detectedLoc.name || "tu ubicación";
      const mapUrl = detectedLoc.mapUrl || LocationService.getGoogleMapsUrl(detectedLoc.lat, detectedLoc.lng);
      return {
        text: `¡Ubicación detectada! 📍 Veo que te encuentras en **${locName}**.\n\n🚚 **Cobertura de Entrega:** ¡Sí, tenemos cobertura completa a domicilio en tu zona a través de Cargo Expreso!\n💵 **Pago Seguro:** Cancelas en efectivo contra entrega al recibir tu paquete.\n\n¿Te gustaría ver nuestro catálogo completo o hacer el pedido de algún producto?`,
        location: {
          lat: detectedLoc.lat,
          lng: detectedLoc.lng,
          name: locName,
          address: locName,
          mapUrl
        }
      };
    }

    const tenant = StorageFacade.getTenant();
    const products = tenant.products || [];
    const rules = tenant.rules || [];
    const synonyms = tenant.synonyms || {};
    const campaigns = tenant.campaigns || [];

    // 4. META ADS REFERRAL / SOCIAL MEDIA LINK IDENTIFICATION (Highest Context Priority)
    const skuExtraction = this.extractSku(rawText, products, { referral, campaigns });

    // 4a. Customer arrived from a Meta Ad (CTWA referral like in the screenshot)
    if (referral && skuExtraction && skuExtraction.product) {
      const prod = skuExtraction.product;
      this.selectedProduct = prod;
      const isAvailable = prod.stock > 0;
      return {
        text: `¡Hola! 👋 Qué gusto saludarte.\n\nVeo que nos escribes desde nuestro anuncio en **Facebook / Instagram** por el **${prod.name} (SKU: ${prod.sku})**.\n\n${
          isAvailable
            ? `✅ **Disponibilidad:** ¡Tenemos **${prod.stock} unidades en stock**!\n🏷️ **Precio Especial:** **L.${Number(prod.salePrice).toLocaleString("es-HN")}** *(precio regular: L.${Number(prod.regularPrice).toLocaleString("es-HN")})*\n🚚 **Entrega:** Envíos a todo el país con pago contra entrega.`
            : `⚠️ El producto **${prod.name}** (SKU: ${prod.sku}) se encuentra actualmente **agotado**.`
        }\n\n¿Te gustaría apartar el tuyo o prefieres revisar medidas o fotografías reales?`,
        product: prod,
        images: prod.images?.slice(0, 2) || [],
        source: "facebook_ad",
        referral
      };
    }

    // 4b. Customer sent a Facebook / Instagram URL directly in chat
    if (skuExtraction && skuExtraction.source === "social_link" && skuExtraction.product) {
      const prod = skuExtraction.product;
      this.selectedProduct = prod;
      const platformName = skuExtraction.platform === "instagram" ? "Instagram" : "Facebook";
      return {
        text: `¡Hola! 🔍 Detecté el enlace de la publicación en **${platformName}** para el producto **${prod.name} (SKU: ${prod.sku})**.\n\n✅ **Stock disponible:** **${prod.stock} unidades**\n🏷️ **Precio de Oferta:** **L.${Number(prod.salePrice).toLocaleString("es-HN")}**\n📦 **Medidas / Especificación:** ${prod.dimensions || "Consultar"}\n\n¡No necesitas escribir el código! Ya tengo tu producto seleccionado. ¿Deseas hacer tu pedido o ver fotos reales?`,
        product: prod,
        images: prod.images?.slice(0, 2) || [],
        source: "social_link",
        url: skuExtraction.url
      };
    }

    // 4c. Customer arrived via deep link with pre-filled SKU: "[SKU: EST-01]"
    if (skuExtraction && skuExtraction.source === "deep_link" && skuExtraction.product) {
      const prod = skuExtraction.product;
      this.selectedProduct = prod;
      return {
        text: `¡Hola! 👋 Con gusto te atiendo para el **${prod.name} (SKU: ${prod.sku})**.\n\n✅ **Stock:** **${prod.stock} unidades disponibles**\n🏷️ **Precio Especial:** **L.${Number(prod.salePrice).toLocaleString("es-HN")}**\n🚚 **Envíos:** Cobertura nacional con pago contra entrega.\n\n¿Deseas que preparemos tu pedido o tienes alguna duda de medidas?`,
        product: prod,
        images: prod.images?.slice(0, 2) || [],
        source: "deep_link"
      };
    }

    // 5. Human handover request (using synonyms or defaults)
    const asesorKeywords = ["asesor", "humano", "persona", "operador", "agente", ...(synonyms.asesor || [])].map(clean);
    if (asesorKeywords.some(k => cleanText.includes(k))) {
      this.human = true;
      return {
        text: "Te transfiero de inmediato con un asesor humano. El asistente automático ha quedado en pausa.",
        human: true
      };
    }

    // 6. RESTRICTION RULES ("Lo que NO debe decir o hacer" - Guardrails tienen máxima prioridad)
    const restrictionRules = rules.filter(r => r.enabled && r.type === "restriction");
    for (const rule of restrictionRules) {
      const match = rule.trainingPhrases.some(phrase => matchPhrase(cleanText, tokens, phrase));
      if (match) {
        return { text: rule.response, isRestriction: true };
      }
    }

    // Set current active product if identified in message
    if (skuExtraction?.product) {
      this.selectedProduct = skuExtraction.product;
    }
    const currentProduct = this.selectedProduct || products[0] || null;

    // 7. SPECIFIC PRODUCT INTENTS (Photos, Shipping/Delivery, Price, Dimensions)
    const isPhotoQuery = this.matchesSynonym(tokens, synonyms, "fotos") || tokens.some(t => ["foto", "fotos", "imagen", "imagenes", "verlo"].includes(t));
    if (isPhotoQuery && currentProduct) {
      let drainageNote = "";
      if (cleanText.includes("drenaje") || cleanText.includes("crenaje") || cleanText.includes("para que") || currentProduct.sku === "REG-10") {
        drainageNote = "\n\n🚿 **¿Para qué sirve el drenaje lineal (16 × 2.5 cm)?**\nEs una rejilla de piso en acero inoxidable 304 que permite un desagüe rápido y continuo en la ducha, evita encharcamientos, atrapa residuos y cuenta con sello anti-olores.";
      }

      return {
        text: `¡Claro! Aquí tienes fotografías reales de **${currentProduct.name}** (${currentProduct.sku}):\n\n🏷️ **Precio:** L.${Number(currentProduct.salePrice).toLocaleString("es-HN")}\n📦 **Medidas / Detalle:** ${currentProduct.dimensions || "Estándar"}${drainageNote}\n\n✅ **Disponibilidad:** ${currentProduct.stock > 0 ? `${currentProduct.stock} unidades en stock` : "Agotado"}. ¿Deseas hacer tu pedido?`,
        product: currentProduct,
        images: currentProduct.images || []
      };
    }

    const isShippingQuery = tokens.some(t => ["envio", "envios", "entrega", "entregas", "tardan", "tarda", "tiempo", "domicilio", "casa", "dias"].includes(t)) ||
      cleanText.includes("venir a dejar") || cleanText.includes("venirme a dejar") || cleanText.includes("cuanto tiempo");
    if (isShippingQuery && currentProduct) {
      return {
        text: `¡Hola! Con gusto te informamos sobre el **${currentProduct.name} (SKU: ${currentProduct.sku})**:\n\n🚚 **Tiempo de entrega:** Nuestro tiempo estimado de entrega a domicilio es de **1 a 2 días hábiles** a todo el país vía Cargo Expreso (en Tegucigalpa y San Pedro Sula podemos coordinar entrega el mismo día si realizas tu pedido temprano).\n\n💵 **Pago seguro:** Pagas en efectivo **contra entrega** al recibir el paquete en la puerta de tu casa.\n\n✅ Tenemos **${currentProduct.stock} unidades en stock** a precio de oferta **L.${Number(currentProduct.salePrice).toLocaleString("es-HN")}**. ¿A qué ciudad y colonia sería tu entrega?`,
        product: currentProduct,
        images: currentProduct.images?.slice(0, 1) || []
      };
    }

    // 8. PARAMETRIC RULES (Stock & Availability Query)
    const isStockQuery = tokens.some(t => ["stock", "disponible", "disponibilidad", "quedan", "hay", "existencia", "inventario", "tienen"].includes(t)) ||
      this.matchesSynonym(tokens, synonyms, "stock");

    if (skuExtraction || isStockQuery) {
      const parametricRule = rules.find(r => r.enabled && r.type === "parametric") || {
        responseInStock: "¡Sí, tenemos disponible! Del SKU **{sku}** ({name}) nos quedan **{stock} unidades** a L.{salePrice}.",
        responseOutOfStock: "El producto **{name}** (SKU: {sku}) se encuentra actualmente **agotado**.",
        responseNotFound: "No encontramos ningún producto con el código **{sku}** en nuestro catálogo."
      };

      if (skuExtraction) {
        const { sku, product } = skuExtraction;
        if (product) {
          this.selectedProduct = product;
          const template = product.stock > 0 ? parametricRule.responseInStock : parametricRule.responseOutOfStock;
          const text = template
            .replace(/\{sku\}/g, product.sku || sku)
            .replace(/\{name\}/g, product.name)
            .replace(/\{stock\}/g, String(product.stock))
            .replace(/\{salePrice\}/g, Number(product.salePrice).toLocaleString("es-HN"))
            .replace(/\{regularPrice\}/g, Number(product.regularPrice).toLocaleString("es-HN"));

          return {
            text,
            product,
            images: product.images?.slice(0, 2) || []
          };
        } else {
          // SKU was given explicitly (e.g. XXX) but not found in products
          const text = (parametricRule.responseNotFound || "No encontramos productos con el SKU {sku}.")
            .replace(/\{sku\}/g, sku);
          return { text };
        }
      }
    }

    // 7. General Catalog Query ("ver catálogo", "qué productos tienen", etc.)
    const isCatalogQuery = tokens.some(t => ["catalogo", "productos", "modelos", "articulos"].includes(t)) ||
      cleanText.includes("que venden") || cleanText.includes("ver catalogo") || cleanText.includes("que tienen");
    if (isCatalogQuery) {
      const catalogItems = products.map(p => `• **${p.sku}** · ${p.name} — *L.${Number(p.salePrice).toLocaleString("es-HN")}* (${p.stock > 0 ? `${p.stock} en stock` : "Agotado"})`).join("\n");
      return {
        text: `📦 **Catálogo de ${tenant.name}**:\n\n${catalogItems}\n\nPuedes preguntarme por el stock de cualquiera de ellos (por ejemplo: *"¿Tienen stock para el SKU ${products[0]?.sku || "EST-01"}?"*).`,
        catalog: products
      };
    }

    // 8. DYNAMIC Q&A RULES (Static & FAQ Rules configured in admin)
    const activeRules = rules.filter(r => r.enabled && r.type !== "restriction" && r.type !== "parametric");
    for (const rule of activeRules) {
      const isMatched = rule.trainingPhrases.some(phrase => matchPhrase(cleanText, tokens, phrase));

      if (isMatched) {
        if (rule.action === "show_catalog") {
          const catalogItems = products.map(p => `• **${p.sku}** · ${p.name} — *L.${Number(p.salePrice).toLocaleString("es-HN")}* (${p.stock > 0 ? `${p.stock} en stock` : "Agotado"})`).join("\n");
          return {
            text: `${rule.response}\n\n${catalogItems}`,
            catalog: products
          };
        }
        return { text: rule.response };
      }
    }

    // 9. Specific attributes using dynamic synonyms (Price, Dimensions, Weight, Photos)
    if (this.matchesSynonym(tokens, synonyms, "precio") || tokens.some(t => ["precio", "cuesta", "costo", "vale"].includes(t))) {
      if (currentProduct) {
        return {
          text: `El producto **${currentProduct.name}** (SKU: ${currentProduct.sku}) tiene un precio regular de L.${Number(currentProduct.regularPrice).toLocaleString("es-HN")} y precio de oferta especial de **L.${Number(currentProduct.salePrice).toLocaleString("es-HN")}**.`
        };
      }
    }

    if (this.matchesSynonym(tokens, synonyms, "dimensiones") || tokens.some(t => ["medidas", "talla", "tallas", "tamano"].includes(t))) {
      if (currentProduct) {
        return {
          text: `Las medidas / tallas de **${currentProduct.name}** (SKU: ${currentProduct.sku}) son: **${currentProduct.dimensions}**.`
        };
      }
    }

    if (this.matchesSynonym(tokens, synonyms, "peso") || tokens.some(t => ["peso", "aguanta", "soporta", "resistencia"].includes(t))) {
      if (currentProduct) {
        return {
          text: `Capacidad y especificación de **${currentProduct.name}**: **${currentProduct.weightLimit}**.`
        };
      }
    }

    if (this.matchesSynonym(tokens, synonyms, "fotos") || tokens.some(t => ["foto", "fotos", "imagen", "imagenes"].includes(t))) {
      if (currentProduct && currentProduct.images?.length) {
        return {
          text: `¡Claro! Aquí tienes fotografías reales de **${currentProduct.name}** (${currentProduct.sku}):`,
          images: currentProduct.images
        };
      }
    }

    // 10. Purchase / Checkout initiation
    if (tokens.some(t => ["comprar", "pedido", "ordenar", "quiero", "orden"].includes(t)) || cleanText.includes("hacer pedido")) {
      return this.startCheckout(currentProduct);
    }

    // 11. Saludos
    if (tokens.some(t => ["hola", "buenas", "buen", "dia", "tardes", "noches"].includes(t))) {
      const topSku = products[0]?.sku || "EST-01";
      return {
        text: `¡Hola! 👋 Soy el asistente de ventas de **${tenant.name}**.\n\nPuedes consultarme por:\n• Ver nuestro catálogo completo (*"ver catálogo"*)\n• Disponibilidad de producto (*"¿Tienen stock para el SKU ${topSku}?"*)\n• Formas de pago, envíos y garantías.\n\n¿Qué te gustaría consultar hoy?`
      };
    }

    // 12. Smart fallback
    const sampleSku = products[0]?.sku || "EST-01";
    return {
      text: `Puedo informarte sobre precios, stock por SKU (ej. *"¿Tienen stock para el SKU ${sampleSku}?"*), fotos, envíos, o mostrarte nuestro catálogo completo. También puedes pedirme hablar con un asesor humano.`
    };
  }
}
