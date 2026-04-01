
CREATE TABLE public.org_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  revenue NUMERIC NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  deals INTEGER NOT NULL DEFAULT 0,
  industry TEXT NOT NULL DEFAULT 'SaaS',
  status TEXT NOT NULL DEFAULT 'Hot',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.org_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on org_metrics"
  ON public.org_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert on org_metrics"
  ON public.org_metrics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update on org_metrics"
  ON public.org_metrics FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on org_metrics"
  ON public.org_metrics FOR DELETE
  TO anon, authenticated
  USING (true);
