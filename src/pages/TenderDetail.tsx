import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, Calendar, Mail, Share2, Briefcase, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TenderDetail = () => {
    const { slug } = useParams<{ slug: string }>();

    const { data: tender, isLoading, error } = useQuery({
        queryKey: ["tender-detail", slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("tenders" as any)
                .select("*")
                .eq("slug", slug)
                .eq("status", "published")
                .maybeSingle();
            if (error) throw error;
            return data;
        },
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !tender) {
        return (
            <div className="gov-section">
                <div className="gov-container text-center py-24">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Notice Not Found</h1>
                    <p className="text-slate-500 font-medium mb-8">
                        The notice you're looking for doesn't exist or has been removed.
                    </p>
                    <Button asChild className="rounded-full">
                        <Link to="/tenders">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Tenders
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const t = tender as any;

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* Hero Header */}
            <div className="bg-white border-b pt-24 pb-16 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2" />

                <div className="gov-container relative">
                    <Link to="/tenders" className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-12 hover:-translate-x-1 transition-transform">
                        <ArrowLeft className="h-4 w-4" /> Back to All Notices
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-6">
                                {t.type === "vacancy" ? (
                                    <Badge className="bg-blue-600 text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
                                        <Briefcase className="h-3 w-3 mr-2" /> Hiring / Vacancy
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-500 text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
                                        <FileText className="h-3 w-3 mr-2" /> Procurement / Tender
                                    </Badge>
                                )}
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Ref: {t.id.slice(0, 8).toUpperCase()}
                                </span>
                            </div>
                            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-6 uppercase text-slate-900">
                                {t.title}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    Published: {new Date(t.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-red-500">
                                    <Clock className="h-4 w-4" />
                                    Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "Open"}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button size="icon" variant="outline" className="rounded-full h-14 w-14 border-2">
                                <Share2 className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full h-14 w-14 border-2">
                                <Mail className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="gov-container mt-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-8 flex items-center gap-3">
                                <div className="h-8 w-2 bg-primary rounded-full" />
                                Details & Requirements
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed text-lg">
                                {t.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: t.content.replace(/\n/g, '<br/>') }} />
                                ) : (
                                    <p>{t.description || "No detailed content provided for this notice."}</p>
                                )}
                            </div>
                        </div>

                        {/* How to Apply / Submit */}
                        <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/30 transition-colors" />
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">How to Apply</h2>
                                <p className="text-slate-400 font-medium mb-8 max-w-xl">
                                    Interested candidates or entities should submit their documents through our official portal or via the contact details provided in the full documentation.
                                </p>
                                <div className="flex gap-4">
                                    <Button className="rounded-full px-12 py-8 h-auto font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
                                        Apply Now / Submit Bid
                                    </Button>
                                    <Button variant="outline" className="rounded-full px-12 py-8 h-auto font-black uppercase tracking-widest text-sm border-white/20 hover:bg-white/10">
                                        Download Documents
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Info Box */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-32">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">Quick Overview</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50">
                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Closing Date</p>
                                        <p className="font-bold text-slate-900">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "Open"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50">
                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</p>
                                        <p className="font-bold text-slate-900">General Administration</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                                        All recruitment and procurement processes are subject to institutional transparency guidelines and regional regulations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenderDetail;
