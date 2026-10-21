import { StorageFacade } from "./js/storage-facade.js?v=4";
import { BotEngine } from "./js/bot-engine.js?v=4";
import { TranscriptionService } from "./js/transcription-service.js?v=4";
import { SpeechService } from "./js/speech-service.js?v=4";
import { LocationService } from "./js/location-service.js?v=4";

const $ = (s) => document.querySelector(s);
const thread = $("#messages");
const engine = new BotEngine();
let activeRecorder = null;

function formatMarkdown(text) {
  let safe = String(text ?? "")
    .replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Bold **text**
  safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  safe = safe.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Markdown links [text](url)
  safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline font-bold text-emerald-700 hover:text-emerald-900">$1</a>');
  return safe;
}

function bubble(text, own = false, extra = {}) {
  const row = document.createElement("div");
  row.className = `flex ${own ? "justify-end" : "justify-start"} animate-fadeIn`;

  const box = document.createElement("div");
  box.className = `max-w-[88%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
    own ? "bg-[#d9fdd3] text-slate-900 rounded-tr-sm" : "bg-white text-slate-800 rounded-tl-sm border border-slate-100"
  }`;

  // 1. BOT VOICE NOTE PLAYER (WhatsApp Style Audio Response)
  if (extra.audioReply && !own) {
    const voiceCard = document.createElement("div");
    voiceCard.className = "mb-3 rounded-2xl bg-gradient-to-r from-[#075e54] to-[#128c7e] p-3 text-white shadow-md";

    const speechTextToRead = extra.speechText || SpeechService.cleanTextForSpeech(text);
    const duration = SpeechService.estimateDuration(speechTextToRead);
    const waveform = SpeechService.generateWaveform(26);

    let activeController = null;
    let isPlaying = false;
    let currentSpeed = 1.0;

    const topHeader = document.createElement("div");
    topHeader.className = "flex items-center justify-between text-[11px] font-semibold text-emerald-100 pb-2 border-b border-white/10";
    topHeader.innerHTML = `
      <span class="flex items-center gap-1.5">
        <span class="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-xs">🎙️</span>
        <span>Nota de Voz de SMAK Bot</span>
      </span>
      <span class="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-white">Voz IA</span>
    `;
    voiceCard.append(topHeader);

    const controls = document.createElement("div");
    controls.className = "mt-2.5 flex items-center gap-2.5 sm:gap-3";

    // Play/Pause button
    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#075e54] text-base font-bold shadow hover:scale-105 transition active:scale-95";
    playBtn.innerHTML = `<span>▶</span>`;

    // Waveform container
    const waveWrap = document.createElement("div");
    waveWrap.className = "flex-1 flex items-center gap-[2px] sm:gap-[2.5px] h-8 cursor-pointer";
    const barEls = waveform.map((height) => {
      const bar = document.createElement("span");
      bar.className = "w-1 rounded-full bg-emerald-200/50 transition-all duration-150";
      bar.style.height = `${Math.max(20, height * 0.75)}%`;
      waveWrap.append(bar);
      return bar;
    });

    // Time & Speed
    const metaWrap = document.createElement("div");
    metaWrap.className = "shrink-0 flex flex-col items-end gap-1";

    const timeLabel = document.createElement("span");
    timeLabel.className = "font-mono text-[11px] font-medium text-emerald-100";
    timeLabel.textContent = `0:00 / 0:${String(duration).padStart(2, "0")}`;

    const speedBtn = document.createElement("button");
    speedBtn.type = "button";
    speedBtn.className = "rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-white/25 transition";
    speedBtn.textContent = "1x";
    speedBtn.addEventListener("click", () => {
      if (currentSpeed === 1.0) currentSpeed = 1.5;
      else if (currentSpeed === 1.5) currentSpeed = 2.0;
      else currentSpeed = 1.0;
      speedBtn.textContent = `${currentSpeed}x`;
      if (isPlaying && activeController) {
        SpeechService.stop();
        activeController = SpeechService.speak(speechTextToRead, {
          rate: currentSpeed,
          onStart: () => { isPlaying = true; playBtn.innerHTML = `<span>⏸</span>`; },
          onProgress: ({ elapsed, percent }) => updateWaveProgress(percent, elapsed),
          onEnd: () => resetPlayer(),
          onError: () => resetPlayer()
        });
      }
    });

    metaWrap.append(timeLabel, speedBtn);
    controls.append(playBtn, waveWrap, metaWrap);
    voiceCard.append(controls);

    function updateWaveProgress(percent, elapsed) {
      const activeIndex = Math.floor((percent / 100) * barEls.length);
      barEls.forEach((bar, idx) => {
        if (idx <= activeIndex) {
          bar.className = "w-1 rounded-full bg-white transition-all duration-150";
        } else {
          bar.className = "w-1 rounded-full bg-emerald-200/50 transition-all duration-150";
        }
      });
      const s = Math.floor(elapsed);
      timeLabel.textContent = `0:${String(s).padStart(2, "0")} / 0:${String(duration).padStart(2, "0")}`;
    }

    function resetPlayer() {
      isPlaying = false;
      playBtn.innerHTML = `<span>▶</span>`;
      barEls.forEach(b => b.className = "w-1 rounded-full bg-emerald-200/50 transition-all duration-150");
      timeLabel.textContent = `0:00 / 0:${String(duration).padStart(2, "0")}`;
    }

    playBtn.addEventListener("click", () => {
      if (isPlaying) {
        SpeechService.stop();
        resetPlayer();
      } else {
        isPlaying = true;
        playBtn.innerHTML = `<span>⏸</span>`;
        activeController = SpeechService.speak(speechTextToRead, {
          rate: currentSpeed,
          onStart: () => { isPlaying = true; },
          onProgress: ({ elapsed, percent }) => updateWaveProgress(percent, elapsed),
          onEnd: () => resetPlayer(),
          onError: (err) => {
            console.warn("TTS Error:", err);
            resetPlayer();
          }
        });
      }
    });

    box.append(voiceCard);
  }

  // 2. TEXT BODY
  const body = document.createElement("div");
  body.className = "whitespace-pre-wrap text-sm leading-6";
  body.innerHTML = formatMarkdown(text);
  box.append(body);

  // 3. WHATSAPP LOCATION CARD (When user or bot shares location)
  if (extra.location) {
    const loc = extra.location;
    const locCard = document.createElement("div");
    locCard.className = `mt-3 overflow-hidden rounded-2xl border ${own ? "border-emerald-300 bg-white" : "border-slate-200 bg-slate-50"} shadow-sm`;

    // Map preview banner with stylized GPS pin
    const mapBanner = document.createElement("div");
    mapBanner.className = "relative h-28 w-full bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 flex items-center justify-center overflow-hidden border-b border-slate-200";
    mapBanner.innerHTML = `
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#087e67_1px,transparent_1px)] [background-size:12px_12px]"></div>
      <div class="relative flex flex-col items-center">
        <div class="grid h-10 w-10 place-items-center rounded-full bg-rose-600 text-white shadow-lg text-lg ring-4 ring-rose-200 animate-bounce">
          📍
        </div>
      </div>
      <div class="absolute bottom-2 right-2 rounded-md bg-white/95 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 shadow-sm border border-slate-200">
        GPS: ${loc.lat ? `${Number(loc.lat).toFixed(4)}, ${Number(loc.lng).toFixed(4)}` : "Ubicación en vivo"}
      </div>
    `;
    locCard.append(mapBanner);

    const locInfo = document.createElement("div");
    locInfo.className = "p-3";
    locInfo.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <div class="text-xs font-bold text-slate-900">${loc.name || "Ubicación de Entrega"}</div>
          <div class="text-[11px] text-slate-500 mt-0.5 leading-relaxed truncate">${loc.address || "Punto de entrega registrado"}</div>
        </div>
        <span class="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 shrink-0">WhatsApp GPS</span>
      </div>
    `;

    if (loc.mapUrl) {
      const mapBtn = document.createElement("a");
      mapBtn.href = loc.mapUrl;
      mapBtn.target = "_blank";
      mapBtn.rel = "noopener noreferrer";
      mapBtn.className = "mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm";
      mapBtn.innerHTML = `<span>🗺️ Abrir en Google Maps / Waze</span> <span class="text-[10px]">↗</span>`;
      locInfo.append(mapBtn);
    }

    locCard.append(locInfo);
    box.append(locCard);
  }

  // 4. PRODUCT IMAGES
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

  // 5. CATALOG INTERACTIVE CARDS
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

  // 6. QUICK BUY BUTTON WHEN PRODUCT HAS STOCK
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

  // 7. USER AUDIO PLAYER & TRANSCRIPTION CARD
  if (extra.audioUrl || extra.audio) {
    const audioWrap = document.createElement("div");
    audioWrap.className = "mt-2.5 flex flex-col gap-2";

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = extra.audioUrl;
    audio.className = "w-full rounded-xl";
    audioWrap.append(audio);

    if (extra.isTranscribing) {
      const loader = document.createElement("div");
      loader.id = extra.statusId || ("trans-" + Date.now());
      loader.className = "flex items-center gap-2 rounded-xl bg-emerald-100/80 px-3 py-2 text-xs font-medium text-emerald-950 animate-pulse";
      loader.innerHTML = `
        <span class="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-ping"></span>
        <span>Transcribiendo audio con IA en Codespaces...</span>
      `;
      audioWrap.append(loader);
    }

    if (extra.transcription) {
      const transBox = document.createElement("div");
      transBox.className = "rounded-xl border border-emerald-300/80 bg-emerald-50/90 p-2.5 text-xs text-slate-800 shadow-sm";
      transBox.innerHTML = `
        <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
          <span class="flex items-center gap-1">✨ Transcripción IA</span>
          <span class="rounded bg-emerald-200 px-1.5 py-0.5 text-[9px] font-bold text-emerald-900">Whisper</span>
        </div>
        <div class="italic text-slate-800 leading-relaxed font-normal">"${formatMarkdown(extra.transcription)}"</div>
      `;
      audioWrap.append(transBox);
    }

    box.append(audioWrap);
  }

  // 8. CHECKOUT FLOW CONFIRMATION CARD
  if (extra.order) {
    const summary = document.createElement("div");
    summary.className = "mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs leading-5 text-slate-800";
    summary.innerHTML = `
      <div class="font-bold text-emerald-900 border-b border-emerald-200 pb-1 mb-1">Confirmación de Pedido</div>
      <div><b>Cliente:</b> ${extra.order.name}</div>
      <div><b>Producto:</b> ${extra.order.productName}</div>
      <div><b>Entrega:</b> ${extra.order.address} ${extra.order.location ? `<a href="${extra.order.location.mapUrl}" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 underline ml-1">📍 Ver GPS</a>` : ""}</div>
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
      bubble(`¡Muchas gracias, ${saved.name}! Tu pedido ha quedado formalmente registrado en nuestro panel administrativo con entrega coordinada.`);
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
  return row;
}

async function send(text, opts = {}) {
  if (!text.trim()) return;
  bubble(opts.audio ? "🎙️ Audio enviado" : text, true);
  $("#message").value = "";
  const answer = await engine.reply(text, opts);
  window.setTimeout(() => bubble(answer.text, false, answer), 260);
}

/**
 * Procesa el envío de una ubicación (GPS en vivo o predefinida)
 */
async function sendLocation(loc) {
  $("#location-picker-menu")?.classList.add("hidden");
  // 1. Mostrar la tarjeta de ubicación enviada por el cliente
  bubble(loc.name || loc.address || "📍 Ubicación compartida", true, {
    location: loc
  });
  // 2. Procesar con el motor conversacional
  const answer = await engine.reply(loc.address || loc.name, { location: loc });
  window.setTimeout(() => bubble(answer.text, false, answer), 280);
}

/**
 * Procesa un archivo o grabación de audio: reproduce, transcribe y responde
 */
async function processAudio(fileOrBlob, fileName = "audio.mp4", options = {}) {
  const audioUrl = URL.createObjectURL(fileOrBlob);
  const statusId = "trans-status-" + Date.now();

  // 1. Mostrar la nota de voz del usuario en el chat con estado cargando
  const row = bubble("🎙️ Nota de voz del cliente", true, {
    audioUrl,
    isTranscribing: true,
    statusId
  });

  try {
    // 2. Llamada al transcriptor online en Codespaces con vad_filter: false
    const result = await TranscriptionService.transcribeAudio(fileOrBlob, fileName, { vad_filter: false, ...options });
    const fullText = (result.full_text || "").trim();

    // 3. Quitar el indicador de carga y mostrar tarjeta de transcripción
    const statusEl = document.getElementById(statusId);
    if (statusEl) {
      statusEl.remove();
    }

    const box = row.querySelector("div");
    if (box) {
      const transBox = document.createElement("div");
      transBox.className = "mt-2 rounded-xl border border-emerald-300/80 bg-emerald-50/90 p-2.5 text-xs text-slate-800 shadow-sm";
      transBox.innerHTML = `
        <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
          <span class="flex items-center gap-1">✨ Transcripción IA</span>
          <span class="rounded bg-emerald-200 px-1.5 py-0.5 text-[9px] font-bold text-emerald-900">Whisper Sync</span>
        </div>
        <div class="italic text-slate-800 leading-relaxed">"${formatMarkdown(fullText || "(No se detectaron palabras en el audio)")}"</div>
      `;
      box.querySelector(".whitespace-pre-wrap")?.after(transBox);
    }

    // 4. Pasar el texto transcrito directamente al motor comercial de SMAKBot (responderá con nota de voz TTS)
    if (fullText) {
      const answer = await engine.reply(fullText, { audioTranscript: true });
      setTimeout(() => bubble(answer.text, false, answer), 300);
    } else {
      setTimeout(() => bubble("Disculpa, no logré escuchar palabras claras en este audio. ¿Podrías escribir tu consulta o repetirlo?", false), 300);
    }

  } catch (err) {
    console.error("Error al transcribir:", err);
    const statusEl = document.getElementById(statusId);
    if (statusEl) {
      statusEl.className = "flex items-center gap-2 rounded-xl bg-rose-100 p-2 text-xs font-semibold text-rose-800";
      statusEl.innerHTML = `<span>⚠️ ${err.message || "Error al conectar con el transcriptor en Codespaces."}</span>`;
    }
  }
}

function updateTenant() {
  const t = StorageFacade.getTenant();
  $("#brand-name").textContent = t.name;
  $("#chat-avatar").textContent = t.initials || "S";
  $("#online-label").textContent = `${t.name} · en línea`;
  $("#tenant-label").textContent = t.name;
}

// Envío de mensaje escrito
$("#composer").addEventListener("submit", e => {
  e.preventDefault();
  send($("#message").value);
});

// Selector de archivos de audio
const audioFileInput = $("#audio-file-input");
const attachAudioBtn = $("#attach-audio-btn");
const triggerUploadAudio = $("#trigger-upload-audio");

if (attachAudioBtn && audioFileInput) {
  attachAudioBtn.addEventListener("click", () => audioFileInput.click());
}

if (triggerUploadAudio && audioFileInput) {
  triggerUploadAudio.addEventListener("click", () => audioFileInput.click());
}

if (audioFileInput) {
  audioFileInput.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    audioFileInput.value = "";
    await processAudio(file, file.name);
  });
}

