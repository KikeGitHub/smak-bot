import { StorageFacade } from "./js/storage-facade.js";
import { BotEngine } from "./js/bot-engine.js";

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const money = n => Number(n || 0).toLocaleString("es-HN");
const escapeHtml = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let activeCategoryFilter = "all";
const testEngine = new BotEngine();

// ---- INITIALIZATION & TENANT SWITCHING ----
function renderTenantOptions() {
  const select = $("#tenant-select");
  select.innerHTML = "";
  StorageFacade.getTenants().forEach(t => {
    const o = document.createElement("option");
    o.value = t.id;
    o.textContent = t.name;
    select.append(o);
  });
  select.value = StorageFacade.getActiveTenantId();
}

function updateHeaderAndBadges() {
  const tenant = StorageFacade.getTenant();
  $("#tenant-title").textContent = tenant.name;
  $("#tenant-category").textContent = tenant.category;
  $("#tenant-badge-icon").textContent = tenant.initials || "✦";

  const products = StorageFacade.getProducts();
  const rules = StorageFacade.getRules();
  const synonyms = StorageFacade.getSynonyms();
  const orders = StorageFacade.getOrders();
  const campaigns = StorageFacade.getCampaigns();

  $("#sidebar-products-count").textContent = `${products.length} productos`;
  $("#nav-count-products").textContent = products.length;
  $("#nav-count-rules").textContent = rules.length;
  $("#nav-count-campaigns").textContent = campaigns.length;
  $("#nav-count-synonyms").textContent = Object.keys(synonyms).length;
  $("#nav-count-orders").textContent = orders.length;

  $("#badge-total-products").textContent = `${products.length} artículos`;
  $("#badge-total-rules").textContent = `${rules.length} reglas activas`;
  $("#badge-total-campaigns").textContent = `${campaigns.length} enlaces activos`;
  $("#badge-total-synonyms").textContent = `${Object.keys(synonyms).length} conceptos`;
}

function renderAll() {
  updateHeaderAndBadges();
  renderProducts();
  renderRules();
  renderCampaigns();
  renderSynonyms();
  renderOrders();
  updateSmartLinkGenerator();
}

