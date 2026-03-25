import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { QuickLinksSection } from "@/components/home/QuickLinksSection";
import { CEOMessageSection } from "@/components/home/CEOMessageSection";
import { TendersSection } from "@/components/home/TendersSection";
import { AlertCircle, ArrowRight, Bell, TrendingUp, Lightbulb, GraduationCap, Wrench, Globe, Users, Activity, Zap, ShieldCheck, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* High-Tech Background Layers */}
      <div className="tech-orb top-0 -left-60 w-[800px] h-[800px] bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="tech-orb bottom-0 -right-60 w-[800px] h-[800px] bg-secondary/10 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-1 pointer-events-none" />

      {/* Live System Status Marquee (Tech Portal Look) */}
      <div className="bg-white/5 border-b border-white/5 py-3 relative overflow-hidden backdrop-blur-md z-20">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-12">
          {[
            { label: "NETWORK STATUS", value: "OPERATIONAL_NODE_GZ", icon: Activity, color: "text-emerald-500" },
            { label: "ACTIVE PROJECTS", value: "128_SYSTEMS", icon: Zap, color: "text-amber-500" },
            { label: "REGIONAL CLOUD", value: "99.9%_UPTIME", icon: Database, color: "text-secondary" },
            { label: "SECURE ACCESS", value: "ENCRYPTED_v4.0", icon: ShieldCheck, color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 px-6 border-r border-white/10 last:border-none">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{stat.label} : </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{stat.value}</span>
            </div>
          ))}
          {/* Duplicate for seamless scroll */}
          {[
            { label: "NETWORK STATUS", value: "OPERATIONAL_NODE_GZ", icon: Activity, color: "text-emerald-500" },
            { label: "ACTIVE PROJECTS", value: "128_SYSTEMS", icon: Zap, color: "text-amber-500" },
            { label: "REGIONAL CLOUD", value: "99.9%_UPTIME", icon: Database, color: "text-secondary" },
            { label: "SECURE ACCESS", value: "ENCRYPTED_v4.0", icon: ShieldCheck, color: "text-primary" },
          ].map((stat, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-4 px-6 border-r border-white/10 last:border-none">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{stat.label} : </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <HeroSection />

      {/* Core Technology Verticals (The "Portal" Hub) */}
      <div className="py-32 relative z-10 bg-gradient-to-b from-transparent via-white/2 to-transparent">
        <div className="gov-container">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20 border-b border-white/5 pb-16">
              <div className="space-y-6 max-w-2xl">
                <Badge className="bg-secondary text-background font-black border-none uppercase text-[10px] tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg shadow-secondary/20 transition-all hover:scale-105">
                  Regional Tech Ecosystem
                </Badge>
                <h2 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                  INTEGRATED <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                    DIGITAL SOLUTIONS
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">
                  Architecting the future of Gurage Zone through mission-critical development programs.
                </p>
              </div>
              <div className="flex gap-4">
                <Link to="/services">
                   <Button size="lg" className="rounded-full px-10 py-8 h-auto font-black uppercase tracking-widest text-xs btn-tech shadow-2xl">
                     Initialize Full Catalog <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Innovation Hub", icon: Lightbulb, href: "/innovation-hub", desc: "Technical mentorship and regional prototyping labs.", color: "group-hover:text-amber-400" },
                { label: "Training Units", icon: GraduationCap, href: "/services/training", desc: "Professional development for digital transformation.", color: "group-hover:text-blue-400" },
                { label: "Resource Grid", icon: Database, href: "/resources-downloads", desc: "Institutional documentation and technical manuals.", color: "group-hover:text-purple-400" },
                { label: "Communication", icon: Globe, href: "/contact", desc: "Unified node for inquiries and support tickets.", color: "group-hover:text-emerald-400" },
              ].map((item, i) => (
                <Link key={i} to={item.href} className="group relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[3rem] blur-2xl" />
                  <Card className="relative h-full p-10 rounded-[3rem] glass-card border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden flex flex-col items-start text-left bg-gradient-to-br from-white/5 via-transparent to-transparent">
                    <div className="absolute top-0 right-0 p-12 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 transition-all duration-700 group-hover:scale-110 group-hover:bg-primary/20">
                      <item.icon className={cn("h-8 w-8 text-white transition-colors duration-500", item.color)} />
                    </div>
                    <div className="space-y-4 flex-1">
                      <h3 className="text-xl font-black uppercase text-white tracking-widest leading-none group-hover:text-glow transition-all mb-4">{item.label}</h3>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity italic">"{item.desc}"</p>
                    </div>
                    <div className="pt-10 w-full mt-auto flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Operational</span>
                      <ChevronRight className="h-4 w-4 text-secondary animate-bounce-x" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CEOMessageSection />

      <ServicesSection />
      <div className="relative">
         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <TendersSection />
      </div>
      
      <div className="relative">
         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <NewsSection />
      </div>

      {/* Global Impact Dashboard Section */}
      <div className="py-40 relative overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="gov-container relative z-10 grid lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">
               <Activity className="h-4 w-4 text-secondary" /> LIVE IMPACT TRACKER
            </div>
            <h2 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.85] uppercase text-white">
              DIGITAL <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary drop-shadow-[0_0_20px_rgba(var(--secondary),0.3)]">
                BLUEPRINT 2026
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium leading-relaxed max-w-xl">
              Integrating 14 specialized innovation hubs and digital centers to create a seamless regional technological fabric.
            </p>
            <div className="pt-8">
               <Link to="/about">
                  <Button size="lg" className="rounded-full px-16 py-10 h-auto text-sm font-black uppercase tracking-[0.2em] bg-white text-background hover:bg-secondary hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95">
                    Explore Infrastructure
                  </Button>
               </Link>
            </div>
          </div>
          
          <div className="relative grid grid-cols-2 gap-10">
            {/* Background Glow */}
            <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="aspect-[4/5] rounded-[3.5rem] glass-card p-12 flex flex-col justify-between group cursor-pointer transition-all duration-700 hover:-translate-y-4 shadow-2xl border-white/5 hover:border-white/20">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/30 transition-all">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-7xl font-black mb-4 tracking-tighter text-white group-hover:text-glow transition-all">88.4<span className="text-3xl text-primary">%</span></p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="h-full w-[88%] bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white leading-none">REGIONAL_ADOPTION_v1</p>
              </div>
            </div>
            
            <div className="aspect-[4/5] rounded-[3.5rem] glass-card p-12 flex flex-col justify-between mt-24 group cursor-pointer transition-all duration-700 hover:-translate-y-4 shadow-2xl border-white/5 hover:border-white/20 bg-gradient-to-br from-secondary/10 to-transparent">
              <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:bg-secondary/30 transition-all">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <p className="text-7xl font-black mb-4 tracking-tighter text-white group-hover:text-glow transition-all">14<span className="text-3xl text-secondary">k</span></p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="h-full w-[65%] bg-secondary animate-pulse shadow-[0_0_10px_rgba(var(--secondary),0.5)]" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white leading-none">TOTAL_HUB_MEMBERS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <QuickLinksSection />
    </div>
  );
};

export default Index;
