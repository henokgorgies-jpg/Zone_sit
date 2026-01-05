import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ContentStatus = "draft" | "published" | "archived";

interface LeadershipFormState {
    name: string;
    role: string;
    category: string;
    bio: string;
    image_url: string;
    rank: string;
    status: ContentStatus;
}

export default function LeadershipForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditing = !!id;
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<LeadershipFormState>({
        name: "",
        role: "",
        category: "Executive Cabinet",
        bio: "",
        image_url: "",
        rank: "0",
        status: "published",
    });

    useEffect(() => {
        if (isEditing && id) {
            fetchOfficial(id);
        }
    }, [id, isEditing]);

    const fetchOfficial = async (officialId: string) => {
        try {
            const { data, error } = await supabase
                .from("leadership" as any)
                .select("*")
                .eq("id", officialId)
                .single();

            if (error) throw error;
            if (data) {
                const d = data as any;
                setForm({
                    name: d.name,
                    role: d.role,
                    category: d.category || "Executive Cabinet",
                    bio: d.bio || "",
                    image_url: d.image_url || "",
                    rank: d.rank ? d.rank.toString() : "0",
                    status: d.status as ContentStatus,
                });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            navigate("/admin/leadership");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                name: form.name,
                role: form.role,
                category: form.category,
                bio: form.bio,
                image_url: form.image_url,
                rank: parseInt(form.rank),
                status: form.status,
            };

            if (isEditing && id) {
                const { error } = await supabase.from("leadership" as any).update(payload).eq("id", id);
                if (error) throw error;
                toast({ title: "Updated", description: "Official profile updated." });
            } else {
                const { error } = await supabase.from("leadership" as any).insert(payload);
                if (error) throw error;
                toast({ title: "Created", description: "Official added to leadership." });
            }
            navigate("/admin/leadership");
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSaving(false);
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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate("/admin/leadership")} className="gap-2 font-bold uppercase tracking-widest text-[10px]">
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </Button>
                <h1 className="text-3xl font-black uppercase tracking-tighter">
                    {isEditing ? "Edit Official" : "New Official"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[3rem] border-2 shadow-sm border-slate-100">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 md:col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Name</label>
                        <Input
                            required
                            placeholder="e.g., Jane Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="h-14 border-2 rounded-2xl px-6 font-bold text-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Job Title / Role</label>
                        <Input
                            required
                            placeholder="e.g., Chief Administrative Officer"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="h-14 border-2 rounded-2xl px-6 font-bold"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Section / Category</label>
                        <Select
                            value={form.category}
                            onValueChange={(v) => setForm({ ...form, category: v })}
                        >
                            <SelectTrigger className="h-14 border-2 rounded-2xl px-6 font-bold">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2">
                                <SelectItem value="Executive Cabinet" className="font-bold">Executive Cabinet</SelectItem>
                                <SelectItem value="Bureau Directors" className="font-bold">Bureau Directors</SelectItem>
                                <SelectItem value="Department Heads" className="font-bold">Department Heads</SelectItem>
                                <SelectItem value="Advisors" className="font-bold">Institutional Advisors</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Display Rank (0 is first)</label>
                        <Input
                            type="number"
                            value={form.rank}
                            onChange={(e) => setForm({ ...form, rank: e.target.value })}
                            className="h-14 border-2 rounded-2xl px-6 font-bold"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Official Biography</label>
                        <Textarea
                            placeholder="Brief professional background..."
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            className="min-h-[160px] border-2 rounded-[2.5rem] p-8 font-medium leading-relaxed"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Photo URL</label>
                        <div className="relative">
                            <Upload className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="https://example.com/photo.jpg"
                                value={form.image_url}
                                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                className="h-14 border-2 rounded-2xl pl-12 pr-6 font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visibility Status</label>
                        <Select
                            value={form.status}
                            onValueChange={(v: ContentStatus) => setForm({ ...form, status: v })}
                        >
                            <SelectTrigger className="h-14 border-2 rounded-2xl px-6 font-bold uppercase tracking-widest text-xs">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2">
                                <SelectItem value="published" className="font-bold text-primary">Published / Visible</SelectItem>
                                <SelectItem value="draft" className="font-bold">Internal / Hidden</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="pt-8 border-t flex justify-end">
                    <Button
                        disabled={saving}
                        type="submit"
                        className="rounded-full px-12 py-8 h-auto font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 gap-3"
                    >
                        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
                        <Save className="h-5 w-5" />
                        {isEditing ? "Update Profile" : "Add to Leadership"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
