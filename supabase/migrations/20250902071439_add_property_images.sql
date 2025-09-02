-- Add new columns for property images to the properties table
ALTER TABLE public.properties
ADD COLUMN rental_image_url TEXT,
ADD COLUMN office_image_url TEXT,
ADD COLUMN airbnb_image_url TEXT;

-- Update existing properties with placeholder images
UPDATE public.properties
SET
  rental_image_url = 'https://placehold.co/400x300.png?text=Rental+Property',
  office_image_url = 'https://placehold.co/400x300.png?text=Office+Space',
  airbnb_image_url = 'https://placehold.co/400x300.png?text=Airbnb+Listing'
WHERE
  rental_image_url IS NULL AND
  office_image_url IS NULL AND
  airbnb_image_url IS NULL;

-- Create new storage buckets for property images if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('rental-property-images', 'rental-property-images', true),
  ('office-images', 'office-images', true),
  ('airbnb-images', 'airbnb-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for rental-property-images
CREATE POLICY "Rental property images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rental-property-images');

CREATE POLICY "Authenticated users can upload rental property images"
ON storage.objects FOR INSERT
TO authenticated WITH CHECK (bucket_id = 'rental-property-images');

-- RLS policies for office-images
CREATE POLICY "Office images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'office-images');

CREATE POLICY "Authenticated users can upload office images"
ON storage.objects FOR INSERT
TO authenticated WITH CHECK (bucket_id = 'office-images');

-- RLS policies for airbnb-images
CREATE POLICY "Airbnb images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'airbnb-images');

CREATE POLICY "Authenticated users can upload Airbnb images"
ON storage.objects FOR INSERT
TO authenticated WITH CHECK (bucket_id = 'airbnb-images');
