import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Check, X, IdCard } from "lucide-react";
import StudentIDCard from "@/components/student/StudentIDCard";

const AcademicAdminTab = () => {
  return (
    <Tabs defaultValue="assignments">
      <TabsList className="flex flex-wrap h-auto">
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="grading">Grading</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="exams">Exam Results</TabsTrigger>
        <TabsTrigger value="materials">Course Materials</TabsTrigger>
        <TabsTrigger value="registrations">Registrations</TabsTrigger>
        <TabsTrigger value="idcards">ID Cards</TabsTrigger>
      </TabsList>
      <TabsContent value="assignments"><AssignmentsAdmin /></TabsContent>
      <TabsContent value="grading"><GradingAdmin /></TabsContent>
      <TabsContent value="attendance"><AttendanceAdmin /></TabsContent>
      <TabsContent value="exams"><ExamsAdmin /></TabsContent>
      <TabsContent value="materials"><MaterialsAdmin /></TabsContent>
      <TabsContent value="registrations"><RegistrationsAdmin /></TabsContent>
      <TabsContent value="idcards"><IDCardsAdmin /></TabsContent>
    </Tabs>
  );
};

// ─── ASSIGNMENTS ───
const AssignmentsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ course_id: "", title: "", description: "", due_date: "", max_points: 100, file_url: "" });

  const fetchAll = async () => {
    const [a, c] = await Promise.all([
      supabase.from("assignments").select("*, courses(code,title)").order("created_at", { ascending: false }),
      supabase.from("courses").select("id,code,title").eq("is_published", true),
    ]);
    if (a.data) setItems(a.data);
    if (c.data) setCourses(c.data);
  };
  useEffect(() => { fetchAll(); }, []);

  const save = async () => {
    if (!form.course_id || !form.title) { toast({ title: "Course & title required", variant: "destructive" }); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const payload = { ...form, due_date: form.due_date || null, created_by: user!.id };
    const { error } = await supabase.from("assignments").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Created" }); setOpen(false); setForm({ course_id: "", title: "", description: "", due_date: "", max_points: 100, file_url: "" }); fetchAll(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;
    await supabase.from("assignments").delete().eq("id", id);
    fetchAll();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Assignments ({items.length})</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" />New</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Title</TableHead><TableHead>Due</TableHead><TableHead>Pts</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map(a => (
              <TableRow key={a.id}>
                <TableCell className="text-xs">{a.courses?.code}</TableCell>
                <TableCell>{a.title}</TableCell>
                <TableCell className="text-xs">{a.due_date ? new Date(a.due_date).toLocaleDateString("en-GB") : "—"}</TableCell>
                <TableCell>{a.max_points}</TableCell>
                <TableCell><Button size="sm" variant="outline" onClick={() => remove(a.id)}><Trash2 className="h-3 w-3" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New Assignment</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Course</Label>
                <Select value={form.course_id} onValueChange={v => setForm({ ...form, course_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Pick course" /></SelectTrigger>
                  <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.code} — {c.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Due date</Label><Input type="datetime-local" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} /></div>
                <div><Label>Max points</Label><Input type="number" value={form.max_points} onChange={e => setForm({ ...form, max_points: Number(e.target.value) })} /></div>
              </div>
              <Input placeholder="Attachment URL (optional)" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} />
              <Button onClick={save} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// ─── GRADING ───
const GradingAdmin = () => {
  const { toast } = useToast();
  const [subs, setSubs] = useState<any[]>([]);
  const [grading, setGrading] = useState<any>(null);
  const [form, setForm] = useState({ grade: 0, feedback: "" });
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [resultError, setResultError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    const { data } = await supabase.from("assignment_submissions").select("*, assignments(title,max_points,courses(code)), students(student_id, profiles:user_id(full_name))").order("submitted_at", { ascending: false });
    if (data) setSubs(data);
  };
  useEffect(() => { fetchAll(); }, []);

  const openSubFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("submissions").createSignedUrl(path, 300);
    if (error || !data) return toast({ title: "Could not open file", description: error?.message, variant: "destructive" });
    window.open(data.signedUrl, "_blank");
  };

  const onResultFile = (f: File | null) => {
    setResultError("");
    setResultFile(f);
    if (f && f.size > 15 * 1024 * 1024) setResultError("File too large (max 15MB)");
  };

  const save = async () => {
    if (!grading) return;
    const max = grading.assignments?.max_points || 100;
    if (form.grade < 0 || form.grade > max) {
      return toast({ title: "Invalid grade", description: `Must be between 0 and ${max}`, variant: "destructive" });
    }
    if (resultError) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    let result_file_url: string | null = (grading as any).result_file_url || null;

    if (resultFile) {
      const safe = resultFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `results/${grading.id}-${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("submissions").upload(path, resultFile, { contentType: resultFile.type });
      if (upErr) { setSaving(false); return toast({ title: "Result upload failed", description: upErr.message, variant: "destructive" }); }
      result_file_url = path;
    }

    const { error } = await supabase.from("assignment_submissions").update({
      grade: form.grade, feedback: form.feedback, result_file_url,
      graded_at: new Date().toISOString(), graded_by: user!.id
    }).eq("id", grading.id);
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Grade published", description: resultFile ? "Grade + result file delivered to student." : "Grade & feedback sent to student." });
      setGrading(null); setResultFile(null); setResultError(""); fetchAll();
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Submissions ({subs.length})</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Assignment</TableHead><TableHead>Submitted</TableHead><TableHead>File</TableHead><TableHead>Grade</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {subs.map(s => (
              <TableRow key={s.id}>
                <TableCell className="text-xs">{s.students?.profiles?.full_name || s.students?.student_id}</TableCell>
                <TableCell>{s.assignments?.courses?.code} — {s.assignments?.title}</TableCell>
                <TableCell className="text-xs">{new Date(s.submitted_at).toLocaleDateString("en-GB")}</TableCell>
                <TableCell>{s.file_url ? <Button size="sm" variant="ghost" className="h-7" onClick={() => openSubFile(s.file_url)}>View</Button> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                <TableCell>{s.grade != null ? `${s.grade}/${s.assignments?.max_points}` : <Badge variant="outline">Ungraded</Badge>}</TableCell>
                <TableCell><Button size="sm" variant="outline" onClick={() => { setGrading(s); setForm({ grade: s.grade || 0, feedback: s.feedback || "" }); setResultFile(null); setResultError(""); }}>Grade</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={!!grading} onOpenChange={(o) => { if (!o && !saving) setGrading(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Grade Submission</DialogTitle></DialogHeader>
            {grading && (
              <div className="space-y-3">
                <p className="text-sm"><strong>{grading.assignments?.title}</strong> · <span className="text-muted-foreground">{grading.students?.profiles?.full_name || grading.students?.student_id}</span></p>
                {grading.file_url && (
                  <Button size="sm" variant="outline" onClick={() => openSubFile(grading.file_url)} className="w-full">
                    View student's submitted file
                  </Button>
                )}
                {grading.text_response && <div className="text-sm bg-muted p-3 rounded max-h-40 overflow-auto whitespace-pre-wrap">{grading.text_response}</div>}
                <div><Label>Grade (max {grading.assignments?.max_points})</Label><Input type="number" min={0} max={grading.assignments?.max_points} value={form.grade} onChange={e => setForm({ ...form, grade: Number(e.target.value) })} /></div>
                <div><Label>Feedback</Label><Textarea rows={3} value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} placeholder="Comments for the student..." /></div>
                <div>
                  <Label>Upload marked result file (optional)</Label>
                  <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => onResultFile(e.target.files?.[0] || null)} className="block w-full text-sm border rounded p-2 bg-background mt-1" disabled={saving} />
                  <p className="text-xs text-muted-foreground mt-1">Max 15MB. Student can download this from their portal.</p>
                  {resultFile && !resultError && <p className="text-xs text-green-700 dark:text-green-400 mt-1">✓ {resultFile.name}</p>}
                  {resultError && <p className="text-xs text-destructive mt-1">{resultError}</p>}
                  {(grading as any).result_file_url && !resultFile && (
                    <p className="text-xs text-muted-foreground mt-1">A result file is already attached. Upload a new one to replace it.</p>
                  )}
                </div>
                <Button onClick={save} disabled={saving} className="w-full">
                  {saving ? "Publishing..." : "Publish grade"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// ─── ATTENDANCE ───
const AttendanceAdmin = () => {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("student_enrollments").select("*, students(student_id, profiles:user_id(full_name)), courses(code,title)").eq("status", "in_progress").then(({ data }) => {
      if (data) setEnrollments(data);
    });
  }, []);

  const submit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const rows = Object.entries(statuses).filter(([, v]) => v).map(([enrollment_id, status]) => ({ enrollment_id, date, status, recorded_by: user!.id }));
    if (rows.length === 0) { toast({ title: "Mark at least one student", variant: "destructive" }); return; }
    const { error } = await supabase.from("attendance").insert(rows);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Recorded ${rows.length} entries` }); setStatuses({}); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Mark Attendance</CardTitle>
        <div className="flex gap-2 items-center">
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-40" />
          <Button size="sm" onClick={submit}>Save</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Course</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {enrollments.map(e => (
              <TableRow key={e.id}>
                <TableCell>{e.students?.profiles?.full_name || e.students?.student_id}</TableCell>
                <TableCell className="text-xs">{e.courses?.code}</TableCell>
                <TableCell>
                  <Select value={statuses[e.id] || ""} onValueChange={v => setStatuses({ ...statuses, [e.id]: v })}>
                    <SelectTrigger className="w-32"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>{["present", "absent", "late", "excused"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// ─── EXAM RESULTS ───
const ExamsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ enrollment_id: "", exam_type: "final", score: 0, max_score: 100, exam_date: "", is_published: false });

  const fetchAll = async () => {
    const [r, e] = await Promise.all([
      supabase.from("exam_results").select("*").order("created_at", { ascending: false }),
      supabase.from("student_enrollments").select("id, students(student_id), courses(code,title)"),
    ]);
    if (r.data) setItems(r.data);
    if (e.data) setEnrollments(e.data);
  };
  useEffect(() => { fetchAll(); }, []);

  const save = async () => {
    const { error } = await supabase.from("exam_results").insert({ ...form, exam_date: form.exam_date || null });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Recorded" }); setOpen(false); fetchAll(); }
  };

  const togglePublish = async (id: string, cur: boolean) => {
    await supabase.from("exam_results").update({ is_published: !cur }).eq("id", id);
    fetchAll();
  };

  const enrLabel = (id: string) => {
    const e = enrollments.find(x => x.id === id);
    return e ? `${e.students?.student_id} • ${e.courses?.code}` : "—";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Exam Results ({items.length})</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" />New</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Enrollment</TableHead><TableHead>Type</TableHead><TableHead>Score</TableHead><TableHead>Published</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map(r => (
              <TableRow key={r.id}>
                <TableCell className="text-xs">{enrLabel(r.enrollment_id)}</TableCell>
                <TableCell className="capitalize">{r.exam_type}</TableCell>
                <TableCell>{r.score}/{r.max_score}</TableCell>
                <TableCell>{r.is_published ? <Badge>Published</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell>
                <TableCell><Button size="sm" variant="outline" onClick={() => togglePublish(r.id, r.is_published)}>{r.is_published ? "Unpublish" : "Publish"}</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New Exam Result</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Enrollment</Label>
                <Select value={form.enrollment_id} onValueChange={v => setForm({ ...form, enrollment_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Pick enrollment" /></SelectTrigger>
                  <SelectContent>{enrollments.map(e => <SelectItem key={e.id} value={e.id}>{e.students?.student_id} — {e.courses?.code}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Exam type</Label>
                  <Select value={form.exam_type} onValueChange={v => setForm({ ...form, exam_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["midterm", "final", "quiz", "practical"].map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })} /></div>
                <div><Label>Score</Label><Input type="number" value={form.score} onChange={e => setForm({ ...form, score: Number(e.target.value) })} /></div>
                <div><Label>Max score</Label><Input type="number" value={form.max_score} onChange={e => setForm({ ...form, max_score: Number(e.target.value) })} /></div>
              </div>
              <Button onClick={save} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// ─── MATERIALS ───
const MaterialsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ course_id: "", title: "", description: "", file_url: "", category: "lecture_notes" });

  const fetchAll = async () => {
    const [m, c] = await Promise.all([
      supabase.from("course_materials").select("*, courses(code)").order("created_at", { ascending: false }),
      supabase.from("courses").select("id,code,title").eq("is_published", true),
    ]);
    if (m.data) setItems(m.data);
    if (c.data) setCourses(c.data);
  };
  useEffect(() => { fetchAll(); }, []);

  const save = async () => {
    if (!form.course_id || !form.title || !form.file_url) { toast({ title: "All required", variant: "destructive" }); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("course_materials").insert({ ...form, uploaded_by: user!.id });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Added" }); setOpen(false); fetchAll(); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Course Materials ({items.length})</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" />New</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map(m => (
              <TableRow key={m.id}>
                <TableCell className="text-xs">{m.courses?.code}</TableCell>
                <TableCell>{m.title}</TableCell>
                <TableCell className="capitalize">{m.category?.replace(/_/g, " ")}</TableCell>
                <TableCell><Button size="sm" variant="outline" onClick={async () => { await supabase.from("course_materials").delete().eq("id", m.id); fetchAll(); }}><Trash2 className="h-3 w-3" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New Material</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Select value={form.course_id} onValueChange={v => setForm({ ...form, course_id: v })}>
                <SelectTrigger><SelectValue placeholder="Course" /></SelectTrigger>
                <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.code} — {c.title}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="File URL" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} />
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["lecture_notes", "past_paper", "textbook", "slides", "video", "other"].map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={save} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// ─── REGISTRATIONS ───
const RegistrationsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  const fetchAll = async () => {
    const { data } = await supabase.from("course_registrations").select("*, students(student_id, profiles:user_id(full_name)), courses(code,title)").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetchAll(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const reg = items.find(r => r.id === id);
    const { error } = await supabase.from("course_registrations").update({ status, reviewed_by: user!.id, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    if (status === "approved" && reg) {
      await supabase.from("student_enrollments").insert({ student_id: reg.student_id, course_id: reg.course_id, academic_year: reg.academic_year, semester: reg.semester });
    }
    toast({ title: `Registration ${status}` });
    fetchAll();
  };

  return (
    <Card>
      <CardHeader><CardTitle>Course Registration Requests ({items.length})</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Course</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.students?.profiles?.full_name || r.students?.student_id}</TableCell>
                <TableCell className="text-xs">{r.courses?.code} — {r.courses?.title}</TableCell>
                <TableCell className="text-xs">{r.semester} {r.academic_year}</TableCell>
                <TableCell><Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"} className="capitalize">{r.status}</Badge></TableCell>
                <TableCell className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "approved")} disabled={r.status === "approved"}><Check className="h-3 w-3" /></Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")} disabled={r.status === "rejected"}><X className="h-3 w-3" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// ─── ID CARDS ───
const IDCardsAdmin = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<{ student: any; profile: any } | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("students").select("*").order("student_id"),
      supabase.from("profiles").select("id, full_name, email, avatar_url"),
    ]).then(([s, p]) => { if (s.data) setStudents(s.data); if (p.data) setProfiles(p.data); });
  }, []);

  const filtered = students.filter(s => {
    const profile = profiles.find(p => p.id === s.user_id);
    const q = search.toLowerCase();
    return s.student_id.toLowerCase().includes(q) || s.program.toLowerCase().includes(q) || (profile?.full_name || "").toLowerCase().includes(q);
  });

  const issue = (s: any) => {
    const profile = profiles.find(p => p.id === s.user_id) || { full_name: "—" };
    setActive({ student: s, profile });
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Issue Student ID Cards</CardTitle>
        <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Student ID</TableHead><TableHead>Name</TableHead><TableHead>Program</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(s => {
              const profile = profiles.find(p => p.id === s.user_id);
              return (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.student_id}</TableCell>
                  <TableCell>{profile?.full_name || "—"}</TableCell>
                  <TableCell className="text-sm">{s.program}</TableCell>
                  <TableCell><Button size="sm" onClick={() => issue(s)}><IdCard className="h-3 w-3 mr-1" />Issue & Print</Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {active && <StudentIDCard open={open} onOpenChange={setOpen} student={active.student} profile={active.profile} />}
      </CardContent>
    </Card>
  );
};

export default AcademicAdminTab;
