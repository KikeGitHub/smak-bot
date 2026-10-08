import { TENANTS, STORAGE_KEY } from "./seed-data.js";

const clone = (value) => JSON.parse(JSON.stringify(value));

export class StorageFacade {
  static read() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  static initialize() {
    const data = this.read();
    // Validate if data has v2 structure with products array and rules
    const isValidV2 = data && data.tenants && Object.values(data.tenants).every(t => Array.isArray(t.products) && Array.isArray(t.rules));
    if (!isValidV2) {
      const tenants = Object.fromEntries(TENANTS.map(t => [t.id, clone(t)]));
      this.write({ activeTenantId: "smak", tenants, orders: [] });
    }
  }

  static write(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("smakbot:data-changed", { detail: state }));
  }

  static getState() {
    this.initialize();
    return this.read();
  }

  static getTenants() {
    return Object.values(this.getState().tenants);
  }

  static getActiveTenantId() {
    return this.getState().activeTenantId || "smak";
  }

  static setActiveTenantId(id) {
    const state = this.getState();
    if (!state.tenants[id]) return;
    state.activeTenantId = id;
    this.write(state);
  }

  static getTenant(id = this.getActiveTenantId()) {
    const tenant = this.getState().tenants[id] || this.getState().tenants["smak"];
    // Compatibility shim: if code accesses .product, return first product
    if (tenant && !tenant.product && tenant.products?.length) {
      tenant.product = tenant.products[0];
    }
    return tenant;
  }

  // ---- PRODUCT MANAGEMENT (MULTI-SKU) ----
  static getProducts(id = this.getActiveTenantId()) {
    const tenant = this.getTenant(id);
    return clone(tenant.products || []);
  }

  static getProductBySku(sku, id = this.getActiveTenantId()) {
    const products = this.getProducts(id);
    const cleanSku = String(sku || "").trim().toLowerCase();
    return products.find(p => String(p.sku || "").trim().toLowerCase() === cleanSku) || null;
  }

  static saveProduct(product, id = this.getActiveTenantId()) {
    const state = this.getState();
    const tenant = state.tenants[id];
    if (!tenant) return;
    if (!tenant.products) tenant.products = [];

    const p = clone(product);
    if (!p.id) p.id = "prod-" + crypto.randomUUID().slice(0, 8);
    p.sku = String(p.sku || "").trim().toUpperCase();

    const index = tenant.products.findIndex(item => item.id === p.id || (p.sku && item.sku?.toUpperCase() === p.sku));
    if (index >= 0) {
      tenant.products[index] = p;
    } else {
      tenant.products.push(p);
    }
    this.write(state);
    return p;
  }

  static deleteProduct(productId, id = this.getActiveTenantId()) {
    const state = this.getState();
    const tenant = state.tenants[id];
    if (!tenant || !tenant.products) return false;
    tenant.products = tenant.products.filter(p => p.id !== productId && p.sku !== productId);
    this.write(state);
    return true;
  }

  // ---- DYNAMIC RULES & Q&A MANAGEMENT ----
  static getRules(id = this.getActiveTenantId()) {
    const tenant = this.getTenant(id);
    return clone(tenant.rules || []);
  }

  static saveRule(rule, id = this.getActiveTenantId()) {
    const state = this.getState();
    const tenant = state.tenants[id];
    if (!tenant) return;
    if (!tenant.rules) tenant.rules = [];

    const r = clone(rule);
    if (!r.id) r.id = "rule-" + crypto.randomUUID().slice(0, 8);
    if (r.enabled === undefined) r.enabled = true;

    const index = tenant.rules.findIndex(item => item.id === r.id);
    if (index >= 0) {
      tenant.rules[index] = r;
    } else {
      tenant.rules.unshift(r);
    }
    this.write(state);
    return r;
  }

  static toggleRule(ruleId, id = this.getActiveTenantId()) {
    const state = this.getState();
    const tenant = state.tenants[id];
    if (!tenant || !tenant.rules) return;
    const rule = tenant.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
      this.write(state);
    }
  }

  static deleteRule(ruleId, id = this.getActiveTenantId()) {
    const state = this.getState();
    const tenant = state.tenants[id];
    if (!tenant || !tenant.rules) return false;
    tenant.rules = tenant.rules.filter(r => r.id !== ruleId);
    this.write(state);
    return true;
  }

  // ---- SYNONYMS MANAGEMENT (DYNAMIC GROUPS) ----
  static getSynonyms(id = this.getActiveTenantId()) {
    const tenant = this.getTenant(id);
    return clone(tenant.synonyms || {});
  }

  static saveSynonyms(synonyms, id = this.getActiveTenantId()) {
    const state = this.getState();
    if (!state.tenants[id]) return;
    state.tenants[id].synonyms = clone(synonyms);
    this.write(state);
  }

  static saveSynonymGroup(key, words, id = this.getActiveTenantId()) {
    const state = this.getState();
    if (!state.tenants[id]) return;
    if (!state.tenants[id].synonyms) state.tenants[id].synonyms = {};
    const cleanKey = String(key || "").trim().toLowerCase();
    const list = Array.isArray(words) ? words : String(words || "").split(",").map(w => w.trim()).filter(Boolean);
    state.tenants[id].synonyms[cleanKey] = list;
    this.write(state);
  }

  static deleteSynonymGroup(key, id = this.getActiveTenantId()) {
    const state = this.getState();
    if (!state.tenants[id] || !state.tenants[id].synonyms) return;
    delete state.tenants[id].synonyms[key];
    this.write(state);
  }

  // ---- ORDERS ----
  static getOrders(id = this.getActiveTenantId()) {
    return this.getState().orders.filter(o => o.tenantId === id);
  }

  static saveOrder(order) {
    const state = this.getState();
    const newOrder = {
      ...clone(order),
      id: crypto.randomUUID(),
      tenantId: state.activeTenantId,
      createdAt: new Date().toISOString()
    };
    state.orders.unshift(newOrder);
    this.write(state);
    return newOrder;
  }

  static seedDemoOrders() {
    const state = this.getState();
    if (state.orders.some(order => order.isDemo)) return 0;
    const samples = [
      { tenantId: "smak", name: "María Fernanda López", address: "Col. Palmira, Tegucigalpa", phone: "+504 9876-1204", sku: "EST-01", daysAgo: 0 },
      { tenantId: "smak", name: "Carlos Mendoza", address: "Residencial Las Uvas, Comayagüela", phone: "+504 9452-6810", sku: "ESC-02", daysAgo: 1 },
      { tenantId: "smak", name: "Andrea Pineda", address: "Barrio El Centro, San Pedro Sula", phone: "+504 9981-3472", sku: "EST-01", daysAgo: 2 },
      { tenantId: "calzado", name: "José David Rivera", address: "Col. Trejo, San Pedro Sula", phone: "+504 9630-1175", sku: "TEN-01", daysAgo: 0 },
      { tenantId: "calzado", name: "Sofía Castellanos", address: "Barrio Río de Piedras, San Pedro Sula", phone: "+504 9714-8206", sku: "BOT-02", daysAgo: 1 }
    ];
    for (const sample of samples) {
      const tenant = state.tenants[sample.tenantId];
      const prod = tenant?.products?.find(p => p.sku === sample.sku) || tenant?.products?.[0];
      state.orders.push({
        id: crypto.randomUUID(),
        tenantId: sample.tenantId,
        name: sample.name,
        address: sample.address,
        phone: sample.phone,
        productName: prod ? `${prod.name} (${prod.sku})` : "Producto",
        sku: prod ? prod.sku : "",
        total: prod ? Number(prod.salePrice) : 0,
        isDemo: true,
        createdAt: new Date(Date.now() - sample.daysAgo * 86400000).toISOString()
      });
    }
    this.write(state);
    return samples.length;
  }

  static resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.initialize();
    window.dispatchEvent(new CustomEvent("smakbot:data-changed"));
  }
}

StorageFacade.initialize();
