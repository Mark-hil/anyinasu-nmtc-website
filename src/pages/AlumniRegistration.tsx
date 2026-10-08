import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, CheckCircle, Loader2, MapPin, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const programs = [
  "Registered General Nursing", "Midwifery Program", "Community Health Nursing",
  "Health Information Technology", "Healthcare Administration", "Medical Laboratory Technology",
];

const AlumniRegistration = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [alumni, setAlumni] = useState<any[]>([]);
  const { toast } = useToast();

  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", graduation_year: "",
    program: "", current_workplace: "", current_position: "", location: "", bio: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        setForm(f => ({ ...f, email: session.user.email || "" }));
      }
    });
    // Fetch approved alumni
    supabase.from("alumni").select("*").eq("is_approved", true).order("graduation_year", { ascending: false }).then(({ data }) => {
      if (data) setAlumni(data);
    });
  }, []);

  const handleChange = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("alumni").insert({
      ...form,
      graduation_year: parseInt(form.graduation_year),
      user_id: userId,
    });

    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Alumni Network</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Join our growing alumni community. Register to stay connected with your alma mater.</p>
        </div>

        {/* Featured Alumni */}
        {alumni.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Our Alumni</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {alumni.map(a => (
                <Card key={a.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{a.full_name}</h3>
                    <p className="text-sm text-primary mt-1">{a.program} — Class of {a.graduation_year}</p>
                    {a.current_position && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3" /> {a.current_position}{a.current_workplace && ` at ${a.current_workplace}`}
                      </div>
                    )}
                    {a.location && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {a.location}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Registration Form */}
        {submitted ? (
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="py-12">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Registration Submitted!</h2>
              <p className="text-muted-foreground">Your alumni registration is pending approval. You'll be listed in our alumni directory once verified.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-3xl mx-auto">
            <CardHeader><CardTitle className="text-lg">Alumni Registration</CardTitle></CardHeader>
            <CardContent>
              {!userId && (
                <p className="text-sm text-muted-foreground bg-accent/20 p-3 rounded-md mb-4">
                  💡 <a href="/auth" className="text-primary hover:underline font-medium">Sign in</a> first to link your registration to your account.
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input required value={form.full_name} onChange={e => handleChange("full_name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input required type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={e => handleChange("phone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Year *</Label>
                    <Input required type="number" min="1990" max="2026" value={form.graduation_year} onChange={e => handleChange("graduation_year", e.target.value)} placeholder="e.g. 2022" />
                  </div>
                  <div className="space-y-2">
                    <Label>Program *</Label>
                    <Select value={form.program} onValueChange={v => handleChange("program", v)} required>
                      <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                      <SelectContent>{programs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Location</Label>
                    <Input value={form.location} onChange={e => handleChange("location", e.target.value)} placeholder="City, Region" />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Workplace</Label>
                    <Input value={form.current_workplace} onChange={e => handleChange("current_workplace", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Position</Label>
                    <Input value={form.current_position} onChange={e => handleChange("current_position", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Short Bio</Label>
                  <Textarea value={form.bio} onChange={e => handleChange("bio", e.target.value)} placeholder="Tell us about your journey since graduating..." rows={3} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Register as Alumni
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AlumniRegistration;
