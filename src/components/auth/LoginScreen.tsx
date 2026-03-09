import { useState } from 'react';
import { Eye, EyeOff, LogIn, KeyRound } from 'lucide-react';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { useAuth } from '@/contexts/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import neurofluxLogo from '@/assets/neuroflux-logo.png';

export function LoginScreen() {
  const { admins, switchAdmin, isLoading } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) return;

    setIsSubmitting(true);
    setError('');

    // Find admin by name or username (case insensitive, trimmed, flexible)
    const trimmedLogin = login.trim().toLowerCase();
    const admin = admins.find(
      a => a.name.trim().toLowerCase() === trimmedLogin ||
           (a.username && a.username.trim().toLowerCase() === trimmedLogin) ||
           a.name.trim().toLowerCase().replace(/\s+/g, '') === trimmedLogin.replace(/\s+/g, '')
    );

    if (!admin) {
      console.log('[LOGIN] Admins disponíveis:', admins.map(a => a.name));
      setError('Usuário não encontrado.');
      setIsSubmitting(false);
      return;
    }

    const success = await switchAdmin(admin.id, password);
    if (!success) {
      setError('Senha incorreta. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <img 
            src={neurofluxLogo} 
            alt="Neuro Flux Systems" 
            className="w-48 h-48 object-contain"
          />
          <p className="text-sm text-muted-foreground">
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card p-6 rounded-3xl border border-border shadow-lg">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Nome
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => { setLogin(e.target.value); setError(''); }}
              className="input-bronze w-full"
              placeholder="Seu nome"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="input-bronze w-full pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive font-bold text-center">{error}</p>
          )}

          <BronzeButton
            type="submit"
            variant="gold"
            icon={LogIn}
            className="w-full h-[56px]"
            disabled={isSubmitting || !login || !password}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </BronzeButton>

          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-2"
          >
            <KeyRound size={14} />
            Esqueci minha senha
          </button>
        </form>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
}
