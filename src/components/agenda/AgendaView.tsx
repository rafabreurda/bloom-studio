import { useState } from 'react';
import { AgendaHeader } from './AgendaHeader';
import { TimeSlot } from './TimeSlot';
import { AgendaWeekView } from './AgendaWeekView';
import { AgendaMonthView } from './AgendaMonthView';
import { Appointment, Block, StockItem, TabId, ViewMode, Client } from '@/types';
import { toast } from 'sonner';

interface AgendaViewProps {
  appointments: Appointment[];
  blocks: Block[];
  stock: StockItem[];
  clients: Client[];
  onNavigate: (tab: TabId) => void;
  onAddClick: (time: string) => void;
  onBlockClick: () => void;
  onDeleteBlock: (blockId: string) => void;
  onClientClick: (clientName: string, phone: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  onClearAll?: () => void;
  onClearByDate?: (date: string) => void;
  pixKey: string;
}

export function AgendaView({
  appointments,
  blocks,
  stock,
  clients,
  onNavigate,
  onAddClick,
  onBlockClick,
  onDeleteBlock,
  onClientClick,
  onAppointmentClick,
  onClearAll,
  onClearByDate,
  pixKey,
}: AgendaViewProps) {
  // Force Brazilian timezone (America/Sao_Paulo)
  const getNowInBrazil = () => {
    const now = new Date();
    const brDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); // YYYY-MM-DD
    const [y, m, d] = brDateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const [selectedDate, setSelectedDate] = useState(getNowInBrazil);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('bronze_agenda_view_mode');
    return (saved as ViewMode) || 'day';
  });

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('bronze_agenda_view_mode', mode);
  };

  // Generate time slots from 8:00 to 22:00
  const timeSlots: string[] = [];
  for (let i = 8; i <= 22; i++) {
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
    if (i < 22) timeSlots.push(`${i.toString().padStart(2, '0')}:30`);
  }

  const dateStr = selectedDate.toLocaleDateString('pt-BR');

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    toast.success('PIX copiado!');
  };

  const handleSendWhatsApp = (phone: string, clientName: string) => {
    const msg = `Olá ${clientName}! Passando para confirmar seu bronzeamento. 🌞`;
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone) {
      window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  // Check if a date is blocked (considering dateRange blocks)
  const isDateBlocked = (checkDateStr: string) => {
    return blocks.some(block => {
      if (block.type === 'dateRange' && block.endDate) {
        const checkDate = new Date(checkDateStr.split('/').reverse().join('-'));
        const start = new Date(block.date.split('/').reverse().join('-'));
        const end = new Date(block.endDate.split('/').reverse().join('-'));
        return checkDate >= start && checkDate <= end;
      }
      return block.date === checkDateStr && block.type === 'allDay';
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden agenda-container">
      <AgendaHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onBlockClick={onBlockClick}
        onAddClick={() => onAddClick('')}
        onClearAll={onClearAll}
        onClearByDate={onClearByDate}
      />

      {/* Conditional View Rendering */}
      {viewMode === 'day' && (
        <div className="flex-1 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col agenda-card border agenda-border">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="divide-y agenda-border">
              {timeSlots.map(time => {
                const appointment = appointments.find(a => a.date === dateStr && a.time === time);
                const block = blocks.find(b => b.date === dateStr && b.time === time);
                const isDayBlocked = isDateBlocked(dateStr);
                
                return (
                  <TimeSlot
                    key={time}
                    time={time}
                    appointment={appointment}
                    block={block || (isDayBlocked ? { id: 'day-block', date: dateStr, time: null, type: 'allDay', reason: 'Dia bloqueado', createdAt: new Date() } : undefined)}
                    onAddClick={onAddClick}
                    onDeleteBlock={onDeleteBlock}
                    onCopyPix={handleCopyPix}
                    onSendWhatsApp={handleSendWhatsApp}
                    onClientClick={onClientClick}
                    onAppointmentClick={onAppointmentClick}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <AgendaWeekView
          selectedDate={selectedDate}
          appointments={appointments}
          blocks={blocks}
          onAddClick={onAddClick}
          onDayClick={handleDayClick}
          onClientClick={onClientClick}
        />
      )}

      {viewMode === 'month' && (
        <AgendaMonthView
          selectedDate={selectedDate}
          appointments={appointments}
          blocks={blocks}
          onDayClick={handleDayClick}
          onClientClick={onClientClick}
        />
      )}
    </div>
  );
}
