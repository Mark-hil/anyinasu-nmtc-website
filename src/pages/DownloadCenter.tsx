import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DownloadItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: string | null;
  category: string | null;
  download_count: number;
}

const categories = ["all", "admissions", "academic", "clinical", "financial", "general"];

const DownloadCenter = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("downloads").select("*").order("created_at", { ascending: false });
      if (data) setDownloads(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = downloads
    .filter(d => filter === "all" || d.category === filter)
    .filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase()));

  const getIcon = (type: string | null) => {
    const colors: Record<string, string> = { pdf: "text-destructive", doc: "text-primary", xls: "text-accent" };
    return <FileText className={`h-8 w-8 ${colors[type || ""] || "text-muted-foreground"}`} />;
  };

  return (
    <div className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Download Center</h1>
          <p className="text-muted-foreground">Access forms, documents, and resources</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(c => (
              <Button key={c} variant={filter === c ? "default" : "outline"} size="sm" onClick={() => setFilter(c)} className="capitalize shrink-0">{c}</Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No documents found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(d => (
              <Card key={d.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  {getIcon(d.file_type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{d.title}</h3>
                    {d.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{d.description}</p>}
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="uppercase">{d.file_type}</span>
                      {d.file_size && <span>{d.file_size}</span>}
                      <span className="capitalize">{d.category}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={d.file_url} download><Download className="h-4 w-4 mr-1" /> Download</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadCenter;
