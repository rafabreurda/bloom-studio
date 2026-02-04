import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentProduct } from '@/types';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      setAppointments(data?.map(a => {
        // Parse date manually to avoid timezone issues
        // Database stores as YYYY-MM-DD
        const [year, month, day] = a.date.split('-');
        const dateStr = `${day}/${month}/${year}`;
        
        return {
          id: a.id,
          clientName: a.client_name,
          phone: a.phone,
          date: dateStr,
          time: a.time,
          status: a.status as 'Aguardando Sinal' | 'Agendado',
          value: Number(a.value),
          totalValue: Number(a.total_value),
          productsValue: Number(a.products_value),
          chargedValue: Number(a.charged_value),
          paymentMethod: a.payment_method as 'Pix' | 'Cartão' | 'Dinheiro',
          tags: a.tags || [],
          isConfirmed: a.is_confirmed,
          isPartnership: a.is_partnership,
          partnershipId: a.partnership_id || undefined,
          partnershipName: a.partnership_name || undefined,
          partnershipDiscount: a.partnership_discount || undefined,
          products: (a.products as unknown as AppointmentProduct[]) || [],
          createdAt: new Date(a.created_at),
        };
      }) || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      // Parse date from DD/MM/YYYY to YYYY-MM-DD
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
        })
        .select()
        .single();

      if (error) throw error;

      // Parse date manually to avoid timezone issues
      const [year, month, day] = data.date.split('-');
      const dateStr = `${day}/${month}/${year}`;

      const newAppointment: Appointment = {
        id: data.id,
        clientName: data.client_name,
        phone: data.phone,
        date: dateStr,
        time: data.time,
        status: data.status as 'Aguardando Sinal' | 'Agendado',
        value: Number(data.value),
        totalValue: Number(data.total_value),
        productsValue: Number(data.products_value),
        chargedValue: Number(data.charged_value),
        paymentMethod: data.payment_method as 'Pix' | 'Cartão' | 'Dinheiro',
        tags: data.tags || [],
        isConfirmed: data.is_confirmed,
        isPartnership: data.is_partnership,
        partnershipId: data.partnership_id || undefined,
        partnershipName: data.partnership_name || undefined,
        partnershipDiscount: data.partnership_discount || undefined,
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

      const { error } = await supabase
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
        })
        .eq('id', appointment.id);

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
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(a => a.id !== id));
      toast.success('Agendamento removido!');
    } catch (error) {
      console.error('Erro ao remover agendamento:', error);
      toast.error('Erro ao remover agendamento');
      throw error;
    }
  };

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments,
  };
}
