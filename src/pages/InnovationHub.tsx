import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lightbulb, GraduationCap, Rocket, Users, ChevronRight, Sparkles, MapPin, Activity, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const InnovationHub = () => {
  const { t } = useTranslation();

  // Fetch Innovation Centers
  const { data: centers } = useQuery({
    queryKey: ["innovation-centers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("innovation_centers")
        .select("*")
        .eq("status", "published");
      if (error) throw error;
      return data;
    },
  });

  // Fetch Success Stories
  const { data: stories, isLoading } = useQuery({
    queryKey: ["innovation-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("innovation_success_stories")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="tech-orb top-0 -left-40 w-[600px] h-[600px] bg-primary/20 blur-[150px] pointer-events-none" />
      <div className="tech-orb bottom-0 -right-40 w-[600px] h-[600px] bg-secondary/15 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-1 pointer-events-none" />

      {/* Hero Section */}
      <div className="pt-32 pb-24 relative z-10 border-b border-white/5">
        <div className="gov-container">
          <div className="max-w-4xl space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-secondary text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(var(--secondary),0.2)]">
              <Rocket className="h-4 w-4 text-secondary fill-secondary animate-pulse" />
              SIT Innovation Accelerator v4.0
            </div>
            <h1 className="text-6xl sm:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
                ENGINEERING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent drop-shadow-[0_0_30px_rgba(var(--primary),0.5)]">
                    REGIONAL PROGRESS
                </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                The centralized hub for youth technical mentorship and digital solution prototyping. We provide the ecosystem for the next generation of Gurage innovators.
            </p>
          </div>
        </div>
      </div>

      <div className="gov-container py-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* Left Column: Centers & Engagement */}
          <div className="lg:col-span-1 space-y-12">
            
            {/* Innovation Centers */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-secondary rounded-full" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Technical Centers</h2>
                </div>
                
                <div className="space-y-6">
                    {centers?.map((center) => (
                        <div key={center.id} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                            <Card className="relative p-6 rounded-[2.5rem] glass-card border-white/5 group-hover:border-secondary/20 transition-all duration-500">
                                <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/5 relative">
                                    <img src={center.image_url} alt={center.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-secondary text-background font-black uppercase tracking-widest text-[8px] border-none px-3 py-1">Operational</Badge>
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-white uppercase mb-2 group-hover:text-secondary transition-colors">{center.name}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">
                                    <MapPin className="h-3 w-3 text-secondary" /> {center.location}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{center.description}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Participation Form Trigger */}
            <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-primary/20 to-transparent relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-16 bg-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-all duration-700" />
                 <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter">Submit Idea Protocol</h3>
                 <p className="text-sm text-muted-foreground mb-8 font-medium">Have a revolutionary technical concept? Gain access to regional resources and mentorship.</p>
                 <Button className="w-full btn-tech rounded-[1.5rem] py-8 h-auto font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">Initialize Submission <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </div>
            
            {/* Live Metrics */}
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Active_Projects</span>
                    <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
                 </div>
                 <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white tracking-tighter leading-none">42</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pb-1">+12 This Month</span>
                 </div>
            </div>
          </div>

          {/* Right Column: Success Stories / Success Protocols */}
          <div className="lg:col-span-2 space-y-12">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-primary rounded-full" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Success Protocols</h2>
                </div>
                <Badge className="bg-white/5 text-muted-foreground border-white/10 uppercase tracking-widest font-black text-[9px] px-3 py-1">Mission Log</Badge>
             </div>

             {isLoading ? (
               <div className="flex justify-center py-20">
                 <Loader2 className="h-10 w-10 animate-spin text-secondary" />
               </div>
             ) : stories && stories.length > 0 ? (
               <div className="grid gap-10">
                 {stories.map((story, i) => (
                   <div key={story.id} className="group relative" style={{ animationDelay: `${i * 0.1}s` }}>
                     <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[3.5rem] blur-2xl" />
                     <Card className="relative glass-card p-10 rounded-[3.5rem] border-white/10 hover:border-white/20 transition-all duration-500 grid md:grid-cols-12 gap-10 items-center overflow-hidden">
                        <div className="md:col-span-4 aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/5 relative">
                             <img src={story.image_url} alt={story.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                             <div className="absolute top-4 right-4">
                                <div className="h-8 w-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                    <Sparkles className="h-4 w-4 text-secondary" />
                                </div>
                             </div>
                        </div>
                        <div className="md:col-span-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-secondary/80">
                                    <Zap className="h-3 w-3" /> Category: {story.category}
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-secondary transition-all duration-500">
                                    {story.title}
                                </h3>
                                <p className="text-muted-foreground font-medium leading-relaxed italic">
                                    "{story.content.substring(0, 160)}..."
                                </p>
                            </div>
                            
                            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <Users className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none">{story.author}</p>
                                        <p className="text-[9px] font-bold text-muted-foreground mt-1 uppercase">Lead Innovator</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-secondary p-0 font-black uppercase tracking-widest text-[10px] gap-2 group/btn hover:bg-transparent">
                                    Protocol_Full_View <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </div>
                        </div>
                     </Card>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-32 glass rounded-[3.5rem] border-white/5 border-dashed border-2">
                 <p className="text-muted-foreground font-medium italic">All technical signals nominal. Success protocols in queue.</p>
               </div>
             )}

             {/* Participation & Call to Action */}
             <div className="pt-8">
                <div className="glass-card p-12 rounded-[3.5rem] border-white/5 bg-gradient-to-r from-primary/10 via-background to-secondary/10 relative overflow-hidden group">
                    <div className="absolute -bottom-20 -left-20 p-40 bg-secondary/10 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-all duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-4 max-w-lg text-center md:text-left">
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Initialize <br /><span className="text-secondary">Your Innovation Unit</span></h3>
                            <p className="text-muted-foreground font-medium">Join the regional technical network. Access labs, high-speed infra, and professional mentorship networks.</p>
                        </div>
                        <Button size="lg" className="btn-tech rounded-full px-12 py-8 h-auto text-sm font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">Open Call v2026.03</Button>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationHub;
