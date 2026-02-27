import { useState } from 'react';
import { UserPlus, Edit2, Trash2, X, CheckCircle2, Eye, EyeOff, Crown, User } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminsCRUD } from '@/hooks/useAdminsCRUD';
import { AdminWithRole, getDisplayRole } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function UsersView() {
  const { admins, refreshAdmins, currentAdmin } = useAuth();
  const { createAdmin, updateAdmin, deleteAdmin, isLoading } = useAdminsCRUD();
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminWithRole | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const openAddModal = () => {
    setEditingAdmin(null);
    setName('');
    setPhone('');
    setPassword('');
    setShowPassword(false);
    setShowModal(true);
  };

  const openEditModal = (admin: AdminWithRole) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setPhone(admin.phone || '');
    setPassword('');
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAdmin) {
      const success = await updateAdmin(editingAdmin.id, { name, phone, role: 'Admin Pleno' });
      if (success && password) {
        await supabase.rpc('set_admin_password', { _user_id: editingAdmin.id, _password: password });
        await supabase.from('profiles').update({ password_display: password } as any).eq('id', editingAdmin.id);
        toast.success('Senha alterada!');
      }
      if (success) {
        await refreshAdmins();
        setShowModal(false);
      }
    } else {
      if (!password) {
        toast.error('Senha é obrigatória');
        return;
      }
      const newProfileId = await createAdmin({ name: name.trim(), phone: phone.trim(), role: 'Admin Pleno' });
      if (newProfileId) {
        await supabase.rpc('set_admin_password', { _user_id: newProfileId, _password: password });
        await supabase.from('profiles').update({ password_display: password } as any).eq('id', newProfileId);
        await refreshAdmins();
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
    if (success) await refreshAdmins();
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tight">Usuários</h2>
        <BronzeButton variant="gold" icon={UserPlus} size="sm" onClick={openAddModal}>
          Novo Usuário
        </BronzeButton>
      </div>

      <div className="space-y-3">
        {admins.map(admin => (
          <BronzeCard key={admin.id} className="bg-secondary/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  admin.role === 'admin_chefe' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}>
                  {admin.role === 'admin_chefe' ? <Crown size={20} /> : <User size={20} />}
                </div>
                <div>
                  <p className="font-bold">{admin.name}</p>
                  <p className="text-xs text-muted-foreground">{getDisplayRole(admin.role)}</p>
                  <p className="text-xs text-muted-foreground">📱 {admin.phone || 'Sem telefone'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">🔑 Senha:</span>
                    <span className="text-xs font-mono font-bold">
                      {showPasswords[admin.id]
                        ? ((admin as any).password_display || '••••••')
                        : '••••••'}
                    </span>
                    <button
                      onClick={() => toggleShowPassword(admin.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords[admin.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
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
          </BronzeCard>
        ))}
      </div>

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
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nome *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-bronze" required />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Telefone / Login</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-bronze" placeholder="(11) 99999-9999" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  {editingAdmin ? 'Nova Senha (deixe vazio para manter)' : 'Senha *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-bronze pr-12"
                    placeholder="••••••••"
                    required={!editingAdmin}
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

              <BronzeButton type="submit" variant="gold" icon={CheckCircle2} className="w-full h-[60px]">
                {editingAdmin ? 'Salvar Alterações' : 'Adicionar Usuário'}
              </BronzeButton>
            </form>
          </BronzeCard>
        </div>
      )}
    </div>
  );
}
