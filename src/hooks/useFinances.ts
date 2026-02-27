import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchAllFromTable } from '@/lib/supabaseFetchAll';
import { Finance } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useFinances() {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentAdmin, isAdminChefe } = useAuth();

  const fetchFinances = useCallback(async () => {
    try {
      const filters: Record<string, string> = {};
      if (currentAdmin && !isAdminChefe) {
        filters.owner_id = currentAdmin.id;
      }

      const data = await fetchAllFromTable('finances', '*', { orderBy: 'date', ascending: false, filters: Object.keys(filters).length > 0 ? filters : undefined });

      setFinances(data?.map(f => ({
        id: f.id,
        date: (() => { const [y, m, d] = f.date.split('-'); return `${d}/${m}/${y}`; })(),
        description: f.description,
        type: f.type as 'in' | 'out',
        value: Number(f.value),
        paymentMethod: f.payment_method as 'Pix' | 'Cartão' | 'Dinheiro',
        category: f.category as 'session' | 'product' | 'partnership' | 'expense',
        isPartnership: f.is_partnership || false,
      })) || []);
    } catch (error) {
      console.error('Erro ao carregar finanças:', error);
    } finally {
      setLoading(false);
    }
  }, [currentAdmin, isAdminChefe]);

  useEffect(() => {
    if (currentAdmin) fetchFinances();
  }, [fetchFinances, currentAdmin]);

  const addFinance = async (finance: Omit<Finance, 'id'>) => {
    try {
      let isoDate = finance.date;
      if (finance.date.includes('/')) {
        const dateParts = finance.date.split('/');
        isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }

      const { data, error } = await supabase
        .from('finances')
        .insert({
          date: isoDate,
          description: finance.description,
          type: finance.type,
          value: finance.value,
          payment_method: finance.paymentMethod,
          category: finance.category,
          is_partnership: finance.isPartnership,
          owner_id: currentAdmin?.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newFinance: Finance = {
        id: data.id,
        date: (() => { const [y, m, d] = data.date.split('-'); return `${d}/${m}/${y}`; })(),
        description: data.description,
        type: data.type as 'in' | 'out',
        value: Number(data.value),
        paymentMethod: data.payment_method as 'Pix' | 'Cartão' | 'Dinheiro',
        category: data.category as 'session' | 'product' | 'partnership' | 'expense',
        isPartnership: data.is_partnership || false,
      };

      setFinances(prev => [newFinance, ...prev]);
      toast.success('Transação adicionada!');
      return newFinance;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast.error('Erro ao adicionar transação');
      throw error;
    }
  };

  const deleteFinance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('finances')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFinances(prev => prev.filter(f => f.id !== id));
      toast.success('Transação removida!');
    } catch (error) {
      console.error('Erro ao remover transação:', error);
      toast.error('Erro ao remover transação');
      throw error;
    }
  };

  return {
    finances,
    loading,
    addFinance,
    deleteFinance,
    refetch: fetchFinances,
  };
}
