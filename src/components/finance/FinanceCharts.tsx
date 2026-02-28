import { useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
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

interface FinanceChartsProps {
  finances: Finance[];
  selectedMonth: number;
  selectedYear: number;
  monthNames: string[];
}

export function FinanceCharts({
  finances, selectedMonth, selectedYear, monthNames,
}: FinanceChartsProps) {
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

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evolução Financeira</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-muted-foreground">Receita</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-[10px] font-bold text-muted-foreground">Despesa</span>
          </div>
        </div>
      </div>
      <div className="h-[220px]">
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
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2.5} fill="url(#gradReceita)" />
            <Area type="monotone" dataKey="despesa" stroke="#f87171" strokeWidth={2} fill="url(#gradDespesa)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
