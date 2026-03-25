import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ChevronRight, Loader2, Newspaper, Terminal, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function NewsSection() {
  const { t } = useTranslation();
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
    <section className="py-32 bg-background relative overflow-hidden border-t border-white/5">
      <div className="tech-orb bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 blur-[150px] opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-secondary/5 to-transparent pointer-events-none" />
      
      <div className="gov-container relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-24 gap-12">
          <div className="space-y-6 max-w-2xl">
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/10 text-secondary text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(var(--secondary),0.1)]">
                <Newspaper className="h-4 w-4 animate-pulse" /> INTEL_STREAM_v4
              </div>
            <h2 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
              {t('home.latestNews')}
            </h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-secondary/40 pl-8">
              Real-time updates from the zone's technological heart and institutional milestones.
            </p>
          </div>
          <Link to="/news">
            <Button size="lg" className="rounded-full px-12 py-8 h-auto text-sm font-black uppercase tracking-[0.3em] border-white/10 glass text-white hover:bg-white/10 transition-all shadow-xl hover:scale-105 active:scale-95 group">
              ARCHIVE_GRID <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="h-14 w-14 animate-spin text-secondary" />
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
            {/* Featured News: Mission Log Style */}
            {featuredNews && (
              <div className="lg:col-span-7 group">
                <Link to={`/news/${featuredNews.slug}`} className="block relative h-full">
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[4rem] blur-3xl" />
                  <Card className="relative h-full glass-card rounded-[4rem] border-white/5 hover:border-white/20 transition-all duration-700 flex flex-col overflow-hidden shadow-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent">
                    <div className="aspect-[16/9] lg:aspect-auto lg:h-[450px] relative overflow-hidden">
                      {featuredNews.image_url ? (
                        <img 
                          src={featuredNews.image_url} 
                          alt={featuredNews.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center overflow-hidden">
                            <Activity className="h-40 w-40 text-white/5 animate-pulse" />
                        </div>
                      )}
                      
                      {/* UI Framing Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                      
                      <div className="absolute top-10 left-10 flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8">PRIORITY_TRANS</span>
                      </div>
                      
                      <div className="absolute top-10 right-10">
                        <Badge className="bg-secondary text-background font-black uppercase tracking-widest px-5 py-2 rounded-full border-none shadow-[0_0_20px_rgba(var(--secondary),0.4)]">MISSION_SIGNAL</Badge>
                      </div>
                    </div>
                    
                    <div className="p-12 -mt-24 relative z-10 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-secondary mb-6">
                         <span className="flex items-center gap-2 backdrop-blur-xl bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredNews.published_at || featuredNews.created_at)}
                        </span>
                      </div>
                      <h3 className="text-4xl sm:text-5xl font-black text-white mb-8 uppercase tracking-tighter group-hover:text-glow group-hover:text-secondary transition-all duration-500 leading-tight">
                        {featuredNews.title}
                      </h3>
                      <p className="text-muted-foreground mb-12 font-medium leading-relaxed italic border-l-2 border-white/10 pl-6 line-clamp-2">
                        "{featuredNews.excerpt}"
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                         <div className="flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-secondary gap-4 group/btn">
                           INITIALIZE READ
                           <div className="h-px w-12 bg-secondary/30 group-hover/btn:w-20 transition-all duration-500" />
                           <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                         </div>
                         <Terminal className="h-5 w-5 text-white/10 group-hover:text-secondary/40 transition-all duration-700 hover:rotate-12" />
                      </div>
                    </div>

                    {/* Hardware Detailing */}
                    <div className="absolute bottom-0 left-0 w-16 h-1 bg-secondary shadow-[0_0_15px_rgba(var(--secondary),0.5)]" />
                  </Card>
                </Link>
              </div>
            )}

            {/* Sub-signals Column */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {otherNews.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="group relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute -inset-2 bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[3rem] blur-xl" />
                  <div className="relative p-10 rounded-[3rem] glass-card border-white/5 hover:border-white/15 transition-all duration-700 flex gap-10 items-center bg-gradient-to-br from-white/5 via-transparent to-transparent shadow-2xl">
                    <div className="h-28 w-28 shrink-0 rounded-3xl overflow-hidden glass border-white/10 relative group-hover:scale-110 transition-transform duration-700 shadow-inner">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:rotate-1" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <Zap className="h-10 w-10 text-white/5 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">
                        <Calendar className="h-4 w-4 text-secondary/60" />
                        {formatDate(item.published_at || item.created_at)}
                      </div>
                      <h3 className="text-xl font-black text-white group-hover:text-secondary transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
                        {item.title}
                      </h3>
                      <div className="h-px w-12 bg-white/10 group-hover:w-full transition-all duration-700" />
                    </div>
                  </div>
                </Link>
              ))}
              {otherNews.length === 0 && !isLoading && (
                 <div className="flex-1 flex flex-col items-center justify-center p-20 glass rounded-[4rem] border-white/5 text-center border-dashed border-2">
                    <Activity className="h-12 w-12 text-white/5 mb-6 animate-pulse" />
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-xs italic opacity-40">Scanning sector for sub-signals...</p>
                 </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-40 glass rounded-[4.5rem] border-white/10 border-dashed border-2">
            <Newspaper className="h-24 w-24 text-white/5 mx-auto mb-10 opacity-20" />
            <p className="text-xl text-muted-foreground font-black uppercase tracking-widest italic opacity-40">No active signals archived <br /><span className="text-sm">Broadcast node currently awaiting input data.</span></p>
          </div>
        )}
      </div>
    </section>
  );
}
