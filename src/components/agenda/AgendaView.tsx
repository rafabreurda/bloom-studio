import { useState } from 'react';
import { StockAlert } from './StockAlert';
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
  pixKey,
}: AgendaViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');

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
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      <StockAlert stock={stock} onNavigate={onNavigate} />
      
      <AgendaHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBlockClick={onBlockClick}
        onAddClick={() => onAddClick('')}
      />

      {/* Conditional View Rendering */}
      {viewMode === 'day' && (
        <div className="flex-1 bg-card rounded-2xl md:rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="divide-y divide-border">
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
