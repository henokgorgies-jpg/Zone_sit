import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calendar, ArrowRight, Briefcase, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Tenders = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: tenders, isLoading } = useQuery({
        queryKey: ["public-tenders"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("tenders" as any)
                .select("*")
                .eq("status", "published")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data as any[];
        },
    });

    const filteredTenders = tenders?.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Header Section */}
            <div className="bg-white border-b pt-24 pb-16">
                <div className="gov-container">
                    <div className="max-w-3xl">
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4 block">Official Portal</span>
                        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-6 uppercase text-slate-900">
                            Tenders & <span className="text-primary font-outline-2">Hiring</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            Transparent procurement notices and exciting career opportunities within our institution.
                        </p>
                    </div>
                </div>
            </div>

            <div className="gov-container mt-12">
                {/* Search and Filters */}
                <div className="mb-12 relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search for tenders or job openings..."
                        className="pl-12 h-16 rounded-2xl border-2 border-white shadow-xl focus-visible:ring-primary text-lg font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredTenders && filteredTenders.length > 0 ? (
                    <div className="grid gap-6">
                        {filteredTenders.map((item) => (
                            <Link
                                key={item.id}
                                to={`/tenders/${item.slug}`}
                                className="group bg-white p-8 rounded-[2.5rem] border-2 border-transparent hover:border-primary/20 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8"
                            >
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        {item.type === "vacancy" ? (
                                            <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                                                <Briefcase className="h-3 w-3 mr-1.5" /> Vacancy
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-100 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                                                <FileText className="h-3 w-3 mr-1.5" /> Tender
                                            </Badge>
                                        )}
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            REF: {item.id.slice(0, 8).toUpperCase()}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500 font-medium line-clamp-2 mt-2 leading-relaxed">
                                            {item.description || "Click to view full details and requirements for this notice."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:items-end gap-4 min-w-[200px]">
                                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        <Calendar className="h-4 w-4" />
                                        Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString() : "Open until filled"}
                                    </div>
                                    <Button className="rounded-full px-8 py-6 h-auto font-bold uppercase tracking-widest text-xs group-hover:scale-110 transition-transform">
                                        View Details <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed">
                        <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto text-slate-300 mb-6">
                            <Search className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">No results found</h2>
                        <p className="text-slate-500 font-medium max-w-md mx-auto mt-2">
                            We couldn't find any notices matching your search criteria. Please try a different keyword.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tenders;
