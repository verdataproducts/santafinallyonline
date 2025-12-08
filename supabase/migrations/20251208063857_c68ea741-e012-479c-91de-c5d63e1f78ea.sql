-- Create storage bucket for product media
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload product media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-media');

-- Allow anyone to view product media (public bucket)
CREATE POLICY "Anyone can view product media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-media');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete product media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-media');