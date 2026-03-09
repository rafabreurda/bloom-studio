
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE for all tables

-- profiles
DROP POLICY IF EXISTS "Profiles são visíveis publicamente" ON public.profiles;
DROP POLICY IF EXISTS "Profiles podem ser inseridos publicamente" ON public.profiles;
DROP POLICY IF EXISTS "Profiles podem ser atualizados publicamente" ON public.profiles;
DROP POLICY IF EXISTS "Profiles podem ser deletados publicamente" ON public.profiles;

CREATE POLICY "Profiles são visíveis publicamente" ON public.profiles FOR SELECT TO public USING (true);
CREATE POLICY "Profiles podem ser inseridos publicamente" ON public.profiles FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Profiles podem ser atualizados publicamente" ON public.profiles FOR UPDATE TO public USING (true);
CREATE POLICY "Profiles podem ser deletados publicamente" ON public.profiles FOR DELETE TO public USING (true);

-- user_roles
DROP POLICY IF EXISTS "Roles são visíveis publicamente" ON public.user_roles;
DROP POLICY IF EXISTS "Roles podem ser inseridos publicamente" ON public.user_roles;
DROP POLICY IF EXISTS "Roles podem ser deletados publicamente" ON public.user_roles;

CREATE POLICY "Roles são visíveis publicamente" ON public.user_roles FOR SELECT TO public USING (true);
CREATE POLICY "Roles podem ser inseridos publicamente" ON public.user_roles FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Roles podem ser deletados publicamente" ON public.user_roles FOR DELETE TO public USING (true);
CREATE POLICY "Roles podem ser atualizados publicamente" ON public.user_roles FOR UPDATE TO public USING (true);

-- admin_permissions
DROP POLICY IF EXISTS "Permissions são visíveis publicamente" ON public.admin_permissions;
DROP POLICY IF EXISTS "Permissions podem ser inseridas publicamente" ON public.admin_permissions;
DROP POLICY IF EXISTS "Permissions podem ser atualizadas publicamente" ON public.admin_permissions;
DROP POLICY IF EXISTS "Permissions podem ser deletadas publicamente" ON public.admin_permissions;

CREATE POLICY "Permissions são visíveis publicamente" ON public.admin_permissions FOR SELECT TO public USING (true);
CREATE POLICY "Permissions podem ser inseridas publicamente" ON public.admin_permissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Permissions podem ser atualizadas publicamente" ON public.admin_permissions FOR UPDATE TO public USING (true);
CREATE POLICY "Permissions podem ser deletadas publicamente" ON public.admin_permissions FOR DELETE TO public USING (true);

-- system_config
DROP POLICY IF EXISTS "Configurações são visíveis publicamente" ON public.system_config;
DROP POLICY IF EXISTS "Configurações podem ser inseridas publicamente" ON public.system_config;
DROP POLICY IF EXISTS "Configurações podem ser atualizadas publicamente" ON public.system_config;

CREATE POLICY "Configurações são visíveis publicamente" ON public.system_config FOR SELECT TO public USING (true);
CREATE POLICY "Configurações podem ser inseridas publicamente" ON public.system_config FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Configurações podem ser atualizadas publicamente" ON public.system_config FOR UPDATE TO public USING (true);
CREATE POLICY "Configurações podem ser deletadas publicamente" ON public.system_config FOR DELETE TO public USING (true);

-- appointments
DROP POLICY IF EXISTS "Agendamentos são visíveis publicamente" ON public.appointments;
DROP POLICY IF EXISTS "Agendamentos podem ser inseridos publicamente" ON public.appointments;
DROP POLICY IF EXISTS "Agendamentos podem ser atualizados publicamente" ON public.appointments;
DROP POLICY IF EXISTS "Agendamentos podem ser deletados publicamente" ON public.appointments;

