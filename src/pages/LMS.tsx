import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, FileText, MessageSquare, Trophy, ExternalLink } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Course Materials", desc: "Access lecture notes, slides, and reading materials for all your enrolled courses." },
  { icon: Video, title: "Video Lectures", desc: "Watch recorded lectures and tutorial videos at your own pace." },
  { icon: FileText, title: "Assignments", desc: "Submit assignments, quizzes, and projects online with instant feedback." },
  { icon: MessageSquare, title: "Discussion Forums", desc: "Engage with classmates and instructors through course discussion boards." },
  { icon: Trophy, title: "Progress Tracking", desc: "Monitor your learning progress, grades, and completion status." },
  { icon: ExternalLink, title: "External Resources", desc: "Access curated medical databases, journals, and learning tools." },
];

const courses = [
  { code: "NUR 205", title: "Community Health Nursing", progress: 65, modules: 12 },
  { code: "NUR 207", title: "Clinical Practicum III", progress: 40, modules: 8 },
  { code: "NUR 209", title: "Nursing Research Methods", progress: 80, modules: 10 },
  { code: "GEN 201", title: "Communication Skills II", progress: 90, modules: 6 },
];

const LMS = () => {
  return (
    <div className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Learning Management System</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Your centralized hub for course materials, assignments, and online learning resources</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((f, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">My Courses</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {courses.map((c, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{c.code}</p>
                      <h3 className="font-semibold mt-1">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{c.modules} modules</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{c.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${c.progress}%` }} />
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">Continue Learning</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Need Help with the LMS?</h2>
            <p className="opacity-90 mb-4">Contact the IT department or visit the help center for guides and tutorials.</p>
            <Button variant="secondary">
              <a href="/contact">Contact IT Support</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LMS;
