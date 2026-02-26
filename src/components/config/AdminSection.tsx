import { useState } from 'react';
import { Trash2, Edit2, UserPlus, X, CheckCircle2, Crown, User, Eye, EyeOff, LogOut } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminsCRUD } from '@/hooks/useAdminsCRUD';
import { AdminWithRole, getDisplayRole } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function AdminSection() {
  const { admins, refreshAdmins, currentAdmin, isAdminChefe, logout } = useAuth();
  const { createAdmin, updateAdmin, deleteAdmin, isLoading } = useAdminsCRUD();
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminWithRole | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  if (!isAdminChefe) {
    return (
      <BronzeCard className="bg-secondary/50 space-y-4">
        <h3 className="text-lg font-black uppercase text-primary">Administradores</h3>
        <p className="text-sm text-muted-foreground">
          Apenas o Admin Mestre pode gerenciar usuários.
        </p>
      </BronzeCard>
    );
  }

  const openAddModal = () => {
    setEditingAdmin(null);
    setName('');
    setPhone('');
    setPassword('');
    setChangePassword(false);
    setShowPassword(false);
    setShowModal(true);
  };

  const openEditModal = (admin: AdminWithRole) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setPhone(admin.phone || '');
    setPassword('');
    setChangePassword(false);
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAdmin) {
      const success = await updateAdmin(editingAdmin.id, { name, phone, role: 'Admin Pleno' });
      if (success && changePassword && password) {
        const { error } = await supabase.rpc('set_admin_password', {
          _user_id: editingAdmin.id,
          _password: password,
        });
        if (error) {
          toast.error('Erro ao alterar senha');
          console.error(error);
        } else {
          toast.success('Senha alterada com sucesso');
        }
      }
      if (success) {
        await refreshAdmins();
        setShowModal(false);
      }
    } else {
      if (!password) {
        toast.error('Senha é obrigatória para novos usuários');
        return;
      }
      const success = await createAdmin({ name, phone, role: 'Admin Pleno' });
      if (success) {
        // Find the newly created admin to set password
        await refreshAdmins();
        const { data: profiles } = await supabase.from('profiles').select('id').eq('name', name).eq('phone', phone);
        if (profiles && profiles.length > 0) {
          await supabase.rpc('set_admin_password', {
            _user_id: profiles[0].id,
            _password: password,
          });
        }
        setShowModal(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentAdmin?.id) {
      toast.error('Você não pode excluir sua própria conta');
      return;
    }
    const success = await deleteAdmin(id);
    if (success) {
      await refreshAdmins();
    }
  };

  const allAdmins = admins;

  return (
    <>
      <BronzeCard className="bg-secondary/50 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black uppercase text-primary">Administradores</h3>
          <div className="flex gap-2">
            <BronzeButton variant="secondary" icon={LogOut} size="sm" onClick={logout}>
              Sair
            </BronzeButton>
            <BronzeButton variant="gold" icon={UserPlus} size="sm" onClick={openAddModal}>
              Adicionar
            </BronzeButton>
          </div>
        </div>

        <div className="space-y-2">
          {allAdmins.map(admin => (
            <div key={admin.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  admin.role === 'admin_chefe' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}>
                  {admin.role === 'admin_chefe' ? <Crown size={16} /> : <User size={16} />}
                </div>
                <div>
                  <p className="font-bold text-sm">{admin.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getDisplayRole(admin.role)} • {admin.phone || 'Sem telefone'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(admin)} className="p-2 text-muted-foreground hover:text-primary">
                  <Edit2 size={16} />
                </button>
                {admin.id !== currentAdmin?.id && (
                  <button onClick={() => handleDelete(admin.id)} className="p-2 text-muted-foreground hover:text-destructive" disabled={isLoading}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </BronzeCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <BronzeCard className="w-full max-w-md bg-card border-primary/30 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h3 className="text-xl font-black uppercase">
                {editingAdmin ? `Editar: ${editingAdmin.name}` : 'Novo Usuário'}
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
                  Telefone / Login
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-bronze"
                  placeholder="(11) 99999-9999"
                />
              </div>

              {editingAdmin ? (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={changePassword}
                      onChange={(e) => setChangePassword(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-bold">Alterar senha</span>
                  </label>
                  {changePassword && (
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-bronze pr-12"
                        placeholder="Nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-bronze pr-12"
                      placeholder="Senha do usuário"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <BronzeButton
                type="submit"
                variant="gold"
                icon={CheckCircle2}
                className="w-full h-[60px]"
              >
                {editingAdmin ? 'Salvar Alterações' : 'Adicionar Usuário'}
              </BronzeButton>
            </form>
          </BronzeCard>
        </div>
      )}
    </>
  );
}
