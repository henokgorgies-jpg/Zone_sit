import { Link } from "react-router-dom";
import { ArrowRight, Loader2, FileCheck, LucideIcon, Sparkles, Terminal, Cpu, Database, Network } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ServicesSection() {
  const { t } = useTranslation();
  const { data: services, isLoading } = useQuery({
    queryKey: ["services-featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return FileCheck;
    const icons = LucideIcons as unknown as Record<string, LucideIcon>;
    return icons[iconName] || FileCheck;
  };

  return (
    <section className="py-32 relative overflow-hidden bg-background border-t border-white/5">
      <div className="tech-orb top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="gov-container relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/10 text-primary text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(var(--primary),0.1)]">
              <Cpu className="h-4 w-4 animate-pulse text-secondary" /> 
              SIT_CORE_SERVICES_v4
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
              {t('home.ourServices')}
            </h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-primary/40 pl-8 overflow-hidden">
               Access high-performance regional technological infrastructure and digital public innovation services.
            </p>
          </div>
          
          <div className="hidden lg:flex flex-col items-end gap-2 text-right">
             <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                <Database className="h-4 w-4 text-secondary" /> DATABASE_STATUS
             </div>
             <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest">Active_Replica_0x1</Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32 h-[400px]">
            <Loader2 className="h-14 w-14 animate-spin text-secondary" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="group relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[3.5rem] blur-3xl" />
                  <Card className="relative p-12 rounded-[3.5rem] glass-card border-white/5 hover:border-secondary/30 transition-all duration-500 h-full flex flex-col items-start overflow-hidden bg-gradient-to-br from-white/5 via-transparent to-transparent shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-5 -translate-y-6 translate-x-6 group-hover:translate-y-4 group-hover:-translate-x-4 transition-all duration-1000 group-hover:opacity-20">
                        <Icon className="h-32 w-32 text-white" />
                    </div>
                    
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-secondary mb-12 group-hover:bg-secondary group-hover:text-background transition-all duration-700 border border-white/5 shadow-inner">
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-white/20 tracking-widest uppercase">Protocol_S_00{index + 1}</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-secondary group-hover:text-glow transition-all duration-500">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed italic opacity-80 line-clamp-3">
                          "{service.description}"
                        </p>
                    </div>

                    <div className="mt-12 w-full pt-8 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3 group/btn cursor-pointer">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Open Protocol</span>
                            <ArrowRight className="h-4 w-4 text-secondary transition-transform group-hover/btn:translate-x-1" />
                         </div>
                         <Terminal className="h-4 w-4 text-white/10 group-hover:text-secondary/40 transition-colors" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-40 glass rounded-[4.5rem] border-white/10 border-dashed border-2">
             <Network className="h-24 w-24 text-white/5 mx-auto mb-10" />
             <p className="text-xl text-muted-foreground font-black uppercase tracking-widest opacity-50 italic">Empty Sector Signal. <br /><span className="text-sm text-white/40">Initialize database sync to populate service registry.</span></p>
          </div>
        )}

        <div className="text-center mt-32">
          <Link to="/services">
            <Button size="lg" className="rounded-full px-16 py-10 h-auto text-sm font-black uppercase tracking-[0.4em] bg-white text-background hover:bg-secondary hover:text-white transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 group">
              View All Operational Protocols
              <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
