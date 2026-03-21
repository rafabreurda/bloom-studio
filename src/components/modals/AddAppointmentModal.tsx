import { useState } from 'react';
import { X, Star, CheckCircle2, ShoppingCart, Handshake, UserPlus, Sparkles } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { ClientSearchCombobox } from './ClientSearchCombobox';
import { TimeRollerPicker } from '@/components/ui/TimeRollerPicker';
import { StockItem, Appointment, Client, Partnership, ServiceType, AppointmentService } from '@/types';

interface AddAppointmentModalProps {
  selectedDate: Date;
  defaultTime: string;
  onClose: () => void;
  onAdd: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void | Promise<void>;
  stock: StockItem[];
  clients: Client[];
  partnerships: Partnership[];
  serviceTypes: ServiceType[];
  appointments?: Appointment[];
  bronzeGoal?: number;
}

export function AddAppointmentModal({
  selectedDate,
  defaultTime,
  onClose,
  onAdd,
  stock,
  clients,
  partnerships,
  serviceTypes,
  appointments = [],
  bronzeGoal = 10,
}: AddAppointmentModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<AppointmentService[]>([]);
  const [isVIP, setIsVIP] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPartnership, setIsPartnership] = useState(false);
  const [selectedPartnershipId, setSelectedPartnershipId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<StockItem[]>([]);
  const [isManualPhone, setIsManualPhone] = useState(true);
  const [isNewClient, setIsNewClient] = useState(false);
  const [selectedTime, setSelectedTime] = useState(defaultTime || '08:00');
  const [isSaving, setIsSaving] = useState(false);
  const [clientBronzeCount, setClientBronzeCount] = useState<number | null>(null);

  const activeServices = serviceTypes.filter(s => s.isActive);

  const addService = (serviceId: string) => {
    const service = serviceTypes.find(s => s.id === serviceId);
    if (service) {
      setSelectedServices(prev => [...prev, {
        serviceId: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
        cost: service.cost,
      }]);
    }
  };

  const removeService = (index: number) => {
    setSelectedServices(prev => prev.filter((_, i) => i !== index));
  };

  const servicesTotal = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const servicesTotalCost = selectedServices.reduce((acc, s) => acc + s.cost, 0);
  const sessionValue = servicesTotal;

  const selectedPartnership = partnerships.find(p => p.id === selectedPartnershipId);
  const productsTotal = selectedProducts.reduce((acc, curr) => acc + Number(curr.price), 0);

  // Para parcerias 100%, cobra apenas produtos
  const isFullPartnership = isPartnership && selectedPartnership?.discount === 100;
  const chargedValue = isFullPartnership ? productsTotal : Number(sessionValue) + productsTotal;
  const finalTotal = Number(sessionValue) + productsTotal;

  const handleClientSelect = (data: {
    name: string;
    phone: string;
    isVIP: boolean;
    source: 'client' | 'partnership' | 'manual';
  }) => {
    setClientName(data.name);
    setClientPhone(data.phone);
    setIsVIP(data.isVIP);
    setIsManualPhone(data.source === 'manual');
    setIsNewClient(data.source === 'manual');

    // Calcular contagem de bronzes ao selecionar cliente
    if (data.source !== 'manual' && data.name) {
      const count = appointments.filter(a =>
        a.clientName.toLowerCase() === data.name.toLowerCase() ||
        (data.phone && a.phone === data.phone)
      ).length;
      setClientBronzeCount(count);
    } else {
      setClientBronzeCount(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const rawDate = formData.get('date') as string;
      const [year, month, day] = rawDate.split('-');
      const dateStr = `${day}/${month}/${year}`;

      await onAdd({
        clientName: clientName,
        phone: clientPhone,
        date: dateStr,
        time: selectedTime,
        status: formData.get('status') as 'Aguardando Sinal' | 'Agendado',
        value: servicesTotal,
        totalValue: finalTotal,
        productsValue: productsTotal,
        chargedValue: chargedValue,
        cost: servicesTotalCost,
        tags: [...(isVIP ? ['VIP'] : []), ...(isNewClient ? ['Cliente Nova'] : [])],
        paymentMethod: formData.get('paymentMethod') as 'Pix' | 'Cartão' | 'Dinheiro',
        isConfirmed,
        isPartnership,
        partnershipId: isPartnership ? selectedPartnershipId : undefined,
        partnershipName: isPartnership ? selectedPartnership?.name : undefined,
        partnershipDiscount: isPartnership ? selectedPartnership?.discount : undefined,
        serviceTypeId: selectedServices[0]?.serviceId || undefined,
        serviceTypeName: selectedServices.map(s => s.name).join(', ') || undefined,
        services: selectedServices,
        products: selectedProducts.map(p => ({
          productId: p.id,
          name: p.name,
          quantity: 1,
          price: p.price,
        })),
      });
      onClose();
    } catch {
      setIsSaving(false);
    }
  };

  const addProduct = (productId: string) => {
    const product = stock.find(p => p.id === productId);
    if (product) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const clientReachedGoal = clientBronzeCount !== null && clientBronzeCount >= bronzeGoal;
  const clientNearGoal = clientBronzeCount !== null && !clientReachedGoal && clientBronzeCount === bronzeGoal - 1;

  return (
    <BronzeCard className="w-full max-w-2xl bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase">Novo Bronze</h3>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
          <X size={32} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ClientSearchCombobox
            clients={clients}
            partnerships={partnerships}
            value={clientName}
            onSelect={handleClientSelect}
          />
          <input
            name="phone"
            type="text"
            placeholder="WhatsApp (opcional)"
            className="input-bronze"
            value={clientPhone}
            onChange={e => setClientPhone(e.target.value)}
          />
        </div>

        {/* Celebração — Meta Atingida */}
        {clientReachedGoal && (
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 p-4">
            {/* Emojis flutuantes decorativos */}
            <span className="absolute top-1 left-4 text-xl animate-bounce" style={{ animationDelay: '0ms' }}>🏆</span>
            <span className="absolute top-1 right-8 text-lg animate-bounce" style={{ animationDelay: '150ms' }}>⭐</span>
            <span className="absolute bottom-1 left-12 text-lg animate-bounce" style={{ animationDelay: '300ms' }}>✨</span>
            <span className="absolute bottom-1 right-4 text-xl animate-bounce" style={{ animationDelay: '100ms' }}>🌟</span>
            <span className="absolute top-2 left-1/2 text-base animate-bounce" style={{ animationDelay: '200ms' }}>🎉</span>

            <div className="relative text-center py-2">
              <p className="text-2xl font-black text-amber-600 animate-pulse">
                🏆 META ATINGIDA!
              </p>
              <p className="text-sm font-bold text-amber-700 mt-1">
                {clientName} já fez <span className="text-lg font-black">{clientBronzeCount}</span> bronzes!
              </p>
              <p className="text-[11px] text-amber-600 mt-1 font-semibold">
                🎁 Hora de oferecer um mimo especial para ela!
              </p>
            </div>
          </div>
        )}

        {/* Aviso — Quase na meta */}
        {clientNearGoal && (
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-amber-300 bg-amber-50">
            <span className="text-2xl">☀️</span>
            <div>
              <p className="text-xs font-black text-amber-700">
                Quase lá! {clientName} está no bronze {clientBronzeCount}/{bronzeGoal}
              </p>
              <p className="text-[10px] text-amber-600">Este será o último bronze para atingir a meta! 🏆</p>
            </div>
          </div>
        )}

        {/* Contador simples para clientes sem meta */}
        {clientBronzeCount !== null && !clientReachedGoal && !clientNearGoal && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary border border-border/30">
            <span className="text-base">☀️</span>
            <span className="text-xs font-bold text-muted-foreground">
              {clientName} — {clientBronzeCount} de {bronzeGoal} bronzes
            </span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden ml-1">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((clientBronzeCount / bronzeGoal) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <div>
            <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Data</label>
            <input
              name="date"
              type="date"
              className="input-bronze w-full"
              defaultValue={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`}
              required
            />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Horário</label>
            <TimeRollerPicker value={selectedTime} onChange={setSelectedTime} />
          </div>
        </div>

        {/* Service Type Selector - Multi */}
        {activeServices.length > 0 && (
          <div className="p-4 bg-secondary rounded-3xl border border-border/10 space-y-3">
            <p className="text-[10px] font-black uppercase text-foreground flex items-center gap-2">
              <Sparkles size={14} /> Serviços
            </p>
            <select
              onChange={(e) => {
                addService(e.target.value);
                e.target.value = "";
              }}
              className="w-full p-3 bg-background border border-border rounded-xl text-xs font-bold text-foreground"
            >
              <option value="">Adicionar serviço...</option>
              {activeServices.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.duration}min — R$ {s.price.toFixed(2)}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {selectedServices.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-background rounded-lg text-[10px] border border-border flex items-center gap-2 text-foreground font-bold"
                >
                  {s.name} — R$ {s.price.toFixed(2)}
                  <X
                    size={12}
                    className="cursor-pointer text-destructive"
                    onClick={() => removeService(i)}
                  />
                </span>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <p className="text-[10px] font-black text-primary">
                Total Serviços: R$ {servicesTotal.toFixed(2)}
              </p>
            )}
          </div>
        )}

        {/* Products */}
        <div className="p-4 bg-secondary rounded-3xl border border-border/10 space-y-3">
          <p className="text-[10px] font-black uppercase text-foreground flex items-center gap-2">
            <ShoppingCart size={14} /> Itens Extras
          </p>
          <select
            onChange={(e) => {
              addProduct(e.target.value);
              e.target.value = "";
            }}
            className="w-full p-3 bg-background border border-border rounded-xl text-xs font-bold text-foreground"
          >
            <option value="">Adicionar produto...</option>
            {stock.map(p => (
              <option key={p.id} value={p.id}>{p.name} - R$ {p.price}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((p, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-background rounded-lg text-[10px] border border-border flex items-center gap-2 text-foreground"
              >
                {p.name}
                <X
                  size={12}
                  className="cursor-pointer text-destructive"
                  onClick={() => removeProduct(i)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* New Client Tag */}
        {isNewClient && (
          <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
            <UserPlus size={16} className="text-orange-500" />
            <span className="text-xs font-black uppercase text-orange-600">Cliente Nova — sem cadastro</span>
          </div>
        )}

        {/* VIP, Confirmed & Partnership */}
        <div className="grid grid-cols-3 gap-3">
          <label className="flex items-center gap-2 p-3 md:p-4 bg-secondary rounded-3xl border border-border/10 cursor-pointer hover:bg-muted transition-all">
            <input
              type="checkbox"
              className="hidden"
              checked={isVIP}
              onChange={e => setIsVIP(e.target.checked)}
            />
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              isVIP ? 'bg-primary border-primary shadow-xl' : 'border-muted-foreground'
            }`}>
              <Star size={14} fill={isVIP ? "black" : "transparent"} className={isVIP ? 'text-primary-foreground' : ''} />
            </div>
            <span className={`text-[9px] md:text-[10px] font-black uppercase ${isVIP ? 'text-primary' : 'text-muted-foreground'}`}>
              VIP
            </span>
          </label>

          <label className="flex items-center gap-2 p-3 md:p-4 bg-secondary rounded-3xl border border-border/10 cursor-pointer transition-all hover:bg-muted">
            <input
              type="checkbox"
              className="hidden"
              checked={isConfirmed}
              onChange={e => setIsConfirmed(e.target.checked)}
            />
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              isConfirmed ? 'bg-success border-success text-success-foreground' : 'border-muted-foreground'
            }`}>
              {isConfirmed && <CheckCircle2 size={14} />}
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase text-muted-foreground">
              Confirmado
            </span>
          </label>

          <label className="flex items-center gap-2 p-3 md:p-4 bg-secondary rounded-3xl border border-border/10 cursor-pointer transition-all hover:bg-muted">
            <input
              type="checkbox"
              className="hidden"
              checked={isPartnership}
              onChange={e => {
                setIsPartnership(e.target.checked);
                if (!e.target.checked) setSelectedPartnershipId('');
              }}
            />
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              isPartnership ? 'bg-violet-500 border-violet-500 text-white' : 'border-muted-foreground'
            }`}>
              {isPartnership && <Handshake size={14} />}
            </div>
            <span className={`text-[9px] md:text-[10px] font-black uppercase ${isPartnership ? 'text-violet-600' : 'text-muted-foreground'}`}>
              Parceria
            </span>
          </label>
        </div>

        {/* Partnership selector */}
        {isPartnership && (
          <div className="p-4 bg-violet-50 rounded-3xl border border-violet-200 space-y-2">
            <p className="text-[10px] font-black uppercase text-violet-700 flex items-center gap-2">
              <Handshake size={14} /> Selecione a Parceria
            </p>
            <select
              value={selectedPartnershipId}
              onChange={(e) => setSelectedPartnershipId(e.target.value)}
              className="w-full p-3 bg-white border border-violet-200 rounded-xl text-xs font-bold text-foreground"
              required={isPartnership}
            >
              <option value="">Escolha uma parceria...</option>
              {partnerships.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.discount}% desconto)</option>
              ))}
            </select>
          </div>
        )}

        {/* Value & Payment */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-muted-foreground">
              Serviços
            </label>
            <div className="input-bronze flex items-center">
              <span className="text-sm font-bold">R$ {servicesTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-muted-foreground">
              Pagamento
            </label>
            <select name="paymentMethod" className="input-bronze">
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>
        </div>

        {/* Total - Célula preta com número vermelho */}
        <div className="p-6 rounded-[28px] bg-black flex justify-between items-center shadow-xl">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400">
              {isFullPartnership ? 'Cobrar (apenas produtos)' : 'Total a Cobrar'}
            </p>
            <p className="text-4xl font-black text-red-500">R$ {chargedValue.toFixed(2)}</p>
            {isFullPartnership && (
              <p className="text-[9px] text-gray-500 mt-1">
                Sessão R$ {sessionValue} → Parcerias | Produtos R$ {productsTotal} → Receita
              </p>
            )}
          </div>
          <div className="text-right">
            <select
              name="status"
              className="bg-gray-800 text-white font-black uppercase text-[10px] rounded-xl p-3 border-none focus:ring-0"
            >
              <option>Aguardando Sinal</option>
              <option>Agendado</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <BronzeButton
          className="w-full h-[70px]"
          variant="gold"
          type="submit"
          icon={CheckCircle2}
          disabled={isSaving}
        >
          {isSaving ? 'Salvando...' : 'Lançar Bronze'}
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}
