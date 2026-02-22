"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import {
    defaultConfig,
    mergeAppConfig,
    type AppConfig,
} from "@/lib/app-config";

export function useAppConfig(options?: { autoCreate?: boolean }) {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const creatingRef = useRef(false);
    const autoCreate = options?.autoCreate ?? true;

    useEffect(() => {
        if (!db) {
            setConfig(null);
            setLoading(false);
            setError(null);
            return;
        }
        const ref = doc(db, "appConfig", "main");

        const unsub = onSnapshot(
            ref,
            (snapshot) => {
                if (!snapshot.exists()) {
                    if (autoCreate && !creatingRef.current) {
                        creatingRef.current = true;
                        void setDoc(ref, defaultConfig).catch((err) => {
                            setError(
                                err.message ??
                                    "Failed to create default config",
                            );
                        });
                    }
                    setConfig(autoCreate ? defaultConfig : null);
                } else {
                    const data = snapshot.data() as Partial<AppConfig>;
                    setConfig(mergeAppConfig(data));
                }
                setLoading(false);
            },
            (err) => {
                setError(err.message ?? "Failed to load config");
                setLoading(false);
            },
        );

        return () => unsub();
    }, []);

    const save = async (next: AppConfig) => {
        if (!db) {
            throw new Error("Firebase is not configured.");
        }
        const ref = doc(db, "appConfig", "main");
        const sanitized = stripUndefined(next) as AppConfig;
        await setDoc(ref, sanitized, { merge: false });
    };

    return { config, loading, error, save, setConfig };
}

function stripUndefined(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value
            .map((item) => stripUndefined(item))
            .filter((item) => item !== undefined);
    }

    if (value && typeof value === "object") {
        const result: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value)) {
            if (val === undefined) {
                continue;
            }
            const cleaned = stripUndefined(val);
            if (cleaned === undefined) {
                continue;
            }
            result[key] = cleaned;
        }
        return result;
    }

    return value;
}