// ---- SECTION 1: PRODUCTS TABLE ----
function renderProducts() {
  const products = StorageFacade.getProducts();
  const tbody = $("#products-table-body");

  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-slate-400">No hay productos en el catálogo. Haz clic en "＋ Nuevo Producto" para agregar uno.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    const firstImg = p.images?.[0] || "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=150&q=80";
    const isAvailable = Number(p.stock) > 0;
    const stockBadge = isAvailable
      ? `<span class="badge bg-emerald-100 text-emerald-800">${p.stock} unidades</span>`
      : `<span class="badge bg-rose-100 text-rose-800">Agotado (0)</span>`;

    return `
      <tr class="hover:bg-slate-50/70 transition">
        <td class="py-3 px-4">
          <img src="${escapeHtml(firstImg)}" class="h-11 w-11 rounded-xl object-cover border border-slate-200" alt="Foto">
        </td>
        <td class="py-3 px-4 font-mono font-bold text-slate-900">
          <span class="rounded-lg bg-slate-100 px-2 py-1">${escapeHtml(p.sku)}</span>
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-800">${escapeHtml(p.name)}</div>
          <div class="text-[11px] text-slate-400 truncate max-w-[220px]">${(p.keywords || []).map(k => `#${escapeHtml(k)}`).join(" ")}</div>
        </td>
        <td class="py-3 px-4 text-slate-400 line-through">L.${money(p.regularPrice)}</td>
        <td class="py-3 px-4 font-bold text-emerald-700">L.${money(p.salePrice)}</td>
        <td class="py-3 px-4">${stockBadge}</td>
        <td class="py-3 px-4 text-slate-600">
          <div>${escapeHtml(p.dimensions || "—")}</div>
          <div class="text-[10px] text-slate-400">${escapeHtml(p.weightLimit || "")}</div>
        </td>
        <td class="py-3 px-4 text-right space-x-1">
          <button data-action="edit-product" data-id="${escapeHtml(p.id)}" class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">Editar</button>
          <button data-action="delete-product" data-id="${escapeHtml(p.id)}" class="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">Borrar</button>
        </td>
      </tr>
    `;
  }).join("");
}

// Product Modal Handlers
$("#btn-open-new-product").addEventListener("click", () => {
  $("#modal-product-title").textContent = "Agregar Nuevo Producto al Catálogo";
  $("#form-product").reset();
  $("#prod-id").value = "";
  openModal("#modal-product");
});

$("#products-table-body").addEventListener("click", e => {
  const editBtn = e.target.closest('[data-action="edit-product"]');
  const delBtn = e.target.closest('[data-action="delete-product"]');

  if (editBtn) {
    const id = editBtn.dataset.id;
    const product = StorageFacade.getProducts().find(p => p.id === id);
    if (!product) return;
    $("#modal-product-title").textContent = `Editar Producto: ${product.sku}`;
    $("#prod-id").value = product.id;
    $("#prod-sku").value = product.sku;
    $("#prod-name").value = product.name;
    $("#prod-reg-price").value = product.regularPrice;
    $("#prod-sale-price").value = product.salePrice;
    $("#prod-stock").value = product.stock;
    $("#prod-dimensions").value = product.dimensions || "";
    $("#prod-weight").value = product.weightLimit || "";
    $("#prod-keywords").value = (product.keywords || []).join(", ");
    $("#prod-images").value = (product.images || []).join("\n");
    openModal("#modal-product");
  }

  if (delBtn) {
    const id = delBtn.dataset.id;
    if (confirm("¿Estás seguro de eliminar este producto del catálogo?")) {
      StorageFacade.deleteProduct(id);
      notify("Producto eliminado del catálogo.");
      renderAll();
    }
  }
});

$("#form-product").addEventListener("submit", e => {
  e.preventDefault();
  const id = $("#prod-id").value;
  const productData = {
    id: id || undefined,
    sku: $("#prod-sku").value.trim().toUpperCase(),
    name: $("#prod-name").value.trim(),
    regularPrice: Number($("#prod-reg-price").value),
    salePrice: Number($("#prod-sale-price").value),
    stock: Number($("#prod-stock").value),
    dimensions: $("#prod-dimensions").value.trim(),
    weightLimit: $("#prod-weight").value.trim(),
    keywords: $("#prod-keywords").value.split(",").map(k => k.trim()).filter(Boolean),
    images: $("#prod-images").value.split("\n").map(u => u.trim()).filter(Boolean)
  };

  StorageFacade.saveProduct(productData);
  closeModal("#modal-product");
  notify("Producto guardado exitosamente.");
  renderAll();
});

// ---- SECTION 2: RULES AND Q&A ----
function renderRules() {
  const allRules = StorageFacade.getRules();
  const container = $("#rules-container");

  const filtered = activeCategoryFilter === "all"
    ? allRules
    : allRules.filter(r => r.category?.toLowerCase() === activeCategoryFilter.toLowerCase());

  if (!filtered.length) {
    container.innerHTML = `<div class="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">No hay reglas en la categoría seleccionada.</div>`;
    return;
  }

  container.innerHTML = filtered.map(r => {
    let typeBadge = `<span class="badge bg-emerald-100 text-emerald-800">FAQ Estática</span>`;
    if (r.type === "parametric") {
      typeBadge = `<span class="badge bg-purple-100 text-purple-800">Paramétrica (SKU)</span>`;
    } else if (r.type === "restriction") {
      typeBadge = `<span class="badge bg-amber-100 text-amber-800">Restricción (Qué NO decir)</span>`;
    }

    const phrasesHtml = (r.trainingPhrases || []).map(p =>
      `<span class="inline-block rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700">${escapeHtml(p)}</span>`
    ).join(" ");

    let responsePreview = escapeHtml(r.response || "");
    if (r.type === "parametric") {
      responsePreview = `<b>Con stock:</b> ${escapeHtml(r.responseInStock || "")}<br><b class="text-rose-600">Sin stock:</b> ${escapeHtml(r.responseOutOfStock || "")}`;
    }

    const isChecked = r.enabled !== false ? "checked" : "";

    return `
      <div class="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-900 text-sm">${escapeHtml(r.name)}</h3>
              ${typeBadge}
              <span class="badge bg-slate-100 text-slate-600 text-[10px]">${escapeHtml(r.category || "General")}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
              <input type="checkbox" data-action="toggle-rule" data-id="${escapeHtml(r.id)}" ${isChecked} class="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500">
              <span>${r.enabled !== false ? "Activa" : "Pausada"}</span>
            </label>
            <button data-action="edit-rule" data-id="${escapeHtml(r.id)}" class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">Editar</button>
            <button data-action="delete-rule" data-id="${escapeHtml(r.id)}" class="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">Borrar</button>
          </div>
        </div>

        <div class="mt-3 text-xs">
          <p class="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Frases Disparadoras (${r.trainingPhrases?.length || 0}):</p>
          <div class="mt-1 flex flex-wrap gap-1.5">${phrasesHtml}</div>
        </div>

        <div class="mt-3 text-xs bg-slate-50 rounded-xl p-3 border border-slate-100 text-slate-700 leading-relaxed">
          <p class="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">Respuesta configurada:</p>
          ${responsePreview}
        </div>
      </div>
    `;
  }).join("");
}

// Category filter buttons
$$(".rule-filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".rule-filter-btn").forEach(b => {
      b.classList.remove("bg-slate-900", "text-white");
      b.classList.add("bg-slate-100", "text-slate-600");
    });
    btn.classList.add("bg-slate-900", "text-white");
    btn.classList.remove("bg-slate-100", "text-slate-600");
    activeCategoryFilter = btn.dataset.category;
    renderRules();
  });
});

// Rule Type selector toggle
$("#rule-type").addEventListener("change", e => {
  const type = e.target.value;
  if (type === "parametric") {
    $("#rule-static-box").classList.add("hidden");
    $("#rule-parametric-box").classList.remove("hidden");
    $("#rule-response").removeAttribute("required");
  } else {
    $("#rule-static-box").classList.remove("hidden");
    $("#rule-parametric-box").classList.add("hidden");
    $("#rule-response").setAttribute("required", "true");
  }
});

// Rule Modal Handlers
$("#btn-open-new-rule").addEventListener("click", () => {
  $("#modal-rule-title").textContent = "Crear Nueva Pregunta / Regla";
  $("#form-rule").reset();
  $("#rule-id").value = "";
  $("#rule-type").value = "static";
  $("#rule-static-box").classList.remove("hidden");
  $("#rule-parametric-box").classList.add("hidden");
  openModal("#modal-rule");
});

$("#rules-container").addEventListener("click", e => {
  const toggleCheckbox = e.target.closest('[data-action="toggle-rule"]');
  const editBtn = e.target.closest('[data-action="edit-rule"]');
  const delBtn = e.target.closest('[data-action="delete-rule"]');

  if (toggleCheckbox) {
    const id = toggleCheckbox.dataset.id;
    StorageFacade.toggleRule(id);
    notify("Estado de regla actualizado.");
    renderAll();
    return;
  }

  if (editBtn) {
    const id = editBtn.dataset.id;
    const rule = StorageFacade.getRules().find(r => r.id === id);
    if (!rule) return;
    $("#modal-rule-title").textContent = `Editar Regla: ${rule.name}`;
    $("#rule-id").value = rule.id;
    $("#rule-name").value = rule.name;
    $("#rule-category").value = rule.category || "Políticas";
    $("#rule-type").value = rule.type || "static";
    $("#rule-phrases").value = (rule.trainingPhrases || []).join("\n");

    if (rule.type === "parametric") {
      $("#rule-static-box").classList.add("hidden");
      $("#rule-parametric-box").classList.remove("hidden");
      $("#rule-in-stock").value = rule.responseInStock || "";
      $("#rule-out-stock").value = rule.responseOutOfStock || "";
      $("#rule-not-found").value = rule.responseNotFound || "";
      $("#rule-response").removeAttribute("required");
    } else {
      $("#rule-static-box").classList.remove("hidden");
      $("#rule-parametric-box").classList.add("hidden");
      $("#rule-response").value = rule.response || "";
      $("#rule-response").setAttribute("required", "true");
    }
    openModal("#modal-rule");
  }

  if (delBtn) {
    const id = delBtn.dataset.id;
    if (confirm("¿Estás seguro de eliminar esta regla del bot?")) {
      StorageFacade.deleteRule(id);
      notify("Regla eliminada.");
      renderAll();
    }
  }
});

$("#form-rule").addEventListener("submit", e => {
  e.preventDefault();
  const id = $("#rule-id").value;
  const type = $("#rule-type").value;
  const phrases = $("#rule-phrases").value
    .split(/[\n,]/)
    .map(p => p.trim())
    .filter(Boolean);

  const ruleData = {
    id: id || undefined,
    name: $("#rule-name").value.trim(),
    category: $("#rule-category").value,
    type,
    trainingPhrases: phrases,
    enabled: true
  };

  if (type === "parametric") {
    ruleData.responseInStock = $("#rule-in-stock").value.trim();
    ruleData.responseOutOfStock = $("#rule-out-stock").value.trim();
    ruleData.responseNotFound = $("#rule-not-found").value.trim();
  } else {
    ruleData.response = $("#rule-response").value.trim();
  }

  StorageFacade.saveRule(ruleData);
  closeModal("#modal-rule");
  notify("Regla guardada exitosamente.");
  renderAll();
});

// ---- SECTION 3: SYNONYMS DICTIONARY (DYNAMIC GROUPS WITH N WORDS) ----
function renderSynonyms() {
  const synonyms = StorageFacade.getSynonyms();
  const container = $("#synonyms-container");

  const keys = Object.keys(synonyms);
  if (!keys.length) {
    container.innerHTML = `<div class="col-span-full rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">No hay grupos de sinónimos configurados.</div>`;
    return;
  }

  container.innerHTML = keys.map(key => {
    const words = synonyms[key] || [];
    const chips = words.map(w => `
      <span class="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200/80 px-2 py-1 text-xs text-amber-900 font-medium">
        <span>${escapeHtml(w)}</span>
        <button type="button" data-action="remove-syn-word" data-concept="${escapeHtml(key)}" data-word="${escapeHtml(w)}" class="text-amber-500 hover:text-amber-800 text-[10px]">✕</button>
      </span>
    `).join("");

    return `
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <span class="font-bold text-slate-800 text-sm capitalize">🏷 ${escapeHtml(key)}</span>
            <button type="button" data-action="delete-syn-group" data-concept="${escapeHtml(key)}" class="text-xs text-rose-500 hover:text-rose-700">Eliminar grupo</button>
          </div>
          <div class="mt-3 flex flex-wrap gap-1.5 min-h-[48px]">
            ${chips}
          </div>
        </div>

        <form data-action="add-syn-word-form" data-concept="${escapeHtml(key)}" class="mt-4 flex gap-1.5 pt-2 border-t border-slate-100">
          <input placeholder="+ Agregar sinónimo" class="control text-xs py-1.5 px-2.5">
          <button class="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition">＋</button>
        </form>
      </div>
    `;
  }).join("");
}

// Synonyms Handlers
$("#btn-open-new-synonym").addEventListener("click", () => {
  $("#form-synonym").reset();
  openModal("#modal-synonym");
});

$("#form-synonym").addEventListener("submit", e => {
  e.preventDefault();
  const concept = $("#syn-concept").value.trim().toLowerCase();
  const words = $("#syn-words").value.split(",").map(w => w.trim()).filter(Boolean);

  if (concept && words.length) {
    StorageFacade.saveSynonymGroup(concept, words);
    closeModal("#modal-synonym");
    notify(`Grupo "${concept}" agregado con ${words.length} sinónimos.`);
    renderAll();
  }
});

$("#synonyms-container").addEventListener("click", e => {
  const removeWordBtn = e.target.closest('[data-action="remove-syn-word"]');
  const deleteGroupBtn = e.target.closest('[data-action="delete-syn-group"]');

  if (removeWordBtn) {
    const concept = removeWordBtn.dataset.concept;
    const word = removeWordBtn.dataset.word;
    const synonyms = StorageFacade.getSynonyms();
    const list = (synonyms[concept] || []).filter(w => w !== word);
    StorageFacade.saveSynonymGroup(concept, list);
    renderSynonyms();
    updateHeaderAndBadges();
  }

  if (deleteGroupBtn) {
    const concept = deleteGroupBtn.dataset.concept;
    if (confirm(`¿Eliminar todo el grupo de sinónimos "${concept}"?`)) {
      StorageFacade.deleteSynonymGroup(concept);
      notify(`Grupo "${concept}" eliminado.`);
      renderAll();
    }
  }
});

$("#synonyms-container").addEventListener("submit", e => {
  const addWordForm = e.target.closest('[data-action="add-syn-word-form"]');
  if (addWordForm) {
    e.preventDefault();
    const concept = addWordForm.dataset.concept;
    const input = addWordForm.querySelector("input");
    const newWord = input.value.trim();
    if (newWord) {
      const synonyms = StorageFacade.getSynonyms();
      const list = synonyms[concept] || [];
      if (!list.includes(newWord)) {
        list.push(newWord);
        StorageFacade.saveSynonymGroup(concept, list);
        input.value = "";
        renderSynonyms();
      }
    }
  }
});

// ---- SECTION: SOCIAL CAMPAIGNS & REFERRAL MAPPING ----
function renderCampaigns() {
  const campaigns = StorageFacade.getCampaigns();
  const products = StorageFacade.getProducts();
  const tbody = $("#campaigns-table-body");
  if (!tbody) return;

  if (!campaigns.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-slate-400">No hay campañas ni enlaces vinculados. Haz clic en "＋ Nueva Campaña / Enlace" para registrar uno.</td></tr>`;
    return;
  }

  tbody.innerHTML = campaigns.map(c => {
    let platformBadge = `<span class="badge bg-blue-100 text-blue-800">Facebook Ads</span>`;
    if (c.platform === "facebook_post" || c.type === "post") {
      platformBadge = `<span class="badge bg-indigo-100 text-indigo-800">Facebook Post</span>`;
    } else if (c.platform === "instagram") {
      platformBadge = `<span class="badge bg-pink-100 text-pink-800">Instagram</span>`;
    } else if (c.platform === "tiktok") {
      platformBadge = `<span class="badge bg-slate-900 text-white">TikTok</span>`;
    }

    const prod = products.find(p => p.sku === c.sku);
    const prodName = prod ? prod.name : "Producto no encontrado";

    return `
      <tr class="hover:bg-slate-50/70 transition">
        <td class="py-3 px-4">${platformBadge}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-800">${escapeHtml(c.headline || "Campaña")}</div>
          <div class="text-[11px] text-slate-400 truncate max-w-[220px]">${escapeHtml(c.description || "")}</div>
        </td>
        <td class="py-3 px-4 font-mono text-[11px] text-slate-600">
          <span class="rounded bg-slate-100 px-2 py-1 truncate max-w-[200px] inline-block align-middle" title="${escapeHtml(c.url || c.sourceId)}">${escapeHtml(c.sourceId || c.url)}</span>
        </td>
        <td class="py-3 px-4">
          <span class="badge bg-emerald-50 text-emerald-800 font-mono font-bold">${escapeHtml(c.sku)}</span>
          <span class="text-[11px] text-slate-600 ml-1 font-medium truncate max-w-[150px] inline-block align-middle">${escapeHtml(prodName)}</span>
        </td>
        <td class="py-3 px-4 text-right space-x-1">
          <button data-action="copy-sku-link" data-sku="${escapeHtml(c.sku)}" class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition" title="Copiar link wa.me con este SKU">Copiar Link wa.me</button>
          <button data-action="delete-campaign" data-id="${escapeHtml(c.id)}" class="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">Borrar</button>
        </td>
      </tr>
    `;
  }).join("");
}

