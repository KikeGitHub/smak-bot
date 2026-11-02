import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { BotResponseDTO, CampaignDTO, LocationPayload, OrderDTO, ProductDTO, RuleDTO, TenantDTO } from '../models/chat.models';

/**
 * Puerto Abstracto del Patrón Bridge (SDOP Framework).
 * Permite que los componentes de la interfaz de usuario se comuniquen tanto
 * con el Backend HTTP de producción como con el simulador LocalStorage offline.
 */
export interface ChatWidgetRepositoryPort {
  /** Enviar mensaje o ubicación del usuario al motor comercial */
  sendMessage(tenantId: string, sessionId: string, message: string, location?: LocationPayload): Observable<BotResponseDTO>;

  /** Consultar estatus y guía de Cargo Expreso por código de orden o tracking */
  trackOrder(tenantId: string, code: string): Observable<OrderDTO>;

  /** Reiniciar la sesión de checkout actual */
  resetSession(tenantId: string, sessionId: string): Observable<void>;

  // ==========================================
  // SCOPE ADMINISTRATIVO (SaaS Backoffice)
  // ==========================================

  /** Listar comercios / tenants disponibles */
  getTenants(): Observable<TenantDTO[]>;

  /** Listar catálogo de productos del tenant */
  listAdminProducts(tenantId: string): Observable<ProductDTO[]>;

  /** Guardar (Crear o Modificar) un producto */
  saveProduct(tenantId: string, product: ProductDTO): Observable<ProductDTO>;

  /** Eliminar un producto del catálogo */
  deleteProduct(tenantId: string, productId: string): Observable<void>;

  /** Listar reglas y preguntas frecuentes */
  listAdminRules(tenantId: string): Observable<RuleDTO[]>;

  /** Guardar (Crear o Modificar) una regla */
  saveRule(tenantId: string, rule: RuleDTO): Observable<RuleDTO>;

  /** Alternar estado activo/inactivo de una regla */
  toggleRule(tenantId: string, ruleId: string): Observable<void>;

  /** Eliminar una regla */
  deleteRule(tenantId: string, ruleId: string): Observable<void>;

  /** Obtener el diccionario de sinónimos general */
  getAdminSynonyms(tenantId: string): Observable<{ [concept: string]: string[] }>;

  /** Guardar o actualizar un grupo de sinónimos */
  saveSynonymGroup(tenantId: string, concept: string, words: string[]): Observable<void>;

  /** Eliminar un grupo de sinónimos */
  deleteSynonymGroup(tenantId: string, concept: string): Observable<void>;

  /** Listar campañas y mapeos de redes sociales */
  listAdminCampaigns(tenantId: string): Observable<CampaignDTO[]>;

  /** Guardar (Crear o Modificar) un enlace o campaña */
  saveCampaign(tenantId: string, campaign: CampaignDTO): Observable<CampaignDTO>;

  /** Eliminar una campaña */
  deleteCampaign(tenantId: string, campaignId: string): Observable<void>;

  /** Listar pedidos registrados */
  listAdminOrders(tenantId: string): Observable<OrderDTO[]>;

  /** Actualizar estado y asignar guía CAEX */
  updateOrderStatus(tenantId: string, orderId: string, status: string, trackingNumber?: string, carrier?: string): Observable<OrderDTO>;

  /** Cargar pedidos demo de prueba */
  seedDemoOrders(tenantId: string): Observable<OrderDTO[]>;

  /** Probar el motor inteligente en vivo (Probador Sandbox) */
  testSimulator(tenantId: string, query: string): Observable<{ detectedRule: string; detectedSku?: string; replyText: string }>;

  /** Restablecer todos los datos demo de fábrica */
  resetDemoData(tenantId: string): Observable<void>;
}

export const CHAT_WIDGET_REPOSITORY_PORT = new InjectionToken<ChatWidgetRepositoryPort>('CHAT_WIDGET_REPOSITORY_PORT');
