import { useState, useEffect } from 'react';
import { Save, Building2, CreditCard, Tag, MessageSquare, Image, Sparkles, UserCircle, Headphones, FileText, Lock, Eye, EyeOff, LogOut, UsersRound, Layers, Upload } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { SystemConfig, ClientTag, WhatsAppTemplate, ServiceType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

import { TagsSection } from './TagsSection';
import { MessagesSection } from './MessagesSection';
import { ServicesSection } from './ServicesSection';
import { ReceiptSection } from './ReceiptSection';
import { SupportSection } from './SupportSection';
import { UsersView } from '@/components/users/UsersView';
import { PlansSection } from './PlansSection';
import { ImportSection } from './ImportSection';
import { toast } from 'sonner';

const SUPABASE_URL = "https://iphluakvvklyvymwhfxh.supabase.co";

interface ConfigViewProps {
  config: SystemConfig;
  onConfigChange: (config: SystemConfig) => void;
  onExportBackup: () => void;
  onUploadLogo?: (file: File) => Promise<string | null>;
  onUploadBackground?: (file: File) => Promise<string | null>;
}

type ConfigSection = 'estudio' | 'pagamentos' | 'servicos' | 'tags' | 'mensagens' | 'recibo' | 'suporte' | 'senha' | 'usuarios' | 'planos' | 'importar';

export function ConfigView({ config, onConfigChange, onExportBackup, onUploadLogo, onUploadBackground }: ConfigViewProps) {
  const [activeSection, setActiveSection] = useState<ConfigSection>('estudio');
  const { currentAdmin, refreshAdmins, logout, isAdminChefe } = useAuth();
  const [adminName, setAdminName] = useState(currentAdmin?.name || '');
  const [adminPhoto, setAdminPhoto] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [loginPhone, setLoginPhone] = useState(currentAdmin?.phone || '');
  const [loginEmail, setLoginEmail] = useState(currentAdmin?.email || '');

  // Per-user visual settings
  const [userStudioName, setUserStudioName] = useState('');
  const [userStudioLogo, setUserStudioLogo] = useState<string | null>(null);
  const [userBackgroundPhoto, setUserBackgroundPhoto] = useState<string | null>(null);

  // Load admin photo and per-user visual settings from profiles table
  useEffect(() => {
    if (currentAdmin?.id) {
      supabase.from('profiles').select('photo_url, studio_name, studio_logo, background_photo').eq('id', currentAdmin.id).single().then(({ data }) => {
        if (data?.photo_url) setAdminPhoto(data.photo_url as string);
        else setAdminPhoto(null);
        setUserStudioName((data?.studio_name as string) || config.name || '');
        setUserStudioLogo((data?.studio_logo as string) || null);
        setUserBackgroundPhoto((data?.background_photo as string) || null);
      });
    }
  }, [currentAdmin?.id]);

  const handleSave = () => {
    toast.success('Configurações salvas!');
  };

  const handleSaveProfile = async () => {
    if (!currentAdmin) return;
    setIsSavingProfile(true);
    try {
      // Update name and photo in profiles table (per-user)
      const updates: Record<string, any> = { name: adminName };
      if (adminPhoto) updates.photo_url = adminPhoto;
      await supabase.from('profiles').update(updates).eq('id', currentAdmin.id);
      await refreshAdmins();
      toast.success('Perfil atualizado!');
    } catch (error) {
      toast.error('Erro ao salvar perfil');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `admin-photo-${currentAdmin?.id}.${fileExt}`;
      await supabase.storage.from('studio-assets').remove([fileName]);
      const { error } = await supabase.storage.from('studio-assets').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const url = `${SUPABASE_URL}/storage/v1/object/public/studio-assets/${fileName}`;
      setAdminPhoto(url);
      toast.success('Foto enviada!');
    } catch (error) {
      toast.error('Erro ao enviar foto');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentAdmin?.id) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `studio-logo-${currentAdmin.id}.${fileExt}`;
      await supabase.storage.from('studio-assets').remove([fileName]);
      const { error } = await supabase.storage.from('studio-assets').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const url = `${SUPABASE_URL}/storage/v1/object/public/studio-assets/${fileName}`;
      setUserStudioLogo(url);
      await supabase.from('profiles').update({ studio_logo: url }).eq('id', currentAdmin.id);
      toast.success('Logo atualizado!');
    } catch {
      toast.error('Erro ao enviar logo');
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentAdmin?.id) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `studio-bg-${currentAdmin.id}.${fileExt}`;
      await supabase.storage.from('studio-assets').remove([fileName]);
      const { error } = await supabase.storage.from('studio-assets').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const url = `${SUPABASE_URL}/storage/v1/object/public/studio-assets/${fileName}`;
      setUserBackgroundPhoto(url);
      await supabase.from('profiles').update({ background_photo: url }).eq('id', currentAdmin.id);
      toast.success('Foto de fundo atualizada!');
    } catch {
      toast.error('Erro ao enviar foto de fundo');
    }
  };

  // Admin management is now handled by AdminSection using Supabase directly

  const handleTagUpdate = (tags: ClientTag[]) => {
    onConfigChange({ ...config, clientTags: tags });
  };

  const handleTemplateUpdate = (templates: WhatsAppTemplate[]) => {
    onConfigChange({ ...config, whatsappTemplates: templates });
  };

  const handleServiceUpdate = (services: ServiceType[]) => {
    onConfigChange({ ...config, serviceTypes: services });
  };

  const handleChangePassword = async () => {
    if (!currentAdmin) return;
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('As senhas não conferem');
      return;
    }
    setIsSavingPassword(true);
    try {
      // Update login credentials (phone/email)
      const updates: Record<string, any> = {};
      if (loginPhone !== (currentAdmin.phone || '')) updates.phone = loginPhone;
      if (loginEmail !== (currentAdmin.email || '')) updates.email = loginEmail;
      
      if (newPassword) {
        await supabase.rpc('set_admin_password', { _user_id: currentAdmin.id, _password: newPassword });
        updates.password_display = newPassword;
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from('profiles').update(updates).eq('id', currentAdmin.id);
      }

      await refreshAdmins();
      toast.success('Credenciais atualizadas!');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Erro ao alterar credenciais');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const sections = isAdminChefe
    ? [
        { id: 'estudio' as ConfigSection, icon: Building2, label: 'Visual' },
        { id: 'usuarios' as ConfigSection, icon: UsersRound, label: 'Usuários' },
        { id: 'planos' as ConfigSection, icon: Layers, label: 'Planos' },
        { id: 'suporte' as ConfigSection, icon: Headphones, label: 'Suporte' },
      ]
    : [
        { id: 'estudio' as ConfigSection, icon: Building2, label: 'Estúdio' },
        { id: 'servicos' as ConfigSection, icon: Sparkles, label: 'Serviços' },
        { id: 'pagamentos' as ConfigSection, icon: CreditCard, label: 'Pagamentos' },
        { id: 'tags' as ConfigSection, icon: Tag, label: 'Tags de Clientes' },
        { id: 'mensagens' as ConfigSection, icon: MessageSquare, label: 'Mensagens' },
        { id: 'recibo' as ConfigSection, icon: FileText, label: 'Recibo' },
        { id: 'senha' as ConfigSection, icon: Lock, label: 'Minha Senha' },
        { id: 'importar' as ConfigSection, icon: Upload, label: 'Importar' },
        { id: 'suporte' as ConfigSection, icon: Headphones, label: 'Suporte' },
      ];

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight">Configurações</h2>
        <div className="flex gap-2">
          <BronzeButton variant="secondary" icon={LogOut} size="sm" onClick={logout}>
            Sair
          </BronzeButton>
          <BronzeButton variant="gold" icon={Save} size="sm" onClick={handleSave}>
            Salvar Tudo
          </BronzeButton>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 custom-scrollbar">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all ${
              activeSection === section.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            <section.icon size={16} />
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 pr-2">
        {activeSection === 'estudio' && (<>
          <BronzeCard className="bg-secondary/50 space-y-6">
            <h3 className="text-lg font-black uppercase text-primary">Identidade do Estúdio</h3>
            
            <p className="text-xs text-muted-foreground">
              Escolha entre enviar uma logo ou digitar o nome do estúdio. A logo tem prioridade na sidebar.
            </p>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Logo do Estúdio
              </label>
              <div className="flex items-center gap-4">
                {userStudioLogo ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/30 flex items-center justify-center">
                    <img src={userStudioLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Image size={24} className="text-muted-foreground/50" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <span className="px-4 py-2 bg-secondary border border-border rounded-xl text-xs font-black uppercase hover:bg-secondary/80 transition-all inline-block">
                      {userStudioLogo ? 'Alterar Logo' : 'Enviar Logo'}
                    </span>
                  </label>
                  {userStudioLogo && (
                    <button
                      onClick={async () => {
                        setUserStudioLogo(null);
                        if (currentAdmin?.id) {
                          await supabase.from('profiles').update({ studio_logo: null }).eq('id', currentAdmin.id);
                        }
                      }}
                      className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/30 rounded-xl text-xs font-black uppercase hover:bg-destructive/20 transition-all"
                    >
                      Remover Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Studio Name - shown as alternative */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                {userStudioLogo ? 'Nome do Estúdio (usado como fallback)' : 'Nome do Estúdio (exibido na sidebar)'}
              </label>
              <input
                type="text"
                value={userStudioName}
                onChange={(e) => setUserStudioName(e.target.value.toUpperCase())}
                onBlur={async () => {
                  if (currentAdmin?.id) {
                    await supabase.from('profiles').update({ studio_name: userStudioName }).eq('id', currentAdmin.id);
                  }
                }}
                className="input-bronze"
                placeholder="Nome do seu estúdio"
              />
            </div>

            {/* Background Photo */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Foto de Fundo
              </label>
              <div className="flex items-center gap-4">
                {userBackgroundPhoto ? (
                  <div className="w-32 h-20 rounded-xl overflow-hidden border-2 border-primary/30">
                    <img src={userBackgroundPhoto} alt="Background" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-20 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Image size={24} className="text-muted-foreground/50" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
                  <span className="px-4 py-2 bg-secondary border border-border rounded-xl text-xs font-black uppercase hover:bg-secondary/80 transition-all">
                    {userBackgroundPhoto ? 'Alterar Fundo' : 'Enviar Fundo'}
                  </span>
                </label>
              </div>
            </div>
          </BronzeCard>

          {/* User Profile Section */}
          <BronzeCard className="bg-secondary/50 space-y-6 mt-6">
            <div className="flex items-center gap-2">
              <UserCircle size={20} className="text-primary" />
              <h3 className="text-lg font-black uppercase text-primary">Perfil do Usuário</h3>
            </div>

            {/* Admin Photo */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Foto do Usuário
              </label>
              <div className="flex items-center gap-4">
                {adminPhoto ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 flex items-center justify-center">
                    <img src={adminPhoto} alt="Foto" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <UserCircle size={32} className="text-muted-foreground/50" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  <span className="px-4 py-2 bg-secondary border border-border rounded-xl text-xs font-black uppercase hover:bg-secondary/80 transition-all">
                    {adminPhoto ? 'Alterar Foto' : 'Enviar Foto'}
                  </span>
                </label>
              </div>
            </div>

            {/* Admin Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Nome do Usuário
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="input-bronze"
                placeholder="Seu nome"
              />
            </div>

            <BronzeButton
              variant="gold"
              size="sm"
              icon={Save}
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? 'Salvando...' : 'Salvar Perfil'}
            </BronzeButton>
          </BronzeCard>
        </>)}

        {activeSection === 'servicos' && (
          <ServicesSection
            services={config.serviceTypes || []}
            onUpdate={handleServiceUpdate}
          />
        )}

        {activeSection === 'pagamentos' && (
          <BronzeCard className="bg-secondary/50 space-y-6">
            <h3 className="text-lg font-black uppercase text-primary">Configurações de Pagamento</h3>
            
            {/* PIX Key */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Chave PIX (CPF, E-mail, Telefone ou Aleatória)
              </label>
              <input
                type="text"
                value={config.pixKey}
                onChange={(e) => onConfigChange({ ...config, pixKey: e.target.value })}
                className="input-bronze"
                placeholder="Sua chave PIX"
              />
            </div>

            {/* Payment Link */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Link de Pagamento (Mercado Pago / PagSeguro)
              </label>
              <input
                type="text"
                value={config.payLink}
                onChange={(e) => onConfigChange({ ...config, payLink: e.target.value })}
                className="input-bronze"
                placeholder="https://..."
              />
            </div>
          </BronzeCard>
        )}


        {activeSection === 'tags' && (
          <TagsSection
            tags={config.clientTags}
            onUpdate={handleTagUpdate}
          />
        )}

        {activeSection === 'mensagens' && (
          <MessagesSection
            templates={config.whatsappTemplates}
            onUpdate={handleTemplateUpdate}
          />
        )}

        {activeSection === 'recibo' && (
          <ReceiptSection />
        )}

        {activeSection === 'suporte' && (
          <SupportSection />
        )}

        {activeSection === 'senha' && (
          <BronzeCard className="bg-secondary/50 space-y-6">
            <div className="flex items-center gap-2">
              <Lock size={20} className="text-primary" />
              <h3 className="text-lg font-black uppercase text-primary">Meu Login e Senha</h3>
            </div>

            <p className="text-xs text-muted-foreground">
              Altere seu telefone/CPF de login e sua senha. O administrador chefe terá acesso a essas informações.
            </p>

            <div className="space-y-4">
              {/* Login Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Telefone / CPF (Login)
                </label>
                <input
                  type="text"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="input-bronze"
                  placeholder="(11) 99999-9999 ou CPF"
                />
              </div>

              {/* Email (optional) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  E-mail (opcional)
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="input-bronze"
                  placeholder="email@exemplo.com"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Nova Senha (deixe em branco para manter a atual)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-bronze pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {newPassword && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-bronze"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <BronzeButton
                variant="gold"
                icon={Save}
                size="sm"
                onClick={handleChangePassword}
                disabled={isSavingPassword}
              >
                {isSavingPassword ? 'Salvando...' : 'Salvar Credenciais'}
              </BronzeButton>
            </div>
          </BronzeCard>
        )}

        {activeSection === 'usuarios' && isAdminChefe && (
          <UsersView />
        )}

        {activeSection === 'planos' && isAdminChefe && (
          <PlansSection />
        )}

      </div>
    </div>
  );
}
