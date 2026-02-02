import { useState } from 'react';
import { X, Crown, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { AdminWithRole, getDisplayRole } from '@/types/admin';

interface AdminSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSwitchModal({ isOpen, onClose }: AdminSwitchModalProps) {
  const { admins, switchAdmin, rememberAdmin, currentAdmin } = useAuth();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminWithRole | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectAdmin = (admin: AdminWithRole) => {
    setError('');
    
    // If admin is chefe with password, show password form
    if (admin.role === 'admin_chefe' && admin.password_hash) {
      setSelectedAdmin(admin);
      setPassword('');
      return;
    }

    // Otherwise, switch directly
    handleSwitch(admin.id);
  };

  const handleSwitch = async (adminId: string, pwd?: string) => {
    setIsLoading(true);
    setError('');

    const success = await switchAdmin(adminId, pwd);

    if (success) {
      if (rememberMe) {
        rememberAdmin(adminId);
      }
      onClose();
    } else {
      setError('Senha incorreta');
    }

    setIsLoading(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAdmin) {
      handleSwitch(selectedAdmin.id, password);
    }
  };

  const handleBack = () => {
    setSelectedAdmin(null);
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    setSelectedAdmin(null);
    setPassword('');
    setError('');
    onClose();
  };

  // Sort admins: chefe first, then pleno, then junior
  const sortedAdmins = [...admins].sort((a, b) => {
    const order = { admin_chefe: 0, admin_pleno: 1, admin_junior: 2 };
    return order[a.role] - order[b.role];
  });

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <BronzeCard className="w-full max-w-md bg-card border-border rounded-3xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h3 className="text-xl font-black uppercase">
            {selectedAdmin ? `Olá, ${selectedAdmin.name.split(' ')[0]}!` : 'Trocar Administrador'}
          </h3>
          <button 
            onClick={handleClose} 
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Password Form */}
        {selectedAdmin ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-primary" size={32} />
              </div>
              <p className="text-sm text-muted-foreground">
                Digite sua senha para continuar
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-bronze pr-12"
                  placeholder="••••••••"
                  autoFocus
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

            <label className="flex items-center gap-3 p-3 bg-secondary rounded-xl cursor-pointer">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <span className="text-sm">Lembrar neste dispositivo</span>
            </label>

            <div className="flex gap-3">
              <BronzeButton
                type="button"
                variant="secondary"
                onClick={handleBack}
                className="flex-1"
              >
                Voltar
              </BronzeButton>
              <BronzeButton
                type="submit"
                variant="gold"
                icon={LogIn}
                className="flex-1"
                disabled={isLoading || !password}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </BronzeButton>
            </div>
          </form>
        ) : (
          /* Admin List */
          <div className="space-y-3">
            {admins.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">
                  Nenhum administrador cadastrado
                </p>
                <p className="text-xs text-muted-foreground">
                  Vá em Configurações → Administradores para adicionar
                </p>
              </div>
            ) : (
              sortedAdmins.map(admin => (
                <button
                  key={admin.id}
                  onClick={() => handleSelectAdmin(admin)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    currentAdmin?.id === admin.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-secondary border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    admin.role === 'admin_chefe' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}>
                    {admin.role === 'admin_chefe' ? (
                      <Crown size={24} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className="font-bold">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getDisplayRole(admin.role)}
                    </p>
                  </div>

                  {admin.role === 'admin_chefe' && admin.password_hash && (
                    <Lock size={18} className="text-muted-foreground" />
                  )}

                  {currentAdmin?.id === admin.id && (
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase rounded-full">
                      Ativo
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </BronzeCard>
    </div>
  );
}
