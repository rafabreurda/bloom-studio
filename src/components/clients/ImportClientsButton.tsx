import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import * as XLSX from 'xlsx';

interface ImportClientsButtonProps {
  onImportComplete: () => void;
}

interface RawRow {
  [key: string]: string | number | undefined;
}

function normalizePhone(phone: string | number | undefined): string {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '');
}

function normalizeDate(val: string | number | undefined): string | null {
  if (!val) return null;
  const s = String(val).trim();
  const match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, d, m, y] = match;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  if (/^\d{4,5}$/.test(s)) {
    const date = new Date((Number(s) - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
  }
  return null;
}

function findColumn(headers: string[], ...candidates: string[]): string | null {
  for (const c of candidates) {
    const found = headers.find(h => h.toLowerCase().includes(c.toLowerCase()));
    if (found) return found;
  }
  return null;
}

export function ImportClientsButton({ onImportComplete }: ImportClientsButtonProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<{ total: number; data: RawRow[]; headers: string[] } | null>(null);
  const { currentAdmin } = useAuth();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data_buf = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data_buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<RawRow>(ws, { defval: '' });
        if (data.length === 0) { toast.error('Planilha vazia'); return; }
        setPreview({ total: data.length, data, headers: Object.keys(data[0]) });
      } catch (err) {
        console.error('Erro ao ler XLSX:', err);
        toast.error('Erro ao ler arquivo');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const doImport = async () => {
    if (!preview) return;
    setImporting(true);
    setProgress(0);

    try {
      const headers = preview.headers;
      const colName = findColumn(headers, 'nome', 'name', 'cliente');
      const colPhone = findColumn(headers, 'telefone', 'phone', 'celular', 'fone');
      const colEmail = findColumn(headers, 'email', 'e-mail');
      const colAddress = findColumn(headers, 'endereço', 'endereco', 'address');
      const colBirthday = findColumn(headers, 'nascimento', 'aniversário', 'birthday', 'data nasc');
      const colCpf = findColumn(headers, 'cpf');
      const colNotes = findColumn(headers, 'observação', 'observacao', 'referência', 'notes', 'obs');

      if (!colName) {
        toast.error('Coluna "Nome" não encontrada na planilha');
        setImporting(false);
        return;
      }

      const toInsert: any[] = [];

      for (const row of preview.data) {
        const name = String(row[colName] || '').trim() || 'Sem nome';
        const phone = colPhone ? normalizePhone(row[colPhone]) : '';

        toInsert.push({
          name,
          phone,
          email: colEmail ? String(row[colEmail] || '').trim() || undefined : undefined,
          address: colAddress ? String(row[colAddress] || '').trim() || undefined : undefined,
          birthday: colBirthday ? normalizeDate(row[colBirthday]) || undefined : undefined,
          cpf: colCpf ? String(row[colCpf] || '').trim() || undefined : undefined,
          notes: colNotes ? String(row[colNotes] || '').trim() || undefined : undefined,
          tags: [],
          is_vip: false,
          history: [] as Json,
          anamnesis_history: [] as Json,
          owner_id: currentAdmin?.id,
        });
      }

      let inserted = 0;
      const chunkSize = 200;
      for (let i = 0; i < toInsert.length; i += chunkSize) {
        const chunk = toInsert.slice(i, i + chunkSize);
        const { error } = await supabase.from('clients').insert(chunk);
        if (error) {
          console.error('Erro no batch:', error);
          toast.error(`Erro no lote ${Math.floor(i / chunkSize) + 1}: ${error.message}`);
        } else {
          inserted += chunk.length;
        }
        setProgress(Math.round((Math.min(i + chunkSize, toInsert.length) / toInsert.length) * 100));
        await new Promise(r => setTimeout(r, 50));
      }

      toast.success(`${inserted} clientes importados com sucesso!`);
      setPreview(null);
      onImportComplete();
    } catch (err) {
      console.error(err);
      toast.error('Erro na importação');
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  return (
    <>
      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
      <BronzeButton variant="outline" icon={Upload} size="sm" onClick={() => fileRef.current?.click()}>
        Importar
      </BronzeButton>

      {preview && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={24} className="text-primary" />
              <h3 className="font-black text-lg">Importar Clientes</h3>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 space-y-2">
              <p className="text-sm"><strong>{preview.total}</strong> registros encontrados</p>
              <p className="text-xs text-muted-foreground">
                Colunas detectadas: {preview.headers.join(', ')}
              </p>
            </div>

            {importing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <p className="text-xs text-center text-muted-foreground font-bold">{progress}% concluído</p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <BronzeButton variant="outline" size="sm" onClick={() => setPreview(null)} disabled={importing}>
                Cancelar
              </BronzeButton>
              <BronzeButton variant="gold" size="sm" onClick={doImport} disabled={importing} icon={importing ? Loader2 : Upload}>
                {importing ? 'Importando...' : 'Confirmar Importação'}
              </BronzeButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