CREATE POLICY "Agendamentos são visíveis publicamente" ON public.appointments FOR SELECT TO public USING (true);
CREATE POLICY "Agendamentos podem ser inseridos publicamente" ON public.appointments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Agendamentos podem ser atualizados publicamente" ON public.appointments FOR UPDATE TO public USING (true);
CREATE POLICY "Agendamentos podem ser deletados publicamente" ON public.appointments FOR DELETE TO public USING (true);

-- clients
DROP POLICY IF EXISTS "Clientes são visíveis publicamente" ON public.clients;
DROP POLICY IF EXISTS "Clientes podem ser inseridos publicamente" ON public.clients;
DROP POLICY IF EXISTS "Clientes podem ser atualizados publicamente" ON public.clients;
DROP POLICY IF EXISTS "Clientes podem ser deletados publicamente" ON public.clients;

CREATE POLICY "Clientes são visíveis publicamente" ON public.clients FOR SELECT TO public USING (true);
CREATE POLICY "Clientes podem ser inseridos publicamente" ON public.clients FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Clientes podem ser atualizados publicamente" ON public.clients FOR UPDATE TO public USING (true);
CREATE POLICY "Clientes podem ser deletados publicamente" ON public.clients FOR DELETE TO public USING (true);

-- finances
DROP POLICY IF EXISTS "Finanças são visíveis publicamente" ON public.finances;
DROP POLICY IF EXISTS "Finanças podem ser inseridas publicamente" ON public.finances;
DROP POLICY IF EXISTS "Finanças podem ser atualizadas publicamente" ON public.finances;
DROP POLICY IF EXISTS "Finanças podem ser deletadas publicamente" ON public.finances;

CREATE POLICY "Finanças são visíveis publicamente" ON public.finances FOR SELECT TO public USING (true);
CREATE POLICY "Finanças podem ser inseridas publicamente" ON public.finances FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Finanças podem ser atualizadas publicamente" ON public.finances FOR UPDATE TO public USING (true);
CREATE POLICY "Finanças podem ser deletadas publicamente" ON public.finances FOR DELETE TO public USING (true);

-- stock
DROP POLICY IF EXISTS "Estoque é visível publicamente" ON public.stock;
DROP POLICY IF EXISTS "Estoque pode ser inserido publicamente" ON public.stock;
DROP POLICY IF EXISTS "Estoque pode ser atualizado publicamente" ON public.stock;
DROP POLICY IF EXISTS "Estoque pode ser deletado publicamente" ON public.stock;

CREATE POLICY "Estoque é visível publicamente" ON public.stock FOR SELECT TO public USING (true);
CREATE POLICY "Estoque pode ser inserido publicamente" ON public.stock FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Estoque pode ser atualizado publicamente" ON public.stock FOR UPDATE TO public USING (true);
CREATE POLICY "Estoque pode ser deletado publicamente" ON public.stock FOR DELETE TO public USING (true);

-- packages
DROP POLICY IF EXISTS "Pacotes são visíveis publicamente" ON public.packages;
DROP POLICY IF EXISTS "Pacotes podem ser inseridos publicamente" ON public.packages;
DROP POLICY IF EXISTS "Pacotes podem ser atualizados publicamente" ON public.packages;
DROP POLICY IF EXISTS "Pacotes podem ser deletados publicamente" ON public.packages;

CREATE POLICY "Pacotes são visíveis publicamente" ON public.packages FOR SELECT TO public USING (true);
CREATE POLICY "Pacotes podem ser inseridos publicamente" ON public.packages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Pacotes podem ser atualizados publicamente" ON public.packages FOR UPDATE TO public USING (true);
CREATE POLICY "Pacotes podem ser deletados publicamente" ON public.packages FOR DELETE TO public USING (true);

-- partnerships
DROP POLICY IF EXISTS "Parcerias são visíveis publicamente" ON public.partnerships;
DROP POLICY IF EXISTS "Parcerias podem ser inseridas publicamente" ON public.partnerships;
DROP POLICY IF EXISTS "Parcerias podem ser atualizadas publicamente" ON public.partnerships;
DROP POLICY IF EXISTS "Parcerias podem ser deletadas publicamente" ON public.partnerships;

