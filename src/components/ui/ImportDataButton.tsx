import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import * as XLSX from 'xlsx';

interface ColumnMapping {
  /** Column name candidates to search in headers (case-insensitive partial match) */
  candidates: string[];
  /** Target database column name */
  dbColumn: string;
  /** Whether to require this field (rows without it get a fallback) */
  fallback?: string;
  /** Transform function */
  transform?: (val: string | number | undefined) => any;
}

interface ImportDataButtonProps {
  /** Supabase table name */
  table: string;
  /** Label for the button context */
  label: string;
  /** Column mappings */
  columns: ColumnMapping[];
  /** Extra default fields to add to every row */
  defaults?: Record<string, any>;
  /** Callback after import completes */
  onImportComplete: () => void;
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
  // yyyy-mm-dd already
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return null;
}

function parseNumber(val: string | number | undefined): number {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  return parseFloat(String(val).replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
}

function findColumn(headers: string[], ...candidates: string[]): string | null {
  for (const c of candidates) {
    const found = headers.find(h => h.toLowerCase().includes(c.toLowerCase()));
    if (found) return found;
  }
  return null;
}

// Export transforms for use in column mappings
export const transforms = {
  phone: normalizePhone,
  date: normalizeDate,
  number: parseNumber,
  string: (val: string | number | undefined) => val ? String(val).trim() : '',
};

export function ImportDataButton({ table, label, columns, defaults, onImportComplete }: ImportDataButtonProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<{ total: number; data: Record<string, any>[]; headers: string[] } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buf = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '' });
        if (data.length === 0) { toast.error('Planilha vazia'); return; }
        setPreview({ total: data.length, data, headers: Object.keys(data[0]) });
      } catch {
        toast.error('Erro ao ler arquivo');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const doImport = async () => {
    if (!preview) return;
    setImporting(true);

    try {
      const headers = preview.headers;

      // Build column map
      const colMap: Record<string, string | null> = {};
      for (const col of columns) {
        colMap[col.dbColumn] = findColumn(headers, ...col.candidates);
      }

      const toInsert: Record<string, any>[] = [];

      for (const row of preview.data) {
        const record: Record<string, any> = { ...(defaults || {}) };

        for (const col of columns) {
          const headerKey = colMap[col.dbColumn];
          let value = headerKey ? row[headerKey] : undefined;

          if (col.transform) {
            value = col.transform(value);
          } else {
            value = value ? String(value).trim() : undefined;
          }

          // Use fallback if no value
          if ((value === undefined || value === null || value === '') && col.fallback !== undefined) {
            value = col.fallback;
          }

          if (value !== undefined && value !== null && value !== '') {
            record[col.dbColumn] = value;
          }
        }

        toInsert.push(record);
      }

      // Batch insert
      let inserted = 0;
      const chunkSize = 200;
      for (let i = 0; i < toInsert.length; i += chunkSize) {
        const chunk = toInsert.slice(i, i + chunkSize);
        const { error } = await (supabase.from(table as any) as any).insert(chunk);
        if (error) {
          console.error(`Erro no lote ${Math.floor(i / chunkSize) + 1}:`, error);
          toast.error(`Erro no lote ${Math.floor(i / chunkSize) + 1}: ${error.message}`);
        } else {
          inserted += chunk.length;
        }
      }

      toast.success(`${inserted} registros importados com sucesso!`);
      setPreview(null);
      onImportComplete();
    } catch (err) {
      console.error(err);
      toast.error('Erro na importação');
    } finally {
      setImporting(false);
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
              <h3 className="font-black text-lg">Importar {label}</h3>
            </div>

            <div className="bg-secondary rounded-xl p-4 space-y-2">
              <p className="text-sm"><strong>{preview.total}</strong> registros encontrados</p>
              <p className="text-xs text-muted-foreground">
                Colunas detectadas: {preview.headers.join(', ')}
              </p>
              <p className="text-xs text-muted-foreground">
                Todos os registros serão importados sem restrições.
              </p>
            </div>

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
