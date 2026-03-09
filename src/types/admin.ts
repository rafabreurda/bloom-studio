// Admin types for the authentication system

export type AdminRoleType = 'admin_chefe' | 'admin_pleno';

export interface AdminProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  password_hash: string | null;
  password_display: string | null;
  username: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserRole {
  id: string;
  user_id: string;
  role: AdminRoleType;
  created_at: string;
}

export interface AdminPermissions {
  id: string;
  user_id: string;
  agenda: boolean;
  clientes: boolean;
  estoque: boolean;
  lista_espera: boolean;
  financeiro: boolean;
  fornecedores: boolean;
  parcerias: boolean;
  config: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminWithRole extends AdminProfile {
  role: AdminRoleType;
  permissions?: AdminPermissions;
}

// Display labels for roles
export const roleLabels: Record<AdminRoleType, string> = {
  admin_chefe: 'Admin Mestre',
  admin_pleno: 'Admin Pleno',
};

// Convert database role to display role
export function getDisplayRole(role: AdminRoleType): string {
  return roleLabels[role];
}
