import { useState } from 'react';
import { Upload, Download, Users, Calendar, Package, ShoppingBag, Truck, Handshake } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { ImportDataButton, transforms } from '@/components/ui/ImportDataButton';
import { ImportClientsButton } from '@/components/clients/ImportClientsButton';
import { ExportButton } from '@/components/ui/ExportButton';
import { useClients } from '@/hooks/useClients';
import { supabase } from '@/integrations/supabase/client';

interface ImportSectionProps {
  onImportComplete: () => void;
}

const importOptions = [
  {
    id: 'clients',
    label: 'Clientes',
    icon: Users,
    description: 'Importe sua base de clientes com nome, telefone, e-mail, CPF, endereço e mais.',
  },
  {
    id: 'appointments',
    label: 'Agendamentos',
    icon: Calendar,
    description: 'Importe agendamentos com cliente, data, horário, valor e status.',
  },
  {
    id: 'packages',
    label: 'Pacotes',
    icon: Package,
    description: 'Importe pacotes de sessões com cliente, total de sessões e valor.',
  },
  {
    id: 'stock',
    label: 'Estoque',
    icon: ShoppingBag,
    description: 'Importe produtos do estoque com nome, quantidade, preço e estoque mínimo.',
  },
  {
    id: 'suppliers',
    label: 'Fornecedores',
    icon: Truck,
    description: 'Importe fornecedores com nome, contato e produtos.',
  },
  {
    id: 'partnerships',
    label: 'Parcerias',
    icon: Handshake,
    description: 'Importe parcerias com nome, desconto e contato.',
  },
] as const;

