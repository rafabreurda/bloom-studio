import { useState, useEffect } from 'react';
import { Save, Lock, Globe, MessageSquare, Building2, Copy, Check, Instagram } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SUPPORT_PASSWORD = '607652';

interface SupportData {
  company: string;
  whatsapp: string;
  website: string;
  instagram: string;
}

function CopyableText({ text, isLink }: { text: string; isLink?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 group cursor-pointer" onClick={handleCopy}>
      {isLink ? (
        <a href={text} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline" onClick={e => e.stopPropagation()}>
          {text}
        </a>
      ) : (
        <p className="text-sm font-semibold text-foreground select-all">{text}</p>
      )}
      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted">
        {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-muted-foreground" />}
      </button>
    </div>
  );
}

export function SupportSection() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<SupportData>({ company: '', whatsapp: '', website: '', instagram: '' });

  useEffect(() => {
    supabase.from('system_config').select('value').eq('key', 'support_data').then(({ data: rows }) => {
      if (rows && rows.length > 0) {
        const raw = rows[0].value as any;
        setData({ company: raw.company || '', whatsapp: raw.whatsapp || '', website: raw.website || '', instagram: raw.instagram || '' });
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
      await supabase.from('system_config').upsert({ key: 'support_data', value: data as any }, { onConflict: 'key' });
      toast.success('Dados de suporte salvos!');
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const hasAnyData = data.company || data.whatsapp || data.website || data.instagram;

  return (
    <div className="space-y-6">
      <BronzeCard className="bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border overflow-hidden relative">
        <div className="absolute top-4 right-4">
          {!isUnlocked ? (
            <button onClick={() => setShowPasswordModal(true)} className="p-2 rounded-full bg-muted/60 hover:bg-muted transition-all" title="Editar">
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
            {isUnlocked ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nome / Empresa</label>
                <input type="text" value={data.company} onChange={e => setData({ ...data, company: e.target.value })} className="input-bronze" placeholder="Nome ou empresa" />
              </div>
            ) : data.company ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Empresa</p>
                  <CopyableText text={data.company} />
                </div>
              </div>
            ) : null}

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
                  <CopyableText text={data.whatsapp} />
                </div>
              </div>
            ) : null}

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
                  <CopyableText text={data.website} isLink />
                </div>
              </div>
            ) : null}

            {isUnlocked ? (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Instagram</label>
                <input type="text" value={data.instagram} onChange={e => setData({ ...data, instagram: e.target.value })} className="input-bronze" placeholder="https://instagram.com/..." />
              </div>
            ) : data.instagram ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Instagram size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Instagram</p>
                  <CopyableText text={data.instagram} isLink />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </BronzeCard>

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
              <button onClick={() => { setShowPasswordModal(false); setPasswordInput(''); }} className="flex-1 px-4 py-2 bg-secondary border border-border rounded-xl text-xs font-black uppercase">
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
