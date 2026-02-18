
-- Fix 1: Restrict product-media uploads and deletes to admins only
DROP POLICY IF EXISTS "Authenticated users can upload product media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product media" ON storage.objects;

CREATE POLICY "Admin users can upload product media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-media' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admin users can delete product media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-media' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Fix 8: Tighten orders INSERT - require valid email format and reasonable total
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Guest checkout can create orders"
ON public.orders
FOR INSERT
WITH CHECK (
  email IS NOT NULL AND
  email ~ '^[^@]+@[^@]+\.[^@]+$' AND
  total_amount > 0 AND
  full_name IS NOT NULL AND
  length(full_name) >= 2
);
