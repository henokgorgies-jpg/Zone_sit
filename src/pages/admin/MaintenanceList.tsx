import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Wrench, Trash2, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MaintenanceList() {
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ["admin-maintenance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_requests" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await (supabase as any)
      .from("maintenance_requests")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Request marked as ${status}`);
      refetch();
    }
  };

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Center</h1>
          <p className="text-muted-foreground">Manage electronic equipment maintenance requests.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {requests?.map((req) => (
          <Card key={req.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Wrench className="h-5 w-5 text-indigo-600" />
                {req.equipment_type}
              </CardTitle>
              <Badge variant={req.status === 'completed' ? 'default' : 'secondary'}>
                {req.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issue Description</p>
                  <p>{req.issue_description}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                  <p>{req.contact_person} ({req.phone_number})</p>
                  <p className="text-xs text-muted-foreground">Requested on: {new Date(req.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                {req.status === 'pending' && (
                  <Button size="sm" onClick={() => updateStatus(req.id, 'completed')}>
                    <CheckCircle className="h-4 w-4 mr-1" /> Mark Fixed
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {requests?.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
            <p className="text-muted-foreground">No maintenance requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
