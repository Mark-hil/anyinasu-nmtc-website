import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "@/data/mockData";

const CoursesMarquee = () => {
  // Duplicate courses for seamless loop
  const doubled = [...courses, ...courses];

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Featured Courses</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Explore our most popular programs designed to prepare you for a rewarding healthcare career.</p>
        </div>
      </div>
      {/* Marquee container */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
          {doubled.map((course, i) => (
            <Card key={`${course.id}-${i}`} className="min-w-[300px] md:min-w-[340px] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border shrink-0">
              <div className="aspect-video overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <CardContent className="p-5">
                <span className="text-xs font-semibold text-primary bg-college-green-light px-2 py-1 rounded">{course.category}</span>
                <h3 className="font-bold text-lg mt-2 text-card-foreground">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Duration: {course.duration}</p>
                <Link to="/courses" className="inline-block mt-3 text-sm font-semibold text-primary hover:underline">
                  View Details →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesMarquee;
