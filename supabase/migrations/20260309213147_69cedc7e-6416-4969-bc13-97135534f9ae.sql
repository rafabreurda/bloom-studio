
-- Drop ALL existing restrictive policies and recreate as PERMISSIVE for all tables

-- PROFILES
DROP POLICY IF EXISTS "Profiles são visíveis publicamente" ON public.profiles;
DROP POLICY IF EXISTS "Profiles podem ser inseridos publicamente" ON public.profiles;
DROP POLICY IF EXISTS "Profiles podem ser atualizados publicamente" ON public.profiles;
DROP POLICY IF EXISTS "Profiles podem ser deletados publicamente" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE USING (true);

-- USER_ROLES
DROP POLICY IF EXISTS "Roles são visíveis publicamente" ON public.user_roles;
DROP POLICY IF EXISTS "Roles podem ser inseridos publicamente" ON public.user_roles;
DROP POLICY IF EXISTS "Roles podem ser atualizados publicamente" ON public.user_roles;
DROP POLICY IF EXISTS "Roles podem ser deletados publicamente" ON public.user_roles;

CREATE POLICY "roles_select" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "roles_insert" ON public.user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "roles_update" ON public.user_roles FOR UPDATE USING (true);
CREATE POLICY "roles_delete" ON public.user_roles FOR DELETE USING (true);

-- ADMIN_PERMISSIONS
DROP POLICY IF EXISTS "Permissions são visíveis publicamente" ON public.admin_permissions;
DROP POLICY IF EXISTS "Permissions podem ser inseridas publicamente" ON public.admin_permissions;
DROP POLICY IF EXISTS "Permissions podem ser atualizadas publicamente" ON public.admin_permissions;
DROP POLICY IF EXISTS "Permissions podem ser deletadas publicamente" ON public.admin_permissions;

CREATE POLICY "perms_select" ON public.admin_permissions FOR SELECT USING (true);
CREATE POLICY "perms_insert" ON public.admin_permissions FOR INSERT WITH CHECK (true);
CREATE POLICY "perms_update" ON public.admin_permissions FOR UPDATE USING (true);
CREATE POLICY "perms_delete" ON public.admin_permissions FOR DELETE USING (true);

-- APPOINTMENTS
DROP POLICY IF EXISTS "Agendamentos são visíveis publicamente" ON public.appointments;
DROP POLICY IF EXISTS "Agendamentos podem ser inseridos publicamente" ON public.appointments;
DROP POLICY IF EXISTS "Agendamentos podem ser atualizados publicamente" ON public.appointments;
DROP POLICY IF EXISTS "Agendamentos podem ser deletados publicamente" ON public.appointments;

CREATE POLICY "appt_select" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "appt_insert" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "appt_update" ON public.appointments FOR UPDATE USING (true);
CREATE POLICY "appt_delete" ON public.appointments FOR DELETE USING (true);

-- CLIENTS
DROP POLICY IF EXISTS "Clientes são visíveis publicamente" ON public.clients;
DROP POLICY IF EXISTS "Clientes podem ser inseridos publicamente" ON public.clients;
DROP POLICY IF EXISTS "Clientes podem ser atualizados publicamente" ON public.clients;
DROP POLICY IF EXISTS "Clientes podem ser deletados publicamente" ON public.clients;

CREATE POLICY "clients_select" ON public.clients FOR SELECT USING (true);
CREATE POLICY "clients_insert" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "clients_update" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "clients_delete" ON public.clients FOR DELETE USING (true);

-- FINANCES
DROP POLICY IF EXISTS "Finanças são visíveis publicamente" ON public.finances;
DROP POLICY IF EXISTS "Finanças podem ser inseridas publicamente" ON public.finances;
DROP POLICY IF EXISTS "Finanças podem ser atualizadas publicamente" ON public.finances;
DROP POLICY IF EXISTS "Finanças podem ser deletadas publicamente" ON public.finances;

CREATE POLICY "fin_select" ON public.finances FOR SELECT USING (true);
CREATE POLICY "fin_insert" ON public.finances FOR INSERT WITH CHECK (true);
CREATE POLICY "fin_update" ON public.finances FOR UPDATE USING (true);
CREATE POLICY "fin_delete" ON public.finances FOR DELETE USING (true);

-- STOCK
DROP POLICY IF EXISTS "Estoque é visível publicamente" ON public.stock;
DROP POLICY IF EXISTS "Estoque pode ser inserido publicamente" ON public.stock;
DROP POLICY IF EXISTS "Estoque pode ser atualizado publicamente" ON public.stock;
DROP POLICY IF EXISTS "Estoque pode ser deletado publicamente" ON public.stock;

CREATE POLICY "stock_select" ON public.stock FOR SELECT USING (true);
CREATE POLICY "stock_insert" ON public.stock FOR INSERT WITH CHECK (true);
CREATE POLICY "stock_update" ON public.stock FOR UPDATE USING (true);
CREATE POLICY "stock_delete" ON public.stock FOR DELETE USING (true);

-- PACKAGES
DROP POLICY IF EXISTS "Pacotes são visíveis publicamente" ON public.packages;
DROP POLICY IF EXISTS "Pacotes podem ser inseridos publicamente" ON public.packages;
DROP POLICY IF EXISTS "Pacotes podem ser atualizados publicamente" ON public.packages;
DROP POLICY IF EXISTS "Pacotes podem ser deletados publicamente" ON public.packages;

