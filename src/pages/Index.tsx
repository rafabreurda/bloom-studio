import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileBottomBar } from '@/components/layout/MobileBottomBar';
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
import { PackagesView } from '@/components/packages/PackagesView';
import { UsersView } from '@/components/users/UsersView';

import { PartnershipModal } from '@/components/partnerships/PartnershipModal';
import { AddAppointmentModal } from '@/components/modals/AddAppointmentModal';
import { EditAppointmentModal } from '@/components/modals/EditAppointmentModal';
import { BlockModal } from '@/components/modals/BlockModal';
import { WaitlistModal } from '@/components/modals/WaitlistModal';
import { RestrictedModal } from '@/components/modals/RestrictedModal';
import { ClientHistoryModal } from '@/components/clients/ClientHistoryModal';
import { ClientModal } from '@/components/clients/ClientModal';
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

import { useSystemConfig } from '@/hooks/useSystemConfig';
import { usePartnerships } from '@/hooks/usePartnerships';
import { useClients } from '@/hooks/useClients';
import { useStock } from '@/hooks/useStock';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useAppointments } from '@/hooks/useAppointments';
import { useBlocks } from '@/hooks/useBlocks';
import { useWaitingList } from '@/hooks/useWaitingList';
import { useFinances } from '@/hooks/useFinances';
import { usePackages } from '@/hooks/usePackages';
import { useAutoClose } from '@/hooks/useAutoClose';
import { VoiceCommandButton } from '@/components/voice/VoiceCommandButton';
import { Mic } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainApp />;
};

