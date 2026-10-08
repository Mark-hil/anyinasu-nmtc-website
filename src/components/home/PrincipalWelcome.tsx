import { Quote } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import principalImg1 from "@/assets/anyinasu-principal.jpeg";
import principalImg2 from "@/assets/anyinasu-principal.jpeg";
import principalImg3 from "@/assets/anyinasu-principal.jpeg";

const principalImages = [principalImg1, principalImg2, principalImg3];

const PrincipalWelcome = () => {
  const [currentImg, setCurrentImg] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImg((prev) => (prev + 1) % principalImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextImage, 4000);
    return () => clearInterval(timer);
  }, [nextImage]);

  return (
    <section className="section-padding bg-background">
      <div className="container-max">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          {/* Image */}
          <div className="md:col-span-2 flex justify-center">
            <div className="relative">
              {/* Gradient border frame */}
              <div className="p-1.5 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary shadow-2xl">
                <div className="p-1 rounded-xl bg-background">
                  <div className="w-64 h-72 md:w-72 md:h-80 rounded-lg overflow-hidden relative">
                    {principalImages.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Mrs. Regina Adu — Principal ${i + 1}`}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                        style={{ opacity: i === currentImg ? 1 : 0 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Corner decorations */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-xl" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-xl" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-xl" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-xl" />
              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-5">
                {principalImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentImg ? "bg-accent scale-125 shadow-md" : "bg-border hover:bg-muted-foreground"
                      }`}
                    aria-label={`View photo ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="md:col-span-3 space-y-5">
            <div className="flex items-center gap-2 text-college-gold">
              <Quote className="h-8 w-8 rotate-180" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome from the Principal
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              It is my distinct pleasure to welcome you to S.D.A Nursing and Midwifery Training College - Anyinasu. For over two decades, our institution has been at the forefront of training compassionate, skilled, and ethical healthcare professionals who serve communities across Ghana and beyond.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              At S.D.A NTC - Anyinasu, we believe in a holistic approach to nursing education — one that combines rigorous academic training with hands-on clinical experience and strong moral values. Our dedicated faculty, modern facilities, and supportive learning environment ensure that every student who walks through our doors leaves fully prepared to make a meaningful impact in the healthcare sector.
            </p>
            <p className="text-muted-foreground leading-relaxed italic">
              "We don't just train nurses — we shape the future of healthcare in Ghana."
            </p>
            <div className="pt-2">
              <p className="font-bold text-foreground">Mrs. Regina Adu</p>
              <p className="text-sm text-primary">Principal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrincipalWelcome;
