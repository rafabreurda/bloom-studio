import { useState } from 'react';
import { Plus, Trash2, Edit2, UserPlus, X, CheckCircle2, Crown, User } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminsCRUD } from '@/hooks/useAdminsCRUD';
import { AdminWithRole, getDisplayRole } from '@/types/admin';

interface AdminSectionProps {}

export function AdminSection({}: AdminSectionProps) {
  const { admins, refreshAdmins, currentAdmin } = useAuth();
  const { createAdmin, updateAdmin, deleteAdmin, isLoading } = useAdminsCRUD();
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminWithRole | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const openAddModal = () => {
    setEditingAdmin(null);
    setName('');
    setPhone('');
    setShowModal(true);
  };

  const openEditModal = (admin: AdminWithRole) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setPhone(admin.phone || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAdmin) {
      const success = await updateAdmin(editingAdmin.id, { name, phone, role: 'Admin Pleno' });
      if (success) {
        await refreshAdmins();
        setShowModal(false);
      }
    } else {
      const success = await createAdmin({ name, phone, role: 'Admin Pleno' });
      if (success) {
        await refreshAdmins();
        setShowModal(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAdmin(id);
    if (success) {
      await refreshAdmins();
    }
  };

  // Filter admins: only show pleno (chefe/mestre is shown separately)
  const plenoAdmins = admins.filter(a => a.role === 'admin_pleno');

  return (
    <>
      <BronzeCard className="bg-secondary/50 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black uppercase text-primary">Administradores</h3>
          <BronzeButton variant="gold" icon={UserPlus} size="sm" onClick={openAddModal}>
            Adicionar
          </BronzeButton>
        </div>

        <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl">
          <p className="text-xs font-bold text-primary">
            👑 Admin Mestre (Você): Acesso total ao sistema + gerencia todos os administradores
          </p>
        </div>

        {/* Admin Pleno Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-black uppercase text-muted-foreground">Admin Pleno</h4>
          <p className="text-xs text-muted-foreground">
            Acesso completo às funcionalidades de rotina, exceto Configurações.
          </p>
          
          {plenoAdmins.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Nenhum Admin Pleno cadastrado</p>
          ) : (
            <div className="space-y-2">
              {plenoAdmins.map(admin => (
                <div key={admin.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                  <div>
                    <p className="font-bold text-sm">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">{admin.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(admin)} className="p-2 text-muted-foreground hover:text-primary">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(admin.id)} className="p-2 text-muted-foreground hover:text-destructive" disabled={isLoading}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </BronzeCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <BronzeCard className="w-full max-w-md bg-card border-primary/30 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h3 className="text-xl font-black uppercase">
                {editingAdmin ? 'Editar Admin' : 'Novo Admin Pleno'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-muted-foreground hover:text-foreground">
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
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-bronze"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <BronzeButton
                type="submit"
                variant="gold"
                icon={CheckCircle2}
                className="w-full h-[60px]"
              >
                {editingAdmin ? 'Salvar Alterações' : 'Adicionar Admin Pleno'}
              </BronzeButton>
            </form>
          </BronzeCard>
        </div>
      )}
    </>
  );
}
