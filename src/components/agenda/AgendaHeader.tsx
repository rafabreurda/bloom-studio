import { ChevronLeft, ChevronRight, Lock, Plus } from 'lucide-react';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { ViewMode } from '@/types';

interface AgendaHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onBlockClick: () => void;
  onAddClick: () => void;
}

export function AgendaHeader({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  onBlockClick,
  onAddClick,
}: AgendaHeaderProps) {
  const goToPrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-card p-4 md:p-5 rounded-2xl md:rounded-3xl border border-border shrink-0">
      {/* Date Display */}
      <div className="flex items-center gap-4">
        <div className="text-center bg-primary px-4 py-2 rounded-xl border border-accent min-w-[60px]">
          <p className="text-[9px] font-black text-primary-foreground uppercase">
            {selectedDate.toLocaleDateString('pt-BR', { month: 'short' })}
          </p>
          <p className="text-2xl font-black text-primary-foreground leading-none">
            {selectedDate.getDate()}
          </p>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-black text-foreground capitalize leading-tight">
            {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <button 
              onClick={goToPrevDay}
              className="p-2 bg-secondary rounded-lg text-foreground"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToToday}
              className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase"
            >
              Hoje
            </button>
            <button 
              onClick={goToNextDay}
              className="p-2 bg-secondary rounded-lg text-foreground"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        {/* View Mode Toggle */}
        <div className="flex bg-secondary p-1 rounded-xl border border-border/10">
          {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                viewMode === mode 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <BronzeButton variant="warning" icon={Lock} size="sm" onClick={onBlockClick}>
            Bloquear
          </BronzeButton>
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={onAddClick}>
            Novo
          </BronzeButton>
        </div>
      </div>
    </div>
  );
}
