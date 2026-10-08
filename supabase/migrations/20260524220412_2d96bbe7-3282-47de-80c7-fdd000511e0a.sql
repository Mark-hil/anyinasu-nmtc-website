DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='assignment_submissions') THEN
    ALTER TABLE public.assignment_submissions ADD COLUMN IF NOT EXISTS result_file_url text;
  END IF;
END $$;