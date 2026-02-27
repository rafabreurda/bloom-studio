import { useState } from 'react';
import { X, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { AdminWithRole } from '@/types/admin';

interface Plan {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
}

interface UserFormData {
  name: string;
  phone: string;
  cpf: string;
  email: string;
  birthday: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_city: string;
  address_zip: string;
  address_state: string;
  username: string;
  password: string;
  plan_id: string;
  payment_notes: string;
}

interface UserFormModalProps {
  editingAdmin: AdminWithRole | null;
  adminExtras: Record<string, any>;
  plans: Plan[];
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

const STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</label>
    {children}
  </div>
);

export function UserFormModal({ editingAdmin, adminExtras, plans, onSubmit, onClose, isLoading }: UserFormModalProps) {
  const extra = editingAdmin ? (adminExtras[editingAdmin.id] || {}) : {};

  const [name, setName] = useState(editingAdmin?.name || '');
  const [phone, setPhone] = useState(editingAdmin?.phone || '');
  const [cpf, setCpf] = useState(extra.cpf || '');
  const [email, setEmail] = useState(extra.email || '');
  const [birthdayDay, setBirthdayDay] = useState(extra.birthday ? String(extra.birthday).split('-')[2] || '' : '');
  const [birthdayMonth, setBirthdayMonth] = useState(extra.birthday ? String(extra.birthday).split('-')[1] || '' : '');
  const [birthdayYear, setBirthdayYear] = useState(extra.birthday ? String(extra.birthday).split('-')[0] || '' : '');

  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const monthOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const maxYear = 2050;
  const yearOptions = Array.from({ length: maxYear - 1899 }, (_, i) => String(maxYear - i));

  const [addressStreet, setAddressStreet] = useState(extra.address_street || '');
  const [addressNumber, setAddressNumber] = useState(extra.address_number || '');
  const [addressNeighborhood, setAddressNeighborhood] = useState(extra.address_neighborhood || '');
  const [addressCity, setAddressCity] = useState(extra.address_city || '');
  const [addressZip, setAddressZip] = useState(extra.address_zip || '');
  const [addressState, setAddressState] = useState(extra.address_state || '');
  const [username, setUsername] = useState(extra.username || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [planId, setPlanId] = useState(extra.plan_id || '');
  const [paymentNotes, setPaymentNotes] = useState(extra.payment_notes || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let birthday = '';
    if (birthdayDay && birthdayMonth && birthdayYear) {
      const parsed = new Date(Number(birthdayYear), Number(birthdayMonth) - 1, Number(birthdayDay));
      const isValidDate =
        parsed.getFullYear() === Number(birthdayYear) &&
        parsed.getMonth() === Number(birthdayMonth) - 1 &&
        parsed.getDate() === Number(birthdayDay);

      if (isValidDate) {
        birthday = `${birthdayYear}-${birthdayMonth}-${birthdayDay}`;
      }
    }

    await onSubmit({
      name, phone, cpf, email, birthday,
      address_street: addressStreet, address_number: addressNumber,
      address_neighborhood: addressNeighborhood, address_city: addressCity,
      address_zip: addressZip, address_state: addressState,
      username, password, plan_id: planId, payment_notes: paymentNotes,
    });
  };


  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <BronzeCard className="w-full max-w-lg bg-card border-primary/30 rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h3 className="text-xl font-black uppercase">
            {editingAdmin ? `Editar: ${editingAdmin.name}` : 'Novo Usuário'}
          </h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info */}
          <p className="text-xs font-black uppercase text-primary tracking-widest">Dados Pessoais</p>

          <Field label="Nome Completo *">
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-bronze" required />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Data de Nascimento">
              <div className="grid grid-cols-3 gap-2">
                <select value={birthdayDay} onChange={e => setBirthdayDay(e.target.value)} className="input-bronze">
                  <option value="">Dia</option>
                  {dayOptions.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
                <select value={birthdayMonth} onChange={e => setBirthdayMonth(e.target.value)} className="input-bronze">
                  <option value="">Mês</option>
                  {monthOptions.map(month => <option key={month} value={month}>{month}</option>)}
                </select>
                <select value={birthdayYear} onChange={e => setBirthdayYear(e.target.value)} className="input-bronze">
                  <option value="">Ano</option>
                  {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </Field>
            <Field label="CPF / ID">
              <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} className="input-bronze" placeholder="000.000.000-00" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Telefone">
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="input-bronze" placeholder="(11) 99999-9999" />
            </Field>
            <Field label="E-mail">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-bronze" placeholder="email@exemplo.com" />
            </Field>
          </div>

          {/* Address */}
          <p className="text-xs font-black uppercase text-primary tracking-widest pt-2">Endereço</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Field label="Rua">
                <input type="text" value={addressStreet} onChange={e => setAddressStreet(e.target.value)} className="input-bronze" />
              </Field>
            </div>
            <Field label="Número">
              <input type="text" value={addressNumber} onChange={e => setAddressNumber(e.target.value)} className="input-bronze" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Bairro">
              <input type="text" value={addressNeighborhood} onChange={e => setAddressNeighborhood(e.target.value)} className="input-bronze" />
            </Field>
            <Field label="Cidade">
              <input type="text" value={addressCity} onChange={e => setAddressCity(e.target.value)} className="input-bronze" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="CEP">
              <input type="text" value={addressZip} onChange={e => setAddressZip(e.target.value)} className="input-bronze" placeholder="00000-000" />
            </Field>
            <Field label="Estado">
              <select value={addressState} onChange={e => setAddressState(e.target.value)} className="input-bronze">
                <option value="">Selecione</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* Access */}
          <p className="text-xs font-black uppercase text-primary tracking-widest pt-2">Acesso</p>

          <Field label="Nome de Usuário (login)">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="input-bronze" placeholder="nome.usuario" />
          </Field>

          <Field label={editingAdmin ? 'Nova Senha (deixe vazio para manter)' : 'Senha *'}>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-bronze pr-12"
                placeholder="••••••••"
                required={!editingAdmin}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          {/* Plan & Billing */}
          <p className="text-xs font-black uppercase text-primary tracking-widest pt-2">Plano & Cobrança</p>

          <Field label="Plano">
            <select value={planId} onChange={e => setPlanId(e.target.value)} className="input-bronze">
              <option value="">Sem plano</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>
              ))}
            </select>
          </Field>

          <Field label="Observações de Cobrança">
            <textarea value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} className="input-bronze min-h-[80px]" placeholder="Pix, cartão de crédito, etc." />
          </Field>

          <BronzeButton type="submit" variant="gold" icon={CheckCircle2} className="w-full h-[60px]" disabled={isLoading}>
            {editingAdmin ? 'Salvar Alterações' : 'Adicionar Usuário'}
          </BronzeButton>
        </form>
      </BronzeCard>
    </div>
  );
}
