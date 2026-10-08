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

  $("#sidebar-products-count").textContent = `${products.length} productos`;
  $("#nav-count-products").textContent = products.length;
  $("#nav-count-rules").textContent = rules.length;
  $("#nav-count-synonyms").textContent = Object.keys(synonyms).length;
  $("#nav-count-orders").textContent = orders.length;

  $("#badge-total-products").textContent = `${products.length} artículos`;
  $("#badge-total-rules").textContent = `${rules.length} reglas activas`;
  $("#badge-total-synonyms").textContent = `${Object.keys(synonyms).length} conceptos`;
}

function renderAll() {
  updateHeaderAndBadges();
  renderProducts();
  renderRules();
  renderSynonyms();
  renderOrders();
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

// ---- SECTION 4: TESTER SANDBOX ----
$("#tester-form").addEventListener("submit", async e => {
  e.preventDefault();
  const question = $("#tester-input").value.trim();
  if (!question) return;

  const tenant = StorageFacade.getTenant();
  const products = StorageFacade.getProducts();
  const skuInfo = testEngine.extractSku(question, products);

  const answer = await testEngine.reply(question);

  const resultBox = $("#tester-result");
  resultBox.classList.remove("hidden");

  let detectedRule = "Regla de consulta / Fallback general";
  if (skuInfo) {
    detectedRule = skuInfo.product
      ? `Consulta de Stock Paramétrica (Producto: ${skuInfo.product.name})`
      : `Consulta de Stock (SKU: ${skuInfo.sku} no registrado)`;
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
    tbody.innerHTML = `<tr><td colspan="5" class="px-5 py-8 text-center text-slate-400">Todavía no hay pedidos registrados. Confirma una compra desde el simulador o carga pedidos demo.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr class="hover:bg-slate-50 transition">
      <td class="px-5 py-3 font-semibold text-slate-800">${escapeHtml(o.name)}</td>
      <td class="px-5 py-3 text-slate-600">
        <span class="font-bold text-slate-800">${escapeHtml(o.productName)}</span>
        ${o.sku ? `<span class="ml-1 font-mono text-[11px] rounded bg-slate-100 px-1.5 py-0.5">${escapeHtml(o.sku)}</span>` : ""}
      </td>
      <td class="px-5 py-3 text-slate-600">${escapeHtml(o.phone)}</td>
      <td class="px-5 py-3 font-bold text-emerald-700">L.${money(o.total)}</td>
      <td class="px-5 py-3 text-slate-400 text-[11px]">${new Date(o.createdAt).toLocaleString("es-HN", { dateStyle: "short", timeStyle: "short" })}</td>
    </tr>
  `).join("");
}

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
    $$("#modal-product, #modal-rule, #modal-synonym").forEach(m => m.classList.add("hidden"));
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
