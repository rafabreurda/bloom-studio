import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminWithRole, AdminRoleType } from '@/types/admin';
import { toast } from 'sonner';

interface CreateAdminData {
  name: string;
  phone: string;
  role: 'Admin Pleno' | 'Admin Junior';
  permissions?: {
    agenda: boolean;
    clientes: boolean;
    estoque: boolean;
    listaEspera: boolean;
    financeiro: boolean;
    fornecedores: boolean;
    parcerias: boolean;
  };
}

// Map frontend role names to database role names
const roleMap: Record<string, AdminRoleType> = {
  'Admin Pleno': 'admin_pleno',
  'Admin Junior': 'admin_junior',
};

const reverseRoleMap: Record<AdminRoleType, string> = {
  'admin_chefe': 'Admin Chefe',
  'admin_pleno': 'Admin Pleno',
  'admin_junior': 'Admin Junior',
};

export function useAdminsCRUD() {
  const [isLoading, setIsLoading] = useState(false);

  const createAdmin = useCallback(async (data: CreateAdminData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          name: data.name,
          phone: data.phone,
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

      // 3. Create permissions (for Junior admins)
      if (data.role === 'Admin Junior' && data.permissions) {
        const { error: permError } = await supabase
          .from('admin_permissions')
          .insert({
            user_id: profile.id,
            agenda: data.permissions.agenda,
            clientes: data.permissions.clientes,
            estoque: data.permissions.estoque,
            lista_espera: data.permissions.listaEspera,
            financeiro: data.permissions.financeiro,
            fornecedores: data.permissions.fornecedores,
            parcerias: data.permissions.parcerias,
            config: false,
          });

        if (permError) throw permError;
      }

      toast.success('Administrador cadastrado com sucesso!');
      return true;
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Erro ao cadastrar administrador');
      return false;
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
        
        // Delete existing role and create new one
        await supabase.from('user_roles').delete().eq('user_id', id);
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: id,
            role: dbRole,
          });

        if (roleError) throw roleError;
      }

      // 3. Update permissions
      if (data.permissions) {
        // Check if permissions exist
        const { data: existingPerm } = await supabase
          .from('admin_permissions')
          .select('id')
          .eq('user_id', id)
          .single();

        const permData = {
          user_id: id,
          agenda: data.permissions.agenda,
          clientes: data.permissions.clientes,
          estoque: data.permissions.estoque,
          lista_espera: data.permissions.listaEspera,
          financeiro: data.permissions.financeiro,
          fornecedores: data.permissions.fornecedores,
          parcerias: data.permissions.parcerias,
        };

        if (existingPerm) {
          const { error: permError } = await supabase
            .from('admin_permissions')
            .update(permData)
            .eq('user_id', id);

          if (permError) throw permError;
        } else {
          const { error: permError } = await supabase
            .from('admin_permissions')
            .insert({ ...permData, config: false });

          if (permError) throw permError;
        }
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
      // Delete in order: permissions, role, profile (cascade will handle it but let's be explicit)
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
