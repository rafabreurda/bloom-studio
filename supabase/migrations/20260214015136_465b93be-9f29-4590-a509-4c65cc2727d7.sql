
-- Adicionar coluna de custo nos agendamentos
ALTER TABLE public.appointments ADD COLUMN cost numeric NOT NULL DEFAULT 0;

-- Atualizar os agendamentos de teste com custos estimados
UPDATE public.appointments SET cost = 15 WHERE date = '2026-02-13';
