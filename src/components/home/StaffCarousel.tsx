import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { staff } from "@/data/mockData";
import { useState, useEffect, useCallback } from "react";

const StaffCarousel = () => {
  const [idx, setIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");

  const goTo = useCallback((newIdx: number, dir: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDir(dir);
    setIdx(newIdx);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const next = useCallback(() => goTo((idx + 1) % staff.length, "left"), [idx, goTo]);
  const prev = useCallback(() => goTo((idx - 1 + staff.length) % staff.length, "right"), [idx, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="section-padding bg-background">
      <div className="container-max max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Meet Our Expert Staff</h2>
        <p className="text-muted-foreground mb-10">Dedicated professionals shaping the next generation of healthcare leaders.</p>
        <div className="relative overflow-hidden">
          <Card className="p-8 min-h-[320px] flex items-center justify-center">
            {staff.map((s, i) => (
              <div
                key={s.id}
                className="w-full flex flex-col items-center transition-all duration-600 ease-out"
                style={{
                  position: i === idx ? "relative" : "absolute",
                  opacity: i === idx ? 1 : 0,
                  transform: i === idx
                    ? "translateX(0) scale(1)"
                    : slideDir === "left"
                      ? "translateX(80px) scale(0.9)"
                      : "translateX(-80px) scale(0.9)",
                  pointerEvents: i === idx ? "auto" : "none",
                  transitionDuration: "600ms",
                }}
              >
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 mx-auto shadow-lg">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute inset-0 w-28 h-28 rounded-full mx-auto border-4 border-college-gold/40 animate-[spin_8s_linear_infinite]"
                    style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }}
                  />
                </div>
                <h3 className="font-bold text-xl text-card-foreground">{s.name}</h3>
                <p className="text-sm font-medium text-primary mb-2">{s.title}</p>
                <p className="text-sm text-muted-foreground mb-3">{s.department} Department</p>
                <p className="text-muted-foreground italic max-w-md">"{s.bio}"</p>
              </div>
            ))}
          </Card>
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button size="icon" variant="outline" onClick={prev} className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1.5">
              {staff.map((_, i) => (
                <button
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === idx ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                  onClick={() => goTo(i, i > idx ? "left" : "right")}
                />
              ))}
            </div>
            <Button size="icon" variant="outline" onClick={next} className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Link to="/staff" className="inline-block mt-6">
          <Button variant="outline" className="font-semibold">View All Staff →</Button>
        </Link>
      </div>
    </section>
  );
};

export default StaffCarousel;
