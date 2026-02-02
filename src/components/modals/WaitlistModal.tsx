import { X } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { WaitingItem } from '@/types';

interface WaitlistModalProps {
  onClose: () => void;
  onAdd: (item: Omit<WaitingItem, 'id' | 'createdAt'>) => void;
}

export function WaitlistModal({ onClose, onAdd }: WaitlistModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onAdd({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      desiredDate: formData.get('date') as string,
      status: 'Aguardando',
    });
    
    onClose();
  };

  return (
    <BronzeCard className="w-full max-w-md bg-card border-primary/30 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase">Fila de Espera</h3>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          name="name"
          type="text"
          placeholder="Nome"
          className="input-bronze"
          required
        />

        {/* Phone */}
        <input
          name="phone"
          type="text"
          placeholder="WhatsApp"
          className="input-bronze"
          required
        />

        {/* Desired Date */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-muted-foreground">
            Data Desejada
          </label>
          <input
            name="date"
            type="date"
            className="input-bronze"
            required
          />
        </div>

        {/* Submit */}
        <BronzeButton variant="gold" className="w-full h-[60px]" type="submit">
          Cadastrar
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}
