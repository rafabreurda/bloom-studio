import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminWithRole, AdminRoleType, AdminPermissions } from '@/types/admin';
import { TabId } from '@/types';

interface AuthContextType {
  currentAdmin: AdminWithRole | null;
  admins: AdminWithRole[];
  isLoading: boolean;
  isAuthenticated: boolean;
  switchAdmin: (adminId: string, password?: string) => Promise<boolean>;
  logout: () => void;
  refreshAdmins: () => Promise<AdminWithRole[] | void>;
  hasPermission: (tabId: TabId) => boolean;
  isAdminChefe: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'neuroflix_session_admin_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminWithRole | null>(null);
  const [admins, setAdmins] = useState<AdminWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load admins from Supabase
  const refreshAdmins = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const { data: permissions, error: permissionsError } = await supabase
        .from('admin_permissions')
        .select('*');

      if (permissionsError) throw permissionsError;

      const adminsWithRoles: AdminWithRole[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        const userPermissions = permissions?.find(p => p.user_id === profile.id);

        return {
          ...profile,
          password_display: profile.password_display || null,
          role: (userRole?.role || 'admin_pleno') as AdminRoleType,
          permissions: userPermissions as AdminPermissions | undefined,
        };
      });

      setAdmins(adminsWithRoles);
      return adminsWithRoles;
    } catch (error) {
      console.error('Error loading admins:', error);
      return [];
    }
  };

  const hasPermission = (tabId: TabId): boolean => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === 'admin_chefe') return true;
    if (currentAdmin.permissions) {
      const permMap: Record<string, keyof AdminPermissions> = {
        agenda: 'agenda',
        clientes: 'clientes',
        estoque: 'estoque',
        'lista-espera': 'lista_espera',
        financeiro: 'financeiro',
        fornecedores: 'fornecedores',
        parcerias: 'parcerias',
        config: 'config',
      };
      const key = permMap[tabId];
      if (key) return currentAdmin.permissions[key] as boolean;
    }
    return tabId !== 'config';
  };

  const switchAdmin = async (adminId: string, password?: string): Promise<boolean> => {
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return false;
    if (!password) return false;

    const { data, error } = await supabase.rpc('verify_admin_password', {
      _user_id: adminId,
      _password: password,
    });

    if (error || !data) {
      console.error('Password verification failed:', error);
      return false;
    }

    setCurrentAdmin(admin);
    // Persist session
    localStorage.setItem(SESSION_KEY, adminId);
    return true;
  };

  const logout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem(SESSION_KEY);
  };

  // Initialize - load admins and restore session
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const loadedAdmins = await refreshAdmins();
      
      // Restore session from localStorage
      const savedAdminId = localStorage.getItem(SESSION_KEY);
      if (savedAdminId && loadedAdmins.length > 0) {
        const savedAdmin = loadedAdmins.find(a => a.id === savedAdminId);
        if (savedAdmin) {
          setCurrentAdmin(savedAdmin);
        }
      }
      
      setIsLoading(false);
    };

    init();
  }, []);

  const value: AuthContextType = {
    currentAdmin,
    admins,
    isLoading,
    isAuthenticated: !!currentAdmin,
    switchAdmin,
    logout,
    refreshAdmins,
    hasPermission,
    isAdminChefe: currentAdmin?.role === 'admin_chefe',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
