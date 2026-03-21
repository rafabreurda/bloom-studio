import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchAllFromTable } from '@/lib/supabaseFetchAll';
import { Supplier } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentAdmin, isAdminChefe } = useAuth();

  const fetchSuppliers = useCallback(async () => {
    try {
      const filters: Record<string, string> = {};
      if (currentAdmin && !isAdminChefe) {
        filters.owner_id = currentAdmin.id;
      }

      const data = await fetchAllFromTable('suppliers', '*', { orderBy: 'name', ascending: true, filters: Object.keys(filters).length > 0 ? filters : undefined });

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
  }, [currentAdmin, isAdminChefe]);

  useEffect(() => {
    if (currentAdmin) fetchSuppliers();
  }, [fetchSuppliers, currentAdmin]);

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          name: supplier.name,
          contact: supplier.contact,
          products: supplier.products,
          owner_id: currentAdmin?.id,
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
      let query = supabase
        .from('suppliers')
        .update({ name: supplier.name, contact: supplier.contact, products: supplier.products })
        .eq('id', supplier.id);
      if (!isAdminChefe && currentAdmin) query = query.eq('owner_id', currentAdmin.id);
      const { error } = await query;

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
      let query = supabase.from('suppliers').delete().eq('id', id);
      if (!isAdminChefe && currentAdmin) query = query.eq('owner_id', currentAdmin.id);
      const { error } = await query;

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
