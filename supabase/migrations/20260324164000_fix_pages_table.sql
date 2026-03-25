-- Ensure the pages table exists
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  meta_description TEXT,
  status public.content_status NOT NULL DEFAULT 'draft',
  sort_order INTEGER DEFAULT 0,
  show_in_nav BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Re-enable RLS 
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Drop and re-create policies to ensure they are correct
DROP POLICY IF EXISTS "Anyone can view published pages" ON public.pages;
CREATE POLICY "Anyone can view published pages" ON public.pages FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Staff can view all pages" ON public.pages;
CREATE POLICY "Staff can view all pages" ON public.pages FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can manage pages" ON public.pages;
CREATE POLICY "Staff can manage pages" ON public.pages FOR ALL TO authenticated USING (public.is_staff(auth.uid()));

-- Grant explicit access to roles
GRANT ALL ON TABLE public.pages TO authenticated;
GRANT ALL ON TABLE public.pages TO service_role;
GRANT SELECT ON TABLE public.pages TO anon;


-- Insert the 'about' page if it doesn't exist
INSERT INTO public.pages (title, slug, content, status)
VALUES (
  'About Us', 
  'about', 
  '{"mission": "Promoting the development of science and technology within Gurage Zone while creating opportunities for youth and emerging innovators to thrive in the digital sector.", "vision": "To empower citizens, especially youth, foster innovation, and enhance the overall quality and transparency of public service delivery through modern technology.", "values": "Innovation, Transparency, Youth Empowerment, Technical Excellence, and Digital-First Public Service.", "managerName": "Department Head", "managerTitle": "SIT Department Head", "managerMessage": "By leveraging modern technology, our department aims to empower youth and foster a learning environment for innovation in the region.", "managerPhotoUrl": "/images/sid-head.png", "managerJobDescription": "Leading the zone''s digital transformation, innovation center development, and technological resource management for the public good."}', 
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  status = 'published';

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

