-- =============================================
-- DEMO DATA FOR RAFAEL (owner_id: 34fbd8bc-ad70-4f76-a91d-3f253704b46a)
-- =============================================

-- 1. Stock products
INSERT INTO stock (name, quantity, price, min_stock, owner_id) VALUES
  ('Bronzeador Premium Gold', 15, 45.00, 3, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Hidratante Pós-Bronze', 20, 35.00, 5, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Acelerador de Bronzeamento', 12, 55.00, 3, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Esfoliante Corporal', 10, 28.00, 3, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Óleo Bronzeador Tropical', 8, 65.00, 2, '34fbd8bc-ad70-4f76-a91d-3f253704b46a');

-- 2. Clients
INSERT INTO clients (name, phone, is_vip, owner_id) VALUES
  ('Maria Silva', '11999001001', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Ana Costa', '11999002002', true, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Juliana Ferreira', '11999003003', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Camila Santos', '11999004004', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Beatriz Lima', '11999005005', true, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Larissa Oliveira', '11999006006', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Fernanda Souza', '11999007007', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Gabriela Pereira', '11999008008', true, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Isabela Rocha', '11999009009', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('Letícia Almeida', '11999010010', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a');

-- 3. Appointments (Feb = past/concluded, Mar = mix, Apr = future/scheduled)

-- FEBRUARY 2026 - All concluded (past)
INSERT INTO appointments (client_name, phone, date, time, status, value, total_value, products_value, charged_value, cost, payment_method, is_confirmed, is_partnership, owner_id, products) VALUES
  ('Maria Silva', '11999001001', '2026-02-05', '10:00', 'Concluído', 300, 300, 0, 300, 25, 'Pix', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[]'),
  ('Ana Costa', '11999002002', '2026-02-10', '14:00', 'Concluído', 300, 365, 65, 365, 25, 'Cartão', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[{"productId":"demo","name":"Óleo Bronzeador Tropical","quantity":1,"price":65}]'),
  ('Juliana Ferreira', '11999003003', '2026-02-18', '16:00', 'Concluído', 250, 250, 0, 250, 20, 'Dinheiro', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[]');

-- MARCH 2026 - Mix of concluded and scheduled
INSERT INTO appointments (client_name, phone, date, time, status, value, total_value, products_value, charged_value, cost, payment_method, is_confirmed, is_partnership, owner_id, products) VALUES
  ('Camila Santos', '11999004004', '2026-03-03', '09:00', 'Concluído', 300, 335, 35, 335, 25, 'Pix', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[{"productId":"demo","name":"Hidratante Pós-Bronze","quantity":1,"price":35}]'),
  ('Beatriz Lima', '11999005005', '2026-03-10', '11:00', 'Concluído', 350, 350, 0, 350, 30, 'Cartão', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[]'),
  ('Larissa Oliveira', '11999006006', '2026-03-15', '15:00', 'Agendado', 300, 355, 55, 355, 25, 'Pix', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[{"productId":"demo","name":"Acelerador de Bronzeamento","quantity":1,"price":55}]'),
  ('Fernanda Souza', '11999007007', '2026-03-22', '10:00', 'Agendado', 280, 280, 0, 280, 22, 'Dinheiro', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[]');

-- APRIL 2026 - All future/scheduled
INSERT INTO appointments (client_name, phone, date, time, status, value, total_value, products_value, charged_value, cost, payment_method, is_confirmed, is_partnership, owner_id, products) VALUES
  ('Gabriela Pereira', '11999008008', '2026-04-02', '14:00', 'Agendado', 300, 345, 45, 345, 25, 'Pix', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[{"productId":"demo","name":"Bronzeador Premium Gold","quantity":1,"price":45}]'),
  ('Isabela Rocha', '11999009009', '2026-04-10', '16:00', 'Agendado', 350, 385, 35, 385, 30, 'Cartão', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[{"productId":"demo","name":"Hidratante Pós-Bronze","quantity":1,"price":35}]'),
  ('Letícia Almeida', '11999010010', '2026-04-18', '11:00', 'Agendado', 300, 300, 0, 300, 25, 'Pix', true, false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a', '[]');

-- 4. Finance entries for CONCLUDED appointments (Feb + early Mar)
INSERT INTO finances (date, description, type, value, payment_method, category, is_partnership, owner_id) VALUES
  ('2026-02-05', 'Sessão - Maria Silva', 'in', 300, 'Pix', 'session', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('2026-02-10', 'Sessão - Ana Costa', 'in', 300, 'Cartão', 'session', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('2026-02-10', 'Produto - Ana Costa (Óleo Bronzeador Tropical)', 'in', 65, 'Cartão', 'product', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('2026-02-18', 'Sessão - Juliana Ferreira', 'in', 250, 'Dinheiro', 'session', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('2026-03-03', 'Sessão - Camila Santos', 'in', 300, 'Pix', 'session', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('2026-03-03', 'Produto - Camila Santos (Hidratante Pós-Bronze)', 'in', 35, 'Pix', 'product', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('2026-03-10', 'Sessão - Beatriz Lima', 'in', 350, 'Cartão', 'session', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a');

-- Some expenses for Feb/Mar
INSERT INTO finances (date, description, type, value, payment_method, category, is_partnership, owner_id) VALUES
  ('2026-02-08', 'Aluguel do estúdio', 'out', 800, 'Pix', 'expense', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('2026-02-15', 'Energia elétrica', 'out', 250, 'Pix', 'expense', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('2026-03-05', 'Aluguel do estúdio', 'out', 800, 'Pix', 'expense', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'),
  ('2026-03-12', 'Reposição de estoque', 'out', 320, 'Cartão', 'expense', false, '34fbd8bc-ad70-4f76-a91d-3f253704b46a');