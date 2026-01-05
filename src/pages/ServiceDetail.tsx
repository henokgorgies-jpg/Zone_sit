import { Loader2, ArrowLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon, FileCheck } from "lucide-react";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["service-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return FileCheck;
    const icons = LucideIcons as unknown as Record<string, LucideIcon>;
    return icons[iconName] || FileCheck;
  };

  if (isLoading) {
    return (
      <div className="gov-section">
        <div className="gov-container flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="gov-section">
        <div className="gov-container text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = getIcon(service.icon);

  return (
    <div className="gov-section">
      <div className="gov-container max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/services">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>
        </Button>

        <article>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{service.title}</h1>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            {service.description}
          </p>

          {service.content && (
            <div className="prose prose-lg max-w-none">
              {service.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default ServiceDetail;
