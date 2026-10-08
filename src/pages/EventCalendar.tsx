import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  category: string | null;
}

const categories = ["all", "academic", "health", "career", "ceremony", "sports", "admissions"];

const EventCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("events").select("*").order("start_date", { ascending: true });
      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const filtered = filter === "all" ? events : events.filter(e => e.category === filter);

  return (
    <div className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Event Calendar</h1>
          <p className="text-muted-foreground">Stay up to date with all college events and activities</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 mt-2 text-muted-foreground shrink-0" />
          {categories.map(c => (
            <Button key={c} variant={filter === c ? "default" : "outline"} size="sm" onClick={() => setFilter(c)} className="capitalize shrink-0">
              {c}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No events found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-primary text-primary-foreground p-4 text-center">
                  <p className="text-3xl font-bold">{format(new Date(event.start_date), "dd")}</p>
                  <p className="text-sm opacity-90">{format(new Date(event.start_date), "MMMM yyyy")}</p>
                </div>
                <CardContent className="p-5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground capitalize">{event.category}</span>
                  <h3 className="font-semibold mt-2 mb-2">{event.title}</h3>
                  {event.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(event.start_date), "h:mm a")}
                      {event.end_date && ` – ${format(new Date(event.end_date), "h:mm a")}`}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {event.location}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
