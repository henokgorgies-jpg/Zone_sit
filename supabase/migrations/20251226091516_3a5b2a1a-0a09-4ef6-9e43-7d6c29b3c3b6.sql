-- Create pages table for custom pages
CREATE TABLE public.pages (
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

-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view published pages" 
ON public.pages 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Staff can view all pages" 
ON public.pages 
FOR SELECT 
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert pages" 
ON public.pages 
FOR INSERT 
WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can update pages" 
ON public.pages 
FOR UPDATE 
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can delete pages" 
ON public.pages 
FOR DELETE 
USING (is_staff(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();