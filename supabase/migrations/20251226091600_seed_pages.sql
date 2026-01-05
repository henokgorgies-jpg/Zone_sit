-- Seed basic pages for the government portal with correct status
INSERT INTO pages (title, slug, content, status, show_in_nav)
VALUES 
('Departments', 'departments', '[]', 'published', false),
('Leadership', 'leadership', '[]', 'published', false),
('Projects & Programs', 'projects', '[]', 'published', false),
('E-Services Portal', 'e-portal', '[]', 'published', false),
('Reports & Publications', 'reports', '[]', 'published', false),
('Tenders & Vacancies', 'tenders', '[]', 'published', false),
('Citizen Engagement', 'engagement', '[]', 'published', false),
('Help & FAQs', 'faqs', '[]', 'published', false),
('Media Gallery', 'gallery', '[]', 'published', false),
('Accessibility', 'accessibility', '[]', 'published', false),
('Privacy Policy', 'privacy', '[]', 'published', false),
('Terms of Use', 'terms', '[]', 'published', false),
('Open Data Portal', 'open-data', '[]', 'published', false),
('Strategic Plans', 'strategic-plans', '[]', 'published', false),
('Consultation', 'consultation', '[]', 'published', false)
ON CONFLICT (slug) DO NOTHING;
