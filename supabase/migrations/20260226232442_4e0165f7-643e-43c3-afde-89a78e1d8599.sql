
-- Corrigir datas dos registros financeiros automáticos usando as datas dos agendamentos correspondentes
-- Match 1-para-1 por nome do cliente e valor
UPDATE finances f
SET date = sub.appt_date
FROM (
  SELECT DISTINCT ON (f2.id) f2.id as fin_id, a.date as appt_date
  FROM finances f2
  JOIN appointments a ON f2.description = 'Sessão (auto) - ' || a.client_name AND f2.value = a.value
  WHERE f2.date = '2026-02-26'
  ORDER BY f2.id, a.date
) sub
WHERE f.id = sub.fin_id;
