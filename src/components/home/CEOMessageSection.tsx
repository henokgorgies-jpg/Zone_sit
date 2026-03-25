import { Button } from "@/components/ui/button";
import { Quote, Sparkles, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const CEOMessageSection = () => {
    const [ceoData, setCeoData] = useState({
        name: "Department Head",
        title: "SIT Department Head",
        message: "Our commitment to digital transformation and citizen-centric services is at the heart of everything we do. We believe that technology should empower every individual and bridge the gap between governance and the community.\n\nAs we move forward, we focus on building a transparent, efficient, and inclusive institutional framework that serves the needs of today while preparing for the challenges of tomorrow.",
        image: "/images/sid-head.png",
        since: "2024",
    });

    useEffect(() => {
        const fetchCeoData = async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "ceo_message_data")
                .maybeSingle();

            if (data && data.value) {
                try {
                    const parsedData = JSON.parse(data.value);
                    setCeoData(prevData => ({ ...prevData, ...parsedData }));
                } catch (e) {
                    console.error("Error parsing CEO data from site_settings:", e);
                }
            }
        };
        fetchCeoData();
    }, []);

    return (
        <div className="py-32 bg-background relative overflow-hidden">
            {/* Background Orbs */}
            <div className="tech-orb top-1/4 left-0 w-[400px] h-[400px] bg-primary/10 blur-[100px]" />
            <div className="tech-orb bottom-1/4 right-0 w-[400px] h-[400px] bg-secondary/10 blur-[100px]" />

            <div className="gov-container relative z-10">
                <div className="grid lg:grid-cols-12 gap-20 items-center">
                    {/* Left Side: CEO Photo with Tech Frame */}
                    <div className="lg:col-span-5 relative group order-2 lg:order-1">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-[4rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
                        
                        <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden glass border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                            <img
                                src={ceoData.image}
                                alt={`${ceoData.name} Portrait`}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:grayscale-0 grayscale-[20%]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                            
                            {/* Scanning Line Animation */}
                            <div className="absolute inset-x-0 h-[2px] bg-secondary/50 shadow-[0_0_15px_rgba(var(--secondary),0.5)] top-0 animate-[scan_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute bottom-10 left-10 right-10">
                                <div className="glass p-6 rounded-2xl border-white/10 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Verified Leadership</p>
                                    <p className="text-2xl font-black text-white uppercase tracking-tighter">{ceoData.name}</p>
                                    <div className="h-1 w-12 bg-secondary rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Tech Badge */}
                        <div className="absolute -top-10 -right-10 glass p-8 rounded-[3rem] shadow-2xl animate-bounce-slow border-white/10">
                            <UserCheck className="h-8 w-8 text-secondary fill-secondary/20" />
                        </div>
                    </div>

                    {/* Right Side: Message with Modern Typography */}
                    <div className="lg:col-span-7 space-y-12 order-1 lg:order-2">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                <Sparkles className="h-3 w-3" /> Strategic Directive
                            </div>
                            <h2 className="text-6xl font-black tracking-tight leading-none uppercase text-white">
                                Message <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">of the Head</span>
                            </h2>
                        </div>

                        <div className="relative glass-card p-12 rounded-[3.5rem] border-white/5 space-y-8">
                            <Quote className="h-16 w-16 text-white/5 absolute -top-8 -left-8" />
                            
                            <div className="space-y-6 text-muted-foreground font-medium leading-relaxed text-xl italic group">
                                {ceoData.message.split('\n').map((para, i) => para.trim() && (
                                    <p key={i} className="group-hover:text-white transition-colors duration-500 line-clamp-4">"{para}"</p>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-white uppercase tracking-widest">{ceoData.title}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mandate since {ceoData.since}</p>
                                </div>
                                <Button size="lg" className="btn-tech rounded-full px-8 py-6 h-auto text-sm font-bold">
                                    View Full Signal
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
