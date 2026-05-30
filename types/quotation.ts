// Tipos para el sistema de cotización inteligente

export interface QuotationBasicInfo {
  clientName: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  location: string;
  estimatedBudget: number;
  notes: string;
}

export type DecorationStyle =
  | 'organico'
  | 'minimalista'
  | 'luxury'
  | 'infantil'
  | 'elegante'
  | 'pastel'
  | 'moderno'
  | 'personalizado';

export interface DecorationStyleOption {
  id: DecorationStyle;
  name: string;
  image: string;
  description: string;
}

export type QuotationItemType =
  | 'arcos-globos'
  | 'paneles'
  | 'cilindros'
  | 'neones'
  | 'flores'
  | 'mesas'
  | 'backdrops'
  | 'globos-personalizados'
  | 'cortinas'
  | 'estructuras';

export interface QuotationItem {
  id: string;
  productId?: string; // Si está vinculado al inventario
  type: QuotationItemType;
  name: string;
  quantity: number;
  unitCost: number;
  laborCost: number;
  totalCost: number;
  category: string;
  notes?: string;
  materials?: Material[]; // Lista de materiales específicos
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string; // "bolsas", "latas", "metros", "pzas", etc.
}

export interface QuotationCosts {
  materials: number;
  labor: number;
  transport: number;
  rentals: number;
  extras: number;
  subtotal: number;
  profitMargin: number;
  profitPercentage: number;
  total: number;
}

export interface QuotationConfig {
  profitMargin: number;
  transportCost: number;
  laborPercentage: number;
  rentalPercentage: number;
  extrasPercentage: number;
}

export interface ReferenceImage {
  id: string;
  url: string;
  name: string;
}

export interface Quotation {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  basicInfo: QuotationBasicInfo;
  selectedStyles: DecorationStyle[];
  referenceImages: ReferenceImage[];
  items: QuotationItem[];
  costs: QuotationCosts;
  config: QuotationConfig;
  isTemplate?: boolean;
  templateName?: string;
  clientImages?: string[]; // Imágenes subidas por el cliente
}

export interface QuotationTemplate extends Omit<Quotation, 'basicInfo' | 'clientImages'> {
  templateName: string;
  description: string;
  previewImage: string;
  estimatedPrice: number;
}