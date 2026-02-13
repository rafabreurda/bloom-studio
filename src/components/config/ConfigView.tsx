import { useState, useEffect } from 'react';
import { Save, Building2, CreditCard, Tag, MessageSquare, Image, Sparkles, UserCircle, Headphones, FileText } from 'lucide-react';
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
import { toast } from 'sonner';

const SUPABASE_URL = "https://iphluakvvklyvymwhfxh.supabase.co";

interface ConfigViewProps {
  config: SystemConfig;
  onConfigChange: (config: SystemConfig) => void;
  onExportBackup: () => void;
  onUploadLogo?: (file: File) => Promise<string | null>;
  onUploadBackground?: (file: File) => Promise<string | null>;
}

type ConfigSection = 'estudio' | 'pagamentos' | 'servicos' | 'tags' | 'mensagens' | 'recibo' | 'suporte';

export function ConfigView({ config, onConfigChange, onExportBackup, onUploadLogo, onUploadBackground }: ConfigViewProps) {
  const [activeSection, setActiveSection] = useState<ConfigSection>('estudio');
  const { currentAdmin, refreshAdmins } = useAuth();
  const [adminName, setAdminName] = useState(currentAdmin?.name || '');
  const [adminPhoto, setAdminPhoto] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Load admin photo from system_config
  useEffect(() => {
    supabase.from('system_config').select('value').eq('key', 'admin_photo').then(({ data }) => {
      if (data && data.length > 0) setAdminPhoto(data[0].value as string);
    });
  }, []);

  const handleSave = () => {
    toast.success('Configurações salvas!');
  };

  const handleSaveProfile = async () => {
    if (!currentAdmin) return;
    setIsSavingProfile(true);
    try {
      // Update name in profiles table
      await supabase.from('profiles').update({ name: adminName }).eq('id', currentAdmin.id);
      // Save photo URL in system_config
      if (adminPhoto) {
        await supabase.from('system_config').upsert({ key: 'admin_photo', value: adminPhoto }, { onConflict: 'key' });
      }
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
      const fileName = `admin-photo.${fileExt}`;
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
    if (file && onUploadLogo) {
      const url = await onUploadLogo(file);
      if (url) {
        onConfigChange({ ...config, logo: url });
        toast.success('Logo atualizado!');
      }
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadBackground) {
      const url = await onUploadBackground(file);
      if (url) {
        onConfigChange({ ...config, backgroundPhoto: url });
        toast.success('Foto de fundo atualizada!');
      }
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

  const sections = [
    { id: 'estudio' as ConfigSection, icon: Building2, label: 'Estúdio' },
    { id: 'servicos' as ConfigSection, icon: Sparkles, label: 'Serviços' },
    { id: 'pagamentos' as ConfigSection, icon: CreditCard, label: 'Pagamentos' },
    { id: 'tags' as ConfigSection, icon: Tag, label: 'Tags de Clientes' },
    { id: 'mensagens' as ConfigSection, icon: MessageSquare, label: 'Mensagens' },
    { id: 'recibo' as ConfigSection, icon: FileText, label: 'Recibo' },
    { id: 'suporte' as ConfigSection, icon: Headphones, label: 'Suporte' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight">Configurações</h2>
        <BronzeButton variant="gold" icon={Save} size="sm" onClick={handleSave}>
          Salvar Tudo
        </BronzeButton>
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
                {config.logo ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/30 flex items-center justify-center">
                    <img src={config.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
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
                      {config.logo ? 'Alterar Logo' : 'Enviar Logo'}
                    </span>
                  </label>
                  {config.logo && (
                    <button
                      onClick={() => onConfigChange({ ...config, logo: undefined })}
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
                {config.logo ? 'Nome do Estúdio (usado como fallback)' : 'Nome do Estúdio (exibido na sidebar)'}
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => onConfigChange({ ...config, name: e.target.value.toUpperCase() })}
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
                {config.backgroundPhoto ? (
                  <div className="w-32 h-20 rounded-xl overflow-hidden border-2 border-primary/30">
                    <img src={config.backgroundPhoto} alt="Background" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-20 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Image size={24} className="text-muted-foreground/50" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
                  <span className="px-4 py-2 bg-secondary border border-border rounded-xl text-xs font-black uppercase hover:bg-secondary/80 transition-all">
                    {config.backgroundPhoto ? 'Alterar Fundo' : 'Enviar Fundo'}
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

      </div>
    </div>
  );
}
