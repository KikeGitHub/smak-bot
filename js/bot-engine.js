import { StorageFacade } from "./storage-facade.js";

const clean = s => String(s || "")
  .toLocaleLowerCase("es")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[¿?¡!.,:;()"'\\/]/g, " ")
  .trim();

const tokenize = s => clean(s).split(/\s+/).filter(Boolean);

// Flexible phrase matcher with prefix/plural tolerance
function matchPhrase(cleanInput, inTokens, phrase) {
  const cPhrase = clean(phrase);
  if (!cPhrase) return false;
  if (cleanInput.includes(cPhrase) || cPhrase.includes(cleanInput)) return true;

  const phraseTokens = tokenize(cPhrase);
  if (!phraseTokens.length) return false;

  const matchedCount = phraseTokens.filter(pt => {
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

  return (matchedCount / phraseTokens.length) >= 0.65;
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

  startCheckout(product = null) {
    const tenant = StorageFacade.getTenant();
    const targetProduct = product || this.selectedProduct || tenant.products?.[0] || { name: "Producto", salePrice: 0, sku: "" };
    this.checkout = {
      step: "name",
      product: targetProduct,
      name: "",
      address: "",
      phone: ""
    };
    return {
      text: `¡Excelente elección! Preparo tu orden para **${targetProduct.name}** (L.${Number(targetProduct.salePrice).toLocaleString("es-HN")}). ¿A qué nombre registramos el pedido?`
    };
  }

  confirmOrder() {
    const c = this.checkout;
    if (!c || c.step !== "confirm") return null;
    const saved = StorageFacade.saveOrder({
      name: c.name,
      address: c.address,
      phone: c.phone,
      productName: c.product.name,
      sku: c.product.sku,
      total: Number(c.product.salePrice)
    });
    this.checkout = null;
    return saved;
  }

  // Extract SKU from user message
  extractSku(rawText, products = []) {
    // 1. Explicit pattern: "SKU XXX", "CODIGO XXX", "ARTICULO XXX"
    const explicitMatch = rawText.match(/(?:sku|c[oó]digo|codigo|art[ií]culo|articulo|ref|modelo)\s*[:#\-]?\s*([a-zA-Z0-9_\-]{2,15})/i);
    if (explicitMatch && explicitMatch[1]) {
      const candidate = explicitMatch[1].trim().toUpperCase();
      const found = products.find(p => p.sku?.toUpperCase() === candidate);
      return { sku: candidate, product: found || null, explicit: true };
    }

    // 2. Direct match with registered product SKUs in catalog
    for (const p of products) {
      if (p.sku && new RegExp(`\\b${p.sku}\\b`, "i").test(rawText)) {
        return { sku: p.sku.toUpperCase(), product: p, explicit: false };
      }
    }

    // 3. Match with product name keywords
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
    return wordList.some(word => targetTerms.some(term => term === word || word.includes(term) || term.includes(word)));
  }

  async reply(message, { audio = false } = {}) {
    const rawText = String(message || "").trim();
    const cleanText = clean(rawText);
    const tokens = tokenize(rawText);

    if (!cleanText) {
      return { text: "Hola, ¿en qué puedo ayudarte hoy?" };
    }

    // 1. Audio mode request
    if (audio || tokens.some(t => ["audio", "voz"].includes(t)) || cleanText.includes("no se leer")) {
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
        c.name = rawText;
        c.step = "address";
        return { text: `Gracias, ${c.name}. ¿Cuál es la dirección completa de entrega (ciudad y colonia)?` };
      }
      if (c.step === "address") {
        c.address = rawText;
        c.step = "phone";
        return { text: "Anotado. ¿A qué número de teléfono o WhatsApp te contactamos para la entrega?" };
      }
      if (c.step === "phone") {
        c.phone = rawText;
        c.step = "confirm";
        const prod = c.product;
        return {
          text: `📋 **Resumen de tu pedido**:\n• Producto: **${prod.name}** (SKU: ${prod.sku})\n• Total a pagar: **L.${Number(prod.salePrice).toLocaleString("es-HN")}**\n• Cliente: ${c.name}\n• Entrega: ${c.address}\n• Contacto: ${c.phone}\n\nPresiona el botón abajo para confirmar tu compra contra entrega.`,
          order: {
            name: c.name,
            address: c.address,
            phone: c.phone,
            productName: `${prod.name} (${prod.sku})`,
            sku: prod.sku,
            total: Number(prod.salePrice)
          }
        };
      }
    }

    const tenant = StorageFacade.getTenant();
    const products = tenant.products || [];
    const rules = tenant.rules || [];
    const synonyms = tenant.synonyms || {};

    // 4. Human handover request (using synonyms or defaults)
    const asesorKeywords = ["asesor", "humano", "persona", "operador", "agente", ...(synonyms.asesor || [])].map(clean);
    if (asesorKeywords.some(k => cleanText.includes(k))) {
      this.human = true;
      return {
        text: "Te transfiero de inmediato con un asesor humano. El asistente automático ha quedado en pausa.",
        human: true
      };
    }

    // 5. RESTRICTION RULES ("Lo que NO debe decir o hacer" - Guardrails tienen máxima prioridad)
    const restrictionRules = rules.filter(r => r.enabled && r.type === "restriction");
    for (const rule of restrictionRules) {
      const match = rule.trainingPhrases.some(phrase => matchPhrase(cleanText, tokens, phrase));
      if (match) {
        return { text: rule.response, isRestriction: true };
      }
    }

    // 6. PARAMETRIC RULES (e.g., SKU Stock Query)
    const skuExtraction = this.extractSku(rawText, products);
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
    const currentProduct = this.selectedProduct || products[0] || null;

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
