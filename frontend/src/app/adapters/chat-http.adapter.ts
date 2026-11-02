import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
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
import { environment } from '../../environments/environment';
import { ChatLocalStorageAdapter } from './chat-localstorage.adapter';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl
});

/**
 * Adaptador Remoto HTTP (Producción / Integración).
 * Conecta directamente contra la API REST Hexagonal de Spring Boot,
 * con fallback transparente a LocalStorage si el backend no está disponible.
 */
@Injectable()
export class ChatHttpAdapter implements ChatWidgetRepositoryPort {

  private readonly localFallback: ChatLocalStorageAdapter;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string
  ) {
    this.localFallback = new ChatLocalStorageAdapter();
  }

  private getHeaders(tenantId: string, sessionId?: string): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenantId
    });
    if (sessionId) {
      headers = headers.set('X-Session-ID', sessionId);
    }
    return headers;
  }

  // ==========================================
  // CHAT WIDGET
  // ==========================================
  sendMessage(tenantId: string, sessionId: string, message: string, location?: LocationPayload): Observable<BotResponseDTO> {
    const headers = this.getHeaders(tenantId, sessionId);
    const body = {
      tenantId,
      sessionId,
      message,
      location: location ? {
        lat: location.lat,
        lng: location.lng,
        address: location.address
      } : null
    };

    return this.http.post<BotResponseDTO>(`${this.baseUrl}/api/v1/chat/message`, body, { headers }).pipe(
      catchError(() => this.localFallback.sendMessage(tenantId, sessionId, message, location))
    );
  }

  trackOrder(tenantId: string, code: string): Observable<OrderDTO> {
    const headers = this.getHeaders(tenantId);
    return this.http.get<OrderDTO>(`${this.baseUrl}/api/v1/chat/tracking/${encodeURIComponent(code)}`, { headers }).pipe(
      catchError(() => this.localFallback.trackOrder(tenantId, code))
    );
  }

  resetSession(tenantId: string, sessionId: string): Observable<void> {
    const headers = this.getHeaders(tenantId, sessionId);
    return this.http.post<void>(`${this.baseUrl}/api/v1/chat/reset`, {}, { headers }).pipe(
      catchError(() => this.localFallback.resetSession(tenantId, sessionId))
    );
  }

  // ==========================================
  // TENANTS
  // ==========================================
  getTenants(): Observable<TenantDTO[]> {
    return this.localFallback.getTenants();
  }

  // ==========================================
  // PRODUCTS
  // ==========================================
  listAdminProducts(tenantId: string): Observable<ProductDTO[]> {
    const headers = this.getHeaders(tenantId);
    return this.http.get<ProductDTO[]>(`${this.baseUrl}/api/v1/admin/products`, { headers }).pipe(
      catchError(() => this.localFallback.listAdminProducts(tenantId))
    );
  }

  saveProduct(tenantId: string, product: ProductDTO): Observable<ProductDTO> {
    const headers = this.getHeaders(tenantId);
    if (product.id && !product.id.startsWith('prod-')) {
      return this.http.put<ProductDTO>(`${this.baseUrl}/api/v1/admin/products/${product.id}`, product, { headers }).pipe(
        catchError(() => this.localFallback.saveProduct(tenantId, product))
      );
    }
    return this.http.post<ProductDTO>(`${this.baseUrl}/api/v1/admin/products`, product, { headers }).pipe(
      catchError(() => this.localFallback.saveProduct(tenantId, product))
    );
  }

  deleteProduct(tenantId: string, productId: string): Observable<void> {
    const headers = this.getHeaders(tenantId);
    return this.http.delete<void>(`${this.baseUrl}/api/v1/admin/products/${productId}`, { headers }).pipe(
      catchError(() => this.localFallback.deleteProduct(tenantId, productId))
    );
  }

  // ==========================================
  // RULES
  // ==========================================
  listAdminRules(tenantId: string): Observable<RuleDTO[]> {
    const headers = this.getHeaders(tenantId);
    return this.http.get<RuleDTO[]>(`${this.baseUrl}/api/v1/admin/rules`, { headers }).pipe(
      catchError(() => this.localFallback.listAdminRules(tenantId))
    );
  }

  saveRule(tenantId: string, rule: RuleDTO): Observable<RuleDTO> {
    const headers = this.getHeaders(tenantId);
    return this.http.post<RuleDTO>(`${this.baseUrl}/api/v1/admin/rules`, rule, { headers }).pipe(
      catchError(() => this.localFallback.saveRule(tenantId, rule))
    );
  }

  toggleRule(tenantId: string, ruleId: string): Observable<void> {
    const headers = this.getHeaders(tenantId);
    return this.http.patch<void>(`${this.baseUrl}/api/v1/admin/rules/${ruleId}/toggle`, {}, { headers }).pipe(
      catchError(() => this.localFallback.toggleRule(tenantId, ruleId))
    );
  }

  deleteRule(tenantId: string, ruleId: string): Observable<void> {
    const headers = this.getHeaders(tenantId);
    return this.http.delete<void>(`${this.baseUrl}/api/v1/admin/rules/${ruleId}`, { headers }).pipe(
      catchError(() => this.localFallback.deleteRule(tenantId, ruleId))
    );
  }

  // ==========================================
  // SYNONYMS
  // ==========================================
  getAdminSynonyms(tenantId: string): Observable<{ [concept: string]: string[] }> {
    const headers = this.getHeaders(tenantId);
    return this.http.get<{ [concept: string]: string[] }>(`${this.baseUrl}/api/v1/admin/synonyms`, { headers }).pipe(
      catchError(() => this.localFallback.getAdminSynonyms(tenantId))
    );
  }

  saveSynonymGroup(tenantId: string, concept: string, words: string[]): Observable<void> {
    const headers = this.getHeaders(tenantId);
    const body = { concept, words };
    return this.http.post<void>(`${this.baseUrl}/api/v1/admin/synonyms`, body, { headers }).pipe(
      catchError(() => this.localFallback.saveSynonymGroup(tenantId, concept, words))
    );
  }

  deleteSynonymGroup(tenantId: string, concept: string): Observable<void> {
    const headers = this.getHeaders(tenantId);
    return this.http.delete<void>(`${this.baseUrl}/api/v1/admin/synonyms/${encodeURIComponent(concept)}`, { headers }).pipe(
      catchError(() => this.localFallback.deleteSynonymGroup(tenantId, concept))
    );
  }

  // ==========================================
  // CAMPAIGNS
  // ==========================================
  listAdminCampaigns(tenantId: string): Observable<CampaignDTO[]> {
    const headers = this.getHeaders(tenantId);
    return this.http.get<CampaignDTO[]>(`${this.baseUrl}/api/v1/admin/campaigns`, { headers }).pipe(
      catchError(() => this.localFallback.listAdminCampaigns(tenantId))
    );
  }

  saveCampaign(tenantId: string, campaign: CampaignDTO): Observable<CampaignDTO> {
    const headers = this.getHeaders(tenantId);
    return this.http.post<CampaignDTO>(`${this.baseUrl}/api/v1/admin/campaigns`, campaign, { headers }).pipe(
      catchError(() => this.localFallback.saveCampaign(tenantId, campaign))
    );
  }

  deleteCampaign(tenantId: string, campaignId: string): Observable<void> {
    const headers = this.getHeaders(tenantId);
    return this.http.delete<void>(`${this.baseUrl}/api/v1/admin/campaigns/${campaignId}`, { headers }).pipe(
      catchError(() => this.localFallback.deleteCampaign(tenantId, campaignId))
    );
  }

  // ==========================================
  // ORDERS
  // ==========================================
  listAdminOrders(tenantId: string): Observable<OrderDTO[]> {
    const headers = this.getHeaders(tenantId);
    return this.http.get<OrderDTO[]>(`${this.baseUrl}/api/v1/admin/orders`, { headers }).pipe(
      catchError(() => this.localFallback.listAdminOrders(tenantId))
    );
  }

  updateOrderStatus(tenantId: string, orderId: string, status: string, trackingNumber?: string, carrier?: string): Observable<OrderDTO> {
    const headers = this.getHeaders(tenantId);
    const body = {
      status,
      trackingNumber,
      trackingCarrier: carrier || 'Cargo Expreso'
    };

    return this.http.patch<OrderDTO>(`${this.baseUrl}/api/v1/admin/orders/${orderId}/status`, body, { headers }).pipe(
      catchError(() => this.localFallback.updateOrderStatus(tenantId, orderId, status, trackingNumber, carrier))
    );
  }

  seedDemoOrders(tenantId: string): Observable<OrderDTO[]> {
    return this.localFallback.seedDemoOrders(tenantId);
  }

  // ==========================================
  // SIMULATOR & RESET
  // ==========================================
  testSimulator(tenantId: string, query: string): Observable<{ detectedRule: string; detectedSku?: string; replyText: string }> {
    return this.localFallback.testSimulator(tenantId, query);
  }

  resetDemoData(tenantId: string): Observable<void> {
    return this.localFallback.resetDemoData(tenantId);
  }
}
