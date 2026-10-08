import { Award, Users, Clock, Briefcase, Megaphone } from "lucide-react";
import { announcements } from "@/data/mockData";
import { useState, useEffect, useCallback } from "react";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import CoursesMarquee from "@/components/home/CoursesMarquee";
import StaffCarousel from "@/components/home/StaffCarousel";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import PrincipalWelcome from "@/components/home/PrincipalWelcome";
import SchoolVideo from "@/components/home/SchoolVideo";
import LatestNews from "@/components/home/LatestNews";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import PhotoGalleryPreview from "@/components/home/PhotoGalleryPreview";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { label: "Students Trained", value: "500+" },
  { label: "Certified Courses", value: "12" },
  { label: "Job Placement Rate", value: "94%" },
];

const whyUs = [
  { icon: Award, title: "Fully Accredited", desc: "Recognized by the Nursing & Midwifery Council of Ghana" },
  { icon: Users, title: "Expert Staff", desc: "Experienced lecturers with real-world clinical backgrounds" },
  { icon: Clock, title: "Flexible Schedule", desc: "Full-time and part-time programs to suit your lifestyle" },
  { icon: Briefcase, title: "Career Support", desc: "Job placement assistance and career counseling services" },
];

const Index = () => {
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const nextAnnouncement = useCallback(() => {
    setAnnouncementIdx((p) => (p + 1) % announcements.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextAnnouncement, 3000);
    return () => clearInterval(timer);
  }, [nextAnnouncement]);

  return (
    <div>
      <HeroSlideshow />

      {/* Announcements Ticker */}
      <section className="bg-college-red text-college-red-foreground overflow-hidden">
        <div className="container-max px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0 font-bold text-sm uppercase tracking-wide">
            <Megaphone className="h-4 w-4" />
            <span>Trending</span>
          </div>
          <div className="relative flex-1 h-7 overflow-hidden">
            {announcements.map((a, i) => (
              <div
                key={a.id}
                className={`absolute inset-0 flex items-center gap-2 transition-all duration-500 ${i === announcementIdx
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-full"
                  }`}
              >
                <span className="bg-primary-foreground/20 text-xs font-semibold px-2 py-0.5 rounded">{a.tag}</span>
                <span className="text-sm truncate">{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary">
        <div className="container-max px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100} direction="up">
              <div className="text-center text-primary-foreground">
                <div className="text-3xl md:text-4xl font-extrabold mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <ScrollReveal>
        <PrincipalWelcome />
      </ScrollReveal>

      <CoursesMarquee />

      {/* Why Choose Us */}
      <section className="section-padding bg-college-green-light">
        <div className="container-max">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Why Choose S.D.A Nursing & Midwifery - Anyinasu?</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 120} direction="scale">
                <div className="text-center p-6 rounded-lg bg-background shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <LatestNews />
      <UpcomingEvents />

      <ScrollReveal>
        <SchoolVideo />
      </ScrollReveal>

      <PhotoGalleryPreview />

      <StaffCarousel />
      <TestimonialCarousel />
    </div>
  );
};

export default Index;
