import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Briefcase, FileText, Calendar, Loader2, Sparkles, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const TendersSection = () => {
    const { t } = useTranslation();
    const { data: tenders, isLoading } = useQuery({
        queryKey: ["home-tenders"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("tenders" as any)
                .select("*")
                .eq("status", "published")
                .order("created_at", { ascending: false })
                .limit(3);
            if (error) throw error;
            return data as any[];
        },
    });

    if (isLoading) {
        return (
            <div className="py-24 bg-background">
                <div className="gov-container flex justify-center py-24">
                    <Loader2 className="h-10 w-10 animate-spin text-secondary" />
                </div>
            </div>
        );
    }

    if (!tenders || tenders.length === 0) return null;

    return (
        <section className="py-32 bg-background relative overflow-hidden">
             <div className="tech-orb top-1/2 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="gov-container relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                            <Terminal className="h-3 w-3" /> System Opportunities
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            Tenders & <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Vacancies</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                    <Link to="/tenders">
                        <Button variant="outline" className="rounded-full px-10 py-7 h-auto text-sm font-bold border-white/10 glass text-white hover:bg-white/10 transition-all flex gap-3 group">
                            Execution Notices <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {tenders.map((item, index) => (
                        <Link
                            key={item.id}
                            to={`/tenders/${item.slug}`}
                            className="group relative"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem] blur-2xl" />
                            <div className="relative p-10 rounded-[3rem] glass-card border-white/5 hover:border-secondary/20 transition-all duration-500 flex flex-col h-full overflow-hidden">
                                <div className="flex items-center gap-3 mb-8">
                                    {item.type === "vacancy" ? (
                                        <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[8px] animate-pulse">
                                            <Briefcase className="h-3 w-3 mr-1.5" /> Recruitment signal
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[8px] animate-pulse">
                                            <FileText className="h-3 w-3 mr-1.5" /> Procurement query
                                        </Badge>
                                    )}
                                </div>

                                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-glow transition-all mb-6 line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-secondary">
                                    {item.title}
                                </h3>

                                <p className="text-muted-foreground text-sm font-medium line-clamp-3 mb-10 leading-relaxed italic">
                                    "{item.description || "Official notice regarding procurement or institutional recruitment. Access secure portal for full system requirements."}"
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-white transition-colors">
                                        <Calendar className="h-3.5 w-3.5 text-primary" />
                                        Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString() : "Operational"}
                                    </div>
                                    <div className="h-10 w-10 rounded-full glass flex items-center justify-center group-hover:bg-secondary group-hover:text-background transition-all border-white/10 shadow-lg">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
