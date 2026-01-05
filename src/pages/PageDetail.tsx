import { Loader2, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BlockRenderer from "@/components/admin/PageBuilder/BlockRenderer";

const PageDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["page-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="gov-section">
        <div className="gov-container flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="gov-section">
        <div className="gov-container text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b py-16 sm:py-24 mb-12">
        <div className="gov-container max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-8 hover:translate-x-1 transition-transform">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-6 uppercase">{page.title}</h1>
          <div className="h-2 w-24 bg-primary rounded-full mb-8" />
          <p className="text-xl text-slate-500 font-medium max-w-3xl leading-relaxed">
            Official resource and information portal for {page.title}.
          </p>
        </div>
      </div>

      <div className="gov-container max-w-5xl pb-32">
        {page.content && page.content !== "[]" ? (
          <BlockRenderer content={page.content} />
        ) : (
          <div className="p-16 sm:p-24 rounded-[3rem] bg-white border-2 border-dashed border-slate-200 text-center space-y-8 shadow-inner animate-pulse-slow">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Information Staging</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto">
                We are currently updating this section with the latest data, documents, and interactive resources. Please check back shortly.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="rounded-full px-8 py-6 h-auto font-bold">Notify Me</Button>
              <Link to="/contact">
                <Button className="rounded-full px-8 py-6 h-auto font-bold shadow-xl">Contact Support</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageDetail;
