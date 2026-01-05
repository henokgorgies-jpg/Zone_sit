import { Calendar, Loader2, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["news-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="gov-section">
        <div className="gov-container flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="gov-section">
        <div className="gov-container text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The news article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/news">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="gov-section">
      <div className="gov-container max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/news">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </Button>

        <article>
          <Badge variant="secondary" className="mb-4">News</Badge>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <Calendar className="h-4 w-4" />
            <time>
              {article.published_at
                ? formatDate(article.published_at)
                : formatDate(article.created_at)}
            </time>
          </div>

          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto rounded-lg mb-8 object-cover max-h-96"
            />
          )}

          {article.excerpt && (
            <p className="text-lg text-muted-foreground mb-6 font-medium">
              {article.excerpt}
            </p>
          )}

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
