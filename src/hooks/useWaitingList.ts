import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WaitingItem } from '@/types';
import { toast } from 'sonner';

export function useWaitingList() {
  const [waitingList, setWaitingList] = useState<WaitingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWaitingList = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('waiting_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWaitingList(data?.map(w => ({
        id: w.id,
        name: w.name,
        phone: w.phone,
        desiredDate: new Date(w.desired_date).toLocaleDateString('pt-BR'),
        status: w.status as 'Aguardando' | 'Agendado',
        createdAt: new Date(w.created_at),
      })) || []);
    } catch (error) {
      console.error('Erro ao carregar lista de espera:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWaitingList();
  }, [fetchWaitingList]);

  const addWaiting = async (item: Omit<WaitingItem, 'id' | 'createdAt'>) => {
    try {
      // Parse date from DD/MM/YYYY to YYYY-MM-DD
      const dateParts = item.desiredDate.split('/');
      const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      const { data, error } = await supabase
        .from('waiting_list')
        .insert({
          name: item.name,
          phone: item.phone,
          desired_date: isoDate,
          status: item.status,
        })
        .select()
        .single();

      if (error) throw error;

      const newItem: WaitingItem = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        desiredDate: new Date(data.desired_date).toLocaleDateString('pt-BR'),
        status: data.status as 'Aguardando' | 'Agendado',
        createdAt: new Date(data.created_at),
      };

      setWaitingList(prev => [newItem, ...prev]);
      toast.success('Adicionado à lista de espera!');
      return newItem;
    } catch (error) {
      console.error('Erro ao adicionar à lista de espera:', error);
      toast.error('Erro ao adicionar');
      throw error;
    }
  };

  const completeWaiting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('waiting_list')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWaitingList(prev => prev.filter(w => w.id !== id));
      toast.success('Cliente atendido!');
    } catch (error) {
      console.error('Erro ao completar espera:', error);
      toast.error('Erro ao marcar como atendido');
      throw error;
    }
  };

  return {
    waitingList,
    loading,
    addWaiting,
    completeWaiting,
    refetch: fetchWaitingList,
  };
}
