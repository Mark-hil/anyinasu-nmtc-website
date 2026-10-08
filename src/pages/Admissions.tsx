import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import schoolLogo from "@/assets/school-logo.png";

const programs = [
  "Registered General Nursing",
  "Midwifery Program",
  "Community Health Nursing",
  "Health Information Technology",
  "Healthcare Administration",
  "Medical Laboratory Technology",
];

const Admissions = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", date_of_birth: "", gender: "",
    address: "", program: "", previous_school: "", previous_qualification: "",
    guardian_name: "", guardian_phone: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        setForm(f => ({ ...f, email: session.user.email || "" }));
      }
    });
  }, []);

  const handleChange = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("admission_applications").insert({
      ...form,
      date_of_birth: form.date_of_birth || null,
      user_id: userId,
    });

    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center section-padding">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="py-12">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground">Your admission application has been received. We will review it and contact you via email within 2–3 weeks.</p>
            <p className="text-sm text-muted-foreground mt-4">Reference: {new Date().getTime().toString(36).toUpperCase()}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-10">
          <img
            src={schoolLogo}
            alt="School Logo"
            className="w-16 h-16 object-contain mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">Online Admission Application</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Apply for the 2026/2027 academic year. Fill in all required fields and submit your application online.</p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Applicant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input required value={form.full_name} onChange={e => handleChange("full_name", e.target.value)} placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input required type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input required value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="0XX XXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" value={form.date_of_birth} onChange={e => handleChange("date_of_birth", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={v => handleChange("gender", v)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Program of Choice *</Label>
                  <Select value={form.program} onValueChange={v => handleChange("program", v)} required>
                    <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                    <SelectContent>
                      {programs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Residential Address</Label>
                <Textarea value={form.address} onChange={e => handleChange("address", e.target.value)} placeholder="Enter your address" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Previous School</Label>
                  <Input value={form.previous_school} onChange={e => handleChange("previous_school", e.target.value)} placeholder="Name of last school attended" />
                </div>
                <div className="space-y-2">
                  <Label>Highest Qualification</Label>
                  <Input value={form.previous_qualification} onChange={e => handleChange("previous_qualification", e.target.value)} placeholder="e.g. WASSCE, Diploma" />
                </div>
                <div className="space-y-2">
                  <Label>Guardian/Parent Name</Label>
                  <Input value={form.guardian_name} onChange={e => handleChange("guardian_name", e.target.value)} placeholder="Guardian's full name" />
                </div>
                <div className="space-y-2">
                  <Label>Guardian Phone</Label>
                  <Input value={form.guardian_phone} onChange={e => handleChange("guardian_phone", e.target.value)} placeholder="Guardian's phone number" />
                </div>
              </div>

              {!userId && (
                <p className="text-sm text-muted-foreground bg-accent/20 p-3 rounded-md">
                  💡 <a href="/auth" className="text-primary hover:underline font-medium">Sign in</a> to track your application status after submission.
                </p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admissions;
