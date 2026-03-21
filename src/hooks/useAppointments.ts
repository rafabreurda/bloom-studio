import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchAllFromTable } from '@/lib/supabaseFetchAll';
import { Appointment, AppointmentProduct, AppointmentService } from '@/types';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentAdmin, isAdminChefe } = useAuth();

  const fetchAppointments = useCallback(async () => {
    try {
      const filters: Record<string, string> = {};
      if (currentAdmin && !isAdminChefe) {
        filters.owner_id = currentAdmin.id;
      }

      const allData = await fetchAllFromTable('appointments', '*', { orderBy: 'date', ascending: false, filters: Object.keys(filters).length > 0 ? filters : undefined });

      // Guard: if currentAdmin changed while fetching, discard stale results
      if (!allData) return;

      setAppointments(allData?.map(a => {
        const [year, month, day] = a.date.split('-');
        const dateStr = `${day}/${month}/${year}`;
        
        return {
          id: a.id,
          clientName: a.client_name,
          phone: a.phone,
          date: dateStr,
          time: a.time,
          status: a.status as 'Aguardando Sinal' | 'Agendado' | 'Concluído',
          value: Number(a.value),
          totalValue: Number(a.total_value),
          productsValue: Number(a.products_value),
          chargedValue: Number(a.charged_value),
          cost: Number(a.cost) || 0,
          paymentMethod: a.payment_method as 'Pix' | 'Cartão' | 'Dinheiro',
          tags: a.tags || [],
          isConfirmed: a.is_confirmed,
          isPartnership: a.is_partnership,
          partnershipId: a.partnership_id || undefined,
          partnershipName: a.partnership_name || undefined,
          partnershipDiscount: a.partnership_discount || undefined,
          serviceTypeId: a.service_type_id || undefined,
          serviceTypeName: a.service_type_name || undefined,
          services: (a.services as unknown as AppointmentService[]) || [],
          products: (a.products as unknown as AppointmentProduct[]) || [],
          createdAt: new Date(a.created_at),
          financeCreated: (a as any).finance_created || false,
        };
      }) || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentAdmin, isAdminChefe]);

  useEffect(() => {
    if (currentAdmin) fetchAppointments();
  }, [fetchAppointments, currentAdmin]);

  // Auto-sync: ensure client exists in clients table
  const ensureClientExists = async (name: string, phone: string, isVIP: boolean, tags: string[]) => {
    if (!name || !currentAdmin) return;
    try {
      // Check if client already exists by name+phone for this owner
      let query = supabase.from('clients').select('id').eq('name', name);
      if (!isAdminChefe) {
        query = query.eq('owner_id', currentAdmin.id);
      }
      const { data: existing } = await query.limit(1);
      
      if (!existing || existing.length === 0) {
        await supabase.from('clients').insert({
          name,
          phone: phone || '',
          is_vip: isVIP,
          tags: tags.filter(t => t !== 'Cliente Nova'),
          owner_id: currentAdmin.id,
        });
      }
    } catch (err) {
      console.warn('Auto-sync cliente falhou:', err);
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      const dateParts = appointment.date.split('/');
      const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          client_name: appointment.clientName,
          phone: appointment.phone,
          date: isoDate,
          time: appointment.time,
          status: appointment.status,
          value: appointment.value,
          total_value: appointment.totalValue,
          products_value: appointment.productsValue,
          charged_value: appointment.chargedValue,
          payment_method: appointment.paymentMethod,
          tags: appointment.tags,
          is_confirmed: appointment.isConfirmed,
          is_partnership: appointment.isPartnership,
          partnership_id: appointment.partnershipId,
          partnership_name: appointment.partnershipName,
          partnership_discount: appointment.partnershipDiscount,
          products: (appointment.products || []) as unknown as Json,
          cost: appointment.cost || 0,
          owner_id: currentAdmin?.id,
          service_type_id: appointment.serviceTypeId || null,
          service_type_name: appointment.serviceTypeName || null,
          services: (appointment.services || []) as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-sync client to clients table
      await ensureClientExists(
        appointment.clientName,
        appointment.phone,
        appointment.tags?.includes('VIP') || false,
        appointment.tags || []
      );

      const [year, month, day] = data.date.split('-');
      const dateStr = `${day}/${month}/${year}`;

      const newAppointment: Appointment = {
        id: data.id,
        clientName: data.client_name,
        phone: data.phone,
        date: dateStr,
        time: data.time,
        status: data.status as 'Aguardando Sinal' | 'Agendado' | 'Concluído',
        value: Number(data.value),
        totalValue: Number(data.total_value),
        productsValue: Number(data.products_value),
        chargedValue: Number(data.charged_value),
        cost: appointment.cost || 0,
        paymentMethod: data.payment_method as 'Pix' | 'Cartão' | 'Dinheiro',
        tags: data.tags || [],
        isConfirmed: data.is_confirmed,
        isPartnership: data.is_partnership,
        partnershipId: data.partnership_id || undefined,
        partnershipName: data.partnership_name || undefined,
        partnershipDiscount: data.partnership_discount || undefined,
        serviceTypeId: data.service_type_id || undefined,
        serviceTypeName: data.service_type_name || undefined,
        services: (data.services as unknown as AppointmentService[]) || [],
        products: (data.products as unknown as AppointmentProduct[]) || [],
        createdAt: new Date(data.created_at),
      };

      setAppointments(prev => [newAppointment, ...prev]);
      toast.success('Bronze agendado com sucesso!');
      return newAppointment;
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      toast.error('Erro ao agendar');
      throw error;
    }
  };

  const updateAppointment = async (appointment: Appointment) => {
    try {
      const dateParts = appointment.date.split('/');
      const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      let query = supabase
        .from('appointments')
        .update({
          client_name: appointment.clientName,
          phone: appointment.phone,
          date: isoDate,
          time: appointment.time,
          status: appointment.status,
          value: appointment.value,
          total_value: appointment.totalValue,
          products_value: appointment.productsValue,
          charged_value: appointment.chargedValue,
          payment_method: appointment.paymentMethod,
          tags: appointment.tags,
          is_confirmed: appointment.isConfirmed,
          is_partnership: appointment.isPartnership,
          partnership_id: appointment.partnershipId,
          partnership_name: appointment.partnershipName,
          partnership_discount: appointment.partnershipDiscount,
          products: (appointment.products || []) as unknown as Json,
          cost: appointment.cost || 0,
          service_type_id: appointment.serviceTypeId || null,
          service_type_name: appointment.serviceTypeName || null,
          services: (appointment.services || []) as unknown as Json,
        })
        .eq('id', appointment.id);

      if (!isAdminChefe && currentAdmin) {
        query = query.eq('owner_id', currentAdmin.id);
      }

      const { error } = await query;

      if (error) throw error;

      setAppointments(prev => prev.map(a => a.id === appointment.id ? appointment : a));
      toast.success('Agendamento atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      toast.error('Erro ao atualizar agendamento');
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      let query = supabase.from('appointments').delete().eq('id', id);
      if (!isAdminChefe && currentAdmin) query = query.eq('owner_id', currentAdmin.id);
      const { error } = await query;

      if (error) throw error;

      setAppointments(prev => prev.filter(a => a.id !== id));
      toast.success('Agendamento removido!');
    } catch (error) {
      console.error('Erro ao remover agendamento:', error);
      toast.error('Erro ao remover agendamento');
      throw error;
    }
  };

  const clearAllAppointments = async () => {
    try {
      let query = supabase.from('appointments').delete();
      if (currentAdmin && !isAdminChefe) {
        query = query.eq('owner_id', currentAdmin.id);
      } else {
        query = query.neq('id', '00000000-0000-0000-0000-000000000000');
      }
      const { error } = await query;
      if (error) throw error;

      setAppointments([]);
      toast.success('Agenda limpa com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar agenda:', error);
      toast.error('Erro ao limpar agenda');
      throw error;
    }
  };

  const clearAppointmentsByDate = async (dateStr: string) => {
    try {
      let query = supabase.from('appointments').delete().eq('date', dateStr);
      if (currentAdmin && !isAdminChefe) {
        query = query.eq('owner_id', currentAdmin.id);
      }
      const { error } = await query;
      if (error) throw error;

      const [year, month, day] = dateStr.split('-');
      const localDate = `${day}/${month}/${year}`;
      setAppointments(prev => prev.filter(a => a.date !== localDate));
      toast.success(`Agendamentos do dia ${localDate} removidos!`);
    } catch (error) {
      console.error('Erro ao limpar agenda por data:', error);
      toast.error('Erro ao limpar agenda');
      throw error;
    }
  };

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    clearAllAppointments,
    clearAppointmentsByDate,
    refetch: fetchAppointments,
  };
}
