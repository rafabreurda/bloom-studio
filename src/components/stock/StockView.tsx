import { Plus, Minus, Pencil, Trash2, AlertCircle, ShoppingBag } from 'lucide-react';
import { ExportButton } from '@/components/ui/ExportButton';

import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { StockItem } from '@/types';

interface StockViewProps {
  stock: StockItem[];
  onAddClick: () => void;
  onEditClick: (item: StockItem) => void;
  onDeleteClick: (id: string) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  onRefetch?: () => void;
}

export function StockView({
  stock,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onAdjustQuantity,
  onRefetch,
}: StockViewProps) {
  const lowStockItems = stock.filter((item) => item.quantity < item.minStock);
  const sortedStock = [...stock].sort((a, b) => {
    const aLow = a.quantity < a.minStock;
    const bLow = b.quantity < b.minStock;
    if (aLow && !bLow) return -1;
    if (!aLow && bLow) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
          <ShoppingBag size={28} />
          Estoque
        </h2>
        <div className="flex gap-2">
          <ExportButton
            fileName="estoque"
            title="Estoque de Produtos"
            sheetName="Estoque"
            data={stock}
            columns={[
              { key: 'name', label: 'Produto' },
              { key: 'quantity', label: 'Quantidade' },
              { key: 'price', label: 'Preço (R$)' },
              { key: 'minStock', label: 'Estoque Mínimo' },
            ]}
          />
          <ImportDataButton
            table="stock"
            label="Estoque"
            columns={[
              { candidates: ['produto', 'nome', 'name', 'item'], dbColumn: 'name', fallback: 'Sem nome' },
              { candidates: ['quantidade', 'qtd', 'quantity'], dbColumn: 'quantity', transform: transforms.number },
              { candidates: ['preço', 'preco', 'price', 'valor'], dbColumn: 'price', transform: transforms.number },
              { candidates: ['mínimo', 'minimo', 'min', 'estoque mín'], dbColumn: 'min_stock', transform: transforms.number },
            ]}
            onImportComplete={() => onRefetch?.()}
          />
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={onAddClick}>
            Novo Produto
          </BronzeButton>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-destructive text-destructive-foreground px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xl animate-pulse shrink-0">
          <AlertCircle size={20} />
          <span className="text-xs font-black uppercase">
            {lowStockItems.length} produto(s) com estoque baixo
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 pr-2">
        <div className="grid grid-cols-1 gap-3">
          {sortedStock.map((item) => {
            const isLow = item.quantity < item.minStock;
            return (
              <BronzeCard
                key={item.id}
                className={`p-4 ${isLow ? 'border-destructive/50 bg-destructive/5' : ''}`}
              >
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm md:text-base truncate text-foreground">
                        {item.name}
                      </h4>
                      {isLow && (
                        <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-[9px] font-black rounded-full shrink-0 flex items-center gap-1">
                          <AlertCircle size={10} />
                          BAIXO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-[11px] text-muted-foreground font-bold">
                        R$ {item.price.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60">
                        Mín: {item.minStock} un.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onAdjustQuantity(item.id, -1)}
                      disabled={item.quantity <= 0}
                      className="w-10 h-10 bg-destructive/20 text-destructive rounded-xl flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all disabled:opacity-30"
                    >
                      <Minus size={18} />
                    </button>

                    <div className={`w-14 h-12 rounded-xl flex items-center justify-center font-black text-lg ${isLow ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-foreground'}`}>
                      {item.quantity}
                    </div>

                    <button
                      onClick={() => onAdjustQuantity(item.id, 1)}
                      className="w-10 h-10 bg-success/20 text-success rounded-xl flex items-center justify-center hover:bg-success hover:text-success-foreground transition-all"
                    >
                      <Plus size={18} />
                    </button>

                    <div className="w-px h-8 bg-border mx-1" />

                    <button
                      onClick={() => onEditClick(item)}
                      className="w-10 h-10 bg-secondary text-muted-foreground rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <ConfirmDeleteDialog
                      description="Tem certeza que deseja excluir este produto do estoque?"
                      onConfirm={() => onDeleteClick(item.id)}
                      trigger={
                        <button className="w-10 h-10 bg-destructive/20 text-destructive rounded-xl flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all">
                          <Trash2 size={18} />
                        </button>
                      }
                    />
                  </div>
                </div>
              </BronzeCard>
            );
          })}

          {stock.length === 0 && (
            <p className="text-center opacity-30 py-20 font-black uppercase text-xs italic tracking-widest">
              Nenhum produto cadastrado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}