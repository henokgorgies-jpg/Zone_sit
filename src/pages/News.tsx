import { Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const News = () => {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="gov-section">
      <div className="gov-container">
        <h1 className="text-4xl font-bold mb-4">News & Announcements</h1>
        <p className="text-muted-foreground mb-8">Stay informed with the latest updates from our institution.</p>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid gap-6">
            {news.map((item) => (
              <Link key={item.id} to={`/news/${item.slug}`} className="gov-card p-6 hover:border-accent transition-colors">
                <Badge variant="secondary" className="mb-3">News</Badge>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-3">{item.excerpt}</p>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> 
                  {item.published_at ? formatDate(item.published_at) : formatDate(item.created_at)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No news articles available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
