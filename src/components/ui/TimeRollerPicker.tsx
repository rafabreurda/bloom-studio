import { useState, useRef, useEffect } from 'react';

interface TimeRollerPickerProps {
  value: string; // HH:MM
  onChange: (time: string) => void;
  className?: string;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

function RollerColumn({ items, selectedIndex, onSelect }: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    if (containerRef.current && !isScrolling.current) {
      containerRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
    }
  }, [selectedIndex]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    isScrolling.current = true;
    
    clearTimeout((containerRef.current as any)._scrollTimer);
    (containerRef.current as any)._scrollTimer = setTimeout(() => {
      if (!containerRef.current) return;
      const index = Math.round(containerRef.current.scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      containerRef.current.scrollTop = clampedIndex * ITEM_HEIGHT;
      onSelect(clampedIndex);
      isScrolling.current = false;
    }, 80);
  };

  return (
    <div className="relative" style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
      {/* Selection highlight */}
      <div 
        className="absolute left-0 right-0 pointer-events-none z-10 border-y-2 border-primary rounded-lg bg-primary/10"
        style={{ top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT }}
      />
      {/* Fade top/bottom */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-card to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent z-20 pointer-events-none" />
      
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scrollbar-hide"
        style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {/* Spacer top */}
        <div style={{ height: ITEM_HEIGHT * 2 }} />
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => {
              onSelect(i);
              if (containerRef.current) {
                containerRef.current.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
              }
            }}
            className={`flex items-center justify-center cursor-pointer transition-all font-black ${
              i === selectedIndex 
                ? 'text-2xl text-foreground' 
                : 'text-lg text-muted-foreground/50'
            }`}
            style={{ height: ITEM_HEIGHT, scrollSnapAlign: 'start' }}
          >
            {item}
          </div>
        ))}
        {/* Spacer bottom */}
        <div style={{ height: ITEM_HEIGHT * 2 }} />
      </div>
    </div>
  );
}

export function TimeRollerPicker({ value, onChange, className }: TimeRollerPickerProps) {
  const hours = Array.from({ length: 15 }, (_, i) => (i + 8).toString().padStart(2, '0')); // 08-22
  const minutes = ['00', '15', '30', '45'];

  const [h, m] = value ? value.split(':') : ['08', '00'];
  const hourIndex = Math.max(0, hours.indexOf(h));
  const minuteIndex = Math.max(0, minutes.indexOf(m));

  const handleHourChange = (index: number) => {
    onChange(`${hours[index]}:${minutes[minuteIndex] || '00'}`);
  };

  const handleMinuteChange = (index: number) => {
    onChange(`${hours[hourIndex] || '08'}:${minutes[index]}`);
  };

  return (
    <div className={`flex items-center justify-center gap-1 ${className || ''}`}>
      <div className="w-16">
        <RollerColumn items={hours} selectedIndex={hourIndex} onSelect={handleHourChange} />
      </div>
      <span className="text-2xl font-black text-foreground">:</span>
      <div className="w-16">
        <RollerColumn items={minutes} selectedIndex={minuteIndex} onSelect={handleMinuteChange} />
      </div>
    </div>
  );
}