CREATE POLICY "Parcerias são visíveis publicamente" ON public.partnerships FOR SELECT TO public USING (true);
CREATE POLICY "Parcerias podem ser inseridas publicamente" ON public.partnerships FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Parcerias podem ser atualizadas publicamente" ON public.partnerships FOR UPDATE TO public USING (true);
CREATE POLICY "Parcerias podem ser deletadas publicamente" ON public.partnerships FOR DELETE TO public USING (true);

-- suppliers
DROP POLICY IF EXISTS "Fornecedores são visíveis publicamente" ON public.suppliers;
DROP POLICY IF EXISTS "Fornecedores podem ser inseridos publicamente" ON public.suppliers;
DROP POLICY IF EXISTS "Fornecedores podem ser atualizados publicamente" ON public.suppliers;
DROP POLICY IF EXISTS "Fornecedores podem ser deletados publicamente" ON public.suppliers;

CREATE POLICY "Fornecedores são visíveis publicamente" ON public.suppliers FOR SELECT TO public USING (true);
CREATE POLICY "Fornecedores podem ser inseridos publicamente" ON public.suppliers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Fornecedores podem ser atualizados publicamente" ON public.suppliers FOR UPDATE TO public USING (true);
CREATE POLICY "Fornecedores podem ser deletados publicamente" ON public.suppliers FOR DELETE TO public USING (true);

-- waiting_list
DROP POLICY IF EXISTS "Lista de espera é visível publicamente" ON public.waiting_list;
DROP POLICY IF EXISTS "Lista de espera pode ser inserida publicamente" ON public.waiting_list;
DROP POLICY IF EXISTS "Lista de espera pode ser atualizada publicamente" ON public.waiting_list;
DROP POLICY IF EXISTS "Lista de espera pode ser deletada publicamente" ON public.waiting_list;

CREATE POLICY "Lista de espera é visível publicamente" ON public.waiting_list FOR SELECT TO public USING (true);
CREATE POLICY "Lista de espera pode ser inserida publicamente" ON public.waiting_list FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Lista de espera pode ser atualizada publicamente" ON public.waiting_list FOR UPDATE TO public USING (true);
CREATE POLICY "Lista de espera pode ser deletada publicamente" ON public.waiting_list FOR DELETE TO public USING (true);

-- blocks
DROP POLICY IF EXISTS "Bloqueios são visíveis publicamente" ON public.blocks;
DROP POLICY IF EXISTS "Bloqueios podem ser inseridos publicamente" ON public.blocks;
DROP POLICY IF EXISTS "Bloqueios podem ser atualizados publicamente" ON public.blocks;
DROP POLICY IF EXISTS "Bloqueios podem ser deletados publicamente" ON public.blocks;

CREATE POLICY "Bloqueios são visíveis publicamente" ON public.blocks FOR SELECT TO public USING (true);
CREATE POLICY "Bloqueios podem ser inseridos publicamente" ON public.blocks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Bloqueios podem ser atualizados publicamente" ON public.blocks FOR UPDATE TO public USING (true);
CREATE POLICY "Bloqueios podem ser deletados publicamente" ON public.blocks FOR DELETE TO public USING (true);

-- plans
DROP POLICY IF EXISTS "Planos são visíveis publicamente" ON public.plans;
DROP POLICY IF EXISTS "Planos podem ser inseridos publicamente" ON public.plans;
DROP POLICY IF EXISTS "Planos podem ser atualizados publicamente" ON public.plans;
DROP POLICY IF EXISTS "Planos podem ser deletados publicamente" ON public.plans;

CREATE POLICY "Planos são visíveis publicamente" ON public.plans FOR SELECT TO public USING (true);
CREATE POLICY "Planos podem ser inseridos publicamente" ON public.plans FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Planos podem ser atualizados publicamente" ON public.plans FOR UPDATE TO public USING (true);
CREATE POLICY "Planos podem ser deletados publicamente" ON public.plans FOR DELETE TO public USING (true);
