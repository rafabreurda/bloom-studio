import { useState, useMemo, useRef } from 'react';
import { Search, Plus, Star, Phone, Edit2, Trash2, User, Handshake, ChevronLeft, ChevronRight } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Client, ClientTag, Partnership } from '@/types';
import { ClientModal } from './ClientModal';
import { ClientHistoryModal } from './ClientHistoryModal';

interface ClientsViewProps {
  clients: Client[];
  tags: ClientTag[];
  partnerships: Partnership[];
  onAddClient: (client: Omit<Client, 'id' | 'createdAt' | 'history'>) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export function ClientsView({ clients, tags, partnerships, onAddClient, onEditClient, onDeleteClient }: ClientsViewProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    clients.forEach(c => {
      const first = c.name.trim().charAt(0).toUpperCase();
      if (first) letters.add(first);
    });
    return letters;
  }, [clients]);

  const filteredClients = useMemo(() => {
    let result = [...clients];
    if (search) {
      result = result.filter(client =>
        client.name.toLowerCase().includes(search.toLowerCase()) || client.phone.includes(search)
      );
    }
    if (selectedLetter) {
      result = result.filter(client =>
        client.name.trim().charAt(0).toUpperCase() === selectedLetter
      );
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, search, selectedLetter]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: direction === 'left' ? -120 : 120, behavior: 'smooth' });
    }
  };

  const handleSave = (clientData: Omit<Client, 'id' | 'createdAt' | 'history'>) => {
    if (editingClient) {
      onEditClient({ ...editingClient, ...clientData });
    } else {
      onAddClient(clientData);
    }
    setShowModal(false);
    setEditingClient(null);
  };

  const openWhatsApp = (phone: string) => {
    window.open(`https://wa.me/55${phone.replace(/\D/g, '')}`, '_blank');
  };

  const getTagById = (tagId: string) => tags.find(t => t.id === tagId);
  const getPartnershipById = (pId: string) => partnerships.find(p => p.id === pId);

  return (
    <div className="space-y-4 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight">Clientes</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-bronze pl-10 w-full" />
          </div>
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={() => { setEditingClient(null); setShowModal(true); }}>Novo</BronzeButton>
        </div>
      </div>

      {/* Alphabet tabs */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => scrollTabs('left')}
          className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
        >
          <ChevronLeft size={16} />
        </button>
        <div
          ref={tabsRef}
          className="flex gap-1 overflow-x-auto scrollbar-none flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={() => setSelectedLetter(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              selectedLetter === null
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            TODOS
          </button>
          {alphabet.map(letter => {
            const hasClients = availableLetters.has(letter);
            return (
              <button
                key={letter}
                onClick={() => hasClients && setSelectedLetter(letter)}
                disabled={!hasClients}
                className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  selectedLetter === letter
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : hasClients
                    ? 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    : 'bg-muted/40 text-muted-foreground/30 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => scrollTabs('right')}
          className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Client count */}
      <div className="text-xs text-muted-foreground shrink-0">
        {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''}
        {selectedLetter && <span> com a letra <strong>{selectedLetter}</strong></span>}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-3 pr-2">
        {filteredClients.map(client => {
          const linkedPartnership = client.partnershipId ? getPartnershipById(client.partnershipId) : null;
          return (
            <BronzeCard key={client.id} className={`bg-secondary/50 flex flex-col md:flex-row md:items-center justify-between gap-4 ${client.isVIP ? 'vip-border vip-glow' : linkedPartnership ? 'border-l-4 border-l-violet-500' : ''}`}>
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${client.isVIP ? 'bg-primary' : linkedPartnership ? 'bg-violet-100' : 'bg-muted'}`}>
                  {client.isVIP ? <Star size={20} className="text-primary-foreground" fill="currentColor" /> : linkedPartnership ? <Handshake size={20} className="text-violet-600" /> : <User size={20} className="text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <button onClick={() => setViewingClient(client)} className="font-black text-foreground hover:text-primary transition-colors text-left truncate block w-full">
                    {client.name}
                    {client.isVIP && <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full">VIP</span>}
                    {linkedPartnership && <span className="ml-2 px-2 py-0.5 bg-violet-100 text-violet-600 text-[10px] font-bold rounded-full flex-inline items-center gap-1"><Handshake size={10} className="inline" /> {linkedPartnership.name}</span>}
                  </button>
                  <p className="text-xs text-muted-foreground truncate">{client.phone}</p>
                  {client.tags?.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{client.tags.slice(0, 3).map(tagId => { const tag = getTagById(tagId); return tag ? <span key={tagId} className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: tag.color }}>{tag.name}</span> : null; })}</div>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openWhatsApp(client.phone)} className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><Phone size={18} /></button>
                <button onClick={() => { setEditingClient(client); setShowModal(true); }} className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"><Edit2 size={18} /></button>
                <button onClick={() => onDeleteClient(client.id)} className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all"><Trash2 size={18} /></button>
              </div>
            </BronzeCard>
          );
        })}
        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <User size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">Nenhum cliente encontrado</p>
            <p className="text-sm mt-1">
              {selectedLetter ? `Nenhum cliente com a letra "${selectedLetter}"` : 'Tente buscar por outro nome ou telefone'}
            </p>
          </div>
        )}
      </div>
      {showModal && <div className="fixed inset-0 bg-black/80 z-[100] flex items-end md:items-center justify-center"><ClientModal client={editingClient} tags={tags} partnerships={partnerships} onClose={() => { setShowModal(false); setEditingClient(null); }} onSave={handleSave} /></div>}
      {viewingClient && <ClientHistoryModal client={viewingClient} tags={tags} onClose={() => setViewingClient(null)} />}
    </div>
  );
}
