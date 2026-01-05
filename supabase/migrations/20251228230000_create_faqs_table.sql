-- Create faqs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view published faqs" 
ON public.faqs FOR SELECT 
USING (status = 'published');

CREATE POLICY "Staff can view all faqs" 
ON public.faqs FOR SELECT 
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert faqs" 
ON public.faqs FOR INSERT 
WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update faqs" 
ON public.faqs FOR UPDATE 
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete faqs" 
ON public.faqs FOR DELETE 
USING (public.is_staff(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
