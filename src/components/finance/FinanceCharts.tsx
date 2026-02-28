import { useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Cell } from 'recharts';
import { Finance, Appointment } from '@/types';

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

const FuturesTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-black text-blue-500">
        R$ {Number(payload[0].value).toLocaleString('pt-BR')}
      </p>
      {payload[0]?.payload?.count > 0 && (
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {payload[0].payload.count} agendamento{payload[0].payload.count > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

interface FinanceChartsProps {
  finances: Finance[];
  appointments: Appointment[];
  selectedMonth: number;
  selectedYear: number;
  monthNames: string[];
}

export function FinanceCharts({
  finances, appointments, selectedMonth, selectedYear, monthNames,
}: FinanceChartsProps) {
  // Evolution data (6 months back)
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

  // Futures data: projected revenue from future scheduled appointments (3 months ahead)
  const futuresData = useMemo(() => {
    const today = new Date();
    const todayIso = today.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    const data = [];

    for (let i = 0; i < 3; i++) {
      let m = selectedMonth + i;
      let y = selectedYear;
      while (m > 11) { m -= 12; y++; }

      const futureAppos = appointments.filter(a => {
        let aMonth: number, aYear: number, isoDate: string;
        if (a.date.includes('/')) {
          const parts = a.date.split('/');
          aMonth = parseInt(parts[1], 10) - 1;
          aYear = parseInt(parts[2], 10);
          isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
          const parts = a.date.split('-');
          aMonth = parseInt(parts[1], 10) - 1;
          aYear = parseInt(parts[0], 10);
          isoDate = a.date;
        }
        return aMonth === m && aYear === y && isoDate > todayIso && a.status !== 'Concluído';
      });

      const projetado = futureAppos.reduce((s, a) => s + (a.chargedValue || a.totalValue || a.value), 0);
      data.push({
        month: monthNames[m].substring(0, 3),
        projetado,
        count: futureAppos.length,
      });
    }
    return data;
  }, [appointments, selectedMonth, selectedYear, monthNames]);

  const totalFuturos = futuresData.reduce((s, d) => s + d.projetado, 0);

  return (
    <div className="space-y-4">
      {/* Evolution Chart */}
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

      {/* Futures Chart */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Projeção Futura</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Baseado nos agendamentos futuros</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-blue-500 tabular-nums">
              R$ {totalFuturos.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-muted-foreground font-bold">Total projetado</p>
          </div>
        </div>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={futuresData} barCategoryGap="25%">
              <defs>
                <linearGradient id="gradFuturos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<FuturesTooltip />} />
              <Bar dataKey="projetado" fill="url(#gradFuturos)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
