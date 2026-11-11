import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ChatWidgetRepositoryPort } from '../ports/chat-widget.repository.port';
import {
  BotResponseDTO,
  CampaignDTO,
  LocationPayload,
  OrderDTO,
  ProductDTO,
  RuleDTO,
  TenantDTO
} from '../models/chat.models';
import { INITIAL_TENANTS, STORAGE_KEY } from '../data/seed-data';

interface StorageState {
  activeTenantId: string;
  tenants: {
    [tenantId: string]: {
      id: string;
      name: string;
      category: string;
      initials?: string;
      accent?: string;
      products: ProductDTO[];
      rules: RuleDTO[];
      synonyms: { [concept: string]: string[] };
      campaigns: CampaignDTO[];
    };
  };
  orders: OrderDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatLocalStorageAdapter implements ChatWidgetRepositoryPort {

  private readonly STORAGE_SESSION_KEY = 'smakbot_mock_session_';

  constructor() {
    this.ensureInitialized();
  }

  // ---- HELPER: MAP TENANT ALIASES ----
  private normalizeTenantId(tenantId: string): string {
    if (!tenantId) return 'smak';
    const lower = tenantId.toLowerCase();
    if (lower === 'tenant-hn-muebles' || lower === 'smak') return 'smak';
    if (lower === 'tenant-hn-calzado' || lower === 'calzado') return 'calzado';
    return lower;
  }

  // ---- PERSISTENCE ENGINE ----
  private readStorage(): StorageState {
    if (typeof localStorage === 'undefined') {
      return this.buildDefaultState();
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.tenants?.smak && Array.isArray(parsed.tenants.smak.products) && parsed.tenants.smak.products.length >= 10) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading localStorage, rebuilding initial state', e);
    }
    const fresh = this.buildDefaultState();
    this.writeStorage(fresh);
    return fresh;
  }

