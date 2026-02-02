import { Appointment, Block, Client } from '@/types';
import { Plus, Star, CheckCircle2, Lock } from 'lucide-react';

interface AgendaWeekViewProps {
  selectedDate: Date;
  appointments: Appointment[];
  blocks: Block[];
  onAddClick: (time: string) => void;
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

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="flex-1 bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Week Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map((day, idx) => {
          const isToday = day.toDateString() === today.toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();
          
          return (
            <button
              key={idx}
              onClick={() => onDayClick(day)}
              className={`p-3 text-center transition-all hover:bg-gray-100 ${
                isSelected ? 'bg-amber-50' : ''
              }`}
            >
              <p className="text-[10px] font-bold text-gray-500 uppercase">
                {dayNames[idx]}
              </p>
              <p className={`text-lg font-black mt-1 ${
                isToday 
                  ? 'bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                  : isSelected 
                    ? 'text-primary' 
                    : 'text-gray-900'
              }`}>
                {day.getDate()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Week Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((day, idx) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isBlocked = isDateBlocked(day);
            const isToday = day.toDateString() === today.toDateString();
            
            return (
              <div 
                key={idx}
                className={`border-r border-gray-200 last:border-r-0 p-2 min-h-[300px] ${
                  isBlocked ? 'bg-gray-100' : isToday ? 'bg-amber-50/30' : 'bg-white'
                }`}
              >
                {isBlocked ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
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
                          onAddClick('09:00');
                        }}
                        className="w-full h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
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
                              <span className="text-[10px] font-bold text-gray-500">
                                {appo.time}
                              </span>
                              {isVIP && <Star size={10} className="text-amber-500" fill="#f59e0b" />}
                              {appo.isConfirmed && <CheckCircle2 size={10} className="text-emerald-500" />}
                            </div>
                            <p className="text-xs font-bold text-gray-900 truncate mt-0.5">
                              {appo.clientName}
                            </p>
                          </button>
                        );
                      })
                    )}
                    {dayAppointments.length > 5 && (
                      <p className="text-[10px] font-bold text-gray-500 text-center">
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