const MainApp = () => {
  const { currentAdmin, isAdminChefe } = useAuth();
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('agenda');
  const [currentRole, setCurrentRole] = useState<UserRole>('Admin Mestre');

  // Reset active tab when user changes
  useEffect(() => {
    if (isAdminChefe) {
      setActiveTab('config');
    } else {
      setActiveTab('agenda');
    }
  }, [currentAdmin?.id, isAdminChefe]);
  const [micTrigger, setMicTrigger] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true;
    setIsStandalone(standalone);
  }, []);
  
  // Use persistence hooks
  const { config: systemConfig, updateConfig: handleConfigChange, uploadLogo, uploadBackground } = useSystemConfig();
  const { partnerships, addPartnership, updatePartnership, deletePartnership, refetch: refetchPartnerships } = usePartnerships();
  const { clients, addClient, updateClient, deleteClient, deleteAllClients, syncFromAppointments, refetch: refetchClients } = useClients();
  const { stock, addStock, updateStock, deleteStock, adjustQuantity, refetch: refetchStock } = useStock();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, refetch: refetchSuppliers } = useSuppliers();
  const { appointments, addAppointment, updateAppointment, deleteAppointment, clearAllAppointments, clearAppointmentsByDate, refetch: refetchAppointments } = useAppointments();
  const { blocks, addBlock, deleteBlock } = useBlocks();
  const { waitingList, addWaiting, completeWaiting } = useWaitingList();
  const { finances, addFinance, deleteFinance, refetch: refetchFinances } = useFinances();
  const { packages, addPackage, updatePackage, deletePackage, useSession, refetch: refetchPackages } = usePackages();

  // Birthday alert - only for Admin Chefe
  useEffect(() => {
    if (!isAdminChefe) return;
    const checkBirthdays = async () => {
      const { data: profiles } = await (await import('@/integrations/supabase/client')).supabase
        .from('profiles')
        .select('name, birthday');
      if (!profiles) return;

      const today = new Date();
      const todayDay = today.getDate();
      const todayMonth = today.getMonth() + 1;

      const birthdayUsers = profiles.filter(p => {
        if (!p.birthday) return false;
        const [, month, day] = p.birthday.split('-').map(Number);
        return day === todayDay && month === todayMonth;
      });

      birthdayUsers.forEach(u => {
        toast.success(`🎂 Hoje é aniversário de ${u.name}! Parabéns! 🎉`, { duration: 10000 });
      });
    };
    checkBirthdays();
  }, [isAdminChefe]);

  // Auto-close appointments when next appointment time arrives
  useAutoClose({
    appointments,
    onUpdateAppointment: updateAppointment,
    onAddFinance: addFinance,
  });

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

  // Handlers
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  const handleAddClick = (time: string) => {
    setNewAppoTime(time);
    setShowAddModal(true);
  };

  // State for pre-filled new client registration
  const [newClientFromAgenda, setNewClientFromAgenda] = useState<{ name: string; phone: string } | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);

  // Handle client click from agenda
  const handleClientClickFromAgenda = (clientName: string, phone: string) => {
    const client = clients.find(c => c.phone === phone) 
      || clients.find(c => c.name.toLowerCase() === clientName.toLowerCase());
    
    if (client) {
      setHistoryClient(client);
    } else {
      // Client not registered - open registration modal pre-filled
      setNewClientFromAgenda({ name: clientName, phone });
      setShowClientModal(true);
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
        systemLogo={systemConfig.logo}
      />

      <main className="flex-1 flex flex-col md:ml-72 h-screen overflow-hidden relative">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          activeTab={activeTab} 
        />

        <MobileBottomBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <div className="flex-1 p-4 md:p-10 pb-24 md:pb-10 overflow-y-auto custom-scrollbar">
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
              onClearAll={clearAllAppointments}
              onClearByDate={clearAppointmentsByDate}
              onRefetch={refetchAppointments}
              whatsappTemplates={systemConfig.whatsappTemplates}
            />
          )}

          {activeTab === 'clientes' && (
            <ClientsView
              clients={clients}
              tags={systemConfig.clientTags}
              partnerships={partnerships}
              appointments={appointments}
              whatsappTemplates={systemConfig.whatsappTemplates}
              onAddClient={addClient}
              onEditClient={updateClient}
              onDeleteClient={deleteClient}
              onDeleteAllClients={deleteAllClients}
              onSyncFromAppointments={syncFromAppointments}
              onRefetch={refetchClients}
            />
          )}

          {activeTab === 'pacotes' && (
            <PackagesView
              packages={packages}
              onAdd={addPackage}
              onUpdate={updatePackage}
              onDelete={deletePackage}
              onUseSession={useSession}
              onRefetch={refetchPackages}
            />
          )}

          {activeTab === 'financeiro' && (
            <FinanceView
              finances={finances}
              onAddFinance={addFinance}
              onDeleteFinance={deleteFinance}
              appointments={appointments}
              onRefetch={refetchFinances}
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
              onRefetch={refetchStock}
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
              onRefetch={refetchSuppliers}
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
              onRefetch={refetchPartnerships}
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
              onUploadLogo={uploadLogo}
              onUploadBackground={uploadBackground}
            />
          )}

          {/* Users tab removed - now inside ConfigView */}
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
            serviceTypes={systemConfig.serviceTypes || []}
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
            onSave={async (appointment) => {
              const wasWaiting = editingAppointment?.status === 'Aguardando Sinal';
              const isNowConfirmed = appointment.status === 'Agendado';
              
              await updateAppointment(appointment);
              
              // Create finance entry when status changes to "Agendado" (paid)
              if (wasWaiting && isNowConfirmed && appointment.chargedValue > 0) {
                await addFinance({
                  date: appointment.date,
                  description: `Sessão - ${appointment.clientName}`,
                  type: 'in',
                  value: appointment.chargedValue,
                  paymentMethod: appointment.paymentMethod,
                  category: appointment.isPartnership ? 'partnership' : 'session',
                  isPartnership: appointment.isPartnership,
                });
              }
            }}
            onDelete={deleteAppointment}
            stock={stock}
            partnerships={partnerships}
            serviceTypes={systemConfig.serviceTypes || []}
          />
        </div>
      )}

      {/* Client Registration Modal from Agenda */}
      {showClientModal && (
        <div className="fixed inset-0 bg-background/90 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md animate-slide-up">
          <ClientModal
            client={newClientFromAgenda ? {
              id: '',
              name: newClientFromAgenda.name,
              phone: newClientFromAgenda.phone,
              tags: [],
              isVIP: false,
              history: [],
              createdAt: new Date(),
            } as Client : null}
            tags={systemConfig.clientTags}
            partnerships={partnerships}
            onClose={() => {
              setShowClientModal(false);
              setNewClientFromAgenda(null);
            }}
            onSave={async (clientData) => {
              await addClient(clientData);
              setShowClientModal(false);
              setNewClientFromAgenda(null);
              toast.success('Cliente cadastrada com sucesso!');
            }}
          />
        </div>
      )}

      {/* Voice Command */}
      <VoiceCommandButton
        onAddFinance={addFinance}
        onAddAppointment={addAppointment}
        externalTrigger={micTrigger}
        onStateChange={setIsMicListening}
      />

      {/* Floating Mic FAB - only in standalone/installed mode, responsive sizing */}
      {isStandalone && (
        <button
          onClick={() => setMicTrigger(prev => !prev)}
          className={`fixed z-[80] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300
            bottom-4 right-4 w-12 h-12
            sm:bottom-5 sm:right-5 sm:w-13 sm:h-13
            md:bottom-6 md:right-6 md:w-14 md:h-14
            lg:bottom-8 lg:right-8 lg:w-16 lg:h-16 ${
            isMicListening
              ? 'bg-red-500 animate-pulse'
              : 'bg-primary text-primary-foreground'
          }`}
          style={isMicListening ? { color: 'white' } : undefined}
        >
          <Mic className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
        </button>
      )}
    </div>
  );
};

export default Index;
