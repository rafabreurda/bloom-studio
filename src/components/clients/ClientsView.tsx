import { useState } from 'react';
import { Plus, Search, Star, MessageSquare, Pencil, Trash2, Cake } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Client } from '@/types';

interface ClientsViewProps {
  clients: Client[];
  onAddClick: () => void;
  onEditClick: (client: Client) => void;
  onDeleteClick: (id: string) => void;
  onSendMessage: (phone: string, name: string) => void;
}

export function ClientsView({
  clients,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onSendMessage,
}: ClientsViewProps) {
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.phone.includes(search)
  );

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (a.isVIP && !b.isVIP) return -1;
    if (!a.isVIP && b.isVIP) return 1;
    return a.name.localeCompare(b.name);
  });

  const formatBirthday = (birthday?: string) => {
    if (!birthday) return null;
    const date = new Date(birthday);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight">Clientes</h2>
        <BronzeButton variant="gold" icon={Plus} size="sm" onClick={onAddClick}>
          Novo Cliente
        </BronzeButton>
      </div>

      <div className="relative shrink-0">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          className="input-bronze pl-12"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 pr-2">
        <div className="grid grid-cols-1 gap-3">
          {sortedClients.map((client) => (
            <BronzeCard
              key={client.id}
              className={`p-4 ${client.isVIP ? 'vip-border vip-glow' : ''}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {client.isVIP && (
                      <Star size={16} className="text-primary shrink-0" fill="currentColor" />
                    )}
                    <h4 className={`font-black text-sm md:text-base truncate ${client.isVIP ? 'text-primary' : 'text-foreground'}`}>
                      {client.name}
                    </h4>
                    {client.isVIP && (
                      <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-black rounded-full shrink-0">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-bold mt-1">
                    {client.phone}
                  </p>
                  {client.email && (
                    <p className="text-[10px] text-muted-foreground/70 truncate">
                      {client.email}
                    </p>
                  )}
                  {client.birthday && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground/70">
                      <Cake size={12} />
                      <span>{formatBirthday(client.birthday)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onSendMessage(client.phone, client.name)}
                    className="w-10 h-10 bg-success/20 text-success rounded-xl flex items-center justify-center hover:bg-success hover:text-success-foreground transition-all"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button
                    onClick={() => onEditClick(client)}
                    className="w-10 h-10 bg-secondary text-muted-foreground rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteClick(client.id)}
                    className="w-10 h-10 bg-destructive/20 text-destructive rounded-xl flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {client.notes && (
                <p className="text-[10px] text-muted-foreground/60 mt-2 italic border-t border-border pt-2">
                  {client.notes}
                </p>
              )}
            </BronzeCard>
          ))}

          {sortedClients.length === 0 && (
            <p className="text-center opacity-30 py-20 font-black uppercase text-xs italic tracking-widest">
              {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}