-- =============================================
-- TABELA: PARCERIAS (Partnerships)
-- =============================================
CREATE TABLE public.partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  discount INTEGER NOT NULL DEFAULT 0,
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parcerias são visíveis publicamente" ON public.partnerships FOR SELECT USING (true);
CREATE POLICY "Parcerias podem ser inseridas publicamente" ON public.partnerships FOR INSERT WITH CHECK (true);
CREATE POLICY "Parcerias podem ser atualizadas publicamente" ON public.partnerships FOR UPDATE USING (true);
CREATE POLICY "Parcerias podem ser deletadas publicamente" ON public.partnerships FOR DELETE USING (true);

-- =============================================
-- TABELA: CLIENTES (Clients)
-- =============================================
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  birthday DATE,
  cpf TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  is_vip BOOLEAN NOT NULL DEFAULT false,
  partnership_id UUID REFERENCES public.partnerships(id) ON DELETE SET NULL,
  anamnesis_history JSONB DEFAULT '[]',
  history JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes são visíveis publicamente" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Clientes podem ser inseridos publicamente" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Clientes podem ser atualizados publicamente" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Clientes podem ser deletados publicamente" ON public.clients FOR DELETE USING (true);

-- =============================================
-- TABELA: ESTOQUE (Stock)
-- =============================================
CREATE TABLE public.stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estoque é visível publicamente" ON public.stock FOR SELECT USING (true);
CREATE POLICY "Estoque pode ser inserido publicamente" ON public.stock FOR INSERT WITH CHECK (true);
CREATE POLICY "Estoque pode ser atualizado publicamente" ON public.stock FOR UPDATE USING (true);
CREATE POLICY "Estoque pode ser deletado publicamente" ON public.stock FOR DELETE USING (true);

-- =============================================
-- TABELA: FORNECEDORES (Suppliers)
-- =============================================
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  products TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fornecedores são visíveis publicamente" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Fornecedores podem ser inseridos publicamente" ON public.suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Fornecedores podem ser atualizados publicamente" ON public.suppliers FOR UPDATE USING (true);
CREATE POLICY "Fornecedores podem ser deletados publicamente" ON public.suppliers FOR DELETE USING (true);

-- =============================================
-- TABELA: AGENDAMENTOS (Appointments)
-- =============================================
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Agendado',
  value DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  products_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  charged_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  tags TEXT[] DEFAULT '{}',
  is_confirmed BOOLEAN NOT NULL DEFAULT false,
  is_partnership BOOLEAN NOT NULL DEFAULT false,
  partnership_id UUID REFERENCES public.partnerships(id) ON DELETE SET NULL,
  partnership_name TEXT,
  partnership_discount INTEGER,
  products JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agendamentos são visíveis publicamente" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Agendamentos podem ser inseridos publicamente" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Agendamentos podem ser atualizados publicamente" ON public.appointments FOR UPDATE USING (true);
CREATE POLICY "Agendamentos podem ser deletados publicamente" ON public.appointments FOR DELETE USING (true);

-- =============================================
-- TABELA: BLOQUEIOS (Blocks)
-- =============================================
CREATE TABLE public.blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  end_date DATE,
  time TEXT,
  type TEXT NOT NULL DEFAULT 'timeRange',
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bloqueios são visíveis publicamente" ON public.blocks FOR SELECT USING (true);
CREATE POLICY "Bloqueios podem ser inseridos publicamente" ON public.blocks FOR INSERT WITH CHECK (true);
CREATE POLICY "Bloqueios podem ser atualizados publicamente" ON public.blocks FOR UPDATE USING (true);
CREATE POLICY "Bloqueios podem ser deletados publicamente" ON public.blocks FOR DELETE USING (true);

-- =============================================
-- TABELA: LISTA DE ESPERA (Waiting List)
-- =============================================
CREATE TABLE public.waiting_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  desired_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Aguardando',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lista de espera é visível publicamente" ON public.waiting_list FOR SELECT USING (true);
CREATE POLICY "Lista de espera pode ser inserida publicamente" ON public.waiting_list FOR INSERT WITH CHECK (true);
CREATE POLICY "Lista de espera pode ser atualizada publicamente" ON public.waiting_list FOR UPDATE USING (true);
CREATE POLICY "Lista de espera pode ser deletada publicamente" ON public.waiting_list FOR DELETE USING (true);

-- =============================================
-- TABELA: FINANÇAS (Finances)
-- =============================================
CREATE TABLE public.finances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  category TEXT NOT NULL,
  is_partnership BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Finanças são visíveis publicamente" ON public.finances FOR SELECT USING (true);
CREATE POLICY "Finanças podem ser inseridas publicamente" ON public.finances FOR INSERT WITH CHECK (true);
CREATE POLICY "Finanças podem ser atualizadas publicamente" ON public.finances FOR UPDATE USING (true);
CREATE POLICY "Finanças podem ser deletadas publicamente" ON public.finances FOR DELETE USING (true);

-- =============================================
-- TABELA: CONFIGURAÇÕES DO SISTEMA
-- =============================================
CREATE TABLE public.system_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Configurações são visíveis publicamente" ON public.system_config FOR SELECT USING (true);
CREATE POLICY "Configurações podem ser inseridas publicamente" ON public.system_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Configurações podem ser atualizadas publicamente" ON public.system_config FOR UPDATE USING (true);

-- =============================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================
CREATE TRIGGER update_partnerships_updated_at BEFORE UPDATE ON public.partnerships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stock_updated_at BEFORE UPDATE ON public.stock FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON public.system_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();