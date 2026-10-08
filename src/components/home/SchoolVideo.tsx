import { Play } from "lucide-react";
import { useState } from "react";

const SchoolVideo = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section-padding bg-college-green-dark">
      <div className="container-max text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
          Experience S.D.A NTC - Anyinasu
        </h2>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10">
          Take a virtual tour of our campus, meet our lecturers, and see why hundreds of students choose S.D.A NTC - Anyinasu every year.
        </p>

        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl aspect-video bg-foreground/10">
          {playing ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
              title="S.D.A NTC - Anyinasu Campus Tour"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-college-green-dark/60 to-college-green-dark/90 group cursor-pointer"
            >
              {/* Thumbnail overlay text */}
              <div className="w-20 h-20 rounded-full bg-college-gold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Play className="h-8 w-8 text-college-gold-foreground ml-1" />
              </div>
              <span className="mt-4 text-primary-foreground font-semibold text-lg">
                Watch Campus Tour
              </span>
              <span className="text-primary-foreground/60 text-sm mt-1">3 min video</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SchoolVideo;
