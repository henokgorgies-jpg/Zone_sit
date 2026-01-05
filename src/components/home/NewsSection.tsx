import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function NewsSection() {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news-featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  const featuredNews = news?.[0];
  const otherNews = news?.slice(1) || [];

  return (
    <section className="gov-section">
      <div className="gov-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              News & Announcements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Stay updated with the latest news, announcements, and important notices.
            </p>
          </div>
          <Link to="/news" className="mt-4 md:mt-0">
            <Button variant="outline" className="gap-2">
              View All News
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured News */}
            {featuredNews && (
              <Link
                to={`/news/${featuredNews.slug}`}
                className="group gov-card overflow-hidden lg:row-span-2"
              >
                <div className="aspect-video bg-gradient-hero relative">
                  {featuredNews.image_url ? (
                    <img 
                      src={featuredNews.image_url} 
                      alt={featuredNews.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/10" />
                  )}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Badge variant="secondary">News</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(featuredNews.published_at || featuredNews.created_at)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {featuredNews.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {featuredNews.excerpt}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-accent gap-1 group-hover:gap-2 transition-all">
                    Read more
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )}

            {/* Other News */}
            <div className="space-y-4">
              {otherNews.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="group gov-card p-5 flex gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Badge variant="secondary" className="text-xs">News</Badge>
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.published_at || item.created_at)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0 self-center" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No news available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
