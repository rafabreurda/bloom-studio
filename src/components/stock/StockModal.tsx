import { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { StockItem } from '@/types';

interface StockModalProps {
  item: StockItem | null;
  onClose: () => void;
  onSave: (item: Omit<StockItem, 'id'>) => void;
}

export function StockModal({ item, onClose, onSave }: StockModalProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [minStock, setMinStock] = useState(5);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setPrice(item.price);
      setMinStock(item.minStock);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      quantity,
      price,
      minStock,
    });
    onClose();
  };

  return (
    <BronzeCard className="w-full max-w-md bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase">
          {item ? 'Editar Produto' : 'Novo Produto'}
        </h3>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Nome do Produto *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-bronze"
            placeholder="Ex: Óleo Bronzeador"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Quantidade
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input-bronze"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Preço (R$)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="input-bronze"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Estoque Mínimo (alerta)
          </label>
          <input
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            className="input-bronze"
            min="0"
          />
          <p className="text-[9px] text-muted-foreground/60">
            Alerta será exibido quando quantidade ficar abaixo deste valor
          </p>
        </div>

        <BronzeButton
          type="submit"
          variant="gold"
          icon={CheckCircle2}
          className="w-full h-[60px]"
        >
          {item ? 'Salvar Alterações' : 'Cadastrar Produto'}
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}