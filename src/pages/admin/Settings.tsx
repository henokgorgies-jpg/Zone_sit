import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [siteSettings, setSiteSettings] = useState({
    site_name: "",
    site_tagline: "",
    footer_text: "",
  });

  const [contactInfo, setContactInfo] = useState({
    address: "",
    phone: "",
    email: "",
    fax: "",
    office_hours: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [settingsRes, contactRes] = await Promise.all([
        supabase.from("site_settings").select("*"),
        supabase.from("contact_info").select("*").limit(1).maybeSingle(),
      ]);

      if (settingsRes.data) {
        const settings: Record<string, string> = {};
        settingsRes.data.forEach((s) => { settings[s.key] = s.value || ""; });
        setSiteSettings({
          site_name: settings.site_name || "",
          site_tagline: settings.site_tagline || "",
          footer_text: settings.footer_text || "",
        });
      }

      if (contactRes.data) {
        setContactInfo({
          address: contactRes.data.address || "",
          phone: contactRes.data.phone || "",
          email: contactRes.data.email || "",
          fax: contactRes.data.fax || "",
          office_hours: contactRes.data.office_hours || "",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(siteSettings)) {
        await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
      }
      await supabase.from("contact_info").upsert({ id: "00000000-0000-0000-0000-000000000001", ...contactInfo });
      toast({ title: "Saved", description: "Settings updated successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Site Settings</h1><p className="text-muted-foreground">Configure your website details</p></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Basic site information</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Site Name</Label><Input value={siteSettings.site_name} onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Tagline</Label><Input value={siteSettings.site_tagline} onChange={(e) => setSiteSettings({ ...siteSettings, site_tagline: e.target.value })} /></div>
            <div className="space-y-2"><Label>Footer Text</Label><Textarea value={siteSettings.footer_text} onChange={(e) => setSiteSettings({ ...siteSettings, footer_text: e.target.value })} rows={2} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Public contact details</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Address</Label><Input value={contactInfo.address} onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Office Hours</Label><Input value={contactInfo.office_hours} onChange={(e) => setContactInfo({ ...contactInfo, office_hours: e.target.value })} /></div>
          </CardContent>
        </Card>
      </div>
      <Button onClick={handleSave} disabled={saving} className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Settings</Button>
    </div>
  );
}