// Selector y menú de Ubicación
const locationBtn = $("#location-button");
const locationPickerMenu = $("#location-picker-menu");
const closeLocationPicker = $("#close-location-picker");
const btnGpsLive = $("#btn-gps-live");
const formPasteMaps = $("#form-paste-maps");

if (locationBtn && locationPickerMenu) {
  locationBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    locationPickerMenu.classList.toggle("hidden");
  });
}

if (closeLocationPicker && locationPickerMenu) {
  closeLocationPicker.addEventListener("click", () => {
    locationPickerMenu.classList.add("hidden");
  });
}

// Botón GPS en vivo del dispositivo
if (btnGpsLive) {
  btnGpsLive.addEventListener("click", async () => {
    btnGpsLive.disabled = true;
    const originalText = btnGpsLive.innerHTML;
    btnGpsLive.innerHTML = `<span class="animate-spin text-sm">⏳</span> Obteniendo GPS del dispositivo...`;
    try {
      const loc = await LocationService.getCurrentPosition();
      btnGpsLive.innerHTML = originalText;
      btnGpsLive.disabled = false;
      await sendLocation(loc);
    } catch (err) {
      console.warn("Error GPS:", err);
      // Fallback a Colonia Palmira si el usuario deniega permiso
      alert("GPS del navegador: " + err.message + "\nSe enviará ubicación de muestra de Tegucigalpa.");
      const fallback = LocationService.PRESETS[0];
      btnGpsLive.innerHTML = originalText;
      btnGpsLive.disabled = false;
      await sendLocation({
        ...fallback,
        mapUrl: LocationService.getGoogleMapsUrl(fallback.lat, fallback.lng)
      });
    }
  });
}

