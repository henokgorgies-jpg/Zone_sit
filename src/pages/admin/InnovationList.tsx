import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lightbulb, Trash2, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InnovationList() {
  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ["admin-innovation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("innovation_projects" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await (supabase as any)
      .from("innovation_projects")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Project marked as ${status}`);
      refetch();
    }
  };

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Innovation Hub</h1>
          <p className="text-muted-foreground">Manage ongoing youth innovation projects and ideas.</p>
        </div>
        <Button className="gap-2">
            <Lightbulb className="h-4 w-4" /> New Project Item
        </Button>
      </div>

      <div className="grid gap-6">
        {projects?.map((prj) => (
          <Card key={prj.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-cyan-600" />
                {prj.title}
              </CardTitle>
              <Badge variant={prj.status === 'completed' ? 'default' : 'secondary'}>
                {prj.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p>{prj.description}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Innovator Information</p>
                  <p>{prj.innovator_name}</p>
                  <p className="text-xs text-muted-foreground">Submitted on: {new Date(prj.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                {prj.status === 'pending' && (
                  <Button size="sm" onClick={() => updateStatus(prj.id, 'active')}>
                    <CheckCircle className="h-4 w-4 mr-1" /> Mark Active
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects?.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
            <p className="text-muted-foreground">No innovation projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
