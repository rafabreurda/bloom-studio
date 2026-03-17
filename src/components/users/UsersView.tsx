import { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, X, CheckCircle2, Eye, EyeOff, Crown, User, ChevronDown, ChevronUp, FileText, Download } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminsCRUD } from '@/hooks/useAdminsCRUD';
import { AdminWithRole, getDisplayRole } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserFormModal } from './UserFormModal';

interface Plan {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
}

export function UsersView() {
  const { admins, refreshAdmins, currentAdmin } = useAuth();
  const { createAdmin, updateAdmin, deleteAdmin, isLoading } = useAdminsCRUD();
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminWithRole | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [adminExtras, setAdminExtras] = useState<Record<string, any>>({});

  useEffect(() => {
    supabase.from('plans').select('*').eq('is_active', true).order('name').then(({ data }) => {
      if (data) setPlans(data as Plan[]);
    });
    supabase.from('profiles').select('*, contract_url').then(({ data }) => {
      if (data) {
        const extras: Record<string, any> = {};
        data.forEach(p => { extras[p.id] = p; });
        setAdminExtras(extras);
      }
    });
  }, [admins]);

  const openAddModal = () => {
    setEditingAdmin(null);
    setShowModal(true);
  };

  const openEditModal = (admin: AdminWithRole) => {
    setEditingAdmin(admin);
    setShowModal(true);
  };

  const handleSubmit = async (formData: any) => {
    if (editingAdmin) {
      const success = await updateAdmin(editingAdmin.id, { name: formData.name, phone: formData.phone, role: 'Admin Pleno' });
      if (success) {
        await supabase.from('profiles').update({
          cpf: formData.cpf || null,
          email: formData.email || null,
          birthday: formData.birthday || null,
          address_street: formData.address_street || null,
          address_number: formData.address_number || null,
          address_neighborhood: formData.address_neighborhood || null,
          address_city: formData.address_city || null,
          address_zip: formData.address_zip || null,
          address_state: formData.address_state || null,
          username: formData.username || null,
          plan_id: formData.plan_id || null,
          payment_notes: formData.payment_notes || null,
          contract_url: formData.contract_url || null,
        } as any).eq('id', editingAdmin.id);

        if (formData.password) {
          await supabase.rpc('set_admin_password', { _user_id: editingAdmin.id, _password: formData.password });
          await supabase.from('profiles').update({ password_display: formData.password } as any).eq('id', editingAdmin.id);
        }
        await refreshAdmins();
        setShowModal(false);
      }
    } else {
      if (!formData.password) { toast.error('Senha é obrigatória'); return; }
      const newProfileId = await createAdmin({ name: formData.name.trim(), phone: formData.phone.trim(), role: 'Admin Pleno' });
      if (newProfileId) {
        await supabase.from('profiles').update({
          cpf: formData.cpf || null,
          email: formData.email || null,
          birthday: formData.birthday || null,
          address_street: formData.address_street || null,
          address_number: formData.address_number || null,
          address_neighborhood: formData.address_neighborhood || null,
          address_city: formData.address_city || null,
          address_zip: formData.address_zip || null,
          address_state: formData.address_state || null,
          username: formData.username || null,
          plan_id: formData.plan_id || null,
          payment_notes: formData.payment_notes || null,
          contract_url: formData.contract_url || null,
        } as any).eq('id', newProfileId);

        await supabase.rpc('set_admin_password', { _user_id: newProfileId, _password: formData.password });
        await supabase.from('profiles').update({ password_display: formData.password } as any).eq('id', newProfileId);
        await refreshAdmins();
        setShowModal(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentAdmin?.id) { toast.error('Você não pode excluir sua própria conta'); return; }
    const success = await deleteAdmin(id);
    if (success) await refreshAdmins();
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpandedUser(prev => prev === id ? null : id);
  };

  const getPlanName = (pId: string | null) => {
    if (!pId) return null;
    return plans.find(p => p.id === pId)?.name || null;
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
        {admins.map(admin => {
          const extra = adminExtras[admin.id] || {};
          const planName = getPlanName(extra.plan_id);
          const isExpanded = expandedUser === admin.id;

          return (
            <BronzeCard key={admin.id} className="bg-secondary/50 p-4">
              {/* Compact view: Name, Phone, Password */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-4 flex-1 cursor-pointer"
                  onClick={() => toggleExpand(admin.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    admin.role === 'admin_chefe' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                  }`}>
                    {admin.role === 'admin_chefe' ? <Crown size={20} /> : <User size={20} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">📱 {admin.phone || 'Sem telefone'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">🔑</span>
                      <span className="text-xs font-mono font-bold">
                        {showPasswords[admin.id] ? ((admin as any).password_display || '••••••') : '••••••'}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleShowPassword(admin.id); }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords[admin.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleExpand(admin.id)} className="p-2 text-muted-foreground hover:text-foreground">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
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

              {/* Expanded view: full details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">
                    {getDisplayRole(admin.role)}
                  </p>
                  {extra.email && <p><span className="text-muted-foreground">📧 E-mail:</span> {extra.email}</p>}
                  {extra.cpf && <p><span className="text-muted-foreground">📋 CPF:</span> {extra.cpf}</p>}
                  {extra.birthday && <p><span className="text-muted-foreground">🎂 Nascimento:</span> {new Date(extra.birthday + 'T12:00:00').toLocaleDateString('pt-BR')}</p>}
                  {extra.username && <p><span className="text-muted-foreground">👤 Usuário:</span> {extra.username}</p>}
                  
                  {(extra.address_street || extra.address || extra.address_city) && (
                    <div>
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-3 mb-1">Endereço</p>
                      {extra.address_street && <p>{extra.address_street}{extra.address_number ? `, ${extra.address_number}` : ''}</p>}
                      {extra.address_neighborhood && <p>{extra.address_neighborhood}</p>}
                      {(extra.address_city || extra.address_state) && (
                        <p>{[extra.address_city, extra.address_state].filter(Boolean).join(' - ')}</p>
                      )}
                      {extra.address_zip && <p>CEP: {extra.address_zip}</p>}
                      {!extra.address_street && extra.address && <p>{extra.address}</p>}
                    </div>
                  )}

                  {planName && (
                    <div className="mt-3">
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Plano & Pagamento</p>
                      <p>📦 {planName}</p>
                      {extra.payment_notes && <p>💳 {extra.payment_notes}</p>}
                    </div>
                  )}

                  {extra.contract_url && (
                    <div className="mt-3">
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Contrato</p>
                      <a
                        href={extra.contract_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors"
                      >
                        <FileText size={16} />
                        Baixar Contrato
                        <Download size={14} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </BronzeCard>
          );
        })}
      </div>

      {showModal && (
        <UserFormModal
          editingAdmin={editingAdmin}
          adminExtras={adminExtras}
          plans={plans}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
