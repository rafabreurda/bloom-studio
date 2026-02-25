import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';
import { ExportFormat, exportData } from '@/lib/exportData';
import { toast } from 'sonner';

interface ExportButtonProps {
  fileName: string;
  title?: string;
  sheetName?: string;
  data: Record<string, any>[];
  columns: { key: string; label: string }[];
}

export function ExportButton({ fileName, title, sheetName, data, columns }: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  const handleExport = (format: ExportFormat) => {
    if (!data.length) {
      toast.error('Nenhum dado para exportar');
      return;
    }
    exportData({ fileName, title, sheetName, data, columns, format });
    toast.success(`Exportado como ${format.toUpperCase()}`);
    setOpen(false);
  };

  const formats: { format: ExportFormat; label: string; icon: typeof Download }[] = [
    { format: 'xlsx', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
    { format: 'csv', label: 'CSV (.csv)', icon: FileText },
    { format: 'pdf', label: 'PDF (imprimir)', icon: File },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase bg-secondary text-foreground hover:bg-secondary/80 transition-all"
      >
        <Download size={14} />
        Exportar
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[180px]">
            {formats.map(({ format, label, icon: Icon }) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="flex items-center gap-2 w-full px-4 py-3 text-xs font-bold text-foreground hover:bg-secondary transition-colors"
              >
                <Icon size={14} className="text-muted-foreground" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
