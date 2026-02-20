import { useState } from 'react';
import { X, Receipt } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Finance } from '@/types';

interface ExpenseModalProps {
  onClose: () => void;
  onSave: (finance: Omit<Finance, 'id'>) => void;
}

const expenseCategories = [
  'Aluguel',
  'Energia',
  'Água',
  'Internet',
  'Material de Limpeza',
  'Insumos',
  'Marketing',
  'Manutenção',
  'Salários',
  'Impostos',
  'Outros',
];

export function ExpenseModal({ onClose, onSave }: ExpenseModalProps) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>('Pix');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [y, m, d] = date.split('-');
    onSave({
      type: 'out',
      description: selectedCategory ? `${selectedCategory} - ${description}` : description,
      value,
      category: 'expense',
      paymentMethod,
      isPartnership: false,
      date: `${d}/${m}/${y}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
      <BronzeCard className="w-full max-w-lg bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
          <h3 className="text-xl font-black uppercase flex items-center gap-2">
            <Receipt size={22} className="text-red-500" />
            Nova Despesa
          </h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={32} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Quick Category Chips */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-muted-foreground">Categoria Rápida</label>
            <div className="flex flex-wrap gap-2">
              {expenseCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedCategory === cat
                      ? 'bg-red-500/10 border-red-500/50 text-red-600'
                      : 'bg-secondary border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-muted-foreground">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Conta de luz dezembro"
              className="input-bronze"
              required
            />
          </div>

          {/* Value & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-muted-foreground">Valor (R$)</label>
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
              <label className="text-[9px] font-black uppercase text-muted-foreground">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-bronze"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-muted-foreground">Forma de Pagamento</label>
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

          <BronzeButton className="w-full h-[60px]" variant="gold" type="submit" icon={Receipt}>
            Salvar Despesa
          </BronzeButton>
        </form>
      </BronzeCard>
    </div>
  );
}
