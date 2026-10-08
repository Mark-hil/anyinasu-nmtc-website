import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Props { student: any; enrollments: any[]; }

const StudentAttendanceExams = ({ student, enrollments }: Props) => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = enrollments.map(e => e.id);
    if (ids.length === 0) { setLoading(false); return; }
    Promise.all([
      supabase.from("attendance").select("*").in("enrollment_id", ids),
      supabase.from("exam_results").select("*").in("enrollment_id", ids).eq("is_published", true),
    ]).then(([a, r]) => {
      if (a.data) setAttendance(a.data);
      if (r.data) setResults(r.data);
      setLoading(false);
    });
  }, [enrollments]);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const pctFor = (eid: string) => {
    const recs = attendance.filter(a => a.enrollment_id === eid);
    if (recs.length === 0) return null;
    const present = recs.filter(a => a.status === "present" || a.status === "late").length;
    return Math.round((present / recs.length) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Attendance by Course</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {enrollments.length === 0 ? <p className="text-sm text-muted-foreground">No enrollments.</p> : enrollments.map(e => {
            const pct = pctFor(e.id);
            return (
              <div key={e.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{e.courses?.code} — {e.courses?.title}</span>
                  <span className={pct == null ? "text-muted-foreground" : pct < 75 ? "text-destructive" : "text-primary"}>
                    {pct == null ? "No records" : `${pct}%`}
                  </span>
                </div>
                {pct != null && <Progress value={pct} className="h-2" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Published Exam Results</CardTitle></CardHeader>
        <CardContent>
          {results.length === 0 ? <p className="text-sm text-muted-foreground">No published results yet.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground border-b">
                  <tr>
                    <th className="text-left py-2 pr-4">Course</th>
                    <th className="text-left py-2 pr-4">Type</th>
                    <th className="text-right py-2 pr-4">Score</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => {
                    const enr = enrollments.find(e => e.id === r.enrollment_id);
                    const pct = (Number(r.score) / Number(r.max_score)) * 100;
                    return (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">{enr?.courses?.code} — {enr?.courses?.title}</td>
                        <td className="py-2 pr-4 capitalize">{r.exam_type}</td>
                        <td className="py-2 pr-4 text-right font-semibold">{r.score}/{r.max_score} <Badge variant={pct >= 50 ? "default" : "destructive"} className="ml-2">{pct.toFixed(0)}%</Badge></td>
                        <td className="py-2 text-muted-foreground">{r.exam_date ? new Date(r.exam_date).toLocaleDateString("en-GB") : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendanceExams;
