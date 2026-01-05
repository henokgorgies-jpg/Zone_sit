import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const Documents = () => {
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

  return (
    <div className="gov-section">
      <div className="gov-container">
        <h1 className="text-4xl font-bold mb-4">Documents & Forms</h1>
        <p className="text-muted-foreground mb-8">Download official documents, forms, and public records.</p>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="gov-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="h-5 w-5 text-accent shrink-0" />
                  <div className="min-w-0">
                    <span className="font-medium block truncate">{doc.title}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {doc.category && <Badge variant="secondary" className="text-xs">{doc.category}</Badge>}
                      {doc.file_type && <span className="uppercase">{doc.file_type}</span>}
                      {doc.file_size && <span>{formatFileSize(doc.file_size)}</span>}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 shrink-0"
                  onClick={() => window.open(doc.file_url, "_blank")}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No documents available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
