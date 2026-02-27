import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminWithRole, AdminRoleType } from '@/types/admin';
import { toast } from 'sonner';

interface CreateAdminData {
  name: string;
  phone: string;
  role: 'Admin Pleno';
}

// Map frontend role names to database role names
const roleMap: Record<string, AdminRoleType> = {
  'Admin Pleno': 'admin_pleno',
};

const reverseRoleMap: Record<AdminRoleType, string> = {
  'admin_chefe': 'Admin Mestre',
  'admin_pleno': 'Admin Pleno',
};

export function useAdminsCRUD() {
  const [isLoading, setIsLoading] = useState(false);

  const createAdmin = useCallback(async (data: CreateAdminData): Promise<string | null> => {
    setIsLoading(true);
    try {
      // 1. Create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          name: data.name.trim(),
          phone: data.phone?.trim() || '',
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // 2. Create role
      const dbRole = roleMap[data.role];
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: profile.id,
          role: dbRole,
        });

      if (roleError) throw roleError;

      toast.success('Administrador cadastrado com sucesso!');
      return profile.id;
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Erro ao cadastrar administrador');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAdmin = useCallback(async (
    id: string, 
    data: Partial<CreateAdminData>
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Update profile
      if (data.name || data.phone) {
        const updateData: Record<string, string> = {};
        if (data.name) updateData.name = data.name;
        if (data.phone) updateData.phone = data.phone;

        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', id);

        if (profileError) throw profileError;
      }

      // 2. Update role if changed
      if (data.role) {
        const dbRole = roleMap[data.role];
        
        await supabase.from('user_roles').delete().eq('user_id', id);
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: id,
            role: dbRole,
          });

        if (roleError) throw roleError;
      }

      toast.success('Administrador atualizado!');
      return true;
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Erro ao atualizar administrador');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAdmin = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await supabase.from('admin_permissions').delete().eq('user_id', id);
      await supabase.from('user_roles').delete().eq('user_id', id);
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Administrador removido!');
      return true;
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('Erro ao remover administrador');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createAdmin,
    updateAdmin,
    deleteAdmin,
    isLoading,
  };
}
