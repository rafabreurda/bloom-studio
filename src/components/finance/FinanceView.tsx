import { useState, useMemo } from 'react';
import { Plus, TrendingUp, CreditCard, Banknote, Handshake, DollarSign, FileText, TrendingDown, Sparkles, Receipt, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { ExportButton } from '@/components/ui/ExportButton';
import { ImportDataButton, transforms } from '@/components/ui/ImportDataButton';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Finance, Appointment } from '@/types';
import { ReportModal } from './ReportModal';
import { FinanceModal } from './FinanceModal';
import { ExpensesView } from '@/components/expenses/ExpensesView';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ExtractModal } from './ExtractModal';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload[0]?.value || 0;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
      <p className="text-xs font-black uppercase text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-black text-foreground">R$ {total.toLocaleString('pt-BR')}</p>
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
      <p className="text-xs font-black uppercase text-muted-foreground">{name}</p>
      <p className="text-sm font-black text-foreground">R$ {value.toLocaleString('pt-BR')}</p>
    </div>
  );
};

const BarTooltipWithMethods = ({ active, payload, label, finances }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload[0]?.value || 0;
  const category = label === 'Sessões' ? 'session' : 'product';
  const items = (finances as any[])?.filter((f: any) => f.category === category && f.type === 'in') || [];
  const pix = items.filter((f: any) => f.paymentMethod === 'Pix').reduce((s: number, f: any) => s + f.value, 0);
  const cartao = items.filter((f: any) => f.paymentMethod === 'Cartão').reduce((s: number, f: any) => s + f.value, 0);
  const dinheiro = items.filter((f: any) => f.paymentMethod === 'Dinheiro').reduce((s: number, f: any) => s + f.value, 0);
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
      <p className="text-xs font-black uppercase text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-black text-foreground mb-2">R$ {total.toLocaleString('pt-BR')}</p>
      {pix > 0 && <p className="text-xs text-amber-500">Pix: R$ {pix.toLocaleString('pt-BR')}</p>}
      {cartao > 0 && <p className="text-xs text-blue-500">Cartão: R$ {cartao.toLocaleString('pt-BR')}</p>}
      {dinheiro > 0 && <p className="text-xs text-emerald-500">Dinheiro: R$ {dinheiro.toLocaleString('pt-BR')}</p>}
    </div>
  );
};

interface FinanceViewProps {
  finances: Finance[];
  onAddFinance: (finance: Omit<Finance, 'id'>) => void;
  onDeleteFinance: (id: string) => void;
  appointments: Appointment[];
  onRefetch?: () => void;
}

type FinanceSubTab = 'resumo' | 'despesas';

