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

const STOP_WORDS = new Set(['de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'es', 'son', 'lo', 'en', 'por', 'que', 'se', 'me', 'te', 'le', 'y', 'o', 'al', 'del', 'a', 'con', 'para', 'como', 'si', 'su', 'sus', 'mi', 'mis', 'tu', 'tus']);

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
      text: `¡Excelente elección! Preparo tu orden (*N° ${orderNumber}*) para **${targetProduct.name}** (L.${Number(targetProduct.salePrice).toLocaleString("es-HN")}). ¿A qué nombre registramos tu pedido?`
    };
  }

  _buildOrderConfirmationResponse(c) {
    const prod = c.product;
    const invoiceTxt = c.requiresInvoice 
      ? `Sí (RTN: ${c.rtn} · ${c.businessName})` 
      : "No (Consumidor Final)";
    const deliverySummary = c.isAgencyPickup
      ? `🏢 Retiro en Agencia Cargo Expreso (${c.address})`
      : `${c.address}${c.location ? `\n• 📍 Mapa GPS: [Ver en Google Maps](${c.location.mapUrl})` : ""}`;

    return {
      text: `📋 **Resumen de tu pedido (${c.orderNumber})**:\n• Producto: **${prod.name}** (SKU: ${prod.sku})\n• Cantidad / Piezas: **${c.quantityLabel || (c.quantity + " unid.")}**\n• Total a pagar: **L.${Number(c.total).toLocaleString("es-HN")}**\n• Destinatario: ${c.recipientName || c.name}\n• Entrega: ${deliverySummary}\n• Contacto (Llamadas Cargo Expreso): ${c.phone}\n• Facturación: **${invoiceTxt}**\n\nPresiona el botón abajo para confirmar tu compra con pago contra entrega.`,
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
    const detectedLoc = location || (typeof LocationService !== "undefined" && LocationService.parseLocationFromText ? LocationService.parseLocationFromText(rawText) : null);
    if (detectedLoc) {
      const locName = detectedLoc.address || detectedLoc.name || `Ubicación GPS (${detectedLoc.lat.toFixed(4)}, ${detectedLoc.lng.toFixed(4)})`;
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
        ack: `✏️ ¡Listo! Hemos actualizado tu ubicación GPS de entrega a: **${locName}** 📍`
      };
    }

    // 2. Modificación de Dirección (Texto)
    const isAddressPromptOnly = /^(?:cambiar|modificar|corregir)?\s*(?:la\s+)?(?:direccion|entrega|ubicacion)$/i.test(cleanText.trim());
    if (isAddressPromptOnly) {
      c.step = "address";
      return {
        redirect: true,
        prompt: `Por favor compártenos tu nueva dirección de entrega detallada (o presiona el botón 📍 abajo para enviar tu ubicación GPS):\n\n• **Nombre del destinatario**\n• **Calle y número de casa / referencia**\n• **Colonia, barrio o sector**\n• **Ciudad / Municipio**\n• **Código postal**`
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
        prompt: `Por favor compártenos tu nuevo **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega de tu paquete 📞:`
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
      const unitPrice = Number(c.product.salePrice || c.unitPrice || 0);
      c.total = unitPrice * detectedQty;
      return {
        modified: true,
        field: "quantity",
        ack: `✏️ ¡Listo! Hemos actualizado la cantidad a **${c.quantityLabel}** (Nuevo total: **L.${Number(c.total).toLocaleString("es-HN")}**).`
      };
    }

    // 7. Modificación de Producto
    const isProductChangeIntent = ["cambiar por", "cambiar a", "mejor el", "mejor la", "cambiar producto", "quiero el", "quiero la", "en vez de", "en lugar de"].some(p => cleanText.includes(p));
    if (isProductChangeIntent && products.length) {
      for (const p of products) {
        if (cleanText.includes(clean(p.name)) || (p.sku && cleanText.includes(clean(p.sku)))) {
          if (p.sku !== c.product.sku) {
            c.product = p;
            const unitPrice = Number(p.salePrice || p.price || 0);
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

    // 2. Deep-link bracketed SKU: "[SKU: EST-01]", "[SKM-955-CA-NE]"
    const bracketMatch = rawText.match(/\[(?:sku:?\s*)?([a-zA-Z0-9_\-xX]{2,35})\]/i);
    if (bracketMatch && bracketMatch[1]) {
      const candidate = bracketMatch[1].trim().toUpperCase();
      const found = products.find(p => p.sku?.toUpperCase() === candidate);
      if (found) {
        return { sku: candidate, product: found, explicit: true, source: "deep_link" };
      }
    }

    // 3. Explicit pattern: "SKU XXX", "CODIGO XXX", "ARTICULO XXX"
    const explicitMatch = rawText.match(/(?:sku|c[oó]digo|codigo|art[ií]culo|articulo|ref|modelo)\s*[:#\-]?\s*([a-zA-Z0-9_\-xX]{2,35})/i);
    if (explicitMatch && explicitMatch[1]) {
      const candidate = explicitMatch[1].trim().toUpperCase();
      const found = products.find(p => p.sku?.toUpperCase() === candidate);
      return { sku: candidate, product: found || null, explicit: true };
    }

    // 4. Direct match with registered product SKUs in catalog
    const cRawUpper = rawText.toUpperCase();
    for (const p of products) {
      if (p.sku && (cRawUpper.includes(p.sku.toUpperCase()) || new RegExp(`\\b${p.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i").test(rawText))) {
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
  matchesSynonym(wordList, synonyms, concept, cleanText = "") {
    const synList = synonyms[concept] || [];
    const targetTerms = [concept, ...synList].map(clean);
    return targetTerms.some(term => {
      if (term.includes(" ")) {
        return cleanText ? cleanText.includes(term) : false;
      }
      return wordList.some(word => {
        if (term === word) return true;
        if (word.length >= 4 && term.length >= 4) {
          const rootLen = Math.min(word.length, term.length) - 1;
          return word.slice(0, rootLen) === term.slice(0, rootLen);
        }
        return false;
      });
    });
  }

  // Dimension and measurement intent detection
  _isDimensionIntent(cleanText, tokens, synonyms = {}) {
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

    return this.matchesSynonym(tokens, synonyms, "dimensiones", cleanText);
  }

  // Detection of Agency Pickup Addresses (Cargo Expreso / Delivery agencies in Honduras)
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

  // Detection of Delivery Schedule / Specific Hours / Saturdays Queries
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

  // Detection of Agency Pickup General Inquiries
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
      return `🏝️ **Entregas en Roatán, Útila o Islas de la Bahía:**\nPara Roatán o Útila, solo hacemos envíos con **transferencia previa**.\nUna vez nos hace llegar el comprobante de transferencia bancaria, nosotros enviamos el producto hacia el **muelle de cabotaje de La Ceiba** con la indicación de subir el paquete al ferry que usted diga (Utila Dream, Galaxy Wave, etc.).\n⚠️ **Nota:** No cubrimos el costo del ferry (el flete marítimo corre por cuenta del cliente).`;
    }

    // 2. Forza u otra paquetería
    if (["forza", "otra paqueteria", "otras paqueterias", "otra empresa", "otra agencia", "fedex", "dhl", "rapido cargo"].some(t => cleanText.includes(t))) {
      return `📦 **Transportadora:** No, únicamente realizamos entregas a través de **Cargo Expreso**.`;
    }

    // 3. Tarjeta de crédito / débito
    if (["tarjeta", "tarjetas", "visa", "mastercard", "pos", "datafast", "link de pago"].some(t => cleanText.includes(t))) {
      return `💳 **Forma de Pago con Tarjeta:** No aceptamos pagos con tarjeta, solo pago en efectivo contra entrega y se le paga al operador de Cargo Expreso o por transferencia electrónica previa, pero la transferencia debe confirmarse antes de realizar el envío.`;
    }

    // 4. Ubicación física / Tienda
    if ((cleanText.includes("donde") || cleanText.includes("ubicacion") || cleanText.includes("sucursal") || cleanText.includes("tienda fisica") || cleanText.includes("local")) && !cleanText.includes("direccion de entrega") && (cleanText.includes("estan") || cleanText.includes("encuentran") || cleanText.includes("queda") || cleanText.includes("tienda") || cleanText.includes("puerto cortes") || cleanText.includes("local"))) {
      return `📍 **Ubicación Física:** Nos encontramos ubicados en **Plaza Krisale, Puerto Cortés, Honduras**.\n\n¡Realizamos envíos gratuitos a domicilio a cualquier parte del país vía Cargo Expreso!`;
    }

    // 5. Costo de envío
    if (["costo de envio", "cuanto cobran", "cuanto vale el envio", "precio del envio", "cobran envio", "cobran el envio", "el envio es gratis", "flete"].some(t => cleanText.includes(t))) {
      return `🚚 **Costo de Envío:** ¡El envío es **completamente gratuito** a cualquier parte del país! Solo cancelas el valor del producto al recibirlo en efectivo contra entrega.`;
    }

    // 6. Garantía
    if (["garantia", "garantias", "defecto", "desperfecto"].some(t => cleanText.includes(t))) {
      return `🛡️ **Garantía:** Cuentan con garantía únicamente contra **defectos de fabricación**.`;
    }

    // 7. ¿Son nuevas?
    if (["son nuevas", "son nuevos", "muebles nuevos", "productos nuevos", "es nuevo", "usado", "de segunda"].some(t => cleanText.includes(t))) {
      return `✨ **Condición del Producto:** Sí, todos nuestros productos son **100% nuevos de fábrica** en su caja original sellada.`;
    }

    // 8. Mejor precio / descuento
    if (["mejor precio", "descuento", "rebaja", "cuanto es lo menos", "mayoreo", "por mayor"].some(t => cleanText.includes(t))) {
      return `🏷️ **Mejor Precio:** El precio especial sería equivalente a la cantidad de piezas solicitadas por el cliente. Si necesitas ordenar varias piezas o mayoreo, indícanos cuántas unidades deseas y con gusto te cotizamos.`;
    }

    return null;
  }

  _getScheduleAndAgencyExplanation() {
    return `🚚 **Información sobre Horarios y Agencias de Cargo Expreso:**\n\n• **Ruta a domicilio:** Las entregas se realizan de Lunes a Viernes de 8:00 AM a 5:00 PM, y los **Sábados únicamente medio día** (hasta las 12:00 PM).\n• **Dependencia de la agencia:** Como las entregas se coordinan con la empresa de transporte (**Cargo Expreso / agencias de delivery en Honduras**), las rutas dependen directamente de su logística diaria. Por esta razón, **no depende de nosotros garantizar un horario específico o día fijo en tiempo y forma** (el motorista siempre te llamará antes de llegar a tu domicilio).\n\n💡 **Recomendación (Retiro en Agencia):** Si necesitas un horario muy específico o no estás seguro de estar en casa, **te sugerimos solicitar el paquete para retiro en una agencia u oficina de Cargo Expreso** en tu ciudad. Tu paquete te esperará en ventanilla para recogerlo a tu conveniencia (ten presente que los sábados también atienden medio día).`;
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

    const tenant = StorageFacade.getTenant();
    const synonyms = tenant.synonyms || {};

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
        const policy = this._getPolicyResponse(cleanText, tokens);
        if (policy) {
          return {
            text: `${policy}\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?`
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
            text: `${expl}\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?`
          };
        }
        if (this._isDimensionIntent(cleanText, tokens, synonyms)) {
          const p = c.product;
          return {
            text: `📏 **Medidas de ${p.name} (${p.sku}):** **${p.dimensions || 'Estándar'}** (Soporte: ${p.weightLimit || 'Uso comercial y residencial'}).\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?`
          };
        }
        c.name = rawText.trim();
        c.recipientName = c.name;
        c.step = "quantity";
        return { 
          text: `Gracias, ${c.name}. ¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):` 
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
        if (this._isDimensionIntent(cleanText, tokens, synonyms)) {
          const p = c.product;
          return {
            text: `📏 **Medidas de ${p.name} (${p.sku}):** **${p.dimensions || 'Estándar'}** (Soporte: ${p.weightLimit || 'Uso comercial y residencial'}).\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):`
          };
        }
        const match = rawText.match(/\d+/);
        const q = match ? Math.max(1, parseInt(match[0], 10)) : 1;
        c.quantity = q;
        c.quantityLabel = rawText.trim() || `${q} ${q === 1 ? 'unidad' : 'unidades'}`;
        c.total = Number(c.product.salePrice) * q;
        c.step = "address";
        return {
          text: `Anotado: **${c.quantityLabel}** (Total: L.${Number(c.total).toLocaleString("es-HN")}).\n\n🚚 Para coordinar la entrega con **Cargo Expreso**, por favor compártenos tus datos de entrega:\n\n• **Entrega a domicilio:** Destinatario, Calle y número de casa / referencia, Colonia o barrio, Ciudad y Código postal (o presiona el botón 📍 abajo para enviar tu ubicación GPS de WhatsApp).\n• **¿Prefieres retirar en agencia?** Puedes indicarnos la **oficina o agencia de Cargo Expreso** de tu ciudad donde prefieres retirar (teniendo en cuenta que los sábados trabajan medio día).\n\n💡 *Ejemplo domicilio:* ${c.name}, Calle Principal #15 frente a pulpería, Col. Palmira, Tegucigalpa, CP 11101\n💡 *Ejemplo agencia:* Agencia Cargo Expreso San Pedro Sula Centro`
        };
      }
      if (c.step === "address") {
        const policy = this._getPolicyResponse(cleanText, tokens);
        if (policy) {
          return {
            text: `${policy}\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o envía tu ubicación GPS 📍:`
          };
        }
        if (cleanText.includes("transferencia") || cleanText.includes("transfer")) {
          return {
            text: `¡Sí, aceptamos transferencia bancaria y efectivo contra entrega! 🏦\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o envía tu ubicación GPS 📍:`
          };
        }
        if (this._isDimensionIntent(cleanText, tokens, synonyms)) {
          const p = c.product;
          return {
            text: `📏 **Medidas de ${p.name} (${p.sku}):** **${p.dimensions || 'Estándar'}** (Soporte: ${p.weightLimit || 'Uso comercial y residencial'}).\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o envía tu ubicación GPS 📍:`
          };
        }

        // Detección directa de entrega en agencia u oficina Cargo Expreso (Ocurre)
        if (this._isAgencyAddress(rawText)) {
          c.isAgencyPickup = true;
          c.address = rawText.trim();
          c.recipientName = c.recipientName || c.name;
          c.step = "phone";
          return {
            text: `¡Excelente elección! 🏢 Registrado para **retiro en agencia de Cargo Expreso**:\n\n📌 **Agencia de retiro:** ${c.address}\n👤 **Destinatario para reclamar en ventanilla:** ${c.recipientName}\n\n⚠️ **Horarios de agencia:** Atienden de Lunes a Viernes (8:00 AM - 5:00 PM) y los **Sábados únicamente medio día** (hasta las 12:00 PM).\n\n📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega y notificarte la guía de rastreo?\n\n⚠️ **Importante:** Cargo Expreso coordina y avisa la llegada del paquete **únicamente vía llamada telefónica** (asegúrate de que la línea pueda recibir llamadas directas).`
          };
        }

        if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
          const expl = this._getScheduleAndAgencyExplanation();
          return {
            text: `${expl}\n\n📍 Para continuar con tu orden, indícanos si prefieres que lo enviemos a tu **dirección de domicilio** (con destinatario, colonia y ciudad) o la **oficina/agencia de Cargo Expreso** donde pasarás a retirar:`
          };
        }

        const detectedLoc = location || LocationService.parseLocationFromText(rawText);
        if (detectedLoc) {
          const locName = detectedLoc.address || detectedLoc.name || `Ubicación GPS (${detectedLoc.lat.toFixed(4)}, ${detectedLoc.lng.toFixed(4)})`;
          c.address = locName;
          c.recipientName = c.recipientName || c.name;
          c.location = {
            lat: detectedLoc.lat,
            lng: detectedLoc.lng,
            name: detectedLoc.name || locName,
            address: locName,
            mapUrl: detectedLoc.mapUrl || LocationService.getGoogleMapsUrl(detectedLoc.lat, detectedLoc.lng)
          };
          c.step = "phone";
          return {
            text: `¡Ubicación GPS registrada con éxito! 📍\n\n📌 **Dirección de entrega:** ${locName}\n🗺️ [Ver en Google Maps](${c.location.mapUrl})\n👤 **Destinatario:** ${c.recipientName}\n\n📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega?\n\n⚠️ **Importante:** Cargo Expreso coordina la entrega **únicamente vía llamada telefónica** antes de llegar a tu domicilio (asegúrate de que la línea pueda recibir llamadas directas).`,
            location: c.location
          };
        }

        // Validación y condicionamiento de dirección en texto
        const cleaned = clean(rawText);
        const words = rawText.trim().split(/\s+/);
        const hasKeyword = ["col", "colonia", "barrio", "b°", "sector", "calle", "ave", "avenida", "casa", "bloque", "res", "residencial", "tegucigalpa", "san pedro", "sps", "ceiba", "choluteca", "comayagua", "frente", "cerca", "etapa", "aldea"].some(k => cleaned.includes(k));
        const isTooShort = rawText.trim().length < 12 || words.length < 3 || (!hasKeyword && words.length < 4);

        if (isTooShort) {
          return {
            text: `Para que **Cargo Expreso** pueda entregar tu paquete sin retrasos, por favor indícanos una dirección más detallada (o presiona el botón 📍 abajo para enviar tu ubicación GPS):\n\n• **A domicilio:** Nombre del destinatario, Calle y casa / referencia, Colonia o barrio, y Ciudad / Municipio.\n• **En agencia:** Oficina o sucursal de Cargo Expreso de tu ciudad donde prefieres retirar en ventanilla.\n\n💡 *Ejemplo domicilio:* ${c.name}, Calle Principal, Casa #15 frente a pulpería, Col. Miramontes, Tegucigalpa.\n💡 *Ejemplo agencia:* Agencia Cargo Expreso San Pedro Sula Centro.`
          };
        }

        // Dirección válida en texto
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
            text: `${policy}\n\nPara continuar, compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega de tu paquete 📞:`
          };
        }
        if (cleanText.includes("transferencia") || cleanText.includes("transfer")) {
          return {
            text: `¡Sí, aceptamos transferencia bancaria y efectivo contra entrega! 🏦\n\nPara continuar, compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega de tu paquete 📞:`
          };
        }
        if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
          const expl = this._getScheduleAndAgencyExplanation();
          return {
            text: `${expl}\n\nPara continuar con tu pedido, compártenos tu **número telefónico que reciba llamadas** para coordinar la entrega con Cargo Expreso 📞:`
          };
        }
        if (this._isDimensionIntent(cleanText, tokens, synonyms)) {
          const p = c.product;
          return {
            text: `📏 **Medidas de ${p.name} (${p.sku}):** **${p.dimensions || 'Estándar'}** (Soporte: ${p.weightLimit || 'Uso comercial y residencial'}).\n\nContinuemos con tu pedido: compártenos tu **número telefónico que reciba llamadas** para coordinar la entrega con Cargo Expreso 📞:`
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
      if (c.step === "confirm") {
        const tenant = StorageFacade.getTenant();
        const products = tenant.products || [];

        // 1. Modificación de datos ya confirmados (cantidad, dirección/GPS, teléfono, facturación, destinatario o producto)
        const mod = this._handleOrderModifications(c, rawText, cleanText, tokens, products, location);
        if (mod.redirect) {
          return { text: mod.prompt };
        }
        if (mod.modified) {
          const confirmation = this._buildOrderConfirmationResponse(c);
          return {
            text: `${mod.ack}\n\n${confirmation.text}`,
            order: confirmation.order
          };
        }

        // 2. Intención genuina de confirmación de compra
        if (this._isConfirmIntent(cleanText, rawText)) {
          const saved = this.confirmOrder();
          return {
            text: `¡Muchas gracias, ${saved.name}! 🎉 Tu pedido **${saved.orderNumber}** (${saved.quantityLabel || '1 unid.'}) ha quedado formalmente registrado en nuestro sistema backend. En breve te notificaremos cuando la guía de rastreo sea asignada.`
          };
        }

        // 3. Responder a cualquier pregunta manteniendo el resumen y el botón de confirmación
        const answer = await this._getGeneralAnswer(rawText, cleanText, tokens, { referral, location });
        const confirmation = this._buildOrderConfirmationResponse(c);
        const replyText = `${answer.text || ""}\n\n👇 **Tu pedido (${c.orderNumber}) sigue listo para confirmar:**`;

        return {
          ...answer,
          text: replyText,
          order: confirmation.order
        };
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

    return await this._getGeneralAnswer(rawText, cleanText, tokens, { referral, location });
  }

  async _getGeneralAnswer(rawText, cleanText, tokens, { referral = null, location = null } = {}) {
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

    // 5b. Transferencia bancaria inquiry outside of checkout
    const isTransferQuery = cleanText.includes("transferencia") || cleanText.includes("transfer") || (cleanText.includes("cuenta") && (cleanText.includes("banco") || cleanText.includes("transferir") || cleanText.includes("depositar")));
    if (isTransferQuery) {
      const activeProd = this.selectedProduct || (this.checkout ? this.checkout.product : null) || products[0];
      return {
        text: `¡Sí, aceptamos transferencia bancaria! 🏦\n\nPuedes realizar tu pago a cualquiera de nuestras cuentas oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):\n\n• **BAC Credomatic (Cheques):** 742-108-951\n• **Banco Ficohsa (Cheques):** 2000-098-432\n• **Banco Atlántida (Ahorros):** 110-045-892\n• **Banpaís (Cheques):** 01-501-002345\n\nPuedes pagar vía transferencia bancaria y compartirnos tu comprobante por este chat, o si prefieres también puedes pagar en efectivo contra entrega al recibir tu producto en la puerta de tu casa.\n\n¿Deseas que preparemos tu pedido${activeProd ? ` para **${activeProd.name}**` : ''}?`,
        product: activeProd || null
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
    const currentProduct = this.selectedProduct || (this.checkout ? this.checkout.product : null) || products[0] || null;

    // 7. SPECIFIC PRODUCT INTENTS (Dimensions/Medidas, Photos, Shipping/Delivery, Price)

    // 7a. DIMENSIONS & MEASUREMENTS QUERY ("medidas", "dimenciones", "dimensiones", "cuánto mide", "mide", etc.)
    const isDimensionQuery = this._isDimensionIntent(cleanText, tokens, synonyms);
    if (isDimensionQuery) {
      const targetProd = (skuExtraction && skuExtraction.product)
        || products.find(p => {
             const pName = clean(p.name);
             const pSku = clean(p.sku);
             return (pSku && cleanText.includes(pSku)) ||
                    (p.keywords || []).some(k => k.length > 2 && cleanText.includes(clean(k))) ||
                    pName.split(/\s+/).filter(w => w.length > 3).some(w => cleanText.includes(w));
           })
        || this.selectedProduct
        || (this.checkout ? this.checkout.product : null);

      if (targetProd) {
        this.selectedProduct = targetProd;
        const isAvailable = targetProd.stock > 0;
        const isCalzado = tenant.id === "calzado";
        let detailNote = "";
        if (cleanText.includes("drenaje") || cleanText.includes("crenaje") || targetProd.sku === "REG-10") {
          detailNote = "\n• **Drenaje lineal de piso:** 16 × 2.5 cm (acero inoxidable 304, desagüe continuo y sello anti-olores).";
        }

        const dimensionText = `📏 **Medidas y Especificaciones de ${targetProd.name} (SKU: ${targetProd.sku}):**\n\n• **${isCalzado ? 'Tallas disponibles' : 'Dimensiones'}:** **${targetProd.dimensions || 'Estándar según especificación técnica'}**\n• **${isCalzado ? 'Especificación' : 'Capacidad / Soporte'}:** ${targetProd.weightLimit || 'Uso comercial y residencial'}${detailNote}\n• **Precio de oferta:** **L.${Number(targetProd.salePrice).toLocaleString("es-HN")}**\n• **Disponibilidad:** ${isAvailable ? `✅ ¡${targetProd.stock} unidades en stock!` : '⚠️ Agotado temporalmente'}\n\n¿Deseas que preparemos tu pedido contra entrega o prefieres consultar algo más?`;

        return {
          text: dimensionText,
          product: targetProd,
          images: targetProd.images?.slice(0, 2) || []
        };
      } else {
        const sampleItems = products.slice(0, 6).map(p => `• **${p.name}** (${p.sku}): **${p.dimensions || 'Estándar'}** *(Capacidad: ${p.weightLimit || 'Estándar'})*`).join("\n");
        return {
          text: `📏 **Guía de Medidas y Dimensiones de ${tenant.name}:**\n\nAquí tienes las dimensiones exactas de nuestros productos más destacados:\n\n${sampleItems}\n\n¿Por las medidas o especificaciones de qué producto en específico deseas consultar?`,
          catalog: products.slice(0, 6)
        };
      }
    }

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

    // 7b. BUSINESS POLICIES & FAQS FROM EXCEL (Roatán/Útila, Forza, Tarjeta, Ubicación, Envío Gratis, Garantía, Nuevos, Mejor precio)
    const policyAns = this._getPolicyResponse(cleanText, tokens);
    if (policyAns) {
      const activeProd = this.selectedProduct || (this.checkout ? this.checkout.product : null) || products[0];
      return {
        text: `${policyAns}\n\n¿Deseas que preparemos tu pedido${activeProd ? ` para **${activeProd.name}**` : ''}?`,
        product: activeProd || null
      };
    }

    // 7c. SCHEDULES, SPECIFIC HOURS & AGENCY PICKUP INQUIRY (Cargo Expreso constraints)
    if (this._isScheduleDeliveryQuery(cleanText, tokens) || this._isAgencyPickupQuery(cleanText, tokens)) {
      const expl = this._getScheduleAndAgencyExplanation();
      const activeProd = this.selectedProduct || (this.checkout ? this.checkout.product : null) || products[0];
      return {
        text: `${expl}\n\n¿Deseas que preparemos tu pedido${activeProd ? ` para **${activeProd.name}**` : ''}?`,
        product: activeProd || null
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

    if ((skuExtraction || isStockQuery) && !isDimensionQuery) {
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

    if (this._isDimensionIntent(cleanText, tokens, synonyms)) {
      if (currentProduct) {
        return {
          text: `📏 **Medidas de ${currentProduct.name} (${currentProduct.sku}):** **${currentProduct.dimensions || 'Estándar'}** (Soporte: ${currentProduct.weightLimit || 'Uso comercial y residencial'}).`,
          product: currentProduct,
          images: currentProduct.images?.slice(0, 2) || []
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
