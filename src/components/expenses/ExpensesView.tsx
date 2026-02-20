import { useState, useMemo } from 'react';
import { Plus, Trash2, Receipt, TrendingDown, Calendar, Search } from 'lucide-react';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Finance } from '@/types';
import { ExpenseModal } from './ExpenseModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
      <p className="text-xs font-black uppercase text-muted-foreground">{label}</p>
      <p className="text-sm font-black text-red-500">R$ {payload[0].value.toLocaleString('pt-BR')}</p>
    </div>
  );
};

interface ExpensesViewProps {
  finances: Finance[];
  onAddFinance: (finance: Omit<Finance, 'id'>) => void;
  onDeleteFinance: (id: string) => void;
}

export function ExpensesView({ finances, onAddFinance, onDeleteFinance }: ExpensesViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const expenses = useMemo(() => {
    return finances
      .filter(f => f.type === 'out')
      .filter(f => {
        if (search) {
          return f.description.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      })
      .filter(f => {
        if (filterMonth) {
          // f.date is DD/MM/YYYY
          const parts = f.date.split('/');
          const monthYear = `${parts[2]}-${parts[1]}`;
          return monthYear === filterMonth;
        }
        return true;
      });
  }, [finances, search, filterMonth]);

  const totalExpenses = expenses.reduce((sum, f) => sum + f.value, 0);

  // Monthly chart data
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    const allExpenses = finances.filter(f => f.type === 'out');
    allExpenses.forEach(f => {
      const parts = f.date.split('/');
      const key = `${parts[1]}/${parts[2]}`;
      months[key] = (months[key] || 0) + f.value;
    });
    return Object.entries(months)
      .map(([month, valor]) => ({ month, valor }))
      .sort((a, b) => {
        const [ma, ya] = a.month.split('/');
        const [mb, yb] = b.month.split('/');
        return (Number(ya) * 100 + Number(ma)) - (Number(yb) * 100 + Number(mb));
      })
      .slice(-6);
  }, [finances]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.forEach(f => {
      const cat = f.description.split(' - ')[0] || 'Outros';
      cats[cat] = (cats[cat] || 0) + f.value;
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-end shrink-0">
        <BronzeButton variant="gold" icon={Plus} size="sm" onClick={() => setShowModal(true)}>
          Nova Despesa
        </BronzeButton>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-6 pr-2">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <BronzeCard className="bg-secondary/50 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 mb-2">
              <TrendingDown size={20} className="text-red-500" />
            </div>
            <p className="text-[10px] font-black uppercase text-muted-foreground">Total Despesas</p>
            <p className="text-lg font-black text-red-500">R$ {totalExpenses.toLocaleString('pt-BR')}</p>
          </BronzeCard>
          <BronzeCard className="bg-secondary/50 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background mb-2">
              <Calendar size={20} className="text-muted-foreground" />
            </div>
            <p className="text-[10px] font-black uppercase text-muted-foreground">Registros</p>
            <p className="text-lg font-black">{expenses.length}</p>
          </BronzeCard>
          <BronzeCard className="bg-secondary/50 p-4 text-center col-span-2 md:col-span-1">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background mb-2">
              <Receipt size={20} className="text-muted-foreground" />
            </div>
            <p className="text-[10px] font-black uppercase text-muted-foreground">Média/Registro</p>
            <p className="text-lg font-black">R$ {expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}</p>
          </BronzeCard>
        </div>

        {/* Monthly Chart */}
        {monthlyData.length > 0 && (
          <BronzeCard className="bg-secondary/50 p-4">
            <h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Despesas por Mês</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} />
                  <Tooltip content={<BarTooltip />} />
                  <Bar dataKey="valor" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </BronzeCard>
        )}

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <BronzeCard className="bg-secondary/50 p-4">
            <h3 className="text-sm font-black uppercase text-muted-foreground mb-3">Por Categoria</h3>
            <div className="space-y-2">
              {categoryBreakdown.map(cat => {
                const pct = totalExpenses > 0 ? (cat.value / totalExpenses) * 100 : 0;
                return (
                  <div key={cat.name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-foreground w-28 truncate">{cat.name}</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500/70 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-black text-red-500 w-24 text-right">R$ {cat.value.toLocaleString('pt-BR')}</span>
                  </div>
                );
              })}
            </div>
          </BronzeCard>
        )}

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar despesa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-bronze pl-9 w-full"
            />
          </div>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="input-bronze w-40"
          />
        </div>

        {/* Expense List */}
        <BronzeCard className="bg-secondary/50">
          <h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Todas as Despesas</h3>
          <div className="space-y-2">
            {expenses.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">Nenhuma despesa encontrada</p>
            )}
            {expenses.map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border bg-red-500/5 border-red-500/20 group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div>
                    <p className="text-sm font-bold">{f.description}</p>
                    <p className="text-xs text-muted-foreground">{f.date} • {f.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-red-500">-R$ {f.value.toLocaleString('pt-BR')}</span>
                  <ConfirmDeleteDialog
                    description="Tem certeza que deseja excluir esta despesa?"
                    onConfirm={() => onDeleteFinance(f.id)}
                    trigger={
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </BronzeCard>
      </div>

      {showModal && <ExpenseModal onClose={() => setShowModal(false)} onSave={onAddFinance} />}
    </div>
  );
}
