import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Package } from '@/hooks/usePackages';

interface PackageModalProps {
  pkg: Package | null;
  onClose: () => void;
  onSave: (data: Omit<Package, 'id' | 'createdAt' | 'sessionValue'>) => void;
}

export function PackageModal({ pkg, onClose, onSave }: PackageModalProps) {
  const [clientName, setClientName] = useState(pkg?.clientName || '');
  const [clientPhone, setClientPhone] = useState(pkg?.clientPhone || '');
  const [totalSessions, setTotalSessions] = useState(pkg?.totalSessions || 6);
  const [totalValue, setTotalValue] = useState(pkg?.totalValue || 900);
  const [notes, setNotes] = useState(pkg?.notes || '');

  const sessionValue = totalSessions > 0 ? totalValue / totalSessions : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      clientName,
      clientPhone: clientPhone || undefined,
      totalSessions,
      usedSessions: pkg?.usedSessions || 0,
      totalValue,
      status: pkg?.status || 'active',
      notes: notes || undefined,
    });
  };

  return (
    <BronzeCard className="w-full max-w-lg bg-card border-primary/30 rounded-t-[32px] md:rounded-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase">{pkg ? 'Editar Pacote' : 'Novo Pacote'}</h3>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground"><X size={24} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nome da Cliente *</label>
          <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="input-bronze" required placeholder="Nome da cliente" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">WhatsApp</label>
          <input type="text" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="input-bronze" placeholder="(00) 00000-0000" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Qtd Sessões *</label>
            <input type="number" min={1} value={totalSessions} onChange={e => setTotalSessions(Number(e.target.value))} className="input-bronze" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Valor Total (R$) *</label>
            <input type="number" min={0} step="0.01" value={totalValue} onChange={e => setTotalValue(Number(e.target.value))} className="input-bronze" required />
          </div>
        </div>

        {/* Price per session */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
          <p className="text-[10px] font-black uppercase text-muted-foreground">Valor por Sessão</p>
          <p className="text-2xl font-black text-primary">R$ {sessionValue.toFixed(2)}</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Observações</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-bronze min-h-[80px] resize-none" placeholder="Observações sobre o pacote..." />
        </div>

        <BronzeButton type="submit" variant="gold" icon={CheckCircle2} className="w-full h-[60px]">
          {pkg ? 'Salvar Alterações' : 'Criar Pacote'}
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}
