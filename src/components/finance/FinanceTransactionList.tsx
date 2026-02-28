import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Finance } from '@/types';

interface FinanceTransactionListProps {
  finances: Finance[];
}

export function FinanceTransactionList({ finances }: FinanceTransactionListProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transações do Mês</h3>
      </div>
      <div className="divide-y divide-border/50">
        {finances.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-12">Nenhuma transação neste mês</p>
        )}
        {finances.map(f => (
          <div key={f.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${f.type === 'in' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                {f.type === 'in' ? (
                  <ArrowUpRight size={14} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">{f.description}</p>
                <p className="text-[11px] text-muted-foreground">{f.date} • {f.paymentMethod}</p>
              </div>
            </div>
            <span className={`font-black tabular-nums ${f.type === 'in' ? 'text-emerald-500' : 'text-red-500'}`}>
              {f.type === 'in' ? '+' : '-'}R$ {f.value.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
