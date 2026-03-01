interface TimeRollerPickerProps {
  value: string; // HH:MM
  onChange: (time: string) => void;
  className?: string;
}

export function TimeRollerPicker({ value, onChange, className }: TimeRollerPickerProps) {
  const hours = Array.from({ length: 15 }, (_, i) => (i + 8).toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const [h, m] = value ? value.split(':') : ['08', '00'];
  const selectedHour = hours.includes(h) ? h : '08';
  const selectedMinute = minutes.includes(m) ? m : '00';

  return (
    <div className={`flex flex-col gap-3 ${className || ''}`}>
      {/* Hours */}
      <div>
        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1 block">Hora</span>
        <div className="grid grid-cols-5 gap-1.5">
          {hours.map(hour => (
            <button
              key={hour}
              type="button"
              onClick={() => onChange(`${hour}:${selectedMinute}`)}
              className={`py-2 rounded-lg text-sm font-bold transition-all ${
                hour === selectedHour
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {hour}
            </button>
          ))}
        </div>
      </div>
      {/* Minutes */}
      <div>
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Minutos</span>
        <div className="grid grid-cols-4 gap-1.5">
          {minutes.map(min => (
            <button
              key={min}
              type="button"
              onClick={() => onChange(`${selectedHour}:${min}`)}
              className={`py-2 rounded-lg text-sm font-bold transition-all ${
                min === selectedMinute
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              :{min}
            </button>
          ))}
        </div>
      </div>
      {/* Selected time display */}
      <div className="text-center text-lg font-black text-foreground">
        {selectedHour}:{selectedMinute}
      </div>
    </div>
  );
}
