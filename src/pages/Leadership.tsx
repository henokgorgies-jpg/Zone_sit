import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Network, Users, ArrowRight, UserCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Leadership = () => {
    const { data: officials, isLoading: loadingOfficials } = useQuery({
        queryKey: ["public-leadership"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("leadership" as any)
                .select("*")
                .eq("status", "published")
                .order("rank", { ascending: true });
            if (error) throw error;
            return data as any[];
        },
    });

    const { data: orgChart, isLoading: loadingOrgChart } = useQuery({
        queryKey: ["org-chart-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "org_chart_data")
                .maybeSingle();
            if (error) throw error;
            return data?.value ? JSON.parse(data.value) : { image_url: "", description: "" };
        },
    });

    if (loadingOfficials || loadingOrgChart) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    // Group officials by category
    const categories = officials ? Array.from(new Set(officials.map(o => o.category))) : [];

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* Premium Header */}
            <div className="bg-white border-b pt-24 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
                <div className="gov-container relative">
                    <div className="max-w-4xl text-center md:text-left mx-auto md:mx-0">
                        <span className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-6 block">Governance & Leadership</span>
                        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-8 uppercase text-slate-900">
                            Leadership <span className="text-primary font-outline-2">Hub</span>
                        </h1>
                        <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Meet the dedicated officials driving innovation and excellence within our government institution.
                        </p>
                    </div>
                </div>
            </div>

            <div className="gov-container mt-20 space-y-32">
                {/* Organizational Structure Section */}
                {orgChart?.image_url && (
                    <section className="space-y-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-12">
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                                        <Network className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Institutional Structure</h2>
                                </div>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                    {orgChart.description || "The hierarchical framework of our institution, ensuring clear accountability and streamlined public service delivery."}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 sm:p-12 rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden group">
                            <div className="relative">
                                <img
                                    src={orgChart.image_url}
                                    alt="Organization Chart"
                                    className="w-full h-auto rounded-[2.5rem] shadow-sm transform transition-transform duration-1000 group-hover:scale-[1.01]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </section>
                )}

                {/* Officials Section */}
                <section className="space-y-24">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                            Government <span className="text-primary">Officials</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            Our diverse leadership team brings decades of experience in public administration, technology, and strategic policy development.
                        </p>
                    </div>

                    <div className="space-y-32">
                        {categories.map((cat) => (
                            <div key={cat} className="space-y-12">
                                <div className="flex items-center gap-6">
                                    <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-primary whitespace-nowrap">
                                        {cat}
                                    </h3>
                                    <div className="h-px w-full bg-slate-200" />
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {officials?.filter(o => o.category === cat).map((official) => (
                                        <div
                                            key={official.id}
                                            className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col"
                                        >
                                            <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                                                {official.image_url ? (
                                                    <img
                                                        src={official.image_url}
                                                        alt={official.name}
                                                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <UserCircle className="h-32 w-32" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            </div>

                                            <div className="p-8 space-y-4 relative flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors">
                                                        {official.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[9px] mb-4">
                                                        <Briefcase className="h-3 w-3" />
                                                        {official.role}
                                                    </div>
                                                </div>

                                                {official.bio && (
                                                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic line-clamp-3">
                                                        "{official.bio}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Leadership;
