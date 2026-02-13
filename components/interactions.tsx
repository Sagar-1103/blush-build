"use client";

import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Volume2, VolumeX } from "lucide-react";

interface PageData {
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
    templateEmoji: string;
    templateType: string;
    photos: string[];
}

/* ─── Template theme configs ─── */
const TEMPLATE_THEMES: Record<
    string,
    {
        bg: string;
        floatingEmojis: string[];
        greeting: string;
        yesBtn: string;
        yesBtnHover: string;
        noBtn: string;
        noBtnHover: string;
        titleColor: string;
        subtitleColor: string;
        greetingColor: string;
        yesEmoji: string;
        noEmoji: string;
        yesResponseEmoji: string;
        noResponseEmoji: string;
        yesResponseColor: string;
        noResponseColor: string;
        celebrateEmojis: string[];
        decorClass: string;
    }
> = {
    confession: {
        bg: "linear-gradient(160deg, #fff1f2 0%, #fdf2f8 40%, #fce7f3 100%)",
        floatingEmojis: ["💖", "🌹", "✨", "💗", "🩷", "💕", "🥀", "❣️"],
        greeting: "Hey",
        yesBtn:
            "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xl shadow-rose-300/40",
        yesBtnHover: "hover:shadow-2xl hover:shadow-rose-300/50 hover:scale-105",
        noBtn: "bg-white border-2 border-rose-200 text-rose-500 active:scale-95",
        noBtnHover: "hover:bg-rose-50",
        titleColor: "text-rose-800",
        subtitleColor: "text-rose-500/70",
        greetingColor: "text-rose-400",
        yesEmoji: "💕",
        noEmoji: "🙈",
        yesResponseEmoji: "💕",
        noResponseEmoji: "💛",
        yesResponseColor: "text-rose-800",
        noResponseColor: "text-rose-700",
        celebrateEmojis: ["💖", "🥰", "✨", "💗", "🎉"],
        decorClass: "template-confession",
    },
    valentine: {
        bg: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 30%, #fecdd3 60%, #fdf2f8 100%)",
        floatingEmojis: ["💌", "💕", "💘", "💝", "❤️", "💋", "🏹"],
        greeting: "Dearest",
        yesBtn:
            "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-xl shadow-red-300/40 rounded-2xl",
        yesBtnHover: "hover:shadow-2xl hover:shadow-red-300/60 hover:scale-105",
        noBtn: "bg-white/90 border-2 border-red-200 text-red-500 rounded-2xl active:scale-95",
        noBtnHover: "hover:bg-red-50",
        titleColor: "text-red-800",
        subtitleColor: "text-red-500/70",
        greetingColor: "text-red-400",
        yesEmoji: "💘",
        noEmoji: "💔",
        yesResponseEmoji: "💘",
        noResponseEmoji: "💛",
        yesResponseColor: "text-red-800",
        noResponseColor: "text-red-700",
        celebrateEmojis: ["💘", "❤️", "💌", "💕", "🎉"],
        decorClass: "template-valentine",
    },

    proposal: {
        bg: "linear-gradient(160deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #581c87 100%)",
        floatingEmojis: ["💍", "✨", "💎", "⭐", "🌟", "💫", "🌙", "👑"],
        greeting: "My love,",
        yesBtn:
            "bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-900 shadow-xl shadow-amber-400/30 rounded-2xl font-bold",
        yesBtnHover:
            "hover:shadow-2xl hover:shadow-amber-300/50 hover:scale-105 hover:from-amber-300 hover:to-yellow-200",
        noBtn: "bg-white/10 backdrop-blur-sm border-2 border-amber-400/40 text-amber-200 rounded-2xl active:scale-95",
        noBtnHover: "hover:bg-white/20",
        titleColor: "text-white",
        subtitleColor: "text-amber-200/70",
        greetingColor: "text-amber-300",
        yesEmoji: "💍",
        noEmoji: "🥺",
        yesResponseEmoji: "💍",
        noResponseEmoji: "💛",
        yesResponseColor: "text-amber-100",
        noResponseColor: "text-amber-200",
        celebrateEmojis: ["💍", "✨", "💎", "👑", "🎉"],
        decorClass: "template-proposal",
    },

};

