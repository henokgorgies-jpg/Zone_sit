import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, FileDown, Loader2, BarChart3, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

type Report = {
    id: string;
    title: string;
    category: "annual_report" | "research_stat" | "strategic_plan" | "other";
    status: "draft" | "published" | "archived";
    year: number | null;
    file_url: string;
    created_at: string;
};

export default function ReportsList() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const fetchReports = async () => {
        try {
            const { data, error } = await supabase
                .from("reports" as any)
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setReports((data as any) || []);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from("reports" as any).delete().eq("id", id);
            if (error) throw error;
            setReports(reports.filter((r) => r.id !== id));
            toast({ title: "Deleted", description: "Report deleted successfully." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const filteredReports = reports.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Live</Badge>;
            case "draft":
                return <Badge variant="secondary">Draft</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case "annual_report":
                return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Annual Report</Badge>;
            case "research_stat":
                return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">Research Stat</Badge>;
            default:
                return <Badge variant="outline">{category.replace('_', ' ')}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Reports & Statistics</h1>
                    <p className="text-muted-foreground mt-1">Manage institutional publications and research data documents.</p>
                </div>
                <Link to="/admin/reports/new">
                    <Button className="gap-2 rounded-full font-bold uppercase tracking-widest text-xs px-6 py-5">
                        <Plus className="h-4 w-4" />
                        Add Report
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search reports..."
                        className="pl-10 h-10 border-2 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold text-slate-900">Publication</TableHead>
                            <TableHead className="font-bold text-slate-900">Category</TableHead>
                            <TableHead className="font-bold text-slate-900">Year</TableHead>
                            <TableHead className="font-bold text-slate-900">Status</TableHead>
                            <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">
                                    No reports found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReports.map((report) => (
                                <TableRow key={report.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <FileText className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{report.title}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    Added: {new Date(report.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getCategoryBadge(report.category)}</TableCell>
                                    <TableCell>
                                        <span className="font-bold text-slate-700">{report.year || "N/A"}</span>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a href={report.file_url} target="_blank" rel="noreferrer">
                                                <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-50">
                                                    <FileDown className="h-4 w-4" />
                                                </Button>
                                            </a>
                                            <Link to={`/admin/reports/${report.id}`}>
                                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-2xl border-2">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter">Delete Publication</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-slate-500 font-medium">
                                                            Are you sure you want to delete this report? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-full font-bold">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(report.id)} className="bg-destructive text-white hover:bg-destructive/90 rounded-full font-bold">
                                                            Confirm Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
