"use client";

import { useEffect, useState } from "react";
import { useAppConfig } from "@/hooks/use-app-config";
import { defaultConfig } from "@/lib/app-config";
import { LoadingState } from "@/components/home/loading-state";
import { StatusState } from "@/components/home/status-state";

export default function NotFound() {
    const { config, loading } = useAppConfig({ autoCreate: false });
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowFallback(true), 800);
        return () => clearTimeout(timer);
    }, []);

    const theme = config?.theme ?? defaultConfig.theme;
    const textColor = theme.textColor || "#0f172a";

    if (!showFallback && loading) {
        return <LoadingState theme={theme} textColor={textColor} />;
    }

    return (
        <StatusState
            theme={theme}
            textColor={textColor}
            badge="404"
            title="Page not found"
            description="The page you’re looking for doesn’t exist. Head back to your Links home."
            primaryAction={{ label: "Go to home", href: "/" }}
        />
    );
}
