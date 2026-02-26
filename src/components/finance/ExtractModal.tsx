import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Finance } from '@/types';

interface ExtractModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  finances: Finance[];
  color: string;
}

export function ExtractModal({ open, onClose, title, finances, color }: ExtractModalProps) {
  const total = finances.reduce((sum, f) => sum + f.value, 0);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase">{title}</DialogTitle>
          <p className={`text-sm font-black ${color}`}>
            Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {finances.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">Nenhuma transação encontrada</p>
          )}
          {finances.map(f => (
            <div
              key={f.id}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                f.type === 'in' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${f.type === 'in' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-sm font-bold">{f.description}</p>
                  <p className="text-xs text-muted-foreground">{f.date} • {f.paymentMethod}</p>
                </div>
              </div>
              <span className={`font-black ${f.type === 'in' ? 'text-emerald-500' : 'text-red-500'}`}>
                {f.type === 'in' ? '+' : '-'}R$ {f.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