function updateSmartLinkGenerator() {
  const select = $("#smart-link-product");
  const output = $("#smart-link-output");
  if (!select || !output) return;

  const products = StorageFacade.getProducts();
  const currentVal = select.value;
  select.innerHTML = "";

  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.sku;
    opt.textContent = `${p.sku} · ${p.name}`;
    select.append(opt);
  });

  if (currentVal && products.some(p => p.sku === currentVal)) {
    select.value = currentVal;
  }

  const selectedSku = select.value || products[0]?.sku || "SKM-955-CA-NE";
  const phone = "50487331949";
  const text = `Hola, me interesa el producto [SKU: ${selectedSku}]`;
  output.value = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

if ($("#smart-link-product")) {
  $("#smart-link-product").addEventListener("change", e => {
    const selectedSku = e.target.value;
    const phone = "50487331949";
    const text = `Hola, me interesa el producto [SKU: ${selectedSku}]`;
    $("#smart-link-output").value = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  });
}

if ($("#btn-copy-smart-link")) {
  $("#btn-copy-smart-link").addEventListener("click", async () => {
    const val = $("#smart-link-output").value;
    try {
      await navigator.clipboard.writeText(val);
      notify("¡Enlace wa.me copiado al portapapeles!");
    } catch {
      notify("Enlace copiado.");
    }
  });
}

