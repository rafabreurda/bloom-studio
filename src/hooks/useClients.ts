import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client, AnamnesisRecord, ClientHistoryItem } from '@/types';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;

      setClients(data?.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || undefined,
        address: c.address || undefined,
        birthday: c.birthday || undefined,
        cpf: c.cpf || undefined,
        notes: c.notes || undefined,
        tags: c.tags || [],
        isVIP: c.is_vip,
        partnershipId: c.partnership_id || undefined,
        anamnesisHistory: (c.anamnesis_history as unknown as AnamnesisRecord[]) || [],
        history: (c.history as unknown as ClientHistoryItem[]) || [],
        createdAt: new Date(c.created_at),
      })) || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = async (client: Omit<Client, 'id' | 'createdAt' | 'history'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: client.name,
          phone: client.phone,
          email: client.email,
          address: client.address,
          birthday: client.birthday,
          cpf: client.cpf,
          notes: client.notes,
          tags: client.tags,
          is_vip: client.isVIP,
          partnership_id: client.partnershipId,
          anamnesis_history: (client.anamnesisHistory || []) as unknown as Json,
          history: [] as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;

      const newClient: Client = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        address: data.address || undefined,
        birthday: data.birthday || undefined,
        cpf: data.cpf || undefined,
        notes: data.notes || undefined,
        tags: data.tags || [],
        isVIP: data.is_vip,
        partnershipId: data.partnership_id || undefined,
        anamnesisHistory: (data.anamnesis_history as unknown as AnamnesisRecord[]) || [],
        history: [],
        createdAt: new Date(data.created_at),
      };

      setClients(prev => [...prev, newClient]);
      toast.success('Cliente cadastrado!');
      return newClient;
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast.error('Erro ao cadastrar cliente');
      throw error;
    }
  };

  const updateClient = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: client.name,
          phone: client.phone,
          email: client.email,
          address: client.address,
          birthday: client.birthday,
          cpf: client.cpf,
          notes: client.notes,
          tags: client.tags,
          is_vip: client.isVIP,
          partnership_id: client.partnershipId,
          anamnesis_history: (client.anamnesisHistory || []) as unknown as Json,
          history: (client.history || []) as unknown as Json,
        })
        .eq('id', client.id);

      if (error) throw error;

      setClients(prev => prev.map(c => c.id === client.id ? client : c));
      toast.success('Cliente atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente');
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(c => c.id !== id));
      toast.success('Cliente removido!');
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast.error('Erro ao remover cliente');
      throw error;
    }
  };

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
}
