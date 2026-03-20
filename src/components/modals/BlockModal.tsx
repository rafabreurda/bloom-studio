import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { TimeRollerPicker } from '@/components/ui/TimeRollerPicker';
import { Block } from '@/types';

interface BlockModalProps {
  selectedDate: Date;
  onClose: () => void;
  onBlock: (block: Omit<Block, 'id' | 'createdAt'>) => void;
}

export function BlockModal({ selectedDate, onClose, onBlock }: BlockModalProps) {
  const [blockType, setBlockType] = useState<'allDay' | 'timeRange' | 'dateRange'>('allDay');

  const toLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (blockType === 'dateRange') {
      const [sy, sm, sd] = (formData.get('startDate') as string).split('-');
      const [ey, em, ed] = (formData.get('endDate') as string).split('-');

      onBlock({
        type: 'dateRange',
        reason: formData.get('reason') as string,
        date: `${sd}/${sm}/${sy}`,
        endDate: `${ed}/${em}/${ey}`,
        time: null,
      });
    } else {
      const [y, m, d] = (formData.get('date') as string).split('-');
      const dateStr = `${d}/${m}/${y}`;
      
      onBlock({
        type: blockType,
        reason: formData.get('reason') as string,
        date: dateStr,
        time: blockType === 'timeRange' ? startTime : null,
      });
    }
    
    onClose();
  };

  return (
    <BronzeCard className="w-full max-w-md bg-card border-primary/30 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase flex items-center gap-2">
          <Lock size={20} /> Bloqueio
        </h3>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Block Type Toggle */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-secondary rounded-xl">
          <button
            type="button"
            onClick={() => setBlockType('allDay')}
            className={`py-3 text-[9px] font-black uppercase rounded-lg transition-all ${
              blockType === 'allDay' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            Dia Inteiro
          </button>
          <button
            type="button"
            onClick={() => setBlockType('timeRange')}
            className={`py-3 text-[9px] font-black uppercase rounded-lg transition-all ${
              blockType === 'timeRange' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            Hora
          </button>
          <button
            type="button"
            onClick={() => setBlockType('dateRange')}
            className={`py-3 text-[9px] font-black uppercase rounded-lg transition-all ${
              blockType === 'dateRange' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            Período
          </button>
        </div>

        {/* Date inputs based on type */}
        {blockType === 'dateRange' ? (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                Data Inicial
              </label>
              <input
                name="startDate"
                type="date"
                className="input-bronze"
                defaultValue={toLocalDateString(selectedDate)}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                Data Final
              </label>
              <input
                name="endDate"
                type="date"
                className="input-bronze"
                defaultValue={toLocalDateString(selectedDate)}
                required
              />
            </div>
          </div>
        ) : (
          <input
            name="date"
            type="date"
            className="input-bronze"
            defaultValue={toLocalDateString(selectedDate)}
            required
          />
        )}

        {/* Time Range (conditional) */}
        {blockType === 'timeRange' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                Hora Início
              </label>
              <TimeRollerPicker value={startTime} onChange={setStartTime} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                Hora Fim
              </label>
              <TimeRollerPicker value={endTime} onChange={setEndTime} />
            </div>
          </div>
        )}

        {/* Reason */}
        <input
          name="reason"
          type="text"
          placeholder="Motivo"
          className="input-bronze"
          required
        />

        {/* Submit */}
        <BronzeButton variant="gold" className="w-full h-[60px]" type="submit">
          Bloquear Agenda
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}
