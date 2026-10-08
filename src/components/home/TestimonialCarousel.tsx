import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/data/mockData";
import { useState, useEffect, useCallback } from "react";

const TestimonialCarousel = () => {
  const [idx, setIdx] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((newIdx: number, dir: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDir(dir);
    setIdx(newIdx);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const next = useCallback(() => goTo((idx + 1) % testimonials.length, "left"), [idx, goTo]);
  const prev = useCallback(() => goTo((idx - 1 + testimonials.length) % testimonials.length, "right"), [idx, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="section-padding bg-college-green-light">
      <div className="container-max max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">What Our Students Say</h2>
        <div className="relative overflow-hidden">
          <Card className="p-8 md:p-12 min-h-[280px] flex items-center justify-center relative">
            {/* Decorative quote icon */}
            <Quote className="absolute top-4 left-4 h-10 w-10 text-primary/10" />
            <Quote className="absolute bottom-4 right-4 h-10 w-10 text-primary/10 rotate-180" />
            
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="w-full flex flex-col items-center"
                style={{
                  position: i === idx ? "relative" : "absolute",
                  opacity: i === idx ? 1 : 0,
                  transform: i === idx
                    ? "translateY(0) rotateY(0deg)"
                    : slideDir === "left"
                      ? "translateY(30px) rotateY(5deg)"
                      : "translateY(-30px) rotateY(-5deg)",
                  transition: "all 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: i === idx ? "auto" : "none",
                }}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="h-5 w-5 text-college-gold fill-college-gold"
                      viewBox="0 0 24 24"
                      style={{
                        opacity: i === idx ? 1 : 0,
                        transform: i === idx ? "scale(1)" : "scale(0)",
                        transition: `all 400ms ease ${j * 80}ms`,
                      }}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg italic text-card-foreground mb-6 max-w-lg">"{t.quote}"</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-college-gold rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-college-gold-foreground fill-current" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" fill="none" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-card-foreground">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </Card>
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button size="icon" variant="outline" onClick={prev} className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
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
      </div>
    </section>
  );
};

export default TestimonialCarousel;
