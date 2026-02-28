import { TabId } from '@/types';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
  activeTab: TabId;
}

export function TopBar({ onMenuClick, activeTab }: TopBarProps) {
  const { currentAdmin, logout } = useAuth();

  const getTabLabel = (tab: TabId) => {
    const labels: Record<TabId, string> = {
      'agenda': 'Agenda',
      'clientes': 'Clientes',
      'financeiro': 'Financeiro',
      'pacotes': 'Pacotes',
      'estoque': 'Estoque',
      'fornecedores': 'Fornecedores',
      'parcerias': 'Parcerias',
      'lista-espera': 'Lista de Espera',
      'config': 'Configurações',
      'usuarios': 'Usuários',
    };
    return labels[tab];
  };

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50 shrink-0">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-xs text-muted-foreground truncate">
          {currentAdmin?.name}
        </span>
      </div>
      <h2 className="text-foreground font-black uppercase tracking-widest text-sm">
        {getTabLabel(activeTab)}
      </h2>
      <div className="flex items-center justify-end min-w-0 flex-1">
        <button
          onClick={logout}
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
