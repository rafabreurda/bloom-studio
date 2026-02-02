import { Plus, MessageSquare, CheckCircle2 } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { WaitingItem } from '@/types';

interface WaitingListViewProps {
  waitingList: WaitingItem[];
  onAddClick: () => void;
  onSendMessage: (phone: string, name: string) => void;
  onComplete: (id: string) => void;
}

export function WaitingListView({ 
  waitingList, 
  onAddClick, 
  onSendMessage,
  onComplete 
}: WaitingListViewProps) {
  const sortedList = [...waitingList].sort(
    (a, b) => new Date(a.desiredDate).getTime() - new Date(b.desiredDate).getTime()
  );

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight">Lista de Espera</h2>
        <BronzeButton variant="gold" icon={Plus} size="sm" onClick={onAddClick}>
          Adicionar
        </BronzeButton>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 pr-2">
        <div className="grid grid-cols-1 gap-3">
          {sortedList.map(item => (
            <BronzeCard 
              key={item.id} 
              className="bg-secondary border-border p-4 border-l-4 border-l-amber-700"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-black text-foreground text-sm">{item.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
                    Deseja: {item.desiredDate ? new Date(item.desiredDate).toLocaleDateString('pt-BR') : '—'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onSendMessage(item.phone, item.name)}
                    className="w-12 h-12 bg-success/20 text-success rounded-xl flex items-center justify-center"
                  >
                    <MessageSquare size={20} />
                  </button>
                  <button 
                    onClick={() => onComplete(item.id)}
                    className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              </div>
            </BronzeCard>
          ))}
          
          {waitingList.length === 0 && (
            <p className="text-center opacity-30 py-20 font-black uppercase text-xs italic tracking-widest">
              Lista Vazia
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
