-- Create engagement category enum
CREATE TYPE public.engagement_category AS ENUM ('feedback', 'suggestion', 'consultation');
CREATE TYPE public.engagement_status AS ENUM ('new', 'pending', 'resolved', 'archived');

-- Create engagements table
CREATE TABLE public.engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category public.engagement_category NOT NULL DEFAULT 'feedback',
  status public.engagement_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Anyone can submit (INSERT)
CREATE POLICY "Anyone can submit engagements" 
ON public.engagements FOR INSERT 
WITH CHECK (true);

-- Only staff can view all engagements
CREATE POLICY "Staff can view all engagements" 
ON public.engagements FOR SELECT 
USING (public.is_staff(auth.uid()));

-- Only staff can update engagements
CREATE POLICY "Staff can update engagements" 
ON public.engagements FOR UPDATE 
USING (public.is_staff(auth.uid()));

-- Only staff can delete engagements
CREATE POLICY "Staff can delete engagements" 
ON public.engagements FOR DELETE 
USING (public.is_staff(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_engagements_updated_at
BEFORE UPDATE ON public.engagements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
