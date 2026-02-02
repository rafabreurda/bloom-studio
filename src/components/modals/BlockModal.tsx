import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Block } from '@/types';

interface BlockModalProps {
  selectedDate: Date;
  onClose: () => void;
  onBlock: (block: Omit<Block, 'id' | 'createdAt'>) => void;
}

export function BlockModal({ selectedDate, onClose, onBlock }: BlockModalProps) {
  const [blockType, setBlockType] = useState<'allDay' | 'timeRange' | 'dateRange'>('allDay');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (blockType === 'dateRange') {
      const startDate = new Date(formData.get('startDate') as string);
      const endDate = new Date(formData.get('endDate') as string);
      
      onBlock({
        type: 'dateRange',
        reason: formData.get('reason') as string,
        date: startDate.toLocaleDateString('pt-BR'),
        endDate: endDate.toLocaleDateString('pt-BR'),
        time: null,
      });
    } else {
      const dateStr = new Date(formData.get('date') as string).toLocaleDateString('pt-BR');
      
      onBlock({
        type: blockType,
        reason: formData.get('reason') as string,
        date: dateStr,
        time: blockType === 'timeRange' ? formData.get('startTime') as string : null,
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
                defaultValue={selectedDate.toISOString().split('T')[0]}
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
                defaultValue={selectedDate.toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        ) : (
          <input
            name="date"
            type="date"
            className="input-bronze"
            defaultValue={selectedDate.toISOString().split('T')[0]}
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
              <input
                name="startTime"
                type="time"
                className="input-bronze"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                Hora Fim
              </label>
              <input
                name="endTime"
                type="time"
                className="input-bronze"
                required
              />
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
