import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Phone } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import heroBg1 from "@/assets/hero-bg.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";
import heroBg4 from "@/assets/hero-bg-4.jpg";

const heroSlides = [
  { image: heroBg1, headline: "Build Your Future with", accent: "Expert Training" },
  { image: heroBg2, headline: "Hands-On Clinical", accent: "Skills & Practice" },
  { image: heroBg3, headline: "Celebrate Your", accent: "Graduation Journey" },
  { image: heroBg4, headline: "A Modern Campus for", accent: "Modern Learning" },
];

const HeroSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const next = useCallback(() => {
    setDirection("next");
    setCurrent((p) => (p + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background images */}
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-[1500ms] ease-in-out"
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.1)",
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-college-green-dark/70" />

      {/* Content */}
      <div className="relative z-10 container-max px-4 text-center text-primary-foreground">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className="transition-all duration-700 ease-out"
            style={{
              position: i === current ? "relative" : "absolute",
              inset: i === current ? undefined : 0,
              opacity: i === current ? 1 : 0,
              transform: i === current
                ? "translateY(0)"
                : direction === "next"
                  ? "translateY(40px)"
                  : "translateY(-40px)",
              pointerEvents: i === current ? "auto" : "none",
            }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              {slide.headline}
              <span className="text-college-gold block mt-1">{slide.accent}</span>
            </h1>
          </div>
        ))}
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
          S.D.A Nursing and Midwifery Training College - Anyinasu — shaping compassionate, skilled healthcare professionals since 1998.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/courses">
            <Button size="lg" className="bg-college-gold hover:bg-college-gold/90 text-college-gold-foreground font-semibold px-8">
              <BookOpen className="mr-2 h-5 w-5" /> Browse Courses
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" className="bg-white hover:bg-white/90 text-college-green-dark font-semibold px-8 shadow-sm">
              <Phone className="mr-2 h-5 w-5" /> Contact Us
            </Button>
          </Link>
        </div>
        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? "next" : "prev");
                setCurrent(i);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-college-gold" : "w-2 bg-primary-foreground/40"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlideshow;
