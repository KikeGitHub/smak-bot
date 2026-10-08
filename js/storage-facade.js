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
    // Validate if data has v3 structure with products array and rules
    const isValidV3 = data && data.tenants && Object.values(data.tenants).every(t => Array.isArray(t.products) && t.products.length >= 6 && Array.isArray(t.rules));
    if (!isValidV3) {
      const tenants = Object.fromEntries(TENANTS.map(t => [t.id, clone(t)]));
      const initialOrders = [
        { tenantId: "smak", name: "María Fernanda López", address: "Col. Palmira, Tegucigalpa", phone: "+504 9876-1204", sku: "EST-01", daysAgo: 0 },
        { tenantId: "smak", name: "Carlos Mendoza", address: "Residencial Las Uvas, Comayagüela", phone: "+504 9452-6810", sku: "ESC-02", daysAgo: 1 },
        { tenantId: "smak", name: "Andrea Pineda", address: "Barrio El Centro, San Pedro Sula", phone: "+504 9981-3472", sku: "MESA-04", daysAgo: 2 },
        { tenantId: "smak", name: "Roberto Cálix", address: "Col. El Toronjal, La Ceiba", phone: "+504 9711-4402", sku: "LAMP-05", daysAgo: 3 },
        { tenantId: "smak", name: "Elena Ramos", address: "Lomas del Guijarro, Tegucigalpa", phone: "+504 8820-9150", sku: "REP-06", daysAgo: 4 },
        { tenantId: "smak", name: "David Banegas", address: "Col. Los Álamos, San Pedro Sula", phone: "+504 9500-3321", sku: "CLO-07", daysAgo: 5 },
        { tenantId: "calzado", name: "José David Rivera", address: "Col. Trejo, San Pedro Sula", phone: "+504 9630-1175", sku: "TEN-01", daysAgo: 0 },
        { tenantId: "calzado", name: "Sofía Castellanos", address: "Barrio Río de Piedras, San Pedro Sula", phone: "+504 9714-8206", sku: "BOT-02", daysAgo: 1 },
        { tenantId: "calzado", name: "Marlon Aguilar", address: "Col. Kennedy, Tegucigalpa", phone: "+504 9460-7719", sku: "MOC-04", daysAgo: 2 },
        { tenantId: "calzado", name: "Daniela Flores", address: "Res. Plaza, Tegucigalpa", phone: "+504 8890-5316", sku: "DEP-05", daysAgo: 3 },
        { tenantId: "calzado", name: "Gabriela Santos", address: "Col. Miramar, La Ceiba", phone: "+504 9811-6624", sku: "TAC-06", daysAgo: 4 },
        { tenantId: "calzado", name: "Cristian Orellana", address: "Barrio El Centro, Choluteca", phone: "+504 9322-1088", sku: "CAS-07", daysAgo: 5 }
      ];

      const orders = initialOrders.map(sample => {
        const tenant = tenants[sample.tenantId];
        const prod = tenant?.products?.find(p => p.sku === sample.sku) || tenant?.products?.[0];
        return {
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
        };
      });

      this.write({ activeTenantId: "smak", tenants, orders });
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
    const extraSamples = [
      { tenantId: "smak", name: "Karla Barahona", address: "Col. Trejo, San Pedro Sula", phone: "+504 9812-4011", sku: "EST-01" },
      { tenantId: "smak", name: "Javier Moncada", address: "Res. El Molinón, Tegucigalpa", phone: "+504 9740-8822", sku: "ESC-02" },
      { tenantId: "calzado", name: "Lorena Varela", address: "Barrio Medina, San Pedro Sula", phone: "+504 9600-5541", sku: "TEN-01" }
    ];
    let count = 0;
    for (const sample of extraSamples) {
      const tenant = state.tenants[sample.tenantId];
      const prod = tenant?.products?.find(p => p.sku === sample.sku) || tenant?.products?.[0];
      state.orders.unshift({
        id: crypto.randomUUID(),
        tenantId: sample.tenantId,
        name: sample.name,
        address: sample.address,
        phone: sample.phone,
        productName: prod ? `${prod.name} (${prod.sku})` : "Producto",
        sku: prod ? prod.sku : "",
        total: prod ? Number(prod.salePrice) : 0,
        isDemo: true,
        createdAt: new Date().toISOString()
      });
      count++;
    }
    this.write(state);
    return count;
  }

  static resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.initialize();
    window.dispatchEvent(new CustomEvent("smakbot:data-changed"));
  }
}

StorageFacade.initialize();
