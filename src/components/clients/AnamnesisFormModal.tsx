import { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, Check, Camera } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { AnamnesisRecord } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

interface AnamnesisFormModalProps {
  existingRecord?: AnamnesisRecord;
  onClose: () => void;
  onSave: (record: Omit<AnamnesisRecord, 'id' | 'date'>) => void;
}

type BooleanField = boolean | null;

export function AnamnesisFormModal({ existingRecord, onClose, onSave }: AnamnesisFormModalProps) {
  // Tipo de Pele
  const [skinTexture, setSkinTexture] = useState<'normal' | 'seca' | 'oleosa' | 'mista' | ''>('');
  const [phototype, setPhototype] = useState<'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | ''>('');
  const [tansSunExposure, setTansSunExposure] = useState<BooleanField>(null);

  // Histórico de Bronzeamento
  const [previousTanning, setPreviousTanning] = useState<BooleanField>(null);
  const [exfoliation, setExfoliation] = useState<BooleanField>(null);
  const [waxing, setWaxing] = useState<'mais_24h' | 'menos_24h' | 'nao' | ''>('');

  // Condições de Saúde
  const [skinTreatment, setSkinTreatment] = useState<BooleanField>(null);
  const [skinTreatmentDetails, setSkinTreatmentDetails] = useState('');
  const [skinAllergies, setSkinAllergies] = useState<BooleanField>(null);
  const [skinAllergiesDetails, setSkinAllergiesDetails] = useState('');
  const [openWounds, setOpenWounds] = useState<BooleanField>(null);
  const [bruises, setBruises] = useState<BooleanField>(null);
  const [medications, setMedications] = useState<BooleanField>(null);
  const [medicationsDetails, setMedicationsDetails] = useState('');
  const [heavySweating, setHeavySweating] = useState<BooleanField>(null);
  const [pregnancy, setPregnancy] = useState<BooleanField>(null);
  const [skinDiseases, setSkinDiseases] = useState<BooleanField>(null);
  const [skinDiseasesDetails, setSkinDiseasesDetails] = useState('');

  // Autorizações
  const [orientationsAccepted, setOrientationsAccepted] = useState(false);
  const [photoAuthorization, setPhotoAuthorization] = useState(false);

  // Outros
  const [howDiscovered, setHowDiscovered] = useState('');
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (existingRecord) {
      setSkinTexture(existingRecord.skinTexture || '');
      setPhototype(existingRecord.phototype || '');
      setTansSunExposure(existingRecord.tansSunExposure ?? null);
      setPreviousTanning(existingRecord.previousTanning ?? null);
      setExfoliation(existingRecord.exfoliation ?? null);
      setWaxing(existingRecord.waxing || '');
      setSkinTreatment(existingRecord.skinTreatment ?? null);
      setSkinTreatmentDetails(existingRecord.skinTreatmentDetails || '');
      setSkinAllergies(existingRecord.skinAllergies ?? null);
      setSkinAllergiesDetails(existingRecord.skinAllergiesDetails || '');
      setOpenWounds(existingRecord.openWounds ?? null);
      setBruises(existingRecord.bruises ?? null);
      setMedications(existingRecord.medications ?? null);
      setMedicationsDetails(existingRecord.medicationsDetails || '');
      setHeavySweating(existingRecord.heavySweating ?? null);
      setPregnancy(existingRecord.pregnancy ?? null);
      setSkinDiseases(existingRecord.skinDiseases ?? null);
      setSkinDiseasesDetails(existingRecord.skinDiseasesDetails || '');
      setOrientationsAccepted(existingRecord.orientationsAccepted ?? false);
      setPhotoAuthorization(existingRecord.photoAuthorization ?? false);
      setHowDiscovered(existingRecord.howDiscovered || '');
      setObservations(existingRecord.observations || '');
    }
  }, [existingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      skinTexture,
      phototype,
      tansSunExposure,
      previousTanning,
      exfoliation,
      waxing,
      skinTreatment,
      skinTreatmentDetails: skinTreatment ? skinTreatmentDetails : undefined,
      skinAllergies,
      skinAllergiesDetails: skinAllergies ? skinAllergiesDetails : undefined,
      openWounds,
      bruises,
      medications,
      medicationsDetails: medications ? medicationsDetails : undefined,
      heavySweating,
      pregnancy,
      skinDiseases,
      skinDiseasesDetails: skinDiseases ? skinDiseasesDetails : undefined,
      orientationsAccepted,
      photoAuthorization,
      howDiscovered: howDiscovered || undefined,
      observations: observations || undefined,
    });
  };

  // Helper component for Yes/No toggle buttons
  const YesNoToggle = ({ 
    value, 
    onChange, 
    label,
    warning = false 
  }: { 
    value: BooleanField; 
    onChange: (v: boolean) => void; 
    label: string;
    warning?: boolean;
  }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
        {label}
        {warning && value === true && (
          <AlertTriangle size={12} className="text-amber-500" />
        )}
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
            value === true
              ? warning 
                ? 'bg-amber-500/20 border-amber-500 text-amber-600'
                : 'bg-primary/20 border-primary text-primary'
              : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
            value === false
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600'
              : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          Não
        </button>
      </div>
    </div>
  );

  const phototypeLabels: Record<string, string> = {
    'I': 'Muito Clara',
    'II': 'Clara',
    'III': 'Morena Clara',
    'IV': 'Morena',
    'V': 'Morena Escura',
    'VI': 'Negra',
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[110] flex items-end md:items-center justify-center">
      <BronzeCard className="w-full max-w-lg bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
          <h3 className="text-xl font-black uppercase flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            {existingRecord ? 'Nova Ficha (baseada na anterior)' : 'Nova Ficha de Anamnese'}
          </h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info banner */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-600 font-bold">
                {existingRecord 
                  ? 'Os dados da última ficha foram carregados. Atualize o que mudou.' 
                  : 'Preencha a ficha de anamnese para garantir um atendimento seguro.'
                }
              </p>
            </div>
          </div>

          {/* SEÇÃO 1: TIPO DE PELE */}
          <div className="space-y-4 p-4 bg-secondary/30 rounded-xl border border-border">
            <h4 className="text-xs font-black uppercase text-primary tracking-widest">
              Tipo de Pele
            </h4>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Textura da Pele
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['normal', 'seca', 'oleosa', 'mista'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSkinTexture(type)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border capitalize ${
                      skinTexture === type
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Fototipo (Escala Fitzpatrick)
              </label>
              <div className="grid grid-cols-6 gap-2">
                {(['I', 'II', 'III', 'IV', 'V', 'VI'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPhototype(type)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                      phototype === type
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {phototype && (
                <p className="text-xs text-muted-foreground">
                  Tipo {phototype}: {phototypeLabels[phototype]}
                </p>
              )}
            </div>

            <YesNoToggle
              label="Bronzeia ao sol?"
              value={tansSunExposure}
              onChange={setTansSunExposure}
            />
          </div>

          {/* SEÇÃO 2: HISTÓRICO DE BRONZEAMENTO */}
          <div className="space-y-4 p-4 bg-secondary/30 rounded-xl border border-border">
            <h4 className="text-xs font-black uppercase text-primary tracking-widest">
              Histórico de Bronzeamento
            </h4>

            <YesNoToggle
              label="Já fez esse tipo de bronze antes?"
              value={previousTanning}
              onChange={setPreviousTanning}
            />

            <YesNoToggle
              label="Fez esfoliação corporal?"
              value={exfoliation}
              onChange={setExfoliation}
            />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Fez depilação recentemente?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setWaxing('mais_24h')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    waxing === 'mais_24h'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600'
                      : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  +24h
                </button>
                <button
                  type="button"
                  onClick={() => setWaxing('menos_24h')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    waxing === 'menos_24h'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-600'
                      : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  -24h
                </button>
                <button
                  type="button"
                  onClick={() => setWaxing('nao')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    waxing === 'nao'
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  Não
                </button>
              </div>
              {waxing === 'menos_24h' && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Atenção: depilação recente pode causar irritação
                </p>
              )}
            </div>
          </div>

          {/* SEÇÃO 3: CONDIÇÕES DE SAÚDE */}
          <div className="space-y-4 p-4 bg-secondary/30 rounded-xl border border-border">
            <h4 className="text-xs font-black uppercase text-primary tracking-widest">
              Condições de Saúde
            </h4>

            <div className="space-y-3">
              <YesNoToggle
                label="Está fazendo tratamento de pele?"
                value={skinTreatment}
                onChange={setSkinTreatment}
                warning
              />
              {skinTreatment === true && (
                <input
                  type="text"
                  value={skinTreatmentDetails}
                  onChange={(e) => setSkinTreatmentDetails(e.target.value)}
                  className="input-bronze"
                  placeholder="Qual tratamento?"
                />
              )}
            </div>

            <div className="space-y-3">
              <YesNoToggle
                label="Tem alergia de pele?"
                value={skinAllergies}
                onChange={setSkinAllergies}
                warning
              />
              {skinAllergies === true && (
                <input
                  type="text"
                  value={skinAllergiesDetails}
                  onChange={(e) => setSkinAllergiesDetails(e.target.value)}
                  className="input-bronze"
                  placeholder="Quais alergias?"
                />
              )}
            </div>

            <YesNoToggle
              label="Tem ferimentos ou tatuagem não cicatrizada?"
              value={openWounds}
              onChange={setOpenWounds}
              warning
            />

            <YesNoToggle
              label="Possui hematomas?"
              value={bruises}
              onChange={setBruises}
              warning
            />

            <div className="space-y-3">
              <YesNoToggle
                label="Usa medicamento regular?"
                value={medications}
                onChange={setMedications}
                warning
              />
              {medications === true && (
                <input
                  type="text"
                  value={medicationsDetails}
                  onChange={(e) => setMedicationsDetails(e.target.value)}
                  className="input-bronze"
                  placeholder="Quais medicamentos?"
                />
              )}
            </div>

            <YesNoToggle
              label="Transpiração forte?"
              value={heavySweating}
              onChange={setHeavySweating}
            />

            <YesNoToggle
              label="Está grávida?"
              value={pregnancy}
              onChange={setPregnancy}
              warning
            />

            <div className="space-y-3">
              <YesNoToggle
                label="Vitiligo, Psoríase ou Melasma?"
                value={skinDiseases}
                onChange={setSkinDiseases}
                warning
              />
              {skinDiseases === true && (
                <input
                  type="text"
                  value={skinDiseasesDetails}
                  onChange={(e) => setSkinDiseasesDetails(e.target.value)}
                  className="input-bronze"
                  placeholder="Especifique..."
                />
              )}
            </div>
          </div>

          {/* SEÇÃO 4: AUTORIZAÇÕES */}
          <div className="space-y-4 p-4 bg-secondary/30 rounded-xl border border-border">
            <h4 className="text-xs font-black uppercase text-primary tracking-widest">
              Autorizações
            </h4>

            <label className="flex items-start gap-3 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80 transition-all">
              <Checkbox
                checked={orientationsAccepted}
                onCheckedChange={(checked) => setOrientationsAccepted(checked === true)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  Recebi as orientações
                  {orientationsAccepted && <Check size={14} className="text-emerald-500" />}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Declaro que recebi todas as orientações pré e pós procedimento de bronzeamento.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80 transition-all">
              <Checkbox
                checked={photoAuthorization}
                onCheckedChange={(checked) => setPhotoAuthorization(checked === true)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Camera size={14} />
                  Autorizo uso de imagem
                  {photoAuthorization && <Check size={14} className="text-emerald-500" />}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Autorizo a publicação de fotos para divulgação nas redes sociais.
                </p>
              </div>
            </label>
          </div>

          {/* SEÇÃO 5: INFORMAÇÕES ADICIONAIS */}
          <div className="space-y-4 p-4 bg-secondary/30 rounded-xl border border-border">
            <h4 className="text-xs font-black uppercase text-primary tracking-widest">
              Informações Adicionais
            </h4>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Como descobriu nosso serviço?
              </label>
              <input
                type="text"
                value={howDiscovered}
                onChange={(e) => setHowDiscovered(e.target.value)}
                className="input-bronze"
                placeholder="Instagram, indicação, Google..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Observações Gerais
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="input-bronze min-h-[80px] resize-none"
                placeholder="Informações importantes sobre o cliente..."
              />
            </div>
          </div>

          <BronzeButton
            type="submit"
            variant="gold"
            icon={CheckCircle2}
            className="w-full h-[60px] mt-6"
          >
            Salvar Ficha de Anamnese
          </BronzeButton>
        </form>
      </BronzeCard>
    </div>
  );
}
