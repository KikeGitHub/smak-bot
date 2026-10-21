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

    startCheckout(product = null) {
      const allProducts = window.SMAK_PRODUCTS || [];
      const prod = product || this.selectedProduct || allProducts[0] || { name: "Mueble SMAK", category: "Muebles y Organización" };
      const price = prod.price || DEFAULT_PRICES[prod.category] || 1500;

      this.checkout = {
        step: "name",
        product: prod,
        price,
        name: "",
        address: "",
        phone: ""
      };

      return {
        text: `¡Excelente elección! Preparo tu orden para **${prod.name}** (*L.${price.toLocaleString("es-HN")}*).\n\n¿A qué nombre registramos tu pedido?`
      };
    }

    confirmOrder() {
      const c = this.checkout;
      if (!c || c.step !== "confirm") return null;

      const orderData = {
        id: "web-" + Date.now(),
        tenantId: "smak",
        name: c.name,
        address: c.address,
        phone: c.phone,
        productName: c.product.name,
        sku: c.product.id ? c.product.id.slice(0, 8).toUpperCase() : "SMAK-WEB",
        total: c.price,
        source: "landing_page_widget",
        createdAt: new Date().toISOString()
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
          c.name = rawText;
          c.step = "address";
          return {
            text: `Mucho gusto, ${c.name}. ¿Cuál es la dirección completa de entrega (ciudad, colonia y punto de referencia)?`
          };
        }
        if (c.step === "address") {
          c.address = rawText;
          c.step = "phone";
          return {
            text: `Anotado en ${c.address}. ¿A qué número de teléfono o WhatsApp te contactamos para coordinar la entrega?`
          };
        }
        if (c.step === "phone") {
          c.phone = rawText;
          c.step = "confirm";
          const prod = c.product;
          return {
            text: `📋 **Resumen de tu pedido**:\n• Producto: **${prod.name}**\n• Total a pagar: **L.${c.price.toLocaleString("es-HN")}**\n• Cliente: ${c.name}\n• Entrega: ${c.address}\n• Contacto: ${c.phone}\n\nPresiona el botón abajo para confirmar tu compra contra entrega.`,
            order: {
              name: c.name,
              address: c.address,
              phone: c.phone,
              productName: prod.name,
              price: c.price
            }
          };
        }
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

      // 6. Métodos de Pago
      if (matchesConcept(tokens, "pago") || cleanText.includes("como se paga")) {
        return {
          text: `💳 **Formas de Pago**:\n\n1. **Pago contra entrega en efectivo:** Pagas al recibir tu paquete en tu domicilio.\n2. **Transferencia bancaria:** Disponible en BAC, Ficohsa, Atlántida y Banpaís.\n\nTodos nuestros pedidos incluyen garantía de satisfacción y factura.`
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
          <div class="web-bot-order-title">📦 Confirmación de Pedido</div>
          <div><b>Cliente:</b> ${o.name}</div>
          <div><b>Producto:</b> ${o.productName}</div>
          <div><b>Entrega:</b> ${o.address}</div>
          <div><b>Teléfono:</b> ${o.phone}</div>
          <div><b>Total a pagar:</b> L.${Number(o.price).toLocaleString('es-HN')}</div>
          <button type="button" class="web-bot-order-confirm-btn" data-action="confirm-order">✓ Confirmar pedido contra entrega</button>
        `;
        const confirmBtn = oCard.querySelector('[data-action="confirm-order"]');
        confirmBtn?.addEventListener("click", () => {
          const saved = engine.confirmOrder();
          confirmBtn.disabled = true;
          confirmBtn.textContent = "✓ Pedido confirmado con éxito";
          setTimeout(() => {
            addBubble(`¡Muchísimas gracias, ${saved ? saved.name : "estimado cliente"}! 🎉\n\nTu pedido ha quedado formalmente registrado en nuestro sistema. Un asesor de SMAK se comunicará vía WhatsApp o llamada telefónica para coordinar el despacho.`, false);
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
