import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, X } from "lucide-react";
import { buildTranscriptPDF, transcriptFilename } from "@/lib/transcript";

interface TranscriptPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: any;
  enrollments: any[];
  studentName?: string;
  official?: boolean;
  transcriptId?: string;
  verificationUrl?: string;
  onDownloaded?: () => void;
}

const TranscriptPreview = ({
  open, onOpenChange, student, enrollments, studentName,
  official = false, transcriptId, verificationUrl, onDownloaded,
}: TranscriptPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {
    if (!open) {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null); setDoc(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const built = await buildTranscriptPDF({
          student, enrollments, studentName, official, transcriptId, verificationUrl,
        });
        if (cancelled) return;
        const blob = built.output("blob");
        const url = URL.createObjectURL(blob);
        setDoc(built);
        setPdfUrl(url);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDownload = () => {
    if (!doc) return;
    doc.save(transcriptFilename(student, official));
    onDownloaded?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>
            Transcript Preview {official ? "— Official" : "— Unofficial"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 bg-muted/40 overflow-hidden">
          {loading || !pdfUrl ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Generating preview…
            </div>
          ) : (
            <iframe src={pdfUrl} title="Transcript preview" className="w-full h-full bg-white" />
          )}
        </div>
        <DialogFooter className="p-4 border-t flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-1" /> Close
          </Button>
          <Button onClick={handleDownload} disabled={!doc || loading}>
            <Download className="h-4 w-4 mr-1" /> Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptPreview;