CREATE POLICY "pkg_select" ON public.packages FOR SELECT USING (true);
CREATE POLICY "pkg_insert" ON public.packages FOR INSERT WITH CHECK (true);
CREATE POLICY "pkg_update" ON public.packages FOR UPDATE USING (true);
CREATE POLICY "pkg_delete" ON public.packages FOR DELETE USING (true);

-- PARTNERSHIPS
DROP POLICY IF EXISTS "Parcerias são visíveis publicamente" ON public.partnerships;
DROP POLICY IF EXISTS "Parcerias podem ser inseridas publicamente" ON public.partnerships;
DROP POLICY IF EXISTS "Parcerias podem ser atualizadas publicamente" ON public.partnerships;
DROP POLICY IF EXISTS "Parcerias podem ser deletadas publicamente" ON public.partnerships;

CREATE POLICY "part_select" ON public.partnerships FOR SELECT USING (true);
CREATE POLICY "part_insert" ON public.partnerships FOR INSERT WITH CHECK (true);
CREATE POLICY "part_update" ON public.partnerships FOR UPDATE USING (true);
CREATE POLICY "part_delete" ON public.partnerships FOR DELETE USING (true);

-- SUPPLIERS
DROP POLICY IF EXISTS "Fornecedores são visíveis publicamente" ON public.suppliers;
DROP POLICY IF EXISTS "Fornecedores podem ser inseridos publicamente" ON public.suppliers;
DROP POLICY IF EXISTS "Fornecedores podem ser atualizados publicamente" ON public.suppliers;
DROP POLICY IF EXISTS "Fornecedores podem ser deletados publicamente" ON public.suppliers;

CREATE POLICY "sup_select" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "sup_insert" ON public.suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "sup_update" ON public.suppliers FOR UPDATE USING (true);
CREATE POLICY "sup_delete" ON public.suppliers FOR DELETE USING (true);

-- WAITING_LIST
DROP POLICY IF EXISTS "Lista de espera é visível publicamente" ON public.waiting_list;
DROP POLICY IF EXISTS "Lista de espera pode ser inserida publicamente" ON public.waiting_list;
DROP POLICY IF EXISTS "Lista de espera pode ser atualizada publicamente" ON public.waiting_list;
DROP POLICY IF EXISTS "Lista de espera pode ser deletada publicamente" ON public.waiting_list;

CREATE POLICY "wl_select" ON public.waiting_list FOR SELECT USING (true);
CREATE POLICY "wl_insert" ON public.waiting_list FOR INSERT WITH CHECK (true);
CREATE POLICY "wl_update" ON public.waiting_list FOR UPDATE USING (true);
CREATE POLICY "wl_delete" ON public.waiting_list FOR DELETE USING (true);

-- BLOCKS
DROP POLICY IF EXISTS "Bloqueios são visíveis publicamente" ON public.blocks;
DROP POLICY IF EXISTS "Bloqueios podem ser inseridos publicamente" ON public.blocks;
DROP POLICY IF EXISTS "Bloqueios podem ser atualizados publicamente" ON public.blocks;
DROP POLICY IF EXISTS "Bloqueios podem ser deletados publicamente" ON public.blocks;

CREATE POLICY "blocks_select" ON public.blocks FOR SELECT USING (true);
CREATE POLICY "blocks_insert" ON public.blocks FOR INSERT WITH CHECK (true);
CREATE POLICY "blocks_update" ON public.blocks FOR UPDATE USING (true);
CREATE POLICY "blocks_delete" ON public.blocks FOR DELETE USING (true);

-- SYSTEM_CONFIG
DROP POLICY IF EXISTS "Configurações são visíveis publicamente" ON public.system_config;
DROP POLICY IF EXISTS "Configurações podem ser inseridas publicamente" ON public.system_config;
DROP POLICY IF EXISTS "Configurações podem ser atualizadas publicamente" ON public.system_config;
DROP POLICY IF EXISTS "Configurações podem ser deletadas publicamente" ON public.system_config;

CREATE POLICY "cfg_select" ON public.system_config FOR SELECT USING (true);
CREATE POLICY "cfg_insert" ON public.system_config FOR INSERT WITH CHECK (true);
CREATE POLICY "cfg_update" ON public.system_config FOR UPDATE USING (true);
CREATE POLICY "cfg_delete" ON public.system_config FOR DELETE USING (true);

-- PLANS
DROP POLICY IF EXISTS "Planos são visíveis publicamente" ON public.plans;
DROP POLICY IF EXISTS "Planos podem ser inseridos publicamente" ON public.plans;
DROP POLICY IF EXISTS "Planos podem ser atualizados publicamente" ON public.plans;
DROP POLICY IF EXISTS "Planos podem ser deletados publicamente" ON public.plans;

CREATE POLICY "plans_select" ON public.plans FOR SELECT USING (true);
CREATE POLICY "plans_insert" ON public.plans FOR INSERT WITH CHECK (true);
CREATE POLICY "plans_update" ON public.plans FOR UPDATE USING (true);
CREATE POLICY "plans_delete" ON public.plans FOR DELETE USING (true);
