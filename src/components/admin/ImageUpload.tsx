import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, UploadCloud, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
  className?: string;
}

export const ImageUpload = ({ 
  value, 
  onChange, 
  bucket = "media", 
  label = "Image Source",
  className 
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${Math.random()}.${fileExt}`;

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

      onChange(publicUrl);
      toast({ title: "Upload Success", description: "Image uploaded successfully." });
    } catch (error: any) {
      toast({ 
        title: "Upload Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-xs uppercase font-bold tracking-widest text-slate-400">{label}</Label>
      <div className="flex gap-3">
        <div className="relative flex-1 group">
          <Input 
            placeholder="Image URL or local upload..." 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="pr-10"
          />
          {value && (
             <button 
                onClick={() => onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-destructive group-hover:scale-110 transition-all"
             >
                <X className="h-4 w-4" />
             </button>
          )}
        </div>
        
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
          />
          <Button 
            variant="outline" 
            className={cn(
                "gap-2 px-4 h-10 border-dashed border-2 hover:bg-slate-50 transition-colors",
                uploading && "animate-pulse"
            )}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <UploadCloud className="h-4 w-4 text-slate-500" />}
            <span className="text-xs font-bold uppercase tracking-widest">Local</span>
          </Button>
        </div>
      </div>
      
      {value && (
         <div className="relative group aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 mt-2">
            <img 
                src={value} 
                alt="Upload Preview" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                    <Camera className="h-6 w-6 text-white" />
                 </div>
            </div>
         </div>
      )}
    </div>
  );
};
