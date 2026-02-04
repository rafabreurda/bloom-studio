import { useState } from 'react';
import { Plus, TrendingUp, CreditCard, Banknote, Handshake, DollarSign, FileText } from 'lucide-react';
import { BronzeCard } from '@/components/ui/BronzeCard';
import { BronzeButton } from '@/components/ui/BronzeButton';
import { Finance } from '@/types';
import { ReportModal } from './ReportModal';
import { FinanceModal } from './FinanceModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface FinanceViewProps {
  finances: Finance[];
  onAddFinance: (finance: Omit<Finance, 'id'>) => void;
}

export function FinanceView({ finances, onAddFinance }: FinanceViewProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const totalReceita = finances.filter(f => f.type === 'in').reduce((sum, f) => sum + f.value, 0);
  const totalCartao = finances.filter(f => f.type === 'in' && f.paymentMethod === 'Cartão').reduce((sum, f) => sum + f.value, 0);
  const totalPix = finances.filter(f => f.type === 'in' && f.paymentMethod === 'Pix').reduce((sum, f) => sum + f.value, 0);
  const totalDinheiro = finances.filter(f => f.type === 'in' && f.paymentMethod === 'Dinheiro').reduce((sum, f) => sum + f.value, 0);
  const totalParcerias = finances.filter(f => f.isPartnership).reduce((sum, f) => sum + f.value, 0);
  const evolutionData = [{ month: 'Ago', valor: 3200 }, { month: 'Set', valor: 4100 }, { month: 'Out', valor: 3800 }, { month: 'Nov', valor: 4500 }, { month: 'Dez', valor: 5200 }, { month: 'Jan', valor: totalReceita }];
  const paymentData = [{ name: 'Pix', value: totalPix, color: '#f59e0b' }, { name: 'Cartão', value: totalCartao, color: '#3b82f6' }, { name: 'Dinheiro', value: totalDinheiro, color: '#10b981' }].filter(d => d.value > 0);
  const totalSessions = finances.filter(f => f.category === 'session').reduce((sum, f) => sum + f.value, 0);
  const totalProducts = finances.filter(f => f.category === 'product').reduce((sum, f) => sum + f.value, 0);
  const categoryData = [{ name: 'Sessões', valor: totalSessions }, { name: 'Produtos', valor: totalProducts }];
  const summaryCards = [{ label: 'Receita', value: totalReceita, icon: DollarSign, color: 'text-primary' }, { label: 'Cartão', value: totalCartao, icon: CreditCard, color: 'text-blue-500' }, { label: 'Pix', value: totalPix, icon: TrendingUp, color: 'text-amber-500' }, { label: 'Dinheiro', value: totalDinheiro, icon: Banknote, color: 'text-emerald-500' }, { label: 'Parcerias', value: totalParcerias, icon: Handshake, color: 'text-purple-500' }];

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tight">Financeiro</h2>
        <div className="flex gap-2">
          <BronzeButton variant="secondary" icon={FileText} size="sm" onClick={() => setShowReportModal(true)}>Relatório</BronzeButton>
          <BronzeButton variant="gold" icon={Plus} size="sm" onClick={() => setShowFinanceModal(true)}>Nova Entrada</BronzeButton>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-6 pr-2">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">{summaryCards.map((card, i) => (<BronzeCard key={i} className="bg-secondary/50 p-4 text-center"><div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-background mb-2 ${card.color}`}><card.icon size={20} /></div><p className="text-[10px] font-black uppercase text-muted-foreground">{card.label}</p><p className="text-lg font-black">R$ {card.value.toLocaleString('pt-BR')}</p></BronzeCard>))}</div>
        <div className="grid md:grid-cols-2 gap-4">
          <BronzeCard className="bg-secondary/50 p-4"><h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Evolução (6 meses)</h3><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={evolutionData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="month" stroke="#666" fontSize={10} /><YAxis stroke="#666" fontSize={10} /><Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} /><Line type="monotone" dataKey="valor" stroke="#f59e0b" strokeWidth={3} /></LineChart></ResponsiveContainer></div></BronzeCard>
          <BronzeCard className="bg-secondary/50 p-4"><h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Pagamentos</h3><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={paymentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">{paymentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} /></PieChart></ResponsiveContainer></div></BronzeCard>
        </div>
        <BronzeCard className="bg-secondary/50 p-4"><h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Sessões vs Produtos</h3><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={categoryData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="name" stroke="#666" /><YAxis stroke="#666" fontSize={10} /><Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} /><Bar dataKey="valor" fill="#f59e0b" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></BronzeCard>
        <BronzeCard className="bg-secondary/50"><h3 className="text-sm font-black uppercase text-muted-foreground mb-4">Últimas Transações</h3><div className="space-y-2">{finances.slice(0, 10).map(f => (<div key={f.id} className={`flex items-center justify-between p-3 rounded-xl border ${f.type === 'in' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}><div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${f.type === 'in' ? 'bg-emerald-500' : 'bg-red-500'}`} /><div><p className="text-sm font-bold">{f.description}</p><p className="text-xs text-muted-foreground">{f.date} • {f.paymentMethod}</p></div></div><span className={`font-black ${f.type === 'in' ? 'text-emerald-500' : 'text-red-500'}`}>{f.type === 'in' ? '+' : '-'}R$ {f.value}</span></div>))}</div></BronzeCard>
      </div>
      {showReportModal && <ReportModal finances={finances} onClose={() => setShowReportModal(false)} />}
      {showFinanceModal && <FinanceModal onClose={() => setShowFinanceModal(false)} onSave={onAddFinance} />}
    </div>
  );
}