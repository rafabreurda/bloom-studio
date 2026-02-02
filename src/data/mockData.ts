import { Appointment, Client, Block, WaitingItem, Finance, StockItem, Supplier, Partnership, SystemConfig } from '@/types';

// Get today's date in Brazilian format
const today = new Date();
const todayStr = today.toLocaleDateString('pt-BR');
const tomorrowStr = new Date(today.getTime() + 86400000).toLocaleDateString('pt-BR');

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'Maria Silva',
    phone: '11999887766',
    date: todayStr,
    time: '09:00',
    status: 'Agendado',
    value: 150,
    totalValue: 180,
    paymentMethod: 'Pix',
    tags: ['VIP'],
    isConfirmed: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    clientName: 'Ana Carolina',
    phone: '11988776655',
    date: todayStr,
    time: '10:30',
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
    clientName: 'Juliana Costa',
    phone: '11977665544',
    date: todayStr,
    time: '14:00',
    status: 'Agendado',
    value: 180,
    totalValue: 230,
    paymentMethod: 'Pix',
    tags: ['VIP'],
    isConfirmed: true,
    createdAt: new Date(),
  },
  {
    id: '4',
    clientName: 'Fernanda Lima',
    phone: '11966554433',
    date: tomorrowStr,
    time: '11:00',
    status: 'Agendado',
    value: 150,
    totalValue: 150,
    paymentMethod: 'Dinheiro',
    tags: [],
    isConfirmed: false,
    createdAt: new Date(),
  },
];

export const mockClients: Client[] = [
  { id: '1', name: 'Maria Silva', phone: '11999887766', email: 'maria@email.com', isVIP: true, createdAt: new Date() },
  { id: '2', name: 'Ana Carolina', phone: '11988776655', email: 'ana@email.com', isVIP: false, createdAt: new Date() },
  { id: '3', name: 'Juliana Costa', phone: '11977665544', isVIP: true, createdAt: new Date() },
  { id: '4', name: 'Fernanda Lima', phone: '11966554433', isVIP: false, createdAt: new Date() },
];

export const mockBlocks: Block[] = [
  { id: '1', date: todayStr, time: '12:00', type: 'timeRange', reason: 'Almoço', createdAt: new Date() },
];

export const mockWaitingList: WaitingItem[] = [
  { id: '1', name: 'Camila Souza', phone: '11955443322', desiredDate: tomorrowStr, status: 'Aguardando', createdAt: new Date() },
  { id: '2', name: 'Beatriz Santos', phone: '11944332211', desiredDate: tomorrowStr, status: 'Aguardando', createdAt: new Date() },
];

export const mockFinances: Finance[] = [
  { id: '1', date: todayStr, description: 'Bronze: Maria Silva', type: 'in', value: 180, paymentMethod: 'Pix', category: 'Bronzeamento' },
  { id: '2', date: todayStr, description: 'Bronze: Juliana Costa', type: 'in', value: 230, paymentMethod: 'Pix', category: 'Bronzeamento' },
  { id: '3', date: todayStr, description: 'Venda Óleo', type: 'in', value: 45, paymentMethod: 'Cartão', category: 'Venda Geral' },
  { id: '4', date: todayStr, description: 'Material Limpeza', type: 'out', value: 85, paymentMethod: 'Dinheiro', category: 'Despesa' },
];

export const mockStock: StockItem[] = [
  { id: '1', name: 'Óleo Bronzeador Premium', quantity: 12, price: 45, minStock: 5 },
  { id: '2', name: 'Hidratante Pós-Bronze', quantity: 8, price: 35, minStock: 5 },
  { id: '3', name: 'Protetor Labial', quantity: 3, price: 15, minStock: 5 },
  { id: '4', name: 'Touca Descartável', quantity: 45, price: 2, minStock: 20 },
];

export const mockSuppliers: Supplier[] = [
  { id: '1', name: 'Bronze & Cia', contact: '11933221100', products: 'Óleos e Hidratantes' },
  { id: '2', name: 'SunPro Distribuidora', contact: '11922110099', products: 'Equipamentos' },
];

export const mockPartnerships: Partnership[] = [
  { id: '1', name: 'Academia Fitness Pro', discount: 15, contact: '11911009988' },
  { id: '2', name: 'Salão Beauty Hair', discount: 10, contact: '11900998877' },
];

export const defaultConfig: SystemConfig = {
  name: 'BRONZE PRO',
  pixKey: 'pix@bronzepro.com.br',
  payLink: 'https://pay.bronzepro.com.br',
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
