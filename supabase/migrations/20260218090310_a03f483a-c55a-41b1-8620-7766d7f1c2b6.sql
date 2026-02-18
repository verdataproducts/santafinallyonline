-- Allow authenticated users to view their own orders by matching email
CREATE POLICY "Customers can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  email = (SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid() LIMIT 1)
);