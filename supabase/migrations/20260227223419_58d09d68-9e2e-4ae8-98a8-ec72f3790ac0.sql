-- Add CPF, address, plan and payment fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS plan_id uuid,
  ADD COLUMN IF NOT EXISTS payment_notes text;

-- Create plans table for admin to configure subscription plans
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Planos são visíveis publicamente" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Planos podem ser inseridos publicamente" ON public.plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Planos podem ser atualizados publicamente" ON public.plans FOR UPDATE USING (true);
CREATE POLICY "Planos podem ser deletados publicamente" ON public.plans FOR DELETE USING (true);

-- Add foreign key from profiles to plans
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE SET NULL;

-- Trigger for updated_at on plans
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();