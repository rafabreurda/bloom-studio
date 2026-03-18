
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_seen_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;
