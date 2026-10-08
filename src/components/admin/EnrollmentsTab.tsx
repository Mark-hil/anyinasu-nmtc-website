import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, FileDown } from "lucide-react";
import { computeGPA } from "@/lib/transcript";
import TranscriptPreview from "@/components/transcript/TranscriptPreview";

const EnrollmentsTab = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    student_id: "", course_id: "", grade: "", status: "in_progress", academic_year: "2025/2026", semester: "Semester 1"
  });
  const [previewState, setPreviewState] = useState<null | {
    student: any; enrollments: any[]; studentName: string; transcriptId: string; verificationUrl: string;
  }>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    const [enrollRes, studRes, courseRes] = await Promise.all([
      supabase.from("student_enrollments").select("*, students(student_id, program), courses(code, title, credits)").order("created_at", { ascending: false }),
      supabase.from("students").select("id, student_id, user_id").order("student_id"),
      supabase.from("courses").select("id, code, title").order("code"),
    ]);
    if (enrollRes.data) setEnrollments(enrollRes.data);
    if (studRes.data) setStudents(studRes.data);
    if (courseRes.data) setCourses(courseRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ student_id: "", course_id: "", grade: "", status: "in_progress", academic_year: "2025/2026", semester: "Semester 1" });
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      student_id: item.student_id, course_id: item.course_id,
      grade: item.grade || "", status: item.status,
      academic_year: item.academic_year, semester: item.semester
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.student_id || !form.course_id) {
      toast({ title: "Student and course required", variant: "destructive" });
      return;
    }
    const payload = { ...form, grade: form.grade || null };
    let error;
    if (editing) {
      ({ error } = await supabase.from("student_enrollments").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("student_enrollments").insert(payload));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Updated" : "Enrolled" }); setDialogOpen(false); fetchData(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("student_enrollments").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchData(); }
  };

  const exportOfficialTranscript = async (studentId: string) => {
    const { data: stu } = await supabase.from("students").select("*").eq("id", studentId).maybeSingle();
    if (!stu) { toast({ title: "Student not found", variant: "destructive" }); return; }
    const { data: enr } = await supabase
      .from("student_enrollments")
      .select("*, courses(code, title, credits)")
      .eq("student_id", studentId);
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", stu.user_id).maybeSingle();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast({ title: "Not authenticated", variant: "destructive" }); return; }

    const allEnrollments = enr || [];
    const completed = allEnrollments.filter((e: any) => e.status === "completed");
    const totalCredits = completed.reduce((s: number, e: any) => s + (e.courses?.credits || 0), 0);
    const overallGPA = computeGPA(allEnrollments).gpa;
    const studentName = profile?.full_name || "";

    // Create the transcript record (admins only — RLS-enforced)
    const { data: created, error: insertErr } = await supabase
      .from("transcripts")
      .insert({
        student_id: stu.id,
        student_code: stu.student_id,
        student_name: studentName || stu.student_id,
        program: stu.program,
        level: stu.level,
        cumulative_gpa: Number(overallGPA.toFixed(2)),
        total_credits: totalCredits,
        courses_completed: completed.length,
        issued_by: user.id,
      })
      .select("id")
      .single();

    if (insertErr || !created) {
      toast({ title: "Could not issue transcript", description: insertErr?.message, variant: "destructive" });
      return;
    }

    const verificationUrl = `${window.location.origin}/verify-transcript/${created.id}`;
    setPreviewState({
      student: stu,
      enrollments: allEnrollments,
      studentName,
      transcriptId: created.id,
      verificationUrl,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Enrollments ({enrollments.length})</CardTitle>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Enroll Student</Button>
      </CardHeader>
      <CardContent>
        {previewState && (
          <TranscriptPreview
            open={!!previewState}
            onOpenChange={(o) => !o && setPreviewState(null)}
            student={previewState.student}
            enrollments={previewState.enrollments}
            studentName={previewState.studentName}
            official
            transcriptId={previewState.transcriptId}
            verificationUrl={previewState.verificationUrl}
          />
        )}
        {students.length > 0 && (
          <div className="mb-4 p-3 border rounded-md bg-muted/30">
            <p className="text-sm font-medium mb-2 flex items-center gap-1"><FileDown className="h-4 w-4" /> Export Official Transcript</p>
            <div className="flex flex-wrap gap-2">
              {students.filter(s => enrollments.some(e => e.student_id === s.id)).map(s => (
                <Button key={s.id} size="sm" variant="outline" onClick={() => exportOfficialTranscript(s.id)}>
                  <FileDown className="h-3 w-3 mr-1" /> {s.student_id}
                </Button>
              ))}
            </div>
          </div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Enrollment</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Student</label>
                <Select value={form.student_id} onValueChange={v => setForm({ ...form, student_id: v })} disabled={!!editing}>
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {students.map(s => <SelectItem key={s.id} value={s.id}>{s.student_id}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Course</label>
                <Select value={form.course_id} onValueChange={v => setForm({ ...form, course_id: v })} disabled={!!editing}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.code} — {c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Academic Year (e.g. 2025/2026)" value={form.academic_year} onChange={e => setForm({ ...form, academic_year: e.target.value })} />
                <Select value={form.semester} onValueChange={v => setForm({ ...form, semester: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Semester 1", "Semester 2"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Grade</label>
                  <Input placeholder="e.g. A, B+, C" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
                </div>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={save} className="w-full">{editing ? "Update" : "Enroll"}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {loading ? <p className="text-muted-foreground">Loading...</p> : enrollments.length === 0 ? <p className="text-muted-foreground">No enrollments yet.</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.students?.student_id || "—"}</TableCell>
                  <TableCell className="font-medium">{e.courses?.code} — {e.courses?.title}</TableCell>
                  <TableCell>{e.courses?.credits}</TableCell>
                  <TableCell className="text-sm">{e.academic_year}</TableCell>
                  <TableCell className="text-sm">{e.semester}</TableCell>
                  <TableCell className="font-semibold">{e.grade || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={e.status === "completed" ? "default" : e.status === "failed" ? "destructive" : "secondary"} className="capitalize">
                      {e.status?.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(e)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => remove(e.id)}><Trash2 className="h-3 w-3" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrollmentsTab;
