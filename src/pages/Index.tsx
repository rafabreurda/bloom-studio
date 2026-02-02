import { useState } from 'react';
import { toast } from 'sonner';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { AgendaView } from '@/components/agenda/AgendaView';
import { FinanceView } from '@/components/finance/FinanceView';
import { WaitingListView } from '@/components/waitinglist/WaitingListView';
import { ConfigView } from '@/components/config/ConfigView';
import { ClientsView } from '@/components/clients/ClientsView';
import { ClientModal } from '@/components/clients/ClientModal';
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
  chartEvolutionData,
  chartDistributionData,
  chartMixData,
} from '@/data/mockData';

const juniorPermissions: TabId[] = ['agenda', 'clientes', 'estoque', 'lista-espera'];

const Index = () => {
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('agenda');
  const [currentRole, setCurrentRole] = useState<UserRole>('Admin Chefe');
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(defaultConfig);
  
  // Data state
  const [appointments, setAppointments] = useState(mockAppointments);
  const [blocks, setBlocks] = useState(mockBlocks);
  const [waitingList, setWaitingList] = useState(mockWaitingList);
  const [clients, setClients] = useState(mockClients);
  const [stock, setStock] = useState(mockStock);
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [partnerships, setPartnerships] = useState(mockPartnerships);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [newAppoTime, setNewAppoTime] = useState('');
  
  // Editing state
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);

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

  // Client handlers
  const handleAddClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    if (editingClient) {
      setClients(clients.map(c => 
        c.id === editingClient.id 
          ? { ...c, ...client }
          : c
      ));
      toast.success('Cliente atualizado!');
    } else {
      const newClient: Client = {
        ...client,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setClients([...clients, newClient]);
      toast.success('Cliente cadastrado!');
    }
    setEditingClient(null);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientModal(true);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    toast.success('Cliente removido!');
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

  return (
    <div className="min-h-screen bg-background flex font-sans antialiased text-foreground overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        currentRole={currentRole}
        systemName={systemConfig.name}
      />

      <main className="flex-1 flex flex-col md:ml-72 h-screen overflow-hidden relative">
        <RoleSwitcher 
          currentRole={currentRole} 
          onRoleChange={setCurrentRole} 
        />
        
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
              onNavigate={handleTabChange}
              onAddClick={handleAddClick}
              onBlockClick={() => setShowBlockModal(true)}
              onDeleteBlock={handleDeleteBlock}
              pixKey={systemConfig.pixKey}
            />
          )}

          {activeTab === 'clientes' && (
            <ClientsView
              clients={clients}
              onAddClick={() => {
                setEditingClient(null);
                setShowClientModal(true);
              }}
              onEditClick={handleEditClient}
              onDeleteClick={handleDeleteClient}
              onSendMessage={handleSendWhatsApp}
            />
          )}

          {activeTab === 'financeiro' && (
            <FinanceView
              finances={mockFinances}
              evolutionData={chartEvolutionData}
              distributionData={chartDistributionData}
              mixData={chartMixData}
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
              onConfigChange={setSystemConfig}
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

      {showClientModal && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
          <ClientModal
            client={editingClient}
            onClose={() => {
              setShowClientModal(false);
              setEditingClient(null);
            }}
            onSave={handleAddClient}
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
    </div>
  );
};

export default Index;