-- 1. Ensure the custom type exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tender_type') THEN
        CREATE TYPE public.tender_type AS ENUM ('tender', 'vacancy');
    END IF;
END $$;

-- 2. Create the table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.tenders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type public.tender_type NOT NULL DEFAULT 'tender',
  description TEXT,
  content TEXT,
  image_url TEXT,
  status public.content_status NOT NULL DEFAULT 'draft',
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Reset and Apply Security Policies
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published tenders" ON public.tenders;
DROP POLICY IF EXISTS "Staff can manage tenders" ON public.tenders;

CREATE POLICY "Anyone can view published tenders" 
ON public.tenders FOR SELECT 
USING (status = 'published');

CREATE POLICY "Staff can manage tenders" 
ON public.tenders FOR ALL 
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

-- 4. Ensure trigger exists for auto-updates
DROP TRIGGER IF EXISTS update_tenders_updated_at ON public.tenders;

CREATE TRIGGER update_tenders_updated_at
BEFORE UPDATE ON public.tenders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Force Supabase to see the new table
NOTIFY pgrst, 'reload schema';