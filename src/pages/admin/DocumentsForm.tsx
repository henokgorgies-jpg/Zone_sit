import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
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
import { Link } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type ContentStatus = Database["public"]["Enums"]["content_status"];

const categoryOptions = ["Forms", "Reports", "Policies", "Guidelines", "Notices", "Templates", "Legal"];

export default function DocumentsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [form, setForm] = useState({
    title: "",
    description: "",
    file_url: "",
    file_type: "",
    file_size: null as number | null,
    category: "",
    status: "draft" as ContentStatus,
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchDocument(id);
    }
  }, [id, isEditing]);

  const fetchDocument = async (docId: string) => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", docId)
        .single();

      if (error) throw error;
      if (data) {
        setForm({
          title: data.title,
          description: data.description || "",
          file_url: data.file_url,
          file_type: data.file_type || "",
          file_size: data.file_size,
          category: data.category || "",
          status: data.status,
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      navigate("/admin/documents");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        file_url: form.file_url,
        file_type: form.file_type || null,
        file_size: form.file_size,
        category: form.category || null,
        status: form.status,
      };

      if (isEditing && id) {
        const { error } = await supabase.from("documents").update(payload).eq("id", id);
        if (error) throw error;
        toast({ title: "Updated", description: "Document updated successfully." });
      } else {
        const { error } = await supabase.from("documents").insert(payload);
        if (error) throw error;
        toast({ title: "Created", description: "Document created successfully." });
      }

      navigate("/admin/documents");
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
        <Link to="/admin/documents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? "Edit Document" : "New Document"}</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update document details" : "Add a new downloadable document"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter document title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of the document"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file_url">File URL *</Label>
                  <Input
                    id="file_url"
                    value={form.file_url}
                    onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                    placeholder="https://example.com/document.pdf"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Direct link to the downloadable file</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="file_type">File Type</Label>
                    <Input
                      id="file_type"
                      value={form.file_type}
                      onChange={(e) => setForm({ ...form, file_type: e.target.value })}
                      placeholder="PDF, DOCX, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file_size">File Size (bytes)</Label>
                    <Input
                      id="file_size"
                      type="number"
                      value={form.file_size || ""}
                      onChange={(e) => setForm({ ...form, file_size: parseInt(e.target.value) || null })}
                      placeholder="1024000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value: ContentStatus) => setForm({ ...form, status: value })}
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

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm({ ...form, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isEditing ? "Update Document" : "Create Document"}
              </Button>
              <Link to="/admin/documents" className="w-full">
                <Button type="button" variant="outline" className="w-full">Cancel</Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
