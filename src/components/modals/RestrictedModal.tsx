import { ShieldAlert } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';

interface RestrictedModalProps {
  onClose: () => void;
}

export function RestrictedModal({ onClose }: RestrictedModalProps) {
  return (
    <div className="fixed inset-0 bg-background/95 z-[200] flex items-center justify-center p-6 backdrop-blur-xl animate-zoom-in">
      <BronzeCard className="w-full max-w-sm text-center space-y-6 border-primary/50">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
          <ShieldAlert size={40} className="text-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase text-foreground">Acesso Restrito</h3>
          <p className="text-sm text-muted-foreground font-bold leading-relaxed">
            Módulo bloqueado para nível Junior. Solicite ao{' '}
            <span className="text-foreground">Administrador Chefe</span>.
          </p>
        </div>
        
        <BronzeButton 
          variant="gold" 
          className="w-full h-[54px]" 
          onClick={onClose}
        >
          FECHAR (OK)
        </BronzeButton>
      </BronzeCard>
    </div>
  );
}
