
-- Add password_display column for admin viewing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_display text;

-- Set existing passwords display values
UPDATE profiles SET password_display = '061178' WHERE id = '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b';
UPDATE profiles SET password_display = '607652' WHERE id = '37e10728-57f2-423d-a1f3-25947af896a2';
