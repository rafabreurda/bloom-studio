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
  refreshAdmins: () => Promise<void>;
  hasPermission: (tabId: TabId) => boolean;
  rememberAdmin: (adminId: string) => void;
  getRememberedAdminId: () => string | null;
  clearRememberedAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REMEMBERED_ADMIN_KEY = 'bronze_remembered_admin';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminWithRole | null>(null);
  const [admins, setAdmins] = useState<AdminWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load admins from Supabase
  const refreshAdmins = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Fetch all permissions
      const { data: permissions, error: permissionsError } = await supabase
        .from('admin_permissions')
        .select('*');

      if (permissionsError) throw permissionsError;

      // Combine data
      const adminsWithRoles: AdminWithRole[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        const userPermissions = permissions?.find(p => p.user_id === profile.id);

        return {
          ...profile,
          role: (userRole?.role || 'admin_pleno') as AdminRoleType,
          permissions: userPermissions as AdminPermissions | undefined,
        };
      });

      setAdmins(adminsWithRoles);
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  // Single admin - always has full permission
  const hasPermission = (tabId: TabId): boolean => {
    return !!currentAdmin;
  };

  // Switch to a different admin
  const switchAdmin = async (adminId: string, password?: string): Promise<boolean> => {
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return false;

    // If admin is chefe and has password, verify it
    if (admin.role === 'admin_chefe' && admin.password_hash) {
      if (!password) return false;

      // Call the verify function
      const { data, error } = await supabase.rpc('verify_admin_password', {
        _user_id: adminId,
        _password: password,
      });

      if (error || !data) {
        console.error('Password verification failed:', error);
        return false;
      }
    }

    setCurrentAdmin(admin);
    return true;
  };

  // Logout
  const logout = () => {
    setCurrentAdmin(null);
    clearRememberedAdmin();
  };

  // Remember admin in localStorage
  const rememberAdmin = (adminId: string) => {
    localStorage.setItem(REMEMBERED_ADMIN_KEY, adminId);
  };

  const getRememberedAdminId = (): string | null => {
    return localStorage.getItem(REMEMBERED_ADMIN_KEY);
  };

  const clearRememberedAdmin = () => {
    localStorage.removeItem(REMEMBERED_ADMIN_KEY);
  };

  // Initialize and auto-login first admin
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await refreshAdmins();
      setIsLoading(false);
    };

    init();
  }, []);

  // Auto-login first available admin
  useEffect(() => {
    if (!isLoading && admins.length > 0 && !currentAdmin) {
      setCurrentAdmin(admins[0]);
    }
  }, [isLoading, admins, currentAdmin]);

  const value: AuthContextType = {
    currentAdmin,
    admins,
    isLoading,
    isAuthenticated: !!currentAdmin,
    switchAdmin,
    logout,
    refreshAdmins,
    hasPermission,
    rememberAdmin,
    getRememberedAdminId,
    clearRememberedAdmin,
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
