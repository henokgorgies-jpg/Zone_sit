import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value: string;
  onChange: (url: string, type?: string, size?: number) => void;
  bucket?: string;
  label?: string;
  accept?: string;
  className?: string;
}

export const FileUpload = ({ 
  value, 
  onChange, 
  bucket = "documents", 
  label = "Protocol/File Source",
  accept = "*",
  className 
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select a file to upload.");
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop()?.toUpperCase();
      const fileSize = file.size;
      const filePath = `${Math.random()}.${fileExt?.toLowerCase()}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      let { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Ensure public access segment is included
      if (publicUrl.includes('/storage/v1/object/') && !publicUrl.includes('/storage/v1/object/public/')) {
        publicUrl = publicUrl.replace('/storage/v1/object/', '/storage/v1/object/public/');
      }

      onChange(publicUrl, fileExt, fileSize);
      toast({ title: "Transmit Success", description: "Protocol file uploaded to the secure grid." });
    } catch (error: any) {
      toast({ 
        title: "Transmission Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</Label>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Input 
            placeholder="Protocol URL or local deployment..." 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="pr-10 h-12 bg-white/5 border-slate-200"
          />
          {value && (
             <button 
                onClick={() => onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-destructive transition-all"
             >
                <X className="h-4 w-4" />
             </button>
          )}
        </div>
        
        <div className="relative">
          <Input
            type="file"
            accept={accept}
            onChange={handleUpload}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
          />
          <Button 
            variant="outline" 
            className={cn(
                "gap-3 h-12 border-2 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all",
                uploading && "animate-pulse"
            )}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <UploadCloud className="h-4 w-4 text-primary" />}
            <span className="text-[10px] font-black uppercase tracking-widest">Deploy Local</span>
          </Button>
        </div>
      </div>
      
      {value && (
         <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 bg-slate-50 mt-2 animate-in fade-in zoom-in-95 duration-300">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Active Protocol Link</p>
                <p className="text-xs text-slate-500 truncate font-mono">{value}</p>
            </div>
         </div>
      )}
    </div>
  );
};
