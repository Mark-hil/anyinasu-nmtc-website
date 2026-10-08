import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, ClipboardList, CreditCard, Bell, LogOut, User, Loader2, FilePlus, FileText, CalendarCheck, FolderOpen, MessageSquare, IdCard, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StudentDashboard from "@/components/student/StudentDashboard";
import AcademicRecords from "@/components/student/AcademicRecords";
import CourseOutlines from "@/components/student/CourseOutlines";
import StudentFees from "@/components/student/StudentFees";
import StudentAnnouncements from "@/components/student/StudentAnnouncements";
import StudentProfile from "@/components/student/StudentProfile";
import CourseRegistration from "@/components/student/CourseRegistration";
import StudentAssignments from "@/components/student/StudentAssignments";
import StudentAttendanceExams from "@/components/student/StudentAttendanceExams";
import StudentMaterials from "@/components/student/StudentMaterials";
import StudentMessages from "@/components/student/StudentMessages";
import StudentIDCard from "@/components/student/StudentIDCard";

const StudentPortal = () => {
  const [session, setSession] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [idOpen, setIdOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSession(data.session); else navigate("/auth");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate("/auth"); else setSession(s);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchAll = async () => {
      const [studentRes, profileRes] = await Promise.all([
        supabase.from("students").select("*").eq("user_id", session.user.id).maybeSingle(),
        supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle(),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (!studentRes.data) { setLoading(false); return; }
      setStudent(studentRes.data);
      const { data: enrollData } = await supabase
        .from("student_enrollments").select("*, courses(*)").eq("student_id", studentRes.data.id).order("created_at", { ascending: false });
      if (enrollData) setEnrollments(enrollData);
      setLoading(false);
    };
    fetchAll();
  }, [session?.user?.id]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/auth"); };

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center bg-muted/30"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (!student) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 section-padding">
        <div className="text-center max-w-md">
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Student Record Found</h2>
          <p className="text-muted-foreground mb-4">Your account is not linked to a student record. Please contact the school administration.</p>
          <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Sign Out</Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "register", label: "Course Registration", icon: FilePlus },
    { id: "academic", label: "Academic Records", icon: ClipboardList },
    { id: "assignments", label: "Assignments", icon: FileText },
    { id: "attendance", label: "Attendance & Results", icon: CalendarCheck },
    { id: "materials", label: "Library", icon: FolderOpen },
    { id: "outlines", label: "Course Outlines", icon: BookOpen },
    { id: "fees", label: "Fees", icon: CreditCard },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "profile", label: "Profile", icon: Settings },
  ];

  return (
    <div className="bg-muted/30 min-h-[80vh]">
      <div className="bg-primary text-primary-foreground py-4 px-4">
        <div className="container-max flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : <GraduationCap className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-semibold text-sm">{profile?.full_name || session?.user?.email}</p>
              <p className="text-xs opacity-80">{student.student_id} • {student.program}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setIdOpen(true)}>
              <IdCard className="h-4 w-4 mr-1" /> ID Card
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container-max py-6 px-4">
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <Button key={t.id} variant={activeTab === t.id ? "default" : "ghost"} size="sm" onClick={() => setActiveTab(t.id)} className="shrink-0">
              <t.icon className="h-4 w-4 mr-1" /> {t.label}
            </Button>
          ))}
        </div>

        {activeTab === "dashboard" && <StudentDashboard student={student} enrollments={enrollments} />}
        {activeTab === "register" && <CourseRegistration student={student} />}
        {activeTab === "academic" && <AcademicRecords student={student} enrollments={enrollments} />}
        {activeTab === "assignments" && <StudentAssignments student={student} />}
        {activeTab === "attendance" && <StudentAttendanceExams student={student} enrollments={enrollments} />}
        {activeTab === "materials" && <StudentMaterials enrollments={enrollments} />}
        {activeTab === "outlines" && <CourseOutlines enrollments={enrollments} />}
        {activeTab === "fees" && <StudentFees userId={student.user_id} />}
        {activeTab === "messages" && <StudentMessages userId={student.user_id} />}
        {activeTab === "announcements" && <StudentAnnouncements />}
        {activeTab === "profile" && <StudentProfile userId={student.user_id} />}

        <StudentIDCard open={idOpen} onOpenChange={setIdOpen} student={student} profile={profile} />
      </div>
    </div>
  );
};

export default StudentPortal;
