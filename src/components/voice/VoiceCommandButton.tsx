import { useState, useEffect } from 'react';
import { Mic, MicOff, X, Loader2 } from 'lucide-react';
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

  const toDisplayDate = (isoDate: string) => {
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  };

  const executeCommand = async (result: typeof lastResult) => {
    if (!result || result.type === 'unknown') {
      toast.error('Comando não reconhecido. Tente: "adicione 50 reais nas despesas aluguel"');
      return;
    }

    setIsProcessing(true);
    try {
      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

      if (result.type === 'expense') {
        await onAddFinance({
          date: dateStr,
          description: result.description || 'Despesa por voz',
          type: 'out',
          value: result.value || 0,
          paymentMethod: result.paymentMethod || 'Dinheiro',
          category: 'expense',
          isPartnership: false,
        });
        toast.success(`💸 Despesa de R$ ${result.value?.toFixed(2)} adicionada!`);
      } else if (result.type === 'revenue') {
        await onAddFinance({
          date: dateStr,
          description: result.description || 'Receita por voz',
          type: 'in',
          value: result.value || 0,
          paymentMethod: result.paymentMethod || 'Dinheiro',
          category: 'session',
          isPartnership: false,
        });
        toast.success(`💰 Receita de R$ ${result.value?.toFixed(2)} adicionada!`);
      } else if (result.type === 'appointment') {
        if (!result.clientName) {
          toast.error('Informe o nome do cliente. Ex: "Agende Claudia dia 21-02 19hs bronze medio"');
          setIsProcessing(false);
          return;
        }
        if (!result.time) {
          toast.error('Informe o horário. Ex: "Agende Claudia dia 21-02 19hs"');
          setIsProcessing(false);
          return;
        }
        const isoDate = result.date || today.toISOString().split('T')[0];
        const tags = result.service ? [result.service] : [];
        await onAddAppointment({
          clientName: result.clientName,
          phone: result.phone || '',
          date: toDisplayDate(isoDate),
          time: result.time,
          status: 'Agendado',
          value: result.value || 0,
          totalValue: result.value || 0,
          productsValue: 0,
          chargedValue: result.value || 0,
          cost: 0,
          paymentMethod: 'Dinheiro',
          tags,
          isConfirmed: true,
          isPartnership: false,
          products: [],
        });
        toast.success(`📅 ${result.clientName} agendada às ${result.time}${result.service ? ` - ${result.service}` : ''}!`);
      }

      handleClose();
    } catch (error) {
      toast.error('Erro ao processar comando.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-execute when recognition finishes (no confirmation needed)
  useEffect(() => {
    if (lastResult && !isListening && !isProcessing) {
      executeCommand(lastResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult, isListening]);

  if (!isSupported) return null;

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setShowPanel(true);
      startListening();
    }
  };

  const handleClose = () => {
    stopListening();
    reset();
    setShowPanel(false);
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

          <div className="min-h-[48px] bg-muted/50 rounded-lg p-3 mb-3 text-sm text-foreground">
            {isListening && !transcript && (
              <span className="text-muted-foreground italic flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Ouvindo...
              </span>
            )}
            {transcript && <span>"{transcript}"</span>}
            {isProcessing && (
              <span className="text-muted-foreground italic flex items-center gap-2 mt-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Executando...
              </span>
            )}
            {!isListening && !transcript && !isProcessing && (
              <span className="text-muted-foreground italic">Clique no microfone para começar</span>
            )}
          </div>

          <button
            onClick={handleMicClick}
            disabled={isProcessing}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
              isListening
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {isListening ? 'Parar' : 'Ouvir novamente'}
          </button>

          <p className="text-xs text-muted-foreground mt-3">
            Exemplos: "adicione 50 reais nas despesas aluguel" · "adicione 100 no faturamento" · "agende cliente Maria às 14h"
          </p>
        </div>
      )}
    </>
  );
}
