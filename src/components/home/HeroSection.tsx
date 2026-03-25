import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Cpu, Network, ShieldCheck, Zap, ChevronLeft, ChevronRight, Activity, Terminal, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface HeroSlide {
  src: string;
  alt: string;
}

export const HeroSection = () => {
  const { t } = useTranslation();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides]);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_carousel")
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSlides(JSON.parse(data.value));
      }
    } catch (err) {
      console.error("Error fetching hero slides:", err);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative min-h-[95vh] flex items-center overflow-hidden bg-background">
      {/* Background Layer: Tech Visuals */}
      <div className="absolute inset-0 bg-mesh opacity-40 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-1 pointer-events-none" />

      {/* Dynamic Glow Orbs */}
      <div className="tech-orb top-1/4 -right-40 w-[800px] h-[800px] bg-primary/10 animate-pulse pointer-events-none flex items-center justify-center">
         <div className="w-[400px] h-[400px] bg-secondary/5 blur-[100px]" />
      </div>
      <div className="tech-orb bottom-1/4 -left-40 w-[600px] h-[600px] bg-secondary/10 animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="gov-container relative z-10 py-20 w-full">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-center">
          
          {/* Left Column: Command Center Text */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-white/10 text-secondary text-xs font-black uppercase tracking-[0.3em] animate-fade-in shadow-[0_0_30px_rgba(var(--secondary),0.15)] bg-white/5 backdrop-blur-xl group cursor-crosshair">
              <Terminal className="h-4 w-4 text-secondary animate-pulse" />
              SIT_GLOBAL_ACCESS_NODE_v4.0
              <div className="h-4 w-px bg-white/10 mx-2" />
              <Activity className="h-3 w-3 text-emerald-500" />
            </div>

            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black leading-[0.85] animate-slide-up text-white tracking-tighter drop-shadow-2xl">
              <span className="block opacity-60 text-4xl md:text-5xl xl:text-6xl mb-4 tracking-[-0.05em]">{t('home.welcome')}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-secondary drop-shadow-[0_0_40px_rgba(var(--primary),0.4)]">
                {t('home.innovationHub')}
              </span>
            </h1>

            <p className="text-xl md:text-3xl text-muted-foreground/80 max-w-2xl animate-slide-up font-medium leading-relaxed tracking-tight" style={{ animationDelay: "0.1s" }}>
              {t('home.subtitle')}
            </p>

            <div className="flex flex-wrap gap-8 animate-slide-up pt-4" style={{ animationDelay: "0.2s" }}>
              <Link to="/services">
                <Button size="lg" className="btn-tech rounded-full px-12 py-10 h-auto text-sm font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(var(--secondary),0.2)] hover:scale-105 active:scale-95 transition-all outline outline-0 hover:outline-4 outline-secondary/20">
                  Initialize Infrastructure <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/page/e-portal">
                <Button size="lg" variant="outline" className="rounded-full px-12 py-10 h-auto text-sm font-black uppercase tracking-[0.3em] border-white/10 glass hover:bg-white/10 text-white shadow-xl hover:scale-105 transition-all">
                  {t('nav.ePortal')}
                </Button>
              </Link>
            </div>

            {/* Feature Dashboard Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-20 pt-20 border-t border-white/5 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {[
                { icon: Network, title: "Connectivity", desc: "10Gbps Regional Uplink", value: "99.9% Up" },
                { icon: ShieldCheck, title: "Governance", desc: "Digital Identification", value: "SECURE" },
                { icon: Cpu, title: "Systems", desc: "AI-Powered Services", value: "ACTIVE" }
              ].map((feature, i) => (
                <div key={i} className="group cursor-help relative p-4 rounded-3xl transition-all duration-500 hover:bg-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-2xl glass flex items-center justify-center group-hover:bg-secondary group-hover:text-background transition-all duration-500 border border-white/10 shadow-lg">
                        <feature.icon className="h-7 w-7 text-secondary group-hover:text-background transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">{feature.title}</h4>
                        <Badge className="bg-white/5 text-secondary border-none text-[8px] px-2 py-0 animate-pulse">{feature.value}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed italic opacity-60 group-hover:opacity-100 transition-all">"{feature.desc}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: High-Tech Visualization Projection */}
          <div className="lg:col-span-5 xl:col-span-5 relative group animate-fade-in" style={{ animationDelay: "0.5s" }}>
            
            {/* Command Frame Background */}
            <div className="absolute -inset-10 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[5rem] opacity-20 blur-[100px] group-hover:opacity-40 transition-all duration-1000" />
            
            <div className="relative rounded-[4rem] overflow-hidden border-2 border-white/10 glass-card p-4 sm:p-6 shadow-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 backdrop-blur-3xl">
                
                {/* Interface Hardware Details */}
                <div className="absolute top-8 left-10 flex items-center gap-3 z-20">
                    <div className="h-3 w-3 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(var(--secondary),0.6)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 drop-shadow-md">LIVE_VISUAL_FEED</span>
                </div>
                
                <div className="absolute top-8 right-10 z-20 flex gap-4">
                    <Layers className="h-4 w-4 text-white/40 hover:text-white transition-colors cursor-pointer" />
                </div>

                {/* Main Visual Box */}
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group/slide group cursor-zoom-in">
                    {slides.length > 0 ? (
                        <>
                            {slides.map((slide, index) => (
                                <div 
                                    key={index}
                                    className={cn(
                                        "absolute inset-0 transition-all duration-1000 ease-in-out",
                                        index === currentSlide ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-110 rotate-1"
                                    )}
                                >
                                    <img 
                                        src={slide.src} 
                                        alt={slide.alt} 
                                        className="w-full h-full object-cover transition-transform duration-[20s] linear-infinite group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                                    
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 bg-scanlines opacity-[0.03] pointer-events-none" />

                                    {/* Slide Metadata Overlay */}
                                    <div className="absolute bottom-10 left-10 right-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="h-0.5 w-12 bg-secondary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">ARCHIVE_SYS_v4</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-2xl leading-none">{slide.alt}</h3>
                                    </div>
                                </div>
                            ))}

                            {/* UI Controls Overlay */}
                            <div className="absolute bottom-10 right-10 flex gap-3 opacity-0 group-hover/slide:opacity-100 transition-all duration-500 translate-x-4 group-hover/slide:translate-x-0">
                                <Button onClick={prevSlide} variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-black/60 backdrop-blur-xl hover:bg-secondary hover:text-background text-white border border-white/10 shadow-2xl">
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button onClick={nextSlide} variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-black/60 backdrop-blur-xl hover:bg-secondary hover:text-background text-white border border-white/10 shadow-2xl">
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-3xl overflow-hidden">
                             <div className="relative text-center z-10">
                                <Cpu className="h-16 w-16 text-secondary mx-auto mb-6 animate-spin-slow opacity-40" />
                                <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white/60 animate-pulse">Syncing Visual Node...</p>
                             </div>
                             <div className="absolute inset-0 bg-mesh opacity-20" />
                        </div>
                    )}
                </div>

                {/* Interactive Status Footer */}
                <div className="mt-10 px-6 pb-6 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h3 className="text-white font-black uppercase tracking-tight text-3xl leading-none drop-shadow-lg group-hover:text-secondary transition-colors duration-500">System Feed</h3>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Status:</p>
                                <Badge className="bg-emerald-500 text-[8px] font-black text-white tracking-widest px-2 py-0 border-none shadow-[0_0_10px_rgba(var(--emerald-500),0.4)]">ALL_NODES_NOMINAL</Badge>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex gap-2">
                                {slides.map((_, i) => (
                                    <button key={i} onClick={() => setCurrentSlide(i)} className={cn("h-1.5 transition-all duration-700 rounded-full", i === currentSlide ? "w-10 bg-secondary" : "w-3 bg-white/10")} />
                                ))}
                            </div>
                            <span className="text-[10px] font-mono text-white/40 tracking-[0.3em]">REF: {currentSlide + 1} / {slides.length}</span>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Operational</span>
                            <p className="text-[11px] font-mono font-black text-secondary uppercase">24_7_Active</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Encrypted</span>
                            <p className="text-[11px] font-mono font-black text-emerald-400 uppercase">AES_256</p>
                        </div>
                        <div className="space-y-1 text-right">
                             <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Frequency</span>
                             <p className="text-[11px] font-mono font-black text-white animate-pulse">5.2 GHz</p>
                        </div>
                    </div>
                </div>

                {/* Refined Decorative Edge Details */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-secondary/40 rounded-tl-[4rem]" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-secondary/40 rounded-br-[4rem]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
