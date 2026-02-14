"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ShareModal({
    slug,
    crushName,
    onClose,
}: {
    slug: string;
    crushName: string;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);

    const url = typeof window !== "undefined" ? `${window.location.origin}/p/${slug}` : `/p/${slug}`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent showCloseButton={false} className="max-w-md w-[90%] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-rose-100 shadow-2xl rounded-2xl sm:rounded-3xl outline-none">
                <div className="flex flex-col w-full min-w-0">

                    {/* Header */}
                    <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-rose-100/50 bg-white/60 flex items-center justify-between shrink-0 relative z-50">
                        <DialogTitle className="flex items-center gap-2 text-lg font-display font-bold text-rose-950">
                            <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500" />
                            Share Your Page
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="p-1.5 -mr-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

                        {/* Decorative section */}
                        <div className="text-center py-6 px-3 sm:px-4 bg-[#fff0f3] rounded-2xl border border-rose-100">
                            <div className="text-5xl mb-3">💌</div>
                            <p className="text-rose-900 font-display font-bold text-lg break-words whitespace-normal leading-tight">
                                For {crushName}
                            </p>
                            <p className="text-rose-500/70 text-sm mt-2 px-1 break-words whitespace-normal leading-relaxed">
                                Your page is live and ready to share!
                            </p>
                        </div>

                        {/* Link Copy */}
                        <div>
                            <label className="text-[10px] font-bold text-rose-400 uppercase tracking-widest pl-1 mb-1.5 block">
                                Page Link
                            </label>
                            <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 pl-4 border border-rose-100 shadow-sm focus-within:ring-2 focus-within:ring-rose-200 transition-all">
                                <span className="text-sm text-slate-700 truncate flex-1 font-mono min-w-0">{url}</span>
                                <button
                                    onClick={handleCopy}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0",
                                        copied ? "bg-emerald-100 text-emerald-700" : "bg-rose-500 text-white hover:bg-rose-600"
                                    )}
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl py-3 font-bold text-sm transition-all active:scale-95 border border-rose-100"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Open Page
                        </a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
