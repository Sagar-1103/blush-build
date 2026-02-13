"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updatePage, deletePage } from "@/app/create/actions";
import { FloatingHearts } from "@/components/floating-hearts";
import Link from "next/link";
import {
    Heart,
    ArrowLeft,
    Check,
    Sparkles,
    PartyPopper,
    Flower2,
    Mail,
    MessageCircleHeart,
    Music,
    Image as ImageIcon,
    Lock,
    Trash2,
} from "lucide-react";

const TEMPLATES = [
    { id: "confession", label: "Confession", emoji: "💖", icon: MessageCircleHeart, color: "from-rose-400 to-pink-500", desc: "Tell them how you feel" },
    { id: "valentine", label: "Be My Valentine", emoji: "💌", icon: Mail, color: "from-pink-400 to-rose-500", desc: "A classic valentine ask" },
    { id: "birthday", label: "Birthday Surprise", emoji: "🎂", icon: PartyPopper, color: "from-amber-400 to-orange-400", desc: "Make their day special" },
    { id: "proposal", label: "Proposal", emoji: "💍", icon: Sparkles, color: "from-violet-400 to-purple-500", desc: "Pop the big question" },
    { id: "just-because", label: "Just Because", emoji: "🌸", icon: Flower2, color: "from-emerald-400 to-teal-400", desc: "No reason needed" },
] as const;

const TEMPLATE_DEFAULTS: Record<string, { main: string; sub: string }> = {
    confession: { main: "I've been hiding this for too long...", sub: "(but I can't keep it secret anymore)" },
    valentine: { main: "Will you be my Valentine? 🌹", sub: "I promise to make it special." },
    birthday: { main: "Happy Birthday to my favorite person! 🎉", sub: "Here's to another amazing year around the sun." },
    proposal: { main: "I want to spend the rest of my life with you.", sub: "Will you marry me? 💍" },
    "just-because": { main: "Just wanted to remind you how amazing you are.", sub: "You make my world brighter every day." },
};

const FONTS = [
    { id: "Outfit", label: "Outfit", class: "font-body" },
    { id: "Playfair Display", label: "Playfair", class: "font-display" },
    { id: "Dancing Script", label: "Handwriting", class: "font-handwriting" },
    { id: "Quicksand", label: "Rounded", class: "font-rounded" },
];

type PageData = {
    id: string;
    slug: string;
    templateType: string;
    crushName: string;
    mainMessage: string;
    subMessage: string | null;
    bgColor: string;
    fontStyle: string;
    musicUrl: string | null;
    successMessage: string;
    noButtonStyle: string;
    interactiveTwist: string;
    unlockType: string;
    unlockValue: string | null;
    captchaImages: string[] | null;
    photos: { id: string; url: string; order: number }[];
};

type FormData = {
    templateType: string;
    crushName: string;
    mainMessage: string;
    subMessage: string;
    bgColor: string;
    fontStyle: string;
    musicUrl: string;
    successMessage: string;
    interactiveTwist: string;
    unlockType: string;
    unlockValue: string;
    captchaImages: string[];
    photos: string[];
};

