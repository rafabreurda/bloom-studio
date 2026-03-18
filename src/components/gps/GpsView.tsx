import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export type GpsPreference = 'google' | 'waze';

export const GPS_PREF_KEY = 'bloom_gps_preference';

export function getGpsPreference(): GpsPreference {
  return (localStorage.getItem(GPS_PREF_KEY) as GpsPreference) || 'google';
}

export function openGps(address: string) {
  const pref = getGpsPreference();
  if (!address) return;
  if (pref === 'waze') {
    window.open(`https://waze.com/ul?q=${encodeURIComponent(address)}`, '_blank');
  } else {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  }
}

export function GpsView() {
  const [selected, setSelected] = useState<GpsPreference>(() => getGpsPreference());

  useEffect(() => {
    localStorage.setItem(GPS_PREF_KEY, selected);
  }, [selected]);

  const options: { id: GpsPreference; label: string; description: string; color: string; bg: string }[] = [
    {
      id: 'google',
      label: 'Google Maps',
      description: 'Abre o Google Maps ao clicar no ícone de GPS na agenda',
      color: '#4285f4',
      bg: '#e8f0fe',
    },
    {
      id: 'waze',
      label: 'Waze',
      description: 'Abre o Waze ao clicar no ícone de GPS na agenda',
      color: '#05C8F7',
      bg: '#e0f9ff',
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#4285f4' }}>
          <Navigation size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase" style={{ color: 'hsl(var(--foreground))' }}>
            Preferência de GPS
          </h2>
          <p className="text-xs font-bold" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Escolha qual app abre ao clicar no GPS da agenda
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map(opt => {
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className="flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left w-full"
              style={{
                borderColor: isActive ? opt.color : 'hsl(var(--border))',
                backgroundColor: isActive ? opt.bg : 'hsl(var(--card))',
                boxShadow: isActive ? `0 4px 20px ${opt.color}30` : undefined,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: isActive ? opt.color : 'hsl(var(--muted))' }}
              >
                <MapPin size={22} style={{ color: isActive ? '#fff' : opt.color }} />
              </div>
              <div className="flex-1">
                <p className="font-black text-sm uppercase" style={{ color: isActive ? opt.color : 'hsl(var(--foreground))' }}>
                  {opt.label}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {opt.description}
                </p>
              </div>
              {/* Indicator */}
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: isActive ? opt.color : 'hsl(var(--border))' }}
              >
                {isActive && (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div
        className="flex items-start gap-3 p-4 rounded-2xl border"
        style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}
      >
        <Navigation size={16} className="mt-0.5 shrink-0" style={{ color: 'hsl(var(--muted-foreground))' }} />
        <p className="text-xs font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
          O ícone <strong>GPS</strong> aparece ao lado do nome da cliente na agenda. Ao clicar, abre o {selected === 'waze' ? 'Waze' : 'Google Maps'} com o endereço dela automaticamente.
          Se a cliente não tiver endereço cadastrado, o ícone não aparece.
        </p>
      </div>
    </div>
  );
}
