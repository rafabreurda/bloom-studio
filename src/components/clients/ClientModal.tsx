import { useState, useEffect } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Client } from '@/types';

interface ClientModalProps {
  client: Client | null;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'createdAt'>) => void;
}

export function ClientModal({ client, onClose, onSave }: ClientModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [notes, setNotes] = useState('');
  const [isVIP, setIsVIP] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
      setEmail(client.email || '');
      setBirthday(client.birthday || '');
      setNotes(client.notes || '');
      setIsVIP(client.isVIP);
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      phone,
      email: email || undefined,
      birthday: birthday || undefined,
      notes: notes || undefined,
      isVIP,
    });
    onClose();
  };

  return (
    <BronzeCard className="w-full max-w-lg bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase">
          {client ? 'Editar Cliente' : 'Novo Cliente'}
        </h3>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Nome *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-bronze"
            placeholder="Nome do cliente"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            WhatsApp *
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-bronze"
            placeholder="11999887766"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-bronze"
            placeholder="email@exemplo.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Aniversário
          </label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="input-bronze"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Observações
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-bronze min-h-[80px] resize-none"
            placeholder="Anotações sobre o cliente..."
          />
        </div>

        <label className="flex items-center gap-3 p-4 bg-secondary rounded-2xl border border-border cursor-pointer hover:bg-secondary/80 transition-all">
          <input
            type="checkbox"
            className="hidden"
            checked={isVIP}
            onChange={(e) => setIsVIP(e.target.checked)}
          />
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isVIP ? 'bg-primary border-primary shadow-xl' : 'border-muted-foreground'}`}>
            <Star size={16} fill={isVIP ? 'black' : 'transparent'} className={isVIP ? 'text-primary-foreground' : 'text-muted-foreground'} />
          </div>
          <span className={`text-sm font-black uppercase ${isVIP ? 'text-primary' : 'text-muted-foreground'}`}>
            Cliente VIP
          </span>
        </label>

        <BronzeButton
          type="submit"
          variant="gold"
          icon={CheckCircle2}
          className="w-full h-[60px]"
        >
          {client ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}