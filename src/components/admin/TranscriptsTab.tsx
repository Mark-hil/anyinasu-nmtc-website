import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Copy, Ban, RotateCcw, Search } from "lucide-react";
import { format } from "date-fns";

const TranscriptsTab = () => {
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transcripts")
      .select("*")
      .order("issued_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setTranscripts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const verifyUrl = (id: string) => `${window.location.origin}/verify-transcript/${id}`;

  const copyLink = async (id: string) => {
    await navigator.clipboard.writeText(verifyUrl(id));
    toast({ title: "Verification link copied" });
  };

  const toggleRevoke = async (t: any) => {
    const newState = !t.is_revoked;
    const { error } = await supabase
      .from("transcripts")
      .update({ is_revoked: newState, revoked_at: newState ? new Date().toISOString() : null })
      .eq("id", t.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: newState ? "Transcript revoked" : "Transcript restored" }); fetchData(); }
  };

  // Group by student_code
  const grouped = transcripts.reduce((acc: Record<string, any[]>, t) => {
    (acc[t.student_code] ||= []).push(t);
    return acc;
  }, {});

  const filteredKeys = Object.keys(grouped).filter(k => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return k.toLowerCase().includes(q) ||
      grouped[k].some(t => t.student_name?.toLowerCase().includes(q) || t.program?.toLowerCase().includes(q));
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Issued Transcripts ({transcripts.length})</CardTitle>
        <div className="relative w-72 max-w-full">
          <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search by student, ID, program..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : transcripts.length === 0 ? (
          <p className="text-muted-foreground">No transcripts have been issued yet.</p>
        ) : filteredKeys.length === 0 ? (
          <p className="text-muted-foreground">No matches.</p>
        ) : (
          <div className="space-y-6">
            {filteredKeys.map(code => {
              const items = grouped[code];
              const name = items[0].student_name;
              const program = items[0].program;
              return (
                <div key={code} className="border rounded-md overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{name} <span className="text-muted-foreground font-mono text-xs">({code})</span></p>
                      <p className="text-xs text-muted-foreground">{program}</p>
                    </div>
                    <Badge variant="secondary">{items.length} issued</Badge>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transcript ID</TableHead>
                        <TableHead>Issued</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="font-mono text-xs">{t.id.slice(0, 8)}…</TableCell>
                          <TableCell className="text-sm">{format(new Date(t.issued_at), "MMM d, yyyy 'at' h:mm a")}</TableCell>
                          <TableCell className="font-semibold">{Number(t.cumulative_gpa).toFixed(2)}</TableCell>
                          <TableCell>{t.total_credits}</TableCell>
                          <TableCell>
                            {t.is_revoked
                              ? <Badge variant="destructive">Revoked</Badge>
                              : <Badge>Valid</Badge>}
                          </TableCell>
                          <TableCell className="flex justify-end gap-1">
                            <Button size="sm" variant="outline" onClick={() => copyLink(t.id)} title="Copy verification link">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" asChild title="Open verification page">
                              <a href={verifyUrl(t.id)} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              variant={t.is_revoked ? "outline" : "destructive"}
                              onClick={() => toggleRevoke(t)}
                              title={t.is_revoked ? "Restore" : "Revoke"}
                            >
                              {t.is_revoked ? <RotateCcw className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptsTab;
