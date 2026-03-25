import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Loader2, Printer, Send, MessageSquare, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: ""
  });

  const { data: contactInfo, isLoading } = useQuery({
    queryKey: ["contact-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from("contact_inquiries")
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Transmission Complete",
        description: "Your inquiry has been successfully queued for administrative review.",
      });
      setFormData({ full_name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Transmission Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.message) {
      toast({ title: "Validation Error", description: "Missing critical parameters.", variant: "destructive" });
      return;
    }
    mutation.mutate(formData);
  };

  const contactItems = [
    { icon: MapPin, label: "Institutional Address", value: contactInfo?.address || "Wolkite, Gurage Zone, Ethiopia", color: "text-blue-400" },
    { icon: Phone, label: "Secure Line", value: contactInfo?.phone || "+251 11 XXX XXXX", color: "text-emerald-400" },
    { icon: Mail, label: "Broadcast Email", value: contactInfo?.email || "info@gzsit.gov.et", color: "text-purple-400" },
    { icon: Clock, label: "Operation Window", value: contactInfo?.office_hours || "Mon-Fri: 08:30 - 17:30", color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="tech-orb top-0 -right-20 w-[600px] h-[600px] bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="tech-orb bottom-0 -left-20 w-[600px] h-[600px] bg-secondary/10 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-1 pointer-events-none" />

      {/* Hero Header */}
      <div className="pt-32 pb-24 relative z-10 border-b border-white/5">
        <div className="gov-container">
          <div className="max-w-4xl space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-secondary text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(var(--secondary),0.2)]">
              <MessageSquare className="h-4 w-4 text-secondary fill-secondary animate-pulse" />
              SIT Unified Communication Node v4.0
            </div>
            <h1 className="text-6xl sm:text-8xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
                CONTACT <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">OUR REGIONAL HQ</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                Initialize secure communication protocols with our regional technical support units and administrative offices.
            </p>
          </div>
        </div>
      </div>

      <div className="gov-container py-24 relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Info Panel */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-10">
                <div className="grid sm:grid-cols-2 xl:grid-cols-1 gap-6">
                    {contactItems.map((item, i) => (
                        <div key={i} className="group flex items-center gap-6 p-8 rounded-[2.5rem] glass border-white/10 hover:border-white/20 transition-all duration-700 hover:translate-x-2 bg-gradient-to-br from-white/5 to-transparent">
                            <div className={cn("h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500", item.color)}>
                                <item.icon className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                                <p className="text-lg font-bold text-white tracking-tight leading-tight">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map Interface */}
                <div className="relative group p-1 glass-card rounded-[3.5rem] border-white/10 overflow-hidden h-[450px] shadow-2xl">
                     {contactInfo?.map_embed_url ? (
                        <iframe
                            src={contactInfo.map_embed_url}
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.9)" }}
                            allowFullScreen
                            loading="lazy"
                            title="Office Location"
                        />
                     ) : (
                        <div className="w-full h-full bg-slate-900/50 flex flex-col items-center justify-center p-12 text-center space-y-6 relative overflow-hidden">
                             <div className="absolute inset-0 bg-mesh opacity-10 animate-pulse" />
                             <MapPin className="h-16 w-16 text-white/10 animate-bounce" />
                             <div className="space-y-2">
                                <p className="text-sm font-black uppercase tracking-widest text-white">Geospatial data pending update</p>
                                <p className="text-xs text-muted-foreground font-medium italic opacity-60">HQ location currently mapping to Butajira Administrative Hub.</p>
                             </div>
                        </div>
                     )}
                     <div className="absolute top-8 left-8">
                        <Badge className="bg-secondary text-background font-black border-none uppercase text-[9px] tracking-widest px-4 py-1 animate-pulse shadow-lg">Live Navigation Protocol</Badge>
                     </div>
                </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-12 xl:col-span-7">
                <div className="glass-card p-8 sm:p-16 rounded-[4rem] border-white/10 bg-gradient-to-br from-white/5 via-transparent to-primary/5 space-y-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 p-40 bg-primary/10 blur-3xl rounded-full opacity-30 pointer-events-none" />
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-secondary rounded-full" />
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Initialize Inquiry</h2>
                        </div>
                        <p className="text-lg text-muted-foreground font-medium max-w-lg leading-relaxed">
                            Specify your technical classification and message parameters for processing through our regional units.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-6">Innovator Name / Entity</label>
                                <Input 
                                  value={formData.full_name}
                                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                  className="bg-white/5 border-white/10 h-16 rounded-[1.5rem] px-8 focus:border-secondary focus:ring-secondary/20 transition-all font-medium text-white shadow-inner" 
                                  placeholder="IDENT_0x1" 
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-6">Secure Email Link</label>
                                <Input 
                                  type="email" 
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                  className="bg-white/5 border-white/10 h-16 rounded-[1.5rem] px-8 focus:border-secondary focus:ring-secondary/20 transition-all font-medium text-white shadow-inner" 
                                  placeholder="broadcast@hub.gz" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-6">Payload Classification (Subject)</label>
                            <Input 
                              value={formData.subject}
                              onChange={(e) => setFormData({...formData, subject: e.target.value})}
                              className="bg-white/5 border-white/10 h-16 rounded-[1.5rem] px-8 focus:border-secondary focus:ring-secondary/20 transition-all font-medium text-white shadow-inner" 
                              placeholder="Training_Protocol_Inquiry" 
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-6">Data Payload (Message)</label>
                            <Textarea 
                              value={formData.message}
                              onChange={(e) => setFormData({...formData, message: e.target.value})}
                              className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 focus:border-secondary focus:ring-secondary/20 transition-all font-medium text-white min-h-[220px] shadow-inner text-lg leading-relaxed" 
                              placeholder="Awaiting data input..." 
                            />
                        </div>

                        <Button 
                          type="submit" 
                          disabled={mutation.isPending}
                          className="w-full btn-tech rounded-[2.5rem] py-10 h-auto text-sm font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(var(--secondary),0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                             {mutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "TRANSMIT MESSAGE PROTOCOL"}
                             {!mutation.isPending && <Send className="ml-4 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                         <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>ALL SYSTEMS NOMINAL</span>
                         </div>
                         <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            <Sparkles className="h-4 w-4 text-secondary animate-pulse" /> 
                            <span>SIT-GZ ENCRYPTED CHANNEL</span>
                         </div>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
