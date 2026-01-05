import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Loader2, Users, Search, Image as ImageIcon, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type Official = {
    id: string;
    name: string;
    role: string;
    category: string;
    image_url: string;
    rank: number;
    status: string;
    created_at: string;
};

export default function LeadershipList() {
    const [officials, setOfficials] = useState<Official[]>([]);
    const [loading, setLoading] = useState(true);
    const [orgChart, setOrgChart] = useState<{ image_url: string; description: string }>({ image_url: "", description: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            // Fetch Officials
            const { data: officialsData, error: officialsError } = await supabase
                .from("leadership" as any)
                .select("*")
                .order("rank", { ascending: true });

            if (officialsError) throw officialsError;
            setOfficials((officialsData as any) || []);

            // Fetch Org Chart from site_settings
            const { data: settingsData, error: settingsError } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "org_chart_data")
                .maybeSingle();

            if (settingsError) throw settingsError;
            if (settingsData?.value) {
                setOrgChart(JSON.parse(settingsData.value));
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from("leadership" as any).delete().eq("id", id);
            if (error) throw error;
            setOfficials(officials.filter((o) => o.id !== id));
            toast({ title: "Deleted", description: "Official removed successfully." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleUpdateOrgChart = async () => {
        try {
            const { error } = await supabase
                .from("site_settings")
                .upsert({ key: "org_chart_data", value: JSON.stringify(orgChart) });

            if (error) throw error;
            toast({ title: "Updated", description: "Organizational structure updated." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const filteredOfficials = officials.filter(o =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.role.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Leadership Hub</h1>
                    <p className="text-muted-foreground mt-1">Manage institutional officials and organizational structure.</p>
                </div>
                <Link to="/admin/leadership/new">
                    <Button className="gap-2 rounded-full font-bold uppercase tracking-widest text-xs px-6 py-5">
                        <Plus className="h-4 w-4" />
                        Add Official
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="officials" className="space-y-8">
                <TabsList className="bg-slate-100 p-1.5 h-auto rounded-2xl">
                    <TabsTrigger value="officials" className="rounded-xl px-8 py-3 font-bold uppercase tracking-widest text-[10px]">
                        <Users className="h-4 w-4 mr-2" /> Officials
                    </TabsTrigger>
                    <TabsTrigger value="structure" className="rounded-xl px-8 py-3 font-bold uppercase tracking-widest text-[10px]">
                        <Network className="h-4 w-4 mr-2" /> Org Structure
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="officials" className="space-y-6">
                    <div className="flex items-center gap-4 max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search officials..."
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
                                    <TableHead className="font-bold text-slate-900">Official</TableHead>
                                    <TableHead className="font-bold text-slate-900">Category</TableHead>
                                    <TableHead className="font-bold text-slate-900 text-center">Rank</TableHead>
                                    <TableHead className="font-bold text-slate-900">Status</TableHead>
                                    <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOfficials.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">
                                            No officials found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOfficials.map((official) => (
                                        <TableRow key={official.id} className="hover:bg-slate-50/50">
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden border">
                                                        {official.image_url ? (
                                                            <img src={official.image_url} alt={official.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ImageIcon className="h-4 w-4 text-slate-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{official.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{official.role}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-slate-50">{official.category}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-slate-600">{official.rank}</TableCell>
                                            <TableCell>
                                                {official.status === "published" ? (
                                                    <Badge className="bg-green-100 text-green-800 border-none">Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Hidden</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/admin/leadership/${official.id}`}>
                                                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
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
                                                                <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter">Remove Official</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-slate-500 font-medium">
                                                                    Are you sure you want to remove {official.name}? This will hide them from the public site.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="rounded-full font-bold">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(official.id)} className="bg-destructive text-white hover:bg-destructive/90 rounded-full font-bold">
                                                                    Confirm Remove
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
                </TabsContent>

                <TabsContent value="structure" className="space-y-6">
                    <div className="bg-white p-12 rounded-[3rem] border-2 shadow-sm space-y-8">
                        <h3 className="text-xl font-bold uppercase tracking-tight">Institutional Structure</h3>

                        <div className="grid gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Org Chart Image URL</label>
                                <div className="flex gap-4">
                                    <Input
                                        placeholder="https://example.com/org-chart.png"
                                        value={orgChart.image_url}
                                        onChange={(e) => setOrgChart({ ...orgChart, image_url: e.target.value })}
                                        className="h-14 border-2 rounded-2xl px-6 font-medium flex-1"
                                    />
                                    <Button onClick={handleUpdateOrgChart} className="h-14 rounded-2xl px-12 font-black uppercase tracking-widest text-[10px]">
                                        Save Structure
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Structure Description</label>
                                <textarea
                                    className="w-full min-h-[120px] p-6 rounded-2xl border-2 font-medium"
                                    placeholder="Describe the hierarchy or departments..."
                                    value={orgChart.description}
                                    onChange={(e) => setOrgChart({ ...orgChart, description: e.target.value })}
                                />
                            </div>

                            {orgChart.image_url && (
                                <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Preview:</p>
                                    <img src={orgChart.image_url} alt="Org Chart" className="max-w-full h-auto rounded-xl mx-auto shadow-xl" />
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
