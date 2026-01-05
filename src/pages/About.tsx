import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Building2, Target, Users, History, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface AboutContent {
  mission: string;
  vision: string;
  values: string;
  managerName: string;
  managerTitle: string;
  managerMessage: string;
  managerPhotoUrl: string;
  managerJobDescription: string;
}

const defaultContent: AboutContent = {
  mission: "Our mission is to empower every citizen through innovation, transparency, and high-quality essential public services.",
  vision: "To become a global model for digital government excellence and citizen-centric governance by 2030.",
  values: "We are anchored by Integrity, Excellence, Accountability, and a relentless passion for public service.",
  managerName: "John Doe",
  managerTitle: "Director General",
  managerMessage: "Welcome to our portal. We are committed to serving you with excellence.",
  managerPhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
  managerJobDescription: "Responsible for over-all strategic direction and digital transformation initiatives."
};

const About = () => {
  const { data: page, isLoading } = useQuery({
    queryKey: ["page-about"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "about")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  let content: AboutContent = defaultContent;
  if (page?.content) {
    try {
      const parsed = typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
      // If it's an array (old block builder format), we skip it and use default, 
      // or we can handle it. But the user specifically wants the text fields now.
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        content = { ...defaultContent, ...parsed };
      }
    } catch (e) {
      console.error("Error parsing about content", e);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-primary text-white py-24">
        <div className="gov-container">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-white transition-colors">
            <ArrowLeft className="h-3 w-3" /> Return to Gateway
          </Link>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 uppercase">ABOUT US</h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/80 max-w-4xl font-medium leading-relaxed">
            Our institution is built on a legacy of trust and a vision for a digital-first future.
          </p>
        </div>
      </div>

      <div className="gov-container -mt-12">
        {/* Core Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: Target, title: "Our Mission", desc: content.mission },
            { icon: Building2, title: "Our Vision", desc: content.vision },
            { icon: Users, title: "Our Values", desc: content.values },
          ].map((item) => (
            <Card key={item.title} className="p-10 border-none shadow-xl rounded-[2.5rem] bg-white text-center hover:scale-105 transition-all duration-500">
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-8 shadow-inner">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-wider">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Institutional Leadership Managed Profile */}
        <div className="grid lg:grid-cols-2 gap-16 items-center bg-white rounded-[3.5rem] p-8 sm:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[3/4] rounded-[2.5rem] overflow-hidden group shadow-2xl">
            <img
              src={content.managerPhotoUrl}
              alt={content.managerName}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-2xl font-black tracking-tight">{content.managerName}</p>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">{content.managerTitle}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
              <History className="h-3.5 w-3.5" /> Institutional Leadership
            </div>

            <div className="relative">
              <Quote className="absolute -top-6 -left-6 h-12 w-12 text-primary/10" />
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight italic">
                "{content.managerMessage}"
              </h2>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-black uppercase tracking-tight text-slate-900">Current Mandate & Role</h4>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {content.managerJobDescription}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-none">Office of the {content.managerTitle}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium italic">Leading the digital-first administration initiative.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;


