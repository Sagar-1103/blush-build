"use client";
import React from "react";
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
import { useAuth } from "@/components/auth-context";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";

export function AuthNavButtons() {
    const { user, isAuthenticated, isLoading, openAuthModal, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="w-16 sm:w-20 h-8 sm:h-9 rounded-full bg-rose-50 animate-pulse" />
        );
    }

    if (isAuthenticated && user) {
        return (
            <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 sm:gap-2 text-sm text-rose-600 hover:text-rose-700 font-semibold transition-all px-3 py-2 rounded-full hover:bg-rose-50 active:scale-95"
                    title="Dashboard"
                >
                    <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <div className="h-5 w-px bg-rose-200/60 mx-1 hidden sm:block" />

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            className="flex cursor-pointer items-center gap-1.5 sm:gap-2 text-sm font-semibold text-rose-500/70 hover:text-rose-600 transition-all px-2 py-1.5 rounded-full hover:bg-rose-50 active:scale-95 group"
                            title="Log out"
                        >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold uppercase shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                {user.username.charAt(0)}
                            </div>
                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl border-rose-100 bg-white/95 backdrop-blur-xl shadow-2xl w-[90%] max-w-[400px]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-display font-bold text-rose-950 flex items-center gap-2">
                                Sign out? <span className="text-lg">👋</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-rose-500/80 font-medium text-sm leading-relaxed">
                                Are you sure you want to sign out of your account?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4 gap-2 flex">
                            <AlertDialogCancel className="rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 font-bold transition-all">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={logout}
                                className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all active:scale-95"
                            >
                                Sign out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    }

    return (
        <button
            onClick={() => openAuthModal()}
            className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2.5 rounded-lg cursor-pointer hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg shadow-rose-200 hover:shadow-xl active:scale-95"
        >
            <span>Sign In</span>
        </button>
    );
}
