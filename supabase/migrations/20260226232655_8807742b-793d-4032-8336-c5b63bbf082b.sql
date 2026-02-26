-- Deletar registros financeiros que ficaram com data errada (2026-02-26) pois não têm data real recuperável
DELETE FROM finances WHERE date = '2026-02-26';