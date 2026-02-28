-- Zerar finanças de todos os usuários exceto Sole Mio
DELETE FROM finances WHERE owner_id != '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b' OR owner_id IS NULL;

-- Copiar whatsapp_templates do Sole Mio para os outros 3 usuários
INSERT INTO system_config (key, value, owner_id)
SELECT 'whatsapp_templates', sc.value, p.id
FROM system_config sc
CROSS JOIN profiles p
WHERE sc.key = 'whatsapp_templates'
  AND sc.owner_id = '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b'
  AND p.id != '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b'
ON CONFLICT DO NOTHING;