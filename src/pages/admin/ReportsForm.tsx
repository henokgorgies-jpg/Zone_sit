import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Upload, FileDown } from "lucide-react";
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

type ReportCategory = "annual_report" | "research_stat" | "strategic_plan" | "other";
type ContentStatus = "draft" | "published" | "archived";

interface ReportFormState {
    title: string;
    category: ReportCategory;
    description: string;
    file_url: string;
    image_url: string;
    year: string;
    status: ContentStatus;
}

export default function ReportsForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditing = !!id;
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<ReportFormState>({
        title: "",
        category: "annual_report",
        description: "",
        file_url: "",
        image_url: "",
        year: new Date().getFullYear().toString(),
        status: "draft",
    });

    useEffect(() => {
        if (isEditing && id) {
            fetchReport(id);
        }
    }, [id, isEditing]);

    const fetchReport = async (reportId: string) => {
        try {
            const { data, error } = await supabase
                .from("reports" as any)
                .select("*")
                .eq("id", reportId)
                .single();

            if (error) throw error;
            if (data) {
                const d = data as any;
                setForm({
                    title: d.title,
                    category: d.category as ReportCategory,
                    description: d.description || "",
                    file_url: d.file_url,
                    image_url: d.image_url || "",
                    year: d.year ? d.year.toString() : "",
                    status: d.status as ContentStatus,
                });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            navigate("/admin/reports");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                title: form.title,
                category: form.category,
                description: form.description,
                file_url: form.file_url,
                image_url: form.image_url,
                year: form.year ? parseInt(form.year) : null,
                status: form.status,
            };

            if (isEditing && id) {
                const { error } = await supabase.from("reports" as any).update(payload).eq("id", id);
                if (error) throw error;
                toast({ title: "Updated", description: "Report updated successfully." });
            } else {
                const { error } = await supabase.from("reports" as any).insert(payload);
                if (error) throw error;
                toast({ title: "Created", description: "Report created successfully." });
            }
            navigate("/admin/reports");
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
                <Button variant="ghost" onClick={() => navigate("/admin/reports")} className="gap-2 font-bold uppercase tracking-widest text-[10px]">
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </Button>
                <h1 className="text-3xl font-black uppercase tracking-tighter">
                    {isEditing ? "Edit Publication" : "New Publication"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[3rem] border-2 shadow-sm border-slate-100">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Publication Title</label>
                        <Input
                            required
                            placeholder="e.g., Annual Report 2024"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="h-14 border-2 rounded-2xl px-6 font-bold text-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</label>
                        <Select
                            value={form.category}
                            onValueChange={(v: ReportCategory) => setForm({ ...form, category: v })}
                        >
                            <SelectTrigger className="h-14 border-2 rounded-2xl px-6 font-bold">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2">
                                <SelectItem value="annual_report" className="font-bold">Annual Report</SelectItem>
                                <SelectItem value="research_stat" className="font-bold">Research Statistics</SelectItem>
                                <SelectItem value="strategic_plan" className="font-bold">Strategic Plan</SelectItem>
                                <SelectItem value="other" className="font-bold">Other Publication</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Publication Year</label>
                        <Input
                            type="number"
                            placeholder="2024"
                            value={form.year}
                            onChange={(e) => setForm({ ...form, year: e.target.value })}
                            className="h-14 border-2 rounded-2xl px-6 font-bold"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Brief Description</label>
                        <Textarea
                            placeholder="Describe the content of this publication..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="min-h-[120px] border-2 rounded-[2rem] p-6 font-medium leading-relaxed"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Document URL (PDF/DOCX)</label>
                        <div className="relative">
                            <FileDown className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                required
                                placeholder="https://example.com/report.pdf"
                                value={form.file_url}
                                onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                                className="h-14 border-2 rounded-2xl pl-12 pr-6 font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thumbnail Image URL (Optional)</label>
                        <div className="relative">
                            <Upload className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="https://example.com/cover.jpg"
                                value={form.image_url}
                                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                className="h-14 border-2 rounded-2xl pl-12 pr-6 font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action State</label>
                        <Select
                            value={form.status}
                            onValueChange={(v: ContentStatus) => setForm({ ...form, status: v })}
                        >
                            <SelectTrigger className="h-14 border-2 rounded-2xl px-6 font-bold uppercase tracking-widest text-xs">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2">
                                <SelectItem value="draft" className="font-bold">Draft / Internal Only</SelectItem>
                                <SelectItem value="published" className="font-bold text-primary">Published / Live</SelectItem>
                                <SelectItem value="archived" className="font-bold">Archived / Hidden</SelectItem>
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
                        {isEditing ? "Update Publication" : "Create Publication"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
