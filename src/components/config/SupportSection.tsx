import { useState, useEffect } from 'react';
import { Save, Lock, Phone, Mail, Globe, MessageSquare } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SUPPORT_PASSWORD = '607652';

interface SupportData {
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  notes: string;
}

export function SupportSection() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<SupportData>({
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    notes: '',
  });

  useEffect(() => {
    supabase.from('system_config').select('value').eq('key', 'support_data').then(({ data: rows }) => {
      if (rows && rows.length > 0) {
        setData(rows[0].value as unknown as SupportData);
      }
    });
  }, []);

  const handleUnlock = () => {
    if (passwordInput === SUPPORT_PASSWORD) {
      setIsUnlocked(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      toast.success('Acesso liberado!');
    } else {
      toast.error('Senha incorreta');
      setPasswordInput('');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await supabase.from('system_config').upsert(
        { key: 'support_data', value: data as any },
        { onConflict: 'key' }
      );
      toast.success('Dados de suporte salvos!');
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const hasAnyData = data.phone || data.email || data.whatsapp || data.website || data.notes;

  return (
    <div className="space-y-6">
      {/* Business Card View */}
      <BronzeCard className="bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border overflow-hidden relative">
        {/* Edit button */}
        <div className="absolute top-4 right-4">
          {!isUnlocked ? (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="p-2 rounded-full bg-muted/60 hover:bg-muted transition-all"
              title="Editar"
            >
              <Lock size={14} className="text-muted-foreground" />
            </button>
          ) : (
            <BronzeButton variant="gold" size="sm" icon={Save} onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </BronzeButton>
          )}
        </div>

        <div className="space-y-1 mb-6">
          <h3 className="text-lg font-black uppercase text-primary tracking-tight">Suporte</h3>
          <div className="w-10 h-0.5 bg-primary/40 rounded-full" />
        </div>

        {!hasAnyData && !isUnlocked ? (
          <p className="text-sm text-muted-foreground italic">Nenhum dado de suporte cadastrado.</p>
        ) : (
          <div className="space-y-4">
            {/* Phone */}
            {isUnlocked ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Telefone</label>
                <input type="text" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} className="input-bronze" placeholder="(00) 00000-0000" />
              </div>
            ) : data.phone ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Telefone</p>
                  <p className="text-sm font-semibold text-foreground">{data.phone}</p>
                </div>
              </div>
            ) : null}

            {/* Email */}
            {isUnlocked ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">E-mail</label>
                <input type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} className="input-bronze" placeholder="email@exemplo.com" />
              </div>
            ) : data.email ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">E-mail</p>
                  <p className="text-sm font-semibold text-foreground">{data.email}</p>
                </div>
              </div>
            ) : null}

            {/* WhatsApp */}
            {isUnlocked ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">WhatsApp</label>
                <input type="text" value={data.whatsapp} onChange={e => setData({ ...data, whatsapp: e.target.value })} className="input-bronze" placeholder="(00) 00000-0000" />
              </div>
            ) : data.whatsapp ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">WhatsApp</p>
                  <p className="text-sm font-semibold text-foreground">{data.whatsapp}</p>
                </div>
              </div>
            ) : null}

            {/* Website */}
            {isUnlocked ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Website</label>
                <input type="text" value={data.website} onChange={e => setData({ ...data, website: e.target.value })} className="input-bronze" placeholder="https://..." />
              </div>
            ) : data.website ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Globe size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Website</p>
                  <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">{data.website}</a>
                </div>
              </div>
            ) : null}

            {/* Notes */}
            {isUnlocked ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Observações</label>
                <textarea value={data.notes} onChange={e => setData({ ...data, notes: e.target.value })} className="input-bronze min-h-[80px]" placeholder="Informações adicionais..." />
              </div>
            ) : data.notes ? (
              <div className="pt-3 mt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{data.notes}</p>
              </div>
            ) : null}
          </div>
        )}
      </BronzeCard>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-80 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h4 className="text-sm font-black uppercase text-foreground">Digite a senha de suporte</h4>
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              className="input-bronze w-full"
              placeholder="Senha"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowPasswordModal(false); setPasswordInput(''); }}
                className="flex-1 px-4 py-2 bg-secondary border border-border rounded-xl text-xs font-black uppercase"
              >
                Cancelar
              </button>
              <BronzeButton variant="gold" size="sm" onClick={handleUnlock} className="flex-1">
                Confirmar
              </BronzeButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
