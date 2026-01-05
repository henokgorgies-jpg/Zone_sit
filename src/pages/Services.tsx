import { Loader2, FileCheck } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

const Services = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return FileCheck;
    const icons = LucideIcons as unknown as Record<string, LucideIcon>;
    return icons[iconName] || FileCheck;
  };

  return (
    <div className="gov-section">
      <div className="gov-container">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-muted-foreground mb-8">Access a wide range of government services designed to serve you.</p>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <Link 
                  key={service.id} 
                  to={`/services/${service.slug}`}
                  className="gov-card p-6 hover:border-accent transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
