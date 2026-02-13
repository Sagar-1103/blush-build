"use client";

import { useState, useEffect } from "react";
import { Check, Heart, RefreshCw, AlertCircle } from "lucide-react";

// Cute filler images (safe, romantic/neutral)
const FILLER_IMAGES = [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80", // Cats
    "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?w=400&q=80", // Flowers
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80", // Rose
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80", // Heart hands
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80", // Love balloon
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", // Shopping/Fashion (random)
    "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=80", // Gift
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80", // Cat
    "https://images.unsplash.com/photo-1595267995581-2b9623835694?w=400&q=80", // Bear
    "https://images.unsplash.com/photo-1582562124811-c09040d0a911?w=400&q=80", // Coffee
];

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
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        initializeCaptcha();
    }, [correctImages]);

    const initializeCaptcha = () => {
        // 1. Mark correct images
        const correctItems: CaptchaItem[] = correctImages.map((url, i) => ({
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

        setItems(allItems);
        setSelectedIds(new Set());
        setError(false);
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
        const correctIds = items.filter((i) => i.isCorrect).map((i) => i.id);
        const selectedIdArray = Array.from(selectedIds);

        const allCorrectSelected = correctIds.every((id) => selectedIds.has(id));
        const noWrongSelected = selectedIdArray.every((id) =>
            items.find((i) => i.id === id)?.isCorrect
        );

        if (allCorrectSelected && noWrongSelected) {
            setSuccess(true);
            setTimeout(() => {
                onUnlock();
            }, 1000);
        } else {
            setError(true);
            // Shake effect handled by parent or CSS
        }
    };

    if (success) {
        return (
            <div className="bg-white rounded-xl p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">My Person Verified!</h3>
                <p className="text-gray-500">Unlocking your surprise...</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full mx-auto animate-fade-in-up ${error ? "animate-shake" : ""}`}>
            {/* Header */}
            <div className="bg-rose-500 p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-lg font-medium opacity-90">Select all images with</h3>
                    <h2 className="text-3xl font-bold mt-1 mb-2">your valentine</h2>
                    <p className="text-sm opacity-90">Click verify once there are none left.</p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-400 rounded-full opacity-50" />
                <div className="absolute top-10 -left-10 w-20 h-20 bg-rose-600 rounded-full opacity-30" />
            </div>

            {/* Grid */}
            <div className="p-4 bg-white">
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {items.map((item) => {
                        const isSelected = selectedIds.has(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => toggleSelection(item.id)}
                                className={`relative aspect-square overflow-hidden cursor-pointer transition-all duration-200 ${isSelected ? "transform scale-95" : "hover:opacity-90"
                                    }`}
                            >
                                <img
                                    src={item.url}
                                    alt="Captcha item"
                                    className={`w-full h-full object-cover transition-all ${isSelected ? "scale-110" : ""
                                        }`}
                                />
                                {isSelected && (
                                    <div className="absolute inset-0 border-4 border-rose-500 z-10 flex items-center justify-center bg-rose-500/20">
                                        <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-lg transform scale-100 animate-bounce-gentle">
                                            <Heart className="w-3.5 h-3.5 text-white fill-white" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2">
                    <button
                        onClick={initializeCaptcha}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Refresh images"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>

                    <div className="flex-1 px-4 text-center">
                        {error && (
                            <div className="text-rose-500 text-xs font-semibold flex items-center justify-center gap-1 animate-fade-in">
                                <AlertCircle className="w-3 h-3" />
                                Try again, love
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleVerify}
                        className="bg-rose-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 active:scale-95"
                    >
                        VERIFY
                    </button>
                </div>
            </div>
        </div>
    );
}
