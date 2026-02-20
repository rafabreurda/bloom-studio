import { useState } from 'react';
import { Mic, MicOff, X, Check, Loader2 } from 'lucide-react';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';
import { toast } from 'sonner';
import { Finance } from '@/types';

interface VoiceCommandButtonProps {
  onAddFinance: (finance: Omit<Finance, 'id'>) => Promise<any>;
  onAddAppointment: (appointment: any) => Promise<any>;
}

export function VoiceCommandButton({ onAddFinance, onAddAppointment }: VoiceCommandButtonProps) {
  const { isListening, transcript, lastResult, startListening, stopListening, reset, isSupported } = useVoiceCommand();
  const [showPanel, setShowPanel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isSupported) return null;

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setShowPanel(true);
      startListening();
    }
  };

  const handleConfirm = async () => {
    if (!lastResult || lastResult.type === 'unknown') return;
    
    setIsProcessing(true);
    try {
      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

      if (lastResult.type === 'expense') {
        await onAddFinance({
          date: dateStr,
          description: lastResult.description || 'Despesa por voz',
          type: 'out',
          value: lastResult.value || 0,
          paymentMethod: lastResult.paymentMethod || 'Dinheiro',
          category: 'expense',
          isPartnership: false,
        });
        toast.success(`Despesa de R$ ${lastResult.value?.toFixed(2)} adicionada!`);
      } else if (lastResult.type === 'revenue') {
        await onAddFinance({
          date: dateStr,
          description: lastResult.description || 'Receita por voz',
          type: 'in',
          value: lastResult.value || 0,
          paymentMethod: lastResult.paymentMethod || 'Dinheiro',
          category: 'session',
          isPartnership: false,
        });
        toast.success(`Receita de R$ ${lastResult.value?.toFixed(2)} adicionada!`);
      } else if (lastResult.type === 'appointment') {
        if (!lastResult.clientName || !lastResult.time) {
          toast.error('Informe o nome do cliente e horário. Ex: "Agende cliente Maria às 14h"');
          setIsProcessing(false);
          return;
        }
        await onAddAppointment({
          clientName: lastResult.clientName,
          phone: lastResult.phone || '',
          date: lastResult.date || today.toISOString().split('T')[0],
          time: lastResult.time,
          status: 'Agendado',
          value: lastResult.value || 0,
          totalValue: lastResult.value || 0,
          productsValue: 0,
          chargedValue: lastResult.value || 0,
          cost: 0,
          paymentMethod: 'Dinheiro',
          tags: [],
          isConfirmed: true,
          isPartnership: false,
          products: [],
        });
        toast.success(`Agendamento para ${lastResult.clientName} às ${lastResult.time} criado!`);
      }

      handleClose();
    } catch (error) {
      toast.error('Erro ao processar comando.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    stopListening();
    reset();
    setShowPanel(false);
  };

  const getResultLabel = () => {
    if (!lastResult) return null;
    switch (lastResult.type) {
      case 'expense':
        return `💸 Despesa: R$ ${lastResult.value?.toFixed(2) || '0.00'} — ${lastResult.description}`;
      case 'revenue':
        return `💰 Receita: R$ ${lastResult.value?.toFixed(2) || '0.00'} — ${lastResult.description}`;
      case 'appointment':
        return `📅 Agendamento: ${lastResult.clientName || '?'} às ${lastResult.time || '?'}`;
      case 'unknown':
        return '❓ Comando não reconhecido. Tente: "adicione 50 reais nas despesas aluguel"';
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={handleMicClick}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {/* Panel */}
      {showPanel && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:w-96 z-[100] bg-card border border-border rounded-2xl shadow-2xl p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary" />
              Comando de Voz
            </h3>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Transcript */}
          <div className="min-h-[48px] bg-muted/50 rounded-lg p-3 mb-3 text-sm text-foreground">
            {isListening && !transcript && (
              <span className="text-muted-foreground italic flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Ouvindo...
              </span>
            )}
            {transcript && <span>"{transcript}"</span>}
            {!isListening && !transcript && (
              <span className="text-muted-foreground italic">Clique no microfone para começar</span>
            )}
          </div>

          {/* Parsed result */}
          {lastResult && !isListening && (
            <div className={`rounded-lg p-3 mb-3 text-sm ${
              lastResult.type === 'unknown' 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-primary/10 text-foreground'
            }`}>
              {getResultLabel()}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleMicClick}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {isListening ? 'Parar' : 'Ouvir novamente'}
            </button>
            
            {lastResult && lastResult.type !== 'unknown' && !isListening && (
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Confirmar
                  </>
                )}
              </button>
            )}
          </div>

          {/* Help */}
          <p className="text-xs text-muted-foreground mt-3">
            Exemplos: "adicione 50 reais nas despesas aluguel" · "adicione 100 no faturamento" · "agende cliente Maria às 14h"
          </p>
        </div>
      )}
    </>
  );
}
