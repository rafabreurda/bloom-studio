import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface VoiceCommandResult {
  type: 'expense' | 'revenue' | 'appointment' | 'unknown';
  value?: number;
  description?: string;
  clientName?: string;
  phone?: string;
  time?: string;
  date?: string;
  service?: string;
  paymentMethod?: 'Pix' | 'Cartão' | 'Dinheiro';
  isPartnership?: boolean;
  partnershipName?: string;
  status?: 'Aguardando Sinal' | 'Agendado' | 'Concluído';
}

// Check browser support
const SpeechRecognition = typeof window !== 'undefined'
  ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  : null;

export function useVoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResult, setLastResult] = useState<VoiceCommandResult | null>(null);
  const recognitionRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      recognitionRef.current?.stop();
      setIsListening(false);
    }, 5000);
  }, [clearSilenceTimer]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearSilenceTimer();
  }, [clearSilenceTimer]);

  const parseCommand = useCallback((text: string): VoiceCommandResult => {
    const lower = text.toLowerCase().trim();

    // Parse value - look for numbers
    const valueMatch = lower.match(/(\d+[\.,]?\d*)\s*(reais|real|r\$)?/);
    const value = valueMatch ? parseFloat(valueMatch[1].replace(',', '.')) : undefined;

    // Parse payment method
    let paymentMethod: 'Pix' | 'Cartão' | 'Dinheiro' = 'Dinheiro';
    if (lower.includes('pix')) paymentMethod = 'Pix';
    else if (lower.includes('cartão') || lower.includes('cartao') || lower.includes('card')) paymentMethod = 'Cartão';

    // Parse time for appointments - support "19hs", "19h", "às 19", "19:00", "19 horas"
    const timeMatch = lower.match(/(\d{1,2})\s*(?:hs|h(?:oras?)?|:(\d{2}))/) ||
      lower.match(/(?:às|as|para\s*as)\s*(\d{1,2})\s*(?:horas|hora|h|hs|:(\d{2}))?/);
    const time = timeMatch 
      ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2] || '00'}`
      : undefined;

    // Detect EXPENSE commands
    if (lower.includes('despesa') || lower.includes('gasto') || 
        (lower.includes('adicione') && lower.includes('despesa')) ||
        lower.match(/adicione?\s+\d+.*despesa/) ||
        lower.match(/despesa.*\d+/)) {
      // Extract description - everything after "descrição", "de", or the category keyword
      let description = 'Despesa por voz';
      const descMatch = lower.match(/(?:descrição|descricao|de\s+)([\w\s]+?)(?:\s+(?:no|em|por|via)\s+|$)/);
      if (descMatch) {
        description = descMatch[1].trim();
      } else {
        // Try to get text after "despesas" or "despesa"
        const afterDespesa = lower.match(/despesas?\s+(.+?)(?:\s+(?:no|em|por|via|pix|cartão|cartao|dinheiro)\s*|$)/);
        if (afterDespesa) {
          description = afterDespesa[1].trim();
        }
      }
      // Capitalize first letter
      description = description.charAt(0).toUpperCase() + description.slice(1);

      return { type: 'expense', value, description, paymentMethod };
    }

    // Detect REVENUE commands
    if (lower.includes('faturamento') || lower.includes('receita') || lower.includes('entrada') ||
        (lower.includes('adicione') && (lower.includes('receita') || lower.includes('faturamento')))) {
      let description = 'Receita por voz';
      const descMatch = lower.match(/(?:descrição|descricao|de\s+)([\w\s]+?)(?:\s+(?:no|em|por|via)\s+|$)/);
      if (descMatch) {
        description = descMatch[1].trim();
        description = description.charAt(0).toUpperCase() + description.slice(1);
      }

      return { type: 'revenue', value, description, paymentMethod };
    }

    // Detect APPOINTMENT commands
    if (lower.includes('agende') || lower.includes('agendamento') || lower.includes('marque') || lower.includes('marcar')) {
      // Extract client name - simplified: "agende [name] dia/às/para"
      // Try patterns in order of specificity
      let clientName: string | undefined;
      
      // Pattern 1: "agende cliente chamada/o [name]"
      const nameMatch1 = lower.match(/(?:agende|marque|marcar)\s+(?:cliente\s+)?(?:chamad[ao]\s+)?([\p{L}\s]+?)(?:\s+(?:dia|às|as|para|no|telefone|fone|\d))/u);
      // Pattern 2: "agende [name]" (everything between command and next keyword)
      const nameMatch2 = lower.match(/(?:agende|marque|marcar)\s+([\p{L}\s]+?)(?:\s+(?:dia|às|as|para|no|telefone|fone|\d))/u);
      
      if (nameMatch1) {
        clientName = nameMatch1[1].trim();
      } else if (nameMatch2) {
        clientName = nameMatch2[1].trim();
      }
      
      // Remove "cliente" prefix if captured
      if (clientName) {
        clientName = clientName.replace(/^cliente\s*/i, '').trim();
        // Capitalize each word
        clientName = clientName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }

      // Extract phone
      const phoneMatch = lower.match(/(?:telefone|fone|cel)\s*([\d\s\-]+)/);
      const phone = phoneMatch ? phoneMatch[1].replace(/\s/g, '') : undefined;

      // Extract service type (e.g. "bronze medio", "bronze completo")
      const serviceMatch = lower.match(/bronze\s*(\w+)?/);
      const service = serviceMatch 
        ? serviceMatch[0].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : undefined;

      // Detect partnership - "parceria [name]" or "parceria com [name]"
      let isPartnership = false;
      let partnershipName: string | undefined;
      const partnershipMatch = lower.match(/parceria\s+(?:com\s+)?([\p{L}\s]+?)(?:\s+(?:dia|às|as|para|\d|bronze|pix|cartão|cartao|dinheiro|valor|aguardando|conclu|$))/u);
      if (lower.includes('parceria')) {
        isPartnership = true;
        if (partnershipMatch) {
          partnershipName = partnershipMatch[1].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
      }

      // Detect status
      let status: 'Aguardando Sinal' | 'Agendado' | 'Concluído' = 'Agendado';
      if (lower.includes('aguardando sinal') || lower.includes('aguardando')) {
        status = 'Aguardando Sinal';
      } else if (lower.includes('concluído') || lower.includes('concluido')) {
        status = 'Concluído';
      }

      // Parse date - default to today
      let date = new Date().toISOString().split('T')[0];
      if (lower.includes('amanhã') || lower.includes('amanha')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        date = tomorrow.toISOString().split('T')[0];
      } else {
        // "dia 21-02" or "dia 21/02" or "dia 21 02"
        const dayMonthNumMatch = lower.match(/dia\s+(\d{1,2})\s*[-\/\s]\s*(\d{1,2})(?:\s*[-\/\s]\s*(\d{2,4}))?/);
        if (dayMonthNumMatch) {
          const day = dayMonthNumMatch[1].padStart(2, '0');
          const month = dayMonthNumMatch[2].padStart(2, '0');
          const year = dayMonthNumMatch[3] 
            ? (dayMonthNumMatch[3].length === 2 ? `20${dayMonthNumMatch[3]}` : dayMonthNumMatch[3])
            : new Date().getFullYear().toString();
          date = `${year}-${month}-${day}`;
        } else {
          // "dia 20 de março"
          const monthNames: Record<string, string> = {
            janeiro: '01', fevereiro: '02', março: '03', marco: '03',
            abril: '04', maio: '05', junho: '06', julho: '07',
            agosto: '08', setembro: '09', outubro: '10', novembro: '11', dezembro: '12'
          };
          const dayMonthMatch = lower.match(/dia\s+(\d{1,2})\s+de\s+(\w+)/);
          if (dayMonthMatch) {
            const day = dayMonthMatch[1].padStart(2, '0');
            const month = monthNames[dayMonthMatch[2]] || new Date().toISOString().slice(5, 7);
            const year = new Date().getFullYear();
            date = `${year}-${month}-${day}`;
          }
          // DD/MM or DD/MM/YYYY
          const slashMatch = lower.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
          if (slashMatch && !dayMonthMatch) {
            const day = slashMatch[1].padStart(2, '0');
            const month = slashMatch[2].padStart(2, '0');
            const year = slashMatch[3] 
              ? (slashMatch[3].length === 2 ? `20${slashMatch[3]}` : slashMatch[3])
              : new Date().getFullYear().toString();
            date = `${year}-${month}-${day}`;
          }
        }
      }

      return { type: 'appointment', clientName, phone, time, date, value, service, isPartnership, partnershipName, status, paymentMethod };
    }

    return { type: 'unknown' };
  }, []);

  // Initialize recognition once and reuse
  const getRecognition = useCallback(() => {
    if (recognitionRef.current && initializedRef.current) {
      return recognitionRef.current;
    }

    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setLastResult(null);
      startSilenceTimer(); // Start 5s silence countdown
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
      
      // Reset silence timer on any speech activity
      if (interimTranscript || finalTranscript) {
        startSilenceTimer();
      }

      if (finalTranscript) {
        const result = parseCommand(finalTranscript);
        setLastResult(result);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('Permissão do microfone negada. Habilite nas configurações do navegador.');
      } else if (event.error !== 'aborted') {
        toast.error('Erro no reconhecimento de voz. Tente novamente.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      clearSilenceTimer();
    };

    recognitionRef.current = recognition;
    initializedRef.current = true;
    return recognition;
  }, [parseCommand, startSilenceTimer, clearSilenceTimer]);

  const startListening = useCallback(() => {
    const recognition = getRecognition();
    if (!recognition) {
      toast.error('Reconhecimento de voz não suportado neste navegador. Use Chrome ou Edge.');
      return;
    }

    try {
      recognition.start();
    } catch (e) {
      // If already started, abort and restart
      recognition.abort();
      setTimeout(() => recognition.start(), 100);
    }
  }, [getRecognition]);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    recognitionRef.current?.stop();
    setIsListening(false);
  }, [clearSilenceTimer]);

  const reset = useCallback(() => {
    setTranscript('');
    setLastResult(null);
  }, []);

  return {
    isListening,
    transcript,
    lastResult,
    startListening,
    stopListening,
    reset,
    isSupported: !!SpeechRecognition,
  };
}
