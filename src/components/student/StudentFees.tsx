import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface StudentFeesProps {
  userId: string;
}

const StudentFees = ({ userId }: StudentFeesProps) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("fee_payments").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (data) setPayments(data);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  const totalPaid = payments.filter(p => p.status === "verified").reduce((s, p) => s + Number(p.amount), 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);

  const statusVariant = (s: string) => s === "verified" ? "default" as const : s === "rejected" ? "destructive" as const : "secondary" as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-primary">GHS {totalPaid.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Verified Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-amber-600">GHS {totalPending.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Pending Verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-primary">{payments.length}</p>
            <p className="text-sm text-muted-foreground">Total Payments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-muted-foreground">Loading...</p> : payments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No payment records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-4">Reference</th>
                    <th className="text-left py-2 pr-4">Amount</th>
                    <th className="text-left py-2 pr-4">Method</th>
                    <th className="text-left py-2 pr-4">Semester</th>
                    <th className="text-center py-2 pr-4">Status</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-4 font-mono text-xs">{p.reference_number || "—"}</td>
                      <td className="py-2.5 pr-4 font-semibold">GHS {Number(p.amount).toLocaleString()}</td>
                      <td className="py-2.5 pr-4 capitalize">{p.payment_method?.replace("_", " ")}</td>
                      <td className="py-2.5 pr-4">{p.semester || "—"} {p.academic_year || ""}</td>
                      <td className="py-2.5 pr-4 text-center"><Badge variant={statusVariant(p.status)}>{p.status}</Badge></td>
                      <td className="py-2.5 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentFees;
