import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/mockData";
import { Search, Calendar } from "lucide-react";

const categories = ["All", "Updates", "Tips", "Events"];

const News = () => {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const featured = blogPosts.find((p) => p.featured);
  const filtered = blogPosts
    .filter((p) => !p.featured)
    .filter((p) => category === "All" || p.category === category)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">News & Blog</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">Stay informed with the latest from S.D.A NTC - Anyinasu.</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            {/* Main */}
            <div>
              {/* Featured */}
              {featured && (
                <Card className="overflow-hidden mb-8 hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img src={featured.image} alt={featured.title} className="w-full h-full object-cover min-h-[200px]" />
                    </div>
                    <CardContent className="p-6 md:w-1/2 flex flex-col justify-center">
                      <span className="text-xs font-semibold text-college-red">{featured.category}</span>
                      <h2 className="text-xl font-bold text-card-foreground mt-1">{featured.title}</h2>
                      <p className="text-sm text-muted-foreground mt-2">{featured.excerpt}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                        <Calendar className="h-3 w-3" />
                        {new Date(featured.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      <Link to={`/news/${featured.id}`}>
                        <Button variant="link" className="p-0 mt-3 text-primary self-start">Read More →</Button>
                      </Link>
                    </CardContent>
                  </div>
                </Card>
              )}

              {/* Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {filtered.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-5">
                      <span className="text-xs font-semibold text-college-red">{post.category}</span>
                      <h3 className="font-bold text-card-foreground mt-1">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <Link to={`/news/${post.id}`}>
                          <Button variant="link" className="p-0 text-sm text-primary">Read More →</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Button key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)}>
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Recent Posts</h4>
                <ul className="space-y-3">
                  {blogPosts.slice(0, 3).map((p) => (
                    <li key={p.id} className="text-sm">
                      <p className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