// Botones de presets de ubicación en Honduras
document.querySelectorAll(".loc-preset-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const presetId = btn.dataset.locPreset;
    const preset = LocationService.PRESETS.find(p => p.id === presetId) || LocationService.PRESETS[0];
    await sendLocation({
      ...preset,
      mapUrl: LocationService.getGoogleMapsUrl(preset.lat, preset.lng)
    });
  });
});

// Pegar enlace de Google Maps
if (formPasteMaps) {
  formPasteMaps.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = $("#input-maps-url").value.trim();
    if (!url) return;
    $("#input-maps-url").value = "";
    const parsed = LocationService.parseLocationFromText(url) || {
      name: "Ubicación Google Maps",
      address: url,
      lat: 14.1025,
      lng: -87.1950,
      mapUrl: url
    };
    await sendLocation(parsed);
  });
}

// Cerrar menú de ubicación al hacer clic fuera
document.addEventListener("click", (e) => {
  if (locationPickerMenu && !locationPickerMenu.contains(e.target) && e.target !== locationBtn) {
    locationPickerMenu.classList.add("hidden");
  }
});

// Grabación con Micrófono en Vivo
const micBtn = $("#audio-button");
const recordingIndicator = $("#recording-indicator");
const cancelRecordingBtn = $("#cancel-recording-btn");

