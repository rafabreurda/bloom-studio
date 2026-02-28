import { useState, useMemo } from 'react';
import { Plus, FileText, DollarSign, Receipt, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { ExportButton } from '@/components/ui/ExportButton';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Finance, Appointment } from '@/types';
import { ReportModal } from './ReportModal';
import { FinanceModal } from './FinanceModal';
import { ExpensesView } from '@/components/expenses/ExpensesView';
import { ExtractModal } from './ExtractModal';
import { FinanceDashboardCards } from './FinanceDashboardCards';
import { FinanceCharts } from './FinanceCharts';
import { FinanceTransactionList } from './FinanceTransactionList';

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

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
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

  const filteredAppointments = useMemo(() => {
    const today = new Date();
    const todayBr = today.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    return appointments.filter(a => {
      let month: number, year: number, isoDate: string;
      if (a.date.includes('/')) {
        const parts = a.date.split('/');
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
        isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        const parts = a.date.split('-');
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[0], 10);
        isoDate = a.date;
      }
      return month === selectedMonth && year === selectedYear && isoDate <= todayBr;
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

  const summaryCards = [
    { label: 'Receita', key: 'receita', color: 'text-foreground' },
    { label: 'Custos', key: 'custos', color: 'text-foreground' },
    { label: 'Despesas', key: 'despesas', color: 'text-foreground' },
    { label: 'Lucro', key: 'lucro', color: 'text-foreground' },
    { label: 'Cartão', key: 'cartao', color: 'text-foreground' },
    { label: 'Pix', key: 'pix', color: 'text-foreground' },
    { label: 'Dinheiro', key: 'dinheiro', color: 'text-foreground' },
    { label: 'Parcerias', key: 'parcerias', color: 'text-foreground' },
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
    <div className="space-y-4 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-2xl font-black uppercase tracking-tight">Financeiro</h2>
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-2 py-1.5">
            <button onClick={goToPrevMonth} className="p-1 hover:bg-muted rounded-lg transition-colors">
              <ChevronLeft size={16} className="text-muted-foreground" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              <CalendarDays size={14} className="text-primary" />
              <span className="text-sm font-black whitespace-nowrap">{monthNames[selectedMonth]} {selectedYear}</span>
            </div>
            <button onClick={goToNextMonth} className="p-1 hover:bg-muted rounded-lg transition-colors">
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
          <BronzeButton variant="secondary" icon={FileText} size="sm" onClick={() => setShowReportModal(true)}>Relatório</BronzeButton>
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={() => setShowFinanceModal(true)}>Nova Entrada</BronzeButton>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-card border border-border p-1 rounded-xl shrink-0">
        <button
          onClick={() => setSubTab('resumo')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-black uppercase transition-all ${
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
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-black uppercase transition-all ${
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
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-4 pr-2">
          <FinanceDashboardCards
            totalReceita={totalReceita}
            totalCustos={totalCustos}
            totalDespesas={totalDespesas}
            totalLucro={totalLucro}
            totalCartao={totalCartao}
            totalPix={totalPix}
            totalDinheiro={totalDinheiro}
            totalParcerias={totalParcerias}
            onCardClick={setExtractCard}
          />

          <FinanceCharts
            finances={finances}
            appointments={appointments}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            monthNames={monthNames}
          />

          <FinanceTransactionList finances={filteredFinances} />
        </div>
      )}

      {subTab === 'despesas' && (
        <div className="flex-1 overflow-hidden">
          <ExpensesView finances={finances} onAddFinance={onAddFinance} onDeleteFinance={onDeleteFinance} />
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
