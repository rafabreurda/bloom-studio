-- 1. Criar enum para roles de admin
CREATE TYPE public.admin_role AS ENUM ('admin_chefe', 'admin_pleno', 'admin_junior');

-- 2. Criar tabela de profiles (sem role - role fica separado)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    password_hash TEXT, -- Apenas Admin Chefe terá senha
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Criar tabela de roles separada (segurança)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role admin_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 4. Criar tabela de permissões granulares para Admin Junior
CREATE TABLE public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    agenda BOOLEAN NOT NULL DEFAULT true,
    clientes BOOLEAN NOT NULL DEFAULT true,
    estoque BOOLEAN NOT NULL DEFAULT true,
    lista_espera BOOLEAN NOT NULL DEFAULT true,
    financeiro BOOLEAN NOT NULL DEFAULT false,
    fornecedores BOOLEAN NOT NULL DEFAULT false,
    parcerias BOOLEAN NOT NULL DEFAULT false,
    config BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Função para verificar role (SECURITY DEFINER para evitar recursão RLS)
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id UUID, _role admin_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 6. Função para verificar se é admin chefe
CREATE OR REPLACE FUNCTION public.is_admin_chefe(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_admin_role(_user_id, 'admin_chefe')
$$;

-- 7. Função para verificar senha (usando pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.verify_admin_password(_user_id UUID, _password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash
  FROM public.profiles
  WHERE id = _user_id;
  
  IF stored_hash IS NULL THEN
    RETURN TRUE; -- Sem senha = acesso direto
  END IF;
  
  RETURN stored_hash = crypt(_password, stored_hash);
END;
$$;

-- 8. Função para criar/atualizar senha com hash
CREATE OR REPLACE FUNCTION public.set_admin_password(_user_id UUID, _password TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET password_hash = crypt(_password, gen_salt('bf')),
      updated_at = now()
  WHERE id = _user_id;
END;
$$;

-- 9. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- 10. Políticas RLS - Acesso público para leitura (sistema interno sem auth.users)
CREATE POLICY "Profiles são visíveis publicamente" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Profiles podem ser inseridos publicamente" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Profiles podem ser atualizados publicamente" 
ON public.profiles 
FOR UPDATE 
USING (true);

CREATE POLICY "Profiles podem ser deletados publicamente" 
ON public.profiles 
FOR DELETE 
USING (true);

CREATE POLICY "Roles são visíveis publicamente" 
ON public.user_roles 
FOR SELECT 
USING (true);

CREATE POLICY "Roles podem ser inseridos publicamente" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Roles podem ser deletados publicamente" 
ON public.user_roles 
FOR DELETE 
USING (true);

CREATE POLICY "Permissions são visíveis publicamente" 
ON public.admin_permissions 
FOR SELECT 
USING (true);

CREATE POLICY "Permissions podem ser inseridas publicamente" 
ON public.admin_permissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permissions podem ser atualizadas publicamente" 
ON public.admin_permissions 
FOR UPDATE 
USING (true);

CREATE POLICY "Permissions podem ser deletadas publicamente" 
ON public.admin_permissions 
FOR DELETE 
USING (true);

-- 11. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_permissions_updated_at
BEFORE UPDATE ON public.admin_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();