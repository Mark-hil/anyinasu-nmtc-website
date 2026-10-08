import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileText, ExternalLink, Download, AlertCircle, CheckCircle2, Lock, RefreshCw } from "lucide-react";

interface Props { student: any; }

const MAX_FILE_MB = 10;
const ALLOWED = [".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png", ".zip", ".ppt", ".pptx", ".xlsx", ".xls"];

const fmtSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;

const StudentAssignments = ({ student }: Props) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<any>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchAll = async () => {
    const [a, s] = await Promise.all([
      supabase.from("assignments").select("*, courses(code,title)").order("due_date", { ascending: true, nullsFirst: false }),
      supabase.from("assignment_submissions").select("*").eq("student_id", student.id),
    ]);
    if (a.data) setAssignments(a.data);
    if (s.data) setSubmissions(s.data);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, [student.id]);

  const subFor = (aid: string) => submissions.find(s => s.assignment_id === aid);

  const openFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("submissions").createSignedUrl(path, 300);
    if (error || !data) return toast({ title: "Could not open file", description: error?.message, variant: "destructive" });
    window.open(data.signedUrl, "_blank");
  };

  const validateFile = (f: File | null) => {
    setFileError("");
    if (!f) return true;
    const ext = "." + (f.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED.includes(ext)) { setFileError(`Unsupported file type. Allowed: ${ALLOWED.join(", ")}`); return false; }
    if (f.size > MAX_FILE_MB * 1024 * 1024) { setFileError(`File too large. Max ${MAX_FILE_MB}MB (yours: ${fmtSize(f.size)})`); return false; }
    return true;
  };

  const onFileChange = (f: File | null) => {
    setFile(f);
    validateFile(f);
  };

  const submit = async () => {
    if (!active) return;
    if (!text.trim() && !file) { toast({ title: "Add a response or file", variant: "destructive" }); return; }
    if (!validateFile(file)) return;

    setSubmitting(true);
    setProgress(10);
    let file_url: string | null = subFor(active.id)?.file_url || null;

    if (file) {
      const { data: { user } } = await supabase.auth.getUser();
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user!.id}/${active.id}-${Date.now()}-${safe}`;
      setProgress(30);
      const { error: upErr } = await supabase.storage.from("submissions").upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) {
        setSubmitting(false); setProgress(0);
        return toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      }
      file_url = path;
      setProgress(70);
    }

    const existing = subFor(active.id);
    const payload: any = { assignment_id: active.id, student_id: student.id, text_response: text || null, file_url, submitted_at: new Date().toISOString() };
    const { error } = existing
      ? await supabase.from("assignment_submissions").update(payload).eq("id", existing.id)
      : await supabase.from("assignment_submissions").insert(payload);
    setProgress(100);
    setSubmitting(false);
    if (error) toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: existing ? "Resubmission saved" : "Submitted successfully", description: file ? `${file.name} uploaded` : "Your text response was recorded." });
      setActive(null); setText(""); setFile(null); setFileError(""); setProgress(0);
      fetchAll();
    }
  };

  const openSubmit = (a: any) => {
    const ex = subFor(a.id);
    if (ex?.grade != null) {
      return toast({ title: "Already graded", description: "Resubmission is locked once a grade is published.", variant: "destructive" });
    }
    setActive(a); setText(ex?.text_response || ""); setFile(null); setFileError("");
  };

  const statusBadge = (a: any, sub: any) => {
    if (sub?.grade != null) return <Badge className="gap-1"><CheckCircle2 className="h-3 w-3" />Graded {sub.grade}/{a.max_points}</Badge>;
    if (sub) return <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3" />Submitted</Badge>;
    if (a.due_date && new Date(a.due_date) < new Date()) return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Overdue</Badge>;
    return <Badge variant="outline">Pending</Badge>;
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      {assignments.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No assignments posted yet.</CardContent></Card>
      ) : assignments.map(a => {
        const sub = subFor(a.id);
        const graded = sub?.grade != null;
        return (
          <Card key={a.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{a.courses?.code} — {a.courses?.title}</p>
                </div>
                {statusBadge(a, sub)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {a.due_date && <span>Due: {new Date(a.due_date).toLocaleString("en-GB")}</span>}
                <span>Max: {a.max_points} pts</span>
                {sub?.submitted_at && <span>Submitted: {new Date(sub.submitted_at).toLocaleString("en-GB")}</span>}
              </div>
              {a.file_url && (
                <a href={a.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Assignment brief <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {sub?.file_url && (
                <div className="text-xs bg-muted/50 border rounded p-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 truncate"><FileText className="h-3 w-3" /> Your uploaded file</span>
                  <Button size="sm" variant="ghost" className="h-7" onClick={() => openFile(sub.file_url)}>
                    <Download className="h-3 w-3 mr-1" /> Download
                  </Button>
                </div>
              )}
              {sub?.feedback && (
                <div className="text-sm bg-muted p-3 rounded border-l-2 border-primary">
                  <strong>Lecturer feedback:</strong> {sub.feedback}
                </div>
              )}
              {sub?.result_file_url && (
                <div className="text-xs bg-primary/5 border border-primary/20 rounded p-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3 text-primary" /> Graded result from lecturer</span>
                  <Button size="sm" variant="outline" className="h-7" onClick={() => openFile(sub.result_file_url)}>
                    <Download className="h-3 w-3 mr-1" /> Download result
                  </Button>
                </div>
              )}
              <Button size="sm" onClick={() => openSubmit(a)} variant={sub ? "outline" : "default"} disabled={graded}>
                {graded ? <><Lock className="h-3 w-3 mr-1" /> Locked (graded)</>
                  : sub ? <><RefreshCw className="h-3 w-3 mr-1" /> Resubmit</>
                  : <><Upload className="h-3 w-3 mr-1" /> Submit</>}
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={!!active} onOpenChange={(o) => { if (!o && !submitting) { setActive(null); setFile(null); setFileError(""); setProgress(0); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{active?.title}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {subFor(active?.id) && (
              <div className="text-xs bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded p-2 text-amber-900 dark:text-amber-200 flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>You already submitted this assignment. Resubmitting will replace your previous response.</span>
              </div>
            )}
            <div>
              <Label>Your response</Label>
              <Textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder="Type your answer..." maxLength={10000} />
              <p className="text-xs text-muted-foreground mt-1">{text.length}/10000 characters</p>
            </div>
            <div>
              <Label>Attach file (optional)</Label>
              <input
                type="file"
                accept={ALLOWED.join(",")}
                onChange={e => onFileChange(e.target.files?.[0] || null)}
                className="block w-full text-sm border rounded p-2 bg-background"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground mt-1">Max {MAX_FILE_MB}MB · {ALLOWED.join(", ")}</p>
              {file && !fileError && (
                <p className="text-xs text-green-700 dark:text-green-400 mt-1 inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {file.name} · {fmtSize(file.size)}
                </p>
              )}
              {fileError && (
                <p className="text-xs text-destructive mt-1 inline-flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fileError}
                </p>
              )}
            </div>
            {submitting && progress > 0 && (
              <div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {progress < 70 ? "Uploading file..." : progress < 100 ? "Saving submission..." : "Done"}
                </p>
              </div>
            )}
            <Button onClick={submit} disabled={submitting || !!fileError} className="w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              {subFor(active?.id) ? "Resubmit" : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentAssignments;
