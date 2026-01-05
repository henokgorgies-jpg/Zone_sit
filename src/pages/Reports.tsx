import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileDown, Search, BarChart3, PieChart, FileText, Download, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reports = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const { data: reports, isLoading } = useQuery({
        queryKey: ["public-reports"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("reports" as any)
                .select("*")
                .eq("status", "published")
                .order("year", { ascending: false })
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data as any[];
        },
    });

    const filteredReports = reports?.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTab = activeTab === "all" || r.category === activeTab;
        return matchesSearch && matchesTab;
    });

    const categories = [
        { value: "all", label: "All Publications", icon: FileText },
        { value: "annual_report", label: "Annual Reports", icon: BarChart3 },
        { value: "research_stat", label: "Research & Stats", icon: TrendingUp },
        { value: "strategic_plan", label: "Strategic Plans", icon: PieChart },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* Dynamic Header */}
            <div className="bg-white border-b pt-24 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
                <div className="gov-container relative">
                    <div className="max-w-4xl">
                        <span className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-6 block">Transparency & Accountability</span>
                        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-8 uppercase text-slate-900">
                            Reports & <span className="text-primary font-outline-2">Statistics</span>
                        </h1>
                        <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl">
                            Access official institutional publications, annual performance reports, and regional development statistics.
                        </p>
                    </div>
                </div>
            </div>

            <div className="gov-container -mt-10 relative z-10">
                {/* Search & Tabs Dashboard */}
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row gap-8 items-center justify-between mb-16">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search reports by title or keyword..."
                            className="pl-12 h-16 rounded-[1.5rem] border-slate-100 bg-slate-50 focus-visible:ring-primary text-lg font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Tabs defaultValue="all" className="w-full lg:w-auto" onValueChange={setActiveTab}>
                        <TabsList className="bg-slate-50 p-1.5 h-auto rounded-[1.5rem] flex flex-wrap lg:flex-nowrap">
                            {categories.map(cat => (
                                <TabsTrigger
                                    key={cat.value}
                                    value={cat.value}
                                    className="rounded-full px-6 py-3 font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg"
                                >
                                    <cat.icon className="h-4 w-4 mr-2" />
                                    {cat.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Reports Grid */}
                {filteredReports && filteredReports.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredReports.map((report) => (
                            <div
                                key={report.id}
                                className="group bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-700 flex flex-col"
                            >
                                {/* Visual Cover Area */}
                                <div className="h-64 bg-slate-900 relative overflow-hidden flex items-center justify-center p-12 text-center group-hover:bg-primary transition-colors duration-700">
                                    {report.image_url ? (
                                        <img src={report.image_url} alt={report.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-primary group-hover:to-primary-dark transition-all" />
                                    )}
                                    <div className="relative z-10 space-y-4">
                                        <div className="h-20 w-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg mx-auto flex items-end justify-center p-2 shadow-2xl">
                                            <div className="w-full h-2 bg-white/40 rounded-full mb-2" />
                                        </div>
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px]">
                                            {report.year || "PUBLICATION"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-10 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                            {report.category.replace('_', ' ')}
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            REF: {report.id.slice(0, 6).toUpperCase()}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 group-hover:text-primary transition-colors leading-tight">
                                        {report.title}
                                    </h3>

                                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-1">
                                        {report.description || "This official document provides comprehensive data, analysis, and insights regarding institutional performance and regional development."}
                                    </p>

                                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <a
                                            href={report.file_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full"
                                        >
                                            <Button className="w-full rounded-2xl h-16 font-black uppercase tracking-widest text-xs gap-3 group-hover:scale-[1.02] transition-transform">
                                                <Download className="h-4 w-4" />
                                                Download Document
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
                        <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto text-slate-300 mb-8">
                            <FileDown className="h-12 w-12" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Archives Empty</h2>
                        <p className="text-slate-500 font-medium max-w-md mx-auto mt-2 italic px-8">
                            We couldn't find any published reports matching your current search or category selection.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
