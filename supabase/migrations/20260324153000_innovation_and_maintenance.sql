-- Create innovation_projects table
CREATE TABLE IF NOT EXISTS innovation_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  innovator_name TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create maintenance_requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_type TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE innovation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Policies for innovation_projects
CREATE POLICY "Public can view innovation_projects" ON innovation_projects FOR SELECT USING (true);
CREATE POLICY "Admin can manage innovation_projects" ON innovation_projects ALL USING (auth.role() = 'authenticated');

-- Policies for maintenance_requests
CREATE POLICY "Public can create maintenance_requests" ON maintenance_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all maintenance_requests" ON maintenance_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage maintenance_requests" ON maintenance_requests ALL USING (auth.role() = 'authenticated');
