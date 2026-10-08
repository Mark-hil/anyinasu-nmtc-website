import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";

interface Props { student: any; }

const CourseRegistration = ({ student }: Props) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [regs, setRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("2025/2026");
  const [sem, setSem] = useState(student.semester || "Semester 1");

  const fetchAll = async () => {
    const [cRes, rRes] = await Promise.all([
      supabase.from("courses").select("*").eq("is_published", true).order("code"),
      supabase.from("course_registrations").select("*, courses(*)").eq("student_id", student.id).order("created_at", { ascending: false }),
    ]);
    if (cRes.data) setCourses(cRes.data);
    if (rRes.data) setRegs(rRes.data);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, [student.id]);

  const register = async (course_id: string) => {
    const { error } = await supabase.from("course_registrations").insert({
      student_id: student.id, course_id, academic_year: year, semester: sem, status: "pending",
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Registration submitted for review" }); fetchAll(); }
  };

  const cancel = async (id: string) => {
    const { error } = await supabase.from("course_registrations").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Registration cancelled" }); fetchAll(); }
  };

  const registeredIds = new Set(regs.filter(r => r.academic_year === year && r.semester === sem).map(r => r.course_id));
  const available = courses.filter(c => !registeredIds.has(c.id));

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const statusVariant = (s: string) => s === "approved" ? "default" : s === "rejected" ? "destructive" : "secondary";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Register for Courses</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Academic Year</p>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["2024/2025", "2025/2026", "2026/2027"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Semester</p>
              <Select value={sem} onValueChange={setSem}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Semester 1", "Semester 2"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {available.length === 0 ? <p className="text-sm text-muted-foreground">No more courses available.</p> : (
            <div className="grid sm:grid-cols-2 gap-3">
              {available.map(c => (
                <div key={c.id} className="border rounded-md p-3 flex justify-between items-start gap-3">
                  <div>
                    <p className="font-medium text-sm">{c.code} — {c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.credits} credits • {c.program || "—"}</p>
                  </div>
                  <Button size="sm" onClick={() => register(c.id)}><Plus className="h-3 w-3 mr-1" />Register</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">My Registrations ({regs.length})</CardTitle></CardHeader>
        <CardContent>
          {regs.length === 0 ? <p className="text-sm text-muted-foreground">No registrations yet.</p> : (
            <div className="space-y-2">
              {regs.map(r => (
                <div key={r.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <p className="text-sm font-medium">{r.courses?.code} — {r.courses?.title}</p>
                    <p className="text-xs text-muted-foreground">{r.semester} • {r.academic_year}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(r.status)} className="capitalize">{r.status}</Badge>
                    {r.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => cancel(r.id)}><X className="h-3 w-3" /></Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseRegistration;
