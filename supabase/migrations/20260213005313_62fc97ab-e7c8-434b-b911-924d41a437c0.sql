
-- Create packages table
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  total_sessions INTEGER NOT NULL DEFAULT 1,
  used_sessions INTEGER NOT NULL DEFAULT 0,
  total_value NUMERIC NOT NULL DEFAULT 0,
  session_value NUMERIC GENERATED ALWAYS AS (
    CASE WHEN total_sessions > 0 THEN total_value / total_sessions ELSE 0 END
  ) STORED,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Public access policies (single-user system)
CREATE POLICY "Pacotes são visíveis publicamente" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Pacotes podem ser inseridos publicamente" ON public.packages FOR INSERT WITH CHECK (true);
CREATE POLICY "Pacotes podem ser atualizados publicamente" ON public.packages FOR UPDATE USING (true);
CREATE POLICY "Pacotes podem ser deletados publicamente" ON public.packages FOR DELETE USING (true);

-- Add package_id to appointments table
ALTER TABLE public.appointments ADD COLUMN package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL;
