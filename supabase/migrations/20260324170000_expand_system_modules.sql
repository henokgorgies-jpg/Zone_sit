-- 1. Enhance Services with categorization
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- 2. Create Innovation Centers table
CREATE TABLE IF NOT EXISTS public.innovation_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  description TEXT,
  image_url TEXT,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create Success Stories table for Innovation Hub
CREATE TABLE IF NOT EXISTS public.innovation_success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'general',
  status public.content_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create Contact Inquiries table for Feedback
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, reviewed, resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.innovation_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view innovation centers" ON public.innovation_centers FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can view success stories" ON public.innovation_success_stories FOR SELECT USING (status = 'published');

-- Public insert policy for contact inquiries (anyone can send feedback)
CREATE POLICY "Anyone can send contact inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);

-- Staff manage policies
CREATE POLICY "Staff can manage innovation centers" ON public.innovation_centers FOR ALL TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage success stories" ON public.innovation_success_stories FOR ALL TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage contact inquiries" ON public.contact_inquiries FOR ALL TO authenticated USING (public.is_staff(auth.uid()));

-- 5. Seed initial data
INSERT INTO public.innovation_centers (name, location, description, image_url)
VALUES 
('Zone Digital Hub', 'Butajira Central', 'State-of-the-art innovation center providing training and incubation for youth entrepreneurs.', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'),
('STEM Lab East', 'Agena Park', 'Advanced laboratory focused on secondary school STEM education and robotics.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80');

INSERT INTO public.innovation_success_stories (title, author, content, image_url, category)
VALUES 
('Youth Agri-Tech Revolution', 'Abebe B.', 'A group of local youth developed a mobile app to help farmers track soil moisture in real-time.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80', 'Agriculture'),
('Coding the Future', 'Mulu G.', 'First batch of 100 students graduated from the Python for Professionals program.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', 'Education');

-- Update default services with categories
UPDATE public.services SET category = 'training' WHERE title ILIKE '%training%' OR description ILIKE '%training%';
UPDATE public.services SET category = 'innovation' WHERE title ILIKE '%innovation%' OR description ILIKE '%innovation%';
UPDATE public.services SET category = 'support' WHERE title ILIKE '%support%' OR description ILIKE '%support%';

-- Reload schema
NOTIFY pgrst, 'reload schema';
