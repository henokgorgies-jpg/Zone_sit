
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Image as ImageIcon, Video, Calendar, Loader2 } from "lucide-react";
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

type Media = {
    id: string;
    title: string;
    description: string | null;
    type: 'photo' | 'video';
    url: string;
    thumbnail_url: string | null;
    status: 'draft' | 'published' | 'archived';
    category: string | null;
    created_at: string;
    updated_at: string;
};

export default function MediaList() {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchMedia = async () => {
        try {
            const { data, error } = await (supabase as any)
                .from("media")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setMedia(data || []);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const { error } = await (supabase as any).from("media").delete().eq("id", id);
            if (error) throw error;
            setMedia(media.filter((m) => m.id !== id));
            toast({ title: "Deleted", description: "Media item deleted successfully." });
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
                    <h1 className="text-3xl font-bold">Media Gallery</h1>
                    <p className="text-muted-foreground">Manage photos and videos for the gallery archive</p>
                </div>
                <Link to="/admin/media/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Media
                    </Button>
                </Link>
            </div>

            {media.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground mb-4">No media items yet.</p>
                    <Link to="/admin/media/new">
                        <Button>Upload your first media</Button>
                    </Link>
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Preview</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {media.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="h-12 w-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                                            {item.type === 'photo' ? (
                                                <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full w-full bg-slate-200">
                                                    <Video className="h-6 w-6 text-slate-500" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            {item.category && <p className="text-xs text-muted-foreground">{item.category}</p>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {item.type === 'photo' ? (
                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Video className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="capitalize text-sm">{item.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/media/${item.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Media</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{item.title}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Delete
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
