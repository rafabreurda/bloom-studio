import { useState } from 'react';
import { AgendaHeader } from './AgendaHeader';
import { TimeSlot } from './TimeSlot';
import { AgendaWeekView } from './AgendaWeekView';
import { AgendaMonthView } from './AgendaMonthView';
import { WhatsAppSendModal } from '@/components/modals/WhatsAppSendModal';
import { Appointment, Block, StockItem, TabId, ViewMode, Client, WhatsAppTemplate } from '@/types';
import { toast } from 'sonner';

interface AgendaViewProps {
  appointments: Appointment[];
  blocks: Block[];
  stock: StockItem[];
  clients: Client[];
  onNavigate: (tab: TabId) => void;
  onAddClick: (time: string, date: Date) => void;
  onBlockClick: () => void;
  onDeleteBlock: (blockId: string) => void;
  onClientClick: (clientName: string, phone: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  onClearAll?: () => void;
  onClearByDate?: (date: string) => void;
  onRefetch?: () => void;
  pixKey: string;
  whatsappTemplates: WhatsAppTemplate[];
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
  onRefetch,
  pixKey,
  whatsappTemplates,
}: AgendaViewProps) {
  // Force Brazilian timezone (America/Sao_Paulo)
  const getNowInBrazil = () => {
    const now = new Date();
    const brDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    const [y, m, d] = brDateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const [selectedDate, setSelectedDate] = useState(getNowInBrazil);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('bronze_agenda_view_mode');
    return (saved as ViewMode) || 'day';
  });
  const [whatsAppTarget, setWhatsAppTarget] = useState<Appointment | null>(null);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('bronze_agenda_view_mode', mode);
  };

  // Generate time slots from 7:00 to 22:00 in 15-minute intervals
  const timeSlots: string[] = [];
  for (let h = 7; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 22 && m > 0) break;
      timeSlots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }

  const dateStr = selectedDate.toLocaleDateString('pt-BR');

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    toast.success('PIX copiado!');
  };

  const handleSendWhatsApp = (phone: string, clientName: string) => {
    // Find the appointment to get full context
    const appt = appointments.find(a => a.phone === phone && a.clientName === clientName);
    if (appt) {
      setWhatsAppTarget(appt);
    } else {
      // Fallback: open modal with just name/phone
      setWhatsAppTarget({
        id: '',
        clientName,
        phone,
        date: dateStr,
        time: '',
        status: 'Agendado',
        value: 0,
        totalValue: 0,
        productsValue: 0,
        chargedValue: 0,
        cost: 0,
        paymentMethod: 'Pix',
        tags: [],
        isConfirmed: false,
        isPartnership: false,
        createdAt: new Date(),
      });
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
        onAddClick={() => onAddClick('', selectedDate)}
        onClearAll={onClearAll}
        onClearByDate={onClearByDate}
        onRefetch={onRefetch}
      />

      {/* Conditional View Rendering */}
      {viewMode === 'day' && (
        <div className="flex-1 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col agenda-card border agenda-border">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="divide-y agenda-border">
              {timeSlots.map(time => {
                const appointment = appointments.find(a => a.date === dateStr && (a.time === time || a.time.startsWith(time.split(':')[0] + ':' + time.split(':')[1])));
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
          onMonthChange={setSelectedDate}
        />
      )}

      {/* WhatsApp Send Modal */}
      {whatsAppTarget && (
        <WhatsAppSendModal
          clientName={whatsAppTarget.clientName}
          phone={whatsAppTarget.phone}
          date={whatsAppTarget.date}
          time={whatsAppTarget.time}
          value={whatsAppTarget.chargedValue || whatsAppTarget.totalValue}
          pixKey={pixKey}
          templates={whatsappTemplates}
          onClose={() => setWhatsAppTarget(null)}
        />
      )}
    </div>
  );
}