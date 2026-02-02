import { useState } from 'react';
import { X, Star, CheckCircle2, ShoppingCart } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { StockItem, Appointment } from '@/types';

interface AddAppointmentModalProps {
  selectedDate: Date;
  defaultTime: string;
  onClose: () => void;
  onAdd: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  stock: StockItem[];
}

export function AddAppointmentModal({ 
  selectedDate, 
  defaultTime, 
  onClose, 
  onAdd,
  stock 
}: AddAppointmentModalProps) {
  const [sessionValue, setSessionValue] = useState(150);
  const [isVIP, setIsVIP] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<StockItem[]>([]);
  
  const finalTotal = Number(sessionValue) + selectedProducts.reduce((acc, curr) => acc + Number(curr.price), 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dateStr = new Date(formData.get('date') as string).toLocaleDateString('pt-BR');
    
    onAdd({
      clientName: formData.get('name') as string,
      phone: formData.get('phone') as string,
      date: dateStr,
      time: formData.get('time') as string,
      status: formData.get('status') as 'Aguardando Sinal' | 'Agendado',
      value: Number(sessionValue),
      totalValue: finalTotal,
      tags: isVIP ? ['VIP'] : [],
      paymentMethod: formData.get('paymentMethod') as 'Pix' | 'Cartão' | 'Dinheiro',
      isConfirmed,
    });
    
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
          <input 
            name="name" 
            type="text" 
            placeholder="Nome" 
            className="input-bronze" 
            required 
          />
          <input 
            name="phone" 
            type="text" 
            placeholder="WhatsApp" 
            className="input-bronze" 
            required 
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <input 
            name="date" 
            type="date" 
            className="input-bronze" 
            defaultValue={selectedDate.toISOString().split('T')[0]} 
            required 
          />
          <input 
            name="time" 
            type="time" 
            className="input-bronze" 
            defaultValue={defaultTime} 
            required 
          />
        </div>

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

        {/* VIP & Confirmed */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-4 bg-secondary rounded-3xl border border-border/10 cursor-pointer hover:bg-muted transition-all">
            <input 
              type="checkbox" 
              className="hidden" 
              checked={isVIP} 
              onChange={e => setIsVIP(e.target.checked)} 
            />
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              isVIP ? 'bg-primary border-primary shadow-xl' : 'border-muted-foreground'
            }`}>
              <Star size={16} fill={isVIP ? "black" : "transparent"} className={isVIP ? 'text-primary-foreground' : ''} />
            </div>
            <span className={`text-[10px] font-black uppercase ${isVIP ? 'text-primary' : 'text-muted-foreground'}`}>
              Cliente VIP
            </span>
          </label>
          
          <label className="flex items-center gap-3 p-4 bg-secondary rounded-3xl border border-border/10 cursor-pointer transition-all hover:bg-muted">
            <input 
              type="checkbox" 
              className="hidden" 
              checked={isConfirmed} 
              onChange={e => setIsConfirmed(e.target.checked)} 
            />
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              isConfirmed ? 'bg-success border-success text-success-foreground' : 'border-muted-foreground'
            }`}>
              {isConfirmed && <CheckCircle2 size={16} />}
            </div>
            <span className="text-[10px] font-black uppercase text-muted-foreground">
              Confirmado
            </span>
          </label>
        </div>

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
            <select name="paymentMethod" className="input-bronze">
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>
        </div>

        {/* Total */}
        <div className={`p-6 rounded-[28px] text-primary-foreground flex justify-between items-center shadow-xl transition-all duration-500 ${
          isVIP ? 'bg-gradient-gold' : 'bg-gray-100 text-gray-900'
        }`}>
          <div>
            <p className="text-[10px] font-black uppercase opacity-60">Total</p>
            <p className="text-4xl font-black">R$ {finalTotal.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <select 
              name="status" 
              className="bg-background text-foreground font-black uppercase text-[10px] rounded-xl p-3 border-none focus:ring-0"
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
        >
          Lançar Bronze
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}
