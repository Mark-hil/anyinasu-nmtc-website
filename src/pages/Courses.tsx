import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Loader2, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  code: string;
  title: string;
  description: string | null;
  outline: string | null;
  credits: number;
  program: string | null;
  semester: string | null;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<string>("All");
  const [selected, setSelected] = useState<Course | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("code");
      if (data) setCourses(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const programs = ["All", ...Array.from(new Set(courses.map(c => c.program).filter(Boolean) as string[]))];
  const filtered = program === "All" ? courses : courses.filter(c => c.program === program);

  const outlineItems = (outline: string | null) =>
    outline ? outline.split(/\n+/).map(l => l.trim()).filter(Boolean) : [];

  return (
    <div>
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Our Courses</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">Explore programs designed to prepare you for a rewarding healthcare career.</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          {programs.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-sm font-medium text-muted-foreground self-center mr-1">Program:</span>
              {programs.map(p => (
                <Button key={p} size="sm" variant={program === p ? "default" : "outline"} onClick={() => setProgram(p)}>
                  {p}
                </Button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No courses available yet. Please check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-semibold text-primary bg-college-green-light px-2 py-0.5 rounded">{course.code}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />{course.credits} credits
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-card-foreground">{course.title}</h3>
                    {course.program && <p className="text-xs text-muted-foreground mt-1">{course.program}{course.semester ? ` • ${course.semester}` : ""}</p>}
                    {course.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">{course.description}</p>}
                    <Button className="w-full mt-4" onClick={() => setSelected(course)}>View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-bold text-foreground font-mono text-xs">{selected.code}</div>
                  <div className="text-xs text-muted-foreground">Code</div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-bold text-foreground">{selected.credits}</div>
                  <div className="text-xs text-muted-foreground">Credits</div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-bold text-foreground text-xs">{selected.semester || "—"}</div>
                  <div className="text-xs text-muted-foreground">Semester</div>
                </div>
              </div>
              {selected.description && <p className="text-sm text-muted-foreground">{selected.description}</p>}
              {outlineItems(selected.outline).length > 0 && (
                <>
                  <h4 className="font-semibold text-foreground">Course Outline</h4>
                  <Accordion type="single" collapsible>
                    {outlineItems(selected.outline).map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`}>
                        <AccordionTrigger className="text-sm">{item}</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          Module covering theory and practical applications.
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
