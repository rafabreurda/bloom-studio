import { useState, useEffect } from 'react';
import { 
  Calendar, Users, DollarSign, ShoppingBag, Truck, Handshake, 
  ClipboardList, Settings, UserCheck, X, Package, UsersRound 
} from 'lucide-react';
import { TabId } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  systemName: string;
  systemLogo?: string;
}

const baseMenuItems = [
  { id: 'agenda' as TabId, icon: Calendar, label: 'Agenda', color: '#f97316' },
  { id: 'clientes' as TabId, icon: Users, label: 'Clientes', color: '#3b82f6' },
  { id: 'financeiro' as TabId, icon: DollarSign, label: 'Financeiro', color: '#22c55e' },
  { id: 'pacotes' as TabId, icon: Package, label: 'Pacotes', color: '#a855f7' },
  { id: 'estoque' as TabId, icon: ShoppingBag, label: 'Estoque', color: '#eab308' },
  { id: 'fornecedores' as TabId, icon: Truck, label: 'Fornecedores', color: '#ef4444' },
  { id: 'parcerias' as TabId, icon: Handshake, label: 'Parcerias', color: '#ec4899' },
  { id: 'lista-espera' as TabId, icon: ClipboardList, label: 'Lista de Espera', color: '#14b8a6' },
  { id: 'config' as TabId, icon: Settings, label: 'Configurações', color: '#6b7280' },
];



export function Sidebar({ isOpen, onClose, activeTab, onTabChange, systemName, systemLogo }: SidebarProps) {
  const { currentAdmin, isAdminChefe } = useAuth();
  const [adminPhoto, setAdminPhoto] = useState<string | null>(null);

  const menuItems = isAdminChefe 
    ? [...baseMenuItems, { id: 'usuarios' as TabId, icon: UsersRound, label: 'Usuários', color: '#8b5cf6' }]
    : baseMenuItems;



  useEffect(() => {
    supabase.from('system_config').select('value').eq('key', 'admin_photo').then(({ data }) => {
      if (data && data.length > 0) setAdminPhoto(data[0].value as string);
    });
  }, [currentAdmin]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 z-[60] md:hidden backdrop-blur-sm" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-screen p-5 flex flex-col gap-2 z-[70] shadow-2xl transition-transform duration-300 w-72 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ 
          backgroundColor: 'hsl(var(--sidebar-background))',
          color: 'hsl(var(--sidebar-foreground))',
          borderRight: '1px solid hsl(var(--sidebar-border))'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-2 shrink-0">
          <div className="flex items-center gap-3">
            {systemLogo && !systemName ? (
              // Logo only - larger, centered
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                <img src={systemLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            ) : systemLogo ? (
              // Logo + name
              <>
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                  <img src={systemLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <h1 
                  className="font-black text-lg uppercase truncate max-w-[120px]"
                  style={{ color: 'hsl(var(--sidebar-primary))' }}
                >
                  {systemName}
                </h1>
              </>
            ) : (
              // Name only (no logo)
              <>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: 'hsl(var(--sidebar-primary))' }}
                >
                  <Calendar 
                    size={24} 
                    style={{ color: 'hsl(var(--sidebar-primary-foreground))' }}
                  />
                </div>
                <h1 
                  className="font-black text-lg uppercase truncate max-w-[120px]"
                  style={{ color: 'hsl(var(--sidebar-primary))' }}
                >
                  {systemName}
                </h1>
              </>
            )}
          </div>
          <button 
            className="md:hidden" 
            style={{ color: 'hsl(var(--sidebar-accent-foreground))', opacity: 0.5 }}
            onClick={onClose}
          >
            <X size={24}/>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 relative group"
              style={{
                backgroundColor: activeTab === item.id ? 'hsl(var(--sidebar-primary))' : 'transparent',
                color: activeTab === item.id ? 'hsl(var(--sidebar-primary-foreground))' : 'hsl(var(--sidebar-accent-foreground))',
                opacity: activeTab === item.id ? 1 : 0.6,
                transform: activeTab === item.id ? 'translateX(4px)' : 'none',
                boxShadow: activeTab === item.id ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : 'none',
              }}
            >
              <item.icon size={22} style={{ color: activeTab === item.id ? undefined : item.color }} />
              <span className="font-black text-xs uppercase">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer - Admin Info */}
        <div 
          className="mt-auto p-4 rounded-3xl shrink-0 w-full"
          style={{ 
            backgroundColor: 'hsl(var(--sidebar-accent))',
            border: '1px solid hsl(var(--sidebar-border))'
          }}
        >
          <div className="flex items-center gap-3">
            {adminPhoto ? (
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0"
                style={{ border: '1px solid hsl(var(--sidebar-border))' }}
              >
                <img src={adminPhoto} alt="Foto" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0"
                style={{ 
                  backgroundColor: 'hsl(var(--sidebar-primary))',
                  color: 'hsl(var(--sidebar-primary-foreground))',
                  border: '1px solid hsl(var(--sidebar-border))'
                }}
              >
                <UserCheck size={14} />
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <p 
                className="text-xs font-bold truncate"
                style={{ color: 'hsl(var(--sidebar-foreground))' }}
              >
                {currentAdmin ? `Olá, ${currentAdmin.name}` : 'Olá'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
