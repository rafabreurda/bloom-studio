import { useState } from 'react';
import { X, FileText, Printer } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Checkbox } from '@/components/ui/checkbox';
import { Finance, ReportConfig } from '@/types';
import { toast } from 'sonner';

interface ReportModalProps {
  finances: Finance[];
  onClose: () => void;
}

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function ReportModal({ finances, onClose }: ReportModalProps) {
  const currentDate = new Date();
  const [config, setConfig] = useState<ReportConfig>({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    includeSessions: true,
    includeProducts: true,
    includePartnerships: false,
    includeExpenses: true,
  });

  const generateReport = () => {
    // Filter finances based on config
    let filteredFinances = finances.filter(f => {
      const financeDate = new Date(f.date);
      return financeDate.getMonth() + 1 === config.month && 
             financeDate.getFullYear() === config.year;
    });

    // Apply category filters
    filteredFinances = filteredFinances.filter(f => {
      if (f.category === 'session' && !config.includeSessions) return false;
      if (f.category === 'product' && !config.includeProducts) return false;
      if (f.category === 'partnership' && !config.includePartnerships) return false;
      if (f.category === 'expense' && !config.includeExpenses) return false;
      return true;
    });

    // Calculate totals
    const totalReceita = filteredFinances.filter(f => f.type === 'in').reduce((sum, f) => sum + f.value, 0);
    const totalDespesa = filteredFinances.filter(f => f.type === 'out').reduce((sum, f) => sum + f.value, 0);
    const lucro = totalReceita - totalDespesa;

    // Create printable content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório Financeiro - ${months[config.month - 1]}/${config.year}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px;
              color: #333;
            }
            h1 { 
              color: #f59e0b; 
              border-bottom: 3px solid #f59e0b;
              padding-bottom: 10px;
            }
            h2 { 
              color: #666;
              margin-top: 30px;
            }
            .summary {
              display: flex;
              gap: 20px;
              margin: 20px 0;
            }
            .summary-card {
              padding: 20px;
              border-radius: 10px;
              flex: 1;
              text-align: center;
            }
            .receita { background: #dcfce7; color: #166534; }
            .despesa { background: #fee2e2; color: #991b1b; }
            .lucro { background: #fef3c7; color: #92400e; }
            .summary-value {
              font-size: 24px;
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background: #f5f5f5;
              font-weight: bold;
            }
            .positive { color: #166534; }
            .negative { color: #991b1b; }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>RELATÓRIO FINANCEIRO</h1>
          <p><strong>Período:</strong> ${months[config.month - 1]} de ${config.year}</p>
          <p><strong>Gerado em:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          
          <div class="summary">
            <div class="summary-card receita">
              <div>RECEITA</div>
              <div class="summary-value">R$ ${totalReceita.toLocaleString('pt-BR')}</div>
            </div>
            <div class="summary-card despesa">
              <div>DESPESAS</div>
              <div class="summary-value">R$ ${totalDespesa.toLocaleString('pt-BR')}</div>
            </div>
            <div class="summary-card lucro">
              <div>LUCRO</div>
              <div class="summary-value">R$ ${lucro.toLocaleString('pt-BR')}</div>
            </div>
          </div>

          <h2>Detalhamento</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Pagamento</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${filteredFinances.map(f => `
                <tr>
                  <td>${f.date}</td>
                  <td>${f.description}</td>
                  <td>${f.category}</td>
                  <td>${f.paymentMethod}</td>
                  <td class="${f.type === 'in' ? 'positive' : 'negative'}">
                    ${f.type === 'in' ? '+' : '-'}R$ ${f.value.toLocaleString('pt-BR')}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Documento gerado automaticamente pelo sistema NEUROFLIX SYSTEMS</p>
          </div>
        </body>
      </html>
    `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }

    toast.success('Relatório gerado! Use Ctrl+P ou Cmd+P para salvar como PDF.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-end md:items-center justify-center">
      <BronzeCard className="w-full max-w-md bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
          <h3 className="text-xl font-black uppercase">Gerar Relatório</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Period Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Mês
              </label>
              <select
                value={config.month}
                onChange={(e) => setConfig({ ...config, month: parseInt(e.target.value) })}
                className="input-bronze"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Ano
              </label>
              <select
                value={config.year}
                onChange={(e) => setConfig({ ...config, year: parseInt(e.target.value) })}
                className="input-bronze"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Incluir no Relatório
            </label>

            <label className="flex items-center gap-3 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80">
              <Checkbox
                checked={config.includeSessions}
                onCheckedChange={(checked) => setConfig({ ...config, includeSessions: !!checked })}
              />
              <span className="text-sm font-bold">Sessões de Bronzeamento</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80">
              <Checkbox
                checked={config.includeProducts}
                onCheckedChange={(checked) => setConfig({ ...config, includeProducts: !!checked })}
              />
              <span className="text-sm font-bold">Venda de Produtos</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80">
              <Checkbox
                checked={config.includePartnerships}
                onCheckedChange={(checked) => setConfig({ ...config, includePartnerships: !!checked })}
              />
              <div>
                <span className="text-sm font-bold">Parcerias</span>
                <p className="text-xs text-muted-foreground">Geralmente não incluso no relatório para contador</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-secondary/80">
              <Checkbox
                checked={config.includeExpenses}
                onCheckedChange={(checked) => setConfig({ ...config, includeExpenses: !!checked })}
              />
              <span className="text-sm font-bold">Despesas</span>
            </label>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-xs text-amber-600 font-bold">
              💡 O relatório será aberto em uma nova aba. Use Ctrl+P (ou Cmd+P no Mac) para salvar como PDF.
            </p>
          </div>

          <BronzeButton
            variant="gold"
            icon={Printer}
            className="w-full h-[60px]"
            onClick={generateReport}
          >
            Gerar Relatório PDF
          </BronzeButton>
        </div>
      </BronzeCard>
    </div>
  );
}
