import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Loader2, Building2, Search, Users, ShieldCheck } from "lucide-react";
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

type Department = {
    id: string;
    name: string;
    head_name: string;
    head_role: string;
    members_count: number;
    status: string;
    created_at: string;
};

export default function DepartmentsList() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const fetchDepartments = async () => {
        try {
            const { data, error } = await supabase
                .from("departments" as any)
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;
            setDepartments((data as any) || []);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from("departments" as any).delete().eq("id", id);
            if (error) throw error;
            setDepartments(departments.filter((d) => d.id !== id));
            toast({ title: "Deleted", description: "Department removed successfully." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const filteredDepartments = departments.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.head_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Departments & Offices</h1>
                    <p className="text-muted-foreground mt-1">Manage institutional departments, their heads, and responsibilities.</p>
                </div>
                <Link to="/admin/departments/new">
                    <Button className="gap-2 rounded-full font-bold uppercase tracking-widest text-xs px-6 py-5">
                        <Plus className="h-4 w-4" />
                        Add Department
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by department or head..."
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
                            <TableHead className="font-bold text-slate-900">Department Name</TableHead>
                            <TableHead className="font-bold text-slate-900">Head of Office</TableHead>
                            <TableHead className="font-bold text-slate-900 text-center">Staff Count</TableHead>
                            <TableHead className="font-bold text-slate-900">Status</TableHead>
                            <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDepartments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">
                                    No departments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDepartments.map((dept) => (
                                <TableRow key={dept.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <Building2 className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <span className="font-bold text-slate-900">{dept.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-slate-700">{dept.head_name || "Unassigned"}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{dept.head_role || "HOD"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="gap-1.5 font-bold">
                                            <Users className="h-3 w-3" /> {dept.members_count || 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {dept.status === "published" ? (
                                            <Badge className="bg-green-100 text-green-800 border-none">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Draft</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/departments/${dept.id}`}>
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
                                                        <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter">Delete Department</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-slate-500 font-medium">
                                                            Are you sure? This will remove the department's public office profile.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-full font-bold">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(dept.id)} className="bg-destructive text-white hover:bg-destructive/90 rounded-full font-bold">
                                                            Delete
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
