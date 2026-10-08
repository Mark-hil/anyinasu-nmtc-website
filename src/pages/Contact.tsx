import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { faqs, courses } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", course: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Application Received!", description: "We'll get back to you within 3 business days." });
    setForm({ name: "", email: "", phone: "", course: "", message: "" });
  };

  return (
    <div>
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Contact & Admissions</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">We'd love to hear from you. Reach out or apply today.</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max grid lg:grid-cols-2 gap-10">
          {/* Left - Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Get In Touch</h2>
            <div className="space-y-4">
              {[
                { icon: MapPin, label: "Address", value: "Anyinasu, Ashanti Region, Ghana" },
                { icon: Phone, label: "Phone", value: "+233 20 123 4567" },
                { icon: Mail, label: "Email", value: "info@Anyinasuntc.edu.gh" },
                { icon: Clock, label: "Office Hours", value: "Mon - Fri: 8:00 AM - 4:00 PM" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Map View — S.D.A NTC, Anyinasu, Ashanti Region</p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4">Admission Inquiry Form</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input type="email" placeholder="Email Address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course of Interest" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea placeholder="Your Message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Upload Documents (optional)</label>
                  <Input type="file" className="text-sm" />
                </div>
                <Button type="submit" className="w-full bg-college-red hover:bg-college-red/90 text-college-red-foreground">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted">
        <div className="container-max max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium text-foreground">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Contact;
