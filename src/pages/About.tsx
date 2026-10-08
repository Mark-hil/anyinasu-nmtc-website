import { Award, Target, Eye, BookOpen, Heart, Shield, Star, Users, GraduationCap, Building, Stethoscope, Globe, FlaskConical, Library, Monitor, Dumbbell, Music, Calendar, HandHeart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import principalImg from "@/assets/anyinasu-principal.jpeg";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const timeline = [
  { year: "1998", title: "College Founded", desc: "Established with a pioneer cohort of 50 students in the Ashanti Region." },
  { year: "2005", title: "First Accreditation", desc: "Received full accreditation from the Nursing & Midwifery Council of Ghana." },
  { year: "2012", title: "Campus Expansion", desc: "New clinical skills lab, library, and student hostels opened." },
  { year: "2018", title: "20th Anniversary", desc: "Celebrated 20 years of excellence with over 2,000 alumni worldwide." },
  { year: "2023", title: "Simulation Lab Launch", desc: "State-of-the-art simulation lab commissioned for immersive training." },
  { year: "2026", title: "Accreditation Renewed", desc: "National accreditation renewed for another 5 years." },
];

const values = [
  { icon: Star, title: "Excellence", desc: "Striving for the highest standards in education, research, and service." },
  { icon: Heart, title: "Compassion", desc: "Cultivating empathy and genuine care in every healthcare professional we train." },
  { icon: Shield, title: "Integrity", desc: "Upholding ethical principles and transparency in all that we do." },
  { icon: Globe, title: "Service", desc: "Dedicated to improving healthcare outcomes in communities across Ghana." },
];

const numbers = [
  { icon: Users, value: "500+", label: "Alumni Worldwide" },
  { icon: GraduationCap, value: "94%", label: "Job Placement Rate" },
  { icon: Building, value: "12+", label: "Partner Hospitals" },
  { icon: Stethoscope, value: "6", label: "Accredited Programs" },
];

const academics = [
  { icon: BookOpen, title: "Comprehensive Curriculum", desc: "Our programs cover Registered General Nursing, Midwifery, Community Health, and more — all aligned with national healthcare standards." },
  { icon: FlaskConical, title: "Hands-On Teaching", desc: "We emphasize practical, clinical-based learning with rotations at partner hospitals alongside traditional classroom instruction." },
  { icon: Monitor, title: "Special Programs", desc: "Simulation-based training, community outreach practicums, and mentorship programs prepare students for real-world challenges." },
];

const studentLife = [
  { icon: Music, title: "Clubs & Activities", desc: "Drama, debate, choir, health awareness clubs, and student government keep campus life vibrant." },
  { icon: Dumbbell, title: "Sports", desc: "Inter-college competitions in football, volleyball, athletics, and table tennis foster teamwork and fitness." },
  { icon: Calendar, title: "Events", desc: "Annual health week, cultural festivals, career fairs, and graduation ceremonies create lasting memories." },
  { icon: HandHeart, title: "Community Involvement", desc: "Regular health screenings, blood donation drives, and outreach to underserved communities." },
];

const facilities = [
  { icon: Building, title: "Modern Classrooms", desc: "Spacious, air-conditioned lecture halls equipped with projectors and smart boards." },
  { icon: FlaskConical, title: "Skills & Simulation Labs", desc: "State-of-the-art labs with mannequins and clinical equipment for realistic practice." },
  { icon: Library, title: "Library & E-Resources", desc: "Well-stocked library with textbooks, journals, and computer stations for research." },
  { icon: Monitor, title: "ICT Center", desc: "Computer lab with high-speed internet for digital learning and research." },
  { icon: Dumbbell, title: "Sports Grounds", desc: "Football pitch, volleyball court, and indoor games area for recreation and fitness." },
];

const About = () => (
  <div>
    {/* Hero */}
    <section className="relative bg-primary text-primary-foreground py-20 md:py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--college-gold)/0.15),_transparent_60%)]" />
      <div className="container-max relative z-10 text-center max-w-3xl mx-auto">
        <p className="text-college-gold font-semibold uppercase tracking-widest text-sm mb-3">Est. 1998</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5">About S.D.A Nursing & Midwifery - Anyinasu</h1>
        <p className="text-lg md:text-xl opacity-90 leading-relaxed">
          For over two decades, we have been shaping Ghana's finest nursing and healthcare professionals with dedication, integrity, and an unwavering commitment to excellence.
        </p>
      </div>
    </section>

    {/* Numbers */}
    <section className="bg-college-green-dark">
      <div className="container-max px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {numbers.map((n, i) => (
          <ScrollReveal key={n.label} delay={i * 100} direction="up">
            <div className="text-center text-primary-foreground">
              <n.icon className="h-7 w-7 mx-auto mb-2 text-college-gold" />
              <div className="text-3xl font-extrabold">{n.value}</div>
              <div className="text-sm opacity-80">{n.label}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="section-padding bg-background">
      <div className="container-max grid md:grid-cols-2 gap-8">
        {[
          { icon: Target, title: "Our Mission", text: "To provide quality nursing and midwifery education that produces competent, compassionate, and ethical healthcare professionals who contribute meaningfully to the health sector of Ghana and beyond." },
          { icon: Eye, title: "Our Vision", text: "To be a center of excellence in nursing and healthcare education in West Africa, recognized for innovative teaching, impactful research, and community service." },
        ].map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 150} direction={i === 0 ? "left" : "right"}>
            <div className="p-8 rounded-2xl bg-college-green-light border border-primary/10 h-full">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* Principal's Message */}
    <section className="section-padding bg-muted">
      <div className="container-max grid md:grid-cols-5 gap-10 items-center">
        <ScrollReveal className="md:col-span-2 flex justify-center" direction="left">
          <div className="relative">
            <div className="w-60 h-72 rounded-2xl overflow-hidden shadow-xl border-4 border-college-gold">
              <img src={principalImg} alt="Mrs. Regina Adu" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-60 h-72 rounded-2xl border-2 border-primary/20 -z-10" />
          </div>
        </ScrollReveal>
        <ScrollReveal className="md:col-span-3 space-y-4" direction="right" delay={200}>
          <p className="text-college-gold font-semibold uppercase tracking-wider text-sm">Message from the Principal</p>
          <h2 className="text-3xl font-bold text-foreground">A Legacy of Excellence</h2>
          <p className="text-muted-foreground leading-relaxed">
            "Our mission has always been clear: to train nurses and healthcare professionals who are not only clinically competent but also deeply compassionate. Every student at S.D.A Nursing & Midwifery - Anyinasu is part of a proud tradition of service to humanity. I invite you to join us and become part of this incredible journey."
          </p>
          <div className="pt-2">
            <p className="font-bold text-foreground">Mrs. Regina Adu</p>
            <p className="text-sm text-primary">Principal / Directo r of Nursing</p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* History Timeline */}
    <section className="section-padding bg-background">
      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mb-14">
            <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Journey</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From a small pioneer class to a nationally accredited institution — here are the milestones that shaped S.D.A Nursing & Midwifery - Anyinasu.</p>
          </div>
        </ScrollReveal>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />
          {timeline.map((item, i) => (
            <ScrollReveal key={item.year} delay={i * 120} direction={i % 2 === 0 ? "left" : "right"}>
              <div className={`relative flex items-start mb-10 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-college-gold rounded-full -translate-x-1/2 mt-1.5 ring-4 ring-background z-10" />
                <div className={`ml-10 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:pr-10 md:text-right" : "md:pl-10"}`}>
                  <span className="text-sm font-bold text-college-gold">{item.year}</span>
                  <h4 className="font-bold text-foreground text-lg">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Academics */}
    <section className="section-padding bg-muted">
      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mb-12">
            <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Academics</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A rigorous, practice-oriented approach to nursing and healthcare education.</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {academics.map((a, i) => (
            <ScrollReveal key={a.title} delay={i * 150} direction="up">
              <div className="p-7 rounded-2xl bg-background border border-border h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <a.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-foreground text-lg mb-2">{a.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={400}>
          <div className="text-center mt-10">
            <Link to="/courses" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              Explore our full course catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Student Life */}
    <section className="section-padding bg-college-green-light">
      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Users className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Student Life</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Beyond the classroom — a vibrant community that nurtures growth, leadership, and lasting friendships.</p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentLife.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 120} direction="scale">
              <div className="text-center p-7 rounded-2xl bg-background shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-full bg-college-gold/10 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="h-7 w-7 text-college-gold" />
                </div>
                <h4 className="font-bold text-foreground mb-2">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={400}>
          <div className="text-center mt-10">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              See campus life in our gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Facilities */}
    <section className="section-padding bg-background">
      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Building className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Facilities</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Modern infrastructure designed to support world-class nursing education.</p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 100} direction="up">
              <div className="flex gap-4 p-6 rounded-2xl bg-muted border border-border hover:border-primary/20 transition-colors h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{f.title}</h4>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={400}>
          <div className="text-center mt-10">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              View our facilities gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Core Values */}
    <section className="section-padding bg-college-green-light">
      <div className="container-max">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Our Core Values</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 120} direction="scale">
              <div className="text-center p-8 rounded-2xl bg-background shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-college-gold/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-7 w-7 text-college-gold" />
                </div>
                <h4 className="font-bold text-foreground mb-2">{v.title}</h4>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Accreditation */}
    <section className="section-padding bg-primary text-primary-foreground">
      <ScrollReveal>
        <div className="container-max text-center max-w-3xl mx-auto">
          <Award className="h-12 w-12 mx-auto mb-4 text-college-gold" />
          <h2 className="text-3xl font-bold mb-4">Nationally Accredited</h2>
          <p className="opacity-90 leading-relaxed mb-6">
            S.D.A Nursing & Midwifery - Anyinasu is fully accredited by the Nursing and Midwifery Council of Ghana (NMC) and recognized by the National Accreditation Board (NAB). Our programs meet the highest national and international standards for nursing and healthcare education.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
            {["Nursing & Midwifery Council", "National Accreditation Board", "Ministry of Health", "Ghana Health Service"].map((org) => (
              <span key={org} className="bg-primary-foreground/10 px-4 py-2 rounded-full">{org}</span>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-college-gold text-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  </div>
);

export default About;