// Campaign Modal & Actions
if ($("#btn-open-new-campaign")) {
  $("#btn-open-new-campaign").addEventListener("click", () => {
    $("#form-campaign").reset();
    $("#camp-id").value = "";
    const skuSelect = $("#camp-sku");
    skuSelect.innerHTML = "";
    StorageFacade.getProducts().forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.sku;
      opt.textContent = `${p.sku} · ${p.name}`;
      skuSelect.append(opt);
    });
    openModal("#modal-campaign");
  });
}

if ($("#campaigns-table-body")) {
  $("#campaigns-table-body").addEventListener("click", async e => {
    const copyBtn = e.target.closest('[data-action="copy-sku-link"]');
    const delBtn = e.target.closest('[data-action="delete-campaign"]');

    if (copyBtn) {
      const sku = copyBtn.dataset.sku;
      const link = `https://wa.me/50487331949?text=${encodeURIComponent(`Hola, me interesa el producto [SKU: ${sku}]`)}`;
      try {
        await navigator.clipboard.writeText(link);
        notify(`¡Enlace copiado para SKU ${sku}!`);
      } catch {
        notify("Enlace copiado.");
      }
    }

    if (delBtn) {
      const id = delBtn.dataset.id;
      if (confirm("¿Estás seguro de eliminar este enlace de campaña?")) {
        StorageFacade.deleteCampaign(id);
        notify("Campaña eliminada.");
        renderAll();
      }
    }
  });
}

