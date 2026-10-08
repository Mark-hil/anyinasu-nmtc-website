import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { staff } from "@/data/mockData";
import { Mail, Linkedin } from "lucide-react";

const departments = ["All", "Health", "IT", "Business"];

const Staff = () => {
  const [dept, setDept] = useState("All");
  const [selected, setSelected] = useState<typeof staff[0] | null>(null);

  const filtered = staff.filter((s) => dept === "All" || s.department === dept);

  return (
    <div>
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Meet Our Expert Instructors</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">Dedicated professionals shaping the next generation of healthcare leaders.</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {departments.map((d) => (
              <Button key={d} size="sm" variant={dept === d ? "default" : "outline"} onClick={() => setDept(d)}>
                {d}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((person) => (
              <Card
                key={person.id}
                className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelected(person)}
              >
                <img src={person.image} alt={person.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
                <h3 className="font-bold text-card-foreground">{person.name}</h3>
                <p className="text-sm text-primary font-medium">{person.title}</p>
                <p className="text-sm text-muted-foreground mt-2">{person.bio}</p>
                <div className="flex justify-center gap-2 mt-4">
                  <a href={`mailto:${person.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </a>
                  <a href={person.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-4">
                <img src={selected.image} alt={selected.name} className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-primary">{selected.title}</p>
                  <p className="text-sm text-muted-foreground">{selected.department} Department</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{selected.fullBio}</p>
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-2">Qualifications</h4>
                <ul className="space-y-1">
                  {selected.qualifications.map((q, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {q}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-2">Courses Taught</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.courses.map((c, i) => (
                    <span key={i} className="text-xs bg-college-green-light text-primary px-2 py-1 rounded">{c}</span>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
