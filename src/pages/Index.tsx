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
import { EditAppointmentModal } from '@/components/modals/EditAppointmentModal';
import { BlockModal } from '@/components/modals/BlockModal';
import { WaitlistModal } from '@/components/modals/WaitlistModal';
import { RestrictedModal } from '@/components/modals/RestrictedModal';
import { ClientHistoryModal } from '@/components/clients/ClientHistoryModal';
import { 
  TabId, 
  UserRole, 
  SystemConfig,
  Client,
  StockItem,
  Supplier,
  Partnership,
  Appointment,
} from '@/types';
import { defaultConfig } from '@/data/mockData';

// Import persistence hooks
import { usePartnerships } from '@/hooks/usePartnerships';
import { useClients } from '@/hooks/useClients';
import { useStock } from '@/hooks/useStock';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useAppointments } from '@/hooks/useAppointments';
import { useBlocks } from '@/hooks/useBlocks';
import { useWaitingList } from '@/hooks/useWaitingList';
import { useFinances } from '@/hooks/useFinances';

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
  
  // Use persistence hooks
  const { partnerships, addPartnership, updatePartnership, deletePartnership } = usePartnerships();
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const { stock, addStock, updateStock, deleteStock, adjustQuantity } = useStock();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { blocks, addBlock, deleteBlock } = useBlocks();
  const { waitingList, addWaiting, completeWaiting } = useWaitingList();
  const { finances, addFinance } = useFinances();
  
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
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
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

  const handleAddClick = (time: string) => {
    setNewAppoTime(time);
    setShowAddModal(true);
  };

  // Handle client click from agenda
  const handleClientClickFromAgenda = (clientName: string, phone: string) => {
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
    updateClient(updatedClient);
    setHistoryClient(updatedClient);
  };

  const handleSendWhatsApp = (phone: string, name: string) => {
    const msg = `Olá ${name}! Temos uma vaga disponível para bronzeamento. Entre em contato para agendar! 🌞`;
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone) {
      window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  // Stock handlers
  const handleAddStock = async (item: Omit<StockItem, 'id'>) => {
    if (editingStock) {
      await updateStock({ ...editingStock, ...item });
    } else {
      await addStock(item);
    }
    setEditingStock(null);
    setShowStockModal(false);
  };

  const handleEditStock = (item: StockItem) => {
    setEditingStock(item);
    setShowStockModal(true);
  };

  // Supplier handlers
  const handleAddSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    if (editingSupplier) {
      await updateSupplier({ ...editingSupplier, ...supplier });
    } else {
      await addSupplier(supplier);
    }
    setEditingSupplier(null);
    setShowSupplierModal(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowSupplierModal(true);
  };

  // Partnership handlers
  const handleAddPartnership = async (partnership: Omit<Partnership, 'id'>) => {
    if (editingPartnership) {
      await updatePartnership({ ...editingPartnership, ...partnership });
    } else {
      await addPartnership(partnership);
    }
    setEditingPartnership(null);
    setShowPartnershipModal(false);
  };

  const handleEditPartnership = (partnership: Partnership) => {
    setEditingPartnership(partnership);
    setShowPartnershipModal(true);
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
              onDeleteBlock={deleteBlock}
              onClientClick={handleClientClickFromAgenda}
              onAppointmentClick={(appointment) => setEditingAppointment(appointment)}
              pixKey={systemConfig.pixKey}
            />
          )}

          {activeTab === 'clientes' && (
            <ClientsView
              clients={clients}
              tags={systemConfig.clientTags}
              partnerships={partnerships}
              onAddClient={addClient}
              onEditClient={updateClient}
              onDeleteClient={deleteClient}
            />
          )}

          {activeTab === 'financeiro' && (
            <FinanceView
              finances={finances}
              onAddFinance={addFinance}
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
              onDeleteClick={deleteStock}
              onAdjustQuantity={adjustQuantity}
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
              onDeleteClick={deleteSupplier}
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
              onDeleteClick={deletePartnership}
              onSendMessage={handleSendWhatsApp}
            />
          )}

          {activeTab === 'lista-espera' && (
            <WaitingListView
              waitingList={waitingList}
              onAddClick={() => setShowWaitlistModal(true)}
              onSendMessage={handleSendWhatsApp}
              onComplete={completeWaiting}
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
            onAdd={addAppointment}
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
            onBlock={addBlock}
          />
        </div>
      )}

      {showWaitlistModal && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-center justify-center p-4">
          <WaitlistModal
            onClose={() => setShowWaitlistModal(false)}
            onAdd={addWaiting}
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

      {/* Edit Appointment Modal */}
      {editingAppointment && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md animate-slide-up">
          <EditAppointmentModal
            appointment={editingAppointment}
            onClose={() => setEditingAppointment(null)}
            onSave={updateAppointment}
            onDelete={deleteAppointment}
            stock={stock}
            partnerships={partnerships}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
