import { useState } from 'react';
import { X, Star, CheckCircle2, ShoppingCart, Handshake, Trash2, Sparkles, FileText, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { TimeRollerPicker } from '@/components/ui/TimeRollerPicker';
import { StockItem, Appointment, Partnership, ServiceType, AppointmentService } from '@/types';

interface EditAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  stock: StockItem[];
  partnerships: Partnership[];
  serviceTypes: ServiceType[];
}

export function EditAppointmentModal({ 
  appointment,
  onClose, 
  onSave,
  onDelete,
  stock,
  partnerships,
  serviceTypes,
}: EditAppointmentModalProps) {
  const [clientName, setClientName] = useState(appointment.clientName);
  const [clientPhone, setClientPhone] = useState(appointment.phone);
  const [isVIP, setIsVIP] = useState(appointment.tags?.includes('VIP') || false);
  const [isConfirmed, setIsConfirmed] = useState(appointment.isConfirmed);
  const [isPartnership, setIsPartnership] = useState(appointment.isPartnership);
  const [selectedPartnershipId, setSelectedPartnershipId] = useState(appointment.partnershipId || '');
  const [selectedProducts, setSelectedProducts] = useState<StockItem[]>(
    appointment.products?.map(p => {
      const stockItem = stock.find(s => s.id === p.productId);
      return stockItem || { id: p.productId, name: p.name, price: p.price, quantity: 0, minStock: 0 };
    }) || []
  );
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>(appointment.paymentMethod);
  const [status, setStatus] = useState<'Aguardando Sinal' | 'Agendado' | 'Concluído'>(appointment.status || 'Agendado');
  const [selectedServices, setSelectedServices] = useState<AppointmentService[]>(
    appointment.services && appointment.services.length > 0
      ? appointment.services
      : appointment.serviceTypeId
        ? [{
            serviceId: appointment.serviceTypeId,
            name: appointment.serviceTypeName || '',
            duration: 0,
            price: appointment.value,
            cost: appointment.cost || 0,
          }]
        : []
  );
  const [date, setDate] = useState(() => {
    const parts = appointment.date.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  });
  const [time, setTime] = useState(appointment.time);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

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
  
  const isFullPartnership = isPartnership && selectedPartnership?.discount === 100;
  const chargedValue = isFullPartnership ? productsTotal : Number(sessionValue) + productsTotal;
  const finalTotal = Number(sessionValue) + productsTotal;

  const buildAppointmentData = (finalPaymentMethod: 'Pix' | 'Cartão' | 'Dinheiro', finalStatus: 'Aguardando Sinal' | 'Agendado' | 'Concluído'): Appointment => {
    const [year, month, day] = date.split('-');
    const dateStr = `${day}/${month}/${year}`;
    
    return {
      ...appointment,
      clientName,
      phone: clientPhone,
      date: dateStr,
      time,
      status: finalStatus,
      value: servicesTotal,
      totalValue: finalTotal,
      productsValue: productsTotal,
      chargedValue: chargedValue,
      cost: servicesTotalCost,
      tags: isVIP ? ['VIP'] : [],
      paymentMethod: finalPaymentMethod,
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
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // If changing to "Agendado" from "Aguardando Sinal", show payment confirmation
    const wasWaiting = appointment.status === 'Aguardando Sinal';
    if (wasWaiting && status === 'Agendado') {
      setShowPaymentConfirm(true);
      return;
    }
    
    onSave(buildAppointmentData(paymentMethod, status));
    onClose();
  };

  const handlePaymentConfirm = (method: 'Pix' | 'Cartão' | 'Dinheiro') => {
    setPaymentMethod(method);
    setShowPaymentConfirm(false);
    onSave(buildAppointmentData(method, 'Agendado'));
    onClose();
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

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      onDelete(appointment.id);
      onClose();
    }
  };

  return (
    <BronzeCard className="w-full max-w-2xl bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase">Editar Agendamento</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDelete} 
            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
          >
            <Trash2 size={24} />
          </button>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={32} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Nome do cliente" 
            className="input-bronze" 
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            required 
          />
          <input 
            type="text" 
            placeholder="WhatsApp" 
            className="input-bronze" 
            value={clientPhone}
            onChange={e => setClientPhone(e.target.value)}
            required 
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <div>
            <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Data</label>
            <input 
              type="date" 
              className="input-bronze" 
              value={date}
              onChange={e => setDate(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Horário</label>
            <TimeRollerPicker value={time} onChange={setTime} />
          </div>
        </div>

        {/* Service Type Selector */}
        {activeServices.length > 0 && (
          <div className="p-4 bg-secondary rounded-3xl border border-border/10 space-y-2">
            <p className="text-[10px] font-black uppercase text-foreground flex items-center gap-2">
              <Sparkles size={14} /> Tipo de Serviço
            </p>
            <select
              value={selectedServiceId}
              onChange={(e) => handleServiceSelect(e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-xl text-xs font-bold text-foreground"
            >
              <option value="">Selecionar serviço...</option>
              {activeServices.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.duration}min — R$ {s.price.toFixed(2)}
                </option>
              ))}
            </select>
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
              Sessão
            </label>
            <input 
              type="number" 
              value={sessionValue} 
              onChange={e => setSessionValue(Number(e.target.value))} 
              className="input-bronze" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-muted-foreground">
              Pagamento
            </label>
            <select 
              value={paymentMethod} 
              onChange={e => setPaymentMethod(e.target.value as 'Pix' | 'Cartão' | 'Dinheiro')}
              className="input-bronze"
            >
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>
        </div>

        {/* Total */}
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
              value={status}
              onChange={e => setStatus(e.target.value as 'Aguardando Sinal' | 'Agendado' | 'Concluído')}
              className="bg-gray-800 text-white font-black uppercase text-[10px] rounded-xl p-3 border-none focus:ring-0"
            >
              <option>Aguardando Sinal</option>
              <option>Agendado</option>
              <option>Concluído</option>
            </select>
          </div>
        </div>

        {/* Receipt + Submit */}
        <div className="flex gap-3">
          <BronzeButton
            type="button"
            variant="outline"
            icon={FileText}
            className="h-[60px]"
            onClick={() => setShowReceipt(true)}
          >
            Recibo
          </BronzeButton>
          <BronzeButton 
            className="flex-1 h-[60px]" 
            variant="gold" 
            type="submit" 
            icon={CheckCircle2}
          >
            Salvar Alterações
          </BronzeButton>
        </div>
      </form>

      {showReceipt && (
        <ReceiptModal appointment={appointment} onClose={() => setShowReceipt(false)} />
      )}

      {/* Payment Confirmation Overlay */}
      {showPaymentConfirm && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-3xl p-8 max-w-sm w-full space-y-6 border border-primary/30 shadow-2xl">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black uppercase text-foreground">Confirmar Pagamento</h3>
              <p className="text-3xl font-black text-primary">R$ {chargedValue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{clientName}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handlePaymentConfirm('Pix')}
                className="w-full flex items-center gap-4 p-4 bg-secondary hover:bg-muted rounded-2xl border border-border/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Smartphone size={22} className="text-emerald-500" />
                </div>
                <span className="text-sm font-black uppercase text-foreground">Pix</span>
              </button>

              <button
                onClick={() => handlePaymentConfirm('Cartão')}
                className="w-full flex items-center gap-4 p-4 bg-secondary hover:bg-muted rounded-2xl border border-border/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <CreditCard size={22} className="text-blue-500" />
                </div>
                <span className="text-sm font-black uppercase text-foreground">Cartão</span>
              </button>

              <button
                onClick={() => handlePaymentConfirm('Dinheiro')}
                className="w-full flex items-center gap-4 p-4 bg-secondary hover:bg-muted rounded-2xl border border-border/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Banknote size={22} className="text-yellow-500" />
                </div>
                <span className="text-sm font-black uppercase text-foreground">Dinheiro</span>
              </button>
            </div>

            <button
              onClick={() => setShowPaymentConfirm(false)}
              className="w-full text-xs font-bold text-muted-foreground hover:text-foreground py-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </BronzeCard>
  );
}
