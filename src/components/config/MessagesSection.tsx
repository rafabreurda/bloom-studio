import { useState } from 'react';
import { Plus, Trash2, Edit2, X, CheckCircle2, MessageSquare, Info } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Switch } from '@/components/ui/switch';
import { WhatsAppTemplate } from '@/types';

interface MessagesSectionProps {
  templates: WhatsAppTemplate[];
  onUpdate: (templates: WhatsAppTemplate[]) => void;
}

const variablesList = [
  { var: '{nome}', desc: 'Nome do cliente' },
  { var: '{hora}', desc: 'Horário do agendamento' },
  { var: '{data}', desc: 'Data do agendamento' },
  { var: '{valor}', desc: 'Valor total' },
  { var: '{pix}', desc: 'Chave PIX configurada' },
];

export function MessagesSection({ templates, onUpdate }: MessagesSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [includePixKey, setIncludePixKey] = useState(false);

  const openAddModal = () => {
    setEditingTemplate(null);
    setName('');
    setContent('');
    setIncludePixKey(false);
    setShowModal(true);
  };

  const openEditModal = (template: WhatsAppTemplate) => {
    setEditingTemplate(template);
    setName(template.name);
    setContent(template.content);
    setIncludePixKey(template.includePixKey);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      onUpdate(templates.map(t => t.id === editingTemplate.id ? { ...t, name, content, includePixKey } : t));
    } else {
      const newTemplate: WhatsAppTemplate = {
        id: Date.now().toString(),
        name,
        content,
        includePixKey,
      };
      onUpdate([...templates, newTemplate]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(templates.filter(t => t.id !== id));
  };

  const insertVariable = (variable: string) => {
    setContent(prev => prev + variable);
  };

  return (
    <>
      <BronzeCard className="bg-secondary/50 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black uppercase text-primary">Mensagens WhatsApp</h3>
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={openAddModal}>
            Nova Mensagem
          </BronzeButton>
        </div>

        <p className="text-xs text-muted-foreground">
          Crie templates de mensagens para enviar aos clientes via WhatsApp. Use variáveis para personalizar automaticamente.
        </p>

        <div className="space-y-2">
          {templates.map(template => (
            <div key={template.id} className="p-4 bg-background rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-emerald-500" />
                  <span className="font-bold text-sm">{template.name}</span>
                  {template.includePixKey && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full">
                      PIX
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(template)} className="p-2 text-muted-foreground hover:text-primary">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(template.id)} className="p-2 text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-2">
                {template.content}
              </p>
            </div>
          ))}
        </div>
      </BronzeCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <BronzeCard className="w-full max-w-lg bg-card border-primary/30 rounded-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h3 className="text-xl font-black uppercase">
                {editingTemplate ? 'Editar Mensagem' : 'Nova Mensagem'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Nome do Template *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-bronze"
                  placeholder="Ex: Confirmação 24h"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Variáveis Disponíveis
                </label>
                <div className="flex flex-wrap gap-2">
                  {variablesList.map(v => (
                    <button
                      key={v.var}
                      type="button"
                      onClick={() => insertVariable(v.var)}
                      className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                      title={v.desc}
                    >
                      {v.var}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Mensagem *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input-bronze min-h-[120px] resize-none"
                  placeholder="Olá {nome}! Confirmando seu bronzeamento amanhã às {hora}..."
                  required
                />
              </div>

              <label className="flex items-center gap-3 p-4 bg-secondary rounded-2xl border border-border cursor-pointer hover:bg-secondary/80 transition-all">
                <Switch
                  checked={includePixKey}
                  onCheckedChange={setIncludePixKey}
                />
                <div>
                  <span className="text-sm font-bold">Incluir Chave PIX</span>
                  <p className="text-xs text-muted-foreground">
                    Adiciona automaticamente a chave PIX configurada
                  </p>
                </div>
              </label>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-600">Preview da Mensagem</p>
                    <p className="text-xs text-emerald-600/80 mt-1 whitespace-pre-wrap">
                      {content
                        .replace('{nome}', 'Maria Silva')
                        .replace('{hora}', '14:00')
                        .replace('{data}', '25/01')
                        .replace('{valor}', 'R$ 150')
                        .replace('{pix}', 'bronze@email.com')
                      }
                    </p>
                  </div>
                </div>
              </div>

              <BronzeButton
                type="submit"
                variant="gold"
                icon={CheckCircle2}
                className="w-full h-[60px]"
              >
                {editingTemplate ? 'Salvar Alterações' : 'Criar Mensagem'}
              </BronzeButton>
            </form>
          </BronzeCard>
        </div>
      )}
    </>
  );
}
