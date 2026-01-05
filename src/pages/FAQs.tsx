
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, HelpCircle, Search, ChevronRight, BookOpen, MessageSquare } from "lucide-react";
import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type FAQ = {
    id: string;
    question: string;
    answer: string;
    category: string;
};

const FAQs = () => {
    const [search, setSearch] = useState("");

    const { data: faqs, isLoading } = useQuery({
        queryKey: ["faqs-public"],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from("faqs")
                .select("*")
                .eq("status", "published")
                .order("sort_order", { ascending: true });
            if (error) throw error;
            return data as FAQ[];
        },
    });

    const categories = Array.from(new Set(faqs?.map(f => f.category) || ["General"]));

    const filteredFaqs = faqs?.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b py-16 sm:py-24 mb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.02] -skew-y-6 origin-top-left" />
                <div className="gov-container max-w-4xl relative">
                    <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                        <HelpCircle className="h-4 w-4" /> Help Center
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-6 uppercase">Help & FAQs</h1>
                    <div className="h-2 w-24 bg-primary rounded-full mb-8" />
                    <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Find answers to frequently asked questions about our services, policies, and digital platform features.
                    </p>

                    <div className="mt-12 relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search for help topics, keywords, or questions..."
                            className="h-16 pl-12 rounded-2xl border-none bg-slate-100 focus-visible:ring-primary text-lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="gov-container max-w-4xl pb-32">
                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : filteredFaqs && filteredFaqs.length > 0 ? (
                    <div className="space-y-12">
                        {categories.map(cat => {
                            const catFaqs = filteredFaqs.filter(f => f.category === cat);
                            if (catFaqs.length === 0) return null;

                            return (
                                <div key={cat} className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-1 bg-primary rounded-full" />
                                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">{cat}</h2>
                                    </div>

                                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border overflow-hidden">
                                        <Accordion type="single" collapsible className="w-full">
                                            {catFaqs.map((faq) => (
                                                <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0 px-8 py-2">
                                                    <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-primary transition-colors py-4">
                                                        {faq.question}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-slate-500 text-base leading-relaxed pb-6">
                                                        {faq.answer}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 space-y-6">
                        <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                            <Search className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-tight">No results found</h2>
                            <p className="text-slate-500 font-medium">We couldn't find any FAQs matching "{search}".</p>
                        </div>
                        <Button variant="outline" onClick={() => setSearch("")} className="rounded-full px-8">Clear Search</Button>
                    </div>
                )}

                {/* Support Section */}
                <div className="mt-24 p-8 sm:p-12 rounded-[3rem] bg-brand-900 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/30 transition-colors" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 text-center md:text-left">
                            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight">Still need help?</h2>
                            <p className="text-white/70 font-medium max-w-md">Our support team is ready to assist you with any further questions or specific issues.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link to="/page/engagement">
                                <Button className="w-full bg-white text-brand-900 hover:bg-slate-100 font-black uppercase tracking-widest rounded-full h-14 px-8 border-none">
                                    Submit Request
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest rounded-full h-14 px-8">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQs;
