import { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, FileText, History, Star, Tag, ChevronDown, Plus } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Client, ClientTag, AnamnesisRecord } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AnamnesisFormModal } from './AnamnesisFormModal';

interface ClientHistoryModalProps {
  client: Client;
  tags?: ClientTag[];
  onClose: () => void;
  onUpdateClient?: (client: Client) => void;
}

export function ClientHistoryModal({ client, tags = [], onClose, onUpdateClient }: ClientHistoryModalProps) {
  const [showAnamnesisForm, setShowAnamnesisForm] = useState(false);
  const [anamnesisHistory, setAnamnesisHistory] = useState<AnamnesisRecord[]>(client.anamnesisHistory || []);

  const getTagById = (tagId: string) => tags.find(t => t.id === tagId);

  const totalSpent = client.history?.reduce((sum, h) => sum + h.value, 0) || 0;
  const sessionsCount = client.history?.filter(h => h.type === 'session').length || 0;
  const purchasesCount = client.history?.filter(h => h.type === 'purchase').length || 0;

  const latestRecord = anamnesisHistory.length > 0 ? anamnesisHistory[0] : undefined;

  const handleAddAnamnesis = (recordData: Omit<AnamnesisRecord, 'id' | 'date'>) => {
    const newRecord: AnamnesisRecord = {
      ...recordData,
      id: `a${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
    };
    const updatedHistory = [newRecord, ...anamnesisHistory];
    setAnamnesisHistory(updatedHistory);
    setShowAnamnesisForm(false);
    
    if (onUpdateClient) {
      onUpdateClient({ ...client, anamnesisHistory: updatedHistory });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-[100] flex items-end md:items-center justify-center">
        <BronzeCard className="w-full max-w-2xl bg-card border-primary/30 overflow-y-auto max-h-[90vh] custom-scrollbar rounded-t-[32px] md:rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6 text-foreground border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${client.isVIP ? 'bg-primary' : 'bg-secondary'}`}>
                {client.isVIP ? (
                  <Star size={24} className="text-primary-foreground" fill="currentColor" />
                ) : (
                  <User size={24} className="text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-black uppercase">{client.name}</h3>
                {client.isVIP && (
                  <span className="text-xs font-bold text-primary">Cliente VIP</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
              <X size={24} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-primary">R$ {totalSpent.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Gasto</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-emerald-500">{sessionsCount}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Sessões</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-blue-500">{purchasesCount}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Compras</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6 space-y-3">
            <h4 className="text-sm font-black uppercase text-muted-foreground mb-3">Dados de Contato</h4>
            
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-muted-foreground" />
              <span className="text-sm">{client.phone}</span>
            </div>
            
            {client.email && (
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-muted-foreground" />
                <span className="text-sm">{client.email}</span>
              </div>
            )}
            
            {(client.addressStreet || client.addressNeighborhood || client.addressCity || client.addressZip || client.address) && (
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-muted-foreground mt-0.5" />
                <div className="text-sm space-y-0.5">
                  {client.addressStreet && <p>{client.addressStreet}</p>}
                  {client.addressNeighborhood && <p>{client.addressNeighborhood}</p>}
                  {(client.addressCity || client.addressZip) && (
                    <p>{[client.addressCity, client.addressZip].filter(Boolean).join(' - ')}</p>
                  )}
                  {!client.addressStreet && client.address && <p>{client.address}</p>}
                </div>
              </div>
            )}
            
            {client.birthday && (
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-sm">
                  {new Date(client.birthday).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}

            {client.cpf && (
              <div className="flex items-center gap-3">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm">CPF: {client.cpf}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {client.tags && client.tags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-black uppercase text-muted-foreground mb-3 flex items-center gap-2">
                <Tag size={14} />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {client.tags.map(tagId => {
                  const tag = getTagById(tagId);
                  if (!tag) return null;
                  return (
                    <span
                      key={tagId}
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Anamnesis History */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
                <FileText size={14} />
                Histórico de Anamnese
                {anamnesisHistory.length > 0 && (
                  <Badge variant="outline" className="text-[10px] ml-1">
                    {anamnesisHistory.length}
                  </Badge>
                )}
              </h4>
              <BronzeButton
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => setShowAnamnesisForm(true)}
              >
                Nova Ficha
              </BronzeButton>
            </div>

            {anamnesisHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Nenhuma ficha de anamnese cadastrada</p>
            ) : (
              <Accordion type="single" collapsible defaultValue={anamnesisHistory[0]?.id} className="space-y-2">
                {anamnesisHistory.map((record, index) => (
                  <AccordionItem 
                    key={record.id} 
                    value={record.id}
                    className="border border-border rounded-xl overflow-hidden bg-background/50"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/30">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Calendar size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold flex items-center gap-2">
                            {new Date(record.date).toLocaleDateString('pt-BR')}
                            {index === 0 && (
                              <Badge className="bg-primary/20 text-primary text-[10px] font-bold">
                                Mais recente
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {record.skinType || 'Tipo de pele não informado'}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-3 text-sm pt-2">
                        {record.skinType && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Tipo de Pele</p>
                            <p>{record.skinType}</p>
                          </div>
                        )}
                        {record.allergies && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Alergias</p>
                            <p>{record.allergies}</p>
                          </div>
                        )}
                        {record.medications && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Medicamentos</p>
                            <p>{record.medications}</p>
                          </div>
                        )}
                        {record.healthConditions && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Condições de Saúde</p>
                            <p>{record.healthConditions}</p>
                          </div>
                        )}
                        {record.lastTanning && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Último Bronze</p>
                            <p>{new Date(record.lastTanning).toLocaleDateString('pt-BR')}</p>
                          </div>
                        )}
                        {record.createdBy && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Criado por</p>
                            <p>{record.createdBy}</p>
                          </div>
                        )}
                        {record.observations && (
                          <div className="col-span-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Observações</p>
                            <p>{record.observations}</p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* History */}
          <div>
            <h4 className="text-sm font-black uppercase text-muted-foreground mb-3 flex items-center gap-2">
              <History size={14} />
              Histórico de Atendimentos
            </h4>
            
            {!client.history || client.history.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Nenhum histórico registrado</p>
            ) : (
              <div className="space-y-2">
                {client.history.map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      item.type === 'session' 
                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                        : 'bg-blue-500/5 border-blue-500/20'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString('pt-BR')} • {item.type === 'session' ? 'Sessão' : 'Compra'}
                      </p>
                    </div>
                    <span className={`font-black ${item.type === 'session' ? 'text-emerald-500' : 'text-blue-500'}`}>
                      R$ {item.value.toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
              <h4 className="text-sm font-black uppercase text-muted-foreground mb-2">Observações</h4>
              <p className="text-sm text-muted-foreground">{client.notes}</p>
            </div>
          )}
        </BronzeCard>
      </div>

      {showAnamnesisForm && (
        <AnamnesisFormModal
          existingRecord={latestRecord}
          onClose={() => setShowAnamnesisForm(false)}
          onSave={handleAddAnamnesis}
        />
      )}
    </>
  );
}
