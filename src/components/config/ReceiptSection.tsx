import { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ReceiptConfig {
  studioName: string;
  cpfCnpj: string;
  address: string;
  whatsapp: string;
  email: string;
  footerMessage: string;
  signerName: string;
}

const defaultReceiptConfig: ReceiptConfig = {
  studioName: '',
  cpfCnpj: '',
  address: '',
  whatsapp: '',
  email: '',
  footerMessage: '',
  signerName: '',
};

export function ReceiptSection() {
  const { currentAdmin } = useAuth();
  const [config, setConfig] = useState<ReceiptConfig>(defaultReceiptConfig);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!currentAdmin?.id) return;
    supabase.from('system_config').select('value').eq('key', 'receipt_config').eq('owner_id', currentAdmin.id).then(({ data }) => {
      if (data && data.length > 0 && data[0].value) {
        setConfig({ ...defaultReceiptConfig, ...(data[0].value as unknown as ReceiptConfig) });
      } else {
        setConfig(defaultReceiptConfig);
      }
    });
  }, [currentAdmin?.id]);

  const handleSave = async () => {
    if (!currentAdmin?.id) return;
    setIsSaving(true);
    try {
      const { data: existing } = await supabase.from('system_config').select('id').eq('key', 'receipt_config').eq('owner_id', currentAdmin.id);
      if (existing && existing.length > 0) {
        await supabase.from('system_config').update({ value: config as any }).eq('id', existing[0].id);
      } else {
        await supabase.from('system_config').insert({ key: 'receipt_config', value: config as any, owner_id: currentAdmin.id });
      }
      toast.success('Configuração de recibo salva!');
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BronzeCard className="bg-secondary/50 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          <h3 className="text-lg font-black uppercase text-primary">Recibo</h3>
        </div>
        <BronzeButton variant="gold" icon={Save} size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar'}
        </BronzeButton>
      </div>

      <p className="text-xs text-muted-foreground">
        Configure os dados que aparecerão no recibo gerado a partir do agendamento.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Empresa</label>
          <input type="text" value={config.studioName} onChange={e => setConfig({ ...config, studioName: e.target.value })} className="input-bronze" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">CPF/CNPJ</label>
          <input type="text" value={config.cpfCnpj} onChange={e => setConfig({ ...config, cpfCnpj: e.target.value })} className="input-bronze" placeholder="000.000.000-00 ou 00.000.000/0001-00" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Endereço</label>
          <input type="text" value={config.address} onChange={e => setConfig({ ...config, address: e.target.value })} className="input-bronze" placeholder="Rua, número, bairro, cidade" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">WhatsApp</label>
            <input type="text" value={config.whatsapp} onChange={e => setConfig({ ...config, whatsapp: e.target.value })} className="input-bronze" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Email</label>
            <input type="text" value={config.email} onChange={e => setConfig({ ...config, email: e.target.value })} className="input-bronze" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nome do Assinante</label>
          <input type="text" value={config.signerName} onChange={e => setConfig({ ...config, signerName: e.target.value })} className="input-bronze" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Mensagem do Rodapé</label>
          <textarea value={config.footerMessage} onChange={e => setConfig({ ...config, footerMessage: e.target.value })} className="input-bronze min-h-[60px] resize-none" placeholder="Mensagem adicional no rodapé do recibo..." />
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-white rounded-2xl border border-border text-black space-y-3 text-center">
        <p className="font-black text-lg">{config.studioName}</p>
        {config.cpfCnpj && <p className="text-[10px] text-gray-500">CPF/CNPJ {config.cpfCnpj}</p>}
        {config.address && <p className="text-[10px] text-gray-500">{config.address}</p>}
        <div className="flex justify-center gap-4 text-[10px] text-gray-400">
          {config.whatsapp && <span>WhatsApp {config.whatsapp}</span>}
          {config.email && <span>{config.email}</span>}
        </div>
        <hr className="border-gray-200" />
        <p className="text-xs font-bold">Atendimento</p>
        <p className="text-[10px] text-gray-500">Cliente: [Nome do Agendamento]</p>
        <p className="text-[10px] text-gray-500">Data: [Data e Horário]</p>
        <p className="text-[10px] text-gray-500">Serviço: [Tipo de Serviço]</p>
        <hr className="border-gray-200" />
        <p className="text-[10px] text-gray-500">Valor total: R$ 0,00</p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-[10px] text-gray-400">_____________________________</p>
          <p className="text-[10px] text-gray-500 font-bold">{config.signerName}</p>
        </div>
      </div>
    </BronzeCard>
  );
}
