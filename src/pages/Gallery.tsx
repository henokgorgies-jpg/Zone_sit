
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Image as ImageIcon, Video, Play, Maximize2, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type MediaItem = {
    id: string;
    title: string;
    description: string | null;
    type: 'photo' | 'video';
    url: string;
    thumbnail_url: string | null;
    category: string | null;
    status: string;
};

const Gallery = () => {
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const { t } = useTranslation();

    const { data: media, isLoading } = useQuery({
        queryKey: ["media-public"],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from("media")
                .select("*")
                .eq("status", "published")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data as MediaItem[];
        },
    });

    const photos = media?.filter(m => m.type === 'photo') || [];
    const videos = media?.filter(m => m.type === 'video') || [];

    const MediaCard = ({ item }: { item: MediaItem }) => (
        <Card className="overflow-hidden group cursor-pointer border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-white" onClick={() => setSelectedItem(item)}>
            <CardContent className="p-0 relative aspect-square sm:aspect-video overflow-hidden">
                <img
                    src={item.type === 'photo' ? item.url : (item.thumbnail_url || 'https://images.unsplash.com/photo-1492691523567-307303bea390?auto=format&fit=crop&q=80')}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {item.type === 'video' ? (
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                            <Play className="h-8 w-8 text-white fill-white" />
                        </div>
                    ) : (
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                            <Maximize2 className="h-8 w-8 text-white" />
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-bold truncate">{item.title}</p>
                    {item.category && <p className="text-white/70 text-xs">{item.category}</p>}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Gallery Header */}
            <div className="bg-white border-b py-16 sm:py-24 mb-12">
                <div className="gov-container max-w-6xl">
                    <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                        <ImageIcon className="h-4 w-4" /> {t('gallery.mediaCenter')}
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-6 uppercase">{t('gallery.title')}</h1>
                    <div className="h-2 w-24 bg-primary rounded-full mb-8" />
                    <p className="text-xl text-slate-500 font-medium max-w-3xl leading-relaxed">
                        {t('gallery.subtitle')}
                    </p>
                </div>
            </div>

            <div className="gov-container max-w-6xl pb-32">
                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-8 bg-white border p-1 rounded-full h-auto">
                            <TabsTrigger value="all" className="rounded-full px-8 py-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">{t('gallery.allMedia')}</TabsTrigger>
                            <TabsTrigger value="photos" className="rounded-full px-8 py-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">{t('gallery.photos')}</TabsTrigger>
                            <TabsTrigger value="videos" className="rounded-full px-8 py-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">{t('gallery.videos')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {media?.map(item => <MediaCard key={item.id} item={item} />)}
                                {(!media || media.length === 0) && <p className="col-span-full text-center py-12 text-slate-400 font-medium">{t('gallery.noMediaFound')}</p>}
                            </div>
                        </TabsContent>

                        <TabsContent value="photos">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {photos.map(item => <MediaCard key={item.id} item={item} />)}
                                {photos.length === 0 && <p className="col-span-full text-center py-12 text-slate-400 font-medium">{t('gallery.noPhotosFound')}</p>}
                            </div>
                        </TabsContent>

                        <TabsContent value="videos">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map(item => <MediaCard key={item.id} item={item} />)}
                                {videos.length === 0 && <p className="col-span-full text-center py-12 text-slate-400 font-medium">{t('gallery.noVideosFound')}</p>}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-5xl bg-black/95 border-none p-0 overflow-hidden rounded-[2rem]">
                    <div className="relative w-full h-[80vh] flex flex-col">
                        <div className="absolute top-4 right-4 z-50">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => setSelectedItem(null)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 flex items-center justify-center p-4">
                            {selectedItem?.type === 'photo' ? (
                                <img src={selectedItem.url} alt={selectedItem.title} className="max-h-full max-w-full object-contain shadow-2xl rounded-lg" />
                            ) : selectedItem?.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    {selectedItem.url.includes('youtube.com') || selectedItem.url.includes('youtu.be') ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${selectedItem.url.split('v=')[1]?.split('&')[0] || selectedItem.url.split('/').pop()}`}
                                            className="w-full h-full rounded-xl border-none shadow-2xl"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <video src={selectedItem.url} controls className="max-h-full max-w-full rounded-xl shadow-2xl" />
                                    )}
                                </div>
                            ) : null}
                        </div>

                        <div className="bg-brand-900/50 backdrop-blur-xl p-8 text-white border-t border-white/10">
                            <div className="max-w-3xl mx-auto space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedItem?.type}</span>
                                    {selectedItem?.category && <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{selectedItem.category}</span>}
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tight">{selectedItem?.title}</h2>
                                <p className="text-white/70 font-medium leading-relaxed">{selectedItem?.description}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Gallery;
