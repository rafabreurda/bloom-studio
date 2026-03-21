import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchAllFromTable } from '@/lib/supabaseFetchAll';
import { WaitingItem } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useWaitingList() {
  const [waitingList, setWaitingList] = useState<WaitingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentAdmin, isAdminChefe } = useAuth();

  const fetchWaitingList = useCallback(async () => {
    try {
      const filters: Record<string, string> = {};
      if (currentAdmin && !isAdminChefe) {
        filters.owner_id = currentAdmin.id;
      }

      const data = await fetchAllFromTable('waiting_list', '*', { orderBy: 'created_at', ascending: false, filters: Object.keys(filters).length > 0 ? filters : undefined });

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
  }, [currentAdmin, isAdminChefe]);

  useEffect(() => {
    if (currentAdmin) fetchWaitingList();
  }, [fetchWaitingList, currentAdmin]);

  const addWaiting = async (item: Omit<WaitingItem, 'id' | 'createdAt'>) => {
    try {
      const dateParts = item.desiredDate.split('/');
      const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      const { data, error } = await supabase
        .from('waiting_list')
        .insert({
          name: item.name,
          phone: item.phone,
          desired_date: isoDate,
          status: item.status,
          owner_id: currentAdmin?.id,
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
      let query = supabase.from('waiting_list').delete().eq('id', id);
      if (!isAdminChefe && currentAdmin) query = query.eq('owner_id', currentAdmin.id);
      const { error } = await query;

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
