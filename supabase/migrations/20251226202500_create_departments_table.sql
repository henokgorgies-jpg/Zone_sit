-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  responsibilities TEXT,
  head_name TEXT,
  head_role TEXT,
  head_image_url TEXT,
  members_count INTEGER DEFAULT 0,
  members_list TEXT[], -- List of member names or key staff
  image_url TEXT,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view published departments" 
ON public.departments FOR SELECT 
USING (status = 'published');

CREATE POLICY "Staff can manage departments" 
ON public.departments FOR ALL 
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON public.departments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