if (micBtn) {
  micBtn.addEventListener("click", async () => {
    // Si ya está grabando, detener y enviar
    if (activeRecorder && activeRecorder.isRecording()) {
      micBtn.className = "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-lg hover:bg-slate-200 transition shadow-sm relative";
      recordingIndicator?.classList.add("hidden");
      try {
        const { blob } = await activeRecorder.stop();
        activeRecorder = null;
        await processAudio(blob, "grabacion-microfono.webm");
      } catch (err) {
        console.error("Error al detener grabación:", err);
      }
      return;
    }

    // Iniciar grabación
    try {
      activeRecorder = TranscriptionService.createRecorder();
      await activeRecorder.start();
      micBtn.className = "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-600 text-white text-lg animate-pulse shadow-md ring-2 ring-rose-400 relative";
      recordingIndicator?.classList.remove("hidden");
    } catch (err) {
      console.warn("No se pudo iniciar micrófono:", err);
      alert("No se pudo acceder al micrófono: " + (err.message || "Permiso denegado."));
    }
  });
}

if (cancelRecordingBtn) {
  cancelRecordingBtn.addEventListener("click", async () => {
    if (activeRecorder && activeRecorder.isRecording()) {
      try {
        await activeRecorder.stop();
      } catch (_) {}
      activeRecorder = null;
      micBtn.className = "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-lg hover:bg-slate-200 transition shadow-sm relative";
      recordingIndicator?.classList.add("hidden");
    }
  });
}

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

