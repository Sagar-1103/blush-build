"use client";

import { useState, useEffect } from "react";

const PHRASES = [
    "Scanning…",
    "Opening something special…",
];

export function RevealIntro({ children }: { children: React.ReactNode }) {
    const [phase, setPhase] = useState(0); // 0 = first phrase, 1 = second phrase, 2 = fading, 3 = done
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Phase 0 → 1 after 1.2s
        const t1 = setTimeout(() => setPhase(1), 1200);
        // Phase 1 → 2 (start fade) after 2.6s
        const t2 = setTimeout(() => setPhase(2), 2600);
        // Phase 2 → 3 (remove) after 3.4s
        const t3 = setTimeout(() => {
            setPhase(3);
            setVisible(false);
        }, 3400);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    if (!visible) {
        return <>{children}</>;
    }

    return (
        <>
            {/* Intro overlay */}
            <div
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 font-sans"
                style={{
                    background: "#fff0f3", /* Rose-50 base */
                    opacity: phase >= 2 ? 0 : 1,
                    pointerEvents: phase >= 2 ? "none" : "auto",
                }}
            >
                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-200/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-200/20 rounded-full blur-[100px]" />
                </div>

                {/* Pulsing icon */}
                <div className="text-6xl mb-8 animate-bounce-gentle relative z-10">
                    <div className="absolute inset-0 animate-ping opacity-20 bg-rose-400 rounded-full blur-xl" />
                    💌
                </div>

                {/* Phrase */}
                <p
                    className="text-2xl font-display font-bold text-rose-950 transition-all duration-500 relative z-10 px-4 text-center"
                    style={{
                        opacity: phase <= 1 ? 1 : 0,
                        transform: phase <= 1 ? "translateY(0)" : "translateY(-10px)",
                    }}
                >
                    {phase === 0 ? PHRASES[0] : PHRASES[1]}
                </p>

                {/* Dots animation */}
                <div className="flex gap-2 mt-6 relative z-10">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>

                {/* Footer */}
                <div className="absolute bottom-6 flex items-center justify-center w-full z-10">
                    <span className="text-xs font-bold tracking-wide text-rose-300 uppercase">
                        Made with BlushBuild
                    </span>
                </div>
            </div>

            {/* Content rendered underneath */}
            <div style={{ opacity: phase >= 3 ? 1 : 0, transition: "opacity 0.5s ease" }}>
                {children}
            </div>
        </>
    );
}
