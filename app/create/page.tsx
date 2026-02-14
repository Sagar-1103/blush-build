"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "./actions";

import { useAuth } from "@/components/auth-context";
import Link from "next/link";
import {
    Heart,
    ArrowLeft,
    ArrowRight,
    Check,
    Sparkles,
    PartyPopper,
    Gift,

    Mail,
    MessageCircleHeart,
    Music,
    Image as ImageIcon,
    Lock,
    Loader2,
} from "lucide-react";

// Template definitions
const TEMPLATES = [
    { id: "confession", label: "Confession", emoji: "💖", icon: MessageCircleHeart, color: "from-rose-400 to-pink-500", desc: "Tell them how you feel" },
    { id: "valentine", label: "Be My Valentine", emoji: "💌", icon: Mail, color: "from-pink-400 to-rose-500", desc: "A classic valentine ask" },
    { id: "proposal", label: "Proposal", emoji: "💍", icon: Sparkles, color: "from-violet-400 to-purple-500", desc: "Pop the big question" },
] as const;

const TEMPLATE_DEFAULTS: Record<string, { main: string; sub: string }> = {
    confession: { main: "I've been hiding this for too long...", sub: "(but I can't keep it secret anymore)" },
    valentine: { main: "Will you be my Valentine? 🌹", sub: "I promise to make it special." },
    proposal: { main: "I want to spend the rest of my life with you.", sub: "Will you marry me? 💍" },
};

const FONTS = [
    { id: "Outfit", label: "Outfit", class: "font-body" },
    { id: "Playfair Display", label: "Playfair", class: "font-display" },
    { id: "Dancing Script", label: "Handwriting", class: "font-handwriting" },
    { id: "Quicksand", label: "Rounded", class: "font-rounded" },
];

type FormData = {
    templateType: string;
    crushName: string;
    mainMessage: string;
    subMessage: string;
    bgColor: string;
    fontStyle: string;
    musicUrl: string;
    successMessage: string;
    interactiveTwist: string; // "none" | "runaway"
    unlockType: string; // "none" | "password" | "nickname" | "love-captcha"
    unlockValue: string;
    photos: string[];
    captchaImages: string[];
};

