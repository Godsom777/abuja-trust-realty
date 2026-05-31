-- ==========================================
-- ABUJA TRUST REALTY — DATABASE & STORAGE SETUP
-- Run this script in the Supabase SQL Editor
-- ==========================================

-- 1. Ensure columns in 'properties' exist and match the schema
ALTER TABLE properties ADD COLUMN IF NOT EXISTS status text DEFAULT 'available';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS photo text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS district text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS verified boolean DEFAULT true;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS structure_type text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_document text;

-- 2. Create the 'property_media' table for multiple images/videos
CREATE TABLE IF NOT EXISTS property_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id bigint REFERENCES properties(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_video boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Enable RLS on tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for properties table
DROP POLICY IF EXISTS "Allow public read access to properties" ON properties;
CREATE POLICY "Allow public read access to properties" 
ON properties FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow anon insert to properties" ON properties;
CREATE POLICY "Allow anon insert to properties" 
ON properties FOR INSERT 
TO anon 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update to properties" ON properties;
CREATE POLICY "Allow anon update to properties" 
ON properties FOR UPDATE 
TO anon 
USING (true);

DROP POLICY IF EXISTS "Allow anon delete to properties" ON properties;
CREATE POLICY "Allow anon delete to properties" 
ON properties FOR DELETE 
TO anon 
USING (true);

-- 5. Create RLS Policies for property_media table
DROP POLICY IF EXISTS "Allow public read access to property_media" ON property_media;
CREATE POLICY "Allow public read access to property_media" 
ON property_media FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow anon insert to property_media" ON property_media;
CREATE POLICY "Allow anon insert to property_media" 
ON property_media FOR INSERT 
TO anon 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon delete to property_media" ON property_media;
CREATE POLICY "Allow anon delete to property_media" 
ON property_media FOR DELETE 
TO anon 
USING (true);

-- 6. Setup storage bucket 'property-media' and its security policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-media', 'property-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if they exist to avoid duplicate errors
DROP POLICY IF EXISTS "Allow public read access to property-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous uploads to property-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous updates to property-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous deletes from property-media" ON storage.objects;

-- Create storage policies
CREATE POLICY "Allow public read access to property-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-media');

CREATE POLICY "Allow anonymous uploads to property-media"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'property-media');

CREATE POLICY "Allow anonymous updates to property-media"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'property-media');

CREATE POLICY "Allow anonymous deletes from property-media"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'property-media');

-- Ensure bucket is completely public
UPDATE storage.buckets SET public = true WHERE id = 'property-media';
