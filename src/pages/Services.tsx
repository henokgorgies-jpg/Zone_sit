import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileCheck, ArrowRight, ShieldCheck, Sparkles, Zap, GraduationCap, Rocket, HelpCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Services = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return FileCheck;
    const icons = LucideIcons as unknown as Record<string, LucideIcon>;
    return icons[iconName] || FileCheck;
  };

  const categories = [
    { id: "training", name: "Training Programs", icon: GraduationCap, color: "text-blue-400" },
    { id: "innovation", name: "Innovation Hub", icon: Rocket, color: "text-secondary" },
    { id: "support", name: "Public Services", icon: ShieldCheck, color: "text-emerald-400" },
    { id: "general", name: "General Initiatives", icon: HelpCircle, color: "text-amber-400" },
  ];

  const groupedServices = categories.map(cat => ({
    ...cat,
    items: services?.filter(s => (s.category || 'general') === cat.id) || []
  })).filter(cat => cat.items.length > 0 || cat.id !== 'general');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="tech-orb top-0 -left-20 w-[600px] h-[600px] bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="tech-orb bottom-0 -right-20 w-[600px] h-[600px] bg-secondary/10 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-1 pointer-events-none" />

      {/* Hero Section */}
      <div className="pt-32 pb-24 relative z-10 border-b border-white/5">
        <div className="gov-container">
          <div className="max-w-4xl space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-secondary text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(var(--secondary),0.2)]">
              <ShieldCheck className="h-4 w-4 text-secondary fill-secondary animate-pulse" />
              Institutional Service Catalog v4.0
            </div>
            <h1 className="text-6xl sm:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
                PROGRAMS & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                    SERVICES HUB
                </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                Access a mission-critical directory of training programs, innovation support, and essential digital public services for the Gurage Zone.
            </p>
          </div>
        </div>
      </div>

      <div className="gov-container py-24 relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-secondary" />
          </div>
        ) : groupedServices.length > 0 ? (
          <div className="space-y-32">
            {groupedServices.map((cat, catIdx) => (
              <div key={cat.id} className="space-y-12">
                <div className="flex items-center gap-4">
                   <div className={cn("h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10", cat.color)}>
                        <cat.icon className="h-6 w-6" />
                   </div>
                   <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{cat.name}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cat.items.map((service, i) => {
                    const Icon = getIcon(service.icon);
                    return (
                      <Link 
                        key={service.id} 
                        to={`/services/${service.slug}`}
                        className="group relative"
                      >
                         <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[3rem] blur-2xl" />
                         <div className="relative glass-card p-10 rounded-[3rem] border-white/5 hover:border-white/20 transition-all duration-500 h-full flex flex-col items-start overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                            
                            <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center mb-10 border border-white/5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                                <Icon className="h-8 w-8 text-secondary" />
                            </div>

                            <div className="space-y-4 flex-1">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none group-hover:text-secondary transition-colors">{service.title}</h3>
                                <p className="text-muted-foreground font-medium text-sm leading-relaxed line-clamp-3 italic">
                                    "{service.description}"
                                </p>
                            </div>

                            <div className="pt-8 mt-auto w-full border-t border-white/5 flex items-center justify-between">
                                <Badge className="bg-white/5 text-white/40 uppercase tracking-widest text-[8px] font-black border-none px-3 py-1">Operational Protocol</Badge>
                                <ArrowRight className="h-5 w-5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-500" />
                            </div>
                         </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 glass rounded-[4rem] border-white/5 border-dashed border-2">
            <Zap className="h-12 w-12 text-white/10 mx-auto mb-6 animate-pulse" />
            <p className="text-muted-foreground font-medium italic">Service database currently in sync mode. No public protocols archived yet.</p>
          </div>
        )}

        {/* Support Call to Action */}
        <div className="pt-32">
            <div className="glass-card p-12 sm:p-20 rounded-[4.5rem] border-white/10 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden group text-center sm:text-left">
                <div className="absolute -top-40 -right-40 p-80 bg-secondary/10 blur-[120px] rounded-full opacity-30 group-hover:opacity-50 transition-all duration-1000" />
                <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-16">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="h-4 w-4 text-secondary" /> Institutional Support Unit
                        </div>
                        <h3 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                            Need Custom <br /><span className="text-secondary">Assistance?</span>
                        </h3>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                            Our technical support units are standing by to guide you through our program requirements and application protocols.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
                        <Link to="/contact">
                            <Button className="w-full sm:w-auto btn-tech rounded-full px-12 py-8 h-auto text-sm font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105">
                                Initialize Inquiry
                            </Button>
                        </Link>
                        <Button variant="outline" className="w-full sm:w-auto rounded-full border-white/10 glass px-12 py-8 h-auto text-sm font-black uppercase tracking-widest hover:bg-white/5">
                            Download Catalog
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
