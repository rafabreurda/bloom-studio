import { useState, useEffect, useRef } from 'react';
import { Save, Lock, Upload, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SUPPORT_PASSWORD = '607652';

export function SupportSection() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('system_config').select('value').eq('key', 'support_card_image').then(({ data: rows }) => {
      if (rows && rows.length > 0) {
        const raw = rows[0].value as any;
        if (raw?.url) setImageUrl(raw.url);
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `support-card-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('studio-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('studio-assets')
        .getPublicUrl(fileName);

      const url = urlData.publicUrl;

      await supabase.from('system_config').upsert(
        { key: 'support_card_image', value: { url } as any },
        { onConflict: 'key' }
      );

      setImageUrl(url);
      toast.success('Cartão de visita atualizado!');
    } catch {
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      toast.success('Imagem copiada!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy URL
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      toast.success('Link da imagem copiado!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <BronzeCard className="bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border overflow-hidden relative">
        <div className="absolute top-4 right-4 z-10">
          {!isUnlocked ? (
            <button onClick={() => setShowPasswordModal(true)} className="p-2 rounded-full bg-muted/60 hover:bg-muted transition-all" title="Editar">
              <Lock size={14} className="text-muted-foreground" />
            </button>
          ) : (
            <BronzeButton variant="gold" size="sm" icon={Upload} onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
              {isSaving ? 'Enviando...' : 'Trocar Imagem'}
            </BronzeButton>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

        <div className="space-y-1 mb-6">
          <h3 className="text-lg font-black uppercase text-primary tracking-tight">Suporte</h3>
          <div className="w-10 h-0.5 bg-primary/40 rounded-full" />
        </div>

        {imageUrl ? (
          <div
            className="relative group cursor-pointer rounded-xl overflow-hidden"
            onClick={handleCopyImage}
          >
            <img
              src={imageUrl}
              alt="Cartão de visita"
              className="w-full h-auto rounded-xl border border-border/50 transition-transform group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-border flex items-center gap-2 shadow-lg">
                {copied ? (
                  <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-xs font-bold text-green-500">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="text-foreground" />
                    <span className="text-xs font-bold text-foreground">Copiar imagem</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <ImageIcon size={40} className="opacity-30" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-50">
              {isUnlocked ? 'Clique em "Trocar Imagem" para adicionar o cartão' : 'Nenhum cartão cadastrado'}
            </p>
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
