import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Finance } from '@/types';

interface FinanceModalProps {
  onClose: () => void;
  onSave: (finance: Omit<Finance, 'id'>) => void;
}

export function FinanceModal({ onClose, onSave }: FinanceModalProps) {
  const [type, setType] = useState<'in' | 'out'>('in');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<number>(0);
  const [category, setCategory] = useState<'session' | 'product' | 'partnership' | 'expense'>('session');
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>('Pix');
  const [isPartnership, setIsPartnership] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      type,
      description,
      value,
      category,
      paymentMethod,
      isPartnership,
      date: new Date(date).toLocaleDateString('pt-BR'),
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
      <BronzeCard className="w-full max-w-lg bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
          <h3 className="text-xl font-black uppercase">Nova Entrada</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={32} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('in')}
              className={`p-4 rounded-2xl border-2 font-black uppercase text-sm transition-all ${
                type === 'in' 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' 
                  : 'bg-secondary border-border text-muted-foreground'
              }`}
            >
              + Receita
            </button>
            <button
              type="button"
              onClick={() => setType('out')}
              className={`p-4 rounded-2xl border-2 font-black uppercase text-sm transition-all ${
                type === 'out' 
                  ? 'bg-red-500/10 border-red-500 text-red-600' 
                  : 'bg-secondary border-border text-muted-foreground'
              }`}
            >
              - Despesa
            </button>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-muted-foreground">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Sessão de bronzeamento"
              className="input-bronze"
              required
            />
          </div>

          {/* Value & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-muted-foreground">
                Valor (R$)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="input-bronze"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-muted-foreground">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-bronze"
                required
              />
            </div>
          </div>

          {/* Category & Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-muted-foreground">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'session' | 'product' | 'partnership' | 'expense')}
                className="input-bronze"
              >
                <option value="session">Sessão</option>
                <option value="product">Produto</option>
                <option value="partnership">Parceria</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-muted-foreground">
                Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'Pix' | 'Cartão' | 'Dinheiro')}
                className="input-bronze"
              >
                <option value="Pix">Pix</option>
                <option value="Cartão">Cartão</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
          </div>

          {/* Partnership Toggle */}
          <label className="flex items-center gap-3 p-4 bg-secondary rounded-2xl border border-border/10 cursor-pointer hover:bg-muted transition-all">
            <input
              type="checkbox"
              checked={isPartnership}
              onChange={(e) => setIsPartnership(e.target.checked)}
              className="w-5 h-5 rounded border-border"
            />
            <span className="text-sm font-bold text-foreground">É de parceria?</span>
          </label>

          {/* Submit */}
          <BronzeButton
            className="w-full h-[60px]"
            variant="gold"
            type="submit"
            icon={DollarSign}
          >
            Salvar Entrada
          </BronzeButton>
        </form>
      </BronzeCard>
    </div>
  );
}
