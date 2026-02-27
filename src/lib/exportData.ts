import * as XLSX from 'xlsx';

export type ExportFormat = 'xlsx' | 'csv' | 'pdf';

interface ExportOptions {
  fileName: string;
  sheetName?: string;
  data: Record<string, any>[];
  columns: { key: string; label: string }[];
  format: ExportFormat;
  title?: string;
}

function formatValue(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'boolean') return val ? 'Sim' : 'Não';
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

function buildRows(data: Record<string, any>[], columns: { key: string; label: string }[]) {
  return data.map(row =>
    columns.reduce((acc, col) => {
      acc[col.label] = formatValue(row[col.key]);
      return acc;
    }, {} as Record<string, string>)
  );
}

function exportXLSX(options: ExportOptions) {
  const rows = buildRows(options.data, options.columns);
  const ws = XLSX.utils.json_to_sheet(rows);
  
  // Auto-width columns
  const colWidths = options.columns.map(col => {
    const maxLen = Math.max(
      col.label.length,
      ...options.data.map(r => formatValue(r[col.key]).length)
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options.sheetName || 'Dados');
  XLSX.writeFile(wb, `${options.fileName}.xlsx`);
}

function exportCSV(options: ExportOptions) {
  const rows = buildRows(options.data, options.columns);
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${options.fileName}.csv`);
}

function exportPDF(options: ExportOptions) {
  const rows = buildRows(options.data, options.columns);
  const headers = options.columns.map(c => c.label);

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options.title || options.fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #333; font-size: 11px; }
          h1 { font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 4px; }
          .meta { color: #666; margin-bottom: 16px; font-size: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #f0f0f0; font-weight: bold; text-align: left; padding: 6px 8px; border: 1px solid #ccc; font-size: 10px; }
          td { padding: 5px 8px; border: 1px solid #ddd; font-size: 10px; }
          tr:nth-child(even) { background: #fafafa; }
          .footer { margin-top: 20px; text-align: center; color: #999; font-size: 9px; }
          @media print { body { padding: 10px; } }
        </style>
      </head>
      <body>
        <h1>${options.title || options.fileName}</h1>
        <div class="meta">Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} • Total: ${rows.length} registros</div>
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(r => `<tr>${headers.map(h => `<td>${r[h] || ''}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">Documento gerado automaticamente pelo sistema Neuro Flux Systems</div>
      </body>
    </html>
  `;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(printContent);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportData(options: ExportOptions) {
  switch (options.format) {
    case 'xlsx': return exportXLSX(options);
    case 'csv': return exportCSV(options);
    case 'pdf': return exportPDF(options);
  }
}
