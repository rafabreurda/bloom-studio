import { 
  Appointment, Client, Block, WaitingItem, Finance, StockItem, 
  Supplier, Partnership, SystemConfig, ClientTag, WhatsAppTemplate, AdminUser 
} from '@/types';

// Get today's date in ISO format
const today = new Date();
const todayISO = today.toISOString().split('T')[0];
const tomorrowISO = new Date(today.getTime() + 86400000).toISOString().split('T')[0];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'Maria Silva',
    phone: '11999887766',
    date: todayISO,
    time: '09:00',
    status: 'Agendado',
    value: 150,
    totalValue: 200,
    paymentMethod: 'Pix',
    tags: ['VIP'],
    isConfirmed: true,
    createdAt: new Date(),
    products: [{ productId: '1', name: 'Óleo Bronzeador', quantity: 1, price: 50 }]
  },
  {
    id: '2',
    clientName: 'Ana Costa',
    phone: '11988776655',
    date: todayISO,
    time: '10:00',
    status: 'Aguardando Sinal',
    value: 120,
    totalValue: 120,
    paymentMethod: 'Cartão',
    tags: [],
    isConfirmed: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    clientName: 'Julia Santos',
    phone: '11977665544',
    date: todayISO,
    time: '14:00',
    status: 'Agendado',
    value: 180,
    totalValue: 230,
    paymentMethod: 'Dinheiro',
    tags: ['Fidelidade'],
    isConfirmed: true,
    createdAt: new Date(),
    products: [{ productId: '2', name: 'Hidratante Pós-Bronze', quantity: 1, price: 50 }]
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    phone: '11999887766',
    email: 'maria@email.com',
    address: 'Rua das Flores, 123 - Centro',
    birthday: '1990-05-15',
    cpf: '123.456.789-00',
    notes: 'Cliente frequente, prefere horários matutinos',
    tags: ['vip'],
    isVIP: true,
    anamnesisHistory: [
      {
        id: 'a1',
        date: '2024-01-15',
        skinType: 'Tipo II - Clara',
        allergies: 'Nenhuma conhecida',
        medications: 'Vitamina D',
        healthConditions: 'Nenhuma',
        lastTanning: '2024-01-10',
        observations: 'Pele sensível ao sol, melhorou com hidratação',
        createdBy: 'Admin'
      },
      {
        id: 'a2',
        date: '2023-12-08',
        skinType: 'Tipo II - Clara',
        allergies: 'Nenhuma conhecida',
        medications: 'Nenhuma',
        healthConditions: 'Nenhuma',
        lastTanning: '2023-11-20',
        observations: 'Pele sensível ao sol',
        createdBy: 'Admin'
      },
    ],
    history: [
      { id: '1', date: '2024-01-15', type: 'session', description: 'Sessão Bronze Natural 20min', value: 150 },
      { id: '2', date: '2024-01-15', type: 'purchase', description: 'Óleo Bronzeador Premium', value: 89 },
      { id: '3', date: '2024-01-08', type: 'session', description: 'Sessão Bronze Intenso 15min', value: 120 },
    ],
    createdAt: new Date('2023-06-01'),
  },
  {
    id: '2',
    name: 'Ana Costa',
    phone: '11988776655',
    email: 'ana@email.com',
    address: 'Av. Paulista, 1000 - Bela Vista',
    birthday: '1995-08-22',
    cpf: '987.654.321-00',
    tags: ['primeira-vez'],
    isVIP: false,
    history: [
      { id: '1', date: '2024-01-20', type: 'session', description: 'Sessão Avaliação', value: 80 },
    ],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Julia Santos',
    phone: '11977665544',
    email: 'julia@email.com',
    address: 'Rua Augusta, 500 - Consolação',
    birthday: '1988-12-03',
    cpf: '456.789.123-00',
    tags: ['fidelidade'],
    isVIP: false,
    anamnesisHistory: [
      {
        id: 'a3',
        date: '2024-01-18',
        skinType: 'Tipo III - Morena Clara',
        allergies: 'Nenhuma',
        medications: 'Nenhuma',
        healthConditions: 'Nenhuma',
        observations: '',
        createdBy: 'Admin'
      },
    ],
    history: [
      { id: '1', date: '2024-01-18', type: 'session', description: 'Sessão Bronze Premium 25min', value: 180 },
      { id: '2', date: '2024-01-10', type: 'session', description: 'Sessão Bronze Natural 20min', value: 150 },
    ],
    createdAt: new Date('2023-09-15'),
  },
  {
    id: '4',
    name: 'Fernanda Lima',
    phone: '11966554433',
    tags: [],
    isVIP: false,
    history: [],
    createdAt: new Date(),
  },
];

