"use client";

import { useAuth } from "@/components/auth-context";
import Link from "next/link";
import { LogOut, LayoutDashboard, Loader2 } from "lucide-react";

export function AuthNavButtons() {
    const { user, isAuthenticated, isLoading, openAuthModal, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="w-16 sm:w-20 h-8 sm:h-9 rounded-full bg-rose-50 animate-pulse" />
        );
    }

    if (isAuthenticated && user) {
        return (
            <div className="flex items-center gap-0.5 sm:gap-1.5">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-rose-600 hover:text-rose-700 font-semibold transition-all px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-rose-50 active:scale-95"
                    title="Dashboard"
                >
                    <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <div className="h-4 sm:h-5 w-px bg-rose-200/60 mx-0.5 hidden sm:block" />

                <button
                    onClick={logout}
                    className="flex cursor-pointer items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-rose-500/70 hover:text-rose-600 transition-all px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-rose-50 active:scale-95"
                    title="Log out"
                >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold uppercase shadow-sm shrink-0">
                        {user.username.charAt(0)}
                    </div>
                    <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-60 hidden sm:block" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => openAuthModal()}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg cursor-pointer hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg shadow-rose-200 hover:shadow-xl"
        >
            <span>Sign In</span>
        </button>
    );
}
