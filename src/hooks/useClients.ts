import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchAllFromTable } from '@/lib/supabaseFetchAll';
import { Client, AnamnesisRecord, ClientHistoryItem } from '@/types';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentAdmin, isAdminChefe } = useAuth();

  const fetchClients = useCallback(async () => {
    try {
      const filters: Record<string, string> = {};
      if (currentAdmin && !isAdminChefe) {
        filters.owner_id = currentAdmin.id;
      }

      const data = await fetchAllFromTable('clients', '*', { orderBy: 'name', ascending: true, filters: Object.keys(filters).length > 0 ? filters : undefined });

      setClients(data?.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || undefined,
        address: c.address || undefined,
        addressStreet: c.address_street || undefined,
        addressNumber: c.address_number || undefined,
        addressType: c.address_type || undefined,
        addressNeighborhood: c.address_neighborhood || undefined,
        addressCity: c.address_city || undefined,
        addressState: c.address_state || undefined,
        addressZip: c.address_zip || undefined,
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
  }, [currentAdmin, isAdminChefe]);

  useEffect(() => {
    if (currentAdmin) fetchClients();
  }, [fetchClients, currentAdmin]);

  const addClient = async (client: Omit<Client, 'id' | 'createdAt' | 'history'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: client.name,
          phone: client.phone,
          email: client.email,
          address: client.address,
          address_street: client.addressStreet,
          address_number: client.addressNumber,
          address_type: client.addressType,
          address_neighborhood: client.addressNeighborhood,
          address_city: client.addressCity,
          address_state: client.addressState,
          address_zip: client.addressZip,
          birthday: client.birthday,
          cpf: client.cpf,
          notes: client.notes,
          tags: client.tags,
          is_vip: client.isVIP,
          partnership_id: client.partnershipId,
          anamnesis_history: (client.anamnesisHistory || []) as unknown as Json,
          history: [] as unknown as Json,
          owner_id: currentAdmin?.id,
        } as any)
        .select()
        .single();

      if (error) throw error;

      const newClient: Client = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        address: data.address || undefined,
        addressStreet: data.address_street || undefined,
        addressNeighborhood: data.address_neighborhood || undefined,
        addressCity: data.address_city || undefined,
        addressZip: data.address_zip || undefined,
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
          address_street: client.addressStreet,
          address_neighborhood: client.addressNeighborhood,
          address_city: client.addressCity,
          address_zip: client.addressZip,
          birthday: client.birthday,
          cpf: client.cpf,
          notes: client.notes,
          tags: client.tags,
          is_vip: client.isVIP,
          partnership_id: client.partnershipId,
          anamnesis_history: (client.anamnesisHistory || []) as unknown as Json,
          history: (client.history || []) as unknown as Json,
        } as any)
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

  const deleteAllClients = async () => {
    try {
      let query = supabase.from('clients').delete();
      if (currentAdmin && !isAdminChefe) {
        query = query.eq('owner_id', currentAdmin.id);
      } else {
        query = query.neq('id', '00000000-0000-0000-0000-000000000000');
      }
      const { error } = await query;
      if (error) throw error;
      setClients([]);
      toast.success('Todos os clientes foram removidos!');
    } catch (error) {
      console.error('Erro ao remover todos os clientes:', error);
      toast.error('Erro ao remover clientes');
      throw error;
    }
  };

  // Sync all clients from appointments that don't exist in clients table
  const syncFromAppointments = async () => {
    if (!currentAdmin) return;
    try {
      // Fetch all appointments for this owner
      const apptFilters: Record<string, string> = {};
      if (!isAdminChefe) apptFilters.owner_id = currentAdmin.id;
      
      const allAppts = await fetchAllFromTable('appointments', 'client_name,phone,tags', { 
        filters: Object.keys(apptFilters).length > 0 ? apptFilters : undefined 
      });
      
      if (!allAppts || allAppts.length === 0) return 0;

      // Get unique clients from appointments
      const uniqueMap = new Map<string, { name: string; phone: string; isVIP: boolean }>();
      for (const a of allAppts) {
        const key = a.client_name?.toLowerCase();
        if (key && !uniqueMap.has(key)) {
          uniqueMap.set(key, {
            name: a.client_name,
            phone: a.phone || '',
            isVIP: (a.tags as string[])?.includes('VIP') || false,
          });
        }
      }

      // Get existing client names
      const existingNames = new Set(clients.map(c => c.name.toLowerCase()));

      // Filter only new clients
      const newClients = Array.from(uniqueMap.values()).filter(c => !existingNames.has(c.name.toLowerCase()));

      if (newClients.length === 0) {
        toast.info('Todos os clientes da agenda já estão cadastrados!');
        return 0;
      }

      // Batch insert
      const CHUNK = 200;
      for (let i = 0; i < newClients.length; i += CHUNK) {
        const chunk = newClients.slice(i, i + CHUNK).map(c => ({
          name: c.name,
          phone: c.phone,
          is_vip: c.isVIP,
          owner_id: currentAdmin.id,
        }));
        await supabase.from('clients').insert(chunk);
      }

      toast.success(`${newClients.length} clientes importados da agenda!`);
      await fetchClients();
      return newClients.length;
    } catch (error) {
      console.error('Erro ao sincronizar clientes:', error);
      toast.error('Erro ao sincronizar clientes da agenda');
      return 0;
    }
  };

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    deleteAllClients,
    syncFromAppointments,
    refetch: fetchClients,
  };
}
