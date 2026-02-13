"use client";

import { useEffect, useState } from "react";

const HEART_EMOJIS = ["💕", "💖", "💗", "💓", "🌸", "✨", "💫", "🩷"];

interface Heart {
    id: number;
    emoji: string;
    left: number;
    size: number;
    duration: number;
    delay: number;
    swayDuration: number;
}

export function FloatingHearts({ count = 12 }: { count?: number }) {
    const [hearts, setHearts] = useState<Heart[]>([]);

    useEffect(() => {
        const generated: Heart[] = Array.from({ length: count }, (_, i) => ({
            id: i,
            emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
            left: Math.random() * 100,
            size: 14 + Math.random() * 18,
            duration: 8 + Math.random() * 12,
            delay: Math.random() * 10,
            swayDuration: 3 + Math.random() * 4,
        }));
        setHearts(generated);
    }, [count]);

    if (hearts.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            {hearts.map((heart) => (
                <span
                    key={heart.id}
                    className="absolute animate-float-up"
                    style={{
                        left: `${heart.left}%`,
                        fontSize: `${heart.size}px`,
                        animationDuration: `${heart.duration}s`,
                        animationDelay: `${heart.delay}s`,
                    }}
                >
                    <span
                        className="inline-block animate-sway"
                        style={{ animationDuration: `${heart.swayDuration}s` }}
                    >
                        {heart.emoji}
                    </span>
                </span>
            ))}
        </div>
    );
}
