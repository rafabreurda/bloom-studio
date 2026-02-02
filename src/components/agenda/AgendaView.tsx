import { useState } from 'react';
import { StockAlert } from './StockAlert';
import { AgendaHeader } from './AgendaHeader';
import { TimeSlot } from './TimeSlot';
import { Appointment, Block, StockItem, TabId, ViewMode } from '@/types';
import { toast } from 'sonner';

interface AgendaViewProps {
  appointments: Appointment[];
  blocks: Block[];
  stock: StockItem[];
  onNavigate: (tab: TabId) => void;
  onAddClick: (time: string) => void;
  onBlockClick: () => void;
  onDeleteBlock: (blockId: string) => void;
  pixKey: string;
}

export function AgendaView({
  appointments,
  blocks,
  stock,
  onNavigate,
  onAddClick,
  onBlockClick,
  onDeleteBlock,
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

      {/* Time Grid */}
      <div className="flex-1 bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col agenda-white relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-gray-100">
            {timeSlots.map(time => {
              const appointment = appointments.find(a => a.date === dateStr && a.time === time);
              const block = blocks.find(b => b.date === dateStr && b.time === time);
              
              return (
                <TimeSlot
                  key={time}
                  time={time}
                  appointment={appointment}
                  block={block}
                  onAddClick={onAddClick}
                  onDeleteBlock={onDeleteBlock}
                  onCopyPix={handleCopyPix}
                  onSendWhatsApp={handleSendWhatsApp}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
