import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CourseOutlinesProps {
  enrollments: any[];
}

const CourseOutlines = ({ enrollments }: CourseOutlinesProps) => {
  const coursesWithOutline = enrollments.filter(e => e.courses?.outline || e.courses?.description);

  if (enrollments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No enrolled courses found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> Course Outlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {enrollments.map(e => (
            <AccordionItem key={e.id} value={e.id}>
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-3 text-left">
                  <span className="font-mono text-xs text-muted-foreground">{e.courses?.code}</span>
                  <span className="font-medium">{e.courses?.title}</span>
                  <Badge variant={e.status === "completed" ? "default" : "secondary"} className="text-xs ml-auto mr-2">
                    {e.status === "completed" ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-2">
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">Credits: <strong className="text-foreground">{e.courses?.credits}</strong></span>
                    <span className="text-muted-foreground">Program: <strong className="text-foreground">{e.courses?.program || "—"}</strong></span>
                    <span className="text-muted-foreground">Semester: <strong className="text-foreground">{e.courses?.semester || "—"}</strong></span>
                  </div>
                  {e.courses?.description && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Description</p>
                      <p className="text-sm text-foreground">{e.courses.description}</p>
                    </div>
                  )}
                  {e.courses?.outline && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Course Outline</p>
                      <div className="text-sm text-foreground whitespace-pre-wrap bg-muted/50 rounded-md p-3">
                        {e.courses.outline}
                      </div>
                    </div>
                  )}
                  {!e.courses?.description && !e.courses?.outline && (
                    <p className="text-sm text-muted-foreground italic">No outline available for this course yet.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default CourseOutlines;
