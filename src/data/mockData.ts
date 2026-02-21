import { 
  Appointment, Client, Block, WaitingItem, Finance, StockItem, 
  Supplier, Partnership, SystemConfig, ClientTag, WhatsAppTemplate, AdminUser 
} from '@/types';

// Get today's date in ISO format
const today = new Date();
const todayISO = today.toISOString().split('T')[0];
const tomorrowISO = new Date(today.getTime() + 86400000).toISOString().split('T')[0];

export const mockAppointments: Appointment[] = [];
export const mockClients: Client[] = [];
export const mockBlocks: Block[] = [];
export const mockWaitingList: WaitingItem[] = [];
export const mockFinances: Finance[] = [];
export const mockStock: StockItem[] = [];
export const mockSuppliers: Supplier[] = [];
export const mockPartnerships: Partnership[] = [];

export const defaultClientTags: ClientTag[] = [
  { id: 'vip', name: 'VIP', color: '#f59e0b', isActive: true },
  { id: 'inadimplente', name: 'Inadimplente', color: '#ef4444', isActive: true },
  { id: 'influencer', name: 'Influencer', color: '#8b5cf6', isActive: true },
  { id: 'fidelidade', name: 'Fidelidade', color: '#10b981', isActive: true },
  { id: 'primeira-vez', name: 'Primeira Vez', color: '#3b82f6', isActive: true },
];

export const defaultWhatsAppTemplates: WhatsAppTemplate[] = [
  {
    id: 'confirmacao',
    name: 'Confirmação 24h',
    content: 'Olá {nome}! Confirmando seu bronzeamento amanhã às {hora}. Responda SIM para confirmar! 🌞',
    includePixKey: false,
  },
  {
    id: 'sinal',
    name: 'Aguardando Sinal',
    content: 'Olá {nome}! Para confirmar seu horário, envie o sinal de R$ {valor}.\n\n💰 Chave PIX: {pix}',
    includePixKey: true,
  },
  {
    id: 'lembrete',
    name: 'Lembrete do Dia',
    content: 'Olá {nome}! Lembrete do seu bronze hoje às {hora}. Te esperamos! ✨',
    includePixKey: false,
  },
  {
    id: 'pos-atendimento',
    name: 'Pós-Atendimento',
    content: 'Olá {nome}! Obrigada pela visita! 💛 Esperamos que tenha adorado o resultado. Nos vemos em breve!',
    includePixKey: false,
  },
];

export const defaultAdmins: AdminUser[] = [];

export const defaultServiceTypes = [
  { id: '1', name: 'Biquíni de Fita completo', duration: 10, price: 30, cost: 5, isActive: true },
  { id: '2', name: 'Bronze Intenso', duration: 40, price: 230, cost: 50, isActive: true },
  { id: '3', name: 'Bronze Médio', duration: 40, price: 210, cost: 50, isActive: true },
  { id: '4', name: 'Contorno Corporal', duration: 30, price: 320, cost: 50, isActive: true },
  { id: '5', name: 'Express', duration: 40, price: 260, cost: 50, isActive: true },
  { id: '6', name: 'Sessão de Bronze a Jato', duration: 50, price: 210, cost: 50, isActive: true },
  { id: '7', name: 'Deslocamento Domiciliar', duration: 60, price: 80, cost: 0, isActive: true },
  { id: '8', name: 'Parte Biquíni de Fita', duration: 10, price: 20, cost: 0, isActive: true },
];

export const defaultConfig: SystemConfig = {
  name: 'BRONZE PRO',
  pixKey: 'pix@bronzepro.com.br',
  payLink: 'https://pay.bronzepro.com.br',
  lowStockThreshold: 5,
  admins: defaultAdmins,
  clientTags: defaultClientTags,
  whatsappTemplates: defaultWhatsAppTemplates,
  serviceTypes: defaultServiceTypes,
};

export const chartEvolutionData = [
  { name: 'Set', faturamento: 0 },
  { name: 'Out', faturamento: 0 },
  { name: 'Nov', faturamento: 0 },
  { name: 'Dez', faturamento: 0 },
  { name: 'Jan', faturamento: 0 },
  { name: 'Fev', faturamento: 0 },
];

export const chartDistributionData = [
  { name: 'Pix', value: 0 },
  { name: 'Cartão', value: 0 },
  { name: 'Dinheiro', value: 0 },
];

export const chartMixData = [
  { name: 'Sessões', valor: 0 },
  { name: 'Produtos', valor: 0 },
];
