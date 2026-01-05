import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Settings2, Eye, Code } from "lucide-react";
import {
    BlockType,
    VersionedBlock,
    BLOCK_DEFAULTS,
    BLOCK_ICONS
} from "./types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import BlockRenderer from "./BlockRenderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageBuilderProps {
    value: string;
    onChange: (value: string) => void;
}

const PageBuilder: React.FC<PageBuilderProps> = ({ value, onChange }) => {
    const [blocks, setBlocks] = useState<VersionedBlock[]>([]);
    const [activeBlock, setActiveBlock] = useState<string | null>(null);

    useEffect(() => {
        try {
            const parsed = JSON.parse(value || "[]");
            setBlocks(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
            setBlocks([]);
        }
    }, [value]);

    const updateBlocks = (newBlocks: VersionedBlock[]) => {
        setBlocks(newBlocks);
        onChange(JSON.stringify(newBlocks));
    };

    const addBlock = (type: BlockType) => {
        const newBlock: VersionedBlock = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: { ...BLOCK_DEFAULTS[type] },
            settings: {}
        };
        updateBlocks([...blocks, newBlock]);
    };

    const removeBlock = (id: string) => {
        updateBlocks(blocks.filter((b) => b.id !== id));
    };

    const updateBlockContent = (id: string, content: any) => {
        updateBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
    };

    const updateBlockSettings = (id: string, settings: any) => {
        updateBlocks(blocks.map((b) => (b.id === id ? { ...b, settings: { ...b.settings, ...settings } } : b)));
    };

    const moveBlock = (id: string, direction: "up" | "down") => {
        const index = blocks.findIndex((b) => b.id === id);
        if (index === -1) return;
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        updateBlocks(newBlocks);
    };

    return (
        <div className="space-y-6 bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-200 shadow-inner">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Page Canvas</h3>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-full shadow-sm bg-white">
                                <Plus className="h-4 w-4 mr-2" /> Add Widget
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl rounded-[2.5rem]">
                            <DialogHeader>
                                <DialogTitle>Select Widget Type</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                                {(Object.keys(BLOCK_ICONS) as BlockType[]).map((type) => {
                                    const Icon = BLOCK_ICONS[type];
                                    return (
                                        <Button
                                            key={type}
                                            variant="outline"
                                            className="h-24 flex flex-col items-center justify-center gap-2 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all"
                                            onClick={() => addBlock(type)}
                                        >
                                            <Icon className="h-6 w-6 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-tight truncate w-full text-center">
                                                {type.replace("-", " ")}
                                            </span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="space-y-4 min-h-[400px]">
                {blocks.length === 0 ? (
                    <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white text-slate-300">
                        <Plus className="h-12 w-12 mb-4 opacity-20" />
                        <p className="font-bold uppercase tracking-widest text-xs">Drop your first widget here</p>
                    </div>
                ) : (
                    blocks.map((block, index) => {
                        const Icon = BLOCK_ICONS[block.type];
                        return (
                            <Card key={block.id} className="relative group border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] overflow-hidden bg-white">
                                <div className="flex items-center gap-4 p-4 border-b border-slate-50 bg-slate-50/50">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{block.type}</p>
                                        <p className="text-xs font-bold truncate max-w-[200px]">
                                            {block.type === 'paragraph' || block.type === 'heading' ? block.content.text : block.id}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => moveBlock(block.id, "up")} disabled={index === 0}>
                                            <GripVertical className="h-4 w-4 opacity-40 rotate-180" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => moveBlock(block.id, "down")} disabled={index === blocks.length - 1}>
                                            <GripVertical className="h-4 w-4 opacity-40" />
                                        </Button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Settings2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl rounded-[2.5rem]">
                                                <DialogHeader>
                                                    <DialogTitle>Configure {block.type.toUpperCase()}</DialogTitle>
                                                </DialogHeader>
                                                <Tabs defaultValue="content" className="mt-4">
                                                    <TabsList className="bg-slate-100 rounded-full p-1 mb-6">
                                                        <TabsTrigger value="content" className="rounded-full px-6 py-2 font-bold uppercase text-[10px]">Content</TabsTrigger>
                                                        <TabsTrigger value="design" className="rounded-full px-6 py-2 font-bold uppercase text-[10px]">Design</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="content" className="space-y-4">
                                                        {block.type === 'paragraph' && (
                                                            <div className="space-y-2">
                                                                <Label>Text Content</Label>
                                                                <Textarea
                                                                    value={block.content.text}
                                                                    onChange={(e) => updateBlockContent(block.id, { ...block.content, text: e.target.value })}
                                                                    rows={5}
                                                                />
                                                            </div>
                                                        )}
                                                        {block.type === 'heading' && (
                                                            <>
                                                                <div className="space-y-2">
                                                                    <Label>Heading Text</Label>
                                                                    <Input
                                                                        value={block.content.text}
                                                                        onChange={(e) => updateBlockContent(block.id, { ...block.content, text: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Level</Label>
                                                                    <Select
                                                                        value={String(block.content.level)}
                                                                        onValueChange={(v) => updateBlockContent(block.id, { ...block.content, level: parseInt(v) })}
                                                                    >
                                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                                        <SelectContent>
                                                                            {[1, 2, 3, 4, 5, 6].map(l => <SelectItem key={l} value={String(l)}>H{l}</SelectItem>)}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </>
                                                        )}
                                                        {block.type === 'image' && (
                                                            <>
                                                                <div className="space-y-2">
                                                                    <Label>Image URL</Label>
                                                                    <Input
                                                                        value={block.content.url}
                                                                        onChange={(e) => updateBlockContent(block.id, { ...block.content, url: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Alt Text</Label>
                                                                    <Input
                                                                        value={block.content.alt}
                                                                        onChange={(e) => updateBlockContent(block.content.id, { ...block.content, alt: e.target.value })}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                        {block.type === 'mandate' && (
                                                            <>
                                                                <div className="space-y-2">
                                                                    <Label>Mandate Title</Label>
                                                                    <Input
                                                                        value={block.content.title}
                                                                        onChange={(e) => updateBlockContent(block.id, { ...block.content, title: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Mandate Content</Label>
                                                                    <Textarea
                                                                        value={block.content.content}
                                                                        onChange={(e) => updateBlockContent(block.id, { ...block.content, content: e.target.value })}
                                                                        rows={4}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                        {/* Add more content editors as needed */}
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase text-center py-4 border-2 border-dashed rounded-2xl">Visual editor for {block.type} is partial</p>
                                                    </TabsContent>
                                                    <TabsContent value="design" className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Text Color</Label>
                                                                <Input type="color" value={block.settings?.color || "#000000"} onChange={(e) => updateBlockSettings(block.id, { color: e.target.value })} />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Background Color</Label>
                                                                <Input type="color" value={block.settings?.backgroundColor || "#ffffff"} onChange={(e) => updateBlockSettings(block.id, { backgroundColor: e.target.value })} />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Alignment</Label>
                                                                <Select value={block.settings?.textAlign || "left"} onValueChange={(v) => updateBlockSettings(block.id, { textAlign: v })}>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="left">Left</SelectItem>
                                                                        <SelectItem value="center">Center</SelectItem>
                                                                        <SelectItem value="right">Right</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Border Radius (px)</Label>
                                                                <Input type="number" value={block.settings?.borderRadius || 0} onChange={(e) => updateBlockSettings(block.id, { borderRadius: parseInt(e.target.value) })} />
                                                            </div>
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="ghost" size="icon" onClick={() => removeBlock(block.id)} className="text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-8 max-h-[200px] overflow-hidden opacity-40 grayscale pointer-events-none scale-[0.98] origin-top bg-white">
                                    <BlockRenderer content={[block]} />
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            <div className="flex justify-center pt-8 border-t border-slate-200">
                <Tabs defaultValue="canvas" className="w-full">
                    <TabsList className="bg-slate-200 rounded-full p-1 mx-auto block w-fit mb-8">
                        <TabsTrigger value="canvas" className="rounded-full px-8 py-2 font-black uppercase text-[10px]"><Eye className="h-3 w-3 mr-2" /> Visual Canvas</TabsTrigger>
                        <TabsTrigger value="preview" className="rounded-full px-8 py-2 font-black uppercase text-[10px]"><Eye className="h-3 w-3 mr-2" /> Live Preview</TabsTrigger>
                        <TabsTrigger value="json" className="rounded-full px-8 py-2 font-black uppercase text-[10px]"><Code className="h-3 w-3 mr-2" /> JSON State</TabsTrigger>
                    </TabsList>
                    <TabsContent value="canvas">
                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Add widgets above to design the page</p>
                    </TabsContent>
                    <TabsContent value="preview" className="p-12 bg-white rounded-[3rem] shadow-2xl border-2 border-slate-100 min-h-[400px]">
                        <BlockRenderer content={blocks} />
                    </TabsContent>
                    <TabsContent value="json">
                        <pre className="p-8 bg-slate-900 text-green-400 text-xs rounded-3xl overflow-auto max-h-[400px]">
                            {JSON.stringify(blocks, null, 2)}
                        </pre>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PageBuilder;
