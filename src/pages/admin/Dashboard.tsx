import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Briefcase, FileText, TrendingUp, Plus, ArrowRight, Users, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  news: number;
  services: number;
  documents: number;
  media: number;
  engagements: number;
  faqs: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ news: 0, services: 0, documents: 0, media: 0, engagements: 0, faqs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [newsRes, servicesRes, docsRes, mediaRes, engagementsRes, faqsRes] = await Promise.all([
          supabase.from("news").select("id", { count: "exact", head: true }),
          supabase.from("services").select("id", { count: "exact", head: true }),
          supabase.from("documents").select("id", { count: "exact", head: true }),
          (supabase as any).from("media").select("id", { count: "exact", head: true }),
          (supabase as any).from("engagements").select("id", { count: "exact", head: true }),
          (supabase as any).from("faqs").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          news: newsRes.count || 0,
          services: servicesRes.count || 0,
          documents: docsRes.count || 0,
          media: mediaRes.count || 0,
          engagements: engagementsRes.count || 0,
          faqs: faqsRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: "News Articles", value: stats.news, icon: Newspaper, href: "/admin/news", color: "text-blue-600 bg-blue-100" },
    { title: "Services", value: stats.services, icon: Briefcase, href: "/admin/services", color: "text-green-600 bg-green-100" },
    { title: "Documents", value: stats.documents, icon: FileText, href: "/admin/documents", color: "text-purple-600 bg-purple-100" },
    { title: "Media Items", value: stats.media, icon: Newspaper, href: "/admin/media", color: "text-orange-600 bg-orange-100" },
    { title: "Citizen Engagement", value: stats.engagements, icon: Users, href: "/admin/engagements", color: "text-rose-600 bg-rose-100" },
    { title: "Help Topics", value: stats.faqs, icon: HelpCircle, href: "/admin/faqs", color: "text-amber-600 bg-amber-100" },
  ];

  const quickActions = [
    { label: "Add News", href: "/admin/news/new", icon: Newspaper },
    { label: "Add Service", href: "/admin/services/new", icon: Briefcase },
    { label: "Add Document", href: "/admin/documents/new", icon: FileText },
    { label: "Add Media", href: "/admin/media/new", icon: Newspaper },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your content management dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : stat.value}</div>
              <Link to={stat.href} className="text-sm text-accent hover:underline flex items-center gap-1 mt-2">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Create new content quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Tips to help you manage your content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
            <div>
              <p className="font-medium">Create Content</p>
              <p className="text-sm text-muted-foreground">Add news articles, services, and documents using the navigation menu.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
            <div>
              <p className="font-medium">Set Status</p>
              <p className="text-sm text-muted-foreground">Content is saved as "Draft" by default. Change to "Published" when ready.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
            <div>
              <p className="font-medium">View Live Site</p>
              <p className="text-sm text-muted-foreground">Published content will appear on the public website automatically.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
