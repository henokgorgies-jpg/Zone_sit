import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Building2, Target, Users, History, Quote, ShieldCheck, Zap, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AboutContent {
  mission: string;
  vision: string;
  values: string;
  managerName: string;
  managerTitle: string;
  managerMessage: string;
  managerPhotoUrl: string;
  managerJobDescription: string;
}

const defaultContent: AboutContent = {
  mission: "Promoting the development of science and technology within Gurage Zone while creating opportunities for youth and emerging innovators to thrive in the digital sector.",
  vision: "To empower citizens, especially youth, foster innovation, and enhance the overall quality and transparency of public service delivery through modern technology.",
  values: "Innovation, Transparency, Youth Empowerment, Technical Excellence, and Digital-First Public Service.",
  managerName: "Department Head",
  managerTitle: "SIT Department Head",
  managerMessage: "By leveraging modern technology, our department aims to empower youth and foster a learning environment for innovation in the region.",
  managerPhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
  managerJobDescription: "Leading the zone's digital transformation, innovation center development, and technological resource management for the public good."
};

const About = () => {
  const { data: page, isLoading } = useQuery({
    queryKey: ["page-about"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "about")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-secondary opacity-20" />
      </div>
    );
  }

  let content: AboutContent = defaultContent;
  if (page?.content) {
    try {
      const parsed = typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        content = { ...defaultContent, ...parsed };
      }
    } catch (e) {
      console.error("Error parsing about content", e);
    }
  }

  return (
    <div className="bg-background min-h-screen pb-24 relative overflow-hidden">
      {/* Background Tech Visuals */}
      <div className="absolute inset-0 bg-mesh opacity-20 z-0" />
      <div className="tech-orb top-0 -right-20 w-[600px] h-[600px] bg-primary/10 animate-pulse pointer-events-none" />
      <div className="tech-orb bottom-0 -left-20 w-[500px] h-[500px] bg-secondary/10 animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-1" />

      {/* Hero Header */}
      <div className="relative pt-32 pb-24 z-10">
        <div className="gov-container">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-secondary transition-colors group">
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Return to Gateway
          </Link>
          
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-secondary text-xs font-black uppercase tracking-[0.2em] animate-fade-in shadow-[0_0_20px_rgba(var(--secondary),0.2)]">
                <ShieldCheck className="h-4 w-4 text-secondary fill-secondary animate-pulse" />
                Institutional Identity v4.0
            </div>
            
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-2xl">
              ABOUT <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">OUR MISSION</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Architecting a smarter Regional future through systematic digital integration and youth-focused innovation hubs.
            </p>
          </div>
        </div>
      </div>

      <div className="gov-container relative z-10">
        {/* Core Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: Target, title: "Mission", desc: content.mission, accent: "primary" },
            { icon: Building2, title: "Vision", desc: content.vision, accent: "secondary" },
            { icon: Users, title: "Values", desc: content.values, accent: "accent" },
          ].map((item) => (
            <Card key={item.title} className="p-10 rounded-[3rem] glass-card border-white/5 hover:border-white/20 transition-all duration-700 flex flex-col items-center text-center group cursor-help">
              <div className={cn(
                "h-20 w-20 rounded-[1.8rem] flex items-center justify-center mb-10 transition-all duration-700 shadow-inner group-hover:scale-110",
                item.accent === "primary" ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white" :
                item.accent === "secondary" ? "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-background" :
                "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white"
              )}>
                <item.icon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-widest text-white">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium group-hover:text-white transition-colors duration-500">{item.desc}</p>
              
              {/* Animated Corner Decor */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/0 group-hover:border-white/20 group-hover:w-8 group-hover:h-8 transition-all rounded-tr-[1.5rem]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-white/0 group-hover:border-white/20 group-hover:w-8 group-hover:h-8 transition-all rounded-bl-[1.5rem]" />
            </Card>
          ))}
        </div>

        {/* Leadership Profile Section */}
        <div className="relative group/leadership">
            {/* Background Glow */}
            <div className="absolute -inset-10 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[5rem] opacity-30 blur-3xl" />
            
            <div className="relative grid lg:grid-cols-2 gap-16 items-center rounded-[4rem] overflow-hidden border border-white/10 glass-card p-8 sm:p-20 shadow-2xl">
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[3/4] rounded-[3rem] overflow-hidden group/img shadow-2xl border-2 border-white/5">
                <img
                  src={content.managerPhotoUrl}
                  alt={content.managerName}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110 grayscale group-hover/img:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                
                {/* Image UI Decoration */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary/80 font-mono">Verified_Official_Portrait</span>
                </div>
                
                <div className="absolute bottom-10 left-10 right-10">
                  <p className="text-3xl font-black tracking-tighter text-white uppercase">{content.managerName}</p>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-secondary mt-2">{content.managerTitle}</p>
                </div>
              </div>

              <div className="space-y-12">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest">
                  <Activity className="h-4 w-4 text-secondary" /> Administrative Leadership Core
                </div>

                <div className="relative">
                  <Quote className="absolute -top-12 -left-8 h-24 w-24 text-white/5" />
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none italic text-white drop-shadow-xl">
                    "{content.managerMessage}"
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <Zap className="h-4 w-4 text-secondary" />
                     <h4 className="text-lg font-black uppercase tracking-tight text-white border-b border-primary/40 pb-1">Operational Mandate</h4>
                  </div>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                    {content.managerJobDescription}
                  </p>
                </div>

                <div className="pt-10 border-t border-white/5 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/leadership:bg-primary/20 transition-all duration-700">
                        <Users className="h-8 w-8 text-secondary" />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-white leading-none">Office of Digital Transformation</p>
                        <p className="text-xs text-muted-foreground mt-2 font-medium italic opacity-60">Pioneering regional innovation protocols since 2021.</p>
                    </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;
