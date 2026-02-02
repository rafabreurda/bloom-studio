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
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthday?: string;
  notes?: string;
  isVIP: boolean;
  createdAt: Date;
}

export interface Block {
  id: string;
  date: string;
  time: string | null;
  type: 'allDay' | 'timeRange';
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
  category: string;
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

export interface SystemConfig {
  name: string;
  pixKey: string;
  payLink: string;
}

export type UserRole = 'Admin Chefe' | 'Admin Pleno' | 'Admin Junior';
export type ViewMode = 'day' | 'week' | 'month';
export type TabId = 'agenda' | 'clientes' | 'financeiro' | 'estoque' | 'fornecedores' | 'parcerias' | 'lista-espera' | 'config';
