ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS address_number text,
  ADD COLUMN IF NOT EXISTS address_type text,
  ADD COLUMN IF NOT EXISTS address_state text;