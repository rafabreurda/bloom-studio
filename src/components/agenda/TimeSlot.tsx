import { Plus, X, Star, CheckCircle2, Copy, MessageSquare } from 'lucide-react';
import { Appointment, Block } from '@/types';

interface TimeSlotProps {
  time: string;
  appointment?: Appointment;
  block?: Block;
  onAddClick: (time: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onCopyPix: () => void;
  onSendWhatsApp: (phone: string, clientName: string) => void;
  onClientClick?: (clientName: string, phone: string) => void;
}

export function TimeSlot({
  time,
  appointment,
  block,
  onAddClick,
  onDeleteBlock,
  onCopyPix,
  onSendWhatsApp,
  onClientClick,
}: TimeSlotProps) {
  const isVIP = appointment?.tags?.includes('VIP');

  return (
    <div className={`flex min-h-[85px] transition-colors ${block ? 'bg-muted/50' : 'hover:bg-primary/5'}`}>
      {/* Time Column */}
      <div className="w-16 md:w-20 shrink-0 border-r border-border flex flex-col items-center pt-4 md:pt-5">
        <span className="text-[10px] md:text-xs font-black text-muted-foreground">{time}</span>
      </div>

      {/* Content Column */}
      <div className="flex-1 p-2 relative">
        {block ? (
          // Blocked Slot
          <div className="h-full w-full rounded-xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-between px-4 opacity-60">
            <span className="text-[9px] font-black uppercase text-muted-foreground truncate">
              {block.reason}
            </span>
            <button 
              onClick={() => onDeleteBlock(block.id)} 
              className="text-destructive/50 p-2 hover:text-destructive"
            >
              <X size={18} />
            </button>
          </div>
        ) : appointment ? (
          // Appointment Slot
          <div className={`h-full w-full rounded-xl p-3 md:p-4 flex justify-between items-center bg-card border border-border relative ${
            isVIP 
              ? 'vip-border vip-glow' 
              : `border-l-4 ${appointment.status === 'Agendado' ? 'border-l-emerald-500' : 'border-l-amber-400'}`
          }`}>
            {/* VIP Badge */}
            {isVIP && (
              <div className="absolute -top-3 -right-2 bg-amber-500 text-black px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 shadow-lg border border-card">
                <Star size={10} fill="black" /> VIP
              </div>
            )}
            
            {/* Client Info - Clickable */}
            <button 
              onClick={() => onClientClick?.(appointment.clientName, appointment.phone)}
              className="flex flex-col gap-0.5 overflow-hidden text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-1">
                {isVIP && <Star size={12} className="text-amber-500" fill="#f59e0b" />}
                <span className={`font-black text-foreground text-sm md:text-base truncate hover:underline ${isVIP ? 'text-amber-600' : ''}`}>
                  {appointment.clientName}
                </span>
                {appointment.isConfirmed && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground font-bold truncate">
                Total R$ {appointment.totalValue || appointment.value} • {appointment.paymentMethod || '—'}
              </p>
            </button>

            {/* Actions */}
            <div className="flex gap-1">
              {appointment.status === 'Aguardando Sinal' && (
                <button 
                  onClick={onCopyPix}
                  className="w-10 h-10 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center hover:bg-primary/20 transition-all"
                >
                  <Copy size={18} />
                </button>
              )}
              <button 
                onClick={() => onSendWhatsApp(appointment.phone, appointment.clientName)}
                className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        ) : (
          // Empty Slot
          <button 
            onClick={() => onAddClick(time)} 
            className="w-full h-full rounded-xl border-2 border-transparent hover:border-primary/20 flex items-center justify-center group"
          >
            <Plus size={24} className="text-muted-foreground/20 group-hover:text-primary/40" />
          </button>
        )}
      </div>
    </div>
  );
}
