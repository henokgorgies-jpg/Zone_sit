import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { QuickLinksSection } from "@/components/home/QuickLinksSection";
import { CEOMessageSection } from "@/components/home/CEOMessageSection";
import { TendersSection } from "@/components/home/TendersSection";
import { AlertCircle, ArrowRight, Bell, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Emergency / High Importance Notice */}
      <div className="bg-amber-500 text-white py-3 px-4 relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/5 animate-pulse" />
        <div className="gov-container flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <Bell className="h-3 w-3" />
            </div>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest leading-none">
              <span className="hidden sm:inline">Notice: </span>
              The new digital citizen portal is now live. Please register for e-services.
            </p>
          </div>
          <Link to="/page/e-portal" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter hover:bg-white/10 px-3 py-1.5 rounded-full transition-all">
            Read More <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <HeroSection />

      {/* Quick Service Dashboard for Home */}
      <div className="bg-white py-20 border-b">
        <div className="gov-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Fast <br /> Gateway</h2>
              <div className="h-1.5 w-12 bg-primary rounded-full" />
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Most frequently used services and institutional access points for citizens.</p>
            </div>
            <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Find Jobs", icon: "Briefcase", href: "/tenders" },
                { label: "Pay Taxes", icon: "CreditCard", href: "/page/e-portal" },
                { label: "Get Permits", icon: "FileCheck", href: "/services" },
                { label: "Reports & Stats", icon: "TrendingUp", href: "/reports" },
              ].map((item, i) => (
                <Link key={i} to={item.href} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200 hover:border-primary hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                  <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest">{item.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CEOMessageSection />

      <ServicesSection />
      <TendersSection />
      <NewsSection />
      <QuickLinksSection />

      {/* Institutional Overview for Home */}
      <div className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-40 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="gov-container relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="h-1 w-20 bg-primary rounded-full" />
            <h2 className="text-5xl font-black tracking-tight leading-none uppercase">Empowering <br /> The Community</h2>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              Our institution is dedicated to building a sustainable future through transparent governance, innovative public infrastructure, and citizen-first initiatives.
            </p>
            <Link to="/about">
              <Button size="lg" className="rounded-full px-10 py-7 h-auto text-lg font-bold shadow-2xl">Discover Our Story</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-800 p-8 flex flex-col justify-end group cursor-pointer hover:bg-primary transition-colors duration-500">
              <p className="text-4xl font-black mb-2 tracking-tighter">70+</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Years of History</p>
            </div>
            <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-800 p-8 flex flex-col justify-end mt-12 group cursor-pointer hover:bg-primary transition-colors duration-500">
              <p className="text-4xl font-black mb-2 tracking-tighter">100%</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Transparency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
