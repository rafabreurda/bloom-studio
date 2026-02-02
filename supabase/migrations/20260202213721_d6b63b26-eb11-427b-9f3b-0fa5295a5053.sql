-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Recreate the set_admin_password function with proper schema reference
CREATE OR REPLACE FUNCTION public.set_admin_password(_user_id UUID, _password TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET password_hash = extensions.crypt(_password, extensions.gen_salt('bf')),
      updated_at = now()
  WHERE id = _user_id;
END;
$$;

-- Recreate verify_admin_password with proper schema reference
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
    RETURN TRUE;
  END IF;
  
  RETURN stored_hash = extensions.crypt(_password, stored_hash);
END;
$$;

-- Now insert the Admin Chefe
INSERT INTO public.profiles (name, email)
VALUES ('Rafael', NULL);

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin_chefe'::admin_role
FROM public.profiles
WHERE name = 'Rafael';

-- Set the password
SELECT public.set_admin_password(
  (SELECT id FROM public.profiles WHERE name = 'Rafael'),
  '607652'
);