-- Create media table
CREATE TABLE public.media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  status public.content_status NOT NULL DEFAULT 'published',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view published media" 
ON public.media FOR SELECT 
USING (status = 'published');

CREATE POLICY "Staff can view all media" 
ON public.media FOR SELECT 
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert media" 
ON public.media FOR INSERT 
WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update media" 
ON public.media FOR UPDATE 
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete media" 
ON public.media FOR DELETE 
USING (public.is_staff(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_media_updated_at
BEFORE UPDATE ON public.media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
