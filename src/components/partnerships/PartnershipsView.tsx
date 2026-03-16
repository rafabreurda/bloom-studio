import { Plus, MessageSquare, Pencil, Trash2, Handshake, Percent } from 'lucide-react';
import { ExportButton } from '@/components/ui/ExportButton';

import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Partnership } from '@/types';

interface PartnershipsViewProps {
  partnerships: Partnership[];
  onAddClick: () => void;
  onEditClick: (partnership: Partnership) => void;
  onDeleteClick: (id: string) => void;
  onSendMessage: (phone: string, name: string) => void;
  onRefetch?: () => void;
}

export function PartnershipsView({
  partnerships,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onSendMessage,
  onRefetch,
}: PartnershipsViewProps) {
  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
          <Handshake size={28} />
          Parcerias
        </h2>
        <div className="flex gap-2">
          <ExportButton
            fileName="parcerias"
            title="Parcerias"
            sheetName="Parcerias"
            data={partnerships}
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'discount', label: 'Desconto (%)' },
              { key: 'contact', label: 'Contato' },
            ]}
          />
          <ImportDataButton
            table="partnerships"
            label="Parcerias"
            columns={[
              { candidates: ['nome', 'name', 'parceiro'], dbColumn: 'name', fallback: 'Sem nome' },
              { candidates: ['desconto', 'discount', '%'], dbColumn: 'discount', transform: transforms.number },
              { candidates: ['contato', 'contact', 'telefone', 'phone'], dbColumn: 'contact' },
            ]}
            onImportComplete={() => onRefetch?.()}
          />
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={onAddClick}>
            Nova Parceria
          </BronzeButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 pr-2">
        <div className="grid grid-cols-1 gap-3">
          {partnerships.map((partnership) => (
            <BronzeCard key={partnership.id} className="p-4">
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm md:text-base truncate text-foreground">
                    {partnership.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-bold mt-1">
                    {partnership.contact}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 px-3 py-2 bg-primary/20 rounded-xl">
                    <Percent size={14} className="text-primary" />
                    <span className="text-lg font-black text-primary">
                      {partnership.discount}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onSendMessage(partnership.contact, partnership.name)}
                      className="w-10 h-10 bg-success/20 text-success rounded-xl flex items-center justify-center hover:bg-success hover:text-success-foreground transition-all"
                    >
                      <MessageSquare size={18} />
                    </button>
                    <button
                      onClick={() => onEditClick(partnership)}
                      className="w-10 h-10 bg-secondary text-muted-foreground rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <ConfirmDeleteDialog
                      description="Tem certeza que deseja excluir esta parceria?"
                      onConfirm={() => onDeleteClick(partnership.id)}
                      trigger={
                        <button className="w-10 h-10 bg-destructive/20 text-destructive rounded-xl flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all">
                          <Trash2 size={18} />
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>
            </BronzeCard>
          ))}

          {partnerships.length === 0 && (
            <p className="text-center opacity-30 py-20 font-black uppercase text-xs italic tracking-widest">
              Nenhuma parceria cadastrada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}