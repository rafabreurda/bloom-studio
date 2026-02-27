
-- Add new detailed address fields and other profile fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birthday date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_street text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_neighborhood text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_zip text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_state text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
