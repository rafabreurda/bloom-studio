
-- Add owner_id column to all data tables for user data isolation
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.finances ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.stock ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.partnerships ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.waiting_list ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.blocks ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_owner ON public.appointments(owner_id);
CREATE INDEX IF NOT EXISTS idx_clients_owner ON public.clients(owner_id);
CREATE INDEX IF NOT EXISTS idx_finances_owner ON public.finances(owner_id);
CREATE INDEX IF NOT EXISTS idx_stock_owner ON public.stock(owner_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_owner ON public.suppliers(owner_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_owner ON public.partnerships(owner_id);
CREATE INDEX IF NOT EXISTS idx_packages_owner ON public.packages(owner_id);
CREATE INDEX IF NOT EXISTS idx_waiting_list_owner ON public.waiting_list(owner_id);
CREATE INDEX IF NOT EXISTS idx_blocks_owner ON public.blocks(owner_id);
