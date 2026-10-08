import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Printer } from "lucide-react";
import QRCode from "qrcode";
import schoolLogo from "@/assets/school-logo.png";
import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  student: any;
  profile: any;
}

const StudentIDCard = ({ open, onOpenChange, student, profile }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const verifyUrl = `${window.location.origin}/verify-transcript?student=${encodeURIComponent(student.student_id)}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, { width: 120, margin: 0 }).then(setQrDataUrl);
  }, [verifyUrl]);
  const handlePrint = () => {
    const html = cardRef.current?.outerHTML;
    if (!html) return;
    const w = window.open("", "_blank", "width=600,height=800");
    if (!w) return;
    w.document.write(`<html><head><title>Student ID — ${student.student_id}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      </head><body class="p-6 bg-gray-100">${html}</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
  };

  const expiry = new Date(); expiry.setFullYear(expiry.getFullYear() + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Digital Student ID</DialogTitle></DialogHeader>
        <div ref={cardRef} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-emerald-700" style={{ width: "100%", maxWidth: 380 }}>
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white p-3 flex items-center gap-2">
            <img src={schoolLogo} alt="" className="h-10 w-10 bg-white rounded-full p-1" />
            <div>
              <p className="text-[10px] opacity-90 uppercase tracking-wide">S.D.A Nursing & Midwifery</p>
              <p className="text-xs font-bold">Training College</p>
            </div>
          </div>
          <div className="p-4 flex gap-3">
            <Avatar className="h-24 w-24 border-2 border-emerald-700">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl">
                {profile?.full_name?.[0]?.toUpperCase() || <GraduationCap />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-xs space-y-1">
              <p className="font-bold text-sm text-gray-900">{profile?.full_name || "—"}</p>
              <p className="text-gray-600 font-mono">{student.student_id}</p>
              <p className="text-gray-700">{student.program}</p>
              <p className="text-gray-500">{student.level} • {student.semester}</p>
              <p className="text-gray-500">Status: <span className="capitalize font-semibold text-emerald-700">{student.status}</span></p>
            </div>
          </div>
          <div className="px-4 pb-4 flex justify-between items-end border-t pt-2">
            <div className="text-[10px] text-gray-500">
              <p>Issued: {new Date().toLocaleDateString("en-GB")}</p>
              <p>Valid Until: {expiry.toLocaleDateString("en-GB")}</p>
            </div>
            {qrDataUrl && <img src={qrDataUrl} alt="QR" className="h-[60px] w-[60px]" />}
          </div>
          <div className="bg-emerald-700 text-white text-[9px] text-center py-1">
            Property of S.D.A Nursing & Midwifery — If found, please return.
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Print / Save PDF</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentIDCard;
