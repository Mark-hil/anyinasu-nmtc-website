import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import TranscriptPreview from "@/components/transcript/TranscriptPreview";

interface AcademicRecordsProps {
  student: any;
  enrollments: any[];
}

const AcademicRecords = ({ student, enrollments }: AcademicRecordsProps) => {
  const completed = enrollments.filter(e => e.status === "completed");
  const inProgress = enrollments.filter(e => e.status === "in_progress");
  const [studentName, setStudentName] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setStudentName(data.user?.user_metadata?.full_name || data.user?.email || "");
    });
  }, []);

  const totalCredits = completed.reduce((sum, e) => sum + (e.courses?.credits || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setPreviewOpen(true)} disabled={enrollments.length === 0}>
          <Eye className="h-4 w-4 mr-2" /> Preview & Download Transcript
        </Button>
      </div>
      <TranscriptPreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        student={student}
        enrollments={enrollments}
        studentName={studentName}
        official={false}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-primary">{Number(student.gpa).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Cumulative GPA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-primary">{totalCredits}</p>
            <p className="text-sm text-muted-foreground">Credits Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-primary">{completed.length}</p>
            <p className="text-sm text-muted-foreground">Courses Completed</p>
          </CardContent>
        </Card>
      </div>

      {inProgress.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Currently Enrolled — {student.semester}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-4">Code</th>
                    <th className="text-left py-2 pr-4">Course</th>
                    <th className="text-center py-2 pr-4">Credits</th>
                    <th className="text-center py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inProgress.map(e => (
                    <tr key={e.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-4 font-mono text-xs">{e.courses?.code}</td>
                      <td className="py-2.5 pr-4 text-foreground">{e.courses?.title}</td>
                      <td className="py-2.5 pr-4 text-center">{e.courses?.credits}</td>
                      <td className="py-2.5 text-center">
                        <Badge variant="secondary">In Progress</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {completed.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Completed Courses</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-4">Code</th>
                    <th className="text-left py-2 pr-4">Course</th>
                    <th className="text-center py-2 pr-4">Credits</th>
                    <th className="text-center py-2 pr-4">Grade</th>
                    <th className="text-center py-2">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {completed.map(e => (
                    <tr key={e.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-4 font-mono text-xs">{e.courses?.code}</td>
                      <td className="py-2.5 pr-4 text-foreground">{e.courses?.title}</td>
                      <td className="py-2.5 pr-4 text-center">{e.courses?.credits}</td>
                      <td className="py-2.5 pr-4 text-center font-semibold">{e.grade || "—"}</td>
                      <td className="py-2.5 text-center text-muted-foreground text-xs">{e.academic_year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AcademicRecords;
