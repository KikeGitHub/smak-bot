import { TENANTS, STORAGE_KEY } from "./seed-data.js";

const clone = (value) => JSON.parse(JSON.stringify(value));
export class StorageFacade {
  static read() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  }
  static initialize() {
    if (!this.read()) {
      const tenants = Object.fromEntries(TENANTS.map(t => [t.id, clone(t)]));
      this.write({ activeTenantId: "smak", tenants, orders: [] });
    }
  }
  static write(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("smakbot:data-changed", { detail: state }));
  }
  static getState() { this.initialize(); return this.read(); }
  static getTenants() { return Object.values(this.getState().tenants); }
  static getActiveTenantId() { return this.getState().activeTenantId; }
  static setActiveTenantId(id) {
    const state = this.getState();
    if (!state.tenants[id]) return;
    state.activeTenantId = id; this.write(state);
  }
  static getTenant(id = this.getActiveTenantId()) { return this.getState().tenants[id]; }
  static getProducts(id) { return [clone(this.getTenant(id).product)]; }
  static saveProduct(product, id = this.getActiveTenantId()) {
    const state = this.getState(); state.tenants[id].product = clone(product); this.write(state);
  }
  static getFAQs(id) { return clone(this.getTenant(id).faqs); }
  static saveFAQs(faqs, id = this.getActiveTenantId()) {
    const state = this.getState(); state.tenants[id].faqs = clone(faqs); this.write(state);
  }
  static getSynonyms(id = this.getActiveTenantId()) { return clone(this.getTenant(id).synonyms); }
  static saveSynonyms(synonyms, id = this.getActiveTenantId()) {
    const state = this.getState(); state.tenants[id].synonyms = clone(synonyms); this.write(state);
  }
  static getOrders(id = this.getActiveTenantId()) { return this.getState().orders.filter(o => o.tenantId === id); }
  static saveOrder(order) {
    const state = this.getState(); state.orders.unshift({ ...clone(order), id: crypto.randomUUID(), tenantId: state.activeTenantId, createdAt: new Date().toISOString() }); this.write(state);
    return state.orders[0];
  }
  static seedDemoOrders() {
    const state = this.getState();
    if (state.orders.some(order => order.isDemo)) return 0;
    const samples = [
      { tenantId:"smak", name:"María Fernanda López", address:"Col. Palmira, Tegucigalpa", phone:"+504 9876-1204", daysAgo:0 },
      { tenantId:"smak", name:"Carlos Mendoza", address:"Residencial Las Uvas, Comayagüela", phone:"+504 9452-6810", daysAgo:1 },
      { tenantId:"smak", name:"Andrea Pineda", address:"Barrio El Centro, San Pedro Sula", phone:"+504 9981-3472", daysAgo:2 },
      { tenantId:"calzado", name:"José David Rivera", address:"Col. Trejo, San Pedro Sula", phone:"+504 9630-1175", daysAgo:0 },
      { tenantId:"calzado", name:"Sofía Castellanos", address:"Barrio Río de Piedras, San Pedro Sula", phone:"+504 9714-8206", daysAgo:1 },
      { tenantId:"calzado", name:"Daniela Flores", address:"Col. Kennedy, Tegucigalpa", phone:"+504 8890-5316", daysAgo:3 }
    ];
    for (const sample of samples) {
      const tenant = state.tenants[sample.tenantId];
      state.orders.push({ id:crypto.randomUUID(), tenantId:sample.tenantId, name:sample.name, address:sample.address, phone:sample.phone, productName:tenant.product.name, total:Number(tenant.product.salePrice), isDemo:true, createdAt:new Date(Date.now()-sample.daysAgo*86400000).toISOString() });
    }
    this.write(state);
    return samples.length;
  }
}
StorageFacade.initialize();
