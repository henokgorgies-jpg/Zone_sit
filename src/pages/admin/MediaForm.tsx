
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Link } from "react-router-dom";

type MediaStatus = 'draft' | 'published' | 'archived';
type MediaType = 'photo' | 'video';

export default function MediaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "photo" as MediaType,
        url: "",
        thumbnail_url: "",
        status: "published" as MediaStatus,
        category: "",
    });

    useEffect(() => {
        if (isEditing && id) {
            fetchMedia(id);
        }
    }, [id, isEditing]);

    const fetchMedia = async (mediaId: string) => {
        try {
            const { data, error } = await (supabase as any)
                .from("media")
                .select("*")
                .eq("id", mediaId)
                .single();

            if (error) throw error;
            if (data) {
                const mediaData = data as any;
                setForm({
                    title: mediaData.title,
                    description: mediaData.description || "",
                    type: mediaData.type as MediaType,
                    url: mediaData.url,
                    thumbnail_url: mediaData.thumbnail_url || "",
                    status: mediaData.status as MediaStatus,
                    category: mediaData.category || "",
                });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            navigate("/admin/media");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: form.title,
                description: form.description || null,
                type: form.type,
                url: form.url,
                thumbnail_url: form.thumbnail_url || null,
                status: form.status,
                category: form.category || null,
            };

            if (isEditing && id) {
                const { error } = await (supabase as any).from("media").update(payload).eq("id", id);
                if (error) throw error;
                toast({ title: "Updated", description: "Media item updated successfully." });
            } else {
                const { error } = await (supabase as any).from("media").insert(payload);
                if (error) throw error;
                toast({ title: "Created", description: "Media item added successfully." });
            }

            navigate("/admin/media");
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/media">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">{isEditing ? "Edit Media" : "Add Media"}</h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Update the media details" : "Add a new photo or video to the gallery"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Media Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="Enter media title"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Media Type *</Label>
                                        <Select
                                            value={form.type}
                                            onValueChange={(value: MediaType) => setForm({ ...form, type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="photo">Photo</SelectItem>
                                                <SelectItem value="video">Video</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Input
                                            id="category"
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            placeholder="e.g. Events, Projects"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="url">{form.type === 'photo' ? 'Image URL' : 'Video URL'} *</Label>
                                    <Input
                                        id="url"
                                        value={form.url}
                                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                                        placeholder={form.type === 'photo' ? "https://example.com/image.jpg" : "https://youtube.com/watch?v=..."}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thumbnail_url">Thumbnail URL (Optional)</Label>
                                    <Input
                                        id="thumbnail_url"
                                        value={form.thumbnail_url}
                                        onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                                        placeholder="https://example.com/thumb.jpg"
                                    />
                                    <p className="text-xs text-muted-foreground">Recommended for videos or large images</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Brief description of the media item"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={form.status}
                                        onValueChange={(value: MediaStatus) => setForm({ ...form, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {form.url && (
                                    <div className="space-y-2">
                                        <Label>Preview</Label>
                                        <div className="aspect-video w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                                            {form.type === 'photo' ? (
                                                <img src={form.url} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Video className="h-10 w-10 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">Video Link Provided</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="w-full gap-2" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {isEditing ? "Update Media" : "Add Media"}
                            </Button>
                            <Link to="/admin/media" className="w-full">
                                <Button type="button" variant="outline" className="w-full">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
