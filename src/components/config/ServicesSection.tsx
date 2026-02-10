import { useState } from 'react';
import { Plus, Pencil, Trash2, Clock, DollarSign, X, Check } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { ServiceType } from '@/types';
import { toast } from 'sonner';

interface ServicesSectionProps {
  services: ServiceType[];
  onUpdate: (services: ServiceType[]) => void;
}

export function ServicesSection({ services, onUpdate }: ServicesSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', duration: 40, price: 0, cost: 0 });

  const handleAdd = () => {
    if (!form.name) return toast.error('Nome é obrigatório');
    const newService: ServiceType = {
      id: crypto.randomUUID(),
      name: form.name,
      duration: form.duration,
      price: form.price,
      cost: form.cost,
      isActive: true,
    };
    onUpdate([...services, newService]);
    setForm({ name: '', duration: 40, price: 0, cost: 0 });
    setShowAddForm(false);
    toast.success('Serviço adicionado!');
  };

  const handleEdit = (service: ServiceType) => {
    setEditingId(service.id);
    setForm({ name: service.name, duration: service.duration, price: service.price, cost: service.cost });
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(services.map(s => s.id === id ? { ...s, ...form } : s));
    setEditingId(null);
    toast.success('Serviço atualizado!');
  };

  const handleDelete = (id: string) => {
    onUpdate(services.filter(s => s.id !== id));
    toast.success('Serviço removido!');
  };

  const handleToggle = (id: string) => {
    onUpdate(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const activeServices = services.filter(s => s.isActive);
  const totalProfit = activeServices.reduce((sum, s) => sum + (s.price - s.cost), 0);

  return (
    <BronzeCard className="bg-secondary/50 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black uppercase text-primary">Serviços & Preços</h3>
        <BronzeButton variant="gold" icon={Plus} size="sm" onClick={() => setShowAddForm(true)}>
          Novo Serviço
        </BronzeButton>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-4 bg-background rounded-2xl border border-primary/20 space-y-3">
          <p className="text-[10px] font-black uppercase text-primary">Novo Serviço</p>
          <input
            type="text"
            placeholder="Nome do serviço"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input-bronze w-full"
          />
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-muted-foreground">Duração (min)</label>
              <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="input-bronze" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-muted-foreground">Preço (R$)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="input-bronze" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-muted-foreground">Custo (R$)</label>
              <input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} className="input-bronze" />
            </div>
          </div>
          <div className="flex gap-2">
            <BronzeButton variant="gold" size="sm" icon={Check} onClick={handleAdd}>Salvar</BronzeButton>
            <BronzeButton variant="secondary" size="sm" icon={X} onClick={() => setShowAddForm(false)}>Cancelar</BronzeButton>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-2">
        {services.map(service => (
          <div key={service.id} className={`p-4 rounded-2xl border transition-all ${service.isActive ? 'bg-background border-border' : 'bg-muted/30 border-border/50 opacity-60'}`}>
            {editingId === service.id ? (
              <div className="space-y-3">
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-bronze w-full" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-muted-foreground">Duração</label>
                    <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="input-bronze" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-muted-foreground">Preço</label>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="input-bronze" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-muted-foreground">Custo</label>
                    <input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} className="input-bronze" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <BronzeButton variant="gold" size="sm" icon={Check} onClick={() => handleSaveEdit(service.id)}>Salvar</BronzeButton>
                  <BronzeButton variant="secondary" size="sm" icon={X} onClick={() => setEditingId(null)}>Cancelar</BronzeButton>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-black uppercase">{service.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> {service.duration} min
                    </span>
                    <span className="text-xs text-primary font-black flex items-center gap-1">
                      <DollarSign size={12} /> R$ {service.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Custo: R$ {service.cost.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-emerald-500">
                      Lucro: R$ {(service.price - service.cost).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(service.id)} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${service.isActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                    {service.isActive ? 'ON' : 'OFF'}
                  </button>
                  <button onClick={() => handleEdit(service)} className="p-2 text-muted-foreground hover:text-foreground">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 text-destructive hover:text-destructive/80">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 rounded-2xl bg-black text-center">
        <p className="text-[10px] font-black uppercase text-gray-400">Lucro Médio por Serviço</p>
        <p className="text-2xl font-black text-emerald-400">
          R$ {activeServices.length > 0 ? (totalProfit / activeServices.length).toFixed(2) : '0.00'}
        </p>
      </div>
    </BronzeCard>
  );
}
