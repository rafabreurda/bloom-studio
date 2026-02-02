import { 
  Calendar, Users, DollarSign, ShoppingBag, Truck, Handshake, 
  ClipboardList, Settings, Lock, UserCheck, X 
} from 'lucide-react';
import { TabId, UserRole } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  currentRole: UserRole;
  systemName: string;
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

const juniorPermissions: TabId[] = ['agenda', 'clientes', 'estoque', 'lista-espera'];

export function Sidebar({ isOpen, onClose, activeTab, onTabChange, currentRole, systemName }: SidebarProps) {
  const isRestricted = (tabId: TabId) => 
    currentRole === 'Admin Junior' && !juniorPermissions.includes(tabId);

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
        className={`fixed left-0 top-0 h-screen bg-background text-foreground p-5 flex flex-col gap-2 z-[70] border-r border-border shadow-2xl transition-transform duration-300 w-72 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="font-black text-lg text-primary uppercase truncate max-w-[120px]">
                {systemName}
              </h1>
              <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                Master
              </p>
            </div>
          </div>
          <button 
            className="md:hidden text-muted-foreground" 
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
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 relative group ${
                activeTab === item.id 
                  ? 'bg-primary text-primary-foreground shadow-xl translate-x-1' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon size={22} />
              <span className="font-black text-xs uppercase">{item.label}</span>
              {isRestricted(item.id) && (
                <Lock size={12} className="absolute right-4 text-muted-foreground" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 bg-secondary border border-border rounded-3xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted text-foreground rounded-full flex items-center justify-center font-black text-xs border border-border">
              <UserCheck size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">
                Período Ativo
              </p>
              <p className="text-xs font-bold truncate text-foreground">
                {currentRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
