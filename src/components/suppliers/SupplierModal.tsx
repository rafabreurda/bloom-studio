import { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Supplier } from '@/types';

interface SupplierModalProps {
  supplier: Supplier | null;
  onClose: () => void;
  onSave: (supplier: Omit<Supplier, 'id'>) => void;
}

export function SupplierModal({ supplier, onClose, onSave }: SupplierModalProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [products, setProducts] = useState('');

  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setContact(supplier.contact);
      setProducts(supplier.products);
    }
  }, [supplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      contact,
      products,
    });
    onClose();
  };

  return (
    <BronzeCard className="w-full max-w-md bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase">
          {supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
        </h3>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Nome da Empresa *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-bronze"
            placeholder="Ex: Bronze & Cia"
            required
          />
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

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Produtos que Fornece *
          </label>
          <textarea
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            className="input-bronze min-h-[80px] resize-none"
            placeholder="Ex: Óleos bronzeadores, hidratantes, etc."
            required
          />
        </div>

        <BronzeButton
          type="submit"
          variant="gold"
          icon={CheckCircle2}
          className="w-full h-[60px]"
        >
          {supplier ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}