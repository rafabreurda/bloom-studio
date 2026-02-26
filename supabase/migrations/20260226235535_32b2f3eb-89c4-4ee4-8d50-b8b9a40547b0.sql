
-- Remove duplicate Rosangela profile (admin_pleno)
DELETE FROM user_roles WHERE user_id = 'f4826d4d-dc78-4f0c-8a33-6f90fb00fa6d';
DELETE FROM admin_permissions WHERE user_id = 'f4826d4d-dc78-4f0c-8a33-6f90fb00fa6d';
DELETE FROM profiles WHERE id = 'f4826d4d-dc78-4f0c-8a33-6f90fb00fa6d';

-- Update Rosangela profile: rename and change role to admin_pleno
UPDATE profiles SET name = 'Rosangela Stapasolla', phone = '54999282801' WHERE id = '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b';
UPDATE user_roles SET role = 'admin_pleno' WHERE user_id = '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b';

-- Set Rosangela's password to 061178
SELECT public.set_admin_password('90b0a703-9dc0-4d3d-a4bd-eca45fdf255b', '061178');

-- Create Admin Chefe profile
INSERT INTO profiles (id, name, phone) VALUES (gen_random_uuid(), 'Administrador', '80858252015')
RETURNING id;
