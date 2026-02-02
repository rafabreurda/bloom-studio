import { Save } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { SystemConfig } from '@/types';
import { toast } from 'sonner';

interface ConfigViewProps {
  config: SystemConfig;
  onConfigChange: (config: SystemConfig) => void;
}

export function ConfigView({ config, onConfigChange }: ConfigViewProps) {
  const handleSave = () => {
    toast.success('Configurações salvas!');
  };

  return (
    <div className="space-y-8 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight">Estúdio</h2>
        <BronzeButton variant="gold" icon={Save} size="sm" onClick={handleSave}>
          Salvar Tudo
        </BronzeButton>
      </div>

      {/* Settings */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-6 pr-2">
        <BronzeCard className="bg-secondary/50 space-y-8">
          {/* Studio Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Nome do Estúdio
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => onConfigChange({ ...config, name: e.target.value.toUpperCase() })}
              className="input-bronze"
            />
          </div>

          {/* PIX Key */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Chave PIX
            </label>
            <input
              type="text"
              value={config.pixKey}
              onChange={(e) => onConfigChange({ ...config, pixKey: e.target.value })}
              className="input-bronze"
            />
          </div>

          {/* Payment Link */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Link de Pagamento
            </label>
            <input
              type="text"
              value={config.payLink}
              onChange={(e) => onConfigChange({ ...config, payLink: e.target.value })}
              className="input-bronze"
            />
          </div>
        </BronzeCard>
      </div>
    </div>
  );
}
