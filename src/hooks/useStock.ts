import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchAllFromTable } from '@/lib/supabaseFetchAll';
import { StockItem } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useStock() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentAdmin, isAdminChefe } = useAuth();

  const fetchStock = useCallback(async () => {
    try {
      const filters: Record<string, string> = {};
      if (currentAdmin && !isAdminChefe) {
        filters.owner_id = currentAdmin.id;
      }

      const data = await fetchAllFromTable('stock', '*', { orderBy: 'name', ascending: true, filters: Object.keys(filters).length > 0 ? filters : undefined });

      setStock(data?.map(s => ({
        id: s.id,
        name: s.name,
        quantity: s.quantity,
        price: Number(s.price),
        minStock: s.min_stock,
      })) || []);
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
    } finally {
      setLoading(false);
    }
  }, [currentAdmin, isAdminChefe]);

  useEffect(() => {
    if (currentAdmin) fetchStock();
  }, [fetchStock, currentAdmin]);

  const addStock = async (item: Omit<StockItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('stock')
        .insert({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          min_stock: item.minStock,
          owner_id: currentAdmin?.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newItem: StockItem = {
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        price: Number(data.price),
        minStock: data.min_stock,
      };

      setStock(prev => [...prev, newItem]);
      toast.success('Produto cadastrado!');
      return newItem;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast.error('Erro ao cadastrar produto');
      throw error;
    }
  };

  const updateStock = async (item: StockItem) => {
    try {
      const { error } = await supabase
        .from('stock')
        .update({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          min_stock: item.minStock,
        })
        .eq('id', item.id);

      if (error) throw error;

      setStock(prev => prev.map(s => s.id === item.id ? item : s));
      toast.success('Produto atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto');
      throw error;
    }
  };

  const deleteStock = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStock(prev => prev.filter(s => s.id !== id));
      toast.success('Produto removido!');
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      toast.error('Erro ao remover produto');
      throw error;
    }
  };

  const adjustQuantity = async (id: string, delta: number) => {
    const item = stock.find(s => s.id === id);
    if (!item) return;

    const newQuantity = Math.max(0, item.quantity + delta);
    
    try {
      const { error } = await supabase
        .from('stock')
        .update({ quantity: newQuantity })
        .eq('id', id);

      if (error) throw error;

      setStock(prev => prev.map(s => s.id === id ? { ...s, quantity: newQuantity } : s));
    } catch (error) {
      console.error('Erro ao ajustar quantidade:', error);
      toast.error('Erro ao ajustar quantidade');
    }
  };

  return {
    stock,
    loading,
    addStock,
    updateStock,
    deleteStock,
    adjustQuantity,
    refetch: fetchStock,
  };
}
