import { Link } from "react-router-dom";
import { galleryImages } from "@/data/mockData";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const PhotoGalleryPreview = () => {
  const photos = galleryImages.slice(0, 8);
  const doubled = [...photos, ...photos];

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Campus Life in Photos</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">See what makes S.D.A NTC - Anyinasu a vibrant and inspiring place to learn.</p>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
          {doubled.map((img, i) => (
            <div key={`${img.id}-${i}`} className="relative overflow-hidden rounded-lg group shrink-0 w-[280px] md:w-[320px] aspect-[4/3]">
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-end">
                <p className="text-primary-foreground text-sm font-medium p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mt-10">
            <Link to="/gallery" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              View Full Gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PhotoGalleryPreview;
