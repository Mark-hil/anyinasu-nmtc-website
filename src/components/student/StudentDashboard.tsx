import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bell, CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StudentDashboardProps {
  student: any;
  enrollments: any[];
}

const TARGET_CREDITS = 120;

const StudentDashboard = ({ student, enrollments }: StudentDashboardProps) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [feePayments, setFeePayments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const enrIds = enrollments.map(e => e.id);
      const courseIds = enrollments.map(e => e.course_id);
      const [annRes, feeRes, asgRes, evRes] = await Promise.all([
        supabase.from("announcements").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(3),
        supabase.from("fee_payments").select("*").eq("user_id", student.user_id).order("created_at", { ascending: false }),
        courseIds.length ? supabase.from("assignments").select("*, courses(code)").in("course_id", courseIds).gte("due_date", new Date().toISOString()).order("due_date").limit(5) : Promise.resolve({ data: [] as any[] }),
        supabase.from("events").select("*").eq("is_published", true).gte("start_date", new Date().toISOString()).order("start_date").limit(3),
      ]);
      if (annRes.data) setAnnouncements(annRes.data);
      if (feeRes.data) setFeePayments(feeRes.data);
      if (asgRes.data) setAssignments(asgRes.data);
      if (evRes.data) setEvents(evRes.data);
    };
    fetchData();
  }, [student.user_id, enrollments]);

  const totalPaid = feePayments.filter(p => p.status === "verified").reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = feePayments.filter(p => p.status === "pending").reduce((sum, p) => sum + Number(p.amount), 0);
  const completedCourses = enrollments.filter(e => e.status === "completed");
  const inProgressCourses = enrollments.filter(e => e.status === "in_progress").length;
  const creditsEarned = completedCourses.reduce((s, e) => s + (e.courses?.credits || 0), 0);
  const progressPct = Math.min(100, Math.round((creditsEarned / TARGET_CREDITS) * 100));

  const deadlines = [
    ...assignments.map(a => ({ type: "Assignment", title: `${a.courses?.code} — ${a.title}`, date: a.due_date })),
    ...events.map(e => ({ type: "Event", title: e.title, date: e.start_date })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-primary">{Number(student.gpa).toFixed(2)}</p><p className="text-sm text-muted-foreground mt-1">Current GPA</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-primary">{student.level}</p><p className="text-sm text-muted-foreground mt-1">{student.semester}</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-primary">{completedCourses.length}</p><p className="text-sm text-muted-foreground mt-1">Completed Courses</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-primary">{inProgressCourses}</p><p className="text-sm text-muted-foreground mt-1">In Progress</p></CardContent></Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Academic Progress</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Credits earned</span>
              <span className="font-semibold">{creditsEarned} / {TARGET_CREDITS}</span>
            </div>
            <Progress value={progressPct} className="h-2" />
            <p className="text-xs text-muted-foreground">{progressPct}% toward graduation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Fee Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Paid (Verified)</span><span className="font-semibold text-primary">GHS {totalPaid.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pending Verification</span><span className="font-semibold text-amber-600">GHS {totalPending.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm border-t pt-2"><span className="text-muted-foreground">Total Payments</span><span className="font-semibold">{feePayments.length}</span></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CalendarClock className="h-4 w-4" /> Upcoming Deadlines</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {deadlines.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming deadlines.</p> : deadlines.map((d, i) => (
              <div key={i} className="flex items-start justify-between border-b last:border-0 pb-2 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{d.title}</p>
                  <Badge variant="outline" className="text-xs mt-1">{d.type}</Badge>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">{new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Latest Announcements</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {announcements.length === 0 ? <p className="text-sm text-muted-foreground">No announcements.</p> : announcements.map((a) => (
              <div key={a.id} className="flex items-start justify-between border-b last:border-0 pb-2 last:pb-0">
                <div>
                  <p className="text-sm text-foreground font-medium">{a.title}</p>
                  {a.excerpt && <p className="text-xs text-muted-foreground">{a.excerpt}</p>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">{new Date(a.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Student Information</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">Student ID</span><p className="font-mono font-medium">{student.student_id}</p></div>
            <div><span className="text-muted-foreground">Program</span><p className="font-medium">{student.program}</p></div>
            <div><span className="text-muted-foreground">Level</span><p className="font-medium">{student.level}</p></div>
            <div><span className="text-muted-foreground">Semester</span><p className="font-medium">{student.semester}</p></div>
            <div><span className="text-muted-foreground">Status</span><p><Badge variant={student.status === "active" ? "default" : "secondary"} className="capitalize">{student.status}</Badge></p></div>
            <div><span className="text-muted-foreground">Admission Date</span><p className="font-medium">{student.admission_date ? new Date(student.admission_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
