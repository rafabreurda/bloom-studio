-- Add phone column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- Update email to be nullable (no longer required)
-- Email is already nullable, so no change needed