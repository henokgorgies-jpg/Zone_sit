import { MapPin, Phone, Mail, Clock, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
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

  const contactItems = [
    { icon: MapPin, label: "Address", value: contactInfo?.address || "Address not configured" },
    { icon: Phone, label: "Phone", value: contactInfo?.phone || "Phone not configured" },
    { icon: Printer, label: "Fax", value: contactInfo?.fax, show: !!contactInfo?.fax },
    { icon: Mail, label: "Email", value: contactInfo?.email || "Email not configured" },
    { icon: Clock, label: "Office Hours", value: contactInfo?.office_hours || "Office hours not configured" },
  ].filter(item => item.show !== false);

  return (
    <div className="gov-section">
      <div className="gov-container">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Get in touch with us. We're here to help.</p>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
              
              {contactInfo?.map_embed_url && (
                <div className="mt-6">
                  <iframe
                    src={contactInfo.map_embed_url}
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: "0.5rem" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
            
            <div className="gov-card p-6">
              <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Your Email" />
                <Textarea placeholder="Your Message" rows={4} />
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
