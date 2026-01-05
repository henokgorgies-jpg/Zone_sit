
import { useState } from "react";
import { MessageSquare, ThumbsUp, HelpCircle, Send, CheckCircle2, User, Mail, Phone, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Category = "feedback" | "suggestion" | "consultation";

const categoryDetails = {
    feedback: {
        title: "Feedback",
        description: "Share your experience with our services.",
        icon: MessageSquare,
        color: "bg-blue-500",
        lightColor: "bg-blue-50 text-blue-600",
    },
    suggestion: {
        title: "Suggestion",
        description: "Submit ideas for improvement.",
        icon: ThumbsUp,
        color: "bg-green-500",
        lightColor: "bg-green-50 text-green-600",
    },
    consultation: {
        title: "Consultation",
        description: "Request official guidance or consultation.",
        icon: HelpCircle,
        color: "bg-purple-500",
        lightColor: "bg-purple-50 text-purple-600",
    }
};

const Engagement = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        category: "feedback" as Category,
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await (supabase as any).from("engagements").insert([form]);
            if (error) throw error;
            setSubmitted(true);
            toast({
                title: "Thank you!",
                description: "Your submission has been received and will be reviewed shortly.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
                        <div className="relative h-24 w-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto border-2 border-primary/10">
                            <CheckCircle2 className="h-12 w-12 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black uppercase tracking-tight">Submission Received</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Thank you for participating in our citizen engagement program. Your {form.category} helps us build a better government for everyone.
                        </p>
                    </div>
                    <Button onClick={() => setSubmitted(false)} size="lg" className="rounded-full px-8 shadow-xl">
                        Submit Another Response
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b py-16 sm:py-24 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
                <div className="gov-container max-w-4xl relative">
                    <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                        <MessageSquare className="h-4 w-4" /> Citizen Portal
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-6 uppercase">Citizen Engagement</h1>
                    <div className="h-2 w-24 bg-primary rounded-full mb-8" />
                    <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Your voice matters. Use this platform to share feedback, propose suggestions, or request consultations with government officials.
                    </p>
                </div>
            </div>

            <div className="gov-container max-w-4xl pb-32">
                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Category Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(Object.keys(categoryDetails) as Category[]).map((cat) => {
                            const details = categoryDetails[cat];
                            const isActive = form.category === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setForm({ ...form, category: cat })}
                                    className={cn(
                                        "flex flex-col items-start p-6 rounded-[2rem] border-2 transition-all duration-300 text-left relative overflow-hidden group",
                                        isActive
                                            ? "border-primary bg-white shadow-2xl shadow-primary/10 -translate-y-1"
                                            : "border-transparent bg-white/50 hover:bg-white hover:border-slate-200"
                                    )}
                                >
                                    <div className={cn("p-3 rounded-2xl mb-4 transition-colors", isActive ? details.color + " text-white" : details.lightColor)}>
                                        <details.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-tight mb-1">{details.title}</h3>
                                    <p className="text-xs text-slate-500 leading-snug">{details.description}</p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Form Content */}
                    <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
                        <CardContent className="p-8 sm:p-12 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <User className="h-3 w-3" /> Full Name *
                                        </Label>
                                        <Input
                                            id="full_name"
                                            required
                                            placeholder="Enter your name"
                                            className="rounded-2xl bg-slate-50 border-none h-12 focus-visible:ring-primary"
                                            value={form.full_name}
                                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <Mail className="h-3 w-3" /> Email Address *
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="Enter your email"
                                            className="rounded-2xl bg-slate-50 border-none h-12 focus-visible:ring-primary"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <Phone className="h-3 w-3" /> Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            placeholder="+251 ..."
                                            className="rounded-2xl bg-slate-50 border-none h-12 focus-visible:ring-primary"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <Tag className="h-3 w-3" /> Subject *
                                        </Label>
                                        <Input
                                            id="subject"
                                            required
                                            placeholder="What is this regarding?"
                                            className="rounded-2xl bg-slate-50 border-none h-12 focus-visible:ring-primary"
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <MessageSquare className="h-3 w-3" /> Your Message *
                                </Label>
                                <Textarea
                                    id="message"
                                    required
                                    rows={6}
                                    placeholder="Share the details of your submission..."
                                    className="rounded-3xl bg-slate-50 border-none resize-none p-6 focus-visible:ring-primary"
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-full text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {loading ? "Processing..." : (
                                        <span className="flex items-center gap-3">
                                            Submit {form.category} <Send className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default Engagement;
