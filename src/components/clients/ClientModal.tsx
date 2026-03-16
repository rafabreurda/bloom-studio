import { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, FileText, Plus, Calendar, ChevronRight, Check, XIcon, Camera, AlertTriangle, Handshake, Navigation, Map } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Client, AnamnesisRecord, ClientTag, Partnership } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnamnesisFormModal } from './AnamnesisFormModal';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientModalProps {
  client: Client | null;
  tags: ClientTag[];
  partnerships?: Partnership[];
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'createdAt' | 'history'>) => void;
}

export function ClientModal({ client, tags, partnerships = [], onClose, onSave }: ClientModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressType, setAddressType] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [cpf, setCpf] = useState('');
  const [notes, setNotes] = useState('');
  const [isVIP, setIsVIP] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [partnershipId, setPartnershipId] = useState<string>('');
  const [anamnesisHistory, setAnamnesisHistory] = useState<AnamnesisRecord[]>([]);
  const [showAnamnesisForm, setShowAnamnesisForm] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
      setEmail(client.email || '');
      setAddress(client.address || '');
      setAddressStreet(client.addressStreet || '');
      setAddressNumber(client.addressNumber || '');
      setAddressType(client.addressType || '');
      setAddressNeighborhood(client.addressNeighborhood || '');
      setAddressCity(client.addressCity || '');
      setAddressState(client.addressState || '');
      setAddressZip(client.addressZip || '');
      setBirthday(client.birthday || '');
      setCpf(client.cpf || '');
      setNotes(client.notes || '');
      setIsVIP(client.isVIP);
      setSelectedTags(client.tags || []);
      setPartnershipId(client.partnershipId || '');
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
      addressStreet: addressStreet || undefined,
      addressNumber: addressNumber || undefined,
      addressType: addressType || undefined,
      addressNeighborhood: addressNeighborhood || undefined,
      addressCity: addressCity || undefined,
      addressState: addressState || undefined,
      addressZip: addressZip || undefined,
      birthday: birthday || undefined,
      cpf: cpf || undefined,
      notes: notes || undefined,
      isVIP,
      tags: selectedTags,
      partnershipId: partnershipId || undefined,
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

  // Helper to render boolean indicator
  const BoolIndicator = ({ value, warning = false }: { value: boolean | null; warning?: boolean }) => {
    if (value === null) return <span className="text-muted-foreground">-</span>;
    if (value) {
      return warning ? (
        <span className="text-amber-500 flex items-center gap-1">
          <AlertTriangle size={12} /> Sim
        </span>
      ) : (
        <span className="text-emerald-500 flex items-center gap-1">
          <Check size={12} /> Sim
        </span>
      );
    }
    return (
      <span className="text-emerald-500 flex items-center gap-1">
        <Check size={12} /> Não
      </span>
    );
  };

  const skinTextureLabels: Record<string, string> = {
    normal: 'Normal',
    seca: 'Seca',
    oleosa: 'Oleosa',
    mista: 'Mista',
  };

  const phototypeLabels: Record<string, string> = {
    I: 'I - Muito Clara',
    II: 'II - Clara',
    III: 'III - Morena Clara',
    IV: 'IV - Morena',
    V: 'V - Morena Escura',
    VI: 'VI - Negra',
  };

  const waxingLabels: Record<string, string> = {
    mais_24h: 'Mais de 24h',
    menos_24h: 'Menos de 24h',
    nao: 'Não',
  };

  const getRecordSummary = (record: AnamnesisRecord) => {
    const parts = [];
    if (record.phototype) parts.push(`Fototipo ${record.phototype}`);
    if (record.skinTexture) parts.push(skinTextureLabels[record.skinTexture]);
    // Legacy support
    if (!record.phototype && record.skinType) parts.push(record.skinType);
    return parts.length > 0 ? parts.join(' • ') : 'Ficha de anamnese';
  };

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
                  Rua
                </label>
                <input
                  type="text"
                  value={addressStreet}
                  onChange={(e) => setAddressStreet(e.target.value)}
                  className="input-bronze"
                  placeholder="Nome da rua, número"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={addressNeighborhood}
                    onChange={(e) => setAddressNeighborhood(e.target.value)}
                    className="input-bronze"
                    placeholder="Bairro"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    className="input-bronze"
                    placeholder="Cidade"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={addressZip}
                    onChange={(e) => setAddressZip(e.target.value)}
                    className="input-bronze"
                    placeholder="00000-000"
                  />
                </div>
              </div>

              {(addressStreet || addressCity) && (
                <div className="flex gap-2">
                  <a
                    href={`https://waze.com/ul?q=${encodeURIComponent([addressStreet, addressNeighborhood, addressCity].filter(Boolean).join(', '))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#33ccff]/10 text-[#00a3cc] text-xs font-bold hover:bg-[#33ccff]/20 transition-colors"
                  >
                    <Navigation size={13} />
                    Waze
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent([addressStreet, addressNeighborhood, addressCity].filter(Boolean).join(', '))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                  >
                    <Map size={13} />
                    Google Maps
                  </a>
                </div>
              )}

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

              {/* Partnership Link */}
              {partnerships.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <Handshake size={12} className="text-violet-500" />
                    Vincular a Parceria
                  </label>
                  <Select value={partnershipId || "none"} onValueChange={(v) => setPartnershipId(v === "none" ? "" : v)}>
                    <SelectTrigger className="input-bronze">
                      <SelectValue placeholder="Selecione uma parceria (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {partnerships.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          <span className="flex items-center gap-2">
                            <Handshake size={12} className="text-violet-500" />
                            {p.name} ({p.discount}% desc.)
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {partnershipId && (
                    <p className="text-[10px] text-violet-500 font-bold">
                      ✓ Este cliente será automaticamente vinculado à parceria nos agendamentos
                    </p>
                  )}
                </div>
              )}

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
                              {getRecordSummary(record)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {record.photoAuthorization && (
                            <Camera size={14} className="text-primary" />
                          )}
                          <ChevronRight
                            size={20}
                            className={`text-muted-foreground transition-transform ${
                              expandedRecordId === record.id ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {expandedRecordId === record.id && (
                        <div className="px-4 pb-4 pt-0 border-t border-border mt-0">
                          <div className="space-y-4 pt-4">
                            {/* Tipo de Pele */}
                            <div className="space-y-2">
                              <h5 className="text-[10px] font-black uppercase text-primary tracking-widest">
                                Tipo de Pele
                              </h5>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                {record.skinTexture && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Textura</p>
                                    <p className="text-foreground">{skinTextureLabels[record.skinTexture]}</p>
                                  </div>
                                )}
                                {record.phototype && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Fototipo</p>
                                    <p className="text-foreground">{phototypeLabels[record.phototype]}</p>
                                  </div>
                                )}
                                {record.tansSunExposure !== null && record.tansSunExposure !== undefined && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Bronzeia ao Sol</p>
                                    <p className="text-foreground"><BoolIndicator value={record.tansSunExposure} /></p>
                                  </div>
                                )}
                                {/* Legacy support */}
                                {record.skinType && !record.phototype && (
                                  <div className="col-span-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Tipo de Pele</p>
                                    <p className="text-foreground">{record.skinType}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Histórico */}
                            {(record.previousTanning !== null || record.exfoliation !== null || record.waxing) && (
                              <div className="space-y-2">
                                <h5 className="text-[10px] font-black uppercase text-primary tracking-widest">
                                  Histórico de Bronzeamento
                                </h5>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  {record.previousTanning !== null && record.previousTanning !== undefined && (
                                    <div>
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Bronze Anterior</p>
                                      <p className="text-foreground"><BoolIndicator value={record.previousTanning} /></p>
                                    </div>
                                  )}
                                  {record.exfoliation !== null && record.exfoliation !== undefined && (
                                    <div>
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Esfoliação</p>
                                      <p className="text-foreground"><BoolIndicator value={record.exfoliation} /></p>
                                    </div>
                                  )}
                                  {record.waxing && (
                                    <div>
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Depilação</p>
                                      <p className={`text-foreground ${record.waxing === 'menos_24h' ? 'text-amber-500' : ''}`}>
                                        {waxingLabels[record.waxing]}
                                        {record.waxing === 'menos_24h' && <AlertTriangle size={12} className="inline ml-1" />}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Condições de Saúde */}
                            <div className="space-y-2">
                              <h5 className="text-[10px] font-black uppercase text-primary tracking-widest">
                                Condições de Saúde
                              </h5>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                {record.skinTreatment !== null && record.skinTreatment !== undefined && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Tratamento de Pele</p>
                                    <p className="text-foreground">
                                      <BoolIndicator value={record.skinTreatment} warning />
                                      {record.skinTreatmentDetails && (
                                        <span className="text-xs text-muted-foreground ml-1">({record.skinTreatmentDetails})</span>
                                      )}
                                    </p>
                                  </div>
                                )}
                                {record.skinAllergies !== null && record.skinAllergies !== undefined && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Alergias</p>
                                    <p className="text-foreground">
                                      <BoolIndicator value={record.skinAllergies} warning />
                                      {record.skinAllergiesDetails && (
                                        <span className="text-xs text-muted-foreground ml-1">({record.skinAllergiesDetails})</span>
                                      )}
                                    </p>
                                  </div>
                                )}
                                {/* Legacy allergies */}
                                {record.allergies && !record.skinAllergies && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Alergias</p>
                                    <p className="text-foreground">{record.allergies}</p>
                                  </div>
                                )}
                                {record.openWounds !== null && record.openWounds !== undefined && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Ferimentos/Tatuagem</p>
                                    <p className="text-foreground"><BoolIndicator value={record.openWounds} warning /></p>
                                  </div>
                                )}
                                {record.bruises !== null && record.bruises !== undefined && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Hematomas</p>
                                    <p className="text-foreground"><BoolIndicator value={record.bruises} warning /></p>
                                  </div>
                                )}
                                {record.medications !== null && record.medications !== undefined && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Medicamentos</p>
                                    <p className="text-foreground">
                                      <BoolIndicator value={record.medications} warning />
                                      {record.medicationsDetails && (
                                        <span className="text-xs text-muted-foreground ml-1">({record.medicationsDetails})</span>
                                      )}
                                    </p>
                                  </div>
                                )}
                                {record.heavySweating !== null && record.heavySweating !== undefined && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Transpiração Forte</p>
                                    <p className="text-foreground"><BoolIndicator value={record.heavySweating} /></p>
                                  </div>
                                )}
                                {record.pregnancy !== null && record.pregnancy !== undefined && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Gravidez</p>
                                    <p className="text-foreground"><BoolIndicator value={record.pregnancy} warning /></p>
                                  </div>
                                )}
                                {record.skinDiseases !== null && record.skinDiseases !== undefined && (
                                  <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Vitiligo/Psoríase/Melasma</p>
                                    <p className="text-foreground">
                                      <BoolIndicator value={record.skinDiseases} warning />
                                      {record.skinDiseasesDetails && (
                                        <span className="text-xs text-muted-foreground ml-1">({record.skinDiseasesDetails})</span>
                                      )}
                                    </p>
                                  </div>
                                )}
                                {/* Legacy health conditions */}
                                {record.healthConditions && (
                                  <div className="col-span-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Condições de Saúde</p>
                                    <p className="text-foreground">{record.healthConditions}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Autorizações */}
                            <div className="space-y-2">
                              <h5 className="text-[10px] font-black uppercase text-primary tracking-widest">
                                Autorizações
                              </h5>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Orientações</p>
                                  <p className="text-foreground">
                                    <BoolIndicator value={record.orientationsAccepted} />
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                    <Camera size={10} /> Uso de Imagem
                                  </p>
                                  <p className="text-foreground">
                                    <BoolIndicator value={record.photoAuthorization} />
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Outros */}
                            {(record.howDiscovered || record.observations || record.createdBy || record.lastTanning) && (
                              <div className="space-y-2">
                                <h5 className="text-[10px] font-black uppercase text-primary tracking-widest">
                                  Outros
                                </h5>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  {record.howDiscovered && (
                                    <div>
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Como Descobriu</p>
                                      <p className="text-foreground">{record.howDiscovered}</p>
                                    </div>
                                  )}
                                  {record.createdBy && (
                                    <div>
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Criado por</p>
                                      <p className="text-foreground">{record.createdBy}</p>
                                    </div>
                                  )}
                                  {record.lastTanning && (
                                    <div>
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Último Bronze</p>
                                      <p className="text-foreground">{new Date(record.lastTanning).toLocaleDateString('pt-BR')}</p>
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
