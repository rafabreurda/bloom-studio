import { DollarSign, TrendingDown, TrendingUp, Sparkles, CreditCard, Banknote, Handshake, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface SummaryCard {
  label: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
  key: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface FinanceDashboardCardsProps {
  totalReceita: number;
  totalCustos: number;
  totalDespesas: number;
  totalLucro: number;
  totalCartao: number;
  totalPix: number;
  totalDinheiro: number;
  totalParcerias: number;
  onCardClick: (key: string) => void;
}

export function FinanceDashboardCards({
  totalReceita, totalCustos, totalDespesas, totalLucro,
  totalCartao, totalPix, totalDinheiro, totalParcerias,
  onCardClick,
}: FinanceDashboardCardsProps) {
  const mainCards: SummaryCard[] = [
    { label: 'Receita Total', value: totalReceita, icon: DollarSign, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', key: 'receita', trend: 'up' },
    { label: 'Custos', value: totalCustos, icon: TrendingDown, color: 'text-orange-500', bgColor: 'bg-orange-500/10', key: 'custos', trend: 'down' },
    { label: 'Despesas', value: totalDespesas, icon: Receipt, color: 'text-red-500', bgColor: 'bg-red-500/10', key: 'despesas', trend: 'down' },
    { label: 'Lucro Líquido', value: totalLucro, icon: Sparkles, color: totalLucro >= 0 ? 'text-emerald-500' : 'text-red-500', bgColor: totalLucro >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10', key: 'lucro', trend: totalLucro >= 0 ? 'up' : 'down' },
  ];

  const paymentCards: SummaryCard[] = [
    { label: 'Cartão', value: totalCartao, icon: CreditCard, color: 'text-blue-500', bgColor: 'bg-blue-500/10', key: 'cartao' },
    { label: 'Pix', value: totalPix, icon: TrendingUp, color: 'text-amber-500', bgColor: 'bg-amber-500/10', key: 'pix' },
    { label: 'Dinheiro', value: totalDinheiro, icon: Banknote, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', key: 'dinheiro' },
    { label: 'Parcerias', value: totalParcerias, icon: Handshake, color: 'text-purple-500', bgColor: 'bg-purple-500/10', key: 'parcerias' },
  ];

  const formatCurrency = (v: number) => {
    if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
    return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-3">
      {/* Main KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mainCards.map((card) => (
          <button
            key={card.key}
            onClick={() => onCardClick(card.key)}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left transition-all hover:shadow-lg hover:border-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${card.bgColor} ${card.color} p-2 rounded-xl`}>
                <card.icon size={18} />
              </div>
              {card.trend && (
                <div className={`flex items-center gap-0.5 text-[10px] font-bold ${card.trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>
                  {card.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </div>
              )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{card.label}</p>
            <p className={`text-lg md:text-xl font-black tabular-nums ${card.color}`}>
              {formatCurrency(card.value)}
            </p>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/5 pointer-events-none" />
          </button>
        ))}
      </div>

      {/* Payment Methods Row */}
      <div className="grid grid-cols-4 gap-2">
        {paymentCards.map((card) => (
          <button
            key={card.key}
            onClick={() => onCardClick(card.key)}
            className="group rounded-xl border border-border bg-card/50 p-3 text-center transition-all hover:shadow-md hover:border-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className={`${card.bgColor} ${card.color} p-1.5 rounded-lg mx-auto w-fit mb-1.5`}>
              <card.icon size={14} />
            </div>
            <p className="text-[9px] font-bold uppercase text-muted-foreground">{card.label}</p>
            <p className="text-sm font-black tabular-nums">{formatCurrency(card.value)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