export function FinanceView({ finances, onAddFinance, onDeleteFinance, appointments, onRefetch }: FinanceViewProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [subTab, setSubTab] = useState<FinanceSubTab>('resumo');
  const [extractCard, setExtractCard] = useState<string | null>(null);

  // Month filter - defaults to current month
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const goToPrevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  // Filter finances by selected month
  const filteredFinances = useMemo(() => {
    return finances.filter(f => {
      const parts = f.date.split('/');
      if (parts.length === 3) {
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return month === selectedMonth && year === selectedYear;
      }
      return false;
    });
  }, [finances, selectedMonth, selectedYear]);

  // Filter appointments by selected month
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      // a.date can be DD/MM/YYYY or YYYY-MM-DD
      let month: number, year: number;
      if (a.date.includes('/')) {
        const parts = a.date.split('/');
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
      } else {
        const parts = a.date.split('-');
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[0], 10);
      }
      return month === selectedMonth && year === selectedYear;
    });
  }, [appointments, selectedMonth, selectedYear]);

  const totalReceita = filteredFinances.filter(f => f.type === 'in' && !f.isPartnership).reduce((sum, f) => sum + f.value, 0);
  const totalCartao = filteredFinances.filter(f => f.type === 'in' && !f.isPartnership && f.paymentMethod === 'Cartão').reduce((sum, f) => sum + f.value, 0);
  const totalPix = filteredFinances.filter(f => f.type === 'in' && !f.isPartnership && f.paymentMethod === 'Pix').reduce((sum, f) => sum + f.value, 0);
  const totalDinheiro = filteredFinances.filter(f => f.type === 'in' && !f.isPartnership && f.paymentMethod === 'Dinheiro').reduce((sum, f) => sum + f.value, 0);
  const totalParcerias = filteredAppointments.filter(a => a.isPartnership).reduce((sum, a) => sum + a.value, 0);
  const totalCustos = filteredAppointments.reduce((sum, a) => sum + (a.cost || 0), 0);
  const totalDespesas = filteredFinances.filter(f => f.type === 'out').reduce((sum, f) => sum + f.value, 0);
  const totalLucro = totalReceita - totalCustos - totalDespesas;
  const evolutionData = useMemo(() => {
    // Show last 6 months ending at selected month
    const data = [];
    for (let i = 5; i >= 0; i--) {
      let m = selectedMonth - i;
      let y = selectedYear;
      while (m < 0) { m += 12; y--; }
      const monthFinances = finances.filter(f => {
        const parts = f.date.split('/');
        if (parts.length === 3) {
          return parseInt(parts[1], 10) - 1 === m && parseInt(parts[2], 10) === y;
        }
        return false;
      });
      const valor = monthFinances.filter(f => f.type === 'in').reduce((s, f) => s + f.value, 0);
      data.push({ month: monthNames[m].substring(0, 3), valor });
    }
    return data;
  }, [finances, selectedMonth, selectedYear]);
  const paymentData = [{ name: 'Pix', value: totalPix, color: '#f59e0b' }, { name: 'Cartão', value: totalCartao, color: '#3b82f6' }, { name: 'Dinheiro', value: totalDinheiro, color: '#10b981' }].filter(d => d.value > 0);
  const totalSessions = filteredFinances.filter(f => f.category === 'session').reduce((sum, f) => sum + f.value, 0);
  const totalProducts = filteredFinances.filter(f => f.category === 'product').reduce((sum, f) => sum + f.value, 0);
  const categoryData = [{ name: 'Sessões', valor: totalSessions }, { name: 'Produtos', valor: totalProducts }];
  const summaryCards = [
    { label: 'Receita', value: totalReceita, icon: DollarSign, color: 'text-primary', key: 'receita' },
    { label: 'Custos', value: totalCustos, icon: TrendingDown, color: 'text-red-500', key: 'custos' },
    { label: 'Despesas', value: totalDespesas, icon: Receipt, color: 'text-red-500', key: 'despesas' },
    { label: 'Lucro', value: totalLucro, icon: Sparkles, color: 'text-emerald-500', key: 'lucro' },
    { label: 'Cartão', value: totalCartao, icon: CreditCard, color: 'text-blue-500', key: 'cartao' },
    { label: 'Pix', value: totalPix, icon: TrendingUp, color: 'text-amber-500', key: 'pix' },
    { label: 'Dinheiro', value: totalDinheiro, icon: Banknote, color: 'text-emerald-500', key: 'dinheiro' },
    { label: 'Parcerias', value: totalParcerias, icon: Handshake, color: 'text-purple-500', key: 'parcerias' },
  ];

  const getExtractData = (key: string) => {
    switch (key) {
      case 'receita': return filteredFinances.filter(f => f.type === 'in' && !f.isPartnership);
      case 'custos': return filteredFinances.filter(f => f.type === 'out' && f.category === 'expense');
      case 'despesas': return filteredFinances.filter(f => f.type === 'out');
      case 'lucro': return filteredFinances;
      case 'cartao': return filteredFinances.filter(f => f.type === 'in' && f.paymentMethod === 'Cartão');
      case 'pix': return filteredFinances.filter(f => f.type === 'in' && f.paymentMethod === 'Pix');
      case 'dinheiro': return filteredFinances.filter(f => f.type === 'in' && f.paymentMethod === 'Dinheiro');
      case 'parcerias': return filteredFinances.filter(f => f.isPartnership);
      default: return [];
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-2xl font-black uppercase tracking-tight">Financeiro</h2>
          <div className="flex items-center gap-1 bg-secondary/50 rounded-xl px-2 py-1">
            <button onClick={goToPrevMonth} className="p-1 hover:bg-background rounded-lg transition-colors">
              <ChevronLeft size={16} className="text-muted-foreground" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              <CalendarDays size={14} className="text-primary" />
              <span className="text-sm font-black whitespace-nowrap">{monthNames[selectedMonth]} {selectedYear}</span>
            </div>
            <button onClick={goToNextMonth} className="p-1 hover:bg-background rounded-lg transition-colors">
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <ExportButton
            fileName="financeiro"
            title="Relatório Financeiro"
            sheetName="Finanças"
            data={finances}
            columns={[
              { key: 'date', label: 'Data' },
              { key: 'description', label: 'Descrição' },
              { key: 'type', label: 'Tipo' },
              { key: 'value', label: 'Valor (R$)' },
              { key: 'paymentMethod', label: 'Pagamento' },
              { key: 'category', label: 'Categoria' },
            ]}
          />
          <ImportDataButton
            table="finances"
            label="Financeiro"
            columns={[
              { candidates: ['data', 'date'], dbColumn: 'date', transform: (v) => transforms.date(v) || new Date().toISOString().split('T')[0] },
              { candidates: ['descrição', 'descricao', 'description'], dbColumn: 'description', fallback: 'Importado' },
              { candidates: ['tipo', 'type'], dbColumn: 'type', transform: (v) => { const s = String(v || '').toLowerCase(); return s.includes('saída') || s.includes('out') || s.includes('despesa') ? 'out' : 'in'; } },
              { candidates: ['valor', 'value', 'preço'], dbColumn: 'value', transform: transforms.number },
              { candidates: ['pagamento', 'payment', 'método'], dbColumn: 'payment_method', fallback: 'Pix' },
              { candidates: ['categoria', 'category'], dbColumn: 'category', fallback: 'session' },
            ]}
            onImportComplete={() => onRefetch?.()}
          />
          <BronzeButton variant="secondary" icon={FileText} size="sm" onClick={() => setShowReportModal(true)}>Relatório</BronzeButton>
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={() => setShowFinanceModal(true)}>Nova Entrada</BronzeButton>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-secondary/50 p-1 rounded-2xl shrink-0">
        <button
          onClick={() => setSubTab('resumo')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase transition-all ${
            subTab === 'resumo'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <DollarSign size={16} />
          Resumo
        </button>
        <button
          onClick={() => setSubTab('despesas')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase transition-all ${
            subTab === 'despesas'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Receipt size={16} />
          Despesas
        </button>
      </div>

      {subTab === 'resumo' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-6 pr-2">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">{summaryCards.map((card, i) => (<BronzeCard key={i} className="bg-secondary/50 p-4 text-center cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all" onClick={() => setExtractCard(card.key)}><div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-background mb-2 ${card.color}`}><card.icon size={20} /></div><p className="text-[10px] font-black uppercase text-muted-foreground">{card.label}</p><p className="text-lg font-black">R$ {card.value.toLocaleString('pt-BR')}</p></BronzeCard>))}</div>
          <div className="grid md:grid-cols-2 gap-4">
             <BronzeCard className="bg-secondary/50 p-4"><h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Evolução (6 meses)</h3><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={evolutionData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="month" stroke="#666" fontSize={10} /><YAxis stroke="#666" fontSize={10} /><Tooltip content={<CustomTooltip />} /><Line type="monotone" dataKey="valor" stroke="#f59e0b" strokeWidth={3} /></LineChart></ResponsiveContainer></div></BronzeCard>
            <BronzeCard className="bg-secondary/50 p-4"><h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Pagamentos</h3><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={paymentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{paymentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie><Tooltip content={<PieTooltip />} /></PieChart></ResponsiveContainer></div></BronzeCard>
          </div>
          <BronzeCard className="bg-secondary/50 p-4"><h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Sessões vs Produtos</h3><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={categoryData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="name" stroke="#666" /><YAxis stroke="#666" fontSize={10} /><Tooltip content={<BarTooltipWithMethods finances={filteredFinances} />} /><Bar dataKey="valor" fill="#f59e0b" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></BronzeCard>
          <BronzeCard className="bg-secondary/50"><h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Transações do Mês</h3><div className="space-y-2">{filteredFinances.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Nenhuma transação neste mês</p>}{filteredFinances.map(f => (<div key={f.id} className={`flex items-center justify-between p-3 rounded-xl border ${f.type === 'in' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}><div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${f.type === 'in' ? 'bg-emerald-500' : 'bg-red-500'}`} /><div><p className="text-sm font-bold">{f.description}</p><p className="text-xs text-muted-foreground">{f.date} • {f.paymentMethod}</p></div></div><span className={`font-black ${f.type === 'in' ? 'text-emerald-500' : 'text-red-500'}`}>{f.type === 'in' ? '+' : '-'}R$ {f.value}</span></div>))}</div></BronzeCard>
        </div>
      )}

      {subTab === 'despesas' && (
        <div className="flex-1 overflow-hidden">
          <ExpensesView
            finances={finances}
            onAddFinance={onAddFinance}
            onDeleteFinance={onDeleteFinance}
          />
        </div>
      )}

      {showReportModal && <ReportModal finances={finances} onClose={() => setShowReportModal(false)} />}
      {showFinanceModal && <FinanceModal onClose={() => setShowFinanceModal(false)} onSave={onAddFinance} />}
      {extractCard && (
        <ExtractModal
          open={!!extractCard}
          onClose={() => setExtractCard(null)}
          title={`Extrato: ${summaryCards.find(c => c.key === extractCard)?.label || ''}`}
          finances={getExtractData(extractCard)}
          color={summaryCards.find(c => c.key === extractCard)?.color || 'text-foreground'}
        />
      )}
    </div>
  );
}
