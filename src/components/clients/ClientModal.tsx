import { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, FileText, Plus, Calendar, ChevronRight } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Client, AnamnesisRecord, ClientTag } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnamnesisFormModal } from './AnamnesisFormModal';
import { Badge } from '@/components/ui/badge';

interface ClientModalProps {
  client: Client | null;
  tags: ClientTag[];
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'createdAt' | 'history'>) => void;
}

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
  const [anamnesisHistory, setAnamnesisHistory] = useState<AnamnesisRecord[]>([]);
  const [showAnamnesisForm, setShowAnamnesisForm] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

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
      setAnamnesisHistory(client.anamnesisHistory || []);
      // Auto-expand the most recent record
      if (client.anamnesisHistory && client.anamnesisHistory.length > 0) {
        setExpandedRecordId(client.anamnesisHistory[0].id);
      }
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
      anamnesisHistory: anamnesisHistory.length > 0 ? anamnesisHistory : undefined,
    });
    onClose();
  };

  const handleAddAnamnesis = (recordData: Omit<AnamnesisRecord, 'id' | 'date'>) => {
    const newRecord: AnamnesisRecord = {
      ...recordData,
      id: `a${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      createdBy: 'Admin', // In a real app, this would be the current user
    };
    setAnamnesisHistory([newRecord, ...anamnesisHistory]);
    setExpandedRecordId(newRecord.id);
    setShowAnamnesisForm(false);
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
  const latestRecord = anamnesisHistory.length > 0 ? anamnesisHistory[0] : undefined;

  return (
    <>
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
              <TabsTrigger value="anamnese" className="flex items-center gap-2">
                Anamnese
                {anamnesisHistory.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                    {anamnesisHistory.length}
                  </Badge>
                )}
              </TabsTrigger>
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
              {/* Header with add button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  <span className="text-sm font-bold">Histórico de Anamnese</span>
                  {anamnesisHistory.length > 0 && (
                    <Badge variant="outline" className="text-[10px]">
                      {anamnesisHistory.length} ficha{anamnesisHistory.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <BronzeButton
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={() => setShowAnamnesisForm(true)}
                >
                  Nova Ficha
                </BronzeButton>
              </div>

              {anamnesisHistory.length === 0 ? (
                <div className="p-8 text-center bg-secondary/30 rounded-xl border border-dashed border-border">
                  <FileText size={40} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Nenhuma ficha de anamnese cadastrada
                  </p>
                  <BronzeButton
                    type="button"
                    variant="gold"
                    size="sm"
                    icon={Plus}
                    onClick={() => setShowAnamnesisForm(true)}
                  >
                    Criar Primeira Ficha
                  </BronzeButton>
                </div>
              ) : (
                <div className="space-y-3">
                  {anamnesisHistory.map((record, index) => (
                    <div
                      key={record.id}
                      className={`rounded-xl border transition-all ${
                        expandedRecordId === record.id
                          ? 'bg-secondary/50 border-primary/30'
                          : 'bg-secondary/20 border-border hover:bg-secondary/30'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedRecordId(
                          expandedRecordId === record.id ? null : record.id
                        )}
                        className="w-full flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar size={18} className="text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold flex items-center gap-2">
                              {new Date(record.date).toLocaleDateString('pt-BR')}
                              {index === 0 && (
                                <Badge className="bg-primary/20 text-primary text-[10px] font-bold">
                                  Mais recente
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {record.skinType || 'Tipo de pele não informado'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          size={20}
                          className={`text-muted-foreground transition-transform ${
                            expandedRecordId === record.id ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {expandedRecordId === record.id && (
                        <div className="px-4 pb-4 pt-0 border-t border-border mt-0">
                          <div className="grid grid-cols-2 gap-3 text-sm pt-4">
                            {record.skinType && (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Tipo de Pele</p>
                                <p className="text-foreground">{record.skinType}</p>
                              </div>
                            )}
                            {record.allergies && (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Alergias</p>
                                <p className="text-foreground">{record.allergies}</p>
                              </div>
                            )}
                            {record.medications && (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Medicamentos</p>
                                <p className="text-foreground">{record.medications}</p>
                              </div>
                            )}
                            {record.healthConditions && (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Condições de Saúde</p>
                                <p className="text-foreground">{record.healthConditions}</p>
                              </div>
                            )}
                            {record.lastTanning && (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Último Bronze</p>
                                <p className="text-foreground">{new Date(record.lastTanning).toLocaleDateString('pt-BR')}</p>
                              </div>
                            )}
                            {record.createdBy && (
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Criado por</p>
                                <p className="text-foreground">{record.createdBy}</p>
                              </div>
                            )}
                            {record.observations && (
                              <div className="col-span-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Observações</p>
                                <p className="text-foreground">{record.observations}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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

      {showAnamnesisForm && (
        <AnamnesisFormModal
          existingRecord={latestRecord}
          onClose={() => setShowAnamnesisForm(false)}
          onSave={handleAddAnamnesis}
        />
      )}
    </>
  );
}
