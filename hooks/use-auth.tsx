"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export type AuthContextValue = {
    user: User | null;
    loading: boolean;
    signOutUser: () => Promise<void>;
    isConfigured: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const configured = isFirebaseConfigured && Boolean(auth);

    useEffect(() => {
        if (!configured || !auth) {
            setUser(null);
            setLoading(false);
            return;
        }
        const unsub = onAuthStateChanged(auth, (nextUser) => {
            setUser(nextUser);
            setLoading(false);
        });

        return () => unsub();
    }, [configured]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            signOutUser: () => (auth ? signOut(auth) : Promise.resolve()),
            isConfigured: configured,
        }),
        [user, loading, configured],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
