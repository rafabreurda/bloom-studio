-- Zerar configuração de recibo para TODOS os usuários
DELETE FROM system_config WHERE key = 'receipt_config';