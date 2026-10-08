import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2, XCircle, ShieldCheck, Loader2, Search, GraduationCap,
  ClipboardPaste, Copy, Printer, AlertTriangle, Lock, FileSearch, Building2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Status = "idle" | "loading" | "valid" | "revoked" | "not_found" | "error";

interface Transcript {
  id: string;
  student_code: string;
  student_name: string;
  program: string;
  level: string | null;
  cumulative_gpa: number;
  total_credits: number;
  courses_completed: number;
  issued_at: string;
  is_revoked: boolean;
  revoked_at: string | null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Accept full URLs, raw IDs, or trimmed text — extract a UUID if present.
const extractId = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return match ? match[0] : null;
};

const VerifyTranscript = () => {
  const { id: routeId } = useParams();
  const [search] = useSearchParams();
  const initial = routeId || search.get("id") || "";
  const [input, setInput] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const verify = async (raw: string) => {
    const id = extractId(raw);
    if (!id || !UUID_RE.test(id)) {
      setStatus("error");
      setErrorMsg("That doesn't look like a valid transcript ID. It should be a 36-character code like 9c5f1a2b-3d4e-...");
      setTranscript(null);
      return;
    }
    setErrorMsg(null);
    setStatus("loading");
    setTranscript(null);
    const { data, error } = await supabase
      .from("transcripts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      setStatus("error");
      setErrorMsg("We couldn't reach the verification service. Please try again in a moment.");
      return;
    }
    if (!data) { setStatus("not_found"); return; }
    setTranscript(data as any);
    setStatus(data.is_revoked ? "revoked" : "valid");
  };

  useEffect(() => {
    if (initial) verify(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      toast({ title: "Clipboard blocked", description: "Please paste manually with Ctrl/Cmd+V.", variant: "destructive" });
    }
  };

  const copyId = async () => {
    if (!transcript) return;
    await navigator.clipboard.writeText(transcript.id);
    toast({ title: "Transcript ID copied" });
  };

  const showResult = status === "valid" || status === "revoked" || status === "not_found";

  return (
    <div className="bg-gradient-to-b from-muted/40 to-background min-h-[80vh]">
      {/* Hero */}
      <section className="bg-college-green-dark text-primary-foreground py-12 md:py-16 print:hidden">
        <div className="container-max max-w-3xl text-center px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-college-gold/20 border border-college-gold/40 mb-4">
            <ShieldCheck className="h-8 w-8 text-college-gold" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Transcript Verification Portal</h1>
          <p className="opacity-80 max-w-xl mx-auto">
            For employers, institutions, and verifying parties. Confirm the authenticity of any official S.D.A Nursing & Midwifery – Anyinasu transcript in seconds.
          </p>
        </div>
      </section>

      <div className="container-max max-w-3xl px-4 -mt-8 md:-mt-10 pb-16">
        {/* Search card */}
        <Card className="shadow-lg print:hidden">
          <CardContent className="p-5 md:p-6">
            <label htmlFor="transcript-id" className="text-sm font-semibold mb-2 block">
              Enter Transcript ID
            </label>
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => { e.preventDefault(); verify(input); }}
            >
              <div className="relative flex-1">
                <FileSearch className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  id="transcript-id"
                  placeholder="e.g. 9c5f1a2b-3d4e-4f5a-8b6c-1234567890ab"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={300}
                  className="font-mono pl-9 pr-24"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePaste}
                  className="absolute right-1 top-1 h-8 px-2 text-xs"
                >
                  <ClipboardPaste className="h-3.5 w-3.5 mr-1" /> Paste
                </Button>
              </div>
              <Button type="submit" disabled={!input.trim() || status === "loading"} className="sm:w-32">
                {status === "loading"
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Checking</>
                  : <><Search className="h-4 w-4 mr-1" /> Verify</>}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Lock className="h-3 w-3" /> You can also paste the full verification URL or scan the QR code on an official transcript.
            </p>

            {errorMsg && status === "error" && (
              <div className="mt-3 flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading */}
        {status === "loading" && (
          <Card className="mt-6">
            <CardContent className="p-10 flex flex-col items-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              <p>Verifying against our records…</p>
            </CardContent>
          </Card>
        )}

        {/* Not found */}
        {status === "not_found" && (
          <Card className="mt-6 border-destructive/40 overflow-hidden">
            <div className="bg-destructive/10 px-6 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-destructive">Not Found in Our Records</h2>
                <p className="text-sm text-destructive/80">No transcript with this ID exists. The document may be fraudulent or the ID was mistyped.</p>
              </div>
            </div>
            <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
              <p>Please double-check the ID for typos. If you believe this is a genuine transcript, contact the Registrar's office for assistance.</p>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link to="/contact"><GraduationCap className="h-4 w-4 mr-1" /> Contact the Registrar</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Valid / Revoked */}
        {transcript && (status === "valid" || status === "revoked") && (
          <Card className={`mt-6 overflow-hidden ${status === "valid" ? "border-green-500/40" : "border-destructive/40"}`}>
            {/* Status banner */}
            <div className={`px-6 py-5 flex flex-wrap items-center justify-between gap-3 ${status === "valid" ? "bg-green-500/10" : "bg-destructive/10"
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${status === "valid" ? "bg-green-500/20" : "bg-destructive/20"
                  }`}>
                  {status === "valid"
                    ? <CheckCircle2 className="h-7 w-7 text-green-600" />
                    : <XCircle className="h-7 w-7 text-destructive" />}
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${status === "valid" ? "text-green-600" : "text-destructive"}`}>
                    {status === "valid" ? "Verified Authentic" : "Transcript Revoked"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {status === "valid"
                      ? "This transcript is on file and remains valid."
                      : "This transcript has been revoked by the issuing institution."}
                  </p>
                </div>
              </div>
              <Badge variant={status === "valid" ? "default" : "destructive"} className="text-xs uppercase tracking-wide">
                {status === "valid" ? "Valid" : "Revoked"}
              </Badge>
            </div>

            <CardContent className="p-6 space-y-5">
              {/* Institution */}
              <div className="flex items-center gap-3 text-sm bg-muted/40 rounded-md p-3">
                <Building2 className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold leading-tight">S.D.A Nursing & Midwifery Training College</p>
                  <p className="text-xs text-muted-foreground">Anyinasu, Ashanti Region, Ghana</p>
                </div>
              </div>

              {/* Student details */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Student Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <Field label="Full Name" value={transcript.student_name} />
                  <Field label="Student ID" value={transcript.student_code} mono />
                  <Field label="Program" value={transcript.program} />
                  <Field label="Level" value={transcript.level || "—"} />
                </div>
              </div>

              <Separator />

              {/* Academic record */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Academic Record</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Stat label="GPA" value={Number(transcript.cumulative_gpa).toFixed(2)} />
                  <Stat label="Credits" value={String(transcript.total_credits)} />
                  <Stat label="Courses" value={String(transcript.courses_completed)} />
                </div>
              </div>

              <Separator />

              {/* Issuance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Field
                  label="Date Issued"
                  value={new Date(transcript.issued_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                />
                <Field
                  label="Verified On"
                  value={new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                />
              </div>

              {/* Revoked notice */}
              {status === "revoked" && transcript.revoked_at && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3 text-sm text-destructive flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Revoked on{" "}
                    <strong>{new Date(transcript.revoked_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong>.
                    Do not accept this document as proof of qualification.
                  </span>
                </div>
              )}

              {/* Footer / actions */}
              <div className="border-t pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground font-mono break-all max-w-full">
                  ID: {transcript.id}
                </div>
                <div className="flex gap-2 print:hidden">
                  <Button size="sm" variant="outline" onClick={copyId}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy ID
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.print()}>
                    <Printer className="h-3.5 w-3.5 mr-1" /> Print
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trust signals */}
        {!showResult && status !== "loading" && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
            <TrustItem icon={ShieldCheck} title="Tamper-proof" desc="Records are sealed at issuance and cannot be altered." />
            <TrustItem icon={Lock} title="Privacy-respecting" desc="Only minimal academic details are shown for verification." />
            <TrustItem icon={CheckCircle2} title="Instant" desc="Direct lookup against the official institutional database." />
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-muted/40 rounded-md py-3">
    <p className="text-2xl font-bold text-primary">{value}</p>
    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
  </div>
);

const TrustItem = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="bg-background border rounded-md p-4 text-center">
    <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
    <p className="font-semibold text-sm">{title}</p>
    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
  </div>
);

export default VerifyTranscript;
