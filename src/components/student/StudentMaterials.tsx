import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, Loader2 } from "lucide-react";

interface Props { enrollments: any[]; }

const StudentMaterials = ({ enrollments }: Props) => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = enrollments.map(e => e.course_id);
    if (ids.length === 0) { setLoading(false); return; }
    supabase.from("course_materials").select("*, courses(code,title)").in("course_id", ids).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setMaterials(data); setLoading(false); });
  }, [enrollments]);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const grouped = materials.reduce((acc, m) => {
    const key = `${m.courses?.code} — ${m.courses?.title}`;
    (acc[key] ||= []).push(m); return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-4">
      {materials.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No study materials available yet.</CardContent></Card>
      ) : Object.entries(grouped).map(([course, items]) => (
        <Card key={course}>
          <CardHeader><CardTitle className="text-base">{course}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(items as any[]).map(m => (
              <div key={m.id} className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{m.title}</p>
                    {m.description && <p className="text-xs text-muted-foreground">{m.description}</p>}
                    <Badge variant="outline" className="mt-1 text-xs capitalize">{m.category?.replace(/_/g, " ")}</Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href={m.file_url} target="_blank" rel="noreferrer"><Download className="h-3 w-3 mr-1" />Download</a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentMaterials;
