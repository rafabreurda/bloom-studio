import { useState } from 'react';
import { Plus, Trash2, Edit2, UserPlus, X, CheckCircle2, Crown, User } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminJuniorPermissions } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminsCRUD } from '@/hooks/useAdminsCRUD';
import { AdminWithRole, getDisplayRole } from '@/types/admin';

interface AdminSectionProps {}

// Map DB permissions to frontend format
function mapDbPermissions(perm: AdminWithRole['permissions']): AdminJuniorPermissions {
  if (!perm) return defaultPermissions;
  return {
    agenda: perm.agenda,
    clientes: perm.clientes,
    estoque: perm.estoque,
    listaEspera: perm.lista_espera,
    financeiro: perm.financeiro,
    fornecedores: perm.fornecedores,
    parcerias: perm.parcerias,
  };
}

const defaultPermissions: AdminJuniorPermissions = {
  agenda: true,
  clientes: true,
  estoque: true,
  listaEspera: true,
  financeiro: false,
  fornecedores: false,
  parcerias: false,
};

const permissionLabels: Record<keyof AdminJuniorPermissions, string> = {
  agenda: 'Agenda',
  clientes: 'Clientes',
  estoque: 'Estoque',
  listaEspera: 'Lista de Espera',
  financeiro: 'Financeiro',
  fornecedores: 'Fornecedores',
  parcerias: 'Parcerias',
};

// Labels for DB permission keys
const dbPermissionLabels: Record<string, string> = {
  agenda: 'Agenda',
  clientes: 'Clientes',
  estoque: 'Estoque',
  lista_espera: 'Lista de Espera',
  financeiro: 'Financeiro',
  fornecedores: 'Fornecedores',
  parcerias: 'Parcerias',
  config: 'Configurações',
};

export function AdminSection({}: AdminSectionProps) {
  const { admins, refreshAdmins, currentAdmin } = useAuth();
  const { createAdmin, updateAdmin, deleteAdmin, isLoading } = useAdminsCRUD();
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminWithRole | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Admin Pleno' | 'Admin Junior'>('Admin Pleno');
  const [permissions, setPermissions] = useState<AdminJuniorPermissions>(defaultPermissions);

  const openAddModal = () => {
    setEditingAdmin(null);
    setName('');
    setPhone('');
    setRole('Admin Pleno');
    setPermissions(defaultPermissions);
    setShowModal(true);
  };

  const openEditModal = (admin: AdminWithRole) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setPhone(admin.phone || '');
    // Map DB role to frontend role
    const roleMap: Record<string, 'Admin Pleno' | 'Admin Junior'> = {
      'admin_pleno': 'Admin Pleno',
      'admin_junior': 'Admin Junior',
    };
    setRole(roleMap[admin.role] || 'Admin Pleno');
    setPermissions(mapDbPermissions(admin.permissions));
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAdmin) {
      const success = await updateAdmin(editingAdmin.id, {
        name,
        phone,
        role,
        permissions: role === 'Admin Junior' ? permissions : undefined,
      });
      if (success) {
        await refreshAdmins();
        setShowModal(false);
      }
    } else {
      const success = await createAdmin({
        name,
        phone,
        role,
        permissions: role === 'Admin Junior' ? permissions : undefined,
      });
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

  const togglePermission = (key: keyof AdminJuniorPermissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter admins by role (exclude admin_chefe as they're shown separately)
  const plenoAdmins = admins.filter(a => a.role === 'admin_pleno');
  const juniorAdmins = admins.filter(a => a.role === 'admin_junior');

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
            👑 Admin Chefe (Você): Acesso total ao sistema + gerencia todos os administradores
          </p>
        </div>

        {/* Admin Pleno Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-black uppercase text-muted-foreground">Admin Pleno</h4>
          <p className="text-xs text-muted-foreground">
            Mesmos acessos que você: agenda, clientes, financeiro, estoque, fornecedores, parcerias, configurações básicas.
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

        {/* Admin Junior Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-black uppercase text-muted-foreground">Admin Junior</h4>
          <p className="text-xs text-muted-foreground">
            Permissões customizáveis via checkboxes - você escolhe exatamente o que cada Junior pode ver/fazer.
          </p>
          
          {juniorAdmins.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Nenhum Admin Junior cadastrado</p>
          ) : (
            <div className="space-y-2">
              {juniorAdmins.map(admin => (
                <div key={admin.id} className="p-3 bg-background rounded-xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
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
                  {admin.permissions && (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(admin.permissions).map(([key, value]) => {
                        // Skip non-boolean fields and config permission
                        if (typeof value !== 'boolean' || key === 'id' || key === 'user_id' || key === 'created_at' || key === 'updated_at' || key === 'config') return null;
                        if (!value) return null;
                        return (
                          <span key={key} className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full">
                            {dbPermissionLabels[key] || key}
                          </span>
                        );
                      })}
                    </div>
                  )}
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
                {editingAdmin ? 'Editar Admin' : 'Novo Admin'}
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

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Tipo de Admin *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Admin Pleno')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      role === 'Admin Pleno'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    Admin Pleno
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Admin Junior')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      role === 'Admin Junior'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    Admin Junior
                  </button>
                </div>
              </div>

              {role === 'Admin Junior' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Permissões
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80"
                      >
                        <Checkbox
                          checked={permissions[key as keyof AdminJuniorPermissions]}
                          onCheckedChange={() => togglePermission(key as keyof AdminJuniorPermissions)}
                        />
                        <span className="text-sm font-bold">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <BronzeButton
                type="submit"
                variant="gold"
                icon={CheckCircle2}
                className="w-full h-[60px]"
              >
                {editingAdmin ? 'Salvar Alterações' : 'Adicionar Admin'}
              </BronzeButton>
            </form>
          </BronzeCard>
        </div>
      )}
    </>
  );
}
