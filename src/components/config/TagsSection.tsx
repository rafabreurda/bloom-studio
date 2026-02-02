import { useState } from 'react';
import { Plus, Trash2, Edit2, X, CheckCircle2, Tag } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Switch } from '@/components/ui/switch';
import { ClientTag } from '@/types';

interface TagsSectionProps {
  tags: ClientTag[];
  onUpdate: (tags: ClientTag[]) => void;
}

const colorOptions = [
  { value: '#f59e0b', label: 'Dourado' },
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#10b981', label: 'Verde' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#8b5cf6', label: 'Roxo' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#f97316', label: 'Laranja' },
  { value: '#6b7280', label: 'Cinza' },
];

export function TagsSection({ tags, onUpdate }: TagsSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<ClientTag | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#f59e0b');

  const openAddModal = () => {
    setEditingTag(null);
    setName('');
    setColor('#f59e0b');
    setShowModal(true);
  };

  const openEditModal = (tag: ClientTag) => {
    setEditingTag(tag);
    setName(tag.name);
    setColor(tag.color);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTag) {
      onUpdate(tags.map(t => t.id === editingTag.id ? { ...t, name, color } : t));
    } else {
      const newTag: ClientTag = {
        id: Date.now().toString(),
        name,
        color,
        isActive: true,
      };
      onUpdate([...tags, newTag]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(tags.filter(t => t.id !== id));
  };

  const handleToggle = (id: string) => {
    onUpdate(tags.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  return (
    <>
      <BronzeCard className="bg-secondary/50 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black uppercase text-primary">Tags de Clientes</h3>
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={openAddModal}>
            Nova Tag
          </BronzeButton>
        </div>

        <p className="text-xs text-muted-foreground">
          Crie tags personalizadas para categorizar seus clientes. Tags desativadas não aparecerão nas opções de cadastro.
        </p>

        <div className="space-y-2">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: tag.color }}
                >
                  <Tag size={12} className="text-white" />
                </div>
                <span className={`font-bold text-sm ${!tag.isActive ? 'text-muted-foreground line-through' : ''}`}>
                  {tag.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={tag.isActive}
                  onCheckedChange={() => handleToggle(tag.id)}
                />
                <button onClick={() => openEditModal(tag)} className="p-2 text-muted-foreground hover:text-primary">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(tag.id)} className="p-2 text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </BronzeCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <BronzeCard className="w-full max-w-md bg-card border-primary/30 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h3 className="text-xl font-black uppercase">
                {editingTag ? 'Editar Tag' : 'Nova Tag'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Nome da Tag *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-bronze"
                  placeholder="Ex: VIP, Fidelidade..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Cor
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setColor(opt.value)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        color === opt.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                      }`}
                      style={{ backgroundColor: opt.value }}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <Tag size={16} className="text-white" />
                </div>
                <span className="font-bold">{name || 'Preview'}</span>
              </div>

              <BronzeButton
                type="submit"
                variant="gold"
                icon={CheckCircle2}
                className="w-full h-[60px]"
              >
                {editingTag ? 'Salvar Alterações' : 'Criar Tag'}
              </BronzeButton>
            </form>
          </BronzeCard>
        </div>
      )}
    </>
  );
}