const DEFAULT_THEME = TEMPLATE_THEMES.confession;

export function PageInteractions({ data }: { data: PageData }) {
    const [answered, setAnswered] = useState<"yes" | "no" | null>(null);
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    const theme = TEMPLATE_THEMES[data.templateType] || DEFAULT_THEME;

    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        // Template-specific confetti colors
        const confettiColors: Record<string, string[]> = {
            confession: ["#f43f5e", "#ec4899", "#f9a8d4", "#fda4af", "#c084fc", "#fbbf24"],
            valentine: ["#ef4444", "#f43f5e", "#ec4899", "#dc2626", "#f87171", "#fbbf24"],
            proposal: ["#fbbf24", "#f59e0b", "#c084fc", "#8b5cf6", "#a78bfa", "#e9d5ff"],
        };

        const colors = confettiColors[data.templateType] || confettiColors.confession;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.7 },
                colors,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.7 },
                colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();

        confetti({
            particleCount: 40,
            spread: 100,
            origin: { y: 0.6 },
            shapes: ["circle"],
            colors,
            scalar: 1.5,
        });
    };

    const handleYes = () => {
        setAnswered("yes");
        triggerConfetti();
    };



    const handleNoHover = () => {
        if (data.interactiveTwist !== "runaway") return;

        const container = containerRef.current;
        if (!container) return;

        const maxX = 200;
        const maxY = 150;
        const newX = (Math.random() - 0.5) * maxX * 2;
        const newY = (Math.random() - 0.5) * maxY * 2;

        setNoPosition({ x: newX, y: newY });
    };

    const handleNo = () => {
        if (data.interactiveTwist === "runaway") {
            handleNoHover();
            return;
        }
        setAnswered("no");
    };

    const isProposal = data.templateType === "proposal";

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${theme.decorClass}`}
            style={{
                background: theme.bg,
                fontFamily: data.fontStyle,
            }}
            ref={containerRef}
        >
            {/* Floating emojis background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                    <span
                        key={i}
                        className="absolute text-xl animate-float-up"
                        style={{
                            left: `${5 + Math.random() * 90}%`,
                            animationDuration: `${10 + Math.random() * 12}s`,
                            animationDelay: `${Math.random() * 10}s`,
                            opacity: isProposal ? 0.6 : 0.4,
                            fontSize: `${1 + Math.random() * 0.8}rem`,
                        }}
                    >
                        {theme.floatingEmojis[i % theme.floatingEmojis.length]}
                    </span>
                ))}
            </div>

            {/* Proposal template: shimmer overlay */}
            {isProposal && (
                <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent" />
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-amber-400/20 via-transparent to-transparent" />
                    <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-amber-400/10 via-transparent to-transparent" />
                </div>
            )}

            {/* Valentine template: pulsing heart glow */}
            {data.templateType === "valentine" && (
                <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center" aria-hidden="true">
                    <div className="w-96 h-96 rounded-full bg-red-300/10 animate-pulse-soft blur-3xl" />
                </div>
            )}



            <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-12 text-center">
                {!answered ? (
                    /* ─── Main content ─── */
                    <div className="animate-fade-in-up">
                        {/* Template emoji */}
                        <div className={`text-6xl mb-6 ${isProposal ? "animate-twinkle" : "animate-bounce-gentle"}`}>
                            {data.templateEmoji}
                        </div>

                        {/* Greeting */}
                        <p className={`text-lg mb-2 ${theme.greetingColor}`}>
                            {theme.greeting} {data.crushName}...
                        </p>

                        {/* Photos */}
                        {data.photos.length > 0 && (
                            <div className="flex justify-center gap-3 mb-6">
                                {data.photos.map((url, i) => (
                                    <div
                                        key={i}
                                        className={`w-24 h-24 rounded-2xl overflow-hidden shadow-lg ${isProposal
                                            ? "border-2 border-amber-400/50"
                                            : "border-2 border-white"
                                            }`}
                                    >
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Main message */}
                        <h1 className={`text-3xl sm:text-4xl font-bold mb-4 leading-relaxed ${theme.titleColor}`}>
                            {data.mainMessage}
                        </h1>

                        {/* Sub message */}
                        {data.subMessage && (
                            <p className={`text-lg mb-8 ${theme.subtitleColor}`}>{data.subMessage}</p>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                            {/* Yes button */}
                            <button
                                onClick={handleYes}
                                className={`group px-10 py-4 rounded-2xl text-lg font-semibold transition-all active:scale-95 ${theme.yesBtn} ${theme.yesBtnHover}`}
                            >
                                <span className="flex items-center gap-2">
                                    {theme.yesEmoji} Yes!
                                </span>
                            </button>

                            {/* No button */}
                            <button
                                onClick={handleNo}
                                onMouseEnter={handleNoHover}
                                onTouchStart={handleNoHover}
                                className={`px-10 py-4 rounded-2xl text-lg font-semibold transition-all relative ${theme.noBtn} ${theme.noBtnHover}`}
                                style={
                                    data.interactiveTwist === "runaway"
                                        ? {
                                            transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                                            transition: "transform 0.3s ease-out",
                                        }
                                        : undefined
                                }
                            >
                                {theme.noEmoji} No
                            </button>
                        </div>


                    </div>
                ) : answered === "yes" ? (
                    /* ─── Yes response ─── */
                    <div className="animate-fade-in-up">
                        <div className={`text-7xl mb-6 ${isProposal ? "animate-twinkle" : "animate-heart-beat"}`}>
                            {theme.yesResponseEmoji}
                        </div>
                        <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${theme.yesResponseColor}`}>
                            {data.successMessage}
                        </h2>
                        <div className="flex justify-center gap-2 mt-6">
                            {theme.celebrateEmojis.map((e, i) => (
                                <span
                                    key={i}
                                    className="text-3xl animate-bounce-gentle"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                >
                                    {e}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ─── No response ─── */
                    <div className="animate-fade-in-up">
                        <div className="text-6xl mb-6">{theme.noResponseEmoji}</div>
                        <h2 className={`text-2xl font-semibold mb-4 ${theme.noResponseColor}`}>
                            That's okay. Thank you for being honest. 💛
                        </h2>
                        <p className={isProposal ? "text-amber-200/60" : theme.subtitleColor}>
                            You&apos;re still amazing. Never forget that. ✨
                        </p>
                    </div>
                )}
            </div>

            {/* Music player */}
            {data.musicUrl && (
                <div className="fixed bottom-4 right-4 z-20">
                    <MusicPlayer url={data.musicUrl} isProposal={isProposal} />
                </div>
            )}

            {/* Made with BlushBuild footer */}
            <a
                href="/"
                className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold tracking-wide uppercase transition-colors z-10 whitespace-nowrap ${isProposal
                    ? "text-amber-300/60 hover:text-amber-200"
                    : "text-rose-300 hover:text-rose-400"
                    }`}
            >
                Made with BlushBuild
            </a>
        </div>
    );
}

function MusicPlayer({ url, isProposal }: { url: string; isProposal?: boolean }) {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Extract YouTube ID if present
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYouTubeId(url);

    const toggle = () => {
        if (youtubeId) {
            if (playing) {
                iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            } else {
                iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            }
        } else {
            if (!audioRef.current) return;
            if (playing) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => { });
            }
        }
        setPlaying(!playing);
    };

    return (
        <>
            {youtubeId ? (
                <iframe
                    ref={iframeRef}
                    className="hidden"
                    src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=0&loop=1&playlist=${youtubeId}`}
                    allow="autoplay"
                    title="Background Music"
                />
            ) : (
                <audio ref={audioRef} src={url} loop />
            )}
            <button
                onClick={toggle}
                className={`w-12 h-12 rounded-full backdrop-blur-sm shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform ${isProposal
                    ? "bg-white/10 border border-amber-400/30 text-amber-100"
                    : "bg-white/80 border border-rose-200 text-rose-600"
                    }`}
                title={playing ? "Pause music" : "Play music"}
            >
                {playing ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
        </>
    );
}
