-- Create leadership table
CREATE TABLE public.leadership (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  rank INTEGER DEFAULT 0, -- To control the display order
  category TEXT DEFAULT 'Executive', -- e.g., 'Executive Cabinet', 'Bureau Heads'
  status public.content_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Register org_chart in site_settings if not already there
INSERT INTO public.site_settings (key, value)
VALUES ('org_chart_data', '{"image_url": "", "description": "Our Institutional Organizational Structure"}')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.leadership ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view published leadership" 
ON public.leadership FOR SELECT 
USING (status = 'published');

CREATE POLICY "Staff can manage leadership" 
ON public.leadership FOR ALL 
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_leadership_updated_at
BEFORE UPDATE ON public.leadership
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
