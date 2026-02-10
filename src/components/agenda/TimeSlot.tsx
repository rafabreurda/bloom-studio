import { Plus, X, Star, CheckCircle2, Copy, MessageSquare, Handshake, Pencil, UserPlus } from 'lucide-react';
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
  onAppointmentClick?: (appointment: Appointment) => void;
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
  onAppointmentClick,
}: TimeSlotProps) {
  const isVIP = appointment?.tags?.includes('VIP');
  const isNewClient = appointment?.tags?.includes('Cliente Nova');
  const isPartnership = appointment?.isPartnership;

  return (
    <div 
      className={`flex min-h-[85px] transition-colors agenda-slot`}
      style={block ? { backgroundColor: 'hsl(var(--agenda-muted))' } : undefined}
    >
      {/* Time Column */}
      <div className="w-16 md:w-20 shrink-0 border-r agenda-border flex flex-col items-center pt-4 md:pt-5">
        <span className="text-[10px] md:text-xs font-black agenda-text-muted">{time}</span>
      </div>

      {/* Content Column */}
      <div className="flex-1 p-2 relative">
        {block ? (
          // Blocked Slot
          <div 
            className="h-full w-full rounded-xl border-2 border-dashed flex items-center justify-between px-4 opacity-60"
            style={{ 
              borderColor: 'hsl(var(--agenda-border))', 
              backgroundColor: 'hsl(var(--agenda-muted))' 
            }}
          >
            <span 
              className="text-[9px] font-black uppercase truncate"
              style={{ color: 'hsl(var(--agenda-muted-foreground))' }}
            >
              {block.reason}
            </span>
            <button 
              onClick={() => onDeleteBlock(block.id)} 
              className="text-destructive p-2 hover:opacity-80"
            >
              <X size={18} />
            </button>
          </div>
        ) : appointment ? (
          // Appointment Slot
          <div 
            className={`h-full w-full rounded-xl p-3 md:p-4 flex justify-between items-center shadow-sm ${
              isVIP 
                ? 'vip-border vip-glow' 
                : isPartnership
                  ? 'border-l-4 border-l-violet-500'
                  : `border-l-4 ${appointment.status === 'Agendado' ? 'border-l-emerald-500' : 'border-l-amber-400'}`
            }`}
            style={{ 
              backgroundColor: 'hsl(var(--agenda-background))', 
              borderColor: 'hsl(var(--agenda-border))',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            {/* VIP Badge */}
            {isVIP && (
              <div className="absolute -top-3 -right-2 bg-amber-500 text-black px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 shadow-lg border border-white">
                <Star size={10} fill="black" /> VIP
              </div>
            )}

            {/* Partnership Badge */}
            {isPartnership && !isVIP && (
              <div className="absolute -top-3 -right-2 bg-violet-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 shadow-lg border border-white">
                <Handshake size={10} /> PARCERIA
              </div>
            )}

            {/* New Client Badge */}
            {isNewClient && !isVIP && !isPartnership && (
              <div className="absolute -top-3 -right-2 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 shadow-lg border border-white">
                <UserPlus size={10} /> NOVA
              </div>
            )}
            
            {/* Client Info - Clickable */}
            <button 
              onClick={() => onClientClick?.(appointment.clientName, appointment.phone)}
              className="flex flex-col gap-0.5 overflow-hidden text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-1">
                {isVIP && <Star size={12} className="text-amber-500" fill="#f59e0b" />}
                {isPartnership && !isVIP && <Handshake size={12} className="text-violet-500" />}
                <span 
                  className={`font-black text-sm md:text-base truncate hover:underline ${
                    isVIP ? 'text-amber-600' : isPartnership ? 'text-violet-600' : ''
                  }`}
                  style={!isVIP && !isPartnership ? { color: 'hsl(var(--agenda-foreground))' } : undefined}
                >
                  {appointment.clientName}
                </span>
                {appointment.isConfirmed && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
              <p 
                className="text-[10px] md:text-xs font-bold truncate flex items-center gap-1"
                style={{ color: 'hsl(var(--agenda-muted-foreground))' }}
              >
                {isPartnership && appointment.partnershipName ? (
                  <span className="text-violet-500">{appointment.partnershipName} • </span>
                ) : null}
                <span className="bg-black text-red-500 px-2 py-0.5 rounded font-black">
                  R$ {appointment.chargedValue ?? appointment.totalValue ?? appointment.value}
                </span>
                <span> • {appointment.paymentMethod || '—'}</span>
              </p>
            </button>

            {/* Actions */}
            <div className="flex gap-1">
              <button 
                onClick={() => onAppointmentClick?.(appointment)}
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-all bg-primary/10 text-primary"
              >
                <Pencil size={18} />
              </button>
              {appointment.status === 'Aguardando Sinal' && (
                <button 
                  onClick={onCopyPix}
                  className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-all"
                  style={{ backgroundColor: 'hsl(var(--agenda-muted))', color: 'hsl(var(--agenda-muted-foreground))' }}
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
            className="w-full h-full rounded-xl border-2 border-transparent flex items-center justify-center group"
            style={{ borderColor: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'hsl(var(--agenda-border))')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
            <Plus size={24} style={{ color: 'hsl(var(--agenda-border))' }} className="group-hover:opacity-80" />
          </button>
        )}
      </div>
    </div>
  );
}
