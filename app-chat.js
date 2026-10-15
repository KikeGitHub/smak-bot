import { StorageFacade } from "./js/storage-facade.js";
import { BotEngine } from "./js/bot-engine.js";

const $ = (s) => document.querySelector(s);
const thread = $("#messages");
const engine = new BotEngine();
let contextAudioUrl = null;

function formatMarkdown(text) {
  let safe = String(text ?? "")
    .replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Bold **text**
  safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  safe = safe.replace(/\*(.*?)\*/g, '<em>$1</em>');
  return safe;
}

function bubble(text, own = false, extra = {}) {
  const row = document.createElement("div");
  row.className = `flex ${own ? "justify-end" : "justify-start"} animate-fadeIn`;

  const box = document.createElement("div");
  box.className = `max-w-[86%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
    own ? "bg-[#d9fdd3] text-slate-900 rounded-tr-sm" : "bg-white text-slate-800 rounded-tl-sm border border-slate-100"
  }`;

  const body = document.createElement("div");
  body.className = "whitespace-pre-wrap text-sm leading-6";
  body.innerHTML = formatMarkdown(text);
  box.append(body);

  // PRODUCT IMAGES
  if (extra.images?.length) {
    const gallery = document.createElement("div");
    gallery.className = "mt-3 grid grid-cols-2 gap-2";
    extra.images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Foto del producto";
      img.className = "h-28 w-full rounded-xl object-cover border border-slate-200";
      gallery.append(img);
    });
    box.append(gallery);
  }

  // CATALOG INTERACTIVE CARDS
  if (extra.catalog?.length) {
    const catGrid = document.createElement("div");
    catGrid.className = "mt-3 grid gap-2";
    extra.catalog.forEach(prod => {
      const card = document.createElement("div");
      card.className = "flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs";
      card.innerHTML = `
        <div class="min-w-0">
          <span class="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-1.5 py-0.5 rounded">${prod.sku}</span>
          <span class="font-semibold text-slate-800 ml-1 truncate">${prod.name}</span>
          <span class="text-emerald-700 font-bold ml-1">L.${Number(prod.salePrice).toLocaleString("es-HN")}</span>
        </div>
      `;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shrink-0 rounded-lg bg-[#087e67] text-white px-2.5 py-1 text-[11px] font-bold hover:bg-[#066a58] transition";
      btn.textContent = "Ver Stock";
      btn.addEventListener("click", () => {
        send(`¿Tienen stock para el SKU ${prod.sku}?`);
      });
      card.append(btn);
      catGrid.append(card);
    });
    box.append(catGrid);
  }

  // QUICK BUY BUTTON WHEN PRODUCT HAS STOCK
  if (extra.product && extra.product.stock > 0 && !extra.order) {
    const buyBtn = document.createElement("button");
    buyBtn.type = "button";
    buyBtn.className = "mt-3 w-full rounded-xl bg-[#087e67] px-3 py-2 text-xs font-bold text-white hover:bg-[#066a58] transition flex items-center justify-center gap-1.5 shadow-sm";
    buyBtn.innerHTML = `<span>🛍 Comprar ${extra.product.sku} ahora</span>`;
    buyBtn.addEventListener("click", () => {
      bubble(`Quiero hacer el pedido del SKU ${extra.product.sku}`, true);
      const answer = engine.startCheckout(extra.product);
      setTimeout(() => bubble(answer.text, false, answer), 220);
    });
    box.append(buyBtn);
  }

  // AUDIO SIMULATION
  if (extra.audio) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = contextAudioUrl;
    audio.className = "mt-2.5 w-full";
    box.append(audio);
  }

  // CHECKOUT FLOW CONFIRMATION
  if (extra.order) {
    const summary = document.createElement("div");
    summary.className = "mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs leading-5 text-slate-800";
    summary.innerHTML = `
      <div class="font-bold text-emerald-900 border-b border-emerald-200 pb-1 mb-1">Confirmación de Pedido</div>
      <div><b>Cliente:</b> ${extra.order.name}</div>
      <div><b>Producto:</b> ${extra.order.productName}</div>
      <div><b>Entrega:</b> ${extra.order.address}</div>
      <div><b>Teléfono:</b> ${extra.order.phone}</div>
      <div><b>Total:</b> L.${Number(extra.order.total).toLocaleString("es-HN")}</div>
    `;
    box.append(summary);

    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className = "mt-3 w-full rounded-xl bg-[#087e67] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#066a58] transition shadow-sm";
    confirm.textContent = "✓ Confirmar compra contra entrega";
    confirm.addEventListener("click", () => {
      const saved = engine.confirmOrder();
      confirm.disabled = true;
      confirm.className = "mt-3 w-full rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold text-slate-500 cursor-not-allowed";
      confirm.textContent = "✓ Compra confirmada exitosamente";
      bubble(`¡Muchas gracias, ${saved.name}! Tu pedido ha quedado formalmente registrado en nuestro panel administrativo. Un asesor coordinará la entrega.`);
    });
    box.append(confirm);
  }

  // META TIMESTAMP
  const meta = document.createElement("div");
  meta.className = `mt-1 text-right text-[10px] text-slate-400 ${own ? "" : "text-left"}`;
  meta.textContent = own ? "Entregado · ✓✓" : "SMAK Bot · ahora";
  box.append(meta);

  row.append(box);
  thread.append(row);
  thread.scrollTop = thread.scrollHeight;
}

