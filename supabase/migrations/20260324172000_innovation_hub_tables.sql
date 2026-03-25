-- Create innovation_centers table
CREATE TABLE IF NOT EXISTS public.innovation_centers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    established_at DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create innovation_success_stories table
CREATE TABLE IF NOT EXISTS public.innovation_success_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    innovator_name TEXT NOT NULL,
    description TEXT,
    impact_metrics TEXT,
    image_url TEXT,
    project_url TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create innovation_projects table (for ongoing ideas/projects)
CREATE TABLE IF NOT EXISTS public.innovation_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    innovator_name TEXT NOT NULL,
    innovator_contact TEXT,
    status TEXT DEFAULT 'pending',
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create contact_inquiries table (serves as citizen engagement)
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create maintenance_requests table
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_name TEXT NOT NULL,
    department TEXT NOT NULL,
    issue_description TEXT NOT NULL,
    priority TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'pending',
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Rename or alias for 'engagements' if needed by the dashboard
-- The dashboard calls .from("engagements"), so let's create it or alias it.
CREATE TABLE IF NOT EXISTS public.engagements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT,
    content TEXT,
    user_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.innovation_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view innovation_centers" ON public.innovation_centers FOR SELECT USING (true);
CREATE POLICY "Anyone can view innovation_success_stories" ON public.innovation_success_stories FOR SELECT USING (true);
CREATE POLICY "Anyone can view innovation_projects" ON public.innovation_projects FOR SELECT USING (true);

-- Submission policy
CREATE POLICY "Anyone can submit contact inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit maintenance requests" ON public.maintenance_requests FOR INSERT WITH CHECK (true);

-- Staff management policies
CREATE POLICY "Staff can manage innovation_centers" ON public.innovation_centers USING (is_staff(auth.uid()));
CREATE POLICY "Staff can manage innovation_success_stories" ON public.innovation_success_stories USING (is_staff(auth.uid()));
CREATE POLICY "Staff can manage innovation_projects" ON public.innovation_projects USING (is_staff(auth.uid()));
CREATE POLICY "Staff can view contact_inquiries" ON public.contact_inquiries FOR SELECT TO authenticated USING (is_staff(auth.uid()));
CREATE POLICY "Staff can manage maintenance_requests" ON public.maintenance_requests USING (is_staff(auth.uid()));
CREATE POLICY "Staff can manage engagements" ON public.engagements USING (is_staff(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_innovation_centers_updated_at BEFORE UPDATE ON public.innovation_centers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_innovation_success_stories_updated_at BEFORE UPDATE ON public.innovation_success_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_innovation_projects_updated_at BEFORE UPDATE ON public.innovation_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON public.maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
