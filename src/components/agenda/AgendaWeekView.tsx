import { Appointment, Block, Client } from '@/types';
import { Plus, Star, CheckCircle2, Lock } from 'lucide-react';

interface AgendaWeekViewProps {
  selectedDate: Date;
  appointments: Appointment[];
  blocks: Block[];
  onAddClick: (time: string, date: Date) => void;
  onDayClick: (date: Date) => void;
  onClientClick?: (clientName: string, phone: string) => void;
}

export function AgendaWeekView({
  selectedDate,
  appointments,
  blocks,
  onAddClick,
  onDayClick,
  onClientClick,
}: AgendaWeekViewProps) {
  // Get week days starting from Sunday
  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays(selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateStr = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = formatDateStr(date);
    return blocks.some(block => {
      if (block.type === 'dateRange' && block.endDate) {
        const checkDate = new Date(dateStr.split('/').reverse().join('-'));
        const start = new Date(block.date.split('/').reverse().join('-'));
        const end = new Date(block.endDate.split('/').reverse().join('-'));
        return checkDate >= start && checkDate <= end && block.time === null;
      }
      return block.date === dateStr && block.type === 'allDay';
    });
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = formatDateStr(date);
    return appointments.filter(a => a.date === dateStr);
  };

  const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  return (
    <div 
      className="flex-1 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col agenda-card"
      style={{ 
        backgroundColor: 'hsl(var(--agenda-background))', 
        borderWidth: '1px', 
        borderColor: 'hsl(var(--agenda-border))' 
      }}
    >
      {/* Week Header */}
      <div 
        className="grid grid-cols-7" 
        style={{ 
          borderBottom: '1px solid hsl(var(--agenda-border))', 
          backgroundColor: 'hsl(var(--agenda-muted))' 
        }}
      >
        {weekDays.map((day, idx) => {
          const isToday = day.toDateString() === today.toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();
          
          return (
            <button
              key={idx}
              onClick={() => onDayClick(day)}
              className={`p-3 text-center transition-all ${
                isSelected ? 'bg-amber-50' : ''
              }`}
              style={!isSelected ? { backgroundColor: 'transparent' } : undefined}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'hsl(var(--agenda-muted))'; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <p 
                className="text-[10px] font-bold uppercase"
                style={{ color: 'hsl(var(--agenda-muted-foreground))' }}
              >
                {dayNames[idx]}
              </p>
              <p className={`text-lg font-black mt-1 ${
                isToday 
                  ? 'bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                  : isSelected 
                    ? 'text-primary' 
                    : ''
              }`}
                style={!isToday && !isSelected ? { color: 'hsl(var(--agenda-foreground))' } : undefined}
              >
                {day.getDate()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Week Grid */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{ backgroundColor: 'hsl(var(--agenda-background))' }}
      >
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((day, idx) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isBlocked = isDateBlocked(day);
            const isToday = day.toDateString() === today.toDateString();
            
            return (
              <div 
                key={idx}
                className="p-2 min-h-[300px]"
                style={{ 
                  borderRight: idx < 6 ? '1px solid hsl(var(--agenda-border))' : 'none',
                  backgroundColor: isBlocked 
                    ? 'hsl(var(--agenda-muted))' 
                    : isToday 
                      ? 'hsl(48 100% 96% / 0.3)' 
                      : 'hsl(var(--agenda-background))'
                }}
              >
                {isBlocked ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center" style={{ color: 'hsl(var(--agenda-muted-foreground))' }}>
                      <Lock size={24} className="mx-auto mb-2" />
                      <p className="text-[10px] font-bold uppercase">Bloqueado</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dayAppointments.length === 0 ? (
                      <button
                        onClick={() => {
                          onDayClick(day);
                          onAddClick('09:00', day);
                        }}
                        className="w-full h-16 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors hover:border-primary hover:text-primary"
                        style={{ 
                          borderColor: 'hsl(var(--agenda-border))', 
                          color: 'hsl(var(--agenda-muted-foreground))' 
                        }}
                      >
                        <Plus size={20} />
                      </button>
                    ) : (
                      dayAppointments.slice(0, 5).map((appo) => {
                        const isVIP = appo.tags?.includes('VIP');
                        return (
                          <button
                            key={appo.id}
                            onClick={() => onClientClick?.(appo.clientName, appo.phone)}
                            className={`w-full p-2 rounded-lg text-left transition-all hover:scale-[1.02] ${
                              isVIP 
                                ? 'bg-amber-50 border border-amber-200' 
                                : appo.status === 'Agendado'
                                  ? 'bg-emerald-50 border border-emerald-200'
                                  : 'bg-amber-50/50 border border-amber-100'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <span 
                                className="text-[10px] font-bold"
                                style={{ color: 'hsl(var(--agenda-muted-foreground))' }}
                              >
                                {appo.time}
                              </span>
                              {isVIP && <Star size={10} className="text-amber-500" fill="#f59e0b" />}
                              {appo.isConfirmed && <CheckCircle2 size={10} className="text-emerald-500" />}
                            </div>
                            <p 
                              className="text-xs font-bold truncate mt-0.5"
                              style={{ color: 'hsl(var(--agenda-foreground))' }}
                            >
                              {appo.clientName}
                            </p>
                          </button>
                        );
                      })
                    )}
                    {dayAppointments.length > 5 && (
                      <p 
                        className="text-[10px] font-bold text-center"
                        style={{ color: 'hsl(var(--agenda-muted-foreground))' }}
                      >
                        +{dayAppointments.length - 5} mais
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
