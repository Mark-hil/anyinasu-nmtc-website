-- Table to store issued official transcripts for public verification
CREATE TABLE public.transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_code text NOT NULL,
  student_name text NOT NULL,
  program text NOT NULL,
  level text,
  cumulative_gpa numeric(4,2) NOT NULL DEFAULT 0,
  total_credits integer NOT NULL DEFAULT 0,
  courses_completed integer NOT NULL DEFAULT 0,
  issued_by uuid NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  is_revoked boolean NOT NULL DEFAULT false,
  revoked_at timestamptz,
  notes text
);

ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

-- Anyone (even unauthenticated) can verify a transcript by id
CREATE POLICY "Anyone can verify transcripts"
  ON public.transcripts FOR SELECT
  USING (true);

-- Only admins can issue
CREATE POLICY "Admins can issue transcripts"
  ON public.transcripts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) AND issued_by = auth.uid());

-- Only admins can revoke / update
CREATE POLICY "Admins can update transcripts"
  ON public.transcripts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_transcripts_student ON public.transcripts(student_id);