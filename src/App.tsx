import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Staff from "./pages/Staff";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import StudentPortal from "./pages/StudentPortal";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Admissions from "./pages/Admissions";
import StaffPortal from "./pages/StaffPortal";
import EventCalendar from "./pages/EventCalendar";
import DownloadCenter from "./pages/DownloadCenter";
import FeePayment from "./pages/FeePayment";
import LMS from "./pages/LMS";
import AlumniRegistration from "./pages/AlumniRegistration";
import Announcements from "./pages/Announcements";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyTranscript from "./pages/VerifyTranscript";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsArticle />} />
            <Route path="/portal" element={<StudentPortal />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/staff-portal" element={<StaffPortal />} />
            <Route path="/events" element={<EventCalendar />} />
            <Route path="/downloads" element={<DownloadCenter />} />
            <Route path="/fees" element={<FeePayment />} />
            <Route path="/lms" element={<LMS />} />
            <Route path="/alumni" element={<AlumniRegistration />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/verify-transcript" element={<VerifyTranscript />} />
            <Route path="/verify-transcript/:id" element={<VerifyTranscript />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
