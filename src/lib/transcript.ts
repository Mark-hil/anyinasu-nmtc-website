import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import schoolLogo from "@/assets/school-logo.png";

interface Student {
  student_id: string;
  program: string;
  level?: string;
  semester?: string;
  gpa?: number | string;
  admission_date?: string | null;
  status?: string;
}

interface Enrollment {
  academic_year?: string;
  semester?: string;
  grade?: string | null;
  status?: string;
  courses?: { code?: string; title?: string; credits?: number } | null;
}

interface TranscriptOptions {
  student: Student;
  enrollments: Enrollment[];
  studentName?: string;
  official?: boolean;
  transcriptId?: string; // unique ID for verification (official only)
  verificationUrl?: string; // full URL embedded in the QR code
}

// Standard 4.0-scale grade points
const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0,
  "F": 0.0,
};

const gradePoint = (grade?: string | null): number | null => {
  if (!grade) return null;
  const key = grade.trim().toUpperCase();
  return GRADE_POINTS[key] ?? null;
};

export const computeGPA = (entries: Enrollment[]) => {
  let totalQualityPoints = 0;
  let totalCredits = 0;
  entries.forEach(e => {
    const gp = gradePoint(e.grade);
    const credits = e.courses?.credits || 0;
    if (gp !== null && credits > 0) {
      totalQualityPoints += gp * credits;
      totalCredits += credits;
    }
  });
  return { gpa: totalCredits > 0 ? totalQualityPoints / totalCredits : 0, credits: totalCredits, qualityPoints: totalQualityPoints };
};

/**
 * Build the transcript PDF and return it as a jsPDF instance (so callers can
 * preview, save, or get a blob URL).
 */
