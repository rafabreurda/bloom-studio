import { useState } from 'react';
import { X, KeyRound, CheckCircle2 } from 'lucide-react';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    // Need at least 2 of 3 fields filled
    const filledFields = [name, cpf, phone].filter(f => f.trim()).length;
    if (filledFields < 2) {
      setError('Preencha pelo menos 2 dos 3 campos de identificação.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch all profiles with matching criteria
      const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, cpf, phone');

      if (fetchError) throw fetchError;

      // Find matching profile (2 of 3 must match)
      const matchedProfile = profiles?.find(p => {
        let matches = 0;
        if (name.trim() && p.name?.trim().toLowerCase() === name.trim().toLowerCase()) matches++;
        if (cpf.trim() && p.cpf?.trim() === cpf.trim().replace(/\D/g, '')) matches++;
        if (phone.trim() && p.phone?.trim().replace(/\D/g, '') === phone.trim().replace(/\D/g, '')) matches++;
        return matches >= 2;
      });

      if (!matchedProfile) {
        setError('Dados não conferem. Verifique as informações.');
        setIsSubmitting(false);
        return;
      }

      // Set new password
      await supabase.rpc('set_admin_password', { _user_id: matchedProfile.id, _password: newPassword });
      await supabase.from('profiles').update({ password_display: newPassword } as any).eq('id', matchedProfile.id);

      toast.success('Senha alterada com sucesso!');
      onClose();
    } catch {
      setError('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <BronzeCard className="w-full max-w-md bg-card border-primary/30 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h3 className="text-xl font-black uppercase">Recuperar Senha</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Preencha pelo menos 2 dos 3 campos abaixo para confirmar sua identidade.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Nome Completo
            </label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-bronze" placeholder="Seu nome completo" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              CPF
            </label>
            <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} className="input-bronze" placeholder="000.000.000-00" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Telefone
            </label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="input-bronze" placeholder="(11) 99999-9999" />
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Nova Senha *
              </label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-bronze" placeholder="••••••••" required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Confirmar Nova Senha *
              </label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-bronze" placeholder="••••••••" required />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive font-bold text-center">{error}</p>
          )}

          <BronzeButton type="submit" variant="gold" icon={CheckCircle2} className="w-full h-[56px]" disabled={isSubmitting}>
            {isSubmitting ? 'Verificando...' : 'Alterar Senha'}
          </BronzeButton>
        </form>
      </BronzeCard>
    </div>
  );
}
