
-- Use CREATE OR REPLACE approach: drop and recreate only missing ones
DO $$
DECLARE
  tbl TEXT;
  trg TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['appointments','stock','suppliers','partnerships','packages','admin_permissions','system_config'])
  LOOP
    trg := 'update_' || tbl || '_updated_at';
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = trg) THEN
      EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', trg, tbl);
    END IF;
  END LOOP;
END $$;
