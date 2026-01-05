import { Link } from "react-router-dom";
import { ArrowRight, Loader2, FileCheck, LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ServicesSection() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services-featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .limit(6);
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
    <section className="gov-section bg-muted">
      <div className="gov-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access a wide range of government services designed to serve you better.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="group gov-card p-6 hover:border-accent transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-accent gap-1 group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services available yet. Check back soon!</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/services">
            <Button size="lg" className="gap-2">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
