-- Create storage buckets for media and documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for storage.objects
-- Allow public access to all objects in 'media' and 'documents' buckets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('media', 'documents'));

-- Allow authenticated users to upload to 'media' and 'documents' buckets
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('media', 'documents') AND (auth.role() = 'authenticated'));

-- Allow authenticated users to update/delete their own objects (or all if admin)
-- For simplicity in this admin portal, we allow all authenticated users to manage these buckets
CREATE POLICY "Authenticated Manage" ON storage.objects FOR UPDATE USING (bucket_id IN ('media', 'documents') AND (auth.role() = 'authenticated'));
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id IN ('media', 'documents') AND (auth.role() = 'authenticated'));
