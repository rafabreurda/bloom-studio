import { useEffect, useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { AgendaHeader } from './AgendaHeader';
import { TimeSlot } from './TimeSlot';
import { AgendaWeekView } from './AgendaWeekView';
import { AgendaMonthView } from './AgendaMonthView';
import { WhatsAppSendModal } from '@/components/modals/WhatsAppSendModal';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { Appointment, Block, StockItem, TabId, ViewMode, Client, WhatsAppTemplate } from '@/types';
import { toast } from 'sonner';

// Static time slots — generated once, not on every render
const TIME_SLOTS: string[] = [];
for (let h = 6; h <= 23; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 23 && m > 0) break;
    TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }
}

interface AgendaViewProps {
  appointments: Appointment[];
  blocks: Block[];
  stock: StockItem[];
  clients: Client[];
  onNavigate: (tab: TabId) => void;
  onAddClick: (time: string, date: Date) => void;
  onBlockClick: (date?: Date) => void;
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

  const normalizeLocalDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateKey = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const savedDate = localStorage.getItem('bronze_agenda_selected_date');
    if (savedDate) {
      const parsed = parseDateKey(savedDate);
      if (parsed) return parsed;
    }
    return getNowInBrazil();
  });

  useEffect(() => {
    localStorage.setItem('bronze_agenda_selected_date', formatDateKey(selectedDate));
  }, [selectedDate]);

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('bronze_agenda_view_mode');
    return (saved as ViewMode) || 'day';
  });
  const [whatsAppTarget, setWhatsAppTarget] = useState<Appointment | null>(null);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('bronze_agenda_view_mode', mode);
  };

  const timeSlots = TIME_SLOTS;

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

  // Parse DD/MM/YYYY sem converter para UTC (evita desvio de fuso)
  const parseBrDate = (dateStr: string) => {
    const [d, m, y] = dateStr.split('/').map(Number);
    return new Date(y, m - 1, d);
  };

  // Retorna o bloco real que cobre o dia (com ID correto para deletar)
  const getDayBlock = (checkDateStr: string): Block | undefined => {
    return blocks.find(block => {
      if (block.type === 'dateRange' && block.endDate) {
        const checkDate = parseBrDate(checkDateStr);
        const start = parseBrDate(block.date);
        const end = parseBrDate(block.endDate);
        return checkDate >= start && checkDate <= end;
      }
      return block.date === checkDateStr && block.type === 'allDay';
    });
  };

  // Check if a date is blocked (considering dateRange blocks)
  const isDateBlocked = (checkDateStr: string) => !!getDayBlock(checkDateStr);

  const handleDayClick = (date: Date) => {
    setSelectedDate(normalizeLocalDate(date));
    setViewMode('day');
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden agenda-container">
      <AgendaHeader
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(normalizeLocalDate(date))}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onBlockClick={() => onBlockClick(selectedDate)}
        onAddClick={() => onAddClick('', selectedDate)}
        onClearAll={onClearAll}
        onClearByDate={onClearByDate}
        onRefetch={onRefetch}
      />

      {/* Conditional View Rendering */}
      {viewMode === 'day' && (() => {
        const dayBlock = getDayBlock(dateStr);
        return (
          <>
            {/* Banner de dia bloqueado com botão Desbloquear */}
            {dayBlock && (
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-destructive/40 bg-destructive/10 shrink-0">
                <span className="text-xs font-black uppercase text-destructive flex items-center gap-2">
                  <Lock size={14} /> Dia bloqueado — {dayBlock.reason}
                </span>
                <ConfirmDeleteDialog
                  description="Deseja desbloquear este dia?"
                  onConfirm={() => onDeleteBlock(dayBlock.id)}
                  trigger={
                    <button className="flex items-center gap-1 text-xs font-black uppercase text-destructive hover:opacity-70 transition-opacity">
                      <Unlock size={14} /> Desbloquear
                    </button>
                  }
                />
              </div>
            )}

            <div className="flex-1 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col agenda-card border agenda-border">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y agenda-border">
                  {timeSlots.map(time => {
                    const appointment = appointments.find(a => a.date === dateStr && (a.time === time || a.time.startsWith(time.split(':')[0] + ':' + time.split(':')[1])));
                    const block = blocks.find(b => b.date === dateStr && b.time === time);

                    let clientAddress: string | undefined;
                    if (appointment) {
                      const client = clients.find(c => c.phone === appointment.phone)
                        || clients.find(c => c.name.toLowerCase() === appointment.clientName.toLowerCase());
                      if (client) {
                        const complement = (client.addressType === 'apto' || client.addressType === 'comercial')
                          ? client.address
                          : undefined;
                        const parts = [
                          client.addressStreet,
                          client.addressNumber,
                          complement,
                          client.addressNeighborhood,
                          client.addressCity,
                          client.addressState,
                        ].filter(Boolean);
                        clientAddress = parts.length > 0 ? parts.join(', ') : (client.address || undefined);
                      }
                    }

                    return (
                      <TimeSlot
                        key={time}
                        time={time}
                        appointment={appointment}
                        block={block || (dayBlock ? { ...dayBlock } : undefined)}
                        onAddClick={(time: string) => onAddClick(time, normalizeLocalDate(selectedDate))}
                        onDeleteBlock={onDeleteBlock}
                        onCopyPix={handleCopyPix}
                        onSendWhatsApp={handleSendWhatsApp}
                        onClientClick={onClientClick}
                        onAppointmentClick={onAppointmentClick}
                        clientAddress={clientAddress}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {viewMode === 'week' && (
        <AgendaWeekView
          selectedDate={selectedDate}
          appointments={appointments}
          blocks={blocks}
          onAddClick={(time: string, date: Date) => onAddClick(time, normalizeLocalDate(date))}
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
          onMonthChange={(date) => setSelectedDate(normalizeLocalDate(date))}
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