
-- Create storage bucket for studio assets (logo, background)
INSERT INTO storage.buckets (id, name, public) VALUES ('studio-assets', 'studio-assets', true);

-- Allow anyone to read studio assets
CREATE POLICY "Studio assets are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'studio-assets');

-- Allow anyone to upload studio assets
CREATE POLICY "Studio assets can be uploaded"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'studio-assets');

-- Allow anyone to update studio assets
CREATE POLICY "Studio assets can be updated"
ON storage.objects FOR UPDATE
USING (bucket_id = 'studio-assets');

-- Allow anyone to delete studio assets
CREATE POLICY "Studio assets can be deleted"
ON storage.objects FOR DELETE
USING (bucket_id = 'studio-assets');