async function send(text, opts = {}) {
  if (!text.trim()) return;
  bubble(opts.audio ? "🎙️ Audio enviado" : text, true);
  $("#message").value = "";
  const answer = await engine.reply(text, opts);
  window.setTimeout(() => bubble(answer.text, false, answer), 260);
}

function updateTenant() {
  const t = StorageFacade.getTenant();
  $("#brand-name").textContent = t.name;
  $("#chat-avatar").textContent = t.initials || "S";
  $("#online-label").textContent = `${t.name} · en línea`;
  $("#tenant-label").textContent = t.name;
}

$("#composer").addEventListener("submit", e => {
  e.preventDefault();
  send($("#message").value);
});

$("#audio-button").addEventListener("click", async () => {
  if (!contextAudioUrl) {
    const sampleRate = 8000;
    const length = sampleRate * 1.1;
    const bytes = new Uint8Array(44 + length);
    const view = new DataView(bytes.buffer);
    const write = (offset, s) => [...s].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
    write(0, "RIFF");
    view.setUint32(4, 36 + length, true);
    write(8, "WAVE");
    write(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate, true);
    view.setUint16(32, 1, true);
    view.setUint16(34, 8, true);
    write(36, "data");
    view.setUint32(40, length, true);
    bytes.fill(128, 44);
    contextAudioUrl = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
  }
  await send("Audio del cliente", { audio: true });
});

