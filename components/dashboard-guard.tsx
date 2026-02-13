"use client";

import { useAuth } from "@/components/auth-context";
import { useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, openAuthModal } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            openAuthModal();
        }
    }, [isLoading, isAuthenticated, openAuthModal]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fff0f3] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center animate-pulse">
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                    </div>
                    <Loader2 className="w-6 h-6 text-rose-400 animate-spin" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#fff0f3] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-rose-900 mb-2">Sign in to continue</h2>
                    <p className="text-rose-600/70 mb-6">You need to be logged in to access your dashboard.</p>
                    <button
                        onClick={() => openAuthModal()}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
                    >
                        Sign In / Sign Up
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