export const buildTranscriptPDF = async ({
  student,
  enrollments,
  studentName,
  official = false,
  transcriptId,
  verificationUrl,
}: TranscriptOptions): Promise<jsPDF> => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const green: [number, number, number] = [30, 80, 50];
  const gold: [number, number, number] = [184, 144, 40];

  // ── Letterhead ──
  try {
    doc.addImage(schoolLogo, "PNG", 40, 30, 70, 70);
  } catch {
    /* ignore if image fails */
  }

  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("S.D.A NURSING & MIDWIFERY TRAINING COLLEGE", pageWidth / 2, 50, { align: "center" });
  doc.setFontSize(10);
  doc.text("Anyinasu — ASHANTI REGION, GHANA", pageWidth / 2, 66, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("P.O. Box 12, Anyinasu  •  +233 (0) 322 000 000  •  registrar@Anyinasuntc.edu.gh", pageWidth / 2, 80, { align: "center" });

  doc.setDrawColor(...gold);
  doc.setLineWidth(2);
  doc.line(40, 110, pageWidth - 40, 110);
  doc.setDrawColor(...green);
  doc.setLineWidth(0.5);
  doc.line(40, 114, pageWidth - 40, 114);

  // Title
  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ACADEMIC TRANSCRIPT", pageWidth / 2, 138, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(official ? 0 : 180, official ? 100 : 0, official ? 0 : 0);
  doc.text(official ? "OFFICIAL TRANSCRIPT" : "UNOFFICIAL — STUDENT COPY", pageWidth / 2, 154, { align: "center" });
  doc.setTextColor(0, 0, 0);

  // ── QR code (top-right, official only) ──
  if (official && verificationUrl) {
    try {
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, { margin: 0, width: 220 });
      doc.addImage(qrDataUrl, "PNG", pageWidth - 110, 30, 70, 70);
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text("Scan to verify", pageWidth - 75, 108, { align: "center" });
    } catch {
      /* QR generation failed — skip silently */
    }
  }

  // ── Student details box ──
  let y = 175;
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 248, 245);
  doc.roundedRect(40, y, pageWidth - 80, 105, 4, 4, "FD");

  doc.setFontSize(9);
  const col1X = 55;
  const col2X = pageWidth / 2 + 10;
  const lh = 15;
  let ry = y + 18;

  const drawField = (x: number, yy: number, label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(`${label}:`, x, yy);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(String(value || "—"), x + 90, yy);
  };

  drawField(col1X, ry, "Student Name", studentName || "—");
  drawField(col2X, ry, "Student ID", student.student_id);
  ry += lh;
  drawField(col1X, ry, "Program", student.program);
  drawField(col2X, ry, "Level", student.level || "—");
  ry += lh;
  drawField(col1X, ry, "Admission Date", student.admission_date ? new Date(student.admission_date).toLocaleDateString("en-GB") : "—");
  drawField(col2X, ry, "Issued On", new Date().toLocaleDateString("en-GB"));
  ry += lh;
  drawField(col1X, ry, "Document Type", official ? "Official" : "Unofficial");
  drawField(col2X, ry, "Status", String(student.status || "Active"));
  if (official && transcriptId) {
    ry += lh;
    drawField(col1X, ry, "Transcript ID", transcriptId);
  }

  // ── Group enrollments by academic_year + semester ──
  const groupKey = (e: Enrollment) => `${e.academic_year || "—"} • ${e.semester || "—"}`;
  const groups = new Map<string, Enrollment[]>();
  enrollments.forEach(e => {
    const k = groupKey(e);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(e);
  });
  const sortedKeys = Array.from(groups.keys()).sort();

  let cursorY = y + 120;
  let cumulativeQP = 0;
  let cumulativeCredits = 0;

  sortedKeys.forEach(key => {
    const entries = groups.get(key)!;
    const { gpa: semGpa, credits: semCredits, qualityPoints: semQP } = computeGPA(entries);
    cumulativeQP += semQP;
    cumulativeCredits += semCredits;
    const cumGpa = cumulativeCredits > 0 ? cumulativeQP / cumulativeCredits : 0;

    if (cursorY > pageHeight - 140) { doc.addPage(); cursorY = 60; }
    doc.setFillColor(...green);
    doc.rect(40, cursorY, pageWidth - 80, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(key, 50, cursorY + 13);
    doc.setTextColor(0, 0, 0);
    cursorY += 22;

    autoTable(doc, {
      startY: cursorY,
      head: [["Code", "Course Title", "Credits", "Grade", "Grade Pts", "Quality Pts", "Status"]],
      body: entries.map(e => {
        const gp = gradePoint(e.grade);
        const credits = e.courses?.credits || 0;
        return [
          e.courses?.code || "—",
          e.courses?.title || "—",
          String(credits || "—"),
          e.grade || "—",
          gp !== null ? gp.toFixed(1) : "—",
          gp !== null ? (gp * credits).toFixed(2) : "—",
          (e.status || "").replace("_", " "),
        ];
      }),
      styles: { fontSize: 8.5, cellPadding: 4 },
      headStyles: { fillColor: [240, 240, 235], textColor: [30, 80, 50], fontStyle: "bold" },
      theme: "grid",
      margin: { left: 40, right: 40 },
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...green);
    doc.text(
      `Semester: ${semCredits} credits  •  Semester GPA: ${semGpa.toFixed(2)}  •  Cumulative GPA: ${cumGpa.toFixed(2)}`,
      pageWidth - 45,
      finalY + 14,
      { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    cursorY = finalY + 28;
  });

  // ── Final summary ──
  if (cursorY > pageHeight - 140) { doc.addPage(); cursorY = 60; }
  const completed = enrollments.filter(e => e.status === "completed");
  const inProgress = enrollments.filter(e => e.status === "in_progress");
  const totalEarned = completed.reduce((s, e) => s + (e.courses?.credits || 0), 0);
  const overallGPA = computeGPA(enrollments).gpa;

  doc.setDrawColor(...green);
  doc.setLineWidth(1);
  doc.line(40, cursorY, pageWidth - 40, cursorY);
  cursorY += 16;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...green);
  doc.text("ACADEMIC SUMMARY", 40, cursorY);
  cursorY += 16;

  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  const summaryRows: [string, string][] = [
    ["Cumulative GPA", overallGPA.toFixed(2)],
    ["Total Credits Earned", String(totalEarned)],
    ["Courses Completed", String(completed.length)],
    ["Courses In Progress", String(inProgress.length)],
  ];
  summaryRows.forEach(([k, v]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${k}:`, 50, cursorY);
    doc.setFont("helvetica", "normal");
    doc.text(v, 200, cursorY);
    cursorY += 14;
  });

  // ── Signature line for official ──
  if (official) {
    cursorY += 30;
    if (cursorY > pageHeight - 90) { doc.addPage(); cursorY = 60; }
    doc.setDrawColor(0, 0, 0);
    doc.line(60, cursorY, 240, cursorY);
    doc.line(pageWidth - 240, cursorY, pageWidth - 60, cursorY);
    doc.setFontSize(8);
    doc.text("Registrar's Signature & Date", 60, cursorY + 12);
    doc.text("Official Seal", pageWidth - 240, cursorY + 12);
  }

  // ── Footer + watermark on every page ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    const footerText = official
      ? `Official transcript • Verify at ${verificationUrl || "registrar@Anyinasuntc.edu.gh"}`
      : "This document is unofficial and intended for the student's personal reference only.";
    doc.text(footerText, pageWidth / 2, pageHeight - 25, { align: "center", maxWidth: pageWidth - 120 });
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 45, pageHeight - 25, { align: "right" });

    if (!official) {
      doc.saveGraphicsState();
      // @ts-ignore — setGState available at runtime
      doc.setGState(new (doc as any).GState({ opacity: 0.18 }));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(90);
      doc.setTextColor(200, 0, 0);
      doc.text("NOT OFFICIAL", pageWidth / 2, pageHeight / 2, { align: "center", angle: 30 });
      doc.restoreGraphicsState();
      doc.setTextColor(0, 0, 0);
    }
  }

  return doc;
};

export const transcriptFilename = (student: Student, official: boolean) =>
  `transcript_${student.student_id}_${official ? "official" : "unofficial"}.pdf`;

/** Convenience: build + download immediately. */
export const generateTranscriptPDF = async (opts: TranscriptOptions) => {
  const doc = await buildTranscriptPDF(opts);
  doc.save(transcriptFilename(opts.student, !!opts.official));
};
