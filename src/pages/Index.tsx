import { useState } from 'react';
import { toast } from 'sonner';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { AgendaView } from '@/components/agenda/AgendaView';
import { FinanceView } from '@/components/finance/FinanceView';
import { WaitingListView } from '@/components/waitinglist/WaitingListView';
import { ConfigView } from '@/components/config/ConfigView';
import { ClientsView } from '@/components/clients/ClientsView';
import { StockView } from '@/components/stock/StockView';
import { StockModal } from '@/components/stock/StockModal';
import { SuppliersView } from '@/components/suppliers/SuppliersView';
import { SupplierModal } from '@/components/suppliers/SupplierModal';
import { PartnershipsView } from '@/components/partnerships/PartnershipsView';
import { PartnershipModal } from '@/components/partnerships/PartnershipModal';
import { AddAppointmentModal } from '@/components/modals/AddAppointmentModal';
import { BlockModal } from '@/components/modals/BlockModal';
import { WaitlistModal } from '@/components/modals/WaitlistModal';
import { RestrictedModal } from '@/components/modals/RestrictedModal';
import { ClientHistoryModal } from '@/components/clients/ClientHistoryModal';
import { 
  TabId, 
  UserRole, 
  SystemConfig,
  Appointment,
  Block,
  WaitingItem,
  Client,
  StockItem,
  Supplier,
  Partnership,
  Finance,
} from '@/types';
import {
  mockAppointments,
  mockBlocks,
  mockWaitingList,
  mockFinances,
  mockStock,
  mockClients,
  mockSuppliers,
  mockPartnerships,
  defaultConfig,
} from '@/data/mockData';

const juniorPermissions: TabId[] = ['agenda', 'clientes', 'estoque', 'lista-espera'];

const LOCAL_STORAGE_CONFIG_KEY = 'bronze_system_config';

const loadSavedConfig = (): SystemConfig => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading saved config:', e);
  }
  return defaultConfig;
};

