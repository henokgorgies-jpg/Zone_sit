import { Calendar, Loader2, Newspaper, ChevronRight, LayoutGrid, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const News = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>("all");
  
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

  const categories = ["all", "training", "innovation", "services", "general"];
  const filteredNews = filter === "all" ? news : news?.filter(n => n.category === filter);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="tech-orb top-0 -left-60 w-[800px] h-[800px] bg-primary/20 blur-[200px]" />
      <div className="tech-orb bottom-0 -right-60 w-[800px] h-[800px] bg-secondary/15 blur-[200px]" />
      <div className="absolute inset-0 bg-mesh opacity-20" />

      {/* Hero Header */}
      <div className="py-24 relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="gov-container">
          <div className="max-w-4xl space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest border border-secondary/20 shadow-2xl">
              <Terminal className="h-3 w-3" /> Intel Output Grid
            </div>
            <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-none mb-10">
                News & <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Announcements</span>
            </h1>
            
            <div className="flex flex-wrap gap-4 mt-8">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            filter === cat 
                                ? "bg-secondary text-background border-secondary" 
                                : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:bg-white/10"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="gov-container py-24 relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
          </div>
        ) : filteredNews && filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredNews.map((item, i) => (
              <Link key={item.id} to={`/news/${item.slug}`} className="group relative" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3.5rem] blur-2xl" />
                <div className="relative p-10 rounded-[3.5rem] glass-card border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <Badge className="bg-secondary/10 text-secondary font-black border-none uppercase text-[8px] animate-pulse px-4 py-1.5 rounded-full">
                            {item.category || 'general'} signal
                        </Badge>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {item.published_at ? formatDate(item.published_at) : formatDate(item.created_at)}
                        </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-glow transition-all mb-6 leading-[1.1] group-hover:text-secondary">
                        {item.title}
                    </h3>
                    
                    <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3 mb-10 italic">
                        "{item.excerpt}"
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5">
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-secondary group-hover/btn:gap-4 transition-all duration-300">
                             Open Protocol
                        </div>
                        <div className="h-10 w-10 rounded-full glass flex items-center justify-center group-hover:bg-secondary group-hover:text-background transition-all border-white/10 shadow-lg">
                            <ChevronRight className="h-5 w-5" />
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 glass rounded-[3.5rem] border-white/5">
             <Newspaper className="h-20 w-20 text-white/5 mx-auto mb-6" />
             <p className="text-muted-foreground font-medium italic">No active signals detected in the "{filter}" channel grid.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
