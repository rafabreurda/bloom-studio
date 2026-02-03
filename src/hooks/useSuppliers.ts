import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from '@/types';
import { toast } from 'sonner';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) throw error;

      setSuppliers(data?.map(s => ({
        id: s.id,
        name: s.name,
        contact: s.contact || '',
        products: s.products || '',
      })) || []);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          name: supplier.name,
          contact: supplier.contact,
          products: supplier.products,
        })
        .select()
        .single();

      if (error) throw error;

      const newSupplier: Supplier = {
        id: data.id,
        name: data.name,
        contact: data.contact || '',
        products: data.products || '',
      };

      setSuppliers(prev => [...prev, newSupplier]);
      toast.success('Fornecedor cadastrado!');
      return newSupplier;
    } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error);
      toast.error('Erro ao cadastrar fornecedor');
      throw error;
    }
  };

  const updateSupplier = async (supplier: Supplier) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({
          name: supplier.name,
          contact: supplier.contact,
          products: supplier.products,
        })
        .eq('id', supplier.id);

      if (error) throw error;

      setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
      toast.success('Fornecedor atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      toast.error('Erro ao atualizar fornecedor');
      throw error;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuppliers(prev => prev.filter(s => s.id !== id));
      toast.success('Fornecedor removido!');
    } catch (error) {
      console.error('Erro ao remover fornecedor:', error);
      toast.error('Erro ao remover fornecedor');
      throw error;
    }
  };

  return {
    suppliers,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers,
  };
}