const Index = () => {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('agenda');
  const [currentRole, setCurrentRole] = useState<UserRole>('Admin Chefe');
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(loadSavedConfig);
  
  // Data state
  const [appointments, setAppointments] = useState(mockAppointments);
  const [blocks, setBlocks] = useState(mockBlocks);
  const [waitingList, setWaitingList] = useState(mockWaitingList);
  const [finances, setFinances] = useState(mockFinances);
  const [clients, setClients] = useState(mockClients);
  const [stock, setStock] = useState(mockStock);
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [partnerships, setPartnerships] = useState(mockPartnerships);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [newAppoTime, setNewAppoTime] = useState('');
  const [historyClient, setHistoryClient] = useState<Client | null>(null);
  
  // Editing state
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);

  // Handle config change and save to localStorage
  const handleConfigChange = (newConfig: SystemConfig) => {
    setSystemConfig(newConfig);
    try {
      localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error('Error saving config:', e);
    }
  };

  // Handlers
  const handleTabChange = (tabId: TabId) => {
    if (currentRole === 'Admin Junior' && !juniorPermissions.includes(tabId)) {
      setShowRestrictedModal(true);
      return;
    }
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  const handleAddAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setAppointments([...appointments, newAppointment]);
    toast.success('Bronze agendado com sucesso!');
  };

  const handleAddBlock = (block: Omit<Block, 'id' | 'createdAt'>) => {
    const newBlock: Block = {
      ...block,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setBlocks([...blocks, newBlock]);
    toast.success('Horário bloqueado!');
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
    toast.success('Bloqueio removido!');
  };

  const handleAddWaiting = (item: Omit<WaitingItem, 'id' | 'createdAt'>) => {
    const newItem: WaitingItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setWaitingList([...waitingList, newItem]);
    toast.success('Adicionado à lista de espera!');
  };

  const handleCompleteWaiting = (id: string) => {
    setWaitingList(waitingList.filter(w => w.id !== id));
    toast.success('Cliente atendido!');
  };

  const handleSendWhatsApp = (phone: string, name: string) => {
    const msg = `Olá ${name}! Temos uma vaga disponível para bronzeamento. Entre em contato para agendar! 🌞`;
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone) {
      window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const handleAddClick = (time: string) => {
    setNewAppoTime(time);
    setShowAddModal(true);
  };

  // Handle client click from agenda
  const handleClientClickFromAgenda = (clientName: string, phone: string) => {
    // Find client by phone or name
    const client = clients.find(c => c.phone === phone) 
      || clients.find(c => c.name.toLowerCase() === clientName.toLowerCase());
    
    if (client) {
      setHistoryClient(client);
    } else {
      toast.info(`Cliente "${clientName}" não cadastrado. Cadastre na aba Clientes para visualizar o histórico.`);
    }
  };

  // Handle client update from history modal
  const handleUpdateClientFromHistory = (updatedClient: Client) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    setHistoryClient(updatedClient);
    toast.success('Ficha de anamnese salva!');
  };

  // Client handlers
  const handleAddClient = (client: Omit<Client, 'id' | 'createdAt' | 'history'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      history: [],
      createdAt: new Date(),
    };
    setClients([...clients, newClient]);
    toast.success('Cliente cadastrado!');
  };

  const handleEditClient = (client: Client) => {
    setClients(clients.map(c => 
      c.id === client.id ? client : c
    ));
    toast.success('Cliente atualizado!');
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    toast.success('Cliente removido!');
  };

  // Finance handlers
  const handleAddFinance = (finance: Omit<Finance, 'id'>) => {
    const newFinance: Finance = {
      ...finance,
      id: Date.now().toString(),
    };
    setFinances([newFinance, ...finances]);
    toast.success('Transação adicionada!');
  };

  // Stock handlers
  const handleAddStock = (item: Omit<StockItem, 'id'>) => {
    if (editingStock) {
      setStock(stock.map(s => 
        s.id === editingStock.id 
          ? { ...s, ...item }
          : s
      ));
      toast.success('Produto atualizado!');
    } else {
      const newItem: StockItem = {
        ...item,
        id: Date.now().toString(),
      };
      setStock([...stock, newItem]);
      toast.success('Produto cadastrado!');
    }
    setEditingStock(null);
  };

  const handleEditStock = (item: StockItem) => {
    setEditingStock(item);
    setShowStockModal(true);
  };

  const handleDeleteStock = (id: string) => {
    setStock(stock.filter(s => s.id !== id));
    toast.success('Produto removido!');
  };

  const handleAdjustQuantity = (id: string, delta: number) => {
    setStock(stock.map(s => 
      s.id === id 
        ? { ...s, quantity: Math.max(0, s.quantity + delta) }
        : s
    ));
  };

  // Supplier handlers
  const handleAddSupplier = (supplier: Omit<Supplier, 'id'>) => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => 
        s.id === editingSupplier.id 
          ? { ...s, ...supplier }
          : s
      ));
      toast.success('Fornecedor atualizado!');
    } else {
      const newSupplier: Supplier = {
        ...supplier,
        id: Date.now().toString(),
      };
      setSuppliers([...suppliers, newSupplier]);
      toast.success('Fornecedor cadastrado!');
    }
    setEditingSupplier(null);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowSupplierModal(true);
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast.success('Fornecedor removido!');
  };

  // Partnership handlers
  const handleAddPartnership = (partnership: Omit<Partnership, 'id'>) => {
    if (editingPartnership) {
      setPartnerships(partnerships.map(p => 
        p.id === editingPartnership.id 
          ? { ...p, ...partnership }
          : p
      ));
      toast.success('Parceria atualizada!');
    } else {
      const newPartnership: Partnership = {
        ...partnership,
        id: Date.now().toString(),
      };
      setPartnerships([...partnerships, newPartnership]);
      toast.success('Parceria cadastrada!');
    }
    setEditingPartnership(null);
  };

  const handleEditPartnership = (partnership: Partnership) => {
    setEditingPartnership(partnership);
    setShowPartnershipModal(true);
  };

  const handleDeletePartnership = (id: string) => {
    setPartnerships(partnerships.filter(p => p.id !== id));
    toast.success('Parceria removida!');
  };

  // Export backup
  const handleExportBackup = () => {
    const data = {
      appointments,
      clients,
      finances,
      stock,
      suppliers,
      partnerships,
      waitingList,
      config: systemConfig,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bronze-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Backup exportado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background flex font-sans antialiased text-foreground overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        systemName={systemConfig.name}
      />

      <main className="flex-1 flex flex-col md:ml-72 h-screen overflow-hidden relative">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          activeTab={activeTab} 
        />

        <div className="flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar">
          {activeTab === 'agenda' && (
            <AgendaView
              appointments={appointments}
              blocks={blocks}
              stock={stock}
              clients={clients}
              onNavigate={handleTabChange}
              onAddClick={handleAddClick}
              onBlockClick={() => setShowBlockModal(true)}
              onDeleteBlock={handleDeleteBlock}
              onClientClick={handleClientClickFromAgenda}
              pixKey={systemConfig.pixKey}
            />
          )}

          {activeTab === 'clientes' && (
            <ClientsView
              clients={clients}
              tags={systemConfig.clientTags}
              partnerships={partnerships}
              onAddClient={handleAddClient}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
            />
          )}

          {activeTab === 'financeiro' && (
            <FinanceView
              finances={finances}
              onAddFinance={handleAddFinance}
            />
          )}

          {activeTab === 'estoque' && (
            <StockView
              stock={stock}
              onAddClick={() => {
                setEditingStock(null);
                setShowStockModal(true);
              }}
              onEditClick={handleEditStock}
              onDeleteClick={handleDeleteStock}
              onAdjustQuantity={handleAdjustQuantity}
            />
          )}

          {activeTab === 'fornecedores' && (
            <SuppliersView
              suppliers={suppliers}
              onAddClick={() => {
                setEditingSupplier(null);
                setShowSupplierModal(true);
              }}
              onEditClick={handleEditSupplier}
              onDeleteClick={handleDeleteSupplier}
              onSendMessage={handleSendWhatsApp}
            />
          )}

          {activeTab === 'parcerias' && (
            <PartnershipsView
              partnerships={partnerships}
              onAddClick={() => {
                setEditingPartnership(null);
                setShowPartnershipModal(true);
              }}
              onEditClick={handleEditPartnership}
              onDeleteClick={handleDeletePartnership}
              onSendMessage={handleSendWhatsApp}
            />
          )}

          {activeTab === 'lista-espera' && (
            <WaitingListView
              waitingList={waitingList}
              onAddClick={() => setShowWaitlistModal(true)}
              onSendMessage={handleSendWhatsApp}
              onComplete={handleCompleteWaiting}
            />
          )}

          {activeTab === 'config' && (
            <ConfigView
              config={systemConfig}
              onConfigChange={handleConfigChange}
              onExportBackup={handleExportBackup}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {showRestrictedModal && (
        <RestrictedModal onClose={() => setShowRestrictedModal(false)} />
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md animate-slide-up">
          <AddAppointmentModal
            selectedDate={new Date()}
            defaultTime={newAppoTime}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddAppointment}
            stock={stock}
            clients={clients}
            partnerships={partnerships}
          />
        </div>
      )}

      {showBlockModal && (
        <div className="fixed inset-0 bg-background/80 z-[150] flex items-center justify-center p-4 backdrop-blur-md">
          <BlockModal
            selectedDate={new Date()}
            onClose={() => setShowBlockModal(false)}
            onBlock={handleAddBlock}
          />
        </div>
      )}

      {showWaitlistModal && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-center justify-center p-4">
          <WaitlistModal
            onClose={() => setShowWaitlistModal(false)}
            onAdd={handleAddWaiting}
          />
        </div>
      )}

      {showStockModal && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
          <StockModal
            item={editingStock}
            onClose={() => {
              setShowStockModal(false);
              setEditingStock(null);
            }}
            onSave={handleAddStock}
          />
        </div>
      )}

      {showSupplierModal && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
          <SupplierModal
            supplier={editingSupplier}
            onClose={() => {
              setShowSupplierModal(false);
              setEditingSupplier(null);
            }}
            onSave={handleAddSupplier}
          />
        </div>
      )}

      {showPartnershipModal && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
          <PartnershipModal
            partnership={editingPartnership}
            onClose={() => {
              setShowPartnershipModal(false);
              setEditingPartnership(null);
            }}
            onSave={handleAddPartnership}
          />
        </div>
      )}

      {/* Client History Modal from Agenda */}
      {historyClient && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
          <ClientHistoryModal
            client={historyClient}
            tags={systemConfig.clientTags}
            onClose={() => setHistoryClient(null)}
            onUpdateClient={handleUpdateClientFromHistory}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
