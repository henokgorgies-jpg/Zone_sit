import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2, Users, UserCircle, ShieldCheck, ArrowRight, MapPin, Briefcase } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Departments = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: departments, isLoading } = useQuery({
        queryKey: ["public-departments"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("departments" as any)
                .select("*")
                .eq("status", "published")
                .order("name", { ascending: true });
            if (error) throw error;
            return data as any[];
        },
    });

    const filteredDepts = departments?.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.responsibilities && d.responsibilities.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
                <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-50" />
                <div className="gov-container relative">
                    <div className="max-w-4xl text-center md:text-left">
                        <span className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-6 block">Institutional Wings</span>
                        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-8 uppercase text-slate-900">
                            Departments & <span className="text-primary font-outline-2">Offices</span>
                        </h1>
                        <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Explore our organizational bureaus and their mandates in delivering efficient public services.
                        </p>
                    </div>
                </div>
            </div>

            <div className="gov-container -mt-10 relative z-10">
                {/* Search Bar */}
                <div className="bg-white p-4 sm:p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 max-w-2xl mb-20 flex items-center">
                    <Input
                        placeholder="Search by department name or keyword..."
                        className="flex-1 h-14 border-none bg-transparent shadow-none focus-visible:ring-0 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs">Search</Button>
                </div>

                {/* Departments Grid */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {filteredDepts?.map((dept) => (
                        <div
                            key={dept.id}
                            className="group bg-white rounded-[4rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-700 flex flex-col sm:flex-row"
                        >
                            {/* Visual Sidebar */}
                            <div className="sm:w-1/3 bg-slate-100 relative overflow-hidden flex flex-col pt-12 items-center">
                                {dept.image_url ? (
                                    <img src={dept.image_url} alt={dept.name} className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
                                )}

                                <div className="relative z-10 bg-white/90 backdrop-blur pb-6 pt-10 px-6 rounded-t-[3rem] w-[80%] mt-auto border-t border-x border-white">
                                    <div className="h-20 w-20 rounded-2xl bg-slate-900 mx-auto -mt-20 flex items-center justify-center text-white shadow-2xl overflow-hidden border-4 border-white mb-4">
                                        {dept.head_image_url ? (
                                            <img src={dept.head_image_url} alt={dept.head_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle className="h-10 w-10 text-slate-500" />
                                        )}
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Office Head</p>
                                        <p className="text-xs font-black text-slate-900 line-clamp-1">{dept.head_name || "N/A"}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{dept.head_role || "HOD"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Information */}
                            <div className="p-10 sm:p-12 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <Badge variant="outline" className="rounded-full px-4 py-1.5 font-black uppercase tracking-widest text-[9px] bg-slate-50">{dept.id.slice(0, 6)}</Badge>
                                </div>

                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6 group-hover:text-primary transition-colors leading-tight">
                                    {dept.name}
                                </h3>

                                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10 flex-1">
                                    {dept.responsibilities || "Providing high-quality institutional services and fulfilling the mandate of the government with transparency and excellence."}
                                </p>

                                {/* Team & Members Strip */}
                                {dept.members_list && dept.members_list.length > 0 && (
                                    <div className="space-y-4 mb-10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Team / Units</p>
                                        <div className="flex flex-wrap gap-2">
                                            {dept.members_list.slice(0, 4).map((m: string, i: number) => (
                                                <Badge key={i} className="bg-slate-50 text-slate-600 border-slate-100 py-1.5 px-3 rounded-lg font-bold text-[10px]">
                                                    {m}
                                                </Badge>
                                            ))}
                                            {dept.members_list.length > 4 && (
                                                <Badge variant="outline" className="border-dashed border-2 text-[10px] font-bold">+{dept.members_list.length - 4}</Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Users className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{dept.members_count || 0} Staff Members</span>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDepts?.length === 0 && (
                    <div className="text-center py-32">
                        <p className="text-2xl font-black text-slate-300 uppercase tracking-widest">No matching departments found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Departments;
