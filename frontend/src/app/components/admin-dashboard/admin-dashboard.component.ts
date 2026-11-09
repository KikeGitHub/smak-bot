import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CHAT_WIDGET_REPOSITORY_PORT, ChatWidgetRepositoryPort } from '../../ports/chat-widget.repository.port';
import {
  CampaignDTO,
  OrderDTO,
  ProductDTO,
  RuleDTO,
  TenantDTO
} from '../../models/chat.models';

import { RouterModule } from '@angular/router';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  // Autenticación de Acceso Administrativo (Acceso directo para pruebas / demo)
  isAuthenticated: boolean = true;
  usernameInput: string = 'admin';
  passwordInput: string = 'admin123';
  loginError: string = '';

  // Tenant Activo (SMAK Muebles como principal)
  tenantId: string = 'smak';
  tenants: TenantDTO[] = [
    { id: 'smak', name: 'SMAK Muebles', category: 'Muebles y hogar', initials: 'S', accent: '#0e7a62' },
    { id: 'calzado', name: 'Calzado Express', category: 'Calzado y moda', initials: 'C', accent: '#2563eb' }
  ];
  activeTenant: TenantDTO = this.tenants[0];

  // Navegación por Módulos
  activeSection: 'catalogo' | 'preguntas' | 'campanas' | 'sinonimos' | 'simulador' | 'pedidos' = 'catalogo';

  // Datos del Negocio
  products: ProductDTO[] = [];
  rules: RuleDTO[] = [];
  synonyms: { [concept: string]: string[] } = {};
  campaigns: CampaignDTO[] = [];
  orders: OrderDTO[] = [];
  loading: boolean = false;

  // Filtro de Reglas
  ruleCategoryFilter: string = 'all';

  // ==========================================
  // TABLA Y PAGINACIÓN: PRODUCTOS (15, 30, 50)
  // ==========================================
  productSearchQuery: string = '';
  productStatusFilter: 'all' | 'active' | 'inactive' = 'all';
  productStockFilter: 'all' | 'in_stock' | 'out_of_stock' = 'all';
  productPageSize: number = 15;
  productCurrentPage: number = 1;

  // ==========================================
  // TABLA Y PAGINACIÓN: CAMPAÑAS (15, 30, 50)
  // ==========================================
  campaignSearchQuery: string = '';
  campaignPlatformFilter: string = 'all';
  campaignPageSize: number = 15;
  campaignCurrentPage: number = 1;

  // ==========================================
  // TABLA Y PAGINACIÓN: PEDIDOS (15, 30, 50)
  // ==========================================
  orderSearchQuery: string = '';
  orderStatusFilter: string = 'all';
  orderPageSize: number = 15;
  orderCurrentPage: number = 1;

  // Notificaciones Toast
  noticeMsg: string = '';
  noticeVisible: boolean = false;
  private noticeTimer: any = null;

  // Generador de Enlaces wa.me
  selectedSmartLinkSku: string = '';
  smartLinkPhone: string = '50498008559';
  smartLinkOutput: string = '';

  // Probador en Vivo (Simulator Sandbox)
  testerInput: string = '';
  testerResult: { rule: string; sku?: string; text: string } | null = null;
  isTesting: boolean = false;

  // MODAL: Producto
  isProductModalOpen: boolean = false;
  productModalTitle: string = 'Agregar Nuevo Producto';
  editingProduct: ProductDTO = this.getEmptyProduct();
  prodKeywordsText: string = '';
  prodImagesText: string = '';
  isDraggingFile: boolean = false;
  isUploadingImages: boolean = false;
  uploadStatusMessage: string = '';

  // MODAL: Regla
  isRuleModalOpen: boolean = false;
  ruleModalTitle: string = 'Crear Nueva Pregunta / Regla';
  editingRule: RuleDTO = this.getEmptyRule();
  rulePhrasesText: string = '';

  // MODAL: Sinónimo
  isSynonymModalOpen: boolean = false;
  newSynConcept: string = '';
  newSynWords: string = '';

  // MODAL: Campaña
  isCampaignModalOpen: boolean = false;
  editingCampaign: CampaignDTO = this.getEmptyCampaign();

  // MODAL: Despacho CAEX
  isDispatchModalOpen: boolean = false;
  selectedOrder: OrderDTO | null = null;
  newTrackingNumber: string = '';
  newCarrier: string = 'Cargo Expreso';
  newStatus: string = 'EN_CAMINO';
  dispatchPreviewMessage: string = '';

  // MODAL: Auditoría
  isAuditModalOpen: boolean = false;
  selectedAuditOrder: OrderDTO | null = null;

  currentUser: AuthUser | null = null;

  constructor(
    @Inject(CHAT_WIDGET_REPOSITORY_PORT) private readonly chatRepo: ChatWidgetRepositoryPort,
    public readonly authService: AuthService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    // Si el usuario es un administrador de tenant específico, fijar su tenant asignado
    if (this.currentUser && !this.authService.isSuperAdmin() && this.currentUser.tenantId) {
      this.tenantId = this.currentUser.tenantId;
    }

    this.loadTenants();
    this.loadAllData();
  }

  logout(): void {
    this.authService.logout();
  }

  loadTenants(): void {
    this.chatRepo.getTenants().subscribe({
      next: (tList) => {
        if (tList && tList.length) {
          this.tenants = tList;
          const current = this.tenants.find(t => t.id === this.tenantId);
          if (current) this.activeTenant = current;
        }
      }
    });
  }

  loadAllData(): void {
    this.loading = true;
    this.productCurrentPage = 1;
    this.campaignCurrentPage = 1;
    this.orderCurrentPage = 1;

    // Productos
    this.chatRepo.listAdminProducts(this.tenantId).subscribe({
      next: (data) => {
        this.products = data || [];
        if (!this.selectedSmartLinkSku && this.products.length > 0) {
          this.selectedSmartLinkSku = this.products[0].sku;
          this.updateSmartLink();
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    // Reglas
    this.chatRepo.listAdminRules(this.tenantId).subscribe({
      next: (data) => { this.rules = data || []; }
    });

    // Sinónimos
    this.chatRepo.getAdminSynonyms(this.tenantId).subscribe({
      next: (data) => { this.synonyms = data || {}; }
    });

    // Campañas
    this.chatRepo.listAdminCampaigns(this.tenantId).subscribe({
      next: (data) => { this.campaigns = data || []; }
    });

    // Pedidos
    this.chatRepo.listAdminOrders(this.tenantId).subscribe({
      next: (data) => { this.orders = data || []; }
    });
  }

  onTenantChange(newTenantId: string): void {
    this.tenantId = newTenantId;
    const found = this.tenants.find(t => t.id === newTenantId);
    if (found) this.activeTenant = found;
    this.selectedSmartLinkSku = '';
    this.testerResult = null;
    this.loadAllData();
    this.notify(`Comercio cambiado a ${this.activeTenant.name}`);
  }

  setSection(section: 'catalogo' | 'preguntas' | 'campanas' | 'sinonimos' | 'simulador' | 'pedidos'): void {
    this.activeSection = section;
  }

  notify(msg: string): void {
    this.noticeMsg = msg;
    this.noticeVisible = true;
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => {
      this.noticeVisible = false;
    }, 3500);
  }

  // ==========================================
  // PRODUCTOS: ALTA, MODIFICACIÓN, ACTIVACIÓN, ELIMINACIÓN
  // ==========================================
  getEmptyProduct(): ProductDTO {
    return {
      sku: '',
      name: '',
      regularPrice: 0,
      salePrice: 0,
      stock: 0,
      dimensions: '',
      weightLimit: '',
      colors: '',
      category: 'Sillas y Bancos',
      keywords: [],
      images: [],
      active: true
    };
  }

  openNewProductModal(): void {
    this.productModalTitle = 'Agregar Producto al Catálogo';
    this.editingProduct = this.getEmptyProduct();
    this.prodKeywordsText = '';
    this.prodImagesText = '';
    this.isProductModalOpen = true;
  }

  openEditProductModal(p: ProductDTO): void {
    this.productModalTitle = `Editar Producto: ${p.sku}`;
    this.editingProduct = { ...p };
    this.prodKeywordsText = (p.keywords || []).join(', ');
    this.prodImagesText = (p.images || []).join('\n');
    this.isProductModalOpen = true;
  }

  closeProductModal(): void {
    this.isProductModalOpen = false;
  }

  saveProductForm(): void {
    if (!this.editingProduct.sku || !this.editingProduct.name) {
      alert('Por favor ingrese el SKU y el nombre del producto.');
      return;
    }

    const keywords = this.prodKeywordsText
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const images = this.prodImagesText
      .split('\n')
      .map(img => img.trim())
      .filter(Boolean);

    const toSave: ProductDTO = {
      ...this.editingProduct,
      sku: this.editingProduct.sku.trim().toUpperCase(),
      keywords,
      images: images.length ? images : (this.editingProduct.images || [])
    };

    this.chatRepo.saveProduct(this.tenantId, toSave).subscribe({
      next: (saved) => {
        this.closeProductModal();
        this.loadAllData();
        this.notify(`Producto ${saved.sku} guardado exitosamente.`);
      }
    });
  }

  // ==========================================
  // CARGA DE IMÁGENES (FILE SYSTEM, PREVIEW Y DATA-URL)
  // ==========================================
  get productImagesList(): string[] {
    if (!this.prodImagesText) return [];
    return this.prodImagesText
      .split('\n')
      .map(url => url.trim())
      .filter(Boolean);
  }

  onImageFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.readAndAppendImageFiles(Array.from(input.files));
    input.value = '';
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      this.readAndAppendImageFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = false;
  }

  private readAndAppendImageFiles(files: File[]): void {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Por favor selecciona archivos de imagen válidos (PNG, JPG, WEBP, GIF, etc.)');
      return;
    }

    const currentUrls = [...this.productImagesList];
    if (currentUrls.length >= 5) {
      this.notify('Este producto ya cuenta con el máximo de 5 imágenes permitidas.');
      return;
    }

    const availableSlots = 5 - currentUrls.length;
    const filesToUpload = imageFiles.slice(0, availableSlots);
    if (imageFiles.length > availableSlots) {
      this.notify(`Solo se procesarán ${availableSlots} imagen(es) para respetar el límite de 5 fotos por producto.`);
    }

    this.isUploadingImages = true;
    this.uploadStatusMessage = `Subiendo ${filesToUpload.length} imagen(es) a Cloudinary (/smak/products)...`;

    const baseUrl = environment.apiBaseUrl || '';
    const uploadEndpoint = `${baseUrl}/api/v1/images/upload`;

    let completed = 0;
    filesToUpload.forEach((file, idx) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sku', this.editingProduct.sku || 'prod');
      formData.append('index', String(currentUrls.length + idx));
      formData.append('folder', 'products');

      this.http.post<any>(uploadEndpoint, formData).subscribe({
        next: (res) => {
          completed++;
          if (res && res.url) {
            currentUrls.push(res.url);
            this.prodImagesText = currentUrls.join('\n');
          }
          if (completed === filesToUpload.length) {
            this.isUploadingImages = false;
            this.uploadStatusMessage = '';
            this.notify(`${filesToUpload.length} imagen(es) subida(s) a Cloudinary (/smak/products).`);
          }
        },
        error: (err) => {
          console.warn('Error al subir a Cloudinary, guardando como respaldo local:', err);
          const reader = new FileReader();
          reader.onload = (e) => {
            completed++;
            if (e.target?.result) {
              currentUrls.push(e.target.result as string);
              this.prodImagesText = currentUrls.join('\n');
            }
            if (completed === filesToUpload.length) {
              this.isUploadingImages = false;
              this.uploadStatusMessage = '';
              this.notify('Imagen(es) cargada(s) en modo contingencia local.');
            }
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  removeProductImage(index: number): void {
    const currentUrls = [...this.productImagesList];
    if (index >= 0 && index < currentUrls.length) {
      currentUrls.splice(index, 1);
      this.prodImagesText = currentUrls.join('\n');
      this.notify('Imagen eliminada de la lista.');
    }
  }

  clearAllProductImages(): void {
    if (confirm('¿Deseas quitar todas las imágenes vinculadas a este producto?')) {
      this.prodImagesText = '';
    }
  }

  toggleProductActive(p: ProductDTO): void {
    const updated: ProductDTO = { ...p, active: !p.active };
    this.chatRepo.saveProduct(this.tenantId, updated).subscribe({
      next: () => {
        p.active = updated.active;
        this.notify(`Producto ${p.sku} ${p.active ? 'activado' : 'desactivado'}.`);
      }
    });
  }

  deleteProduct(p: ProductDTO): void {
    if (confirm(`¿Estás seguro de eliminar el producto ${p.sku} (${p.name}) del catálogo?`)) {
      this.chatRepo.deleteProduct(this.tenantId, p.id || p.sku).subscribe({
        next: () => {
          this.loadAllData();
          this.notify(`Producto ${p.sku} eliminado.`);
        }
      });
    }
  }

  // Getters y Métodos de Paginación de Productos (15, 30, 50)
  get filteredProducts(): ProductDTO[] {
    let list = this.products || [];

    if (this.productStatusFilter === 'active') {
      list = list.filter(p => p.active !== false);
    } else if (this.productStatusFilter === 'inactive') {
      list = list.filter(p => p.active === false);
    }

    if (this.productStockFilter === 'in_stock') {
      list = list.filter(p => (p.stock || 0) > 0);
    } else if (this.productStockFilter === 'out_of_stock') {
      list = list.filter(p => !p.stock || p.stock === 0);
    }

    if (this.productSearchQuery.trim()) {
      const q = this.productSearchQuery.toLowerCase().trim();
      list = list.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.colors && p.colors.toLowerCase().includes(q)) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }
    return list;
  }

  get totalProductPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.productPageSize));
  }

  get pagedProducts(): ProductDTO[] {
    if (this.productCurrentPage > this.totalProductPages) {
      this.productCurrentPage = this.totalProductPages;
    }
    const start = (this.productCurrentPage - 1) * this.productPageSize;
    return this.filteredProducts.slice(start, start + this.productPageSize);
  }

  get productPaginationInfo(): { start: number; end: number; total: number } {
    const total = this.filteredProducts.length;
    if (total === 0) return { start: 0, end: 0, total: 0 };
    const start = (this.productCurrentPage - 1) * this.productPageSize + 1;
    const end = Math.min(start + this.productPageSize - 1, total);
    return { start, end, total };
  }

  goToProductPage(page: number): void {
    if (page >= 1 && page <= this.totalProductPages) {
      this.productCurrentPage = page;
    }
  }

  setProductPageSize(size: any): void {
    this.productPageSize = Number(size);
    this.productCurrentPage = 1;
  }

  onProductFilterChange(): void {
    this.productCurrentPage = 1;
  }

  // ==========================================
  // PREGUNTAS Y REGLAS (Q&A / REGLAS DEL BOT)
  // ==========================================
  getEmptyRule(): RuleDTO {
    return {
      name: '',
      category: 'Inventario',
      type: 'static',
      enabled: true,
      trainingPhrases: [],
      response: '',
      responseInStock: '',
      responseOutOfStock: '',
      responseNotFound: ''
    };
  }

  get filteredRules(): RuleDTO[] {
    if (this.ruleCategoryFilter === 'all') return this.rules;
    return this.rules.filter(r => r.category === this.ruleCategoryFilter);
  }

  setRuleCategoryFilter(cat: string): void {
    this.ruleCategoryFilter = cat;
  }

  openNewRuleModal(): void {
    this.ruleModalTitle = 'Crear Pregunta / Regla Automatizada';
    this.editingRule = this.getEmptyRule();
    this.rulePhrasesText = '';
    this.isRuleModalOpen = true;
  }

  openEditRuleModal(rule: RuleDTO): void {
    this.ruleModalTitle = `Editar Regla: ${rule.name}`;
    this.editingRule = { ...rule };
    this.rulePhrasesText = (rule.trainingPhrases || []).join('\n');
    this.isRuleModalOpen = true;
  }

  closeRuleModal(): void {
    this.isRuleModalOpen = false;
  }

  saveRuleForm(): void {
    if (!this.editingRule.name) {
      alert('Ingrese un nombre descriptivo para la regla.');
      return;
    }

    const phrases = this.rulePhrasesText
      .split(/[\n,]/)
      .map(p => p.trim())
      .filter(Boolean);

    const toSave: RuleDTO = {
      ...this.editingRule,
      trainingPhrases: phrases
    };

    this.chatRepo.saveRule(this.tenantId, toSave).subscribe({
      next: () => {
        this.closeRuleModal();
        this.loadAllData();
        this.notify(`Regla "${toSave.name}" guardada con éxito.`);
      }
    });
  }

  toggleRule(rule: RuleDTO): void {
    if (rule.id) {
      this.chatRepo.toggleRule(this.tenantId, rule.id).subscribe({
        next: () => {
          rule.enabled = !rule.enabled;
          this.notify(`Regla "${rule.name}" ${rule.enabled ? 'activada' : 'desactivada'}.`);
        }
      });
    }
  }

  deleteRule(rule: RuleDTO): void {
    if (confirm(`¿Eliminar la regla "${rule.name}" del bot?`)) {
      if (rule.id) {
        this.chatRepo.deleteRule(this.tenantId, rule.id).subscribe({
          next: () => {
            this.loadAllData();
            this.notify(`Regla "${rule.name}" eliminada.`);
          }
        });
      }
    }
  }

  // ==========================================
  // SINÓNIMOS (DICCIONARIO DINÁMICO)
  // ==========================================
  get synonymKeys(): string[] {
    return Object.keys(this.synonyms || {});
  }

  openNewSynonymModal(): void {
    this.newSynConcept = '';
    this.newSynWords = '';
    this.isSynonymModalOpen = true;
  }

  closeSynonymModal(): void {
    this.isSynonymModalOpen = false;
  }

  saveSynonymGroupForm(): void {
    const concept = this.newSynConcept.trim().toLowerCase();
    const words = this.newSynWords.split(',').map(w => w.trim()).filter(Boolean);
    if (!concept || !words.length) {
      alert('Ingrese el concepto y al menos una palabra sinónima.');
      return;
    }

    this.chatRepo.saveSynonymGroup(this.tenantId, concept, words).subscribe({
      next: () => {
        this.closeSynonymModal();
        this.loadAllData();
        this.notify(`Grupo "${concept}" registrado con ${words.length} sinónimos.`);
      }
    });
  }

  addWordToConcept(concept: string, inputEl: HTMLInputElement): void {
    const word = inputEl.value.trim().toLowerCase();
    if (!word) return;

    const currentWords = this.synonyms[concept] || [];
    if (!currentWords.includes(word)) {
      const updated = [...currentWords, word];
      this.chatRepo.saveSynonymGroup(this.tenantId, concept, updated).subscribe({
        next: () => {
          inputEl.value = '';
          this.synonyms[concept] = updated;
          this.notify(`Sinónimo "${word}" agregado a "${concept}".`);
        }
      });
    }
  }

  removeWordFromConcept(concept: string, word: string): void {
    const currentWords = this.synonyms[concept] || [];
    const updated = currentWords.filter(w => w !== word);
    this.chatRepo.saveSynonymGroup(this.tenantId, concept, updated).subscribe({
      next: () => {
        this.synonyms[concept] = updated;
        this.notify(`Sinónimo eliminado.`);
      }
    });
  }

  deleteSynonymGroup(concept: string): void {
    if (confirm(`¿Eliminar todo el grupo de sinónimos "${concept}"?`)) {
      this.chatRepo.deleteSynonymGroup(this.tenantId, concept).subscribe({
        next: () => {
          this.loadAllData();
          this.notify(`Grupo de sinónimos "${concept}" eliminado.`);
        }
      });
    }
  }

  // ==========================================
  // REDES Y CAMPAÑAS
  // ==========================================
  getEmptyCampaign(): CampaignDTO {
    return {
      platform: 'facebook',
      channel: 'Facebook Ads (CTWA)',
      sku: this.products[0]?.sku || 'SKM-955-CA-NE',
      headline: '',
      url: '',
      description: ''
    };
  }

  openNewCampaignModal(): void {
    this.editingCampaign = this.getEmptyCampaign();
    this.isCampaignModalOpen = true;
  }

  closeCampaignModal(): void {
    this.isCampaignModalOpen = false;
  }

  saveCampaignForm(): void {
    if (!this.editingCampaign.headline || !this.editingCampaign.url) {
      alert('Ingrese el titular y la URL o ID del anuncio.');
      return;
    }

    const urlOrId = this.editingCampaign.url.trim();
    const fbShareMatch = urlOrId.match(/facebook\.com\/share\/p\/([a-zA-Z0-9_\-]+)/i);
    const sourceId = (fbShareMatch && fbShareMatch[1]) ? fbShareMatch[1] : (urlOrId.startsWith('http') ? urlOrId.replace(/^https?:\/\/[^\/]+\//, '') : urlOrId);

    const toSave: CampaignDTO = {
      ...this.editingCampaign,
      sourceId
    };

    this.chatRepo.saveCampaign(this.tenantId, toSave).subscribe({
      next: () => {
        this.closeCampaignModal();
        this.loadAllData();
        this.notify('Campaña vinculada al SKU exitosamente.');
      }
    });
  }

  deleteCampaign(camp: CampaignDTO): void {
    if (confirm(`¿Eliminar el enlace de campaña "${camp.headline}"?`)) {
      if (camp.id) {
        this.chatRepo.deleteCampaign(this.tenantId, camp.id).subscribe({
          next: () => {
            this.loadAllData();
            this.notify('Campaña eliminada.');
          }
        });
      }
    }
  }

  getProductNameForSku(sku: string): string {
    const prod = this.products.find(p => p.sku === sku);
    return prod ? prod.name : 'Producto no encontrado';
  }

  updateSmartLink(): void {
    const sku = this.selectedSmartLinkSku || this.products[0]?.sku || 'SKM-955-CA-NE';
    const msg = `Hola, me interesa el producto [SKU: ${sku}]`;
    this.smartLinkOutput = `https://wa.me/${this.smartLinkPhone}?text=${encodeURIComponent(msg)}`;
  }

  async copySmartLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.smartLinkOutput);
      this.notify('¡Enlace wa.me copiado al portapapeles!');
    } catch {
      this.notify('Enlace copiado.');
    }
  }

  async copySkuLink(sku: string): Promise<void> {
    const msg = `Hola, me interesa el producto [SKU: ${sku}]`;
    const link = `https://wa.me/${this.smartLinkPhone}?text=${encodeURIComponent(msg)}`;
    try {
      await navigator.clipboard.writeText(link);
      this.notify(`¡Enlace wa.me copiado para SKU ${sku}!`);
    } catch {
      this.notify(`Enlace copiado para SKU ${sku}.`);
    }
  }

  // Getters y Métodos de Paginación de Campañas (15, 30, 50)
  get filteredCampaigns(): CampaignDTO[] {
    let list = this.campaigns || [];
    if (this.campaignPlatformFilter !== 'all') {
      list = list.filter(c => (c.channel || c.platform || '').toLowerCase().includes(this.campaignPlatformFilter.toLowerCase()));
    }
    if (this.campaignSearchQuery.trim()) {
      const q = this.campaignSearchQuery.toLowerCase().trim();
      list = list.filter(c =>
        (c.headline && c.headline.toLowerCase().includes(q)) ||
        (c.sku && c.sku.toLowerCase().includes(q)) ||
        (c.sourceId && c.sourceId.toLowerCase().includes(q)) ||
        (c.url && c.url.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return list;
  }

  get totalCampaignPages(): number {
    return Math.max(1, Math.ceil(this.filteredCampaigns.length / this.campaignPageSize));
  }

  get pagedCampaigns(): CampaignDTO[] {
    if (this.campaignCurrentPage > this.totalCampaignPages) {
      this.campaignCurrentPage = this.totalCampaignPages;
    }
    const start = (this.campaignCurrentPage - 1) * this.campaignPageSize;
    return this.filteredCampaigns.slice(start, start + this.campaignPageSize);
  }

  get campaignPaginationInfo(): { start: number; end: number; total: number } {
    const total = this.filteredCampaigns.length;
    if (total === 0) return { start: 0, end: 0, total: 0 };
    const start = (this.campaignCurrentPage - 1) * this.campaignPageSize + 1;
    const end = Math.min(start + this.campaignPageSize - 1, total);
    return { start, end, total };
  }

  goToCampaignPage(page: number): void {
    if (page >= 1 && page <= this.totalCampaignPages) {
      this.campaignCurrentPage = page;
    }
  }

  setCampaignPageSize(size: any): void {
    this.campaignPageSize = Number(size);
    this.campaignCurrentPage = 1;
  }

  onCampaignFilterChange(): void {
    this.campaignCurrentPage = 1;
  }

  // ==========================================
  // PROBADOR EN VIVO (SIMULATOR SANDBOX)
  // ==========================================
  runSimulator(): void {
    const query = this.testerInput.trim();
    if (!query) return;

    this.isTesting = true;
    this.chatRepo.testSimulator(this.tenantId, query).subscribe({
      next: (res) => {
        this.testerResult = {
          rule: res.detectedRule,
          sku: res.detectedSku,
          text: res.replyText
        };
        this.isTesting = false;
      },
      error: () => {
        this.isTesting = false;
      }
    });
  }

  // ==========================================
  // PEDIDOS CONFIRMADOS DESDE EL CHAT
  // ==========================================
  openDispatchModal(order: OrderDTO): void {
    this.selectedOrder = order;
    this.newTrackingNumber = order.trackingNumber || `CAEX-HN-${Math.floor(100000 + Math.random() * 900000)}`;
    this.newCarrier = order.trackingCarrier || 'Cargo Expreso';
    this.newStatus = 'EN_CAMINO';
    this.dispatchPreviewMessage = `¡Hola ${order.customerName}! 🚚 Tu pedido ${order.orderNumber} ha sido despachado por ${this.newCarrier}.\nNúmero de guía oficial: ${this.newTrackingNumber}.\nPuedes rastrearlo o consultar conmigo en cualquier momento.`;
    this.isDispatchModalOpen = true;
  }

  closeDispatchModal(): void {
    this.isDispatchModalOpen = false;
    this.selectedOrder = null;
  }

  saveDispatch(): void {
    if (!this.selectedOrder || !this.selectedOrder.id) return;

    this.chatRepo.updateOrderStatus(
      this.tenantId,
      this.selectedOrder.id,
      this.newStatus,
      this.newTrackingNumber,
      this.newCarrier
    ).subscribe({
      next: () => {
        this.closeDispatchModal();
        this.loadAllData();
        this.notify('Guía CAEX asignada y pedido actualizado.');
      }
    });
  }

  openAuditModal(order: OrderDTO): void {
    this.selectedAuditOrder = order;
    this.isAuditModalOpen = true;
  }

  closeAuditModal(): void {
    this.isAuditModalOpen = false;
    this.selectedAuditOrder = null;
  }

  seedOrders(): void {
    this.chatRepo.seedDemoOrders(this.tenantId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.notify('Pedidos demo de prueba cargados.');
      }
    });
  }

  // ==========================================
  // TABLA Y PAGINACIÓN: PEDIDOS (15, 30, 50)
  // ==========================================
  get filteredOrders(): OrderDTO[] {
    let list = this.orders || [];
    if (this.orderStatusFilter !== 'all') {
      list = list.filter(o => o.status === this.orderStatusFilter);
    }
    if (this.orderSearchQuery.trim()) {
      const q = this.orderSearchQuery.toLowerCase().trim();
      list = list.filter(o =>
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.recipientName && o.recipientName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.toLowerCase().includes(q)) ||
        (o.productSku && o.productSku.toLowerCase().includes(q)) ||
        (o.productName && o.productName.toLowerCase().includes(q)) ||
        (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(q))
      );
    }
    return list;
  }

  get totalOrderPages(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.orderPageSize));
  }

  get pagedOrders(): OrderDTO[] {
    if (this.orderCurrentPage > this.totalOrderPages) {
      this.orderCurrentPage = this.totalOrderPages;
    }
    const start = (this.orderCurrentPage - 1) * this.orderPageSize;
    return this.filteredOrders.slice(start, start + this.orderPageSize);
  }

  get orderPaginationInfo(): { start: number; end: number; total: number } {
    const total = this.filteredOrders.length;
    if (total === 0) return { start: 0, end: 0, total: 0 };
    const start = (this.orderCurrentPage - 1) * this.orderPageSize + 1;
    const end = Math.min(start + this.orderPageSize - 1, total);
    return { start, end, total };
  }

  goToOrderPage(page: number): void {
    if (page >= 1 && page <= this.totalOrderPages) {
      this.orderCurrentPage = page;
    }
  }

  setOrderPageSize(size: any): void {
    this.orderPageSize = Number(size);
    this.orderCurrentPage = 1;
  }

  onOrderFilterChange(): void {
    this.orderCurrentPage = 1;
  }

  // ==========================================
  // HELPER COMÚN DE PÁGINAS NUMÉRICAS
  // ==========================================
  getPageNumbers(currentPage: number, totalPages: number): number[] {
    if (totalPages <= 1) return [1];
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // ==========================================
  // RESET FACTORY DEMO DATA
  // ==========================================
  resetDemo(): void {
    if (confirm('¿Restablecer todos los datos del comercio a la configuración de fábrica (28 productos, 14 reglas, sinónimos y campañas)?')) {
      this.chatRepo.resetDemoData(this.tenantId).subscribe({
        next: () => {
          this.loadAllData();
          this.notify('Configuración restablecida a valores de fábrica.');
        }
      });
    }
  }
}
