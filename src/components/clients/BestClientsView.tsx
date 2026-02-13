import { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, MessageSquare, Crown, AlertTriangle } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Client, Appointment, WhatsAppTemplate } from '@/types';

interface BestClientsViewProps {
  clients: Client[];
  appointments: Appointment[];
  inactivityDays: number;
  onInactivityDaysChange: (days: number) => void;
  whatsappTemplates: WhatsAppTemplate[];
}

interface ClientStats {
  client: Client;
  totalSessions: number;
  totalSpent: number;
  lastSessionDate: string | null;
  daysSinceLastSession: number | null;
  isInactive: boolean;
}

export function BestClientsView({ clients, appointments, inactivityDays, onInactivityDaysChange, whatsappTemplates }: BestClientsViewProps) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'top' | 'inactive'>('top');

  const clientStats: ClientStats[] = useMemo(() => {
    const now = new Date();
    return clients.map(client => {
      const clientAppts = appointments.filter(a =>
        a.clientName.toLowerCase() === client.name.toLowerCase() ||
        (a.phone && a.phone === client.phone)
      );

      const totalSessions = clientAppts.length;
      const totalSpent = clientAppts.reduce((sum, a) => sum + (a.chargedValue || a.totalValue || 0), 0);

      // Find last session date
      let lastSessionDate: string | null = null;
      let daysSinceLastSession: number | null = null;

      if (clientAppts.length > 0) {
        const dates = clientAppts.map(a => {
          const parts = a.date.split('/');
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }).sort((a, b) => b.getTime() - a.getTime());

        lastSessionDate = dates[0].toLocaleDateString('pt-BR');
        daysSinceLastSession = Math.floor((now.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24));
      }

      return {
        client,
        totalSessions,
        totalSpent,
        lastSessionDate,
        daysSinceLastSession,
        isInactive: daysSinceLastSession !== null ? daysSinceLastSession >= inactivityDays : (totalSessions === 0),
      };
    });
  }, [clients, appointments, inactivityDays]);

  const displayedClients = useMemo(() => {
    let result = view === 'top'
      ? [...clientStats].sort((a, b) => b.totalSessions - a.totalSessions)
      : [...clientStats].filter(c => c.isInactive).sort((a, b) => (b.daysSinceLastSession || 999) - (a.daysSinceLastSession || 999));

    if (search) {
      result = result.filter(c => c.client.name.toLowerCase().includes(search.toLowerCase()));
    }

    return result;
  }, [clientStats, view, search]);

  const sendWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const msg = `Olá ${name}! Sentimos sua falta! 🌞 Que tal agendar uma sessão de bronzeamento? Estamos com horários disponíveis!`;
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} className="input-bronze pl-9 w-full text-sm" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('top')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'top' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
            <Crown size={14} /> Top Clientes
          </button>
          <button onClick={() => setView('inactive')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'inactive' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-muted-foreground'}`}>
            <AlertTriangle size={14} /> Inativas
          </button>
        </div>
      </div>

      {/* Inactivity config */}
      {view === 'inactive' && (
        <div className="flex items-center gap-3 p-3 bg-secondary rounded-2xl border border-border">
          <label className="text-[10px] font-black uppercase text-muted-foreground whitespace-nowrap">Inativa após:</label>
          <select value={inactivityDays} onChange={e => onInactivityDaysChange(Number(e.target.value))} className="input-bronze text-sm flex-1">
            <option value={15}>15 dias</option>
            <option value={30}>30 dias</option>
            <option value={45}>45 dias</option>
            <option value={60}>60 dias</option>
            <option value={90}>90 dias</option>
          </select>
        </div>
      )}

      {/* Client stats list */}
      <div className="space-y-2">
        {displayedClients.map((cs, i) => (
          <BronzeCard key={cs.client.id} className={`bg-secondary/50 p-3 flex items-center gap-3 ${cs.isInactive && view === 'inactive' ? 'border-l-4 border-l-destructive' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${view === 'top' && i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {view === 'top' ? i + 1 : <AlertTriangle size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm truncate">{cs.client.name}</p>
              <div className="flex gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><TrendingUp size={10} /> {cs.totalSessions} sessões</span>
                <span>R$ {cs.totalSpent.toFixed(0)}</span>
                {cs.lastSessionDate && (
                  <span className="flex items-center gap-1">
                    {cs.daysSinceLastSession !== null && cs.daysSinceLastSession > 0 ? (
                      <><TrendingDown size={10} className="text-destructive" /> {cs.daysSinceLastSession}d atrás</>
                    ) : 'Recente'}
                  </span>
                )}
              </div>
            </div>
            {view === 'inactive' && cs.client.phone && (
              <button
                onClick={() => sendWhatsApp(cs.client.phone, cs.client.name)}
                className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shrink-0"
                title="Enviar mensagem de engajamento"
              >
                <MessageSquare size={16} />
              </button>
            )}
          </BronzeCard>
        ))}

        {displayedClients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="font-bold text-sm">{view === 'top' ? 'Nenhum cliente encontrado' : 'Nenhuma cliente inativa'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
