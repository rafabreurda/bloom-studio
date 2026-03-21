import { useEffect, useRef, useCallback } from 'react';
import { Appointment, Finance } from '@/types';
import { isFinanceProcessed, markFinanceProcessed } from '@/lib/financeTracker';

interface UseAutoCloseProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => Promise<void>;
  onAddFinance: (finance: Omit<Finance, 'id'>) => Promise<any>;
  onRefetchFinances?: () => void;
}

export function useAutoClose({ appointments, onUpdateAppointment, onAddFinance, onRefetchFinances }: UseAutoCloseProps) {
  const processedRef = useRef<Set<string>>(new Set());

  const checkAndAutoClose = useCallback(async () => {
    const now = new Date();
    // Format today as DD/MM/YYYY using São Paulo timezone
    const spNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const day = String(spNow.getDate()).padStart(2, '0');
    const month = String(spNow.getMonth() + 1).padStart(2, '0');
    const year = spNow.getFullYear();
    const todayStr = `${day}/${month}/${year}`;
    const currentMinutes = spNow.getHours() * 60 + spNow.getMinutes();

    // Get today's confirmed appointments sorted by time
    const todayAppos = appointments
      .filter(a => a.date === todayStr && a.status === 'Agendado')
      .sort((a, b) => {
        const [ah, am] = a.time.split(':').map(Number);
        const [bh, bm] = b.time.split(':').map(Number);
        return (ah * 60 + am) - (bh * 60 + bm);
      });

    for (let i = 0; i < todayAppos.length; i++) {
      const appo = todayAppos[i];
      if (processedRef.current.has(appo.id)) continue;

      const [h, m] = appo.time.split(':').map(Number);
      const appoMinutes = h * 60 + m;

      // Check if next appointment's time has arrived (or 60min passed if last)
      let shouldClose = false;
      if (i < todayAppos.length - 1) {
        const next = todayAppos[i + 1];
        const [nh, nm] = next.time.split(':').map(Number);
        const nextMinutes = nh * 60 + nm;
        shouldClose = currentMinutes >= nextMinutes;
      } else {
        // Last appointment: close after 60 minutes
        shouldClose = currentMinutes >= appoMinutes + 60;
      }

      if (shouldClose) {
        processedRef.current.add(appo.id);
        try {
          await onUpdateAppointment({ ...appo, status: 'Concluído' });

          // Only create finance if not already created (check DB flag first, then session cache)
          if (appo.chargedValue > 0 && appo.paymentMethod && !appo.financeCreated && !isFinanceProcessed(appo.id)) {
            markFinanceProcessed(appo.id);
            await onAddFinance({
              date: appo.date,
              description: `Sessão (auto) - ${appo.clientName}`,
              type: 'in',
              value: appo.chargedValue,
              paymentMethod: appo.paymentMethod,
              category: appo.isPartnership ? 'partnership' : 'session',
              isPartnership: appo.isPartnership,
            });
            onRefetchFinances?.();
          }
        } catch (err) {
          console.error('Erro ao encerrar automaticamente:', err);
          processedRef.current.delete(appo.id);
        }
      }
    }
  }, [appointments, onUpdateAppointment, onAddFinance, onRefetchFinances]);

  useEffect(() => {
    // Check immediately and then every 60 seconds
    checkAndAutoClose();
    const interval = setInterval(checkAndAutoClose, 60000);
    return () => clearInterval(interval);
  }, [checkAndAutoClose]);
}
