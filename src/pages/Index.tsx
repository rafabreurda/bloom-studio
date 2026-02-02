import { useState } from 'react';
import { toast } from 'sonner';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { AgendaView } from '@/components/agenda/AgendaView';
import { FinanceView } from '@/components/finance/FinanceView';
import { WaitingListView } from '@/components/waitinglist/WaitingListView';
import { ConfigView } from '@/components/config/ConfigView';
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
} from '@/types';
import {
  mockAppointments,
  mockBlocks,
  mockWaitingList,
  mockFinances,
  mockStock,
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
  
  // Data state (mock - would be from database in real app)
  const [appointments, setAppointments] = useState(mockAppointments);
  const [blocks, setBlocks] = useState(mockBlocks);
  const [waitingList, setWaitingList] = useState(mockWaitingList);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [newAppoTime, setNewAppoTime] = useState('');

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
              stock={mockStock}
              onNavigate={handleTabChange}
              onAddClick={handleAddClick}
              onBlockClick={() => setShowBlockModal(true)}
              onDeleteBlock={handleDeleteBlock}
              pixKey={systemConfig.pixKey}
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

          {['clientes', 'estoque', 'fornecedores', 'parcerias'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-30 mt-20 font-black uppercase tracking-widest">
              Módulo {activeTab} em Adaptação
            </div>
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
            stock={mockStock}
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
    </div>
  );
};

export default Index;
