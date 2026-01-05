import {
    LucideIcon, Type, Image as ImageIcon, Box, ExternalLink, Hash,
    Minus, Space, Video, MapPin, Columns, List, ChevronRight,
    MessageSquare, Layout, Navigation, Search, Flag, Link as LinkIcon,
    ArrowUp, Archive, FileCheck, Info, Star, Timer, BarChart,
    FileDown, Upload, FormInput, MessageCircle, ClipboardList,
    Lock, GalleryHorizontal, Layers, PlayCircle, Share2,
    Copyright, Clock, Mail, Languages, Code, TextSelect, Newspaper, Scale, ShieldCheck
} from "lucide-react";

export type BlockType =
    | "paragraph" | "heading" | "image" | "button" | "icon" | "icon-box"
    | "divider" | "spacer" | "video" | "google-maps"
    | "section" | "columns" | "tabs" | "accordion" | "toggle" | "timeline"
    | "nav-menu" | "breadcrumbs" | "search-form" | "site-logo" | "page-title" | "anchor" | "back-to-top"
    | "posts-list" | "portfolio" | "featured-image"
    | "cta" | "alert" | "testimonial" | "counter" | "progress-bar" | "table" | "download-button" | "file-upload"
    | "form" | "feedback-form" | "survey-form" | "login-form"
    | "carousel" | "gallery" | "slides" | "video-playlist" | "lottie"
    | "social-icons" | "copyright" | "info-box" | "opening-hours" | "contact-box"
    | "language-switcher" | "html" | "text-size" | "mandate";

export interface VersionedBlock {
    id: string;
    type: BlockType;
    content: any;
    settings?: {
        // Style settings
        color?: string;
        backgroundColor?: string;
        textAlign?: "left" | "center" | "right" | "justify";
        fontSize?: string;
        fontWeight?: string;
        borderRadius?: string | number;
        borderWidth?: string | number;
        borderColor?: string;

        // Advanced settings
        padding?: { top: number; right: number; bottom: number; left: number };
        margin?: { top: number; right: number; bottom: number; left: number };
        zIndex?: number;
        className?: string;
        animation?: string;
        responsiveVisibility?: { mobile: boolean; tablet: boolean; desktop: boolean };
        style?: React.CSSProperties;
    };
}

export const BLOCK_DEFAULTS: Record<BlockType, any> = {
    paragraph: { text: "Enter your text here..." },
    heading: { text: "New Heading", level: 2 },
    image: { url: "https://images.unsplash.com/photo-1488590528505-98d2b5958447", alt: "Placeholder image" },
    button: { label: "Click Here", url: "#", variant: "default" },
    icon: { name: "Activity", size: 48, color: "currentColor" },
    "icon-box": { title: "Feature Title", description: "Describe your feature here.", icon: "Star" },
    divider: { thickness: 1, color: "currentColor", width: "100%" },
    spacer: { height: 40 },
    video: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    "google-maps": { location: "London", zoom: 14 },
    section: { blocks: [] },
    columns: { cols: 2, blocks: [[], []] },
    tabs: { items: [{ title: "Tab 1", content: "Content 1" }] },
    accordion: { items: [{ title: "Section 1", content: "Content 1" }] },
    toggle: { title: "Toggle Me", content: "Secret content" },
    timeline: { steps: [{ date: "2024", title: "Project Start" }] },
    "nav-menu": { items: [] },
    breadcrumbs: { showHome: true },
    "search-form": { placeholder: "Search the portal..." },
    "site-logo": { size: 40 },
    "page-title": { showSubtitle: true },
    anchor: { name: "section-1" },
    "back-to-top": { position: "bottom-right" },
    "posts-list": { limit: 3, category: "all" },
    portfolio: { items: [] },
    "featured-image": { height: 400 },
    cta: { title: "Join Us", description: "Be part of our community.", buttonLabel: "Join Now", url: "#" },
    alert: { type: "info", message: "This is an important update." },
    testimonial: { quote: "Excellent service!", author: "Citizen", title: "Business Owner" },
    counter: { end: 100, suffix: "+", label: "Completed Projects" },
    "progress-bar": { value: 75, label: "Efficiency" },
    table: { rows: 3, cols: 3, data: [] },
    "download-button": { label: "Download Guide (PDF)", url: "#", size: "1.2MB" },
    "file-upload": { label: "Upload Document", accept: ".pdf,.doc" },
    form: { fields: [] },
    "feedback-form": { title: "Submit Feedback" },
    "survey-form": { title: "Community Survey" },
    "login-form": { redirectUrl: "/dashboard" },
    carousel: { items: [] },
    gallery: { images: [] },
    slides: { items: [] },
    "video-playlist": { videos: [] },
    lottie: { url: "" },
    "social-icons": { platforms: ["Facebook", "Twitter", "Instagram"] },
    copyright: { text: "All rights reserved." },
    "info-box": { title: "Office Address", content: "123 Gov St, City" },
    "opening-hours": { hours: "Mon-Fri: 9am - 5pm" },
    "contact-box": { phone: "+1 234 567", email: "contact@gov.org" },
    "language-switcher": { languages: ["EN", "ES", "FR"] },
    html: { code: "<div>Raw HTML</div>" },
    "text-size": { default: 16 },
    mandate: { title: "Legal Mandate", content: "Empowered by Act 45-B to regulate and oversee public infrastructure." }
};

export const BLOCK_ICONS: Record<BlockType, LucideIcon> = {
    paragraph: Type,
    heading: Hash,
    image: ImageIcon,
    button: ExternalLink,
    icon: Box,
    "icon-box": Archive,
    divider: Minus,
    spacer: Space,
    video: Video,
    "google-maps": MapPin,
    section: Layout,
    columns: Columns,
    tabs: List,
    accordion: List,
    toggle: ChevronRight,
    timeline: Timer,
    "nav-menu": Navigation,
    breadcrumbs: Navigation,
    "search-form": Search,
    "site-logo": Flag,
    "page-title": Type,
    anchor: LinkIcon,
    "back-to-top": ArrowUp,
    "posts-list": Newspaper,
    portfolio: ImageIcon,
    "featured-image": ImageIcon,
    cta: MessageSquare,
    alert: Info,
    testimonial: Star,
    counter: Hash,
    "progress-bar": BarChart,
    table: List,
    "download-button": FileDown,
    "file-upload": Upload,
    form: FormInput,
    "feedback-form": MessageCircle,
    "survey-form": ClipboardList,
    "login-form": Lock,
    carousel: GalleryHorizontal,
    gallery: ImageIcon,
    slides: Layers,
    "video-playlist": PlayCircle,
    lottie: Star,
    "social-icons": Share2,
    copyright: Copyright,
    "info-box": Info,
    "opening-hours": Clock,
    "contact-box": Mail,
    "language-switcher": Languages,
    html: Code,
    "text-size": TextSelect,
    mandate: Scale
};
