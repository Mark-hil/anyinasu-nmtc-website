import { upcomingEvents } from "@/data/mockData";
import { MapPin } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const typeColors: Record<string, string> = {
  Outreach: "bg-primary/10 text-primary",
  Sports: "bg-college-gold/20 text-college-gold",
  Career: "bg-college-red/10 text-college-red",
  Academic: "bg-accent text-accent-foreground",
  Workshop: "bg-secondary text-secondary-foreground",
};

const UpcomingEvents = () => {
  const doubled = [...upcomingEvents, ...upcomingEvents];

  return (
    <section className="section-padding bg-muted/50 overflow-hidden">
      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Mark your calendar for these important dates.</p>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-5 animate-marquee-medium hover:[animation-play-state:paused]">
          {doubled.map((event, i) => {
            const d = new Date(event.date);
            const day = d.getDate();
            const month = d.toLocaleDateString("en-GB", { month: "short" });
            const colorClass = typeColors[event.type] || "bg-muted text-muted-foreground";

            return (
              <div key={`${event.id}-${i}`} className="flex gap-4 p-4 rounded-lg bg-background border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shrink-0 w-[320px]">
                <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-lg w-16 h-16 shrink-0">
                  <span className="text-2xl font-extrabold leading-none">{day}</span>
                  <span className="text-xs font-semibold uppercase">{month}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{event.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mt-2 ${colorClass}`}>{event.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
