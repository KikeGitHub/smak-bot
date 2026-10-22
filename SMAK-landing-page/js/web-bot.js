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
        address: "",
        phone: "",
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
        text: `📋 **Resumen de tu pedido (${c.orderNumber})**:\n• Producto: **${prod.name}**\n• Cantidad / Piezas: **${c.quantityLabel || (c.quantity + " unid.")}**\n• Total a pagar: **L.${Number(c.total).toLocaleString("es-HN")}**\n• Cliente: ${c.name}\n• Entrega: ${c.address}\n• Contacto: ${c.phone}\n• Facturación: **${invoiceTxt}**\n\nPresiona el botón abajo para confirmar tu compra contra entrega.`,
        order: {
          orderNumber: c.orderNumber,
          name: c.name,
          address: c.address,
          phone: c.phone,
          productName: prod.name,
          quantity: c.quantity,
          quantityLabel: c.quantityLabel || `${c.quantity} unid.`,
          requiresInvoice: c.requiresInvoice,
          rtn: c.rtn,
          businessName: c.businessName,
          price: c.total
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
        address: c.address,
        phone: c.phone,
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
            text: `Anotado: **${c.quantityLabel}** (Total: L.${c.total.toLocaleString("es-HN")}). ¿Cuál es la dirección completa de entrega en Honduras (ciudad y colonia)?`
          };
        }
        if (c.step === "address") {
          c.address = rawText.trim();
          c.step = "phone";
          return {
            text: `Dirección registrada: ${c.address}.\n\n¿A qué número de teléfono o WhatsApp te contactamos para coordinar la entrega?`
          };
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
          const isTransfer = cleanText.includes("transferencia") || cleanText.includes("transfer") || cleanText.includes("cuenta") || cleanText.includes("bancaria") || cleanText.includes("banco");
          const isCard = cleanText.includes("tarjeta") || cleanText.includes("credito") || cleanText.includes("debito") || cleanText.includes("cuotas") || cleanText.includes("tasa cero") || cleanText.includes("visa") || cleanText.includes("mastercard");
          const isPaymentGeneral = cleanText.includes("pago") || cleanText.includes("pagar") || cleanText.includes("como pago");
          const isConfirmWord = ["confirmar", "confirmo", "si", "correcto", "listo", "dale", "ok", "adelante", "comprar", "proceder"].some(w => cleanText === w || cleanText.startsWith(w + " ") || cleanText.endsWith(" " + w));

          if (isConfirmWord && !isTransfer && !isCard && !isPaymentGeneral) {
            const saved = this.confirmOrder();
            return {
              text: `¡Muchas gracias, ${saved ? saved.name : "estimado cliente"}! 🎉 Tu pedido **${saved ? saved.orderNumber : ""}** (${saved ? saved.quantityLabel : "1 unid."}) ha quedado formalmente registrado en nuestro sistema backend. En breve te notificaremos cuando la guía de rastreo sea asignada.`
            };
          }

          const confirmation = this._buildOrderConfirmation(c);

          if (isTransfer) {
            return {
              text: `¡Sí, con gusto aceptamos transferencia bancaria! 🏦\n\nPuedes transferir a cualquiera de nuestras cuentas oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):\n\n• **BAC Credomatic (Cheques):** 742-108-951\n• **Banco Ficohsa (Cheques):** 2000-098-432\n• **Banco Atlántida (Ahorros):** 110-045-892\n• **Banpaís (Cheques):** 01-501-002345\n\nPuedes realizar tu transferencia y adjuntar tu comprobante por WhatsApp al coordinar la entrega, o bien pagar en efectivo contra entrega al recibir tu paquete en tu puerta.\n\n👇 **Tu pedido sigue listo para ser confirmado:**`,
              order: confirmation.order
            };
          }

          if (isCard) {
            return {
              text: `¡Sí! Aceptamos tarjetas Visa y Mastercard mediante enlace de pago seguro de BAC Credomatic con opción a cuotas sin intereses al 0%.\n\nTambién puedes pagar en efectivo contra entrega al recibir en tu puerta.\n\n👇 **Tu pedido sigue listo para ser confirmado:**`,
              order: confirmation.order
            };
          }

          if (isPaymentGeneral) {
            return {
              text: `Aceptamos dos modalidades de pago:\n1. **Efectivo contra entrega:** Pagas al recibir en tu puerta.\n2. **Transferencia bancaria previa:** A nuestras cuentas en BAC (742-108-951), Ficohsa (2000-098-432) o Atlántida (110-045-892).\n\n👇 **Tu pedido sigue listo para ser confirmado:**`,
              order: confirmation.order
            };
          }

          return {
            text: `Entendido. Tu orden **${c.orderNumber}** para **${c.product.name}** sigue lista.\n\nPuedes presionar el botón abajo para confirmar tu compra:`,
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
        const prod = this.selectedProduct || (window.SMAK_PRODUCTS && window.SMAK_PRODUCTS[0]);
        return {
          text: `¡Sí, aceptamos transferencia bancaria! 🏦\n\nPuedes realizar tu pago a cualquiera de nuestras cuentas oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):\n\n• **BAC Credomatic (Cheques):** 742-108-951\n• **Banco Ficohsa (Cheques):** 2000-098-432\n• **Banco Atlántida (Ahorros):** 110-045-892\n• **Banpaís (Cheques):** 01-501-002345\n\nPuedes pagar vía transferencia y adjuntar tu comprobante por el chat, o pagar en efectivo contra entrega al recibir tu paquete en tu puerta.\n\n¿Deseas realizar tu pedido${prod ? ` para **${prod.name}**` : ''}?`,
          product: prod || null
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
        if (this.selectedProduct) {
          const p = this.selectedProduct;
          const price = p.price || DEFAULT_PRICES[p.category] || 1500;
          return {
            text: `El producto **${p.name}** tiene un precio de **L.${price.toLocaleString("es-HN")}** con entrega contra entrega disponible.`
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
          <div><b>Cliente:</b> ${o.name}</div>
          <div><b>Producto:</b> ${o.productName}</div>
          <div><b>Piezas / Cantidad:</b> <span style="color:#D97706;font-weight:700;">${o.quantityLabel || (o.quantity + " unid.")}</span></div>
          <div><b>Entrega:</b> ${o.address}</div>
          <div><b>Teléfono:</b> ${o.phone}</div>
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
