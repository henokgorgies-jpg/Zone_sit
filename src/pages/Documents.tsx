import { FileText, Download, Loader2, Sparkles, Filter, Search, FileCode, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

function formatFileSize(bytes: number | null) {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const Documents = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const categories = [
    { id: "Manual", label: "Manuals", icon: BookOpen },
    { id: "Guideline", label: "Guidelines", icon: FileCode },
    { id: "Report", label: "Reports", icon: Layer },
    { id: "Resource", label: "Resources", icon: Sparkles },
  ];

  const filteredDocs = documents?.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="tech-orb top-0 -left-60 w-[800px] h-[800px] bg-primary/20 blur-[200px] pointer-events-none" />
      <div className="tech-orb bottom-0 -right-60 w-[800px] h-[800px] bg-secondary/15 blur-[200px] pointer-events-none" />
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-1 pointer-events-none" />

      {/* Hero Header & Search */}
      <div className="pt-32 pb-24 relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="gov-container">
          <div className="max-w-4xl space-y-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-secondary text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(var(--secondary),0.2)]">
              <Sparkles className="h-4 w-4 text-secondary fill-secondary animate-pulse" />
              SIT Unified Resource Repository v4.0
            </div>
            <h1 className="text-6xl sm:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
                RESOURCES & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                    DOWNLOAD GRID
                </span>
            </h1>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative group flex-1">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl opacity-20 blur group-hover:opacity-40 transition-opacity" />
                    <div className="relative flex items-center bg-white/5 border border-white/10 rounded-3xl p-2 pl-8 h-20">
                        <Search className="h-6 w-6 text-muted-foreground mr-4" />
                        <Input 
                          className="bg-transparent border-none focus-visible:ring-0 p-0 text-white font-medium text-lg h-full" 
                          placeholder="Search manual codes, guidelines, or regional reports..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gov-container py-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Filter Sidebar */}
            <div className="lg:col-span-3 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="h-4 w-1.5 bg-secondary rounded-full" />
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Protocol Type</h2>
                </div>
                
                <div className="space-y-4">
                    <Button 
                      onClick={() => setActiveCategory(null)}
                      variant={activeCategory === null ? "default" : "outline"}
                      className={cn(
                        "w-full rounded-2xl py-6 h-auto font-black uppercase tracking-widest text-[10px] justify-start px-6 transition-all duration-500",
                        activeCategory === null ? "bg-white text-background hover:bg-secondary" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      )}
                    >
                         <Layers className="h-4 w-4 mr-4" /> All Signals
                    </Button>
                    {categories.map((cat) => (
                        <Button 
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          variant={activeCategory === cat.id ? "default" : "outline"}
                          className={cn(
                             "w-full rounded-2xl py-6 h-auto font-black uppercase tracking-widest text-[10px] justify-start px-6 transition-all duration-500",
                             activeCategory === cat.id ? "bg-secondary text-background hover:bg-white" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                          )}
                        >
                             <cat.icon className="h-4 w-4 mr-4" /> {cat.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Document List */}
            <div className="lg:col-span-9">
                {isLoading ? (
                  <div className="flex justify-center py-24">
                    <Loader2 className="h-12 w-12 animate-spin text-secondary" />
                  </div>
                ) : filteredDocs && filteredDocs.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    {filteredDocs.map((doc, i) => (
                      <div key={doc.id} className="group relative" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[3rem] blur-3xl" />
                        <Card className="relative p-10 rounded-[3rem] glass-card border-white/5 hover:border-white/20 transition-all duration-500 h-full flex flex-col justify-between overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-all duration-700 translate-x-6 -translate-y-6">
                                <FileText className="h-28 w-28 text-white" />
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-700 group-hover:scale-110 group-hover:bg-primary/20">
                                        <FileText className="h-8 w-8 text-secondary" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none">Payload</p>
                                        <p className="text-sm font-bold text-white tracking-widest mt-1 bg-white/5 px-3 py-1 rounded-full">{formatFileSize(doc.file_size)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                     <div className="flex flex-wrap gap-2">
                                        {doc.category && <Badge className="bg-secondary text-background font-black uppercase tracking-[0.2em] text-[8px] border-none px-4 py-1.5 rounded-full">{doc.category}</Badge>}
                                        <Badge className="bg-white/5 text-muted-foreground font-black border-none uppercase text-[8px] tracking-[0.2em] px-4 py-1.5 rounded-full">Secure S-ID</Badge>
                                     </div>
                                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-secondary transition-all duration-500 line-clamp-2 leading-tight">
                                        {doc.title}
                                     </h3>
                                     <p className="text-sm text-muted-foreground font-medium leading-relaxed italic opacity-80 line-clamp-2">
                                        {doc.description || "No classification data provided for this protocol repository."}
                                     </p>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/5 mt-auto flex items-center justify-between">
                                <Button 
                                    className="w-full btn-tech rounded-[1.5rem] py-8 h-auto font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl gap-3 transition-all"
                                    onClick={() => window.open(doc.file_url, "_blank")}
                                >
                                    <Download className="h-5 w-5" /> Initialize Download
                                </Button>
                            </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-40 glass rounded-[4.5rem] border-white/10 border-dashed border-2">
                     <FileText className="h-24 w-24 text-white/5 mx-auto mb-8 animate-pulse" />
                     <p className="text-xl text-muted-foreground font-black uppercase tracking-widest italic opacity-50">Empty Protocol Repository <br /><span className="text-xs">No matching signals found on current frequency</span></p>
                  </div>
                )}
            </div>
        </div>

        {/* Global Repository Support */}
        <div className="mt-32 p-12 sm:p-20 rounded-[4.5rem] glass-card border-white/10 bg-gradient-to-br from-background via-white/5 to-background text-center">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Request Archival Access</h3>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto mb-10">Access restricted regional technical manuals and specialized innovation blueprints. Requires institutional clearance.</p>
            <Button variant="outline" className="rounded-full border-white/10 glass px-12 py-8 h-auto text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all">Request Security Clearance</Button>
        </div>
      </div>
    </div>
  );
};

export default Documents;
