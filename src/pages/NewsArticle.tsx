import { useParams, Link } from "react-router-dom";
import { blogPosts } from "@/data/mockData";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewsArticle = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="section-padding bg-background">
        <div className="container-max text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Link to="/news">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-max">
          <Link to="/news" className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm opacity-80">
            <span className="bg-primary-foreground/20 px-2 py-0.5 rounded text-xs font-semibold">{post.category}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max max-w-3xl">
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="prose prose-lg max-w-none text-foreground">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsArticle;
