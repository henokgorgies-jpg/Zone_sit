-- Create enum for tender type
CREATE TYPE public.tender_type AS ENUM ('tender', 'vacancy');

-- Create tenders and vacancies table
CREATE TABLE public.tenders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type public.tender_type NOT NULL DEFAULT 'tender',
  description TEXT,
  content TEXT, -- HTML content from a rich text editor or page builder
  image_url TEXT,
  status public.content_status NOT NULL DEFAULT 'draft',
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view published tenders" 
ON public.tenders FOR SELECT 
USING (status = 'published');

CREATE POLICY "Staff can view all tenders" 
ON public.tenders FOR SELECT 
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert tenders" 
ON public.tenders FOR INSERT 
WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update tenders" 
ON public.tenders FOR UPDATE 
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete tenders" 
ON public.tenders FOR DELETE 
USING (public.is_staff(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_tenders_updated_at
BEFORE UPDATE ON public.tenders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
