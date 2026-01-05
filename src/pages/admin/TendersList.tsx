import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Calendar, Loader2, Briefcase, FileText } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Tender = {
    id: string;
    title: string;
    type: "tender" | "vacancy";
    status: "draft" | "published" | "archived";
    deadline: string | null;
    created_at: string;
};

export default function TendersList() {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchTenders = async () => {
        try {
            const { data, error } = await supabase
                .from("tenders" as any)
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTenders((data as any) || []);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenders();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from("tenders" as any).delete().eq("id", id);
            if (error) throw error;
            setTenders(tenders.filter((t) => t.id !== id));
            toast({ title: "Deleted", description: "Entry deleted successfully." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
            case "draft":
                return <Badge variant="secondary">Draft</Badge>;
            case "archived":
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        return type === "vacancy" ? (
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                <Briefcase className="h-3 w-3 mr-1" /> Vacancy
            </Badge>
        ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                <FileText className="h-3 w-3 mr-1" /> Tender
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Tenders & Hiring</h1>
                    <p className="text-muted-foreground">Manage procurement notices and job openings</p>
                </div>
                <Link to="/admin/tenders/new">
                    <Button className="gap-2 rounded-full font-bold uppercase tracking-widest text-xs px-6 py-5">
                        <Plus className="h-4 w-4" />
                        Add Notice
                    </Button>
                </Link>
            </div>

            {tenders.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-2xl border-2 border-dashed">
                    <p className="text-muted-foreground mb-4">No notices published yet.</p>
                    <Link to="/admin/tenders/new">
                        <Button variant="outline" className="rounded-full">Create your first notice</Button>
                    </Link>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-900">Title</TableHead>
                                <TableHead className="font-bold text-slate-900">Type</TableHead>
                                <TableHead className="font-bold text-slate-900">Status</TableHead>
                                <TableHead className="font-bold text-slate-900">Deadline</TableHead>
                                <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tenders.map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <p className="font-bold text-slate-900">{item.title}</p>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                                            Posted: {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </TableCell>
                                    <TableCell>{getTypeBadge(item.type)}</TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell>
                                        {item.deadline ? (
                                            <span className={cn(
                                                "text-sm font-medium flex items-center gap-1",
                                                new Date(item.deadline) < new Date() ? "text-red-500" : "text-slate-600"
                                            )}>
                                                <Calendar className="h-3 w-3" />
                                                {new Date(item.deadline).toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-300">No Deadline</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/tenders/${item.id}`}>
                                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-2xl border-2">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter">Delete Notice</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-slate-500 font-medium">
                                                            Are you sure you want to delete "{item.title}"? This will permanently remove it from the public portal.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-full font-bold">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full font-bold">
                                                            Delete PERMANENTLY
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
                </div>
            )}
        </div>
    );
}

// Minimal cn implementation for standalone file if needed, or import from lib
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
