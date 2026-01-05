import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Calendar as CalendarIcon } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ContentStatus = "draft" | "published" | "archived";
type TenderType = "tender" | "vacancy";

function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function TendersForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    const [form, setForm] = useState({
        title: "",
        slug: "",
        type: "tender" as TenderType,
        description: "",
        content: "",
        image_url: "",
        status: "draft" as ContentStatus,
        deadline: "",
    });

    useEffect(() => {
        if (isEditing && id) {
            fetchTender(id);
        }
    }, [id, isEditing]);

    const fetchTender = async (tenderId: string) => {
        try {
            const { data, error } = await supabase
                .from("tenders" as any)
                .select("*")
                .eq("id", tenderId)
                .single();

            if (error) throw error;
            if (data) {
                const d = data as any;
                setForm({
                    title: d.title,
                    slug: d.slug,
                    type: d.type as TenderType,
                    description: d.description || "",
                    content: d.content || "",
                    image_url: d.image_url || "",
                    status: d.status as ContentStatus,
                    deadline: d.deadline ? new Date(d.deadline).toISOString().split('T')[0] : "",
                });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            navigate("/admin/tenders");
        } finally {
            setFetching(false);
        }
    };

    const handleTitleChange = (title: string) => {
        setForm((prev) => ({
            ...prev,
            title,
            slug: isEditing ? prev.slug : generateSlug(title),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: form.title,
                slug: form.slug,
                type: form.type,
                description: form.description || null,
                content: form.content || null,
                image_url: form.image_url || null,
                status: form.status,
                deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
            };

            if (isEditing && id) {
                const { error } = await supabase.from("tenders" as any).update(payload).eq("id", id);
                if (error) throw error;
                toast({ title: "Updated", description: "Notice updated successfully." });
            } else {
                const { error } = await supabase.from("tenders" as any).insert(payload);
                if (error) throw error;
                toast({ title: "Created", description: "Notice created successfully." });
            }

            navigate("/admin/tenders");
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Link to="/admin/tenders">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">
                        {isEditing ? "Edit Notice" : "New Notice"}
                    </h1>
                    <p className="text-slate-500">
                        {isEditing ? "Update existing procurement or vacancy details" : "Create a new procurement notice or job opening"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b">
                                <CardTitle className="text-lg uppercase font-black tracking-tight text-slate-900">Notice Details</CardTitle>
                                <CardDescription>Main information about the tender or vacancy.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="font-bold text-slate-700">Notice Title *</Label>
                                    <Input
                                        id="title"
                                        value={form.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="e.g. Procurement of IT Equipment or Senior Developer Role"
                                        className="h-12 border-2 focus-visible:ring-primary"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="slug" className="font-bold text-slate-700">URL Slug</Label>
                                        <Input
                                            id="slug"
                                            value={form.slug}
                                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                            placeholder="notice-url-slug"
                                            className="border-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type" className="font-bold text-slate-700">Notice Type</Label>
                                        <Select
                                            value={form.type}
                                            onValueChange={(value: TenderType) => setForm({ ...form, type: value })}
                                        >
                                            <SelectTrigger className="border-2 h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tender">Procurement (Tender)</SelectItem>
                                                <SelectItem value="vacancy">Job Opening (Vacancy)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="font-bold text-slate-700">Short Summary</Label>
                                    <Textarea
                                        id="description"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Brief overview for the listing page..."
                                        className="border-2 min-h-[100px] resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content" className="font-bold text-slate-700">Detailed Content / Requirements</Label>
                                    <Textarea
                                        id="content"
                                        value={form.content}
                                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                                        placeholder="Full details, evaluation criteria, or job requirements..."
                                        className="border-2 min-h-[300px] resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b">
                                <CardTitle className="text-lg uppercase font-black tracking-tight text-slate-900">Publishing Settings</CardTitle>
                                <CardDescription>Manage status and deadlines.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="font-bold text-slate-700">Status</Label>
                                    <Select
                                        value={form.status}
                                        onValueChange={(value: ContentStatus) => setForm({ ...form, status: value })}
                                    >
                                        <SelectTrigger className="border-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft (Hidden)</SelectItem>
                                            <SelectItem value="published">Published (Live)</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deadline" className="font-bold text-slate-700">Closing Date / Deadline</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="deadline"
                                            type="date"
                                            value={form.deadline}
                                            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                            className="pl-10 border-2"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image_url" className="font-bold text-slate-700">Optional Banner Image URL</Label>
                                    <Input
                                        id="image_url"
                                        value={form.image_url}
                                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                        placeholder="https://..."
                                        className="border-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-3">
                            <Button type="submit" className="w-full h-14 rounded-full font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                {isEditing ? "Update Notice" : "Publish Notice"}
                            </Button>
                            <Link to="/admin/tenders" className="w-full">
                                <Button type="button" variant="outline" className="w-full h-14 rounded-full font-bold uppercase tracking-widest text-xs border-2">
                                    Cancel Changes
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
