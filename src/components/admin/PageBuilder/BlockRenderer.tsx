import React from "react";
import { VersionedBlock, BlockType } from "./types";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockRendererProps {
    content: string | any[];
    className?: string;
}

const getIcon = (name: string): LucideIcon | null => {
    const icons = LucideIcons as any;
    return icons[name] || null;
};

const BlockComponent = ({ block }: { block: VersionedBlock }) => {
    const settings = block.settings || {};
    const style = {
        color: settings.color,
        backgroundColor: settings.backgroundColor,
        textAlign: settings.textAlign,
        fontSize: settings.fontSize,
        fontWeight: settings.fontWeight,
        borderRadius: settings.borderRadius,
        borderWidth: settings.borderWidth,
        borderColor: settings.borderColor,
        ...settings.style,
    } as React.CSSProperties;

    const animationClass = settings.animation ? `animate-${settings.animation}` : "";

    switch (block.type) {
        case "paragraph":
            return (
                <p style={style} className={cn("leading-relaxed", animationClass, settings.className)}>
                    {block.content.text}
                </p>
            );
        case "heading": {
            const Tag = `h${block.content.level || 2}` as keyof JSX.IntrinsicElements;
            return (
                <Tag style={style} className={cn("font-bold tracking-tight", animationClass, settings.className)}>
                    {block.content.text}
                </Tag>
            );
        }
        case "image":
            return (
                <div style={style} className={cn("overflow-hidden", animationClass, settings.className)}>
                    <img
                        src={block.content.url}
                        alt={block.content.alt || ""}
                        className="w-full h-auto object-cover"
                        style={{ borderRadius: settings.borderRadius }}
                    />
                </div>
            );
        case "button":
            return (
                <a
                    href={block.content.url || "#"}
                    style={style}
                    className={cn(
                        "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all",
                        block.content.variant === "outline" ? "border-2 border-primary text-primary hover:bg-primary/5" : "bg-primary text-primary-foreground hover:bg-primary/90",
                        animationClass,
                        settings.className
                    )}
                >
                    {block.content.label}
                </a>
            );
        case "icon": {
            const Icon = getIcon(block.content.name);
            return Icon ? (
                <Icon
                    style={style}
                    size={block.content.size || 24}
                    color={block.content.color || "currentColor"}
                    className={cn(animationClass, settings.className)}
                />
            ) : null;
        }
        case "section":
            return (
                <section style={style} className={cn("py-12", animationClass, settings.className)}>
                    <BlockRenderer content={block.content.blocks || []} />
                </section>
            );
        case "columns":
            return (
                <div
                    style={{ ...style, gridTemplateColumns: `repeat(${block.content.cols || 2}, 1fr)` }}
                    className={cn("grid gap-6", animationClass, settings.className)}
                >
                    {(block.content.blocks || []).map((colBlocks: any[], idx: number) => (
                        <div key={idx}>
                            <BlockRenderer content={colBlocks} />
                        </div>
                    ))}
                </div>
            );
        case "spacer":
            return <div style={{ height: block.content.height || 40, ...style }} className={cn(animationClass, settings.className)} />;
        case "divider":
            return (
                <hr
                    style={{
                        borderTop: `${block.content.thickness || 1}px solid ${block.content.color || "currentColor"}`,
                        width: block.content.width || "100%",
                        ...style
                    }}
                    className={cn("my-4", animationClass, settings.className)}
                />
            );
        case "mandate":
            return (
                <div style={style} className={cn("p-8 rounded-[2.5rem] bg-slate-100 border border-slate-200", animationClass, settings.className)}>
                    <h4 className="text-xl font-black mb-4 uppercase tracking-wider">{block.content.title}</h4>
                    <p className="text-slate-600 leading-relaxed font-medium">{block.content.content}</p>
                </div>
            );
        default:
            return (
                <div className="p-4 bg-slate-100 border border-dashed text-slate-400 text-xs rounded-lg">
                    Block Type: {block.type} (Rendering not implemented yet)
                </div>
            );
    }
};

const BlockRenderer: React.FC<BlockRendererProps> = ({ content, className }) => {
    const blocks = typeof content === "string" ? JSON.parse(content || "[]") : content;

    if (!Array.isArray(blocks)) return null;

    return (
        <div className={cn("space-y-6", className)}>
            {blocks.map((block: VersionedBlock) => (
                <BlockComponent key={block.id} block={block} />
            ))}
        </div>
    );
};

export default BlockRenderer;
