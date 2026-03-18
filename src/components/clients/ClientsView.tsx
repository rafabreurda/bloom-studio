import { useState, useMemo, useRef } from 'react';
import { Search, Plus, Star, Phone, Edit2, Trash2, User, Handshake, ChevronUp, ChevronDown, Crown, AlertTriangle } from 'lucide-react';
import { ExportButton } from '@/components/ui/ExportButton';
import { ImportClientsButton } from './ImportClientsButton';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Client, ClientTag, Partnership, Appointment, WhatsAppTemplate } from '@/types';
import { ClientModal } from './ClientModal';
import { ClientHistoryModal } from './ClientHistoryModal';
import { BestClientsView } from './BestClientsView';

interface ClientsViewProps {
  clients: Client[];
  tags: ClientTag[];
  partnerships: Partnership[];
  appointments: Appointment[];
  whatsappTemplates: WhatsAppTemplate[];
  onAddClient: (client: Omit<Client, 'id' | 'createdAt' | 'history'>) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onDeleteAllClients?: () => void;
  onSyncFromAppointments?: () => Promise<number | undefined>;
  onRefetch?: () => void;
}

export function ClientsView({ clients, tags, partnerships, appointments, whatsappTemplates, onAddClient, onEditClient, onDeleteClient, onDeleteAllClients, onSyncFromAppointments, onRefetch }: ClientsViewProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'list' | 'analytics'>('list');
  const [inactivityDays, setInactivityDays] = useState(30);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
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

  const scrollTabs = (direction: 'up' | 'down') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ top: direction === 'up' ? -100 : 100, behavior: 'smooth' });
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
    <div className="h-full flex flex-col overflow-hidden gap-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Clientes</h2>
          <div className="flex gap-1">
            <button onClick={() => setSubTab('list')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${subTab === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>Lista</button>
            <button onClick={() => setSubTab('analytics')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 ${subTab === 'analytics' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}><Crown size={12} /> Ranking</button>
          </div>
        </div>
        {subTab === 'list' && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-bronze pl-9 w-full text-sm" />
              </div>
              <ImportClientsButton onImportComplete={() => window.location.reload()} />
              <ExportButton
                fileName="clientes"
                title="Base de Clientes"
                sheetName="Clientes"
                data={filteredClients}
                columns={[
                  { key: 'name', label: 'Nome' },
                  { key: 'phone', label: 'Telefone' },
                  { key: 'email', label: 'E-mail' },
                  { key: 'cpf', label: 'CPF' },
                  { key: 'birthday', label: 'Aniversário' },
                  { key: 'address', label: 'Endereço' },
                  { key: 'isVIP', label: 'VIP' },
                  { key: 'tags', label: 'Tags' },
                  { key: 'notes', label: 'Observações' },
                ]}
              />
            </div>
            <div className="flex gap-2">
              <BronzeButton variant="danger" icon={Trash2} size="sm" onClick={() => setShowDeleteAll(true)}>Apagar Todos</BronzeButton>
              <BronzeButton variant="gold" icon={Plus} size="sm" onClick={() => { setEditingClient(null); setShowModal(true); }}>Adicionar Cliente</BronzeButton>
            </div>
          </div>
        )}
      </div>

      {subTab === 'analytics' ? (
        <BestClientsView
          clients={clients}
          appointments={appointments}
          inactivityDays={inactivityDays}
          onInactivityDaysChange={setInactivityDays}
          whatsappTemplates={whatsappTemplates}
        />
      ) : (
      <>
      {/* Count */}
      <div className="text-xs text-muted-foreground shrink-0">
        {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''}
        {selectedLetter && <span> com a letra <strong>{selectedLetter}</strong></span>}
      </div>

      {/* Main content: vertical alphabet + client list */}
      <div className="flex-1 flex gap-2 overflow-hidden min-h-0">
        {/* Vertical alphabet sidebar */}
        <div className="shrink-0 flex flex-col items-center gap-0.5 py-1">
          <button
            onClick={() => scrollTabs('up')}
            className="w-7 h-6 sm:w-8 sm:h-7 rounded-md bg-muted text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
          >
            <ChevronUp size={14} />
          </button>
          <div
            ref={tabsRef}
            className="flex flex-col gap-0.5 overflow-y-auto flex-1 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setSelectedLetter(null)}
              className={`w-7 sm:w-8 py-1 rounded-md text-[9px] sm:text-[10px] font-bold shrink-0 transition-all ${
                selectedLetter === null
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              ALL
            </button>
            {alphabet.map(letter => {
              const hasClients = availableLetters.has(letter);
              return (
                <button
                  key={letter}
                  onClick={() => hasClients && setSelectedLetter(letter)}
                  disabled={!hasClients}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[10px] sm:text-xs font-bold shrink-0 transition-all ${
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
            onClick={() => scrollTabs('down')}
            className="w-7 h-6 sm:w-8 sm:h-7 rounded-md bg-muted text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Client list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-2 sm:space-y-3 pr-1 sm:pr-2">
          {filteredClients.map(client => {
            const linkedPartnership = client.partnershipId ? getPartnershipById(client.partnershipId) : null;
            return (
              <BronzeCard key={client.id} className={`bg-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 ${client.isVIP ? 'vip-border vip-glow' : linkedPartnership ? 'border-l-4 border-l-violet-500' : ''}`}>
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${client.isVIP ? 'bg-primary' : linkedPartnership ? 'bg-violet-100' : 'bg-muted'}`}>
                    {client.isVIP ? <Star size={18} className="text-primary-foreground" fill="currentColor" /> : linkedPartnership ? <Handshake size={18} className="text-violet-600" /> : <User size={18} className="text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <button onClick={() => setViewingClient(client)} className="font-black text-sm sm:text-base text-foreground hover:text-primary transition-colors text-left truncate block w-full">
                      {client.name}
                      {client.isVIP && <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-[9px] sm:text-[10px] font-bold rounded-full">VIP</span>}
                      {linkedPartnership && <span className="ml-2 px-2 py-0.5 bg-violet-100 text-violet-600 text-[9px] sm:text-[10px] font-bold rounded-full flex-inline items-center gap-1"><Handshake size={10} className="inline" /> {linkedPartnership.name}</span>}
                    </button>
                    <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{client.phone}</p>
                    {client.tags?.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{client.tags.slice(0, 3).map(tagId => { const tag = getTagById(tagId); return tag ? <span key={tagId} className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold text-white" style={{ backgroundColor: tag.color }}>{tag.name}</span> : null; })}</div>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openWhatsApp(client.phone)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><Phone size={16} /></button>
                  <button onClick={() => { setEditingClient(client); setShowModal(true); }} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"><Edit2 size={16} /></button>
                  <ConfirmDeleteDialog
                    description={`Tem certeza que deseja excluir o cliente ${client.name}?`}
                    onConfirm={() => onDeleteClient(client.id)}
                    trigger={
                      <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all"><Trash2 size={16} /></button>
                    }
                  />
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
      </div>
      </>
      )}

      {showModal && <div className="fixed inset-0 bg-black/80 z-[100] flex items-end md:items-center justify-center"><ClientModal client={editingClient} tags={tags} partnerships={partnerships} onClose={() => { setShowModal(false); setEditingClient(null); }} onSave={handleSave} /></div>}
      {viewingClient && <ClientHistoryModal client={viewingClient} tags={tags} onClose={() => setViewingClient(null)} />}
      
      {showDeleteAll && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle size={28} />
              <h3 className="font-black text-lg">Apagar TODOS os Clientes</h3>
            </div>
            <div className="bg-destructive/10 rounded-xl p-4 space-y-2">
              <p className="text-sm font-bold">Esta ação é irreversível!</p>
              <p className="text-sm">Todos os <strong>{clients.length}</strong> clientes serão removidos permanentemente.</p>
              <p className="text-xs text-muted-foreground mt-2">Digite <strong>APAGAR</strong> para confirmar:</p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Digite APAGAR"
                className="input-bronze w-full text-sm mt-1"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <BronzeButton variant="outline" size="sm" onClick={() => { setShowDeleteAll(false); setDeleteConfirmText(''); }}>
                Cancelar
              </BronzeButton>
              <BronzeButton
                variant="danger"
                icon={Trash2}
                size="sm"
                disabled={deleteConfirmText !== 'APAGAR'}
                onClick={() => {
                  onDeleteAllClients?.();
                  setShowDeleteAll(false);
                  setDeleteConfirmText('');
                }}
              >
                Apagar Todos
              </BronzeButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
