import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Lock, Plus, Trash2 } from 'lucide-react';
import { BronzeButton } from '@/components/ui/BronzeButton';

import { ViewMode } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AgendaHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onBlockClick: () => void;
  onAddClick: () => void;
  onClearAll?: () => void;
  onClearByDate?: (date: string) => void;
  onRefetch?: () => void;
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
  onRefetch,
}: AgendaHeaderProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearMode, setClearMode] = useState<'all' | 'date'>('date');
  const [clearDate, setClearDate] = useState(() => {
    const now = new Date();
    const brDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    return brDateStr;
  });
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

  const goToPrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const goToPrevYear = () => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() - 1);
    onDateChange(newDate);
  };

  const goToNextYear = () => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    const now = new Date();
    const brDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    const [y, m, d] = brDateStr.split('-').map(Number);
    onDateChange(new Date(y, m - 1, d));
  };

  const monthNames = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const weekdayNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const monthName = monthNames[selectedDate.getMonth()];
  const year = selectedDate.getFullYear();
  const dayLabel = viewMode === 'day'
    ? `${weekdayNames[selectedDate.getDay()]}, ${selectedDate.getDate()}`
    : viewMode === 'week'
      ? (() => {
          const start = new Date(selectedDate);
          start.setDate(start.getDate() - start.getDay());
          const end = new Date(start);
          end.setDate(end.getDate() + 6);
          return `${start.getDate()} - ${end.getDate()}`;
        })()
      : '';

  return (
    <div className="flex flex-col gap-3 p-4 md:p-5 rounded-2xl md:rounded-3xl shrink-0 agenda-header agenda-card border agenda-border">
      {/* Top Row: Month navigation centered, Year top-right */}
      <div className="flex items-center justify-between">
        {/* Month nav */}
        <div className="flex items-center gap-2 flex-1">
          <button 
            onClick={goToPrevMonth}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--agenda-muted))', color: 'hsl(var(--agenda-foreground))' }}
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-lg md:text-xl font-black uppercase tracking-wider flex-1 text-center" style={{ color: 'hsl(var(--agenda-foreground))' }}>
            {monthName}
          </h2>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--agenda-muted))', color: 'hsl(var(--agenda-foreground))' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        {/* Year nav */}
        <div className="flex items-center gap-1 ml-4">
          <button 
            onClick={goToPrevYear}
            className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--agenda-muted))', color: 'hsl(var(--agenda-foreground))' }}
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm font-black px-2" style={{ color: 'hsl(var(--agenda-muted-foreground))' }}>
            {year}
          </span>
          <button 
            onClick={goToNextYear}
            className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--agenda-muted))', color: 'hsl(var(--agenda-foreground))' }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Day navigation row (for day/week views) */}
      {viewMode !== 'month' && (
        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={goToPrevDay}
            className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--agenda-muted))', color: 'hsl(var(--agenda-foreground))' }}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <p className="text-sm font-black capitalize" style={{ color: 'hsl(var(--agenda-foreground))' }}>
              {dayLabel}
            </p>
          </div>
          <button 
            onClick={goToNextDay}
            className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--agenda-muted))', color: 'hsl(var(--agenda-foreground))' }}
          >
            <ChevronRight size={16} />
          </button>
          <button 
            onClick={goToToday}
            className="text-[10px] font-black uppercase hover:opacity-70 ml-2 px-2 py-1 rounded-lg"
            style={{ color: 'hsl(var(--agenda-muted-foreground))', backgroundColor: 'hsl(var(--agenda-muted))' }}
          >
            Hoje
          </button>
        </div>
      )}

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        {/* View Mode Toggle */}
        <div 
          className="flex p-1 rounded-xl border flex-1"
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <ImportDataButton
            table="appointments"
            label="Agendamentos"
            columns={[
              { candidates: ['cliente', 'nome', 'client', 'name'], dbColumn: 'client_name', fallback: 'Sem nome' },
              { candidates: ['telefone', 'phone', 'celular', 'whatsapp', 'fone'], dbColumn: 'phone', fallback: '0' },
              { candidates: ['data', 'date', 'dia'], dbColumn: 'date', transform: (v) => {
                if (!v) return new Date().toISOString().split('T')[0];
                let s = String(v).trim();
                // Strip weekday prefix like "Sáb, " or "Seg, "
                const commaIdx = s.indexOf(',');
                if (commaIdx !== -1 && commaIdx < 6) {
                  s = s.substring(commaIdx + 1).trim();
                }
                return transforms.date(s) || new Date().toISOString().split('T')[0];
              }},
              { candidates: ['horário', 'horario', 'hora', 'time', 'início'], dbColumn: 'time', transform: (v) => {
                if (!v) return '10:00';
                const s = String(v).trim();
                // Extract start time from "14:00 às 15:00"
                const match = s.match(/^(\d{1,2}:\d{2})/);
                return match ? match[1] : '10:00';
              }},
              { candidates: ['preço', 'preco', 'valor', 'value', 'price'], dbColumn: 'value', transform: (v) => {
                if (!v) return 0;
                const s = String(v).replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim();
                return parseFloat(s) || 0;
              }},
              { candidates: ['situação', 'situacao', 'status'], dbColumn: 'status', transform: (v) => {
                if (!v || String(v).trim() === '-') return 'Concluído';
                const s = String(v).trim().toLowerCase();
                if (s.includes('não comparec') || s.includes('nao comparec')) return 'Agendado';
                if (s.includes('cancelad')) return 'Agendado';
                return 'Concluído';
              }},
              { candidates: ['pagamento', 'payment', 'forma', 'método'], dbColumn: 'payment_method', fallback: 'Pix' },
              { candidates: ['serviço', 'servico', 'tipo', 'atendimento', 'service'], dbColumn: 'tags', transform: (v) => v ? [String(v).trim()] : [] },
            ]}
            onPreProcess={async (rows) => {
              const { data: clients } = await supabase.from('clients').select('name, phone');
              const clientMap = new Map<string, string>();
              if (clients) {
                for (const c of clients) {
                  clientMap.set(c.name.toLowerCase().trim(), c.phone);
                }
              }
              return rows.map(row => {
                const name = (row.client_name || '').toLowerCase().trim();
                if ((!row.phone || row.phone === '0') && clientMap.has(name)) {
                  row.phone = clientMap.get(name)!;
                }
                if (!row.total_value) row.total_value = row.value || 0;
                if (!row.charged_value) row.charged_value = row.value || 0;
                if (row.tags && !Array.isArray(row.tags)) row.tags = [String(row.tags)];
                if (!row.tags) row.tags = [];
                return row;
              });
            }}
            onImportComplete={() => onRefetch?.()}
          />
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
