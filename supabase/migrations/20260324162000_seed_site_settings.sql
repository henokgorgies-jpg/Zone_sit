-- Seed default site settings if they don't exist
INSERT INTO site_settings (key, value)
VALUES 
('hero_carousel', '[{"src": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80", "alt": "Next-Gen Infrastructure"}, {"src": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80", "alt": "Global Network"}]'),
('ceo_message_data', '{"name": "Hon. Dr. Abrham Tekola", "title": "Head of SIT Department", "message": "Welcome to the official digital gateway of the Gurage Zone SIT Department. We are committed to fueling regional progress through science, information, and cutting-edge technology.", "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80", "since": "2021"}')
ON CONFLICT (key) DO NOTHING;