if ($("#form-campaign")) {
  $("#form-campaign").addEventListener("submit", e => {
    e.preventDefault();
    const id = $("#camp-id").value;
    const urlOrId = $("#camp-url").value.trim();
    
    // Extract token if it's a facebook share link
    const fbShareMatch = urlOrId.match(/facebook\.com\/share\/p\/([a-zA-Z0-9_\-]+)/i);
    const sourceId = (fbShareMatch && fbShareMatch[1]) ? fbShareMatch[1] : (urlOrId.startsWith("http") ? urlOrId.replace(/^https?:\/\/[^\/]+\//, "") : urlOrId);

    const campData = {
      id: id || undefined,
      platform: $("#camp-platform").value,
      headline: $("#camp-headline").value.trim(),
      url: urlOrId,
      sourceId: sourceId,
      sku: $("#camp-sku").value,
      description: $("#camp-desc").value.trim()
    };

    StorageFacade.saveCampaign(campData);
    closeModal("#modal-campaign");
    notify("Campaña vinculada al SKU exitosamente.");
    renderAll();
  });
}

// ---- SECTION 4: TESTER SANDBOX ----
$("#tester-form").addEventListener("submit", async e => {
  e.preventDefault();
  const question = $("#tester-input").value.trim();
  if (!question) return;

  const tenant = StorageFacade.getTenant();
  const products = StorageFacade.getProducts();
  const campaigns = StorageFacade.getCampaigns();
  const skuInfo = testEngine.extractSku(question, products, { campaigns });

  const answer = await testEngine.reply(question);

  const resultBox = $("#tester-result");
  resultBox.classList.remove("hidden");

  let detectedRule = "Regla de consulta / Fallback general";
  if (skuInfo) {
    if (skuInfo.source === "facebook_ad") {
      detectedRule = `Atribución Meta Ads (Producto: ${skuInfo.product?.name || skuInfo.sku})`;
    } else if (skuInfo.source === "social_link") {
      detectedRule = `Enlace de Red Social Detectado (Producto: ${skuInfo.product?.name || skuInfo.sku})`;
    } else if (skuInfo.source === "deep_link") {
      detectedRule = `Enlace Deep Link con SKU (Producto: ${skuInfo.product?.name || skuInfo.sku})`;
    } else {
      detectedRule = skuInfo.product
        ? `Consulta de Stock Paramétrica (Producto: ${skuInfo.product.name})`
        : `Consulta de Stock (SKU: ${skuInfo.sku} no registrado)`;
    }
  } else if (answer.isRestriction) {
    detectedRule = "Regla de Restricción / Lo que NO decir";
  }

  $("#tester-rule-name").textContent = detectedRule;
  $("#tester-sku-badge").textContent = skuInfo ? `SKU Detectado: ${skuInfo.sku}` : "SKU: No detectado";
  $("#tester-response-text").textContent = answer.text;
});

// ---- SECTION 5: ORDERS TABLE ----
function renderOrders() {
  const orders = StorageFacade.getOrders();
  const tbody = $("#orders");
  $("#order-count").textContent = orders.length;

  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-slate-400">Todavía no hay pedidos registrados. Confirma una compra desde el simulador o carga pedidos demo.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => {
    const mapUrl = o.location?.mapUrl || (o.address && o.address.startsWith("http") ? o.address : null);
    const piezasTxt = o.quantityLabel || `${o.quantity || 1} unid.`;
    const orderNum = o.orderNumber || "ORD-SMAK";

    let statusBadge = "";
    if (o.status === "en_camino" || o.trackingNumber) {
      statusBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">🚚 En camino</span>`;
    } else if (o.status === "entregado") {
      statusBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">✓ Entregado</span>`;
    } else {
      statusBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">🕒 Pendiente</span>`;
    }

    let invoiceBadge = "";
    if (o.requiresInvoice) {
      invoiceBadge = `
        <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200" title="RTN: ${escapeHtml(o.rtn || '')} · ${escapeHtml(o.businessName || '')}">
          🧾 Sí
        </span>
        ${o.rtn ? `<div class="font-mono text-[9px] text-slate-400 mt-0.5 truncate max-w-[120px]" title="RTN: ${escapeHtml(o.rtn)}">RTN: ${escapeHtml(o.rtn)}</div>` : ""}
      `;
    } else {
      invoiceBadge = `<span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">No</span>`;
    }

    return `
    <tr class="hover:bg-slate-50 transition">
      <td class="px-4 py-3">
        <div class="font-mono font-bold text-indigo-700 text-xs">${escapeHtml(orderNum)}</div>
        <div class="mt-1">${statusBadge}</div>
        <div class="text-[10px] text-slate-400 mt-1">${new Date(o.createdAt).toLocaleString("es-HN", { dateStyle: "short", timeStyle: "short" })}</div>
      </td>
      <td class="px-4 py-3">
        <div class="font-bold text-slate-900">${escapeHtml(o.recipientName || o.name)}</div>
        <div class="font-mono text-xs text-indigo-700 font-semibold mt-0.5">📞 ${escapeHtml(o.phone)}</div>
      </td>
      <td class="px-4 py-3 text-slate-600">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200/80">${escapeHtml(piezasTxt)}</span>
          ${o.sku ? `<span class="font-mono text-[10px] rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 font-semibold">${escapeHtml(o.sku)}</span>` : ""}
        </div>
        <div class="font-medium text-slate-800 mt-1 text-xs">${escapeHtml(o.productName)}</div>
      </td>
      <td class="px-4 py-3">
        ${invoiceBadge}
      </td>
      <td class="px-4 py-3 text-slate-600 max-w-[180px]">
        <div class="font-medium text-slate-800 line-clamp-2 text-xs">${escapeHtml(o.address || "—")}</div>
        ${mapUrl ? `<a href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer" class="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 hover:bg-emerald-200 transition">📍 Google Maps</a>` : ""}
      </td>
      <td class="px-4 py-3 font-bold text-emerald-700 whitespace-nowrap">L.${money(o.total)}</td>
      <td class="px-4 py-3 text-center">
        ${o.trackingNumber ? `
          <div class="flex flex-col items-center gap-1">
            <span class="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-2 py-0.5">🚚 ${escapeHtml(o.trackingNumber)}</span>
            <div class="flex items-center gap-1 mt-0.5">
              <button type="button" class="btn-notify-wa px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition shadow-sm" data-id="${o.id}" title="Reenviar mensaje de WhatsApp al cliente">📲 WhatsApp</button>
              <button type="button" class="btn-edit-trk px-1.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[10px]" data-id="${o.id}" title="Editar guía">✏️</button>
              <button type="button" class="btn-view-audit px-1.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[10px]" data-id="${o.id}" title="Ver auditoría">🔍</button>
            </div>
          </div>
        ` : `
          <div class="flex items-center justify-center gap-1.5">
            <button type="button" class="btn-assign-trk flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 transition shadow-sm" data-id="${o.id}">
              <span>🚚 Asignar Guía</span>
            </button>
            <button type="button" class="btn-view-audit px-1.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[10px]" data-id="${o.id}" title="Ver auditoría">🔍</button>
          </div>
        `}
      </td>
    </tr>
  `;
  }).join("");
}

// ---- TRACKING & AUDIT EVENT HANDLERS ----
let currentTrackingOrder = null;

function updateTrackingPreview(order) {
  if (!order) return;
  const trk = $("#tracking-number-input").value.trim().toUpperCase() || "CAEX-HN-XXXXXX";
  const carrier = $("#tracking-carrier-select").value || "Cargo Expreso";
  const piezasTxt = order.quantityLabel || `${order.quantity || 1} unidades`;
  const invoiceLine = order.requiresInvoice ? `🧾 Tu factura con RTN (${order.rtn}) va adjunta en el paquete.\n` : "";
  const msg = `¡Hola ${order.name}! 👋 Te confirmamos que tu pedido *${order.orderNumber}* (${piezasTxt} · ${order.productName}) ya va en camino a tu dirección (${order.address}). 🚚📦\n\nTu número de guía de rastreo es: *${trk}* (${carrier}).\nMonto total a pagar en efectivo contra entrega: *L.${Number(order.total).toLocaleString("es-HN")}*.\n${invoiceLine}Recuerda tener listo el pago al momento de recibir. Si tienes cualquier consulta, estamos a tu orden. ¡Gracias por confiar en SMAK Honduras! ✨`;
  $("#tracking-preview-message").value = msg;
}

$("#orders").addEventListener("click", e => {
  const assignBtn = e.target.closest(".btn-assign-trk");
  const editBtn = e.target.closest(".btn-edit-trk");
  const notifyBtn = e.target.closest(".btn-notify-wa");
  const auditBtn = e.target.closest(".btn-view-audit");

  if (assignBtn || editBtn) {
    const orderId = (assignBtn || editBtn).dataset.id;
    const order = StorageFacade.getOrder(orderId);
    if (!order) return;
    currentTrackingOrder = order;

    $("#tracking-order-id").value = order.id;
    $("#trk-order-number").textContent = order.orderNumber;
    $("#trk-order-total").textContent = `L.${money(order.total)}`;
    $("#trk-customer-name").textContent = order.name;
    $("#trk-customer-phone").textContent = order.phone;
    $("#trk-customer-product").textContent = `${order.quantityLabel || (order.quantity + " unid.")} · ${order.productName}`;
    $("#trk-customer-address").textContent = order.address;
    $("#tracking-number-input").value = order.trackingNumber || "";
    $("#tracking-carrier-select").value = order.trackingCarrier || "Cargo Expreso";

    updateTrackingPreview(order);
    openModal("#modal-tracking");
    setTimeout(() => $("#tracking-number-input").focus(), 150);
  } else if (notifyBtn) {
    const orderId = notifyBtn.dataset.id;
    const order = StorageFacade.getOrder(orderId);
    if (!order || !order.trackingNumber) return;
    const result = StorageFacade.updateOrderTracking(order.id, order.trackingNumber, order.trackingCarrier);
    if (result && result.whatsappUrl) {
      window.open(result.whatsappUrl, "_blank");
      notify(`📲 Notificación WhatsApp enviada para ${order.orderNumber}`);
    }
  } else if (auditBtn) {
    const orderId = auditBtn.dataset.id;
    const order = StorageFacade.getOrder(orderId);
    if (!order) return;

    const audit = order.audit || {};
    const history = Array.isArray(audit.history) ? audit.history : [];
    const sourceLabel = order.source === "landing_page_widget" ? "Showroom Web App (SWAP)" : "Simulador WhatsApp";

    const auditHtml = `
      <div class="grid sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">N° Pedido</span>
          <span class="font-mono font-bold text-indigo-700 text-sm">${escapeHtml(order.orderNumber)}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Canal / Origen</span>
          <span class="font-bold text-slate-800">${escapeHtml(sourceLabel)}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Cliente & Teléfono</span>
          <span class="font-medium text-slate-800">${escapeHtml(order.name)} (${escapeHtml(order.phone)})</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Piezas / Producto</span>
          <span class="font-medium text-slate-800">${escapeHtml(order.quantityLabel || (order.quantity + " unid."))} · ${escapeHtml(order.productName)}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">IP de Auditoría</span>
          <span class="font-mono text-slate-700">${escapeHtml(audit.ip || "190.92.112.45")}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Facturación</span>
          <span class="font-semibold ${order.requiresInvoice ? 'text-emerald-700' : 'text-slate-600'}">
            ${order.requiresInvoice ? `Sí (RTN: ${escapeHtml(order.rtn || '—')} · ${escapeHtml(order.businessName || '—')})` : 'No (Consumidor Final)'}
          </span>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 mb-2">Historial de Eventos & Trazabilidad:</h4>
        <div class="space-y-2 border-l-2 border-indigo-200 pl-3 ml-2">
          ${history.length ? history.map(h => `
            <div class="relative">
              <div class="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
              <div class="text-[11px] font-bold text-slate-800">${escapeHtml(h.action || 'evento')} · <span class="font-normal text-slate-400">${new Date(h.timestamp).toLocaleString("es-HN")}</span></div>
              <div class="text-[11px] text-slate-600">${escapeHtml(h.note || 'Actualización de registro.')}</div>
            </div>
          `).join("") : `
            <div class="text-slate-400">Sin eventos adicionales registrados.</div>
          `}
        </div>
      </div>
    `;

    $("#audit-modal-body").innerHTML = auditHtml;
    openModal("#modal-audit");
  }
});

$("#tracking-number-input")?.addEventListener("input", () => {
  updateTrackingPreview(currentTrackingOrder);
});

$("#tracking-carrier-select")?.addEventListener("change", () => {
  updateTrackingPreview(currentTrackingOrder);
});

$("#form-tracking")?.addEventListener("submit", e => {
  e.preventDefault();
  const orderId = $("#tracking-order-id").value;
  const trackingNumber = $("#tracking-number-input").value.trim();
  const carrier = $("#tracking-carrier-select").value;

  if (!orderId || !trackingNumber) return;

  const result = StorageFacade.updateOrderTracking(orderId, trackingNumber, carrier);
  closeModal("#modal-tracking");

  if (result && result.whatsappUrl) {
    window.open(result.whatsappUrl, "_blank");
    notify(`✅ Guía ${trackingNumber} asignada y WhatsApp abierto con mensaje.`);
  } else {
    notify(`✅ Guía ${trackingNumber} asignada correctamente.`);
  }

  renderOrders();
});

$("#seed-orders").addEventListener("click", () => {
  const added = StorageFacade.seedDemoOrders();
  notify(added ? `Se agregaron ${added} pedidos de prueba.` : "Los pedidos de prueba ya están cargados.");
  renderOrders();
  updateHeaderAndBadges();
});

// ---- RESET DEMO DATA ----
$("#btn-reset-demo").addEventListener("click", () => {
  if (confirm("¿Deseas restaurar todos los productos, reglas y sinónimos a los valores de fábrica originales?")) {
    StorageFacade.resetToDefaults();
    notify("Datos restablecidos a los valores demo originales.");
    renderTenantOptions();
    renderAll();
  }
});

// ---- MODAL HELPERS ----
function openModal(selector) {
  const modal = $(selector);
  modal.classList.remove("hidden");
}

function closeModal(selector) {
  const modal = $(selector);
  modal.classList.add("hidden");
}

$$(".btn-close-modal").forEach(btn => {
  btn.addEventListener("click", () => {
    $$("#modal-product, #modal-rule, #modal-synonym, #modal-campaign, #modal-tracking, #modal-audit").forEach(m => m.classList.add("hidden"));
  });
});


// Toast Notification
function notify(message) {
  const n = $("#notice");
  $("#notice-msg").textContent = message;
  n.classList.remove("hidden");
  setTimeout(() => n.classList.add("hidden"), 3000);
}

// ---- EVENT LISTENERS ----
$("#tenant-select").addEventListener("change", e => {
  StorageFacade.setActiveTenantId(e.target.value);
  testEngine.reset();
  renderAll();
});

window.addEventListener("smakbot:data-changed", () => {
  renderTenantOptions();
  renderAll();
});

window.addEventListener("storage", () => {
  renderTenantOptions();
  renderAll();
});

// Initialize
renderTenantOptions();
renderAll();
