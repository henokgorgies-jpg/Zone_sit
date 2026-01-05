
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Save, HelpCircle } from "lucide-react";
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

type FAQStatus = 'draft' | 'published' | 'archived';

export default function FAQForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    const [form, setForm] = useState({
        question: "",
        answer: "",
        category: "General",
        sort_order: 0,
        status: "published" as FAQStatus,
    });

    useEffect(() => {
        if (isEditing && id) {
            fetchFAQ(id);
        }
    }, [id, isEditing]);

    const fetchFAQ = async (faqId: string) => {
        try {
            const { data, error } = await (supabase as any)
                .from("faqs")
                .select("*")
                .eq("id", faqId)
                .single();

            if (error) throw error;
            if (data) {
                setForm({
                    question: data.question,
                    answer: data.answer,
                    category: data.category,
                    sort_order: data.sort_order,
                    status: data.status as FAQStatus,
                });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            navigate("/admin/faqs");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                question: form.question,
                answer: form.answer,
                category: form.category,
                sort_order: form.sort_order,
                status: form.status,
            };

            if (isEditing && id) {
                const { error } = await (supabase as any).from("faqs").update(payload).eq("id", id);
                if (error) throw error;
                toast({ title: "Updated", description: "FAQ entry updated successfully." });
            } else {
                const { error } = await (supabase as any).from("faqs").insert(payload);
                if (error) throw error;
                toast({ title: "Created", description: "FAQ entry added successfully." });
            }

            navigate("/admin/faqs");
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
                <Link to="/admin/faqs">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">{isEditing ? "Edit FAQ" : "Add FAQ"}</h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Update the frequently asked question" : "Create a new FAQ entry"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="rounded-[2rem]">
                            <CardHeader>
                                <CardTitle>FAQ Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="question">Question *</Label>
                                    <Input
                                        id="question"
                                        value={form.question}
                                        onChange={(e) => setForm({ ...form, question: e.target.value })}
                                        placeholder="Enter the question"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="answer">Answer *</Label>
                                    <Textarea
                                        id="answer"
                                        value={form.answer}
                                        onChange={(e) => setForm({ ...form, answer: e.target.value })}
                                        placeholder="Enter the informative answer..."
                                        rows={8}
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="rounded-[2rem]">
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        placeholder="e.g. Services, Legal, Account"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Display Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                    />
                                    <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={form.status}
                                        onValueChange={(value: FAQStatus) => setForm({ ...form, status: value })}
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
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="w-full gap-2 rounded-full" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {isEditing ? "Update FAQ" : "Save FAQ"}
                            </Button>
                            <Link to="/admin/faqs" className="w-full">
                                <Button type="button" variant="outline" className="w-full rounded-full">
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
