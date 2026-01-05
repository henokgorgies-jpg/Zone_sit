import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Briefcase, FileText, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const TendersSection = () => {
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
            <div className="py-24 bg-slate-50">
                <div className="gov-container flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!tenders || tenders.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="gov-container">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4 block">Opportunities</span>
                        <h2 className="text-5xl font-black tracking-tighter uppercase text-slate-900 leading-none">
                            Tenders & <span className="text-primary font-outline-2">Vacancies</span>
                        </h2>
                    </div>
                    <Link to="/tenders">
                        <Button variant="outline" className="rounded-full border-2 font-bold px-8 group">
                            View All Notices <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {tenders.map((item) => (
                        <Link
                            key={item.id}
                            to={`/tenders/${item.slug}`}
                            className="group bg-slate-50 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                {item.type === "vacancy" ? (
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[9px]">
                                        <Briefcase className="h-3 w-3 mr-1.5" /> Vacancy
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[9px]">
                                        <FileText className="h-3 w-3 mr-1.5" /> Tender
                                    </Badge>
                                )}
                            </div>

                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors mb-4 line-clamp-2 min-h-[3.5rem]">
                                {item.title}
                            </h3>

                            <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                                {item.description || "Official notice regarding procurement or institutional recruitment. View details for requirements."}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Due: {item.deadline ? new Date(item.deadline).toLocaleDateString() : "Open"}
                                </div>
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center group-hover:bg-primary group-hover:text-white shadow-sm transition-all">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
