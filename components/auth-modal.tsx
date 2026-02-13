"use client";

import { useState } from "react";
import { X, Lock, User, ArrowRight, Heart, Loader2 } from "lucide-react";
import { useAuth } from "./auth-context";

export function AuthModal() {
    const { authModalOpen, closeAuthModal, refreshUser, authModalCallback } = useAuth();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!authModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (mode === "signup") {
            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords don't match");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim().toLowerCase(),
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                setIsSubmitting(false);
                return;
            }

            // Refresh user state in context
            await refreshUser();

            // Reset form
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setError("");
            setIsSubmitting(false);

            // Call the callback (e.g., resume publishing)
            if (authModalCallback) {
                authModalCallback();
            }

            closeAuthModal();
        } catch {
            setError("Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setError("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        closeAuthModal();
    };

    const switchMode = () => {
        setMode(mode === "login" ? "signup" : "login");
        setError("");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-rose-950/30 backdrop-blur-sm animate-fade-in"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-rose-200 overflow-hidden animate-scale-in border border-rose-100 flex flex-col">

                {/* Header Section with Background */}
                <div className="relative bg-gradient-to-br from-rose-400 to-pink-500 px-8 pt-10 pb-28 text-center text-white overflow-hidden shrink-0">
                    {/* Decorative elements */}
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute top-[10%] left-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute cursor-pointer top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-rose-500/20 transform rotate-3">
                            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                        </div>
                        <h2 className="text-3xl font-bold font-display tracking-tight mb-2 drop-shadow-md">
                            {mode === "login" ? "Welcome Back!" : "Join BlushBuild"}
                        </h2>
                        <p className="text-rose-100 text-base font-medium drop-shadow-sm px-4">
                            {mode === "login"
                                ? "Continue your romantic journey"
                                : "Start creating something beautiful"}
                        </p>
                    </div>
                </div>

                {/* Form Content */}
                <div className="px-8 pb-8 pt-10 bg-white rounded-t-[2.5rem] relative -mt-16 z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] flex-1">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl animate-fade-in">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-rose-900 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-rose-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="your_username"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-900 placeholder:text-rose-300 font-medium focus:ring-4 focus:ring-rose-100 focus:border-rose-300 outline-none transition-all"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-rose-900 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-rose-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-900 placeholder:text-rose-300 font-medium focus:ring-4 focus:ring-rose-100 focus:border-rose-300 outline-none transition-all"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field (Signup Only) */}
                        {mode === "signup" && (
                            <div className="space-y-1.5 animate-fade-in-up">
                                <label className="text-sm font-bold text-rose-900 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-rose-400 group-focus-within:text-rose-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-900 placeholder:text-rose-300 font-medium focus:ring-4 focus:ring-rose-100 focus:border-rose-300 outline-none transition-all"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 group disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {mode === "login" ? "Signing in..." : "Creating account..."}
                                </>
                            ) : (
                                <>
                                    {mode === "login" ? "Sign In" : "Create Account"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {/* Toggle Mode */}
                        <div className="text-center pt-2">
                            <p className="text-sm text-rose-600/70 font-medium">
                                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    onClick={switchMode}
                                    className="text-rose-600 cursor-pointer hover:text-rose-700 font-bold hover:underline underline-offset-2 transition-colors"
                                >
                                    {mode === "login" ? "Sign up" : "Log in"}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