function renderMetaAdCard(referral) {
  const adRow = document.createElement("div");
  adRow.className = "flex justify-start animate-fadeIn";

  const adBox = document.createElement("div");
  adBox.className = "max-w-[88%] sm:max-w-[80%] rounded-2xl bg-[#03594b] text-white p-3 shadow-md border border-emerald-500/40";

  const inner = document.createElement("div");
  inner.className = "flex items-start gap-3";

  const img = document.createElement("img");
  img.src = referral.image_url || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
  img.className = "h-14 w-14 rounded-xl object-cover shrink-0 border border-emerald-400/40";
  inner.append(img);

  const info = document.createElement("div");
  info.className = "min-w-0 flex-1";
  info.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="text-[11px] font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
        <svg class="h-3 w-3 fill-current text-blue-300" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Anuncio de Facebook
      </span>
      <span class="text-[10px] text-emerald-200/90 underline cursor-pointer hover:text-white">Ver detalles</span>
    </div>
    <p class="mt-1 text-xs font-semibold leading-snug line-clamp-2">${referral.headline || "Producto en Anuncio"}</p>
    <p class="text-[10px] text-emerald-300/80 mt-0.5">Saludo automático</p>
  `;
  inner.append(info);
  adBox.append(inner);
  adRow.append(adBox);
  thread.append(adRow);

  // System Notice Bubble (WhatsApp Meta CTWA banner)
  const sysRow = document.createElement("div");
  sysRow.className = "flex justify-center my-1.5 animate-fadeIn";
  sysRow.innerHTML = `
    <div class="max-w-[92%] rounded-xl bg-slate-900/85 backdrop-blur-sm text-slate-200 px-3.5 py-2 text-[11px] leading-relaxed text-center shadow-md flex items-center gap-2 border border-slate-700/80">
      <span class="text-xs">↩️</span>
      <span>Este chat se inició a partir de un anuncio en <b>Meta</b>. El uso compartido de datos para las actividades relacionadas con el cliente está activado. <span class="font-bold underline cursor-pointer text-emerald-300">Administrar</span></span>
    </div>
  `;
  thread.append(sysRow);
  thread.scrollTop = thread.scrollHeight;
}

document.querySelectorAll("[data-scenario]").forEach(btn => {
  btn.addEventListener("click", async () => {
    engine.reset();
    const text = btn.dataset.scenario;

    if (text === "__checkout") {
      bubble("Quiero hacer un pedido", true);
      const answer = engine.startCheckout();
      setTimeout(() => bubble(answer.text, false, answer), 220);
      return;
    }

    // SCENARIO 1: META ADS REFERRAL (EXACT REPRODUCTION OF USER SCREENSHOT)
    if (text === "__facebook_ad") {
      thread.replaceChildren();
      const t = StorageFacade.getTenant();
      const firstProd = t.products?.[0] || { name: "Estante Rack Plegable Metálico", sku: "EST-01" };
      const referral = {
        source_type: "ad",
        source_id: "12020584738290123",
        headline: firstProd.name || "Estante Rack Plegable Metálico",
        body: `Hola, tenemos el ${firstProd.name}. ¿Te interesa saber más?`,
        image_url: firstProd.images?.[0] || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
      };

      // 1. Render green Ad card & Meta disclaimer
      renderMetaAdCard(referral);

      // 2. Client sends greeting as shown in the screenshot
      setTimeout(() => {
        bubble("Hola", true);
      }, 250);

      setTimeout(() => {
        bubble("Buen dia", true);
      }, 500);

      // 3. Bot responds recognizing ad referral & SKU immediately
      setTimeout(async () => {
        const answer = await engine.reply("Hola, buen dia", { referral });
        bubble(answer.text, false, answer);
      }, 950);
      return;
    }

    // SCENARIO 2: USER SENDS FACEBOOK SHARE URL
    if (text === "__facebook_link") {
      thread.replaceChildren();
      const sampleUrl = "Hola, me interesa este producto: https://www.facebook.com/share/p/196jarUnqz/?mibextid=wwXIfr";
      send(sampleUrl);
      return;
    }

    // SCENARIO 3: DEEP LINK WA.ME WITH SKU IN BRACKETS
    if (text === "__deep_link") {
      thread.replaceChildren();
      const sampleDeep = "Hola, vi su publicación en Instagram y quiero ordenar [SKU: ESC-02]";
      send(sampleDeep);
      return;
    }

    send(text, { audio: text === "__audio" });
  });
});

$("#human-button").addEventListener("click", () => send("Quiero hablar con un asesor comercial"));

$("#clear-button").addEventListener("click", () => {
  thread.replaceChildren();
  engine.reset();
  const t = StorageFacade.getTenant();
  const firstSku = t.products?.[0]?.sku || "EST-01";
  bubble(`¡Hola! 👋 Soy el asistente de **${t.name}**.\n\nPuedes consultarme por disponibilidad de inventario (ej. *"¿Tienen stock para el SKU ${firstSku}?"*), ver nuestro catálogo completo o consultar tiempos de entrega.`);
});

window.addEventListener("smakbot:data-changed", () => {
  updateTenant();
});

window.addEventListener("storage", () => {
  updateTenant();
});

// Initial Welcome Message
updateTenant();
const initialTenant = StorageFacade.getTenant();
const sampleSku = initialTenant.products?.[0]?.sku || "EST-01";
bubble(`¡Hola! 👋 Soy el asistente de ventas de **${initialTenant.name}**.\n\nPuedes preguntarme por:\n• Disponibilidad de stock: *"¿Tienen stock para el SKU ${sampleSku}?"*\n• Ver catálogo: *"¿Qué productos tienen en catálogo?"*\n• Envíos, métodos de pago o fotos.`);
