import { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, FileText } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Client, AnamnesisForm, ClientTag } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClientModalProps {
  client: Client | null;
  tags: ClientTag[];
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'createdAt' | 'history'>) => void;
}

const defaultAnamnesis: AnamnesisForm = {
  skinType: '',
  allergies: '',
  medications: '',
  healthConditions: '',
  lastTanning: '',
  observations: '',
};

export function ClientModal({ client, tags, onClose, onSave }: ClientModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [cpf, setCpf] = useState('');
  const [notes, setNotes] = useState('');
  const [isVIP, setIsVIP] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [anamnesis, setAnamnesis] = useState<AnamnesisForm>(defaultAnamnesis);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
      setEmail(client.email || '');
      setAddress(client.address || '');
      setBirthday(client.birthday || '');
      setCpf(client.cpf || '');
      setNotes(client.notes || '');
      setIsVIP(client.isVIP);
      setSelectedTags(client.tags || []);
      setAnamnesis(client.anamnesis || defaultAnamnesis);
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      phone,
      email: email || undefined,
      address: address || undefined,
      birthday: birthday || undefined,
      cpf: cpf || undefined,
      notes: notes || undefined,
      isVIP,
      tags: selectedTags,
      anamnesis: anamnesis.skinType ? anamnesis : undefined,
    });
    onClose();
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const activeTags = tags.filter(t => t.isActive);

  return (
    <BronzeCard className="w-full max-w-2xl bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
        <h3 className="text-xl font-black uppercase">
          {client ? 'Editar Cliente' : 'Novo Cliente'}
        </h3>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="anamnese">Ficha de Anamnese</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Nome *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-bronze"
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  WhatsApp *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="input-bronze"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  className="input-bronze"
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="input-bronze"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-bronze"
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Endereço
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-bronze"
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {activeTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedTags.includes(tag.id)
                        ? 'text-white'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                    style={{
                      backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined,
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Observações
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-bronze min-h-[80px] resize-none"
                placeholder="Anotações sobre o cliente..."
              />
            </div>

            <label className="flex items-center gap-3 p-4 bg-secondary rounded-2xl border border-border cursor-pointer hover:bg-secondary/80 transition-all">
              <input
                type="checkbox"
                className="hidden"
                checked={isVIP}
                onChange={(e) => setIsVIP(e.target.checked)}
              />
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isVIP ? 'bg-primary border-primary shadow-xl' : 'border-muted-foreground'}`}>
                <Star size={16} fill={isVIP ? 'black' : 'transparent'} className={isVIP ? 'text-primary-foreground' : 'text-muted-foreground'} />
              </div>
              <span className={`text-sm font-black uppercase ${isVIP ? 'text-primary' : 'text-muted-foreground'}`}>
                Cliente VIP
              </span>
            </label>
          </TabsContent>

          <TabsContent value="anamnese" className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-4">
              <div className="flex items-start gap-2">
                <FileText size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-600 font-bold">
                  A ficha de anamnese é importante para conhecer o histórico de saúde do cliente e garantir um atendimento seguro.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Tipo de Pele
              </label>
              <select
                value={anamnesis.skinType}
                onChange={(e) => setAnamnesis({ ...anamnesis, skinType: e.target.value })}
                className="input-bronze"
              >
                <option value="">Selecione...</option>
                <option value="Tipo I - Muito Clara">Tipo I - Muito Clara (sempre queima, nunca bronzeia)</option>
                <option value="Tipo II - Clara">Tipo II - Clara (queima fácil, bronzeia pouco)</option>
                <option value="Tipo III - Morena Clara">Tipo III - Morena Clara (queima moderado, bronzeia gradual)</option>
                <option value="Tipo IV - Morena">Tipo IV - Morena (queima pouco, bronzeia fácil)</option>
                <option value="Tipo V - Morena Escura">Tipo V - Morena Escura (raramente queima, bronzeia muito)</option>
                <option value="Tipo VI - Negra">Tipo VI - Negra (nunca queima)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Alergias
              </label>
              <input
                type="text"
                value={anamnesis.allergies}
                onChange={(e) => setAnamnesis({ ...anamnesis, allergies: e.target.value })}
                className="input-bronze"
                placeholder="Descreva alergias conhecidas ou 'Nenhuma'"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Medicamentos em Uso
              </label>
              <input
                type="text"
                value={anamnesis.medications}
                onChange={(e) => setAnamnesis({ ...anamnesis, medications: e.target.value })}
                className="input-bronze"
                placeholder="Medicamentos atuais ou 'Nenhum'"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Condições de Saúde
              </label>
              <input
                type="text"
                value={anamnesis.healthConditions}
                onChange={(e) => setAnamnesis({ ...anamnesis, healthConditions: e.target.value })}
                className="input-bronze"
                placeholder="Diabetes, hipertensão, gravidez, etc. ou 'Nenhuma'"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Última Sessão de Bronze
              </label>
              <input
                type="date"
                value={anamnesis.lastTanning}
                onChange={(e) => setAnamnesis({ ...anamnesis, lastTanning: e.target.value })}
                className="input-bronze"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Observações Adicionais
              </label>
              <textarea
                value={anamnesis.observations}
                onChange={(e) => setAnamnesis({ ...anamnesis, observations: e.target.value })}
                className="input-bronze min-h-[80px] resize-none"
                placeholder="Informações importantes sobre o cliente..."
              />
            </div>
          </TabsContent>
        </Tabs>

        <BronzeButton
          type="submit"
          variant="gold"
          icon={CheckCircle2}
          className="w-full h-[60px] mt-6"
        >
          {client ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </BronzeButton>
      </form>
    </BronzeCard>
  );
}
