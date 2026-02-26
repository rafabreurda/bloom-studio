import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { useAuth } from '@/contexts/AuthContext';

export function LoginScreen() {
  const { admins, switchAdmin, rememberAdmin, isLoading } = useAuth();
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdminId || !password) return;

    setIsSubmitting(true);
    setError('');

    const success = await switchAdmin(selectedAdminId, password);
    if (success) {
      rememberAdmin(selectedAdminId);
    } else {
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
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
            Bronze Pro
          </h1>
          <p className="text-sm text-muted-foreground">
            Faça login para continuar
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-card p-6 rounded-3xl border border-border shadow-lg">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Usuário
            </label>
            <select
              value={selectedAdminId}
              onChange={(e) => {
                setSelectedAdminId(e.target.value);
                setError('');
              }}
              className="input-bronze w-full"
              required
            >
              <option value="">Selecione o usuário</option>
              {admins.map(admin => (
                <option key={admin.id} value={admin.id}>
                  {admin.name} {admin.phone ? `(${admin.phone})` : ''}
                </option>
              ))}
            </select>
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
            disabled={isSubmitting || !selectedAdminId || !password}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </BronzeButton>
        </form>
      </div>
    </div>
  );
}
