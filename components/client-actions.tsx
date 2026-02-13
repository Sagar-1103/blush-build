"use client";

import { useRouter, usePathname } from "next/navigation";
import { deletePage } from "@/app/create/actions";
import { Trash2, Share2, Loader2, Check } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { ShareModal } from "./share-modal";

export function DeleteButton({ pageId }: { pageId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePage(pageId);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete page:", error);
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    className="p-2 rounded-lg transition-colors hover:bg-red-50 text-rose-400 hover:text-red-500 group"
                    title="Delete"
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    )}
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-rose-100 bg-white/95 backdrop-blur-xl shadow-2xl max-w-[400px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-display font-bold text-rose-950 flex items-center gap-2">
                        Delete this page? <span className="text-lg">💔</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-rose-500/80 font-medium text-sm leading-relaxed">
                        This action cannot be undone. This will permanently delete your page and remove all data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 gap-2 flex">
                    <AlertDialogCancel className="rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 font-bold transition-all">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all active:scale-95"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {isDeleting ? "Deleting..." : "Yes, Delete It"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function ShareButton({ slug, crushName }: { slug: string; crushName: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="p-2 rounded-lg hover:bg-rose-50 text-rose-400 hover:text-rose-600 transition-colors"
                title="Share BlushCode"
            >
                <Share2 className="w-4 h-4" />
            </button>
            {open && <ShareModal slug={slug} crushName={crushName} onClose={() => setOpen(false)} />}
        </>
    );
}

import { useRef } from "react";
import { MoreVertical, Pencil } from "lucide-react";
import Link from "next/link";

export function PageActionsMenu({ pageId, slug, crushName }: { pageId: string; slug: string; crushName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePage(pageId);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete page:", error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 cursor-pointer rounded-full transition-all duration-200 ${isOpen ? "bg-rose-100 text-rose-600" : "text-rose-400 hover:bg-rose-50 hover:text-rose-600"}`}
                title="Options"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl shadow-rose-100 border border-rose-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col p-1.5">
                        <Link
                            href={`/create/${pageId}`}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Pencil className="w-4 h-4 text-rose-400" />
                            Edit Page
                        </Link>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setShowShareModal(true);
                            }}
                            className="flex cursor-pointer items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-700 hover:bg-rose-50 transition-colors text-left"
                        >
                            <Share2 className="w-4 h-4 text-rose-400" />
                            Share
                        </button>
                        <div className="h-px bg-rose-50 my-1" />
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setShowDeleteAlert(true);
                            }}
                            className="flex cursor-pointer items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left group"
                        >
                            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <ShareModal slug={slug} crushName={crushName} onClose={() => setShowShareModal(false)} />
            )}

            {/* Delete Alert Dialog */}
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent className="rounded-3xl border-rose-100 bg-white/95 backdrop-blur-xl shadow-2xl max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-display font-bold text-rose-950 flex items-center gap-2">
                            Delete this page? <span className="text-lg">💔</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-rose-500/80 font-medium text-sm leading-relaxed">
                            This action cannot be undone. This will permanently delete your page and remove all data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 gap-2 flex">
                        <AlertDialogCancel className="rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 font-bold transition-all">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isDeleting}
                            className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all active:scale-95"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            {isDeleting ? "Deleting..." : "Yes, Delete It"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export function AutoOpenShare({ slug, crushName }: { slug: string; crushName: string }) {
    const [open, setOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const handleClose = () => {
        setOpen(false);
        // Remove query param to prevent reopening on executing router.refresh() or similar
        router.replace(pathname, { scroll: false });
    };

    if (!open) return null;

    return <ShareModal slug={slug} crushName={crushName} onClose={handleClose} />;
}

export function ShareAppButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.origin;
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: "BlushBuild",
                    text: "Create beautiful pages for your loved ones with BlushBuild!",
                    url: url,
                });
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Copy failed:", err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Share App"}</span>
        </button>
    );
}
