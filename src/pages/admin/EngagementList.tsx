
import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, Calendar, Trash2, CheckCircle, Clock, Archive, Filter, MessageSquare, ThumbsUp, HelpCircle } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Engagement = {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    category: 'feedback' | 'suggestion' | 'consultation';
    status: 'new' | 'pending' | 'resolved' | 'archived';
    created_at: string;
};

export default function EngagementList() {
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | Engagement['category']>('all');
    const { toast } = useToast();

    const fetchEngagements = async () => {
        try {
            let query = (supabase as any).from("engagements").select("*").order("created_at", { ascending: false });

            if (filter !== 'all') {
                query = query.eq("category", filter);
            }

            const { data, error } = await query;
            if (error) throw error;
            setEngagements(data || []);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEngagements();
    }, [filter]);

    const handleStatusUpdate = async (id: string, status: Engagement['status']) => {
        try {
            const { error } = await (supabase as any).from("engagements").update({ status }).eq("id", id);
            if (error) throw error;
            setEngagements(engagements.map(e => e.id === id ? { ...e, status } : e));
            toast({ title: "Updated", description: `Lead status set to ${status}.` });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await (supabase as any).from("engagements").delete().eq("id", id);
            if (error) throw error;
            setEngagements(engagements.filter((e) => e.id !== id));
            toast({ title: "Deleted", description: "Submission deleted successfully." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const getStatusBadge = (status: Engagement['status']) => {
        switch (status) {
            case "new": return <Badge className="bg-blue-100 text-blue-800 border-blue-200">New Entry</Badge>;
            case "pending": return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Review</Badge>;
            case "resolved": return <Badge className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
            case "archived": return <Badge variant="secondary">Archived</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getCategoryIcon = (category: Engagement['category']) => {
        switch (category) {
            case "feedback": return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case "suggestion": return <ThumbsUp className="h-4 w-4 text-green-500" />;
            case "consultation": return <HelpCircle className="h-4 w-4 text-purple-500" />;
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Citizen Engagement</h1>
                    <p className="text-muted-foreground">Manage feedback, suggestions, and consultations from citizens</p>
                </div>
                <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Submissions</SelectItem>
                            <SelectItem value="feedback">Feedback Only</SelectItem>
                            <SelectItem value="suggestion">Suggestions Only</SelectItem>
                            <SelectItem value="consultation">Consultations Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50/30 border-blue-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-blue-600">Total Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{engagements.filter(e => e.category === 'feedback').length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50/30 border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-green-600">Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{engagements.filter(e => e.category === 'suggestion').length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50/30 border-purple-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-purple-600">Consultations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{engagements.filter(e => e.category === 'consultation').length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold uppercase text-[10px]">Recipient & Subject</TableHead>
                            <TableHead className="font-bold uppercase text-[10px]">Type</TableHead>
                            <TableHead className="font-bold uppercase text-[10px]">Status</TableHead>
                            <TableHead className="font-bold uppercase text-[10px]">Date</TableHead>
                            <TableHead className="text-right font-bold uppercase text-[10px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {engagements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center text-muted-foreground font-medium">
                                    No submissions found for the selected category.
                                </TableCell>
                            </TableRow>
                        ) : (
                            engagements.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 leading-tight">{item.subject}</p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="font-medium text-slate-600">{item.full_name}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getCategoryIcon(item.category)}
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {item.status !== 'resolved' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleStatusUpdate(item.id, 'resolved')}
                                                    title="Mark as Resolved"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {item.status === 'new' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                                    onClick={() => handleStatusUpdate(item.id, 'pending')}
                                                    title="Set to Pending"
                                                >
                                                    <Clock className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {item.status !== 'archived' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                                    onClick={() => handleStatusUpdate(item.id, 'archived')}
                                                    title="Archive"
                                                >
                                                    <Archive className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-[2rem]">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this engagement record? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full">
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
