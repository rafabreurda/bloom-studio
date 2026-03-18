interface TimeRollerPickerProps {
  value: string; // HH:MM
  onChange: (time: string) => void;
  className?: string;
}

export function TimeRollerPicker({ value, onChange, className }: TimeRollerPickerProps) {
  const hours = Array.from({ length: 16 }, (_, i) => (i + 7).toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const [h, m] = value ? value.split(':') : ['08', '00'];
  const selectedHour = hours.includes(h) ? h : '08';
  const selectedMinute = minutes.includes(m) ? m : '00';

  return (
    <div className={`flex gap-2 items-center ${className || ''}`}>
      <select
        value={selectedHour}
        onChange={(e) => onChange(`${e.target.value}:${selectedMinute}`)}
        className="flex-1 p-3 bg-background border border-border rounded-xl text-sm font-bold text-foreground appearance-none cursor-pointer"
      >
        {hours.map(hour => (
          <option key={hour} value={hour}>{hour}h</option>
        ))}
      </select>
      <span className="text-lg font-black text-muted-foreground">:</span>
      <select
        value={selectedMinute}
        onChange={(e) => onChange(`${selectedHour}:${e.target.value}`)}
        className="flex-1 p-3 bg-background border border-border rounded-xl text-sm font-bold text-foreground appearance-none cursor-pointer"
      >
        {minutes.map(min => (
          <option key={min} value={min}>{min}</option>
        ))}
      </select>
    </div>
  );
}
