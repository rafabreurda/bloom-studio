import { useEffect, useState, useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Appointment } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface ReceiptModalProps {
  appointment: Appointment;
  onClose: () => void;
}

interface ReceiptConfig {
  studioName: string;
  cnpj: string;
  address: string;
  whatsapp: string;
  email: string;
  footerMessage: string;
  signerName: string;
}

export function ReceiptModal({ appointment, onClose }: ReceiptModalProps) {
  const [config, setConfig] = useState<ReceiptConfig>({
    studioName: 'Sole Mio Bronzeamento Saudável',
    cnpj: '',
    address: '',
    whatsapp: '',
    email: '',
    footerMessage: '',
    signerName: 'Rosangela Stapasolla',
  });
  const [logo, setLogo] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load receipt config and logo
    Promise.all([
      supabase.from('system_config').select('value').eq('key', 'receipt_config'),
      supabase.from('system_config').select('value').eq('key', 'studio_logo'),
    ]).then(([configRes, logoRes]) => {
      if (configRes.data?.[0]?.value) {
        setConfig(prev => ({ ...prev, ...(configRes.data[0].value as unknown as ReceiptConfig) }));
      }
      if (logoRes.data?.[0]?.value) {
        setLogo(logoRes.data[0].value as string);
      }
    });
  }, []);

  const now = new Date();
  const generatedAt = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const pendingValue = (appointment.totalValue || 0) - (appointment.chargedValue || 0);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !receiptRef.current) return;

    printWindow.document.write(`
      <html><head><title>Recibo</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; color: #333; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .text-sm { font-size: 14px; }
        .text-xs { font-size: 12px; }
        .text-gray { color: #888; }
        .mt { margin-top: 16px; }
        .mb { margin-bottom: 16px; }
        hr { border: none; border-top: 1px solid #ddd; margin: 12px 0; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 4px 0; font-size: 13px; }
        .right { text-align: right; }
        @media print { body { padding: 20px; } }
      </style>
      </head><body>
        ${receiptRef.current.innerHTML}
        <script>window.print(); window.close();</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
      <BronzeCard className="w-full max-w-lg bg-card border-primary/30 rounded-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black uppercase">Recibo</h3>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="p-2 text-muted-foreground hover:text-primary"><Printer size={20} /></button>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground"><X size={24} /></button>
          </div>
        </div>

        {/* Receipt content */}
        <div ref={receiptRef} className="bg-white rounded-2xl p-6 text-black space-y-4">
          {/* Header */}
          <div className="text-center space-y-1">
            {logo && <img src={logo} alt="Logo" className="h-16 mx-auto mb-2 object-contain" />}
            <p className="font-black text-lg">{config.studioName}</p>
            {config.cnpj && <p className="text-[11px] text-gray-500">CNPJ {config.cnpj}</p>}
            {config.address && <p className="text-[11px] text-gray-500">{config.address}</p>}
            <div className="flex justify-center gap-4 text-[11px] text-gray-400">
              {config.whatsapp && <span>WhatsApp {config.whatsapp}</span>}
              {config.email && <span>{config.email}</span>}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Client info */}
          <div className="space-y-1">
            <p className="font-bold text-sm text-center">Atendimento</p>
            <p className="text-xs">Cliente: <strong>{appointment.clientName}</strong></p>
            <p className="text-xs">Data & Horário: <strong>{appointment.date} {appointment.time}</strong></p>
            {appointment.serviceTypeName && (
              <p className="text-xs">Serviço: <strong>{appointment.serviceTypeName}</strong></p>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Services */}
          {appointment.serviceTypeName && (
            <div>
              <p className="font-bold text-xs mb-1">Serviços realizados</p>
              <p className="text-xs text-gray-600">{appointment.serviceTypeName}</p>
            </div>
          )}

          {/* Products */}
          {appointment.products && appointment.products.length > 0 && (
            <div>
              <p className="font-bold text-xs mb-1">Produtos</p>
              {appointment.products.map((p, i) => (
                <p key={i} className="text-xs text-gray-600">{p.name} — R$ {p.price.toFixed(2)}</p>
              ))}
            </div>
          )}

          <hr className="border-gray-200" />

          {/* Summary */}
          <div className="space-y-1">
            <p className="font-bold text-xs">Resumo</p>
            <div className="flex justify-between text-xs">
              <span>Valor total:</span>
              <span className="font-bold">R$ {(appointment.totalValue || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Total pago:</span>
              <span className="font-bold">R$ {(appointment.chargedValue || 0).toFixed(2)}</span>
            </div>
            {pendingValue > 0 && (
              <div className="flex justify-between text-xs text-red-600">
                <span>Valor pendente:</span>
                <span className="font-bold">R$ {pendingValue.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200 space-y-2">
            <p className="text-gray-400 text-[10px]">_____________________________________________</p>
            <p className="text-[11px] text-gray-400">Gerado em: {generatedAt}</p>
            <p className="text-xs font-bold text-gray-600">{config.signerName}</p>
            {config.footerMessage && <p className="text-[10px] text-gray-400 italic">{config.footerMessage}</p>}
          </div>
        </div>
      </BronzeCard>
    </div>
  );
}