// Controladores para los Escenarios Rápidos
document.querySelectorAll("[data-scenario]").forEach(btn => {
  btn.addEventListener("click", async () => {
    engine.reset();
    const text = btn.dataset.scenario;

    // SCENARIO AUDIO 1: PERCHERO (WHATSAPP OGG CON RESPUESTA EN VOZ)
    if (text === "__sample_perchero") {
      thread.replaceChildren();
      try {
        const resp = await fetch("audio-samples/perchero.ogg");
        if (!resp.ok) throw new Error("No se pudo cargar el archivo perchero.ogg");
        const blob = await resp.blob();
        await processAudio(blob, "perchero.ogg");
      } catch (err) {
        console.error("Error cargando perchero.ogg:", err);
        bubble("⚠️ No se pudo reproducir el archivo de muestra: " + err.message, false);
      }
      return;
    }

    // SCENARIO AUDIO 2: REGADERAS (WHATSAPP OGG CON RESPUESTA EN VOZ)
    if (text === "__sample_regaderas") {
      thread.replaceChildren();
      try {
        const resp = await fetch("audio-samples/regaderas.ogg");
        if (!resp.ok) throw new Error("No se pudo cargar el archivo regaderas.ogg");
        const blob = await resp.blob();
        await processAudio(blob, "regaderas.ogg", { vad_filter: false });
      } catch (err) {
        console.error("Error cargando regaderas.ogg:", err);
        bubble("⚠️ No se pudo reproducir el archivo de muestra: " + err.message, false);
      }
      return;
    }

    if (text === "__checkout") {
      bubble("Quiero hacer un pedido", true);
      const answer = engine.startCheckout();
      setTimeout(() => bubble(answer.text, false, answer), 220);
      return;
    }

    // SCENARIO NUEVO: CHECKOUT COMPLETO CON UBICACION GPS DE WHATSAPP
    if (text === "__order_with_location") {
      thread.replaceChildren();
      engine.reset();
      const t = StorageFacade.getTenant();
      const firstProd = t.products?.[0] || { name: "Estante Organizador Premium", sku: "EST-01", salePrice: 1050 };

      // 1. Cliente pide producto
      bubble(`¡Hola! Quiero hacer el pedido del ${firstProd.name} (SKU: ${firstProd.sku})`, true);

      // 2. Bot inicia checkout preguntando nombre
      setTimeout(() => {
        const ans1 = engine.startCheckout(firstProd);
        bubble(ans1.text, false, ans1);
      }, 400);

      // 3. Cliente da su nombre
      setTimeout(() => {
        bubble("Carlos Mendoza", true);
        engine.checkout.name = "Carlos Mendoza";
        engine.checkout.step = "address";
        bubble(`Gracias, Carlos Mendoza. ¿Cuál es la dirección completa de entrega (ciudad y colonia)?\n\n💡 *Tip: Puedes presionar el botón 📍 abajo o enviar tu ubicación GPS de WhatsApp.*`, false);
      }, 1100);

      // 4. Cliente envía su ubicación de WhatsApp (Colonia Palmira, Tegucigalpa)
      setTimeout(async () => {
        const palmira = LocationService.PRESETS[0];
        const locPayload = {
          ...palmira,
          mapUrl: LocationService.getGoogleMapsUrl(palmira.lat, palmira.lng)
        };
        bubble("📍 Colonia Palmira, Tegucigalpa", true, { location: locPayload });
        const ans2 = await engine.reply(palmira.address, { location: locPayload });
        bubble(ans2.text, false, ans2);
      }, 2000);

      // 5. Cliente envía su teléfono
      setTimeout(async () => {
        bubble("+504 9876-1204", true);
        const ans3 = await engine.reply("+504 9876-1204");
        bubble(ans3.text, false, ans3);
      }, 3100);

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
  SpeechService.stop();
  thread.replaceChildren();
  engine.reset();
  const t = StorageFacade.getTenant();
  const firstSku = t.products?.[0]?.sku || "EST-01";
  bubble(`¡Hola! 👋 Soy el asistente de **${t.name}**.\n\nPuedes enviarme notas de voz 🎙️ o tu ubicación GPS 📍, consultar disponibilidad (ej. *"¿Tienen stock para el SKU ${firstSku}?"*), catálogo completo o envíos.`);
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
bubble(`¡Hola! 👋 Soy el asistente comercial de **${initialTenant.name}**.\n\n✨ **Nuevas funciones activas**:\n• **Respuestas en Audio**: Si me envías un audio 🎙️, te responderé con una nota de voz con transcripción.\n• **Ubicación GPS**: Al pedirte dirección, puedes presionar **📍 Compartir Ubicación** o enviar un link de Google Maps.\n\n¿En qué puedo ayudarte hoy?`);
