
-- 3 Parcerias (Modelos)
INSERT INTO partnerships (name, discount, contact) VALUES
('Ana Beatriz', 100, '11999001001'),
('Carolina Menezes', 100, '11999001002'),
('Isabela Duarte', 100, '11999001003');

-- 5 Fornecedores
INSERT INTO suppliers (name, contact, products) VALUES
('SunGlow Cosméticos', '11988001001', 'Óleos bronzeadores, aceleradores de bronzeamento'),
('BronzeTech Distribuidora', '11988001002', 'Equipamentos UV, lâmpadas de bronzeamento'),
('Solar Beauty Produtos', '11988001003', 'Loções pós-sol, hidratantes corporais'),
('TanPro Importações', '11988001004', 'Protetores solares, sprays bronzeadores'),
('Golden Skin Fornecimentos', '11988001005', 'Esfoliantes, géis fixadores de bronze');

-- 10 Produtos em Estoque
INSERT INTO stock (name, quantity, min_stock, price) VALUES
('Óleo Bronzeador Premium', 25, 5, 45.00),
('Protetor Solar FPS 30', 30, 10, 35.00),
('Loção Pós-Sol', 20, 5, 28.00),
('Acelerador de Bronzeamento', 15, 5, 55.00),
('Hidratante Corporal Bronze', 18, 5, 32.00),
('Touca Descartável', 100, 20, 2.50),
('Óculos de Proteção UV', 40, 10, 8.00),
('Gel Fixador de Bronze', 12, 5, 42.00),
('Esfoliante Pré-Bronzeamento', 22, 5, 38.00),
('Spray Bronzeador', 16, 5, 50.00);

-- 3 Pacotes (3, 6, 9 sessões) - sem session_value que é gerado
INSERT INTO packages (client_name, client_phone, total_sessions, used_sessions, total_value, status) VALUES
('Aline Costa', '11977001001', 3, 0, 210.00, 'active'),
('Paula Mendes', '11977001002', 6, 0, 390.00, 'active'),
('Camila Rocha', '11977001003', 9, 0, 540.00, 'active');

-- 10 Agendamentos (hoje)
INSERT INTO appointments (client_name, phone, date, time, value, total_value, products_value, charged_value, status, payment_method, is_partnership, is_confirmed, partnership_name, partnership_discount) VALUES
('Aline Costa', '11977001001', '2026-02-13', '08:00', 80, 80, 0, 80, 'Agendado', 'Pix', false, true, NULL, NULL),
('Paula Mendes', '11977001002', '2026-02-13', '09:00', 90, 90, 0, 90, 'Agendado', 'Cartão', false, true, NULL, NULL),
('Camila Rocha', '11977001003', '2026-02-13', '10:00', 75, 75, 0, 75, 'Agendado', 'Dinheiro', false, true, NULL, NULL),
('Fernanda Lima', '11977001004', '2026-02-13', '11:00', 100, 100, 0, 100, 'Aguardando Sinal', NULL, false, false, NULL, NULL),
('Juliana Silva', '11977001005', '2026-02-13', '12:00', 85, 85, 0, 85, 'Agendado', 'Cartão', false, true, NULL, NULL),
('Mariana Alves', '11977001006', '2026-02-13', '13:00', 70, 70, 0, 70, 'Aguardando Sinal', NULL, false, false, NULL, NULL),
('Ana Beatriz', '11999001001', '2026-02-13', '14:00', 95, 95, 0, 0, 'Agendado', 'Pix', true, true, 'Ana Beatriz', 100),
('Larissa Nunes', '11977001008', '2026-02-13', '15:00', 80, 80, 0, 80, 'Agendado', 'Cartão', false, true, NULL, NULL),
('Tatiane Dias', '11977001009', '2026-02-13', '16:00', 90, 90, 0, 90, 'Agendado', 'Dinheiro', false, true, NULL, NULL),
('Rafaela Santos', '11977001010', '2026-02-13', '17:00', 85, 85, 0, 85, 'Aguardando Sinal', NULL, false, false, NULL, NULL);

-- Lançamentos financeiros dos pagos
INSERT INTO finances (date, description, type, value, payment_method, category, is_partnership) VALUES
('2026-02-13', 'Sessão - Aline Costa', 'in', 80, 'Pix', 'session', false),
('2026-02-13', 'Sessão - Paula Mendes', 'in', 90, 'Cartão', 'session', false),
('2026-02-13', 'Sessão - Camila Rocha', 'in', 75, 'Dinheiro', 'session', false),
('2026-02-13', 'Sessão - Juliana Silva', 'in', 85, 'Cartão', 'session', false),
('2026-02-13', 'Sessão - Ana Beatriz (Parceria)', 'in', 0, 'Pix', 'partnership', true),
('2026-02-13', 'Sessão - Larissa Nunes', 'in', 80, 'Cartão', 'session', false),
('2026-02-13', 'Sessão - Tatiane Dias', 'in', 90, 'Dinheiro', 'session', false);
