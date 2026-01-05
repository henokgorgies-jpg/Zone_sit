import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, ExternalLink, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PagesList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const slugFilter = searchParams.get("slug");

  const { data: pages, isLoading } = useQuery({
    queryKey: ["admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredPages = slugFilter && pages
    ? pages.filter(p => p.slug === slugFilter)
    : pages;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
      toast({ title: "Page deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting page", description: error.message, variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Pages
            {slugFilter && (
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 flex items-center gap-2">
                Filter: {slugFilter}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => setSearchParams({})}
                />
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Manage custom pages for your website</p>
        </div>
        <Button asChild>
          <Link to="/admin/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Page
          </Link>
        </Button>
      </div>

      {filteredPages && filteredPages.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>In Nav</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium text-lg">{page.title}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-bold uppercase tracking-wider text-muted-foreground">/{page.slug}</code>
                </TableCell>
                <TableCell>{getStatusBadge(page.status)}</TableCell>
                <TableCell>{page.show_in_nav ? "Yes" : "No"}</TableCell>
                <TableCell>{page.sort_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {page.status === "published" && (
                      <Button variant="outline" size="icon" asChild className="rounded-full shadow-sm">
                        <Link to={`/page/${page.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="secondary" size="icon" asChild className="rounded-full shadow-sm">
                      <Link to={`/admin/pages/${page.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2.5rem]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Page</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{page.title}"? This action cannot be undone and will remove it from the public gateway.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(page.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                          >
                            Delete Permanently
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-[3rem] bg-slate-50/50">
          <p className="text-muted-foreground mb-6 font-medium">No pages found matching this filter.</p>
          <Button onClick={() => setSearchParams({})} variant="outline" className="rounded-full">
            View All Pages
          </Button>
        </div>
      )}
    </div>
  );
};

export default PagesList;
