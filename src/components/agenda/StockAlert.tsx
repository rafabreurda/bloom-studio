import { AlertCircle } from 'lucide-react';
import { StockItem, TabId } from '@/types';

interface StockAlertProps {
  stock: StockItem[];
  onNavigate: (tab: TabId) => void;
}

export function StockAlert({ stock, onNavigate }: StockAlertProps) {
  const lowStockItems = stock.filter(item => item.quantity < item.minStock);
  
  if (lowStockItems.length === 0) return null;

  return (
    <div className="bg-destructive text-destructive-foreground px-4 md:px-6 py-3 rounded-2xl flex items-center justify-between shadow-xl animate-pulse shrink-0">
      <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-tight overflow-hidden">
        <AlertCircle size={16} />
        <span className="truncate">Estoque Baixo: {lowStockItems[0].name}</span>
      </div>
      <button 
        onClick={() => onNavigate('estoque')} 
        className="text-[10px] font-black underline uppercase"
      >
        Ver
      </button>
    </div>
  );
}
