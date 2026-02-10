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
    productsValue: 50,
    chargedValue: 200,
    cost: 50,
    paymentMethod: 'Pix',
    tags: ['VIP'],
    isConfirmed: true,
    isPartnership: false,
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
    productsValue: 0,
    chargedValue: 0,
    cost: 50,
    paymentMethod: 'Cartão',
    tags: [],
    isConfirmed: false,
    isPartnership: true,
    partnershipId: '1',
    partnershipName: 'Salão Bella Hair',
    partnershipDiscount: 100,
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
    productsValue: 50,
    chargedValue: 230,
    cost: 50,
    paymentMethod: 'Dinheiro',
    tags: ['Fidelidade'],
    isConfirmed: true,
    isPartnership: false,
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
        skinTexture: 'normal',
        phototype: 'II',
        tansSunExposure: false,
        previousTanning: true,
        exfoliation: true,
        waxing: 'mais_24h',
        skinTreatment: false,
        skinAllergies: false,
        openWounds: false,
        bruises: false,
        medications: true,
        medicationsDetails: 'Vitamina D',
        heavySweating: false,
        pregnancy: false,
        skinDiseases: false,
        orientationsAccepted: true,
        photoAuthorization: true,
        observations: 'Pele sensível ao sol, melhorou com hidratação',
        createdBy: 'Admin'
      },
      {
        id: 'a2',
        date: '2023-12-08',
        skinTexture: 'normal',
        phototype: 'II',
        tansSunExposure: false,
        previousTanning: false,
        exfoliation: false,
        waxing: 'nao',
        skinTreatment: false,
        skinAllergies: false,
        openWounds: false,
        bruises: false,
        medications: false,
        heavySweating: false,
        pregnancy: false,
        skinDiseases: false,
        orientationsAccepted: true,
        photoAuthorization: true,
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
        skinTexture: 'mista',
        phototype: 'III',
        tansSunExposure: true,
        previousTanning: true,
        exfoliation: true,
        waxing: 'mais_24h',
        skinTreatment: false,
        skinAllergies: false,
        openWounds: false,
        bruises: false,
        medications: false,
        heavySweating: false,
        pregnancy: false,
        skinDiseases: false,
        orientationsAccepted: true,
        photoAuthorization: false,
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

export const mockFinances: Finance[] = [];

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
