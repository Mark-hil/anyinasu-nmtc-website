import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  category: string | null;
  is_featured: boolean;
  published_at: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("announcements").select("*").order("published_at", { ascending: false });
      if (data) setAnnouncements(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="section-padding bg-muted/30">
      <div className="container-max max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">News & Announcements</h1>
          <p className="text-muted-foreground">Official updates from S.D.A Nursing & Midwifery Training College</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No announcements at this time.</div>
        ) : (
          <div className="space-y-4">
            {announcements.map(a => (
              <Card key={a.id} className={`hover:shadow-md transition-shadow ${a.is_featured ? "border-primary/30 bg-primary/5" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      {a.is_featured ? <Star className="h-5 w-5 text-primary" /> : <Bell className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground">{a.title}</h3>
                        <span className="text-xs text-muted-foreground shrink-0">{format(new Date(a.published_at), "MMM d, yyyy")}</span>
                      </div>
                      {a.is_featured && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary mt-1 inline-block">Featured</span>}
                      <p className="text-sm text-muted-foreground mt-2">
                        {expandedId === a.id ? a.content : a.excerpt}
                      </p>
                      {a.content && a.content !== a.excerpt && (
                        <Button variant="link" size="sm" className="px-0 mt-1 h-auto" onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}>
                          {expandedId === a.id ? "Show less" : "Read more"}
                        </Button>
                      )}
                    </div>
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

export default Announcements;
