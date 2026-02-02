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
}

export function TimeSlot({
  time,
  appointment,
  block,
  onAddClick,
  onDeleteBlock,
  onCopyPix,
  onSendWhatsApp,
}: TimeSlotProps) {
  const isVIP = appointment?.tags?.includes('VIP');

  return (
    <div className={`flex min-h-[85px] transition-colors ${block ? 'bg-gray-50' : 'hover:bg-amber-50/10'}`}>
      {/* Time Column */}
      <div className="w-16 md:w-20 shrink-0 border-r border-gray-100 flex flex-col items-center pt-4 md:pt-5">
        <span className="text-[10px] md:text-xs font-black text-gray-400">{time}</span>
      </div>

      {/* Content Column */}
      <div className="flex-1 p-2 relative">
        {block ? (
          // Blocked Slot
          <div className="h-full w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-between px-4 opacity-60">
            <span className="text-[9px] font-black uppercase text-gray-400 truncate">
              {block.reason}
            </span>
            <button 
              onClick={() => onDeleteBlock(block.id)} 
              className="text-red-300 p-2"
            >
              <X size={18} />
            </button>
          </div>
        ) : appointment ? (
          // Appointment Slot
          <div className={`h-full w-full rounded-xl p-3 md:p-4 flex justify-between items-center bg-white border border-gray-200 relative ${
            isVIP 
              ? 'vip-border vip-glow' 
              : `border-l-4 ${appointment.status === 'Agendado' ? 'border-l-emerald-500' : 'border-l-amber-400'}`
          }`}>
            {/* VIP Badge */}
            {isVIP && (
              <div className="absolute -top-3 -right-2 bg-amber-500 text-black px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 shadow-lg border border-white">
                <Star size={10} fill="black" /> VIP
              </div>
            )}
            
            {/* Client Info */}
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <div className="flex items-center gap-1">
                {isVIP && <Star size={12} className="text-amber-500" fill="#f59e0b" />}
                <span className={`font-black text-gray-900 text-sm md:text-base truncate ${isVIP ? 'text-amber-600' : ''}`}>
                  {appointment.clientName}
                </span>
                {appointment.isConfirmed && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
              <p className="text-[10px] md:text-xs text-zinc-500 font-bold truncate">
                Total R$ {appointment.totalValue || appointment.value} • {appointment.paymentMethod || '—'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              {appointment.status === 'Aguardando Sinal' && (
                <button 
                  onClick={onCopyPix}
                  className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-amber-100 transition-all"
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
            className="w-full h-full rounded-xl border-2 border-transparent hover:border-amber-100 flex items-center justify-center group"
          >
            <Plus size={24} className="text-gray-100 group-hover:text-amber-200" />
          </button>
        )}
      </div>
    </div>
  );
}
