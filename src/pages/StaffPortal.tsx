import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, CalendarDays, FileText, LogOut, Bell, ClipboardList } from "lucide-react";

const StaffPortal = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
      supabase.from("profiles").select("*").eq("id", session.user.id).single().then(({ data }) => setProfile(data));
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  const tabs = [
    { id: "dashboard", label: "Overview", icon: ClipboardList },
    { id: "students", label: "Students", icon: Users },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  return (
    <div className="bg-muted/30 min-h-[80vh]">
      <div className="bg-primary text-primary-foreground py-4 px-4">
        <div className="container-max flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">{profile?.full_name || user.email}</p>
            <p className="text-xs opacity-80">Staff Portal</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </div>

      <div className="container-max py-6 px-4">
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <Button key={t.id} variant={activeTab === t.id ? "default" : "ghost"} size="sm" onClick={() => setActiveTab(t.id)} className="shrink-0">
              <t.icon className="h-4 w-4 mr-1" /> {t.label}
            </Button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-primary">156</p><p className="text-sm text-muted-foreground mt-1">Total Students</p></CardContent></Card>
            <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-primary">6</p><p className="text-sm text-muted-foreground mt-1">Active Courses</p></CardContent></Card>
            <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-accent">12</p><p className="text-sm text-muted-foreground mt-1">Pending Tasks</p></CardContent></Card>
            <div className="md:col-span-3">
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { text: "Mid-semester grades submission deadline: March 20", date: "Today" },
                    { text: "Faculty meeting scheduled for Friday 2:00 PM", date: "Yesterday" },
                    { text: "New clinical rotation schedule posted", date: "Mar 10" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start justify-between border-b last:border-0 pb-2 last:pb-0">
                      <p className="text-sm text-foreground">{a.text}</p>
                      <span className="text-xs text-muted-foreground shrink-0 ml-4">{a.date}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <Card>
            <CardHeader><CardTitle className="text-base">Student Management</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">View enrolled students, manage grades, and track attendance. Full student management features are being connected to the database.</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-muted-foreground"><th className="text-left py-2">Name</th><th className="text-left py-2">Program</th><th className="text-left py-2">Level</th><th className="text-center py-2">Status</th></tr></thead>
                  <tbody>
                    {[
                      { name: "Kwadwo Appiah", program: "General Nursing", level: "200", status: "Active" },
                      { name: "Ama Mensah", program: "Midwifery", level: "300", status: "Active" },
                      { name: "Yaw Boateng", program: "Community Health", level: "100", status: "Active" },
                    ].map((s, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2.5">{s.name}</td>
                        <td className="py-2.5 text-muted-foreground">{s.program}</td>
                        <td className="py-2.5 text-muted-foreground">{s.level}</td>
                        <td className="py-2.5 text-center"><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "courses" && (
          <Card>
            <CardHeader><CardTitle className="text-base">My Courses</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { code: "NUR 205", title: "Community Health Nursing", students: 42 },
                  { code: "NUR 209", title: "Nursing Research Methods", students: 38 },
                  { code: "NUR 301", title: "Advanced Clinical Practice", students: 25 },
                ].map((c, i) => (
                  <Card key={i} className="border">
                    <CardContent className="p-4">
                      <p className="font-mono text-xs text-muted-foreground">{c.code}</p>
                      <p className="font-semibold mt-1">{c.title}</p>
                      <p className="text-sm text-muted-foreground mt-2">{c.students} students enrolled</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "schedule" && (
          <Card>
            <CardHeader><CardTitle className="text-base">Weekly Teaching Schedule</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-muted-foreground"><th className="text-left py-2">Day</th><th className="text-left py-2">Time</th><th className="text-left py-2">Course</th><th className="text-left py-2">Room</th></tr></thead>
                  <tbody>
                    {[
                      { day: "Monday", time: "8:00–10:00", course: "NUR 205", room: "LH 3" },
                      { day: "Tuesday", time: "10:00–12:00", course: "NUR 209", room: "LH 1" },
                      { day: "Wednesday", time: "8:00–10:00", course: "NUR 205", room: "LH 3" },
                      { day: "Thursday", time: "14:00–16:00", course: "NUR 301", room: "Lab 2" },
                      { day: "Friday", time: "8:00–10:00", course: "NUR 209", room: "LH 1" },
                    ].map((s, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2.5 font-medium">{s.day}</td>
                        <td className="py-2.5 text-muted-foreground">{s.time}</td>
                        <td className="py-2.5 font-mono text-xs">{s.course}</td>
                        <td className="py-2.5 text-muted-foreground">{s.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reports" && (
          <Card>
            <CardHeader><CardTitle className="text-base">Reports & Analytics</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {["Student Performance Report", "Attendance Summary", "Course Completion Rates", "Grade Distribution"].map((r, i) => (
                  <Card key={i} className="border">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{r}</p>
                        <p className="text-xs text-muted-foreground mt-1">Last updated: Mar 10, 2026</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StaffPortal;
