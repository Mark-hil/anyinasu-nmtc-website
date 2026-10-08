
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ASSIGNMENTS
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  due_date TIMESTAMPTZ,
  max_points NUMERIC NOT NULL DEFAULT 100,
  academic_year TEXT NOT NULL DEFAULT '2025/2026',
  semester TEXT NOT NULL DEFAULT 'Semester 1',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage assignments" ON public.assignments FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Enrolled students view assignments" ON public.assignments FOR SELECT USING (
  course_id IN (SELECT se.course_id FROM public.student_enrollments se JOIN public.students s ON s.id = se.student_id WHERE s.user_id = auth.uid())
);
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ASSIGNMENT SUBMISSIONS
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  file_url TEXT,
  text_response TEXT,
  grade NUMERIC,
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  graded_at TIMESTAMPTZ,
  graded_by UUID,
  UNIQUE(assignment_id, student_id)
);
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own submissions" ON public.assignment_submissions FOR ALL USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())) WITH CHECK (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));
CREATE POLICY "Admins manage all submissions" ON public.assignment_submissions FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- ATTENDANCE
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'present',
  notes TEXT,
  recorded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage attendance" ON public.attendance FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Students view own attendance" ON public.attendance FOR SELECT USING (
  enrollment_id IN (SELECT se.id FROM public.student_enrollments se JOIN public.students s ON s.id = se.student_id WHERE s.user_id = auth.uid())
);

-- EXAM RESULTS
CREATE TABLE public.exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  exam_type TEXT NOT NULL DEFAULT 'final',
  score NUMERIC NOT NULL DEFAULT 0,
  max_score NUMERIC NOT NULL DEFAULT 100,
  exam_date DATE,
  is_published BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage exam results" ON public.exam_results FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Students view own published results" ON public.exam_results FOR SELECT USING (
  is_published = true AND enrollment_id IN (SELECT se.id FROM public.student_enrollments se JOIN public.students s ON s.id = se.student_id WHERE s.user_id = auth.uid())
);

-- COURSE MATERIALS
CREATE TABLE public.course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  category TEXT DEFAULT 'lecture_notes',
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage materials" ON public.course_materials FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Enrolled students view materials" ON public.course_materials FOR SELECT USING (
  course_id IN (SELECT se.course_id FROM public.student_enrollments se JOIN public.students s ON s.id = se.student_id WHERE s.user_id = auth.uid())
);

-- MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  parent_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Recipients update read flag" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Admins view all messages" ON public.messages FOR SELECT USING (has_role(auth.uid(),'admin'));

-- COURSE REGISTRATIONS
CREATE TABLE public.course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL DEFAULT '2025/2026',
  semester TEXT NOT NULL DEFAULT 'Semester 1',
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id, academic_year, semester)
);
ALTER TABLE public.course_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students create own registrations" ON public.course_registrations FOR INSERT WITH CHECK (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));
CREATE POLICY "Students view own registrations" ON public.course_registrations FOR SELECT USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));
CREATE POLICY "Students cancel pending registrations" ON public.course_registrations FOR DELETE USING (status = 'pending' AND student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));
CREATE POLICY "Admins manage registrations" ON public.course_registrations FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars','avatars',true),
  ('assignments','assignments',false),
  ('submissions','submissions',false),
  ('materials','materials',true)
ON CONFLICT (id) DO NOTHING;

-- AVATARS
CREATE POLICY "Avatars are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- MATERIALS
CREATE POLICY "Materials are public" ON storage.objects FOR SELECT USING (bucket_id = 'materials');
CREATE POLICY "Admins upload materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'materials' AND has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update materials" ON storage.objects FOR UPDATE USING (bucket_id = 'materials' AND has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete materials" ON storage.objects FOR DELETE USING (bucket_id = 'materials' AND has_role(auth.uid(),'admin'));

-- ASSIGNMENTS BUCKET
CREATE POLICY "Admins upload assignment files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'assignments' AND has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update assignment files" ON storage.objects FOR UPDATE USING (bucket_id = 'assignments' AND has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete assignment files" ON storage.objects FOR DELETE USING (bucket_id = 'assignments' AND has_role(auth.uid(),'admin'));
CREATE POLICY "Authenticated view assignment files" ON storage.objects FOR SELECT USING (bucket_id = 'assignments' AND auth.uid() IS NOT NULL);

-- SUBMISSIONS
CREATE POLICY "Students upload submissions" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Students view own submissions" ON storage.objects FOR SELECT USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins view all submissions" ON storage.objects FOR SELECT USING (bucket_id = 'submissions' AND has_role(auth.uid(),'admin'));
