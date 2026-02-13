import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Package {
  id: string;
  clientName: string;
  clientPhone?: string;
  totalSessions: number;
  usedSessions: number;
  totalValue: number;
  sessionValue: number;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPackages(data?.map(p => ({
        id: p.id,
        clientName: p.client_name,
        clientPhone: p.client_phone || undefined,
        totalSessions: p.total_sessions,
        usedSessions: p.used_sessions,
        totalValue: Number(p.total_value),
        sessionValue: Number(p.session_value),
        status: p.status as Package['status'],
        notes: p.notes || undefined,
        createdAt: new Date(p.created_at),
      })) || []);
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const addPackage = async (pkg: Omit<Package, 'id' | 'createdAt' | 'sessionValue'>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert({
          client_name: pkg.clientName,
          client_phone: pkg.clientPhone,
          total_sessions: pkg.totalSessions,
          used_sessions: pkg.usedSessions,
          total_value: pkg.totalValue,
          status: pkg.status,
          notes: pkg.notes,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchPackages();
      toast.success('Pacote criado!');
      return data;
    } catch (error) {
      console.error('Erro ao criar pacote:', error);
      toast.error('Erro ao criar pacote');
      throw error;
    }
  };

  const updatePackage = async (pkg: Package) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({
          client_name: pkg.clientName,
          client_phone: pkg.clientPhone,
          total_sessions: pkg.totalSessions,
          used_sessions: pkg.usedSessions,
          total_value: pkg.totalValue,
          status: pkg.status,
          notes: pkg.notes,
        })
        .eq('id', pkg.id);

      if (error) throw error;

      await fetchPackages();
      toast.success('Pacote atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar pacote:', error);
      toast.error('Erro ao atualizar pacote');
    }
  };

  const useSession = async (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;

    const newUsed = pkg.usedSessions + 1;
    const isComplete = newUsed >= pkg.totalSessions;

    try {
      const { error } = await supabase
        .from('packages')
        .update({
          used_sessions: newUsed,
          status: isComplete ? 'completed' : 'active',
        })
        .eq('id', packageId);

      if (error) throw error;

      await fetchPackages();

      if (isComplete) {
        toast.info(`📦 Pacote de ${pkg.clientName} finalizado! Todas as ${pkg.totalSessions} sessões foram usadas. Deseja renovar?`);
      } else {
        toast.success(`Sessão ${newUsed}/${pkg.totalSessions} usada do pacote de ${pkg.clientName}`);
      }
    } catch (error) {
      console.error('Erro ao usar sessão:', error);
      toast.error('Erro ao usar sessão do pacote');
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPackages(prev => prev.filter(p => p.id !== id));
      toast.success('Pacote removido!');
    } catch (error) {
      console.error('Erro ao remover pacote:', error);
      toast.error('Erro ao remover pacote');
    }
  };

  return {
    packages,
    loading,
    addPackage,
    updatePackage,
    useSession,
    deletePackage,
    refetch: fetchPackages,
  };
}
