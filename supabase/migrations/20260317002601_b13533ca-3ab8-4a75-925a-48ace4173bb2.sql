INSERT INTO admin_permissions (user_id, config)
VALUES ('204f1389-3dc5-461a-b930-b6c4dd79a522', true)
ON CONFLICT (user_id) DO UPDATE SET config = true;