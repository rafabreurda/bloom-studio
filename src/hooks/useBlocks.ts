import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Block } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const parseIsoDate = (iso: string) => iso.split('-').reverse().join('/');

export function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentAdmin, isAdminChefe, admins } = useAuth();

  const fetchBlocks = useCallback(async () => {
    if (!currentAdmin) return;
    try {
      let query = (supabase.from('blocks' as any) as any)
        .select('*')
        .order('date', { ascending: false });

      if (!isAdminChefe) {
        // Sub-admin: vê bloqueios próprios + do chefe do mesmo salão
        const chefe = admins.find(a => a.role === 'admin_chefe');
        if (chefe && chefe.id !== currentAdmin.id) {
          query = query.or(`owner_id.eq.${currentAdmin.id},owner_id.eq.${chefe.id}`);
        } else {
          query = query.eq('owner_id', currentAdmin.id);
        }
      }
      // admin_chefe: sem filtro de owner_id, vê todos os bloqueios do salão

      const { data, error } = await query;
      if (error) throw error;

      setBlocks((data || []).map((b: any) => ({
        id: b.id,
        date: parseIsoDate(b.date),
        endDate: b.end_date ? parseIsoDate(b.end_date) : undefined,
        time: b.time,
        type: b.type as 'allDay' | 'timeRange' | 'dateRange',
        reason: b.reason || '',
        createdAt: new Date(b.created_at),
      })));
    } catch (error) {
      console.error('Erro ao carregar bloqueios:', error);
    } finally {
      setLoading(false);
    }
  }, [currentAdmin, isAdminChefe, admins]);

  useEffect(() => {
    if (currentAdmin) fetchBlocks();
  }, [fetchBlocks, currentAdmin]);

  const addBlock = async (block: Omit<Block, 'id' | 'createdAt'>) => {
    try {
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
          owner_id: currentAdmin?.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newBlock: Block = {
        id: data.id,
        date: parseIsoDate(data.date),
        endDate: data.end_date ? parseIsoDate(data.end_date) : undefined,
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
      let query = (supabase.from('blocks' as any) as any).delete().eq('id', id);
      if (!isAdminChefe && currentAdmin) query = query.eq('owner_id', currentAdmin.id);
      const { error } = await query;

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
