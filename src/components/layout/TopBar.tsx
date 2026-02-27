import { Menu } from 'lucide-react';
import { TabId } from '@/types';

interface TopBarProps {
  onMenuClick: () => void;
  activeTab: TabId;
}

export function TopBar({ onMenuClick, activeTab }: TopBarProps) {
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
      <button 
        onClick={onMenuClick} 
        className="p-2 text-foreground"
      >
        <Menu size={28} />
      </button>
      
      <h2 className="text-foreground font-black uppercase tracking-widest text-sm">
        {getTabLabel(activeTab)}
      </h2>
      
      <div className="w-10" />
    </div>
  );
}
