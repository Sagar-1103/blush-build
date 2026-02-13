"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface AuthUser {
    id: string;
    username: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    openAuthModal: (onSuccess?: () => void) => void;
    closeAuthModal: () => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    // Internal state for AuthModal
    authModalOpen: boolean;
    authModalCallback: (() => void) | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalCallback, setAuthModalCallback] = useState<(() => void) | null>(null);

    const refreshUser = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const openAuthModal = useCallback((onSuccess?: () => void) => {
        setAuthModalCallback(() => onSuccess || null);
        setAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setAuthModalOpen(false);
        setAuthModalCallback(null);
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                openAuthModal,
                closeAuthModal,
                logout,
                refreshUser,
                authModalOpen,
                authModalCallback,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
