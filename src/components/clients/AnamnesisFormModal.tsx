import { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { AnamnesisRecord } from '@/types';

interface AnamnesisFormModalProps {
  existingRecord?: AnamnesisRecord;
  onClose: () => void;
  onSave: (record: Omit<AnamnesisRecord, 'id' | 'date'>) => void;
}

export function AnamnesisFormModal({ existingRecord, onClose, onSave }: AnamnesisFormModalProps) {
  const [skinType, setSkinType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [lastTanning, setLastTanning] = useState('');
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (existingRecord) {
      setSkinType(existingRecord.skinType || '');
      setAllergies(existingRecord.allergies || '');
      setMedications(existingRecord.medications || '');
      setHealthConditions(existingRecord.healthConditions || '');
      setLastTanning(existingRecord.lastTanning || '');
      setObservations(existingRecord.observations || '');
    }
  }, [existingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      skinType,
      allergies,
      medications,
      healthConditions,
      lastTanning: lastTanning || undefined,
      observations,
    });
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Tipo de Pele
            </label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
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
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
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
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
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
              value={healthConditions}
              onChange={(e) => setHealthConditions(e.target.value)}
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
              value={lastTanning}
              onChange={(e) => setLastTanning(e.target.value)}
              className="input-bronze"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Observações Adicionais
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="input-bronze min-h-[80px] resize-none"
              placeholder="Informações importantes sobre o cliente..."
            />
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
