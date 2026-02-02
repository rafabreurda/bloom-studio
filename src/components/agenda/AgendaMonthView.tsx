import { Appointment, Block } from '@/types';
import { Lock, Star } from 'lucide-react';

interface AgendaMonthViewProps {
  selectedDate: Date;
  appointments: Appointment[];
  blocks: Block[];
  onDayClick: (date: Date) => void;
  onClientClick?: (clientName: string, phone: string) => void;
}

export function AgendaMonthView({
  selectedDate,
  appointments,
  blocks,
  onDayClick,
  onClientClick,
}: AgendaMonthViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all days in the month grid (including prev/next month days)
  const getMonthGrid = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    // 6 weeks * 7 days = 42 cells
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const monthDays = getMonthGrid(selectedDate);
  const currentMonth = selectedDate.getMonth();

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
      {/* Month Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {dayNames.map((name, idx) => (
          <div key={idx} className="p-3 text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase">
              {name}
            </p>
          </div>
        ))}
      </div>

      {/* Month Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <div className="grid grid-cols-7 h-full">
          {monthDays.map((day, idx) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isToday = day.toDateString() === today.toDateString();
            const isSelected = day.toDateString() === selectedDate.toDateString();
            const dayAppointments = getAppointmentsForDay(day);
            const isBlocked = isDateBlocked(day);
            const hasVIP = dayAppointments.some(a => a.tags?.includes('VIP'));
            
            return (
              <button
                key={idx}
                onClick={() => onDayClick(day)}
                className={`min-h-[80px] md:min-h-[100px] p-1 md:p-2 border-b border-r border-gray-200 text-left transition-all hover:bg-gray-50 ${
                  !isCurrentMonth ? 'opacity-40' : ''
                } ${isBlocked ? 'bg-gray-100' : ''} ${isToday ? 'bg-amber-50/30' : 'bg-white'}`}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs md:text-sm font-bold ${
                    isToday 
                      ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center' 
                      : isSelected 
                        ? 'text-primary' 
                        : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </span>
                  {isBlocked && <Lock size={12} className="text-gray-400" />}
                  {hasVIP && !isBlocked && <Star size={12} className="text-amber-500" fill="#f59e0b" />}
                </div>

                {/* Appointments Preview */}
                {!isBlocked && dayAppointments.length > 0 && (
                  <div className="space-y-0.5">
                    {dayAppointments.slice(0, 2).map((appo) => (
                      <div
                        key={appo.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClientClick?.(appo.clientName, appo.phone);
                        }}
                        className={`text-[8px] md:text-[10px] font-bold truncate px-1 py-0.5 rounded cursor-pointer hover:opacity-80 ${
                          appo.tags?.includes('VIP')
                            ? 'bg-amber-100 text-amber-700'
                            : appo.status === 'Agendado'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {appo.time} {appo.clientName}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <p className="text-[8px] font-bold text-gray-500 px-1">
                        +{dayAppointments.length - 2}
                      </p>
                    )}
                  </div>
                )}

                {/* Appointments Count Badge */}
                {!isBlocked && dayAppointments.length > 0 && (
                  <div className="hidden md:block absolute bottom-1 right-1">
                    <span className="text-[9px] font-bold text-gray-500">
                      {dayAppointments.length} agend.
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
