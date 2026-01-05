-- Seed initial values for hero and ceo message if they don't exist
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_carousel', '[{"src": "/images/hero-1.png", "alt": "Modern Government Building"}, {"src": "/images/hero-2.png", "alt": "Digital Citizen Services"}, {"src": "/images/ceo.png", "alt": "Institutional Leadership"}]'),
  ('ceo_message_data', '{"name": "Jane Doe", "title": "Chief Executive Officer", "message": "Our commitment to digital transformation and citizen-centric services is at the heart of everything we do. We believe that technology should empower every individual and bridge the gap between governance and the community.\\n\\nAs we move forward, we focus on building a transparent, efficient, and inclusive institutional framework that serves the needs of today while preparing for the challenges of tomorrow.", "image": "/images/ceo.png", "since": "2020"}')
ON CONFLICT (key) DO NOTHING;
