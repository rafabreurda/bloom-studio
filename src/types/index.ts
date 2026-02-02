export interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  date: string;
  time: string;
  status: 'Aguardando Sinal' | 'Agendado';
  value: number;
  totalValue: number;
  paymentMethod: 'Pix' | 'Cartão' | 'Dinheiro';
  tags: string[];
  isConfirmed: boolean;
  isPartnership: boolean;
  partnershipId?: string;
  partnershipName?: string;
  createdAt: Date;
  products?: AppointmentProduct[];
}

export interface AppointmentProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  birthday?: string;
  cpf?: string;
  anamnesis?: AnamnesisForm;
  anamnesisHistory?: AnamnesisRecord[];
  notes?: string;
  tags: string[];
  isVIP: boolean;
  history: ClientHistoryItem[];
  createdAt: Date;
}

export interface AnamnesisForm {
  skinType: string;
  allergies: string;
  medications: string;
  healthConditions: string;
  lastTanning?: string;
  observations: string;
}

export interface AnamnesisRecord {
  id: string;
  date: string;
  // Tipo de Pele
  skinTexture: 'normal' | 'seca' | 'oleosa' | 'mista' | '';
  phototype: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | '';
  tansSunExposure: boolean | null;
  // Histórico de Bronzeamento
  previousTanning: boolean | null;
  exfoliation: boolean | null;
  waxing: 'mais_24h' | 'menos_24h' | 'nao' | '';
  // Condições de Saúde
  skinTreatment: boolean | null;
  skinTreatmentDetails?: string;
  skinAllergies: boolean | null;
  skinAllergiesDetails?: string;
  openWounds: boolean | null;
  bruises: boolean | null;
  medications: boolean | null;
  medicationsDetails?: string;
  heavySweating: boolean | null;
  pregnancy: boolean | null;
  skinDiseases: boolean | null;
  skinDiseasesDetails?: string;
  // Autorizações
  orientationsAccepted: boolean;
  photoAuthorization: boolean;
  // Outros
  howDiscovered?: string;
  observations?: string;
  createdBy?: string;
  // Legacy fields (para compatibilidade)
  skinType?: string;
  allergies?: string;
  healthConditions?: string;
  lastTanning?: string;
}

export interface ClientHistoryItem {
  id: string;
  date: string;
  type: 'session' | 'purchase';
  description: string;
  value: number;
}

export interface Block {
  id: string;
  date: string;
  endDate?: string;
  time: string | null;
  type: 'allDay' | 'timeRange' | 'dateRange';
  reason: string;
  createdAt: Date;
}

export interface WaitingItem {
  id: string;
  name: string;
  phone: string;
  desiredDate: string;
  status: 'Aguardando' | 'Agendado';
  createdAt: Date;
}

export interface Finance {
  id: string;
  date: string;
  description: string;
  type: 'in' | 'out';
  value: number;
  paymentMethod: 'Pix' | 'Cartão' | 'Dinheiro';
  category: 'session' | 'product' | 'partnership' | 'expense';
  isPartnership?: boolean;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  minStock: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  products: string;
}

export interface Partnership {
  id: string;
  name: string;
  discount: number;
  contact: string;
}

export interface AdminJuniorPermissions {
  agenda: boolean;
  clientes: boolean;
  estoque: boolean;
  listaEspera: boolean;
  financeiro: boolean;
  fornecedores: boolean;
  parcerias: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: 'Admin Pleno' | 'Admin Junior';
  permissions?: AdminJuniorPermissions;
}

export interface ClientTag {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  includePixKey: boolean;
}

export interface SystemConfig {
  name: string;
  logo?: string;
  backgroundPhoto?: string;
  pixKey: string;
  payLink: string;
  lowStockThreshold: number;
  admins: AdminUser[];
  clientTags: ClientTag[];
  whatsappTemplates: WhatsAppTemplate[];
}

export interface ReportConfig {
  month: number;
  year: number;
  includeSessions: boolean;
  includeProducts: boolean;
  includePartnerships: boolean;
  includeExpenses: boolean;
}

export type UserRole = 'Admin Chefe' | 'Admin Pleno' | 'Admin Junior';
export type ViewMode = 'day' | 'week' | 'month';
export type TabId = 'agenda' | 'clientes' | 'financeiro' | 'estoque' | 'fornecedores' | 'parcerias' | 'lista-espera' | 'config';
