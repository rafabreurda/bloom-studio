import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchAllFromTable } from '@/lib/supabaseFetchAll';
import { Partnership } from '@/types';
import { toast } from 'sonner';

export function usePartnerships() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPartnerships = useCallback(async () => {
    try {
      const data = await fetchAllFromTable('partnerships', '*', { orderBy: 'name', ascending: true });

      setPartnerships(data?.map(p => ({
        id: p.id,
        name: p.name,
        discount: p.discount,
        contact: p.contact || '',
      })) || []);
    } catch (error) {
      console.error('Erro ao carregar parcerias:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartnerships();
  }, [fetchPartnerships]);

  const addPartnership = async (partnership: Omit<Partnership, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('partnerships')
        .insert({
          name: partnership.name,
          discount: partnership.discount,
          contact: partnership.contact,
        })
        .select()
        .single();

      if (error) throw error;

      const newPartnership: Partnership = {
        id: data.id,
        name: data.name,
        discount: data.discount,
        contact: data.contact || '',
      };

      setPartnerships(prev => [...prev, newPartnership]);
      toast.success('Parceria cadastrada!');
      return newPartnership;
    } catch (error) {
      console.error('Erro ao adicionar parceria:', error);
      toast.error('Erro ao cadastrar parceria');
      throw error;
    }
  };

  const updatePartnership = async (partnership: Partnership) => {
    try {
      const { error } = await supabase
        .from('partnerships')
        .update({
          name: partnership.name,
          discount: partnership.discount,
          contact: partnership.contact,
        })
        .eq('id', partnership.id);

      if (error) throw error;

      setPartnerships(prev => prev.map(p => p.id === partnership.id ? partnership : p));
      toast.success('Parceria atualizada!');
    } catch (error) {
      console.error('Erro ao atualizar parceria:', error);
      toast.error('Erro ao atualizar parceria');
      throw error;
    }
  };

  const deletePartnership = async (id: string) => {
    try {
      const { error } = await supabase
        .from('partnerships')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPartnerships(prev => prev.filter(p => p.id !== id));
      toast.success('Parceria removida!');
    } catch (error) {
      console.error('Erro ao remover parceria:', error);
      toast.error('Erro ao remover parceria');
      throw error;
    }
  };

  return {
    partnerships,
    loading,
    addPartnership,
    updatePartnership,
    deletePartnership,
    refetch: fetchPartnerships,
  };
}
