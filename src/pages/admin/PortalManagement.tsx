import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Camera, User, Layout, Save, RefreshCw } from "lucide-react";

interface HeroImage {
    src: string;
    alt: string;
}

interface CEOMessage {
    name: string;
    title: string;
    message: string;
    image: string;
    since: string;
}

const PortalManagement = () => {
    const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
    const [ceoData, setCeoData] = useState<CEOMessage>({
        name: "",
        title: "",
        message: "",
        image: "",
        since: "",
    });
    const [loading, setLoading] = useState(true);
    const [savingHero, setSavingHero] = useState(false);
    const [savingCeo, setSavingCeo] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("site_settings")
                .select("key, value")
                .in("key", ["hero_carousel", "ceo_message_data"]);

            if (error) throw error;

            const hero = data?.find((s) => s.key === "hero_carousel");
            if (hero) setHeroImages(JSON.parse(hero.value));

            const ceo = data?.find((s) => s.key === "ceo_message_data");
            if (ceo) setCeoData(JSON.parse(ceo.value));
        } catch (error: any) {
            toast({
                title: "Error fetching settings",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const saveHeroImages = async () => {
        setSavingHero(true);
        try {
            const { error } = await supabase
                .from("site_settings")
                .upsert({ key: "hero_carousel", value: JSON.stringify(heroImages) }, { onConflict: "key" });

            if (error) throw error;
            toast({ title: "Hero Carousel updated" });
        } catch (error: any) {
            toast({ title: "Save failed", description: error.message, variant: "destructive" });
        } finally {
            setSavingHero(false);
        }
    };

    const saveCEOMessage = async () => {
        setSavingCeo(true);
        try {
            const { error } = await supabase
                .from("site_settings")
                .upsert({ key: "ceo_message_data", value: JSON.stringify(ceoData) }, { onConflict: "key" });

            if (error) throw error;
            toast({ title: "CEO Message updated" });
        } catch (error: any) {
            toast({ title: "Save failed", description: error.message, variant: "destructive" });
        } finally {
            setSavingCeo(false);
        }
    };

    const addHeroImage = () => {
        setHeroImages([...heroImages, { src: "", alt: "" }]);
    };

    const removeHeroImage = (index: number) => {
        setHeroImages(heroImages.filter((_, i) => i !== index));
    };

    const updateHeroImage = (index: number, field: keyof HeroImage, value: string) => {
        const newImages = [...heroImages];
        newImages[index][field] = value;
        setHeroImages(newImages);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Portal Management</h1>
                    <p className="text-slate-500 mt-1">Manage home page banner and featured leadership content.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Banner Carousel Management */}
                <Card className="border-2">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Layout className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl uppercase font-black tracking-tight">Hero Carousel</CardTitle>
                                    <CardDescription>Update images appearing in the main home banner.</CardDescription>
                                </div>
                            </div>
                            <Button onClick={addHeroImage} size="sm" className="rounded-full">
                                <Plus className="h-4 w-4 mr-1" /> Add Slide
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {heroImages.length === 0 && (
                            <p className="text-center py-8 text-slate-400 italic">No slides added yet.</p>
                        )}
                        {heroImages.map((image, index) => (
                            <div key={index} className="p-4 rounded-xl border-2 border-slate-100 space-y-4 group relative">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeHeroImage(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold tracking-widest text-slate-400">Image URL</Label>
                                        <Input
                                            placeholder="/images/hero-1.png or external URL"
                                            value={image.src}
                                            onChange={(e) => updateHeroImage(index, "src", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold tracking-widest text-slate-400">Alt Text / Label</Label>
                                        <Input
                                            placeholder="e.g. Modern Government Building"
                                            value={image.alt}
                                            onChange={(e) => updateHeroImage(index, "alt", e.target.value)}
                                        />
                                    </div>
                                </div>
                                {image.src && (
                                    <div className="aspect-video w-full rounded-lg overflow-hidden border">
                                        <img src={image.src} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="pt-4 border-t">
                            <Button onClick={saveHeroImages} className="w-full rounded-full font-bold uppercase tracking-widest" disabled={savingHero}>
                                {savingHero ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Carousel Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* CEO Message Management */}
                <Card className="border-2">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl uppercase font-black tracking-tight">CEO Message</CardTitle>
                                <CardDescription>Update the message from the desk of leadership.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CEO Name</Label>
                                    <Input
                                        value={ceoData.name}
                                        onChange={(e) => setCeoData({ ...ceoData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Job Title</Label>
                                    <Input
                                        value={ceoData.title}
                                        onChange={(e) => setCeoData({ ...ceoData, title: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Serving Since</Label>
                                    <Input
                                        placeholder="e.g. 2020"
                                        value={ceoData.since}
                                        onChange={(e) => setCeoData({ ...ceoData, since: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Photo URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="/images/ceo.png"
                                            value={ceoData.image}
                                            onChange={(e) => setCeoData({ ...ceoData, image: e.target.value })}
                                        />
                                        <div className="h-10 w-10 shrink-0 border rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                                            {ceoData.image ? <img src={ceoData.image} className="w-full h-full object-cover" /> : <Camera className="h-4 w-4 text-slate-400" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Official Message</Label>
                                <Textarea
                                    rows={8}
                                    className="resize-none"
                                    value={ceoData.message}
                                    onChange={(e) => setCeoData({ ...ceoData, message: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <Button onClick={saveCEOMessage} className="w-full rounded-full font-bold uppercase tracking-widest" disabled={savingCeo}>
                                {savingCeo ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Leadership Data
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PortalManagement;