  private writeStorage(state: StorageState): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }

  private ensureInitialized(): void {
    this.readStorage();
  }

  private buildDefaultState(): StorageState {
    const tenantsMap: { [id: string]: any } = {};
    INITIAL_TENANTS.forEach(t => {
      tenantsMap[t.id] = JSON.parse(JSON.stringify(t));
    });

    const initialOrders: OrderDTO[] = [
      {
        id: 'ord-smak-1001',
        tenantId: 'smak',
        orderNumber: 'SMAK-ORD-1001',
        customerName: 'María Fernanda López',
        customerPhone: '+504 9876-1204',
        deliveryAddress: 'Col. Palmira, Tegucigalpa',
        productSku: 'SKM-955-CA-NE',
        productName: 'Silla Gamer Rom CA Negro/Negro',
        quantity: 1,
        unitPrice: 3190,
        total: 3190,
        status: 'PENDIENTE',
        requiresInvoice: true,
        rtn: '08011985123456',
        businessName: 'María Fernanda López S. de R.L.',
        trackingNumber: undefined,
        trackingCarrier: 'Cargo Expreso',
        createdAt: new Date().toISOString(),
        location: { lat: 14.1025, lng: -87.1950, address: 'Col. Palmira, Tegucigalpa' },
        audit: {
          ip: '190.92.112.45 (Tegucigalpa, HN)',
          source: 'whatsapp_bot',
          createdAt: new Date().toISOString(),
          history: [
            { action: 'creacion_pedido', status: 'PENDIENTE', timestamp: new Date().toISOString(), note: 'Pedido creado desde WhatsApp con RTN.' }
          ]
        }
      },
      {
        id: 'ord-smak-1002',
        tenantId: 'smak',
        orderNumber: 'SMAK-ORD-1002',
        customerName: 'Carlos Mendoza',
        customerPhone: '+504 9452-6810',
        deliveryAddress: 'Residencial Las Uvas, Comayagüela',
        productSku: 'SKM-959-CA-NE',
        productName: 'Sillón Ejecutivo Miles Negro con Apoyapiés',
        quantity: 1,
        unitPrice: 3390,
        total: 3390,
        status: 'EN_CAMINO',
        requiresInvoice: false,
        trackingNumber: 'CAEX-HN-948210',
        trackingCarrier: 'Cargo Expreso',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        location: { lat: 14.0480, lng: -87.2180, address: 'Residencial Las Uvas, Comayagüela' },
        audit: {
          ip: '190.92.112.45',
          source: 'landing_page_widget',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          history: [
            { action: 'creacion_pedido', status: 'PENDIENTE', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Pedido creado' },
            { action: 'despacho_caex', status: 'EN_CAMINO', timestamp: new Date().toISOString(), note: 'Guía CAEX-HN-948210 asignada.' }
          ]
        }
      },
      {
        id: 'ord-smak-1003',
        tenantId: 'smak',
        orderNumber: 'SMAK-ORD-1003',
        customerName: 'Andrea Pineda',
        customerPhone: '+504 9981-3472',
        deliveryAddress: 'Barrio El Centro, San Pedro Sula',
        productSku: 'ZGS-946-120x30x180',
        productName: 'Estantería de Metal y Madera 120×30×180cm',
        quantity: 1,
        unitPrice: 2850,
        total: 2850,
        status: 'ENTREGADO',
        requiresInvoice: false,
        trackingNumber: 'CAEX-HN-881290',
        trackingCarrier: 'Cargo Expreso',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        location: { lat: 15.5030, lng: -88.0260, address: 'Barrio El Centro, San Pedro Sula' },
        audit: {
          ip: '181.115.12.8',
          source: 'landing_page_widget',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          history: [
            { action: 'creacion_pedido', status: 'PENDIENTE', timestamp: new Date(Date.now() - 172800000).toISOString(), note: 'Pedido creado' },
            { action: 'entrega_completada', status: 'ENTREGADO', timestamp: new Date().toISOString(), note: 'Entregado por CAEX.' }
          ]
        }
      },
      {
        id: 'ord-smak-1004',
        tenantId: 'smak',
        orderNumber: 'SMAK-ORD-1004',
        customerName: 'Roberto Cálix',
        customerPhone: '+504 9711-4402',
        deliveryAddress: 'Col. El Toronjal, La Ceiba',
        productSku: 'SKM-953-NE-MP',
        productName: 'Taburete Tolix Negro con Respaldo y Asiento de Madera',
        quantity: 4,
        unitPrice: 1250,
        total: 5000,
        status: 'ENTREGADO',
        requiresInvoice: true,
        rtn: '08011990445566',
        businessName: 'Inversiones Cálix S. de R.L.',
        trackingNumber: 'CAEX-HN-881291',
        trackingCarrier: 'Cargo Expreso',
        createdAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 'ord-smak-1005',
        tenantId: 'smak',
        orderNumber: 'SMAK-ORD-1005',
        customerName: 'Elena Ramos',
        customerPhone: '+504 8820-9150',
        deliveryAddress: 'Lomas del Guijarro, Tegucigalpa',
        productSku: 'ZGM-032-NENE',
        productName: 'Juego 2 Mesas Redondas Auxiliares Mármol Negro Doncaster',
        quantity: 1,
        unitPrice: 2450,
        total: 2450,
        status: 'ENTREGADO',
        requiresInvoice: false,
        trackingNumber: 'CAEX-HN-881292',
        trackingCarrier: 'Cargo Expreso',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        location: { lat: 14.0980, lng: -87.1850, address: 'Lomas del Guijarro, Tegucigalpa' }
      },
      {
        id: 'ord-smak-1006',
        tenantId: 'smak',
        orderNumber: 'SMAK-ORD-1006',
        customerName: 'David Banegas',
        customerPhone: '+504 9500-3321',
        deliveryAddress: 'Col. Los Álamos, San Pedro Sula',
        productSku: 'ZGS-943-120x60x75',
        productName: 'Escritorio de Madera y Hierro 120×60×75cm',
        quantity: 1,
        unitPrice: 2250,
        total: 2250,
        status: 'ENTREGADO',
        requiresInvoice: false,
        trackingNumber: 'CAEX-HN-881293',
        trackingCarrier: 'Cargo Expreso',
        createdAt: new Date(Date.now() - 432000000).toISOString()
      }
    ];

    return {
      activeTenantId: 'smak',
      tenants: tenantsMap,
      orders: initialOrders
    };
  }

  // ==========================================
  // TENANTS MANAGEMENT
  // ==========================================
  getTenants(): Observable<TenantDTO[]> {
    const state = this.readStorage();
    const list: TenantDTO[] = Object.values(state.tenants).map((t: any) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      initials: t.initials || t.name.charAt(0),
      accent: t.accent || '#0e7a62'
    }));
    return of(list);
  }

  // ==========================================
  // PRODUCTS MANAGEMENT (CATÁLOGO MULTI-SKU)
  // ==========================================
  listAdminProducts(tenantId: string): Observable<ProductDTO[]> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const prods = state.tenants[tid]?.products || [];
    return of([...prods]).pipe(delay(150));
  }

  saveProduct(tenantId: string, product: ProductDTO): Observable<ProductDTO> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    if (!tenant) throw new Error(`Tenant ${tid} no encontrado`);

    if (!tenant.products) tenant.products = [];

    let target = product;
    if (!target.id) {
      target.id = 'prod-' + Math.random().toString(36).slice(2, 9) + '-' + Date.now();
      target.active = target.active !== undefined ? target.active : true;
      tenant.products.unshift(target);
    } else {
      const idx = tenant.products.findIndex(p => p.id === target.id || p.sku === target.sku);
      if (idx !== -1) {
        tenant.products[idx] = { ...tenant.products[idx], ...target };
        target = tenant.products[idx];
      } else {
        tenant.products.unshift(target);
      }
    }

    this.writeStorage(state);
    return of({ ...target }).pipe(delay(100));
  }

  deleteProduct(tenantId: string, productId: string): Observable<void> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    if (tenant && tenant.products) {
      tenant.products = tenant.products.filter(p => p.id !== productId && p.sku !== productId);
      this.writeStorage(state);
    }
    return of(void 0).pipe(delay(100));
  }

  // ==========================================
  // RULES MANAGEMENT (PREGUNTAS, RESPUESTAS Y REGLAS)
  // ==========================================
  listAdminRules(tenantId: string): Observable<RuleDTO[]> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const rules = state.tenants[tid]?.rules || [];
    return of([...rules]).pipe(delay(150));
  }

  saveRule(tenantId: string, rule: RuleDTO): Observable<RuleDTO> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    if (!tenant) throw new Error(`Tenant ${tid} no encontrado`);

    if (!tenant.rules) tenant.rules = [];

    let target = rule;
    if (!target.id) {
      target.id = 'rule-' + Math.random().toString(36).slice(2, 9);
      target.enabled = target.enabled !== undefined ? target.enabled : true;
      tenant.rules.unshift(target);
    } else {
      const idx = tenant.rules.findIndex(r => r.id === target.id);
      if (idx !== -1) {
        tenant.rules[idx] = { ...tenant.rules[idx], ...target };
        target = tenant.rules[idx];
      } else {
        tenant.rules.unshift(target);
      }
    }

    this.writeStorage(state);
    return of({ ...target }).pipe(delay(100));
  }

  toggleRule(tenantId: string, ruleId: string): Observable<void> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    if (tenant && tenant.rules) {
      const r = tenant.rules.find(x => x.id === ruleId);
      if (r) {
        r.enabled = !r.enabled;
        this.writeStorage(state);
      }
    }
    return of(void 0);
  }

  deleteRule(tenantId: string, ruleId: string): Observable<void> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    if (tenant && tenant.rules) {
      tenant.rules = tenant.rules.filter(r => r.id !== ruleId);
      this.writeStorage(state);
    }
    return of(void 0).pipe(delay(100));
  }

  // ==========================================
  // SYNONYMS MANAGEMENT (DICCIONARIO DE SINÓNIMOS)
  // ==========================================
  getAdminSynonyms(tenantId: string): Observable<{ [concept: string]: string[] }> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const syns = state.tenants[tid]?.synonyms || {};
    return of({ ...syns }).pipe(delay(150));
  }

  saveSynonymGroup(tenantId: string, concept: string, words: string[]): Observable<void> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    if (tenant) {
      if (!tenant.synonyms) tenant.synonyms = {};
      const key = concept.trim().toLowerCase();
      tenant.synonyms[key] = Array.from(new Set(words.map(w => w.trim()).filter(Boolean)));
      this.writeStorage(state);
    }
    return of(void 0).pipe(delay(100));
  }

  deleteSynonymGroup(tenantId: string, concept: string): Observable<void> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    if (tenant && tenant.synonyms) {
      delete tenant.synonyms[concept.toLowerCase()];
      this.writeStorage(state);
    }
    return of(void 0).pipe(delay(100));
  }

  // ==========================================
  // CAMPAIGNS & REDES SOCIALES
  // ==========================================
  listAdminCampaigns(tenantId: string): Observable<CampaignDTO[]> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const camps = state.tenants[tid]?.campaigns || [];
    return of([...camps]).pipe(delay(150));
  }

  saveCampaign(tenantId: string, campaign: CampaignDTO): Observable<CampaignDTO> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    if (!tenant) throw new Error(`Tenant ${tid} no encontrado`);

    if (!tenant.campaigns) tenant.campaigns = [];

    let target = campaign;
    if (!target.id) {
      target.id = 'camp-' + Math.random().toString(36).slice(2, 9);
      tenant.campaigns.unshift(target);
    } else {
      const idx = tenant.campaigns.findIndex(c => c.id === target.id);
      if (idx !== -1) {
        tenant.campaigns[idx] = { ...tenant.campaigns[idx], ...target };
        target = tenant.campaigns[idx];
      } else {
        tenant.campaigns.unshift(target);
      }
    }

    this.writeStorage(state);
    return of({ ...target }).pipe(delay(100));
  }

  deleteCampaign(tenantId: string, campaignId: string): Observable<void> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    if (tenant && tenant.campaigns) {
      tenant.campaigns = tenant.campaigns.filter(c => c.id !== campaignId);
      this.writeStorage(state);
    }
    return of(void 0).pipe(delay(100));
  }

  // ==========================================
  // ORDERS MANAGEMENT
  // ==========================================
  listAdminOrders(tenantId: string): Observable<OrderDTO[]> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const orders = state.orders.filter(o => !o.tenantId || this.normalizeTenantId(o.tenantId) === tid);
    return of([...orders]).pipe(delay(150));
  }

  updateOrderStatus(tenantId: string, orderId: string, status: string, trackingNumber?: string, carrier?: string, cancellationReason?: string): Observable<OrderDTO> {
    const state = this.readStorage();
    const order = state.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) {
      throw new Error(`Orden ${orderId} no encontrada`);
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.trackingCarrier = carrier;
    if (cancellationReason) {
      order.cancellationReason = cancellationReason;
      order.cancelledBy = 'ADMIN';
      order.cancelledAt = new Date().toISOString();
    }

    if (!order.audit) {
      order.audit = { history: [] };
    }
    if (!order.audit.history) {
      order.audit.history = [];
    }
    order.audit.history.push({
      action: status === 'CANCELADO' ? 'CANCELLED' : 'STATUS_UPDATED',
      status: status,
      timestamp: new Date().toISOString(),
      note: status === 'CANCELADO'
        ? `Pedido cancelado. Motivo: ${cancellationReason || 'Sin motivo'}`
        : `Estado cambiado a ${status}. Guía: ${trackingNumber || 'Sin guía'}`
    });

    this.writeStorage(state);
    return of({ ...order }).pipe(delay(150));
  }

  seedDemoOrders(tenantId: string): Observable<OrderDTO[]> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const freshState = this.buildDefaultState();
    const sampleOrders = freshState.orders.filter(o => !o.tenantId || this.normalizeTenantId(o.tenantId) === tid);

    // Merge without duplicating by orderNumber
    sampleOrders.forEach(sample => {
      if (!state.orders.some(o => o.orderNumber === sample.orderNumber)) {
        state.orders.push(sample);
      }
    });

    this.writeStorage(state);
    return this.listAdminOrders(tenantId);
  }

  // ==========================================
  // SIMULATOR / TESTER EN VIVO
  // ==========================================
  testSimulator(tenantId: string, query: string): Observable<{ detectedRule: string; detectedSku?: string; replyText: string }> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const tenant = state.tenants[tid];
    const products: ProductDTO[] = tenant?.products || [];
    const rules: RuleDTO[] = tenant?.rules || [];
    const campaigns: CampaignDTO[] = tenant?.campaigns || [];
    const raw = query.trim().toLowerCase();

    // 1. Detect SKU in query or campaigns
    let detectedSku: string | undefined;
    let detectedProduct: ProductDTO | undefined;

    // Check campaigns URLs / IDs
    for (const c of campaigns) {
      if ((c.url && raw.includes(c.url.toLowerCase())) || (c.sourceId && raw.includes(c.sourceId.toLowerCase()))) {
        detectedSku = c.sku;
        break;
      }
    }

    // Check direct SKU or keywords
    if (!detectedSku) {
      for (const p of products) {
        const skuNormalized = p.sku.toLowerCase();
        if (raw.includes(skuNormalized) || raw.includes(skuNormalized.replace(/-/g, ' '))) {
          detectedSku = p.sku;
          detectedProduct = p;
          break;
        }
      }
    }

    if (detectedSku && !detectedProduct) {
      detectedProduct = products.find(p => p.sku.toLowerCase() === detectedSku?.toLowerCase());
    }

    // 2. Rule evaluation
    let detectedRuleName = 'Respuesta General / Fallback';
    let reply = '';

    // Check SKU parametric rule first if SKU detected
    if (detectedSku) {
      const skuRule = rules.find(r => r.type === 'parametric' && r.enabled);
      if (skuRule) {
        detectedRuleName = `Consulta de Stock Paramétrica (${skuRule.name})`;
        if (detectedProduct) {
          const stock = detectedProduct.stock || 0;
          if (stock > 0) {
            reply = (skuRule.responseInStock || '¡Sí, tenemos disponible! Del SKU **{sku}** ({name}) nos quedan **{stock} unidades** a precio L.{salePrice}.')
              .replace(/\{sku\}/g, detectedProduct.sku)
              .replace(/\{name\}/g, detectedProduct.name)
              .replace(/\{stock\}/g, String(stock))
              .replace(/\{salePrice\}/g, String(detectedProduct.salePrice));
          } else {
            reply = (skuRule.responseOutOfStock || 'El producto **{name}** (SKU: {sku}) se encuentra actualmente **agotado**.')
              .replace(/\{sku\}/g, detectedProduct.sku)
              .replace(/\{name\}/g, detectedProduct.name);
          }
        } else {
          reply = (skuRule.responseNotFound || 'No encontramos ningún producto con el SKU **{sku}** en el catálogo.')
            .replace(/\{sku\}/g, detectedSku);
        }
        return of({ detectedRule: detectedRuleName, detectedSku, replyText: reply }).pipe(delay(200));
      }
    }

    // Check other rules by trainingPhrases
    for (const rule of rules) {
      if (!rule.enabled) continue;
      const phrases = rule.trainingPhrases || [];
      const match = phrases.some(ph => {
        const norm = ph.trim().toLowerCase().replace(/\{sku\}/g, '');
        return norm.length > 2 && raw.includes(norm);
      });

      if (match) {
        detectedRuleName = `${rule.name} [Categoría: ${rule.category}]`;
        reply = rule.response || 'Información disponible en tienda.';
        return of({ detectedRule: detectedRuleName, detectedSku, replyText: reply }).pipe(delay(200));
      }
    }

    // Fallback response
    reply = `Hola, con gusto te atendemos en **${tenant?.name || 'nuestra tienda'}**. ¿Deseas consultar sobre nuestro catálogo de ${products.length} productos, disponibilidad o realizar tu pedido?`;
    return of({ detectedRule: detectedRuleName, detectedSku, replyText: reply }).pipe(delay(200));
  }

  // ==========================================
  // RESET DEMO TO FACTORY
  // ==========================================
  resetDemoData(tenantId: string): Observable<void> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const fresh = this.buildDefaultState();
    if (fresh.tenants[tid]) {
      state.tenants[tid] = fresh.tenants[tid];
      state.orders = fresh.orders;
      this.writeStorage(state);
    }
    return of(void 0).pipe(delay(250));
  }

  // ==========================================
  // CHAT INTERACTION (WIDGET RUNTIME)
  // ==========================================
  sendMessage(tenantId: string, sessionId: string, message: string, location?: LocationPayload): Observable<BotResponseDTO> {
    const tid = this.normalizeTenantId(tenantId);
    const raw = (message || '').trim().toLowerCase();
    const storageKey = this.STORAGE_SESSION_KEY + sessionId;
    let step = typeof localStorage !== 'undefined' ? (localStorage.getItem(storageKey) || 'IDLE') : 'IDLE';

    const state = this.readStorage();
    const tenant = state.tenants[tid];
    const products = tenant?.products || [];
    const firstProduct = products[0] || {
      sku: 'SKM-955-CA-NE',
      name: 'Silla Gamer Rom CA Negro/Negro',
      salePrice: 3190
    };

    let replyText = '';
    let nextStep = step;
    let productSummary = {
      sku: firstProduct.sku,
      name: firstProduct.name,
      salePrice: firstProduct.salePrice,
      dimensions: firstProduct.dimensions,
      colors: firstProduct.colors,
      imageUrl: firstProduct.images?.[0]
    };
    let orderSummary: any = null;
    let buttons: any[] = [];

    if (location) {
      replyText = `¡Ubicación detectada! 📍 Veo que te encuentras en **${location.address || 'Honduras'}**.\n\n🚚 Cobertura total a domicilio con Cargo Expreso. Pago contra entrega en efectivo.`;
      nextStep = 'PHONE';
    } else if (raw.includes('hola') || raw.includes('buenas')) {
      replyText = `¡Hola! 👋 Bienvenido a la tienda oficial de **${tenant?.name || 'SMAK Muebles'}** en Honduras.\n\nPuedes consultarme por modelos, precios, colores disponibles o hacer tu pedido con pago contra entrega.`;
      nextStep = 'IDLE';
    } else if (raw.includes('precio') || raw.includes('cuesta')) {
      replyText = `🏷️ **${firstProduct.name}**\n• Precio de oferta: **L.${firstProduct.salePrice.toLocaleString('es-HN')}** (Regular: ~~L.${(firstProduct.regularPrice || firstProduct.salePrice + 400).toLocaleString('es-HN')}~~)\n• Envío: Gratis por Cargo Expreso.\n\n¿Deseas pedir la tuya ahora?`;
      nextStep = 'IDLE';
    } else if (raw.includes('comprar') || raw.includes('ordenar') || raw.includes('pedido')) {
      replyText = `¡Excelente elección! Preparo tu orden para **${firstProduct.name}** (L.${firstProduct.salePrice}). ¿A qué nombre registramos tu pedido?`;
      nextStep = 'NAME';
    } else if (step === 'NAME') {
      replyText = `Gracias, **${message}**. ¿Cuántas unidades deseas ordenar? (Ejemplo: 1 o 2):`;
      nextStep = 'QUANTITY';
    } else if (step === 'QUANTITY') {
      const q = parseInt(message, 10) || 1;
      const total = firstProduct.salePrice * q;
      replyText = `Anotado: **${q} unidades** (Total: L.${total.toLocaleString('es-HN')}).\n\n🚚 Compártenos tu dirección de entrega en Honduras (Colonia, calle/casa y ciudad) o pulsa 📍 para compartir GPS:`;
      nextStep = 'ADDRESS';
    } else if (step === 'ADDRESS') {
      replyText = `¡Dirección registrada! 📦\n\n📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega con Cargo Expreso?`;
      nextStep = 'PHONE';
    } else if (step === 'PHONE') {
      replyText = `Teléfono registrado: **${message}** 📞\n\n¿Requieres factura con RTN para tu pedido? (Responde *Sí* o *No*):`;
      nextStep = 'REQUIRES_INVOICE';
    } else if (step === 'REQUIRES_INVOICE') {
      replyText = `📋 **Resumen de tu pedido**:\n• Producto: **${firstProduct.name}**\n• Total a pagar: **L.${firstProduct.salePrice.toLocaleString('es-HN')}**\n• Pago: Efectivo contra entrega\n\nPresiona el botón para confirmar:`;
      nextStep = 'CONFIRM';
      buttons = [{ id: 'btn_confirm', title: '¡Sí, confirmo el pedido!', payload: 'CONFIRM_ORDER' }];
    } else if (step === 'CONFIRM' && (raw.includes('si') || raw.includes('confirmo'))) {
      const orderNum = `SMAK-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: OrderDTO = {
        id: 'ord-' + Date.now(),
        tenantId: tid,
        orderNumber: orderNum,
        customerName: 'Cliente Chat',
        customerPhone: '+504 9988-7766',
        deliveryAddress: 'Tegucigalpa, Honduras',
        productSku: firstProduct.sku,
        productName: firstProduct.name,
        quantity: 1,
        unitPrice: firstProduct.salePrice,
        total: firstProduct.salePrice,
        status: 'PENDIENTE',
        trackingNumber: `CAEX-HN-${Math.floor(100000 + Math.random() * 900000)}`,
        trackingCarrier: 'Cargo Expreso',
        createdAt: new Date().toISOString()
      };
      state.orders.unshift(newOrder);
      this.writeStorage(state);

      replyText = `¡Muchas gracias! 🎉 Tu pedido **${newOrder.orderNumber}** ha quedado formalmente registrado con guía Cargo Expreso **${newOrder.trackingNumber}**.`;
      nextStep = 'IDLE';
      orderSummary = {
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        deliveryAddress: newOrder.deliveryAddress,
        productSku: newOrder.productSku,
        productName: newOrder.productName,
        quantity: newOrder.quantity,
        total: newOrder.total,
        status: newOrder.status,
        trackingNumber: newOrder.trackingNumber,
        trackingCarrier: newOrder.trackingCarrier
      };
    } else {
      replyText = `Con gusto te asesoro. Escribe *comprar* para iniciar tu orden o consulta por modelos y precios.`;
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, nextStep);
    }

    const response: BotResponseDTO = {
      text: replyText,
      step: nextStep,
      imageUrl: firstProduct.images?.[0],
      product: productSummary,
      order: orderSummary,
      buttons
    };

    return of(response).pipe(delay(250));
  }

  trackOrder(tenantId: string, code: string): Observable<OrderDTO> {
    const tid = this.normalizeTenantId(tenantId);
    const state = this.readStorage();
    const cleanCode = code.trim().toLowerCase();
    const found = state.orders.find(o =>
      (!o.tenantId || this.normalizeTenantId(o.tenantId) === tid) &&
      (o.orderNumber.toLowerCase() === cleanCode || (o.trackingNumber && o.trackingNumber.toLowerCase() === cleanCode))
    );

    if (found) {
      return of({ ...found }).pipe(delay(150));
    }

    return of({
      orderNumber: code,
      customerName: 'Cliente Demo',
      customerPhone: '+504 9876-5432',
      deliveryAddress: 'Colonia Palmira, Tegucigalpa',
      productSku: 'SKM-955-CA-NE',
      productName: 'Silla Gamer Rom CA',
      quantity: 1,
      unitPrice: 3190,
      total: 3190,
      status: 'EN_CAMINO',
      trackingNumber: 'CAEX-HN-948210',
      trackingCarrier: 'Cargo Expreso'
    }).pipe(delay(150));
  }

  resetSession(tenantId: string, sessionId: string): Observable<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_SESSION_KEY + sessionId);
    }
    return of(void 0);
  }
}