export default function CreatePage() {
    const router = useRouter();
    const { isAuthenticated, openAuthModal } = useAuth();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        templateType: "",
        crushName: "",
        mainMessage: "I've been likely hiding this for too long...",
        subMessage: "(but I can't keep it secret anymore)",
        bgColor: "",
        fontStyle: "Outfit",
        musicUrl: "",
        successMessage: "You just made me the happiest person! 💕",
        interactiveTwist: "runaway",
        unlockType: "none",
        unlockValue: "",
        photos: [],
        captchaImages: [],
    });

    const [fileCache, setFileCache] = useState<Record<string, File>>({});

    const updateField = useCallback(
        <K extends keyof FormData>(key: K, value: FormData[K]) => {
            setFormData((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const doPublish = async () => {
        setIsSubmitting(true);
        try {
            const { uploadImage } = await import("./upload");

            // Process photos
            const processedPhotos = await Promise.all(
                formData.photos.map(async (url) => {
                    if (fileCache[url]) {
                        const data = new FormData();
                        data.append("file", fileCache[url]);
                        return await uploadImage(data);
                    }
                    return url;
                })
            );

            // Process captcha images
            const processedCaptchas = await Promise.all(
                formData.captchaImages.map(async (url) => {
                    if (fileCache[url]) {
                        const data = new FormData();
                        data.append("file", fileCache[url]);
                        return await uploadImage(data);
                    }
                    return url;
                })
            );

            const result = await createPage({
                ...formData,
                photos: processedPhotos,
                subMessage: formData.subMessage || undefined,
                musicUrl: formData.musicUrl || undefined,
                unlockValue: formData.unlockValue || undefined,
                captchaImages: formData.unlockType === "love-captcha" ? processedCaptchas : undefined,
            });
            router.push(`/dashboard?created=${result.slug}`);
        } catch (error) {
            console.error("Failed to create page:", error);
            alert("Failed to publish page. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (!isAuthenticated) {
            openAuthModal(() => {
                doPublish();
            });
            return;
        }
        doPublish();
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return formData.templateType !== "";
            case 2:
                return formData.crushName.trim() !== "" && formData.mainMessage.trim() !== "";
            case 3:
                // Step 3 is always valid (page protection is optional)
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-[#fff0f3] relative font-sans">


            {/* Top Navigation */}
            <nav className="relative z-50 bg-white/70 backdrop-blur-md border-b border-rose-100/50 sticky top-0">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
                        <div className="bg-rose-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl group-hover:bg-rose-200 transition-colors">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" />
                        </div>
                        <span className="font-display font-bold text-rose-900 text-base sm:text-xl tracking-tight">
                            BlushBuild
                        </span>
                    </Link>

                    <Link
                        href={isAuthenticated ? "/dashboard" : "/"}
                        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-rose-500 font-medium hover:text-rose-700 transition-colors bg-rose-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-rose-100"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Cancel
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 pb-24">
                {/* Progress Steps */}
                {/* Progress Steps */}
                <div className="max-w-xl mx-auto mb-12">
                    <nav aria-label="Progress">
                        <ol role="list" className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-rose-200/20 rounded-full p-1.5 flex items-center justify-between relative overflow-hidden ring-1 ring-rose-100">
                            {[
                                { id: 1, label: "Vibe", icon: Sparkles },
                                { id: 2, label: "Content", icon: Heart },
                                { id: 3, label: "Magic", icon: PartyPopper },
                            ].map((s) => {
                                const isActive = step === s.id;
                                const isCompleted = step > s.id;
                                const Icon = isCompleted ? Check : s.icon;

                                return (
                                    <li key={s.id} className="flex-1">
                                        <button
                                            onClick={() => s.id < step && setStep(s.id)}
                                            disabled={s.id > step}
                                            className={`relative w-full flex items-center justify-center gap-2 px-2 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                                                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-100 ring-2 ring-white"
                                                : isCompleted
                                                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 ring-1 ring-transparent hover:ring-rose-200"
                                                    : "text-rose-300 hover:text-rose-400 hover:bg-rose-50/50"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} />
                                            <span className={`${isActive ? "block" : "hidden sm:block"}`}>
                                                {s.label}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>

                {/* Step Content */}
                <div className="max-w-5xl mx-auto">
                    {step === 1 && <StepTemplate formData={formData} updateField={updateField} />}
                    {step === 2 && (
                        <StepContent
                            formData={formData}
                            updateField={updateField}
                            showPreview={showPreview}
                            setShowPreview={setShowPreview}
                            addFile={(url, file) => setFileCache(prev => ({ ...prev, [url]: file }))}
                        />
                    )}
                    {step === 3 && (
                        <StepButtons
                            formData={formData}
                            updateField={updateField}
                            addFile={(url, file) => setFileCache(prev => ({ ...prev, [url]: file }))}
                        />
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-rose-100 z-50">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex cursor-pointer items-center gap-2 px-6 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button
                                onClick={() => canProceed() && setStep(step + 1)}
                                disabled={!canProceed()}
                                className="flex cursor-pointer items-center gap-2 px-8 py-3 rounded-2xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center cursor-pointer gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-70 shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" /> Publish Page
                                    </>
                                )}
                            </button>
                        )}
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
                <h2 className="text-4xl font-display font-bold text-rose-950 mb-3">Pick your vibe ✨</h2>
                <p className="text-lg text-rose-600/70">What&apos;s the occasion? Choose a style to start.</p>
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
                                    updateField("mainMessage", def.main);
                                    updateField("subMessage", def.sub);
                                }
                            }}
                            className={`group relative p-8 cursor-pointer rounded-3xl border-2 transition-all duration-300 text-left flex flex-col items-start gap-4 ${isSelected
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
    addFile,
}: {
    formData: FormData;
    updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
    showPreview: boolean;
    setShowPreview: (v: boolean) => void;
    addFile: (url: string, file: File) => void;
}) {
    const selectedTemplate = TEMPLATES.find((t) => t.id === formData.templateType);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            addFile(url, file);
            updateField("photos", [...formData.photos, url]);
        }
    };

    return (
        <div className="animate-fade-in-up pb-20">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-display font-bold text-rose-950 mb-3">Make it yours 💌</h2>
                <p className="text-lg text-rose-600/70">Write from the heart.</p>
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
                                        className={`px-4 py-3 cursor-pointer rounded-xl border-2 text-left transition-all flex items-center justify-between ${f.class} ${formData.fontStyle === f.id
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
                                        onChange={onFileSelect}
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
                                className={`p-4 cursor-pointer rounded-2xl border-2 text-left transition-all ${formData.interactiveTwist === "runaway"
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

/* Preview theme tokens per template */
const PREVIEW_THEMES: Record<string, { bg: string; titleColor: string; subtitleColor: string; greetingColor: string; yesBtn: string; noBtn: string; yesEmoji: string; noEmoji: string }> = {
    confession: { bg: "linear-gradient(160deg, #fff1f2 0%, #fdf2f8 40%, #fce7f3 100%)", titleColor: "text-rose-800", subtitleColor: "text-rose-500/70", greetingColor: "text-rose-400", yesBtn: "bg-gradient-to-r from-rose-500 to-pink-500 text-white", noBtn: "bg-white border border-rose-200 text-rose-500", yesEmoji: "💕", noEmoji: "🙈" },
    valentine: { bg: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 30%, #fecdd3 60%, #fdf2f8 100%)", titleColor: "text-red-800", subtitleColor: "text-red-500/70", greetingColor: "text-red-400", yesBtn: "bg-gradient-to-r from-red-500 to-rose-500 text-white", noBtn: "bg-white border border-red-200 text-red-500", yesEmoji: "💘", noEmoji: "💔" },
    proposal: { bg: "linear-gradient(160deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #581c87 100%)", titleColor: "text-white", subtitleColor: "text-amber-200/70", greetingColor: "text-amber-300", yesBtn: "bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-900 font-bold", noBtn: "bg-white/10 border border-amber-400/40 text-amber-200", yesEmoji: "💍", noEmoji: "🥺" },
};

const PREVIEW_GREETINGS: Record<string, string> = {
    confession: "Hey",
    valentine: "Dearest",
    proposal: "My love,",
};

function TemplatePreview({ formData, selectedTemplate }: { formData: FormData; selectedTemplate: typeof TEMPLATES[number] | undefined }) {
    const pt = PREVIEW_THEMES[formData.templateType] || PREVIEW_THEMES.confession;
    const greeting = PREVIEW_GREETINGS[formData.templateType] || "Hey";

    return (
        <div
            className="rounded-3xl border-4 border-white shadow-2xl overflow-hidden transition-all duration-500 relative ring-1 ring-rose-100"
            style={{ background: pt.bg }}
        >
            {/* Phone notch/bar aesthetic */}
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
    addFile,
}: {
    formData: FormData;
    updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
    addFile: (url: string, file: File) => void;
}) {

    const onCaptchaFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            addFile(url, file);
            updateField("captchaImages", [...formData.captchaImages, url]);
        }
    };

    return (
        <div className="animate-fade-in-up max-w-2xl mx-auto pb-20">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-display font-bold text-rose-900 mb-3">Add the Magic ✨</h2>
                <p className="text-lg text-rose-600/70">Final touches before the big reveal.</p>
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
                        What should appear when they click &quot;Yes&quot;? We&apos;ll trigger a confetti explosion!
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
                                className={`p-3 cursor-pointer rounded-xl border transition-all text-sm flex flex-col items-center gap-1 ${(formData.unlockType === opt.id)
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
                                Upload a mix of photos. They&apos;ll have to pick the correct ones (specifically of you or you two together) to unlock the page!
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
                                            onChange={onCaptchaFileSelect}
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

// Icons for toggle
function Pencil(props: any) { return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg> }
function Eye(props: any) { return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg> }
