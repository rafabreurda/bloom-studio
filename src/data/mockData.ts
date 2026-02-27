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

export const defaultClientTags: ClientTag[] = [];

export const defaultWhatsAppTemplates: WhatsAppTemplate[] = [];

export const defaultAdmins: AdminUser[] = [];

export const defaultServiceTypes: { id: string; name: string; duration: number; price: number; cost: number; isActive: boolean }[] = [];

export const defaultConfig: SystemConfig = {
  name: '',
  pixKey: '',
  payLink: '',
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
