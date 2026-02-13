import { useState, useEffect } from 'react';
import { Save, Lock, Phone, Mail, Globe, MessageSquare } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SUPPORT_PASSWORD = 'suporte2024';

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

  return (
    <BronzeCard className="bg-secondary/50 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black uppercase text-primary">Dados de Suporte</h3>
        {!isUnlocked && (
          <BronzeButton
            variant="gold"
            size="sm"
            icon={Lock}
            onClick={() => setShowPasswordModal(true)}
          >
            Editar
          </BronzeButton>
        )}
      </div>

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

      {/* Support Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
            <Phone size={12} /> Telefone
          </label>
          {isUnlocked ? (
            <input type="text" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} className="input-bronze" placeholder="(00) 00000-0000" />
          ) : (
            <p className="text-sm text-foreground px-3 py-2 bg-muted/50 rounded-xl">{data.phone || '—'}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
            <Mail size={12} /> E-mail
          </label>
          {isUnlocked ? (
            <input type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} className="input-bronze" placeholder="email@exemplo.com" />
          ) : (
            <p className="text-sm text-foreground px-3 py-2 bg-muted/50 rounded-xl">{data.email || '—'}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
            <MessageSquare size={12} /> WhatsApp
          </label>
          {isUnlocked ? (
            <input type="text" value={data.whatsapp} onChange={e => setData({ ...data, whatsapp: e.target.value })} className="input-bronze" placeholder="(00) 00000-0000" />
          ) : (
            <p className="text-sm text-foreground px-3 py-2 bg-muted/50 rounded-xl">{data.whatsapp || '—'}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
            <Globe size={12} /> Website
          </label>
          {isUnlocked ? (
            <input type="text" value={data.website} onChange={e => setData({ ...data, website: e.target.value })} className="input-bronze" placeholder="https://..." />
          ) : (
            <p className="text-sm text-foreground px-3 py-2 bg-muted/50 rounded-xl">{data.website || '—'}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Observações
          </label>
          {isUnlocked ? (
            <textarea value={data.notes} onChange={e => setData({ ...data, notes: e.target.value })} className="input-bronze min-h-[80px]" placeholder="Informações adicionais..." />
          ) : (
            <p className="text-sm text-foreground px-3 py-2 bg-muted/50 rounded-xl whitespace-pre-wrap">{data.notes || '—'}</p>
          )}
        </div>
      </div>

      {isUnlocked && (
        <BronzeButton variant="gold" size="sm" icon={Save} onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Suporte'}
        </BronzeButton>
      )}
    </BronzeCard>
  );
}
