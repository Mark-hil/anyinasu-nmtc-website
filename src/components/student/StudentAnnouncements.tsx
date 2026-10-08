import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("announcements").select("*").eq("is_published", true).order("published_at", { ascending: false });
      if (data) setAnnouncements(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-4 w-4" /> Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> : announcements.length === 0 ? (
          <p className="text-muted-foreground text-sm">No announcements at the moment.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map(a => (
              <div key={a.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{a.title}</h3>
                    {a.is_featured && <Badge variant="default" className="text-xs">Featured</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs capitalize">{a.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                {a.excerpt && <p className="text-sm text-muted-foreground mb-1">{a.excerpt}</p>}
                {a.content && <p className="text-sm text-foreground">{a.content}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAnnouncements;
