import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const CEOMessageSection = () => {
    const [ceoData, setCeoData] = useState({
        name: "Jane Doe",
        title: "Chief Executive Officer",
        message: "Our commitment to digital transformation and citizen-centric services is at the heart of everything we do. We believe that technology should empower every individual and bridge the gap between governance and the community.\n\nAs we move forward, we focus on building a transparent, efficient, and inclusive institutional framework that serves the needs of today while preparing for the challenges of tomorrow.",
        image: "/images/ceo.png",
        since: "2020",
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
                    // Ensure the fetched data is an object and merge with defaults
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
        <div className="py-24 bg-white overflow-hidden">
            <div className="gov-container">
                {/* Title at the top */}
                <div className="mb-16 text-center lg:text-left">
                    <span className="text-primary font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2 justify-center lg:justify-start mb-4">
                        <div className="h-px w-8 bg-primary" />
                        Official Statement
                    </span>
                    <h2 className="text-5xl font-black tracking-tight leading-tight uppercase text-slate-900">
                        Message of <span className="text-primary font-outline-2">CEO</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side: Message */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="relative">
                            <Quote className="absolute -top-6 -left-8 h-12 w-12 text-slate-100 -z-10" />
                            <div className="space-y-6 text-slate-600 font-medium leading-relaxed text-lg italic">
                                {ceoData.message.split('\n').map((para, i) => para.trim() && (
                                    <p key={i}>"{para}"</p>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <p className="font-black text-xl text-slate-900 uppercase tracking-tighter">{ceoData.name}</p>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{ceoData.title}</p>
                        </div>

                        <div className="pt-6">
                            <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs border-2 hover:bg-slate-900 hover:text-white transition-all">
                                Read Full Statement
                            </Button>
                        </div>
                    </div>

                    {/* Right Side: CEO Photo */}
                    <div className="relative group animate-in fade-in slide-in-from-right duration-1000">
                        {/* Decorative backgrounds */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-primary/20 transition-all duration-700" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-slate-100 rounded-full blur-3xl -z-10 group-hover:bg-slate-200 transition-all duration-700" />

                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02]">
                            <img
                                src={ceoData.image}
                                alt={`${ceoData.name} Portrait`}
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute bottom-8 left-8 right-8 text-white translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                                <p className="text-xs font-bold uppercase tracking-[0.3em] mb-1">Serving the people</p>
                                <p className="text-xl font-black uppercase tracking-tighter">Since {ceoData.since}</p>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-primary text-white p-8 rounded-[2rem] shadow-2xl animate-bounce-slow">
                            <Quote className="h-8 w-8 text-white/50" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
