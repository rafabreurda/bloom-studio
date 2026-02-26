import { useState } from 'react';
import { Search, Plus, Package as PackageIcon, Trash2, Edit2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { ImportDataButton, transforms } from '@/components/ui/ImportDataButton';
import { PackageModal } from './PackageModal';
import { Package } from '@/hooks/usePackages';

interface PackagesViewProps {
  packages: Package[];
  onAdd: (pkg: Omit<Package, 'id' | 'createdAt' | 'sessionValue'>) => Promise<any>;
  onUpdate: (pkg: Package) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUseSession: (id: string) => Promise<void>;
  onRefetch?: () => void;
}

export function PackagesView({ packages, onAdd, onUpdate, onDelete, onUseSession, onRefetch }: PackagesViewProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filtered = packages.filter(p => {
    const matchSearch = p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = async (data: Omit<Package, 'id' | 'createdAt' | 'sessionValue'>) => {
    if (editingPackage) {
      await onUpdate({ ...editingPackage, ...data });
    } else {
      await onAdd(data);
    }
    setShowModal(false);
    setEditingPackage(null);
  };

  const handleRenew = (pkg: Package) => {
    setEditingPackage(null);
    setShowModal(true);
    // Pre-fill will be handled by modal with renewFrom prop
  };

  return (
    <div className="h-full flex flex-col overflow-hidden gap-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Pacotes</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input type="text" placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-bronze pl-9 w-full text-sm" />
          </div>
          <ImportDataButton
            table="packages"
            label="Pacotes"
            columns={[
              { candidates: ['cliente', 'nome', 'client', 'name'], dbColumn: 'client_name', fallback: 'Sem nome' },
              { candidates: ['telefone', 'phone', 'celular'], dbColumn: 'client_phone', transform: transforms.phone },
              { candidates: ['sessões', 'sessoes', 'total', 'sessions'], dbColumn: 'total_sessions', transform: transforms.number },
              { candidates: ['usadas', 'used', 'utilizadas'], dbColumn: 'used_sessions', transform: transforms.number },
              { candidates: ['valor', 'value', 'preço', 'total_value'], dbColumn: 'total_value', transform: transforms.number },
              { candidates: ['observação', 'obs', 'notes', 'nota'], dbColumn: 'notes' },
            ]}
            onImportComplete={() => onRefetch?.()}
          />
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={() => { setEditingPackage(null); setShowModal(true); }}>Novo</BronzeButton>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 shrink-0">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Finalizados'}
          </button>
        ))}
      </div>

      {/* Package list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-3 pr-2">
        {filtered.map(pkg => {
          const remaining = pkg.totalSessions - pkg.usedSessions;
          const progress = (pkg.usedSessions / pkg.totalSessions) * 100;
          const isComplete = pkg.status === 'completed';

          return (
            <BronzeCard key={pkg.id} className={`bg-secondary/50 p-4 space-y-3 ${isComplete ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isComplete ? 'bg-muted' : 'bg-primary'}`}>
                    <PackageIcon size={18} className={isComplete ? 'text-muted-foreground' : 'text-primary-foreground'} />
                  </div>
                  <div>
                    <p className="font-black text-sm">{pkg.clientName}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {pkg.usedSessions}/{pkg.totalSessions} sessões • R$ {pkg.totalValue.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isComplete && (
                    <button onClick={() => onUseSession(pkg.id)} className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all" title="Usar sessão">
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  {isComplete && (
                    <button onClick={() => handleRenew(pkg)} className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all" title="Renovar pacote">
                      <RefreshCw size={16} />
                    </button>
                  )}
                  <button onClick={() => { setEditingPackage(pkg); setShowModal(true); }} className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                    <Edit2 size={16} />
                  </button>
                  <ConfirmDeleteDialog
                    description="Tem certeza que deseja excluir este pacote?"
                    onConfirm={() => onDelete(pkg.id)}
                    trigger={
                      <button className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all">
                        <Trash2 size={16} />
                      </button>
                    }
                  />
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isComplete ? 'bg-muted-foreground' : 'bg-primary'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{remaining} restante{remaining !== 1 ? 's' : ''}</span>
                  <span>Valor/sessão: R$ {pkg.sessionValue.toFixed(2)}</span>
                </div>
              </div>

              {pkg.notes && (
                <p className="text-[10px] text-muted-foreground italic">{pkg.notes}</p>
              )}
            </BronzeCard>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <PackageIcon size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">Nenhum pacote encontrado</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
          <PackageModal
            pkg={editingPackage}
            onClose={() => { setShowModal(false); setEditingPackage(null); }}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  );
}
