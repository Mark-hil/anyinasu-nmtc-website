import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { galleryImages } from "@/data/mockData";
import { X, Play } from "lucide-react";

const tabs = ["All", "Campus", "Events", "Student Life", "Videos"];

const Gallery = () => {
  const [tab, setTab] = useState("All");
  const [lightbox, setLightbox] = useState<typeof galleryImages[0] | null>(null);

  const filtered = tab === "All" || tab === "Videos"
    ? tab === "Videos" ? [] : galleryImages
    : galleryImages.filter((img) => img.category === tab);

  return (
    <div>
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Gallery</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">A glimpse into life at S.D.A Nursing and Midwifery Training College - Anyinasu.</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {tabs.map((t) => (
              <Button key={t} size="sm" variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>
                {t}
              </Button>
            ))}
          </div>

          {tab === "Videos" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer group relative overflow-hidden">
                  <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/10 transition-colors" />
                  <div className="w-16 h-16 rounded-full bg-college-red/90 flex items-center justify-center">
                    <Play className="h-7 w-7 text-college-red-foreground ml-1" />
                  </div>
                  <p className="absolute bottom-4 left-4 text-sm font-medium text-foreground">
                    {i === 1 ? "Campus Tour 2025" : "Student Life at S.D.A NTC - Anyinasu"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map((img) => (
                <div
                  key={img.id}
                  className="break-inside-avoid overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => setLightbox(img)}
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-4xl p-0 bg-foreground/95 border-none">
          {lightbox && (
            <div className="relative">
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 z-10 bg-background/20 hover:bg-background/40 rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5 text-primary-foreground" />
              </button>
              <img src={lightbox.src} alt={lightbox.caption} className="w-full rounded-lg" />
              <p className="text-primary-foreground text-center py-3 text-sm">{lightbox.caption}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