export default function EditPageClient({ page }: { page: PageData }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        templateType: page.templateType,
        crushName: page.crushName,
        mainMessage: page.mainMessage,
        subMessage: page.subMessage || "",
        bgColor: page.bgColor,
        fontStyle: page.fontStyle,
        musicUrl: page.musicUrl || "",
        successMessage: page.successMessage,
        interactiveTwist: page.interactiveTwist,
        unlockType: page.unlockType,
        unlockValue: page.unlockValue || "",
        captchaImages: page.captchaImages || [],
        photos: page.photos.map((p) => p.url),
    });

    const updateField = useCallback(
        <K extends keyof FormData>(key: K, value: FormData[K]) => {
            setFormData((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this page? This cannot be undone.")) {
            setIsSubmitting(true);
            try {
                await deletePage(page.id);
                router.push("/dashboard");
                router.refresh();
            } catch (error) {
                console.error("Failed to delete page:", error);
                setIsSubmitting(false);
            }
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await updatePage(page.id, {
                ...formData,
                subMessage: formData.subMessage || undefined,
                musicUrl: formData.musicUrl || undefined,
                unlockValue: formData.unlockValue || undefined,
                interactiveTwist: formData.interactiveTwist,
                captchaImages: formData.unlockType === "love-captcha" ? formData.captchaImages : undefined,
            });
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error("Failed to update page:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff0f3] relative font-sans">
            <FloatingHearts count={8} />

            {/* Top Navigation */}
            <nav className="relative z-50 bg-white/70 backdrop-blur-md border-b border-rose-100/50 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="bg-rose-100 p-2 rounded-xl group-hover:bg-rose-200 transition-colors">
                            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                        </div>
                        <span className="font-display font-bold text-rose-900 text-xl tracking-tight">
                            BlushBuild
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDelete}
                            className="p-2 text-rose-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 group"
                            title="Delete Page"
                        >
                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold hidden sm:inline">Delete</span>
                        </button>
                        <div className="px-4 py-2 bg-rose-50 rounded-full border border-rose-100 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">Editing</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 pb-24">
                {/* Progress Steps */}
                <div className="max-w-2xl mx-auto mb-10">
                    <div className="bg-white/60 backdrop-blur-sm rounded-full p-2 border border-rose-100 shadow-sm flex items-center justify-between relative">
                        <div className="absolute left-2 right-2 h-0.5 bg-rose-100 top-1/2 -z-10" />

                        {[1, 2, 3].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStep(s)}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${s === step
                                    ? "bg-rose-500 text-white shadow-lg shadow-rose-200 ring-2 ring-white"
                                    : "bg-white text-rose-200 ring-2 ring-white hover:text-rose-400"
                                    }`}
                            >
                                {s < step ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px]">{s}</span>}
                                {s === 1 && "Vibe"}
                                {s === 2 && "Content"}
                                {s === 3 && "Magic"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="max-w-5xl mx-auto">
                    {step === 1 && <StepTemplate formData={formData} updateField={updateField} />}
                    {step === 2 && (
                        <StepContent formData={formData} updateField={updateField} showPreview={showPreview} setShowPreview={setShowPreview} />
                    )}
                    {step === 3 && <StepButtons formData={formData} updateField={updateField} />}
                </div>

                {/* Footer Navigation */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-rose-100 z-50">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex gap-2">
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-70 shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin text-lg">✨</span> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ==================== STEP 1: Choose Template ==================== */
function StepTemplate({
    formData,
    updateField,
}: {
    formData: FormData;
    updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
    return (
        <div className="animate-fade-in-up pb-20">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-display font-bold text-rose-950 mb-3">Update your vibe ✨</h2>
                <p className="text-lg text-rose-600/70">Switching things up? Choose a new style.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = formData.templateType === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => {
                                updateField("templateType", t.id);
                                const def = TEMPLATE_DEFAULTS[t.id];
                                if (def) {
                                    // Only update if text is empty/default to avoid overwriting user edits
                                    if (!formData.mainMessage) updateField("mainMessage", def.main);
                                    if (!formData.subMessage) updateField("subMessage", def.sub);
                                }
                            }}
                            className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 text-left flex flex-col items-start gap-4 ${isSelected
                                ? "border-rose-400 bg-white shadow-xl shadow-rose-100/50 scale-[1.02]"
                                : "border-rose-100 bg-white/60 hover:border-rose-300 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                                }`}
                        >
                            <div className="w-full flex justify-between items-start">
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} text-white shadow-md`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                {isSelected && (
                                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200">
                                        <Check className="w-5 h-5 text-white stroke-[3px]" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="font-display font-bold text-rose-950 text-xl mb-1 flex items-center gap-2">
                                    {t.label} <span className="text-2xl">{t.emoji}</span>
                                </h3>
                                <p className="text-sm font-medium text-rose-500/70">{t.desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ==================== STEP 2: Customize Content ==================== */
function StepContent({
    formData,
    updateField,
    showPreview,
    setShowPreview,
}: {
    formData: FormData;
    updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
    showPreview: boolean;
    setShowPreview: (v: boolean) => void;
}) {
    const selectedTemplate = TEMPLATES.find((t) => t.id === formData.templateType);

    return (
        <div className="animate-fade-in-up pb-20">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-display font-bold text-rose-950 mb-3">Refine the details 💌</h2>
                <p className="text-lg text-rose-600/70">Tweaking your message.</p>
            </div>

            {/* Mobile preview toggle */}
            <div className="flex justify-center mb-8 lg:hidden">
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 text-sm px-6 py-3 rounded-full bg-white border border-rose-200 text-rose-600 font-bold shadow-sm active:scale-95 transition-all"
                >
                    {showPreview ? <><Pencil className="w-4 h-4" /> Edit Mode</> : <><Eye className="w-4 h-4" /> Preview Page</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Form */}
                <div className={`space-y-6 ${showPreview ? "hidden lg:block" : ""}`}>

                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-rose-100 shadow-sm space-y-6">
                        {/* Main message */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-rose-900 mb-2">
                                <MessageCircleHeart className="w-4 h-4 text-rose-500" /> Your Message
                            </label>
                            <textarea
                                value={formData.mainMessage}
                                onChange={(e) => updateField("mainMessage", e.target.value)}
                                placeholder="Write something from the heart..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white text-rose-900 placeholder:text-rose-300 focus:ring-4 focus:ring-rose-100 focus:border-rose-300 outline-none transition-all resize-none font-medium"
                            />
                        </div>

                        {/* Sub message */}
                        <div>
                            <label className="block text-sm font-bold text-rose-900 mb-2">
                                Sub Message <span className="font-normal text-rose-400 text-xs ml-1">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.subMessage}
                                onChange={(e) => updateField("subMessage", e.target.value)}
                                placeholder="A little note below..."
                                className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white text-rose-900 placeholder:text-rose-300 focus:ring-4 focus:ring-rose-100 focus:border-rose-300 outline-none transition-all font-medium"
                            />
                        </div>

                        {/* Crush name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-rose-900 mb-2">
                                <Heart className="w-4 h-4 text-rose-500" /> Their Name
                            </label>
                            <input
                                type="text"
                                value={formData.crushName}
                                onChange={(e) => updateField("crushName", e.target.value)}
                                placeholder="e.g. Ananya, Alex..."
                                className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white text-rose-900 placeholder:text-rose-300 focus:ring-4 focus:ring-rose-100 focus:border-rose-300 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-rose-100 shadow-sm space-y-6">
                        {/* Font style */}
                        <div>
                            <label className="block text-sm font-bold text-rose-900 mb-3">Typography Style</label>
                            <div className="grid grid-cols-2 gap-3">
                                {FONTS.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => updateField("fontStyle", f.id)}
                                        className={`px-4 py-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${f.class} ${formData.fontStyle === f.id
                                            ? "border-rose-400 bg-white shadow-md text-rose-900"
                                            : "border-rose-100 bg-white/50 hover:border-rose-200 text-rose-600/70"
                                            }`}
                                    >
                                        <span className="text-lg">{f.label}</span>
                                        {formData.fontStyle === f.id && <Check className="w-4 h-4 text-rose-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-rose-100 shadow-sm space-y-6">
                        {/* Music URL */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-rose-900 mb-2">
                                <Music className="w-4 h-4 text-rose-500" /> Background Music <span className="font-normal text-rose-400 text-xs">(optional)</span>
                            </label>
                            <input
                                type="url"
                                value={formData.musicUrl}
                                onChange={(e) => updateField("musicUrl", e.target.value)}
                                placeholder="Paste a YouTube or MP3 URL..."
                                className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white text-rose-900 placeholder:text-rose-300 focus:ring-4 focus:ring-rose-100 focus:border-rose-300 outline-none transition-all font-medium text-sm"
                            />
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-rose-900 mb-3">
                                <ImageIcon className="w-4 h-4 text-rose-500" /> Photos <span className="font-normal text-rose-400 text-xs">(optional)</span>
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {formData.photos.map((url, idx) => (
                                    <div key={url} className="relative w-24 h-24 rounded-2xl overflow-hidden group border-2 border-white shadow-sm hover:shadow-md transition-all">
                                        <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                const newPhotos = [...formData.photos];
                                                newPhotos.splice(idx, 1);
                                                updateField("photos", newPhotos);
                                            }}
                                            className="absolute inset-0 bg-rose-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white backdrop-blur-[2px]"
                                        >
                                            <div className="bg-white/20 p-1 rounded-full text-xs font-bold">✕</div>
                                        </button>
                                    </div>
                                ))}
                                <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-50 flex flex-col items-center justify-center gap-1 text-rose-400 cursor-pointer transition-all active:scale-95 group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            if (e.target.files?.[0]) {
                                                const file = e.target.files[0];
                                                const data = new FormData();
                                                data.append("file", file);
                                                try {
                                                    const { uploadImage } = await import("@/app/create/upload");
                                                    const url = await uploadImage(data);
                                                    updateField("photos", [...formData.photos, url]);
                                                } catch (err) {
                                                    console.error("Upload failed", err);
                                                    alert("Failed to upload image.");
                                                }
                                            }
                                        }}
                                    />
                                    <span className="text-2xl group-hover:scale-110 transition-transform">+</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Twist Selection */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-rose-900 mb-1">
                                <Sparkles className="w-4 h-4 text-rose-500" /> Interactive Twist
                            </label>
                            <p className="text-xs text-rose-500/70 mb-3">Make the button run away!</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                onClick={() => updateField("interactiveTwist", "runaway")}
                                className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.interactiveTwist === "runaway"
                                    ? "border-rose-400 bg-white shadow-md ring-2 ring-rose-100"
                                    : "border-rose-100 bg-white/40 hover:border-rose-200"
                                    }`}
                            >
                                <span className="text-2xl mb-2 block">🏃💨</span>
                                <span className="font-bold text-rose-900 block text-sm">Runaway Button</span>
                                <p className="text-xs text-rose-500/70 mt-1 leading-snug">The &quot;No&quot; button escapes when clicked!</p>
                            </button>

                            <div className="p-4 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/30 text-left cursor-not-allowed opacity-70">
                                <span className="text-2xl mb-2 block grayscale opacity-50">✨</span>
                                <span className="font-bold text-rose-400 block text-sm">Coming Soon</span>
                                <p className="text-xs text-rose-400/70 mt-1 leading-snug">More magical twists are on the way.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                <div className={`${!showPreview ? "hidden lg:block" : ""}`}>
                    <div className="sticky top-24">
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wide">
                                <Sparkles className="w-3.5 h-3.5" /> Live Preview
                            </div>
                        </div>
                        <TemplatePreview formData={formData} selectedTemplate={selectedTemplate} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const PREVIEW_THEMES: Record<string, { bg: string; titleColor: string; subtitleColor: string; greetingColor: string; yesBtn: string; noBtn: string; yesEmoji: string; noEmoji: string }> = {
    confession: { bg: "linear-gradient(160deg, #fff1f2 0%, #fdf2f8 40%, #fce7f3 100%)", titleColor: "text-rose-800", subtitleColor: "text-rose-500/70", greetingColor: "text-rose-400", yesBtn: "bg-gradient-to-r from-rose-500 to-pink-500 text-white", noBtn: "bg-white border border-rose-200 text-rose-500", yesEmoji: "💕", noEmoji: "🙈" },
    valentine: { bg: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 30%, #fecdd3 60%, #fdf2f8 100%)", titleColor: "text-red-800", subtitleColor: "text-red-500/70", greetingColor: "text-red-400", yesBtn: "bg-gradient-to-r from-red-500 to-rose-500 text-white", noBtn: "bg-white border border-red-200 text-red-500", yesEmoji: "💘", noEmoji: "💔" },
    birthday: { bg: "linear-gradient(150deg, #fffbeb 0%, #fef3c7 25%, #fdf2f8 50%, #fce7f3 75%, #ede9fe 100%)", titleColor: "text-amber-900", subtitleColor: "text-pink-500/70", greetingColor: "text-amber-500", yesBtn: "bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white", noBtn: "bg-white border border-amber-200 text-amber-600", yesEmoji: "🎉", noEmoji: "🥺" },
    proposal: { bg: "linear-gradient(160deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #581c87 100%)", titleColor: "text-white", subtitleColor: "text-amber-200/70", greetingColor: "text-amber-300", yesBtn: "bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-900 font-bold", noBtn: "bg-white/10 border border-amber-400/40 text-amber-200", yesEmoji: "💍", noEmoji: "🥺" },
    "just-because": { bg: "linear-gradient(145deg, #ecfdf5 0%, #d1fae5 30%, #f0fdf4 50%, #f0fdfa 75%, #ecfdf5 100%)", titleColor: "text-emerald-900", subtitleColor: "text-teal-600/70", greetingColor: "text-emerald-500", yesBtn: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white", noBtn: "bg-white border border-emerald-200 text-emerald-600", yesEmoji: "🌸", noEmoji: "🍂" },
};

const PREVIEW_GREETINGS: Record<string, string> = {
    confession: "Hey",
    valentine: "Dearest",
    birthday: "Happy Birthday",
    proposal: "My love,",
    "just-because": "Hey there,",
};

function TemplatePreview({ formData, selectedTemplate }: { formData: FormData; selectedTemplate: typeof TEMPLATES[number] | undefined }) {
    const pt = PREVIEW_THEMES[formData.templateType] || PREVIEW_THEMES.confession;
    const greeting = PREVIEW_GREETINGS[formData.templateType] || "Hey";

    return (
        <div
            className="rounded-3xl border-4 border-white shadow-2xl overflow-hidden transition-all duration-500 relative ring-1 ring-rose-100"
            style={{ background: pt.bg }}
        >
            <div className="absolute top-0 left-0 right-0 h-6 bg-black/5 mx-auto w-1/3 rounded-b-xl backdrop-blur-sm" />

            <div className="p-8 min-h-[500px] flex flex-col items-center justify-center text-center">
                {selectedTemplate && (
                    <span className="text-6xl mb-6 animate-bounce-gentle">{selectedTemplate.emoji}</span>
                )}
                <p className={`text-sm mb-2 font-medium tracking-wide ${pt.greetingColor}`} style={{ fontFamily: formData.fontStyle }}>
                    {greeting} {formData.crushName || "Person"}...
                </p>
                <h3
                    className={`text-3xl font-bold mb-4 leading-snug ${pt.titleColor}`}
                    style={{ fontFamily: formData.fontStyle }}
                >
                    {formData.mainMessage || "Your Message..."}
                </h3>
                {formData.subMessage && (
                    <p className={`mb-8 opacity-90 ${pt.subtitleColor}`} style={{ fontFamily: formData.fontStyle }}>
                        {formData.subMessage}
                    </p>
                )}
                <div className="flex flex-col gap-3 w-full max-w-[200px]">
                    <div className={`px-6 py-3 rounded-xl text-sm font-bold shadow-lg transform hover:scale-105 transition-transform ${pt.yesBtn}`}>
                        {pt.yesEmoji} Yes!
                    </div>
                    <div className={`px-6 py-3 rounded-xl text-sm font-bold ${pt.noBtn}`}>
                        {pt.noEmoji} No
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ==================== STEP 3: Personalize ==================== */
function StepButtons({
    formData,
    updateField,
}: {
    formData: FormData;
    updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
    return (
        <div className="animate-fade-in-up max-w-2xl mx-auto pb-20">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-display font-bold text-rose-900 mb-3">Add the Magic ✨</h2>
                <p className="text-lg text-rose-600/70">Final touches.</p>
            </div>

            <div className="space-y-8">
                {/* ── Section 1: When they say YES ── */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-rose-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <PartyPopper className="w-24 h-24 text-rose-500" />
                    </div>

                    <h3 className="flex items-center gap-2 text-xl font-bold text-rose-900 mb-2">
                        Success Message 🥳
                    </h3>
                    <p className="text-sm text-rose-600/70 mb-6 max-w-md">
                        What should appear when they click &quot;Yes&quot;?
                    </p>
                    <div>
                        <textarea
                            value={formData.successMessage}
                            onChange={(e) => updateField("successMessage", e.target.value)}
                            rows={3}
                            placeholder="You just made me the happiest person! 💕"
                            className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white text-rose-900 placeholder:text-rose-300 focus:ring-4 focus:ring-rose-100 focus:border-rose-300 outline-none transition-all resize-none font-medium"
                        />
                    </div>
                </div>

                {/* ── Section 2: Page Protection ── */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-rose-100 shadow-sm">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-rose-900 mb-2">
                        <Lock className="w-5 h-5 text-rose-500" /> Privacy & Protection
                    </h3>
                    <p className="text-sm text-rose-600/70 mb-6">
                        Want to make sure only <em>they</em> can access it?
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/50 p-2 rounded-2xl border border-rose-100 mb-6">
                        {[
                            { id: "none", label: "Open", emoji: "🔓" },
                            { id: "password", label: "Password", emoji: "🔑" },
                            { id: "nickname", label: "Nickname", emoji: "💝" },
                            { id: "love-captcha", label: "Puzzle", emoji: "🧩" },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => updateField("unlockType", opt.id)}
                                className={`p-3 rounded-xl border transition-all text-sm flex flex-col items-center gap-1 ${(formData.unlockType === opt.id)
                                    ? "border-rose-400 bg-white shadow-md text-rose-900 font-bold"
                                    : "border-transparent text-rose-600/70 hover:bg-white/60 hover:text-rose-800"
                                    }`}
                            >
                                <span className="text-xl">{opt.emoji}</span>
                                <span>{opt.label}</span>
                            </button>
                        ))}
                    </div>

                    {(formData.unlockType === "password" || formData.unlockType === "nickname") && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-bold text-rose-900 mb-2">
                                {formData.unlockType === "password" ? "Set Secret Password" : "Enter Their Nickname"}
                            </label>
                            <input
                                type={formData.unlockType === "password" ? "password" : "text"}
                                value={formData.unlockValue}
                                onChange={(e) => updateField("unlockValue", e.target.value)}
                                placeholder={
                                    formData.unlockType === "password"
                                        ? "e.g. 1234 or ouranniversary"
                                        : "e.g. Pookie, Babe..."
                                }
                                className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white text-rose-900 placeholder:text-rose-300 focus:ring-4 focus:ring-rose-100 focus:border-rose-300 outline-none transition-all font-medium"
                            />
                        </div>
                    )}

                    {formData.unlockType === "love-captcha" && (
                        <div className="animate-fade-in bg-rose-50/50 border border-rose-100 rounded-2xl p-5">
                            <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Upload Puzzle Photos
                            </h4>
                            <p className="text-sm text-rose-600/80 mb-4 leading-relaxed">
                                Upload photos for them to find.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {formData.captchaImages.map((url, idx) => (
                                    <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden group border-2 border-white shadow-sm">
                                        <img src={url} alt="Captcha" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                const newImages = [...formData.captchaImages];
                                                newImages.splice(idx, 1);
                                                updateField("captchaImages", newImages);
                                            }}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                        >
                                            <div className="bg-white/20 p-1 rounded-full text-xs font-bold">✕</div>
                                        </button>
                                    </div>
                                ))}
                                {formData.captchaImages.length < 9 && (
                                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-rose-300 flex flex-col items-center justify-center text-rose-400 cursor-pointer hover:bg-rose-50 hover:border-rose-400 transition-colors bg-white/50 hover:-translate-y-0.5">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                if (e.target.files?.[0]) {
                                                    const file = e.target.files[0];
                                                    const data = new FormData();
                                                    data.append("file", file);
                                                    try {
                                                        const { uploadImage } = await import("@/app/create/upload");
                                                        const url = await uploadImage(data);
                                                        updateField("captchaImages", [...formData.captchaImages, url]);
                                                    } catch (err) {
                                                        console.error("Upload failed", err);
                                                        alert("Failed to upload image.");
                                                    }
                                                }
                                            }}
                                        />
                                        <span className="text-xl font-bold">+</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Icons
function Pencil(props: any) { return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg> }
function Eye(props: any) { return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg> }
