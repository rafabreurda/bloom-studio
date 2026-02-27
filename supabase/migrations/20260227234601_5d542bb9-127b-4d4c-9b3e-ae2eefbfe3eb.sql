
-- Add owner_id column to system_config
ALTER TABLE public.system_config ADD COLUMN owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Drop old unique constraint on key only
ALTER TABLE public.system_config DROP CONSTRAINT system_config_key_key;

-- Add new unique constraint on (key, owner_id) so each user has their own config
CREATE UNIQUE INDEX system_config_key_owner_unique ON public.system_config (key, COALESCE(owner_id, '00000000-0000-0000-0000-000000000000'));
