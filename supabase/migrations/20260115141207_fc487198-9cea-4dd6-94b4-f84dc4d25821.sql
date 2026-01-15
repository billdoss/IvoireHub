-- Create storage bucket for business images
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view business images (public bucket)
CREATE POLICY "Anyone can view business images"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-images');

-- Policy: Authenticated users can upload their own business images
CREATE POLICY "Users can upload business images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own business images
CREATE POLICY "Users can update their business images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'business-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Users can delete their own business images
CREATE POLICY "Users can delete their business images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-images' 
  AND auth.role() = 'authenticated'
);