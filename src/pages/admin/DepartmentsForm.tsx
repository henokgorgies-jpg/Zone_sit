import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Upload, Trash2, Plus, Users, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface DepartmentFormState {
    name: string;
    slug: string;
    responsibilities: string;
    head_name: string;
    head_role: string;
    head_image_url: string;
    members_count: string;
    members_list: string[];
    image_url: string;
    status: ContentStatus;
}

export default function DepartmentsForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditing = !!id;
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [newMember, setNewMember] = useState("");
    const [form, setForm] = useState<DepartmentFormState>({
        name: "",
        slug: "",
        responsibilities: "",
        head_name: "",
        head_role: "",
        head_image_url: "",
        members_count: "0",
        members_list: [],
        image_url: "",
        status: "published",
    });

    useEffect(() => {
        if (isEditing && id) {
            fetchDepartment(id);
        }
    }, [id, isEditing]);

    const fetchDepartment = async (deptId: string) => {
        try {
            const { data, error } = await supabase
                .from("departments" as any)
                .select("*")
                .eq("id", deptId)
                .single();

            if (error) throw error;
            if (data) {
                const d = data as any;
                setForm({
                    name: d.name,
                    slug: d.slug,
                    responsibilities: d.responsibilities || "",
                    head_name: d.head_name || "",
                    head_role: d.head_role || "",
                    head_image_url: d.head_image_url || "",
                    members_count: d.members_count?.toString() || "0",
                    members_list: d.members_list || [],
                    image_url: d.image_url || "",
                    status: d.status as ContentStatus,
                });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            navigate("/admin/departments");
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = () => {
        if (newMember.trim()) {
            setForm({ ...form, members_list: [...form.members_list, newMember.trim()] });
            setNewMember("");
        }
    };

    const handleRemoveMember = (index: number) => {
        const updated = [...form.members_list];
        updated.splice(index, 1);
        setForm({ ...form, members_list: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Auto-generate slug if empty
        const slug = form.slug || form.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        try {
            const payload = {
                name: form.name,
                slug: slug,
                responsibilities: form.responsibilities,
                head_name: form.head_name,
                head_role: form.head_role,
                head_image_url: form.head_image_url,
                members_count: parseInt(form.members_count),
                members_list: form.members_list,
                image_url: form.image_url,
                status: form.status,
            };

            if (isEditing && id) {
                const { error } = await supabase.from("departments" as any).update(payload).eq("id", id);
                if (error) throw error;
                toast({ title: "Updated", description: "Department updated successfully." });
            } else {
                const { error } = await supabase.from("departments" as any).insert(payload);
                if (error) throw error;
                toast({ title: "Created", description: "Department created successfully." });
            }
            navigate("/admin/departments");
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
                <Button variant="ghost" onClick={() => navigate("/admin/departments")} className="gap-2 font-bold uppercase tracking-widest text-[10px]">
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </Button>
                <h1 className="text-3xl font-black uppercase tracking-tighter">
                    {isEditing ? "Edit Office" : "New Office Profile"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 pb-20">
                {/* Core Info */}
                <div className="space-y-8 bg-white p-12 rounded-[3rem] border-2 shadow-sm border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary border-l-4 border-primary pl-4">General Information</h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Department Name</label>
                            <Input
                                required
                                placeholder="e.g., Office of Finance & Budget"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="h-14 border-2 rounded-2xl px-6 font-bold text-lg"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Custom Slug (optional)</label>
                            <Input
                                placeholder="finance-office"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="h-12 border-2 rounded-xl px-4 font-medium"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Background Image URL</label>
                            <div className="relative">
                                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="https://example.com/dept-cover.jpg"
                                    value={form.image_url}
                                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    className="h-12 border-2 rounded-xl pl-12 pr-4 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Responsibilities & Mission</label>
                            <Textarea
                                placeholder="Describe what this department does and its legal mandate..."
                                value={form.responsibilities}
                                onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                                className="min-h-[160px] border-2 rounded-[2rem] p-8 font-medium leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* Leadership Hub */}
                <div className="space-y-8 bg-white p-12 rounded-[3rem] border-2 shadow-sm border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary border-l-4 border-primary pl-4">Office Leadership</h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Head of Department (Name)</label>
                            <Input
                                placeholder="Official's full name"
                                value={form.head_name}
                                onChange={(e) => setForm({ ...form, head_name: e.target.value })}
                                className="h-14 border-2 rounded-2xl px-6 font-bold"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Specific Role Title</label>
                            <Input
                                placeholder="e.g., Director General"
                                value={form.head_role}
                                onChange={(e) => setForm({ ...form, head_role: e.target.value })}
                                className="h-14 border-2 rounded-2xl px-6 font-bold"
                            />
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Head's Photo URL</label>
                            <div className="relative">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    placeholder="https://example.com/head-photo.jpg"
                                    value={form.head_image_url}
                                    onChange={(e) => setForm({ ...form, head_image_url: e.target.value })}
                                    className="h-14 border-2 rounded-2xl pl-14 pr-6 font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Staff & Members */}
                <div className="space-y-8 bg-white p-12 rounded-[3rem] border-2 shadow-sm border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary border-l-4 border-primary pl-4">Staff & Structure</h3>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Add Core Members / Roles</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g., Deputy Director or John Doe"
                                    value={newMember}
                                    onChange={(e) => setNewMember(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                                    className="h-12 border-2 rounded-xl"
                                />
                                <Button type="button" onClick={handleAddMember} className="h-12 rounded-xl px-4">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {form.members_list.map((m, i) => (
                                    <Badge key={i} className="py-2 pl-4 pr-2 rounded-full gap-2 bg-slate-100 text-slate-900 border-none group hover:bg-slate-200 transition-colors">
                                        {m}
                                        <button type="button" onClick={() => handleRemoveMember(i)} className="p-1 hover:bg-white rounded-full text-slate-400 hover:text-red-500">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                {form.members_list.length === 0 && (
                                    <p className="text-[10px] font-bold text-slate-400 italic">No members added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4">Total Workforce Count</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="number"
                                    value={form.members_count}
                                    onChange={(e) => setForm({ ...form, members_count: e.target.value })}
                                    className="h-14 border-2 rounded-2xl pl-14 pr-6 font-bold text-xl"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 pl-4">Estimated number of employees in this department.</p>
                        </div>
                    </div>
                </div>

                {/* Global Options */}
                <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[2.5rem] text-white">
                    <div className="flex items-center gap-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portal Visibility</p>
                            <Select
                                value={form.status}
                                onValueChange={(v: ContentStatus) => setForm({ ...form, status: v })}
                            >
                                <SelectTrigger className="h-12 w-48 bg-white/10 border-white/20 rounded-xl font-bold uppercase tracking-widest text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-2">
                                    <SelectItem value="published" className="font-bold">LIVE / PUBLIC</SelectItem>
                                    <SelectItem value="draft" className="font-bold">DRAFT / HIDDEN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        disabled={saving}
                        type="submit"
                        className="rounded-full px-12 py-8 h-auto font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/40 gap-3"
                    >
                        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
                        <Save className="h-5 w-5" />
                        {isEditing ? "Update Office Profile" : "Create Office Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
