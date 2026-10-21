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
        { tenantId: "smak", name: "María Fernanda López", address: "Col. Palmira, Tegucigalpa", phone: "+504 9876-1204", sku: "EST-01", daysAgo: 0, location: { lat: 14.1025, lng: -87.1950, mapUrl: "https://www.google.com/maps?q=14.1025,-87.1950", address: "Col. Palmira, Tegucigalpa" } },
        { tenantId: "smak", name: "Carlos Mendoza", address: "Residencial Las Uvas, Comayagüela", phone: "+504 9452-6810", sku: "ESC-02", daysAgo: 1, location: { lat: 14.0480, lng: -87.2180, mapUrl: "https://www.google.com/maps?q=14.0480,-87.2180", address: "Residencial Las Uvas, Comayagüela" } },
        { tenantId: "smak", name: "Andrea Pineda", address: "Barrio El Centro, San Pedro Sula", phone: "+504 9981-3472", sku: "MESA-04", daysAgo: 2, location: { lat: 15.5030, lng: -88.0260, mapUrl: "https://www.google.com/maps?q=15.5030,-88.0260", address: "Barrio El Centro, San Pedro Sula" } },
        { tenantId: "smak", name: "Roberto Cálix", address: "Col. El Toronjal, La Ceiba", phone: "+504 9711-4402", sku: "LAMP-05", daysAgo: 3 },
        { tenantId: "smak", name: "Elena Ramos", address: "Lomas del Guijarro, Tegucigalpa", phone: "+504 8820-9150", sku: "REP-06", daysAgo: 4, location: { lat: 14.0980, lng: -87.1850, mapUrl: "https://www.google.com/maps?q=14.0980,-87.1850", address: "Lomas del Guijarro, Tegucigalpa" } },
        { tenantId: "smak", name: "David Banegas", address: "Col. Los Álamos, San Pedro Sula", phone: "+504 9500-3321", sku: "CLO-07", daysAgo: 5 },
        { tenantId: "calzado", name: "José David Rivera", address: "Col. Trejo, San Pedro Sula", phone: "+504 9630-1175", sku: "TEN-01", daysAgo: 0, location: { lat: 15.4980, lng: -88.0390, mapUrl: "https://www.google.com/maps?q=15.4980,-88.0390", address: "Col. Trejo, San Pedro Sula" } },
        { tenantId: "calzado", name: "Sofía Castellanos", address: "Barrio Río de Piedras, San Pedro Sula", phone: "+504 9714-8206", sku: "BOT-02", daysAgo: 1 },
        { tenantId: "calzado", name: "Marlon Aguilar", address: "Col. Kennedy, Tegucigalpa", phone: "+504 9460-7719", sku: "MOC-04", daysAgo: 2, location: { lat: 14.0580, lng: -87.1850, mapUrl: "https://www.google.com/maps?q=14.0580,-87.1850", address: "Col. Kennedy, Tegucigalpa" } },
        { tenantId: "calzado", name: "Daniela Flores", address: "Res. Plaza, Tegucigalpa", phone: "+504 8890-5316", sku: "DEP-05", daysAgo: 3, location: { lat: 14.0720, lng: -87.1720, mapUrl: "https://www.google.com/maps?q=14.0720,-87.1720", address: "Res. Plaza, Tegucigalpa" } },
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
          location: sample.location || null,
          isDemo: true,
          createdAt: new Date(Date.now() - sample.daysAgo * 86400000).toISOString()
        };
      });

      this.write({ activeTenantId: "smak", tenants, orders });
    } else {
      // Ensure existing tenants have campaigns and newly added products/rules migrated
      let modified = false;
      TENANTS.forEach(defT => {
        const curTenant = data.tenants[defT.id];
        if (curTenant) {
          if (!Array.isArray(curTenant.campaigns) || !curTenant.campaigns.length) {
            curTenant.campaigns = clone(defT.campaigns || []);
            modified = true;
          }
          // Merge missing products (like PER-09 and REG-10)
          (defT.products || []).forEach(p => {
            if (!curTenant.products.some(cp => cp.sku === p.sku)) {
              curTenant.products.push(clone(p));
              modified = true;
            }
          });
          // Merge updated rules
          (defT.rules || []).forEach(defR => {
            const curR = curTenant.rules.find(r => r.id === defR.id);
            if (curR) {
              (defR.trainingPhrases || []).forEach(phrase => {
                if (!curR.trainingPhrases.includes(phrase)) {
                  curR.trainingPhrases.push(phrase);
                  modified = true;
                }
              });
            } else {
              curTenant.rules.push(clone(defR));
              modified = true;
            }
          });
        }
      });
      if (modified) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
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

  // ---- SOCIAL CAMPAIGNS & REFERRAL MAPPING ----
  static getCampaigns(id = this.getActiveTenantId()) {
    const tenant = this.getTenant(id);
    return clone(tenant.campaigns || []);
  }

  static saveCampaign(campaign, id = this.getActiveTenantId()) {
    const state = this.getState();
    const tenant = state.tenants[id];
    if (!tenant) return;
    if (!tenant.campaigns) tenant.campaigns = [];

    const c = clone(campaign);
    if (!c.id) c.id = "camp-" + crypto.randomUUID().slice(0, 8);
    c.sku = String(c.sku || "").trim().toUpperCase();

    const index = tenant.campaigns.findIndex(item => item.id === c.id);
    if (index >= 0) {
      tenant.campaigns[index] = c;
    } else {
      tenant.campaigns.unshift(c);
    }
    this.write(state);
    return c;
  }

  static deleteCampaign(campaignId, id = this.getActiveTenantId()) {
    const state = this.getState();
    const tenant = state.tenants[id];
    if (!tenant || !tenant.campaigns) return false;
    tenant.campaigns = tenant.campaigns.filter(c => c.id !== campaignId);
    this.write(state);
    return true;
  }

  static findCampaign(query, id = this.getActiveTenantId()) {
    const campaigns = this.getCampaigns(id);
    const q = String(query || "").trim().toLowerCase();
    if (!q) return null;

    // 1. Direct match with URL or sourceId
    return campaigns.find(c => {
      const cUrl = String(c.url || "").toLowerCase();
      const cSourceId = String(c.sourceId || "").toLowerCase();
      return (cUrl && q.includes(cUrl)) || (cUrl && cUrl.includes(q)) ||
             (cSourceId && q.includes(cSourceId)) || (cSourceId && cSourceId === q);
    }) || null;
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
      { tenantId: "smak", name: "Karla Barahona", address: "Col. Trejo, San Pedro Sula", phone: "+504 9812-4011", sku: "EST-01", location: { lat: 15.4980, lng: -88.0390, mapUrl: "https://www.google.com/maps?q=15.4980,-88.0390", address: "Col. Trejo, San Pedro Sula" } },
      { tenantId: "smak", name: "Javier Moncada", address: "Res. El Molinón, Tegucigalpa", phone: "+504 9740-8822", sku: "ESC-02", location: { lat: 14.0900, lng: -87.1800, mapUrl: "https://www.google.com/maps?q=14.0900,-87.1800", address: "Res. El Molinón, Tegucigalpa" } },
      { tenantId: "calzado", name: "Lorena Varela", address: "Barrio Medina, San Pedro Sula", phone: "+504 9600-5541", sku: "TEN-01", location: { lat: 15.5010, lng: -88.0250, mapUrl: "https://www.google.com/maps?q=15.5010,-88.0250", address: "Barrio Medina, San Pedro Sula" } }
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
        location: sample.location || null,
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