export function ImportSection({ onImportComplete }: ImportSectionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { clients } = useClients();

  return (
    <BronzeCard className="bg-secondary/50 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Upload size={20} className="text-primary" />
          <h3 className="text-lg font-black uppercase text-primary">Importar / Exportar</h3>
        </div>
        <ExportButton
          fileName="clientes"
          title="Base de Clientes"
          sheetName="Clientes"
          data={clients}
          columns={[
            { key: 'name', label: 'Nome' },
            { key: 'phone', label: 'Telefone' },
            { key: 'email', label: 'E-mail' },
            { key: 'cpf', label: 'CPF' },
            { key: 'birthday', label: 'Aniversário' },
            { key: 'addressStreet', label: 'Rua' },
            { key: 'addressNumber', label: 'Número' },
            { key: 'addressNeighborhood', label: 'Bairro' },
            { key: 'addressCity', label: 'Cidade' },
            { key: 'addressState', label: 'Estado' },
            { key: 'addressZip', label: 'CEP' },
            { key: 'clientSince', label: 'Cliente Desde' },
            { key: 'totalSessions', label: 'Total de Bronzes' },
            { key: 'isVIP', label: 'VIP' },
            { key: 'notes', label: 'Observações' },
          ]}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Selecione o que deseja importar via planilha (.xlsx, .xls ou .csv):
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {importOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => setSelected(selected === opt.id ? null : opt.id)}
            className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${
              selected === opt.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <opt.icon size={18} className={selected === opt.id ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-sm font-black uppercase">{opt.label}</span>
            </div>
            <span className="text-[11px] text-muted-foreground leading-tight">{opt.description}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="flex justify-center pt-2">
          {selected === 'clients' && (
            <ImportClientsButton onImportComplete={onImportComplete} />
          )}
          {selected === 'appointments' && (
            <ImportDataButton
              table="appointments"
              label="Agendamentos"
              columns={[
                { candidates: ['cliente', 'nome', 'client', 'name'], dbColumn: 'client_name', fallback: 'Sem nome' },
                { candidates: ['telefone', 'phone', 'celular', 'whatsapp', 'fone'], dbColumn: 'phone', fallback: '0' },
                { candidates: ['data', 'date', 'dia'], dbColumn: 'date', transform: (v) => {
                  if (!v) return new Date().toISOString().split('T')[0];
                  let s = String(v).trim();
                  const commaIdx = s.indexOf(',');
                  if (commaIdx !== -1 && commaIdx < 6) s = s.substring(commaIdx + 1).trim();
                  return transforms.date(s) || new Date().toISOString().split('T')[0];
                }},
                { candidates: ['horário', 'horario', 'hora', 'time', 'início'], dbColumn: 'time', transform: (v) => {
                  if (!v) return '10:00';
                  const s = String(v).trim();
                  const match = s.match(/^(\d{1,2}:\d{2})/);
                  return match ? match[1] : '10:00';
                }},
                { candidates: ['preço', 'preco', 'valor', 'value', 'price'], dbColumn: 'value', transform: (v) => {
                  if (!v) return 0;
                  const s = String(v).replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim();
                  return parseFloat(s) || 0;
                }},
                { candidates: ['situação', 'situacao', 'status'], dbColumn: 'status', transform: (v) => {
                  if (!v || String(v).trim() === '-') return 'Concluído';
                  const s = String(v).trim().toLowerCase();
                  if (s.includes('não comparec') || s.includes('nao comparec')) return 'Agendado';
                  if (s.includes('cancelad')) return 'Agendado';
                  return 'Concluído';
                }},
                { candidates: ['pagamento', 'payment', 'forma', 'método'], dbColumn: 'payment_method', fallback: 'Pix' },
                { candidates: ['serviço', 'servico', 'tipo', 'atendimento', 'service'], dbColumn: 'tags', transform: (v) => v ? [String(v).trim()] : [] },
              ]}
              onPreProcess={async (rows) => {
                const { data: clients } = await supabase.from('clients').select('name, phone');
                const clientMap = new Map<string, string>();
                if (clients) {
                  for (const c of clients) {
                    clientMap.set(c.name.toLowerCase().trim(), c.phone);
                  }
                }
                return rows.map(row => {
                  const name = (row.client_name || '').toLowerCase().trim();
                  if ((!row.phone || row.phone === '0') && clientMap.has(name)) {
                    row.phone = clientMap.get(name)!;
                  }
                  if (!row.total_value) row.total_value = row.value || 0;
                  if (!row.charged_value) row.charged_value = row.value || 0;
                  if (row.tags && !Array.isArray(row.tags)) row.tags = [String(row.tags)];
                  if (!row.tags) row.tags = [];
                  return row;
                });
              }}
              onImportComplete={onImportComplete}
            />
          )}
          {selected === 'packages' && (
            <ImportDataButton
              table="packages"
              label="Pacotes"
              columns={[
                { candidates: ['cliente', 'nome', 'client', 'name'], dbColumn: 'client_name', fallback: 'Sem nome' },
                { candidates: ['telefone', 'phone', 'celular'], dbColumn: 'client_phone', transform: transforms.phone },
                { candidates: ['sessões', 'sessoes', 'total', 'sessions'], dbColumn: 'total_sessions', transform: transforms.number },
                { candidates: ['usadas', 'used', 'utilizadas'], dbColumn: 'used_sessions', transform: transforms.number },
                { candidates: ['valor', 'value', 'preço', 'total_value'], dbColumn: 'total_value', transform: transforms.number },
                { candidates: ['observação', 'obs', 'notes', 'nota'], dbColumn: 'notes' },
              ]}
              onImportComplete={onImportComplete}
            />
          )}
          {selected === 'stock' && (
            <ImportDataButton
              table="stock"
              label="Estoque"
              columns={[
                { candidates: ['produto', 'nome', 'name', 'item'], dbColumn: 'name', fallback: 'Sem nome' },
                { candidates: ['quantidade', 'qtd', 'quantity'], dbColumn: 'quantity', transform: transforms.number },
                { candidates: ['preço', 'preco', 'price', 'valor'], dbColumn: 'price', transform: transforms.number },
                { candidates: ['mínimo', 'minimo', 'min', 'estoque mín'], dbColumn: 'min_stock', transform: transforms.number },
              ]}
              onImportComplete={onImportComplete}
            />
          )}
          {selected === 'suppliers' && (
            <ImportDataButton
              table="suppliers"
              label="Fornecedores"
              columns={[
                { candidates: ['nome', 'name', 'fornecedor'], dbColumn: 'name', fallback: 'Sem nome' },
                { candidates: ['contato', 'contact', 'telefone', 'phone'], dbColumn: 'contact' },
                { candidates: ['produtos', 'products', 'itens'], dbColumn: 'products' },
              ]}
              onImportComplete={onImportComplete}
            />
          )}
          {selected === 'partnerships' && (
            <ImportDataButton
              table="partnerships"
              label="Parcerias"
              columns={[
                { candidates: ['nome', 'name', 'parceiro'], dbColumn: 'name', fallback: 'Sem nome' },
                { candidates: ['desconto', 'discount', '%'], dbColumn: 'discount', transform: transforms.number },
                { candidates: ['contato', 'contact', 'telefone', 'phone'], dbColumn: 'contact' },
              ]}
              onImportComplete={onImportComplete}
            />
          )}
        </div>
      )}
    </BronzeCard>
  );
}
