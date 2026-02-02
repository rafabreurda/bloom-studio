import { FileDown, TrendingUp } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Finance } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

interface FinanceViewProps {
  finances: Finance[];
  evolutionData: { name: string; faturamento: number }[];
  distributionData: { name: string; value: number }[];
  mixData: { name: string; valor: number }[];
}

const COLORS = ['#D4AF37', '#f59e0b', '#78350f'];

export function FinanceView({ finances, evolutionData, distributionData, mixData }: FinanceViewProps) {
  const totalIn = finances
    .filter(f => f.type === 'in')
    .reduce((acc, curr) => acc + Number(curr.value), 0);

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight">Financeiro</h2>
        <BronzeButton icon={FileDown} variant="secondary" size="sm">
          PDF
        </BronzeButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-6 pr-2">
        {/* Total Card */}
        <BronzeCard className="bg-gradient-to-br from-secondary to-background border-primary/30 text-center py-10">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
            Faturamento
          </p>
          <p className="text-6xl font-black text-primary mt-2">
            R$ {totalIn.toFixed(2)}
          </p>
        </BronzeCard>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          {/* Evolution Chart */}
          <BronzeCard className="h-[300px] bg-card">
            <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-6 flex items-center gap-2">
              <TrendingUp size={14} /> Evolução Financeira
            </h3>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={evolutionData}>
                <CartesianGrid stroke="#18181b" vertical={false} />
                <XAxis dataKey="name" stroke="#78350f" fontSize={10} />
                <YAxis stroke="#78350f" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="faturamento" 
                  stroke="#f59e0b" 
                  strokeWidth={4} 
                />
              </LineChart>
            </ResponsiveContainer>
          </BronzeCard>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Payment Distribution */}
            <BronzeCard className="h-[280px]">
              <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-2">
                Pagamentos
              </h3>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie 
                    data={distributionData} 
                    innerRadius={40} 
                    outerRadius={60} 
                    paddingAngle={5} 
                    dataKey="value"
                  >
                    {distributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </BronzeCard>

            {/* Sales Mix */}
            <BronzeCard className="h-[280px]">
              <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-2">
                Vendas
              </h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={mixData}>
                  <XAxis dataKey="name" stroke="#78350f" fontSize={10} />
                  <Bar dataKey="valor" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </BronzeCard>
          </div>
        </div>
      </div>
    </div>
  );
}