export const mockBlocks: Block[] = [
  {
    id: '1',
    date: todayISO,
    time: '12:00',
    type: 'timeRange',
    reason: 'Almoço',
    createdAt: new Date(),
  },
];

export const mockWaitingList: WaitingItem[] = [
  {
    id: '1',
    name: 'Carla Mendes',
    phone: '11966554433',
    desiredDate: todayISO,
    status: 'Aguardando',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Patricia Lima',
    phone: '11955443322',
    desiredDate: tomorrowISO,
    status: 'Aguardando',
    createdAt: new Date(),
  },
];

export const mockFinances: Finance[] = [
  { id: '1', date: '2024-01-15', description: 'Sessão Bronze - Maria Silva', type: 'in', value: 150, paymentMethod: 'Pix', category: 'session' },
  { id: '2', date: '2024-01-15', description: 'Óleo Bronzeador', type: 'in', value: 89, paymentMethod: 'Cartão', category: 'product' },
  { id: '3', date: '2024-01-14', description: 'Sessão Bronze - Ana Costa', type: 'in', value: 120, paymentMethod: 'Dinheiro', category: 'session' },
  { id: '4', date: '2024-01-14', description: 'Parceria Salão Bella', type: 'in', value: 45, paymentMethod: 'Pix', category: 'partnership', isPartnership: true },
  { id: '5', date: '2024-01-13', description: 'Conta de Luz', type: 'out', value: 280, paymentMethod: 'Pix', category: 'expense' },
  { id: '6', date: '2024-01-12', description: 'Sessão Bronze VIP - Julia Santos', type: 'in', value: 180, paymentMethod: 'Cartão', category: 'session' },
  { id: '7', date: '2024-01-11', description: 'Hidratante Pós-Bronze', type: 'in', value: 65, paymentMethod: 'Pix', category: 'product' },
  { id: '8', date: '2024-01-10', description: 'Parceria Gym Fitness', type: 'in', value: 60, paymentMethod: 'Pix', category: 'partnership', isPartnership: true },
];

export const mockStock: StockItem[] = [
  { id: '1', name: 'Óleo Bronzeador Premium', quantity: 12, price: 89.90, minStock: 5 },
  { id: '2', name: 'Hidratante Pós-Bronze', quantity: 8, price: 65.00, minStock: 5 },
  { id: '3', name: 'Protetor Labial Bronze', quantity: 3, price: 25.00, minStock: 5 },
  { id: '4', name: 'Esfoliante Corporal', quantity: 15, price: 45.00, minStock: 5 },
  { id: '5', name: 'Acelerador de Bronze', quantity: 2, price: 120.00, minStock: 5 },
];

export const mockSuppliers: Supplier[] = [
  { id: '1', name: 'Bronze & Cia', contact: '11912345678', products: 'Óleos, Hidratantes, Aceleradores' },
  { id: '2', name: 'SunCare Distribuidora', contact: '11923456789', products: 'Protetores, Esfoliantes' },
  { id: '3', name: 'Natural Bronze', contact: '11934567890', products: 'Produtos Veganos, Orgânicos' },
];

export const mockPartnerships: Partnership[] = [
  { id: '1', name: 'Salão Bella Hair', discount: 15, contact: '11945678901' },
  { id: '2', name: 'Gym Fitness Center', discount: 10, contact: '11956789012' },
  { id: '3', name: 'Spa Relaxe', discount: 20, contact: '11967890123' },
];

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

export const defaultConfig: SystemConfig = {
  name: 'BRONZE PRO',
  pixKey: 'pix@bronzepro.com.br',
  payLink: 'https://pay.bronzepro.com.br',
  lowStockThreshold: 5,
  admins: defaultAdmins,
  clientTags: defaultClientTags,
  whatsappTemplates: defaultWhatsAppTemplates,
};

export const chartEvolutionData = [
  { name: 'Set', faturamento: 3200 },
  { name: 'Out', faturamento: 4100 },
  { name: 'Nov', faturamento: 3800 },
  { name: 'Dez', faturamento: 5200 },
  { name: 'Jan', faturamento: 4800 },
  { name: 'Fev', faturamento: 5500 },
];

export const chartDistributionData = [
  { name: 'Pix', value: 65 },
  { name: 'Cartão', value: 25 },
  { name: 'Dinheiro', value: 10 },
];

export const chartMixData = [
  { name: 'Sessões', valor: 4200 },
  { name: 'Produtos', valor: 1300 },
];
