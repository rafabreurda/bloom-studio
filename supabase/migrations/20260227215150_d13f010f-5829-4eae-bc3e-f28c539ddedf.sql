
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS studio_name text,
ADD COLUMN IF NOT EXISTS studio_logo text,
ADD COLUMN IF NOT EXISTS background_photo text;
