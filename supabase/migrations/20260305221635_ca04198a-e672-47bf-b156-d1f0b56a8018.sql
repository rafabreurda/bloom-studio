
-- Deletar estoque atual do Rafael e copiar o do Sole Mio
DELETE FROM stock WHERE owner_id = '34fbd8bc-ad70-4f76-a91d-3f253704b46a';

INSERT INTO stock (name, quantity, price, min_stock, owner_id)
SELECT name, quantity, price, min_stock, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'
FROM stock WHERE owner_id = '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b';

-- Copiar service_types para Rafael
INSERT INTO system_config (key, value, owner_id)
SELECT 'service_types', value, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'
FROM system_config WHERE owner_id = '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b' AND key = 'service_types';

-- Copiar client_tags para Rafael
INSERT INTO system_config (key, value, owner_id)
SELECT 'client_tags', value, '34fbd8bc-ad70-4f76-a91d-3f253704b46a'
FROM system_config WHERE owner_id = '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b' AND key = 'client_tags';
