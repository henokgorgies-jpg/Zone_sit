-- Add category column to news table
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Update RLS for innovation_projects and maintenance_requests if not already done
-- (I already did this in the previous migration, but ensuring here if needed)

-- Update news to have some categorized content
UPDATE public.news SET category = 'innovation' WHERE title ILIKE '%innovation%' OR content ILIKE '%innovation%';
UPDATE public.news SET category = 'training' WHERE title ILIKE '%training%' OR content ILIKE '%training%';
UPDATE public.news SET category = 'services' WHERE title ILIKE '%service%' OR content ILIKE '%service%';
