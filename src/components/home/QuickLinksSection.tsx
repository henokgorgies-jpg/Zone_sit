import { Link } from "react-router-dom";
import { FileText, Download, Phone, HelpCircle, ExternalLink, Zap, MousePointer2, Settings, Terminal, Activity, ShieldCheck, Box } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const quickLinks = [
  {
    icon: FileText,
    title: "Forms & Applications",
    description: "Download official forms and application templates",
    href: "/documents",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    id: "DATA_NODE_01"
  },
  {
    icon: Download,
    title: "Public Documents",
    description: "Access reports, policies, and public records",
    href: "/documents",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    id: "DATA_NODE_02"
  },
  {
    icon: Phone,
    title: "Contact Directory",
    description: "Find contact information for all departments",
    href: "/contact",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    id: "COMM_NODE_01"
  },
  {
    icon: HelpCircle,
    title: "Help & FAQs",
    description: "Get answers to frequently asked questions",
    href: "/page/faqs",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    id: "INFO_NODE_01"
  },
];

export function QuickLinksSection() {
  const { t } = useTranslation();

  return (
    <section className="py-32 bg-background relative overflow-hidden border-t border-white/5">
      <div className="tech-orb bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] -translate-x-1/2 translate-y-1/2 opacity-30" />
      <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
      
      <div className="gov-container relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
          <div className="space-y-6 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-secondary text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(var(--secondary),0.1)]">
               <Settings className="h-4 w-4 animate-spin-slow" /> SYSTEM_SHORTCUTS_v3.2
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
              {t('home.quickLinks')}
            </h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-2 border-secondary/40 pl-6">
              "Streamlining regional resource access via high-speed digital acceleration nodes."
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-xl">
             <Activity className="h-4 w-4 text-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/60">ACCESS GRID STATUS :</span>
             <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[9px] uppercase tracking-widest animate-pulse">Online</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                to={link.href}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[3.5rem] blur-2xl" />
                <div className="relative h-full glass-card p-10 rounded-[3.5rem] border-white/5 hover:border-white/20 transition-all duration-700 flex flex-col group/card hover:-translate-y-4 bg-gradient-to-br from-white/5 via-transparent to-transparent shadow-2xl">
                  
                  {/* Decorative ID */}
                  <div className="absolute top-8 right-8 text-[9px] font-mono text-white/10 group-hover:text-white/30 transition-colors uppercase tracking-[0.2em]">
                    {link.id}
                  </div>

                  <div className="flex items-start justify-between mb-12">
                    <div className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-[1.5rem] border transition-all duration-700 group-hover/card:scale-110 shadow-inner group-hover:border-white/20",
                      link.color
                    )}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight group-hover/card:text-secondary group-hover/card:text-glow transition-all">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-70 italic">
                      "{link.description}"
                    </p>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-secondary group-hover/card:gap-4 transition-all duration-500">
                       ACCESS_ENTRY_PT
                    </div>
                    <div className="h-10 w-10 glass rounded-xl flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-500 border border-white/10 group-hover:bg-secondary group-hover:text-background shadow-lg">
                        <Terminal className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Cyber Hardware Corners */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/5 rounded-tl-[2rem] group-hover:border-secondary/30 transition-all" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/5 rounded-br-[2rem] group-hover:border-secondary/30 transition-all" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
