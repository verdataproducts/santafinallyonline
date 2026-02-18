
-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL DEFAULT 'ORD-' || substr(gen_random_uuid()::text, 1, 8),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  paypal_order_id TEXT,
  paypal_payer_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (guest checkout - no auth required)
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow the edge function (service role) to manage orders
CREATE POLICY "Service role full access"
  ON public.orders
  FOR ALL
  USING (auth.role() = 'service_role');
