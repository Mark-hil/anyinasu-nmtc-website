import { Link } from "react-router-dom";
import { blogPosts } from "@/data/mockData";
import { ArrowRight, Calendar } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const LatestNews = () => {
  const latest = blogPosts.slice(0, 6);
  const doubled = [...latest, ...latest];

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Latest News & Announcements</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Stay updated with what's happening at S.D.A NTC - Anyinasu.</p>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee-slow hover:[animation-play-state:paused]">
          {doubled.map((post, i) => (
            <Link key={`${post.id}-${i}`} to={`/news/${post.id}`} className="group block shrink-0 w-[300px] md:w-[340px]">
              <div className="rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">{post.category}</span>
                  <h3 className="font-bold text-card-foreground mt-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">{post.excerpt}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mt-10">
            <Link to="/news" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              View All News <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default LatestNews;
