import {
  Calendar, Users, DollarSign, ShoppingBag, Truck, Handshake,
  ClipboardList, Settings, Package, Menu, LogOut, UserCheck, Navigation
} from 'lucide-react';
import { TabId } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface MobileBottomBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenSidebar: () => void;
}

const menuItems = [
  { id: 'agenda' as TabId, icon: Calendar, label: 'Agenda', color: '#f97316' },
  { id: 'clientes' as TabId, icon: Users, label: 'Clientes', color: '#3b82f6' },
  { id: 'financeiro' as TabId, icon: DollarSign, label: 'Financeiro', color: '#22c55e' },
  { id: 'pacotes' as TabId, icon: Package, label: 'Pacotes', color: '#a855f7' },
  { id: 'estoque' as TabId, icon: ShoppingBag, label: 'Estoque', color: '#eab308' },
  { id: 'fornecedores' as TabId, icon: Truck, label: 'Fornecedores', color: '#ef4444' },
  { id: 'parcerias' as TabId, icon: Handshake, label: 'Parcerias', color: '#ec4899' },
  { id: 'lista-espera' as TabId, icon: ClipboardList, label: 'Espera', color: '#14b8a6' },
  { id: 'gps' as TabId, icon: Navigation, label: 'GPS', color: '#4285f4' },
  { id: 'config' as TabId, icon: Settings, label: 'Config', color: '#6b7280' },
];

export function MobileBottomBar({ activeTab, onTabChange, onOpenSidebar }: MobileBottomBarProps) {
  const { isAdminChefe, currentAdmin, logout } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    if (confirmLogout) {
      logout();
    } else {
      setConfirmLogout(true);
      toast('Toque novamente para sair', {
        duration: 3000,
        onDismiss: () => setConfirmLogout(false),
        onAutoClose: () => setConfirmLogout(false),
      });
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  // Admin chefe only sees config
  if (isAdminChefe) {
    return null;
  }

  // Show first 3 items + "more" button + user button
  const visibleItems = menuItems.slice(0, 3);
  const moreItems = menuItems.slice(3);
  const isMoreActive = moreItems.some(item => item.id === activeTab);

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-[80] md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-[72px] left-4 right-4 bg-card border border-border rounded-2xl shadow-2xl p-3 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {moreItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setShowMore(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <item.icon size={18} style={{ color: activeTab === item.id ? undefined : item.color }} />
                <span className="font-black text-xs uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] md:hidden bg-card border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around h-[64px] px-2">
          {visibleItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setShowMore(false);
              }}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all min-w-[56px] ${
                activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon size={20} style={{ color: activeTab === item.id ? undefined : item.color }} />
              <span className="text-[9px] font-black uppercase leading-none">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all min-w-[56px] ${
              isMoreActive || showMore ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Menu size={20} />
            <span className="text-[9px] font-black uppercase leading-none">Mais</span>
          </button>
          {/* User + Logout */}
          <button
            onClick={handleLogout}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all min-w-[56px] ${confirmLogout ? 'bg-destructive/10' : 'text-muted-foreground'}`}
          >
            <LogOut size={20} className={confirmLogout ? 'text-destructive animate-pulse' : 'text-destructive'} />
            <span className="text-[9px] font-black uppercase leading-none truncate max-w-[56px]">
              {confirmLogout ? 'Sair?' : (currentAdmin?.name?.split(' ')[0] || 'Sair')}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
