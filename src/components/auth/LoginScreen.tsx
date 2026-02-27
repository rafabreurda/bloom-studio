import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { useAuth } from '@/contexts/AuthContext';

export function LoginScreen() {
  const { admins, switchAdmin, isLoading } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) return;

    setIsSubmitting(true);
    setError('');

    // Find admin by phone or name (case insensitive, trimmed)
    const trimmedLogin = login.trim().toLowerCase();
    const admin = admins.find(
      a => a.phone?.trim().toLowerCase() === trimmedLogin || a.name.trim().toLowerCase() === trimmedLogin
    );

    if (!admin) {
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
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
            NeuroFlix Systems
          </h1>
          <p className="text-sm text-muted-foreground">
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card p-6 rounded-3xl border border-border shadow-lg">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Usuário
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => {
                setLogin(e.target.value);
                setError('');
              }}
              className="input-bronze w-full"
              placeholder="Nome ou telefone"
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
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
        </form>
      </div>
    </div>
  );
}
