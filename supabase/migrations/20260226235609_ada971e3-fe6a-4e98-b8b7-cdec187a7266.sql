
-- Add role for new admin chefe
INSERT INTO user_roles (user_id, role) VALUES ('37e10728-57f2-423d-a1f3-25947af896a2', 'admin_chefe');

-- Set admin chefe password
SELECT public.set_admin_password('37e10728-57f2-423d-a1f3-25947af896a2', '607652');
