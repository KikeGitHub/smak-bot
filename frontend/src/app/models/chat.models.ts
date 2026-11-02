export interface LocationPayload {
  lat: number;
  lng: number;
  address?: string;
  mapUrl?: string;
}

export interface ProductSummaryDTO {
  sku: string;
  name: string;
  salePrice: number;
  dimensions?: string;
  colors?: string;
  imageUrl?: string;
}

export interface OrderSummaryDTO {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  productSku: string;
  productName: string;
  quantity: number;
  total: number;
  status: string;
  trackingNumber?: string;
  trackingCarrier?: string;
}

export interface QuickButtonDTO {
  id: string;
  title: string;
  payload: string;
}

export interface BotResponseDTO {
  text: string;
  step: string;
  imageUrl?: string;
  product?: ProductSummaryDTO;
  order?: OrderSummaryDTO;
  buttons?: QuickButtonDTO[];
}

export interface OrderDTO {
  id?: string;
  tenantId?: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsMapUrl?: string;
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: string;
  requiresInvoice?: boolean;
  rtn?: string;
  businessName?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  recipientName?: string;
  location?: LocationPayload;
  audit?: OrderAuditDTO;
  createdAt?: string;
}

export interface ProductDTO {
  id?: string;
  tenantId?: string;
  sku: string;
  name: string;
  description?: string;
  regularPrice?: number;
  salePrice: number;
  stock: number;
  dimensions?: string;
  weightLimit?: string;
  colors?: string;
  category?: string;
  keywords?: string[];
  images?: string[];
  active?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: Date;
  step?: string;
  imageUrl?: string;
  product?: ProductSummaryDTO;
  order?: OrderSummaryDTO;
  buttons?: QuickButtonDTO[];
  location?: LocationPayload;

  // Campos de soporte para Audio y Transcripción
  audioVoiceNote?: boolean;
  audioDuration?: number;
  audioWaveform?: number[];
  isPlaying?: boolean;
  playbackElapsed?: number;
  playbackPercent?: number;
  playbackSpeed?: number;
  isTranscribing?: boolean;
  transcriptionText?: string;
}
export interface TenantDTO {
  id: string;
  name: string;
  category: string;
  initials?: string;
  accent?: string;
}

export interface RuleDTO {
  id?: string;
  name: string;
  category: string;
  type: 'static' | 'parametric' | 'restriction';
  enabled: boolean;
  trainingPhrases: string[];
  response?: string;
  responseInStock?: string;
  responseOutOfStock?: string;
  responseNotFound?: string;
}

export interface CampaignDTO {
  id?: string;
  platform: string;
  channel?: string;
  type?: string;
  sourceId?: string;
  url: string;
  headline: string;
  body?: string;
  sku: string;
  description?: string;
}

export interface OrderAuditEntry {
  action: string;
  status: string;
  timestamp: string;
  note: string;
}

export interface OrderAuditDTO {
  ip?: string;
  userAgent?: string;
  source?: string;
  createdAt?: string;
  history?: OrderAuditEntry[];
}
