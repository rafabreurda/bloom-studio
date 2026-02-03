import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Block } from '@/types';
import { toast } from 'sonner';

export function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlocks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blocks')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      setBlocks(data?.map(b => ({
        id: b.id,
        date: new Date(b.date).toLocaleDateString('pt-BR'),
        endDate: b.end_date ? new Date(b.end_date).toLocaleDateString('pt-BR') : undefined,
        time: b.time,
        type: b.type as 'allDay' | 'timeRange' | 'dateRange',
        reason: b.reason || '',
        createdAt: new Date(b.created_at),
      })) || []);
    } catch (error) {
      console.error('Erro ao carregar bloqueios:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const addBlock = async (block: Omit<Block, 'id' | 'createdAt'>) => {
    try {
      // Parse date from DD/MM/YYYY to YYYY-MM-DD
      const dateParts = block.date.split('/');
      const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      let isoEndDate = null;
      if (block.endDate) {
        const endParts = block.endDate.split('/');
        isoEndDate = `${endParts[2]}-${endParts[1]}-${endParts[0]}`;
      }

      const { data, error } = await supabase
        .from('blocks')
        .insert({
          date: isoDate,
          end_date: isoEndDate,
          time: block.time,
          type: block.type,
          reason: block.reason,
        })
        .select()
        .single();

      if (error) throw error;

      const newBlock: Block = {
        id: data.id,
        date: new Date(data.date).toLocaleDateString('pt-BR'),
        endDate: data.end_date ? new Date(data.end_date).toLocaleDateString('pt-BR') : undefined,
        time: data.time,
        type: data.type as 'allDay' | 'timeRange' | 'dateRange',
        reason: data.reason || '',
        createdAt: new Date(data.created_at),
      };

      setBlocks(prev => [newBlock, ...prev]);
      toast.success('Horário bloqueado!');
      return newBlock;
    } catch (error) {
      console.error('Erro ao adicionar bloqueio:', error);
      toast.error('Erro ao bloquear horário');
      throw error;
    }
  };

  const deleteBlock = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBlocks(prev => prev.filter(b => b.id !== id));
      toast.success('Bloqueio removido!');
    } catch (error) {
      console.error('Erro ao remover bloqueio:', error);
      toast.error('Erro ao remover bloqueio');
      throw error;
    }
  };

  return {
    blocks,
    loading,
    addBlock,
    deleteBlock,
    refetch: fetchBlocks,
  };
}
