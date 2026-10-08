import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, CheckCircle, Loader2, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const FeePayment = () => {
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("mobile_money");
  const [reference, setReference] = useState("");
  const [semester, setSemester] = useState("Semester 2");
  const [description, setDescription] = useState("Tuition Fee");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("pay");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
      supabase.from("fee_payments").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }).then(({ data }) => {
        if (data) setPayments(data);
      });
    });
  }, [navigate, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("fee_payments").insert({
      user_id: user.id,
      amount: parseFloat(amount),
      payment_method: method,
      reference_number: reference,
      description,
      semester,
      academic_year: "2025/2026",
    });

    if (error) {
      toast({ title: "Payment failed", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Payment recorded", description: "Your payment has been submitted for verification." });
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="section-padding bg-muted/30">
      <div className="container-max max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Fee Payment</h1>
          <p className="text-muted-foreground">Submit your fee payment details for verification</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button variant={activeTab === "pay" ? "default" : "outline"} size="sm" onClick={() => { setActiveTab("pay"); setSubmitted(false); }}>
            <CreditCard className="h-4 w-4 mr-1" /> Make Payment
          </Button>
          <Button variant={activeTab === "history" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("history")}>
            <History className="h-4 w-4 mr-1" /> Payment History
          </Button>
        </div>

        {activeTab === "pay" && !submitted && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Payment Details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (GHS) *</Label>
                    <Input type="number" required min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 2750.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method *</Label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash (at Accounts Office)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Transaction Reference</Label>
                    <Input value={reference} onChange={e => setReference(e.target.value)} placeholder="MoMo/Bank reference number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Semester 1">Semester 1</SelectItem>
                        <SelectItem value="Semester 2">Semester 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Tuition Fee, Hostel Fee" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Submit Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "pay" && submitted && (
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Submitted!</h2>
              <p className="text-muted-foreground">Your payment of GHS {amount} has been recorded. The accounts office will verify it within 1–2 business days.</p>
              <Button className="mt-6" onClick={() => setSubmitted(false)}>Make Another Payment</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === "history" && (
          <Card>
            <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No payment records found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b text-muted-foreground"><th className="text-left py-2">Date</th><th className="text-left py-2">Description</th><th className="text-right py-2">Amount</th><th className="text-center py-2">Status</th></tr></thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} className="border-b last:border-0">
                          <td className="py-2.5 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                          <td className="py-2.5">{p.description}</td>
                          <td className="py-2.5 text-right font-medium">GHS {parseFloat(p.amount).toLocaleString()}</td>
                          <td className="py-2.5 text-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "verified" ? "bg-primary/10 text-primary" : p.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-accent/20 text-accent-foreground"}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeePayment;
