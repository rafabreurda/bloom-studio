import { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Partnership } from '@/types';

interface PartnershipModalProps {
  partnership: Partnership | null;
  onClose: () => void;
  onSave: (partnership: Omit<Partnership, 'id'>) => void;
}

export function PartnershipModal({ partnership, onClose, onSave }: PartnershipModalProps) {
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState(10);
  const [contact, setContact] = useState('');

  useEffect(() => {
    if (partnership) {
      setName(partnership.name);
      setDiscount(partnership.discount);
      setContact(partnership.contact);
    }
  }, [partnership]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      discount,
      contact,
    });
    onClose();
  };

  return (
    <BronzeCard className="w-full max-w-md bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase">
          {partnership ? 'Editar Parceria' : 'Nova Parceria'}
        </h3>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Nome do Parceiro *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-bronze"
            placeholder="Ex: Academia Fitness Pro"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Desconto (%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="input-bronze"
            min="0"
            max="100"
          />
          <p className="text-[9px] text-muted-foreground/60">
            Percentual de desconto oferecido aos clientes desta parceria
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            WhatsApp / Telefone *
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="input-bronze"
            placeholder="11999887766"
            required
          />
        </div>

        <BronzeButton
          type="submit"
          variant="gold"
          icon={CheckCircle2}
          className="w-full h-[60px]"
        >
          {partnership ? 'Salvar Alterações' : 'Cadastrar Parceria'}
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}