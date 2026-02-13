"use client";

import { useState, useEffect } from "react";
import { Check, Heart, AlertCircle, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";

// Cute filler images (safe, romantic/neutral)
// Cute filler images (safe, romantic/neutral)
const FILLER_IMAGES = Array.from({ length: 14 }, (_, i) => `/face-${i + 1}.jpg`);

type CaptchaItem = {
    id: string;
    url: string;
    isCorrect: boolean;
};

export function HeartCaptcha({
    correctImages,
    onUnlock,
}: {
    correctImages: string[];
    onUnlock: () => void;
}) {
    const [items, setItems] = useState<CaptchaItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [error, setError] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const [success, setSuccess] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Split images into sections of 3
    const sections: string[][] = [];
    for (let i = 0; i < correctImages.length; i += 3) {
        sections.push(correctImages.slice(i, i + 3));
    }
    const totalSections = sections.length;

    useEffect(() => {
        initializeCaptcha();
    }, [currentSection, correctImages]);

    const initializeCaptcha = () => {
        setIsTransitioning(true);
        const currentCorrectImages = sections[currentSection] || [];

        // 1. Mark correct images for current section
        const correctItems: CaptchaItem[] = currentCorrectImages.map((url, i) => ({
            id: `correct-${i}`,
            url,
            isCorrect: true,
        }));

        // 2. Pick random fillers to fill up to 9 slots
        const slotsNeeded = Math.max(0, 9 - correctItems.length);
        const shuffledFillers = [...FILLER_IMAGES].sort(() => 0.5 - Math.random());
        const selectedFillers = shuffledFillers.slice(0, slotsNeeded).map((url, i) => ({
            id: `filler-${i}`,
            url,
            isCorrect: false,
        }));

        // 3. Combine and shuffle
        const allItems = [...correctItems, ...selectedFillers].sort(
            () => 0.5 - Math.random()
        );

        setTimeout(() => {
            setItems(allItems);
            setSelectedIds(new Set());
            setError(false);
            setIsTransitioning(false);
        }, 300); // Small delay for transition effect
    };

    const toggleSelection = (id: string) => {
        if (success) return;
        setError(false);
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleVerify = () => {
        // Check if all correct items are selected
        const itemsInGrid = items;
        const correctIdsInGrid = itemsInGrid.filter((i) => i.isCorrect).map((i) => i.id);

        // Validation logic:
        // 1. Are ALL correct items in the grid selected?
        const allCorrectSelected = correctIdsInGrid.every((id) => selectedIds.has(id));
        // 2. Are NO wrong items selected? (Strict matching)
        const selectedIdsArray = Array.from(selectedIds);
        const noWrongSelected = selectedIdsArray.every(id => {
            const item = itemsInGrid.find(i => i.id === id);
            return item?.isCorrect;
        });

        if (allCorrectSelected && noWrongSelected && correctIdsInGrid.length > 0) {
            // Section verified successfully
            if (currentSection < totalSections - 1) {
                // Move to next section
                setCurrentSection(currentSection + 1);
            } else {
                // All sections completed
                setSuccess(true);
                setTimeout(() => {
                    onUnlock();
                }, 1000);
            }
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000); // Clear error shake after animation
        }
    };

    if (success) {
        return (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 text-center animate-scale-in flex flex-col items-center justify-center min-h-[360px] border border-rose-100 shadow-2xl shadow-rose-200/50 max-w-[400px] w-full mx-auto">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-gentle ring-8 ring-green-50">
                    <ShieldCheck className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold font-display text-rose-950 mb-2">Verified Successfully!</h3>
                <p className="text-rose-500 font-medium">Allowing access to the heart... 💕</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-3xl shadow-2xl shadow-rose-200/40 overflow-hidden max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] w-full mx-auto transition-all duration-300 ${error ? "animate-shake ring-2 ring-rose-500" : "ring-1 ring-black/5"}`}>
            {/* Elegant Header */}
            <div className="bg-gradient-to-br from-rose-500 via-rose-500 to-pink-600 p-6 sm:p-7 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-100/90">Security Check</h3>
                        {totalSections > 1 && (
                            <div className="flex gap-1.5 items-center bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                                <span className="text-[10px] font-bold tracking-wider">{currentSection + 1} / {totalSections}</span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-display font-bold leading-tight mb-2">Select photos</h2>
                    <p className="text-sm text-rose-50 font-medium leading-relaxed max-w-[90%]">
                        Tap all the images of the person who sent you this.
                    </p>

                    {/* Progress Bar for multiple sections */}
                    {totalSections > 1 && (
                        <div className="mt-5 flex gap-1.5">
                            {Array.from({ length: totalSections }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= currentSection ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "bg-white/20"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Decorative background elements */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-rose-400/30 rounded-full blur-2xl" />
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 bg-white relative">
                {/* Images Grid */}
                <div
                    className={`grid grid-cols-3 gap-2 sm:gap-3 mb-6 transition-opacity duration-300 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                >
                    {items.map((item) => {
                        const isSelected = selectedIds.has(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => toggleSelection(item.id)}
                                className={`group relative aspect-square overflow-hidden cursor-pointer rounded-xl sm:rounded-2xl transition-all duration-300 ease-out outline-none focus-visible:ring-4 focus-visible:ring-rose-200 
                                    ${isSelected
                                        ? "ring-[3px] ring-rose-500 ring-offset-2 ring-offset-white shadow-lg scale-[0.96]"
                                        : "hover:shadow-md hover:scale-[1.02] active:scale-95"
                                    }`}
                                aria-label={isSelected ? "Unselect image" : "Select image"}
                                aria-pressed={isSelected}
                            >
                                <img
                                    src={item.url}
                                    alt="Captcha item"
                                    className={`w-full h-full object-cover transition-transform duration-500 will-change-transform bg-rose-50 ${isSelected ? "scale-105 saturate-110" : "group-hover:scale-110"}`}
                                />

                                {/* Overlay Gradient & Icon */}
                                <div className={`absolute inset-0 transition-opacity duration-200 flex items-center justify-center
                                    ${isSelected ? "opacity-100 bg-rose-500/20 backdrop-blur-[1px]" : "opacity-0 group-hover:opacity-100 bg-black/10"}`}
                                >
                                    {isSelected && (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg transform animate-bounce-gentle border-[2.5px] border-white">
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between gap-3 sm:gap-4 pt-1 border-t border-rose-50/50">
                    {/* Placeholder to keep layout balanced if needed, or just let flex handle it */}
                    <div className="flex-1 flex justify-start h-8 pl-1 gap-2">
                        <button
                            onClick={initializeCaptcha}
                            className="p-2 cursor-pointer bg-slate-50 border border-slate-100 rounded-full text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all active:scale-95 shadow-sm"
                            title="Refresh puzzle"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        {error && (
                            <div className="text-rose-600 text-[10px] sm:text-xs font-bold flex items-center gap-1.5 animate-in slide-in-from-bottom-2 fade-in bg-rose-50 px-3 py-1.5 rounded-full shadow-sm border border-rose-100">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Try again</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleVerify}
                        className="group relative overflow-hidden bg-gradient-to-r from-rose-600 to-pink-600 text-white pl-6 pr-5 py-3 sm:py-3.5 rounded-2xl text-sm font-bold tracking-wide shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2.5 z-10"
                    >
                        <span className="relative z-10 uppercase text-xs sm:text-sm tracking-wider">
                            {currentSection < totalSections - 1 ? "Next" : "Verify"}
                        </span>
                        {currentSection < totalSections - 1 ? (
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 relative z-10" strokeWidth={3} />
                        ) : (
                            <div className="bg-white/20 p-1 rounded-full relative z-10">
                                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={4} />
                            </div>
                        )}

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                    </button>
                </div>
            </div>

            {/* Mobile-friendly safe area spacing at bottom just in case of overlaps */}
            <div className="h-1 bg-white"></div>
        </div>
    );
}
