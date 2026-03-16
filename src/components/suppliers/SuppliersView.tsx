import { Plus, MessageSquare, Pencil, Trash2, Truck, Package } from 'lucide-react';
import { ExportButton } from '@/components/ui/ExportButton';

import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Supplier } from '@/types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddClick: () => void;
  onEditClick: (supplier: Supplier) => void;
  onDeleteClick: (id: string) => void;
  onSendMessage: (phone: string, name: string) => void;
  onRefetch?: () => void;
}

export function SuppliersView({
  suppliers,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onSendMessage,
  onRefetch,
}: SuppliersViewProps) {
  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
          <Truck size={28} />
          Fornecedores
        </h2>
        <div className="flex gap-2">
          <ExportButton
            fileName="fornecedores"
            title="Fornecedores"
            sheetName="Fornecedores"
            data={suppliers}
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'contact', label: 'Contato' },
              { key: 'products', label: 'Produtos' },
            ]}
          />
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={onAddClick}>
            Novo Fornecedor
          </BronzeButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 pr-2">
        <div className="grid grid-cols-1 gap-3">
          {suppliers.map((supplier) => (
            <BronzeCard key={supplier.id} className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm md:text-base truncate text-foreground">
                    {supplier.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-bold mt-1">
                    {supplier.contact}
                  </p>
                  <div className="flex items-start gap-2 mt-2">
                    <Package size={14} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-muted-foreground/70">
                      {supplier.products}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onSendMessage(supplier.contact, supplier.name)}
                    className="w-10 h-10 bg-success/20 text-success rounded-xl flex items-center justify-center hover:bg-success hover:text-success-foreground transition-all"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button
                    onClick={() => onEditClick(supplier)}
                    className="w-10 h-10 bg-secondary text-muted-foreground rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Pencil size={18} />
                  </button>
                  <ConfirmDeleteDialog
                    description="Tem certeza que deseja excluir este fornecedor?"
                    onConfirm={() => onDeleteClick(supplier.id)}
                    trigger={
                      <button className="w-10 h-10 bg-destructive/20 text-destructive rounded-xl flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all">
                        <Trash2 size={18} />
                      </button>
                    }
                  />
                </div>
              </div>
            </BronzeCard>
          ))}

          {suppliers.length === 0 && (
            <p className="text-center opacity-30 py-20 font-black uppercase text-xs italic tracking-widest">
              Nenhum fornecedor cadastrado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}