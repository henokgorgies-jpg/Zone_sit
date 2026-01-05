import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, Building2, Target, Users, User, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AboutContent {
    mission: string;
    vision: string;
    values: string;
    managerName: string;
    managerTitle: string;
    managerMessage: string;
    managerPhotoUrl: string;
    managerJobDescription: string;
}

const defaultContent: AboutContent = {
    mission: "Our mission is to empower every citizen through innovation, transparency, and high-quality essential public services.",
    vision: "To become a global model for digital government excellence and citizen-centric governance by 2030.",
    values: "We are anchored by Integrity, Excellence, Accountability, and a relentless passion for public service.",
    managerName: "John Doe",
    managerTitle: "Director General",
    managerMessage: "Welcome to our portal. We are committed to serving you with excellence.",
    managerPhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    managerJobDescription: "Responsible for over-all strategic direction and digital transformation initiatives."
};

const AboutManagement = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AboutContent>(defaultContent);

    const { data: page, isLoading } = useQuery({
        queryKey: ["admin-about-page"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("pages")
                .select("*")
                .eq("slug", "about")
                .maybeSingle();
            if (error) throw error;
            return data;
        },
    });

    useEffect(() => {
        if (page?.content) {
            try {
                const content = typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
                // Merge with defaults to ensure all fields exist
                setFormData({ ...defaultContent, ...content });
            } catch (e) {
                console.error("Failed to parse about page content", e);
            }
        }
    }, [page]);

    const mutation = useMutation({
        mutationFn: async (content: AboutContent) => {
            if (page) {
                const { error } = await supabase
                    .from("pages")
                    .update({ content: JSON.stringify(content) })
                    .eq("id", page.id);
                if (error) throw error;
            } else {
                // Create if doesn't exist (though it should have been created in previous steps)
                const { error } = await supabase.from("pages").insert([{
                    title: "About Us",
                    slug: "about",
                    content: JSON.stringify(content),
                    status: "published"
                }]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-about-page"] });
            queryClient.invalidateQueries({ queryKey: ["page-about"] });
            toast({ title: "About Us content updated successfully" });
        },
        onError: (error) => {
            toast({ title: "Error saving content", description: error.message, variant: "destructive" });
        },
    });

    const handleInputChange = (field: keyof AboutContent, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                    </Button>
                    <h1 className="text-4xl font-black tracking-tight uppercase">Manage About Us</h1>
                    <p className="text-slate-500 font-medium mt-2">Update core pillars and institutional leadership profiles.</p>
                </div>
                <Button
                    onClick={() => mutation.mutate(formData)}
                    disabled={mutation.isPending}
                    className="rounded-full px-8 py-6 h-auto font-bold shadow-xl shadow-primary/20"
                >
                    {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Core Pillars */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Core Pillars</h2>
                    </div>

                    <Card className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 space-y-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-slate-400">
                                <Target className="h-3 w-3" /> Our Mission
                            </Label>
                            <Textarea
                                value={formData.mission}
                                onChange={(e) => handleInputChange("mission", e.target.value)}
                                placeholder="Enter our mission statement..."
                                rows={3}
                                className="rounded-2xl border-slate-200 focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-slate-400">
                                <Users className="h-3 w-3" /> Our Vision
                            </Label>
                            <Textarea
                                value={formData.vision}
                                onChange={(e) => handleInputChange("vision", e.target.value)}
                                placeholder="Enter our vision statement..."
                                rows={3}
                                className="rounded-2xl border-slate-200 focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-slate-400">
                                <Target className="h-3 w-3" /> Our Values
                            </Label>
                            <Textarea
                                value={formData.values}
                                onChange={(e) => handleInputChange("values", e.target.value)}
                                placeholder="Enter our values statement..."
                                rows={3}
                                className="rounded-2xl border-slate-200 focus:border-primary transition-colors"
                            />
                        </div>
                    </Card>
                </div>

                {/* Institutional Profile */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <User className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Institutional Profile</h2>
                    </div>

                    <Card className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Manager Name</Label>
                                <Input
                                    value={formData.managerName}
                                    onChange={(e) => handleInputChange("managerName", e.target.value)}
                                    className="rounded-xl border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Title / Designation</Label>
                                <Input
                                    value={formData.managerTitle}
                                    onChange={(e) => handleInputChange("managerTitle", e.target.value)}
                                    className="rounded-xl border-slate-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Manager's Message</Label>
                            <Textarea
                                value={formData.managerMessage}
                                onChange={(e) => handleInputChange("managerMessage", e.target.value)}
                                rows={3}
                                className="rounded-2xl border-slate-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest text-slate-400">
                                <ImageIcon className="h-3 w-3" /> Photo URL
                            </Label>
                            <Input
                                value={formData.managerPhotoUrl}
                                onChange={(e) => handleInputChange("managerPhotoUrl", e.target.value)}
                                className="rounded-xl border-slate-200"
                            />
                            {formData.managerPhotoUrl && (
                                <div className="h-20 w-20 rounded-2xl overflow-hidden mt-2 border border-slate-100">
                                    <img src={formData.managerPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Job Description (Brief)</Label>
                            <Textarea
                                value={formData.managerJobDescription}
                                onChange={(e) => handleInputChange("managerJobDescription", e.target.value)}
                                rows={3}
                                className="rounded-2xl border-slate-200"
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AboutManagement;
