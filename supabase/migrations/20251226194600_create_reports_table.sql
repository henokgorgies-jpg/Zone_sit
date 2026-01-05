-- Create enum for report category
CREATE TYPE public.report_category AS ENUM ('annual_report', 'research_stat', 'strategic_plan', 'other');

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category public.report_category NOT NULL DEFAULT 'annual_report',
  file_url TEXT NOT NULL, -- Link to the downloadable PDF/document
  image_url TEXT, -- Optional thumbnail
  year INTEGER, -- The year the report belongs to
  status public.content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view published reports" 
ON public.reports FOR SELECT 
USING (status = 'published');

CREATE POLICY "Staff can manage reports" 
ON public.reports FOR ALL 
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
