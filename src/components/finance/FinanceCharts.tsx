import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';
import { Finance } from '@/types';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-black" style={{ color: p.color }}>
          R$ {Number(p.value).toLocaleString('pt-BR')}
        </p>
      ))}
    </div>
  );
};

const PieTooltipContent = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
      <p className="text-[10px] font-bold uppercase text-muted-foreground">{payload[0].name}</p>
      <p className="text-sm font-black">R$ {Number(payload[0].value).toLocaleString('pt-BR')}</p>
    </div>
  );
};

interface FinanceChartsProps {
  finances: Finance[];
  filteredFinances: Finance[];
  selectedMonth: number;
  selectedYear: number;
  monthNames: string[];
  totalPix: number;
  totalCartao: number;
  totalDinheiro: number;
}

export function FinanceCharts({
  finances, filteredFinances, selectedMonth, selectedYear, monthNames,
  totalPix, totalCartao, totalDinheiro,
}: FinanceChartsProps) {
  // Revenue evolution (6 months)
  const evolutionData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      let m = selectedMonth - i;
      let y = selectedYear;
      while (m < 0) { m += 12; y--; }
      const monthFinances = finances.filter(f => {
        const parts = f.date.split('/');
        return parts.length === 3 && parseInt(parts[1], 10) - 1 === m && parseInt(parts[2], 10) === y;
      });
      const receita = monthFinances.filter(f => f.type === 'in').reduce((s, f) => s + f.value, 0);
      const despesa = monthFinances.filter(f => f.type === 'out').reduce((s, f) => s + f.value, 0);
      data.push({ month: monthNames[m].substring(0, 3), receita, despesa });
    }
    return data;
  }, [finances, selectedMonth, selectedYear, monthNames]);

  const paymentData = [
    { name: 'Pix', value: totalPix, color: '#f59e0b' },
    { name: 'Cartão', value: totalCartao, color: '#3b82f6' },
    { name: 'Dinheiro', value: totalDinheiro, color: '#10b981' },
  ].filter(d => d.value > 0);

  const totalSessions = filteredFinances.filter(f => f.category === 'session' && f.type === 'in').reduce((s, f) => s + f.value, 0);
  const totalProducts = filteredFinances.filter(f => f.category === 'product' && f.type === 'in').reduce((s, f) => s + f.value, 0);
  const categoryData = [{ name: 'Sessões', valor: totalSessions }, { name: 'Produtos', valor: totalProducts }];

  const paymentTotal = totalPix + totalCartao + totalDinheiro;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Revenue vs Expenses Evolution */}
      <div className="rounded-2xl border border-border bg-card p-4 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evolução Financeira</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-muted-foreground">Receita</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-[10px] font-bold text-muted-foreground">Despesa</span>
            </div>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evolutionData}>
              <defs>
                <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDespesa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2.5} fill="url(#gradReceita)" />
              <Area type="monotone" dataKey="despesa" stroke="#f87171" strokeWidth={2} fill="url(#gradDespesa)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Distribution */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Métodos de Pagamento</h3>
        {paymentData.length > 0 ? (
          <>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="hsl(var(--card))"
                  >
                    {paymentData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {paymentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black">R$ {item.value.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] text-muted-foreground font-bold">
                      {paymentTotal > 0 ? ((item.value / paymentTotal) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-12">Sem dados</p>
        )}
      </div>

      {/* Categories */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Sessões vs Produtos</h3>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                <Cell fill="#f59e0b" />
                <Cell fill="#8b5cf6" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold text-muted-foreground">Sessões</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            <span className="text-[10px] font-bold text-muted-foreground">Produtos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
