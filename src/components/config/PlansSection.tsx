import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle2, CreditCard } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean;
}

export function PlansSection() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const fetchPlans = useCallback(async () => {
    const { data } = await supabase.from('plans').select('*').order('created_at');
    if (data) setPlans(data as Plan[]);
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setPrice('');
    setShowModal(true);
  };

  const openEdit = (plan: Plan) => {
    setEditing(plan);
    setName(plan.name);
    setDescription(plan.description || '');
    setPrice(plan.price.toString());
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price) || 0;

    if (editing) {
      await supabase.from('plans').update({ name, description: description || null, price: priceNum }).eq('id', editing.id);
      toast.success('Plano atualizado!');
    } else {
      await supabase.from('plans').insert({ name, description: description || null, price: priceNum });
      toast.success('Plano criado!');
    }
    setShowModal(false);
    fetchPlans();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('plans').delete().eq('id', id);
    toast.success('Plano removido!');
    fetchPlans();
  };

  const toggleActive = async (plan: Plan) => {
    await supabase.from('plans').update({ is_active: !plan.is_active }).eq('id', plan.id);
    fetchPlans();
  };

  return (
    <div className="space-y-6">
      <BronzeCard className="bg-secondary/50 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            <h3 className="text-lg font-black uppercase text-primary">Planos</h3>
          </div>
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={openAdd}>
            Novo Plano
          </BronzeButton>
        </div>

        <p className="text-xs text-muted-foreground">
          Configure os planos de assinatura disponíveis para seus clientes.
        </p>

        <div className="space-y-3">
          {plans.map(plan => (
            <div key={plan.id} className={`p-4 rounded-2xl border transition-all ${plan.is_active ? 'bg-card border-border' : 'bg-muted/30 border-muted opacity-60'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{plan.name}</p>
                  {plan.description && <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>}
                  <p className="text-sm font-black text-primary mt-1">R$ {plan.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(plan)} className={`text-xs px-3 py-1 rounded-full font-bold ${plan.is_active ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                    {plan.is_active ? 'Ativo' : 'Inativo'}
                  </button>
                  <button onClick={() => openEdit(plan)} className="p-2 text-muted-foreground hover:text-primary">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="p-2 text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">Nenhum plano cadastrado</p>
          )}
        </div>
      </BronzeCard>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <BronzeCard className="w-full max-w-md bg-card border-primary/30 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h3 className="text-xl font-black uppercase">{editing ? 'Editar Plano' : 'Novo Plano'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nome *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-bronze" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Descrição</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-bronze min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Valor (R$) *</label>
                <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="input-bronze" required />
              </div>
              <BronzeButton type="submit" variant="gold" icon={CheckCircle2} className="w-full h-[56px]">
                {editing ? 'Salvar' : 'Criar Plano'}
              </BronzeButton>
            </form>
          </BronzeCard>
        </div>
      )}
    </div>
  );
}
