import { useState } from 'react';
import { X, Send, MessageSquare, Copy, CheckCircle2 } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { WhatsAppTemplate } from '@/types';
import { toast } from 'sonner';

interface WhatsAppSendModalProps {
  clientName: string;
  phone: string;
  date?: string;
  time?: string;
  value?: number;
  pixKey: string;
  templates: WhatsAppTemplate[];
  onClose: () => void;
}

export function WhatsAppSendModal({
  clientName,
  phone,
  date,
  time,
  value,
  pixKey,
  templates,
  onClose,
}: WhatsAppSendModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [customMessage, setCustomMessage] = useState('');
  const [mode, setMode] = useState<'template' | 'custom'>('template');

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const replaceVariables = (content: string) => {
    return content
      .replace(/\{nome\}/g, clientName || 'Cliente')
      .replace(/\{hora\}/g, time || '--:--')
      .replace(/\{data\}/g, date || '--/--')
      .replace(/\{valor\}/g, value != null ? `R$ ${value.toFixed(2)}` : 'R$ --')
      .replace(/\{pix\}/g, pixKey || '--');
  };

  const getFinalMessage = () => {
    if (mode === 'custom') return customMessage;
    if (!selectedTemplate) return '';
    let msg = replaceVariables(selectedTemplate.content);
    if (selectedTemplate.includePixKey && pixKey) {
      // Only add PIX if not already in the message
      if (!msg.includes(pixKey)) {
        msg += `\n\n💰 Chave PIX: ${pixKey}`;
      }
    }
    return msg;
  };

  const handleSend = () => {
    const msg = getFinalMessage();
    if (!msg.trim()) {
      toast.error('Escreva uma mensagem antes de enviar.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      toast.error('Telefone não informado para este cliente.');
      return;
    }
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  const handleCopyMessage = () => {
    const msg = getFinalMessage();
    navigator.clipboard.writeText(msg);
    toast.success('Mensagem copiada!');
  };

  const handleCopyPix = () => {
    if (pixKey) {
      navigator.clipboard.writeText(pixKey);
      toast.success('Chave PIX copiada!');
    }
  };

  const finalMessage = getFinalMessage();

  return (
    <div className="fixed inset-0 bg-background/90 z-[200] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
      <BronzeCard className="w-full max-w-lg bg-card border-primary/30 rounded-t-[32px] md:rounded-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-emerald-500" />
            <h3 className="text-lg font-black uppercase">WhatsApp</h3>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        {/* Client info */}
        <div className="p-3 rounded-xl bg-secondary border border-border mb-4">
          <p className="text-sm font-black">{clientName}</p>
          <p className="text-xs text-muted-foreground">{phone || 'Sem telefone'}</p>
          {date && time && (
            <p className="text-xs text-muted-foreground mt-1">📅 {date} às {time}</p>
          )}
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 rounded-xl border border-border bg-secondary mb-4">
          <button
            onClick={() => setMode('template')}
            className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
              mode === 'template' ? 'bg-emerald-500 text-white shadow-lg' : 'text-muted-foreground'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
              mode === 'custom' ? 'bg-emerald-500 text-white shadow-lg' : 'text-muted-foreground'
            }`}
          >
            Personalizada
          </button>
        </div>

        {mode === 'template' ? (
          <>
            {/* Template List */}
            <div className="space-y-2 mb-4">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedTemplateId === t.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-border bg-background hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{t.name}</span>
                    {t.includePixKey && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-bold rounded-full">
                        PIX
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{t.content}</p>
                </button>
              ))}
              {templates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum template criado. Crie em Configurações &gt; Mensagens.
                </p>
              )}
            </div>
          </>
        ) : (
          /* Custom message */
          <div className="mb-4">
            <textarea
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              className="input-bronze w-full min-h-[120px] resize-none"
              placeholder="Digite sua mensagem personalizada..."
            />
          </div>
        )}

        {/* Preview */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black uppercase text-emerald-600">Preview</p>
            <button onClick={handleCopyMessage} className="text-emerald-600 hover:text-emerald-700">
              <Copy size={14} />
            </button>
          </div>
          <p className="text-xs text-emerald-700 whitespace-pre-wrap">
            {finalMessage || 'Selecione um template ou escreva uma mensagem...'}
          </p>
        </div>

        {/* PIX quick copy */}
        {pixKey && (
          <button
            onClick={handleCopyPix}
            className="w-full p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between mb-4 hover:bg-primary/20 transition-all"
          >
            <div className="flex items-center gap-2">
              <Copy size={14} className="text-primary" />
              <span className="text-xs font-bold">Copiar PIX</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">{pixKey}</span>
          </button>
        )}

        {/* Send */}
        <BronzeButton
          variant="success"
          icon={Send}
          className="w-full h-[60px]"
          onClick={handleSend}
          disabled={!phone}
        >
          Enviar via WhatsApp
        </BronzeButton>
      </BronzeCard>
    </div>
  );
}