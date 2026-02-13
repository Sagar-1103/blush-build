"use client";

import { useState, type ReactNode } from "react";
import { Heart, Lock, User, ArrowRight } from "lucide-react";
import { HeartCaptcha } from "@/components/heart-captcha";

export function UnlockGate({
    unlockType,
    unlockValue,
    crushName,
    children,
    captchaImages,
}: {
    unlockType: string;
    unlockValue: string;
    crushName: string;
    children: ReactNode;
    captchaImages?: string[];
}) {
    // State for each lock type
    const hasPassword = unlockType === "password" || unlockType === "nickname";
    const hasPuzzle = unlockType === "love-captcha" && captchaImages && captchaImages.length > 0;

    const [passwordUnlocked, setPasswordUnlocked] = useState(!hasPassword);
    const [puzzleSolved, setPuzzleSolved] = useState(!hasPuzzle);

    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [shaking, setShaking] = useState(false);

    // 1. If everything is unlocked, show content
    if (passwordUnlocked && puzzleSolved) return <>{children}</>;

    const handlePasswordUnlock = () => {
        if (input.trim().toLowerCase() === unlockValue.toLowerCase()) {
            setPasswordUnlocked(true);
        } else {
            setError(true);
            setShaking(true);
            setTimeout(() => setShaking(false), 500);
            setTimeout(() => setError(false), 2000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handlePasswordUnlock();
    };

    // 2. Priority: Password Protection (Privacy first!)
    if (!passwordUnlocked) {
        return (
            <div className="min-h-screen bg-[#fff0f3] flex items-center justify-center p-6 relative overflow-hidden font-sans">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-200/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-200/20 rounded-full blur-[100px]" />
                </div>

                <div
                    className={`bg-white/70 backdrop-blur-xl border border-rose-100 shadow-2xl shadow-rose-200/50 rounded-3xl p-8 max-w-[400px] w-full text-center relative z-10 transition-transform ${shaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                    style={{
                        animation: shaking ? "shake 0.5s ease-in-out" : undefined,
                    }}
                >
                    <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-50 rounded-full flex items-center justify-center shadow-inner border border-rose-50">
                        <div className="text-4xl animate-bounce-gentle transform -rotate-6">
                            {unlockType === "password" ? "🔒" : "💝"}
                        </div>
                    </div>

                    <h2 className="text-3xl font-display font-bold text-rose-950 mb-3 tracking-tight">
                        Hey {crushName}!
                    </h2>
                    <p className="text-rose-900/60 mb-8 leading-relaxed font-medium text-lg">
                        {unlockType === "password"
                            ? "This page is locked. Do you know the secret code?"
                            : "Enter your nickname to see what's inside!"}
                    </p>

                    <div className="relative mb-6 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors">
                            {unlockType === "password" ? (
                                <Lock className={`w-5 h-5 transition-colors ${error ? "text-red-300" : "text-rose-300 group-focus-within:text-rose-500"}`} />
                            ) : (
                                <User className={`w-5 h-5 transition-colors ${error ? "text-red-300" : "text-rose-300 group-focus-within:text-rose-500"}`} />
                            )}
                        </div>
                        <input
                            type={unlockType === "password" ? "password" : "text"}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setError(false);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={unlockType === "password" ? "Enter secret code..." : "Type your nickname..."}
                            className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 text-rose-950 placeholder:text-rose-300/70 outline-none transition-all font-bold text-lg shadow-sm ${error
                                ? "border-red-200 bg-red-50 focus:border-red-300 focus:ring-4 focus:ring-red-100 text-red-900"
                                : "border-rose-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                                }`}
                        />
                    </div>

                    {error && (
                        <div className="mb-4 animate-fade-in flex items-center justify-center gap-2 px-4 py-2 bg-red-50 rounded-xl border border-red-100">
                            <span className="text-lg">🙈</span>
                            <p className="text-sm text-red-500 font-bold">{unlockType === "password" ? "Wrong code! Try again." : "That's not it! Try again."}</p>
                        </div>
                    )}

                    <button
                        onClick={handlePasswordUnlock}
                        className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <span>Unlock Page</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <style jsx>{`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  20% { transform: translateX(-10px); }
                  40% { transform: translateX(10px); }
                  60% { transform: translateX(-10px); }
                  80% { transform: translateX(10px); }
                }
            `}</style>
            </div>
        );
    }

    // 3. Heart Puzzle (if enabled)
    if (!puzzleSolved && hasPuzzle && captchaImages) {
        return (
            <div className="min-h-screen bg-[#fff0f3] flex items-center justify-center p-6 relative font-sans">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-rose-300/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <HeartCaptcha
                        correctImages={captchaImages}
                        onUnlock={() => setPuzzleSolved(true)}
                    />
                </div>
            </div>
        );
    }

    // Fallback
    return <>{children}</>;
}
