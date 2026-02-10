import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Plus, Trash2 } from 'lucide-react';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { ViewMode } from '@/types';

interface AgendaHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onBlockClick: () => void;
  onAddClick: () => void;
  onClearAll?: () => void;
  onClearByDate?: (date: string) => void;
}

export function AgendaHeader({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  onBlockClick,
  onAddClick,
  onClearAll,
  onClearByDate,
}: AgendaHeaderProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearMode, setClearMode] = useState<'all' | 'date'>('date');
  const [clearDate, setClearDate] = useState(() => {
    const now = new Date();
    const brDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    return brDateStr;
  });
  const goToPrev = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    onDateChange(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    // Force Brazilian timezone
    const now = new Date();
    const brDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    const [y, m, d] = brDateStr.split('-').map(Number);
    onDateChange(new Date(y, m - 1, d));
  };

  const getHeaderLabel = () => {
    if (viewMode === 'day') {
      return selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' });
    } else if (viewMode === 'week') {
      const start = new Date(selectedDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('pt-BR', { month: 'short' })}`;
    } else {
      return selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 p-4 md:p-5 rounded-2xl md:rounded-3xl shrink-0 agenda-header agenda-card border agenda-border">
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
          <h2 className="text-lg font-black capitalize leading-tight" style={{ color: 'hsl(var(--agenda-foreground))' }}>
            {getHeaderLabel()}
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <button 
              onClick={goToPrev}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'hsl(var(--agenda-muted))', color: 'hsl(var(--agenda-foreground))' }}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToToday}
              className="text-[10px] font-black uppercase hover:opacity-70"
              style={{ color: 'hsl(var(--agenda-muted-foreground))' }}
            >
              Hoje
            </button>
            <button 
              onClick={goToNext}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'hsl(var(--agenda-muted))', color: 'hsl(var(--agenda-foreground))' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        {/* View Mode Toggle */}
        <div 
          className="flex p-1 rounded-xl border"
          style={{ backgroundColor: 'hsl(var(--agenda-muted))', borderColor: 'hsl(var(--agenda-border))' }}
        >
          {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                viewMode === mode 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : ''
              }`}
              style={viewMode !== mode ? { color: 'hsl(var(--agenda-muted-foreground))' } : undefined}
            >
              {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <BronzeButton variant="danger" icon={Lock} size="sm" onClick={onBlockClick}>
            Bloquear
          </BronzeButton>
          <BronzeButton variant="success" icon={Plus} size="sm" onClick={onAddClick}>
            Novo
          </BronzeButton>
          {(onClearAll || onClearByDate) && (
            <BronzeButton variant="danger" icon={Trash2} size="sm" onClick={() => setShowClearConfirm(true)}>
              Limpar
            </BronzeButton>
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-background/90 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="rounded-2xl p-6 max-w-sm w-full border shadow-2xl agenda-card agenda-border">
            <h3 className="text-lg font-black mb-4" style={{ color: 'hsl(var(--agenda-foreground))' }}>
              Limpar Agenda
            </h3>
            
            {/* Mode Toggle */}
            <div className="flex p-1 rounded-xl border mb-4" style={{ backgroundColor: 'hsl(var(--agenda-muted))', borderColor: 'hsl(var(--agenda-border))' }}>
              <button
                onClick={() => setClearMode('date')}
                className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                  clearMode === 'date' ? 'bg-primary text-primary-foreground shadow-lg' : ''
                }`}
                style={clearMode !== 'date' ? { color: 'hsl(var(--agenda-muted-foreground))' } : undefined}
              >
                Por Data
              </button>
              <button
                onClick={() => setClearMode('all')}
                className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                  clearMode === 'all' ? 'bg-destructive text-destructive-foreground shadow-lg' : ''
                }`}
                style={clearMode !== 'all' ? { color: 'hsl(var(--agenda-muted-foreground))' } : undefined}
              >
                Toda Agenda
              </button>
            </div>

            {clearMode === 'date' ? (
              <>
                <p className="text-sm mb-3" style={{ color: 'hsl(var(--agenda-muted-foreground))' }}>
                  Selecione a data para limpar:
                </p>
                <input
                  type="date"
                  value={clearDate}
                  onChange={(e) => setClearDate(e.target.value)}
                  className="input-bronze w-full mb-4"
                />
              </>
            ) : (
              <p className="text-sm mb-4" style={{ color: 'hsl(var(--agenda-muted-foreground))' }}>
                Tem certeza que deseja remover <strong>todos</strong> os agendamentos? Esta ação não pode ser desfeita.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-bold border"
                style={{ borderColor: 'hsl(var(--agenda-border))', color: 'hsl(var(--agenda-foreground))' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (clearMode === 'all' && onClearAll) {
                    onClearAll();
                  } else if (clearMode === 'date' && onClearByDate && clearDate) {
                    onClearByDate(clearDate);
                  }
                  setShowClearConfirm(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-bold bg-destructive text-destructive-foreground"
              >
                {clearMode === 'all' ? 'Limpar Tudo' : 'Limpar Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
