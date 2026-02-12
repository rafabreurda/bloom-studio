import { useState } from 'react';
import { 
  Calendar, Users, DollarSign, ShoppingBag, Truck, Handshake, 
  ClipboardList, Settings, Lock, UserCheck, X 
} from 'lucide-react';
import { TabId, UserRole } from '@/types';
import { AdminSwitchModal } from './AdminSwitchModal';
import { useAuth } from '@/contexts/AuthContext';
import { getDisplayRole } from '@/types/admin';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  systemName: string;
  systemLogo?: string;
}

const menuItems = [
  { id: 'agenda' as TabId, icon: Calendar, label: 'Agenda' },
  { id: 'clientes' as TabId, icon: Users, label: 'Clientes' },
  { id: 'financeiro' as TabId, icon: DollarSign, label: 'Financeiro' },
  { id: 'estoque' as TabId, icon: ShoppingBag, label: 'Estoque' },
  { id: 'fornecedores' as TabId, icon: Truck, label: 'Fornecedores' },
  { id: 'parcerias' as TabId, icon: Handshake, label: 'Parcerias' },
  { id: 'lista-espera' as TabId, icon: ClipboardList, label: 'Lista de Espera' },
  { id: 'config' as TabId, icon: Settings, label: 'Configurações' },
];



export function Sidebar({ isOpen, onClose, activeTab, onTabChange, systemName, systemLogo }: SidebarProps) {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { currentAdmin, hasPermission } = useAuth();
  
  const isChefe = currentAdmin?.role === 'admin_chefe';
  
  const currentRole = currentAdmin 
    ? (currentAdmin.role === 'admin_chefe' ? 'Admin Mestre' : 'Admin Pleno') as UserRole
    : 'Admin Mestre' as UserRole;

  const isRestricted = (tabId: TabId) => {
    if (!currentAdmin) return false;
    return !hasPermission(tabId);
  };

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
            {systemLogo ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img src={systemLogo} alt="Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: 'hsl(var(--sidebar-primary))' }}
              >
                <Calendar 
                  size={24} 
                  style={{ color: 'hsl(var(--sidebar-primary-foreground))' }}
                />
              </div>
            )}
            <div>
              <h1 
                className="font-black text-lg uppercase truncate max-w-[120px]"
                style={{ color: 'hsl(var(--sidebar-primary))' }}
              >
                {systemName}
              </h1>
              <p 
                className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: 'hsl(var(--sidebar-accent-foreground))', opacity: 0.5 }}
              >
                Master
              </p>
            </div>
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
              <item.icon size={22} />
              <span className="font-black text-xs uppercase">{item.label}</span>
              {isRestricted(item.id) && (
                <Lock 
                  size={12} 
                  className="absolute right-4"
                  style={{ color: 'hsl(var(--sidebar-accent-foreground))', opacity: 0.4 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Footer - Clickable Admin Switcher */}
        <button 
          onClick={() => setShowAdminModal(true)}
          className="mt-auto p-4 rounded-3xl shrink-0 w-full text-left transition-all group"
          style={{ 
            backgroundColor: 'hsl(var(--sidebar-accent))',
            border: '1px solid hsl(var(--sidebar-border))'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110"
              style={{ 
                backgroundColor: 'hsl(var(--sidebar-primary))',
                color: 'hsl(var(--sidebar-primary-foreground))',
                border: '1px solid hsl(var(--sidebar-border))'
              }}
            >
              <UserCheck size={14} />
            </div>
            <div className="overflow-hidden flex-1">
              <p 
                className="text-xs font-bold truncate"
                style={{ color: 'hsl(var(--sidebar-foreground))' }}
              >
                {currentAdmin ? `Olá, ${currentAdmin.name}` : 'Olá'}
              </p>
            </div>
          </div>
        </button>

        {/* Admin Switch Modal */}
        <AdminSwitchModal 
          isOpen={showAdminModal} 
          onClose={() => setShowAdminModal(false)} 
        />
      </div>
    </>
  );
}
