"use client";

import type { CSSProperties } from "react";
import type { ThemeConfig } from "@/lib/app-config";
import { useEffect, useState } from "react";
import { Github, LayoutDashboard, Share2 } from "lucide-react";
import Link from "next/link";
import { useAppConfig } from "@/hooks/use-app-config";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/home/loading-state";
import { ShareModal } from "@/components/home/share-modal";
import { StatusState } from "@/components/home/status-state";
import { UnpublishedState } from "@/components/home/unpublished-state";
import { HomeView } from "@/components/home/home-view";
import { HomeFooter } from "@/components/home/home-footer";
import { defaultConfig } from "@/lib/app-config";

const THEME_CACHE_KEY = "links_last_theme";
const THEME_COOKIE_KEY = "links_last_theme";

const hoverAnimationClass = {
    none: "",
    lift: "hover-lift",
    float: "hover-float",
    pulse: "hover-pulse",
    pop: "hover-pop",
} as const;

function parseTheme(raw: string | null): ThemeConfig | null {
    if (!raw) {
        return null;
    }
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
            return parsed as ThemeConfig;
        }
    } catch {
        return null;
    }
    return null;
}

function writeThemeCookie(value: ThemeConfig) {
    try {
        const payload = encodeURIComponent(JSON.stringify(value));
        document.cookie = `${THEME_COOKIE_KEY}=${payload}; path=/; max-age=31536000; samesite=lax`;
    } catch {
        // Ignore cookie write failures.
    }
}

export function HomePageClient({
    initialTheme,
}: {
    initialTheme: ThemeConfig;
}) {
    const { config, loading, error } = useAppConfig({ autoCreate: false });
    const { user } = useAuth();
    const [shareOpen, setShareOpen] = useState(false);
    const [showFallback, setShowFallback] = useState(false);
    const [cachedTheme, setCachedTheme] = useState<ThemeConfig>(
        initialTheme ?? defaultConfig.theme,
    );

    useEffect(() => {
        const timer = setTimeout(() => setShowFallback(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (config?.theme) {
            return;
        }
        const storedTheme = parseTheme(
            typeof window === "undefined"
                ? null
                : window.localStorage.getItem(THEME_CACHE_KEY),
        );
        if (storedTheme) {
            setCachedTheme(storedTheme);
            writeThemeCookie(storedTheme);
        }
    }, [config?.theme]);

    useEffect(() => {
        if (!config?.theme) {
            return;
        }
        setCachedTheme(config.theme);
        try {
            window.localStorage.setItem(
                THEME_CACHE_KEY,
                JSON.stringify(config.theme),
            );
        } catch {
            // Ignore storage errors.
        }
        writeThemeCookie(config.theme);
    }, [config?.theme]);

    const activeTheme = config?.theme ?? cachedTheme ?? defaultConfig.theme;
    const textColor = activeTheme.textColor || "#0f172a";
    const hoverAnimation =
        hoverAnimationClass[activeTheme.hoverAnimation ?? "none"];

    // Overscroll background is handled globally in globals.css.

    if (!showFallback && (loading || !config)) {
        return <LoadingState theme={activeTheme} textColor={textColor} />;
    }

    if (error) {
        if (!showFallback) {
            return <LoadingState theme={activeTheme} textColor={textColor} />;
        }
        return (
            <StatusState
                theme={activeTheme}
                textColor={textColor}
                badge="Offline"
                title="We couldn't reach your Links"
                description="Check your connection and try again. If this keeps happening, reach out and we'll help."
                primaryAction={{
                    label: "Try again",
                    onClick: () => window.location.reload(),
                }}
                secondaryAction={{
                    label: "Contact support",
                    href: "mailto:bilalabdulhadi88@gmail.com",
                }}
            />
        );
    }

    if (!config) {
        if (!showFallback) {
            return <LoadingState theme={activeTheme} textColor={textColor} />;
        }
        return (
            <StatusState
                theme={activeTheme}
                textColor={textColor}
                badge="Config missing"
                title="We couldn't load your Links config"
                description="Check your Firebase project ID, rules, or seed script and try again."
                primaryAction={{
                    label: "Try again",
                    onClick: () => window.location.reload(),
                }}
            />
        );
    }

    if (!config.published) {
        return (
            <UnpublishedState
                theme={config.theme}
                textColor={textColor}
                mode={config.unpublishMode ?? "coming-soon"}
                title={config.unpublishTitle}
                description={config.unpublishDescription}
            />
        );
    }

    const iconStyleVars = {
        "--icon-border": config.theme.iconStyle.borderColor,
        "--icon-bg": config.theme.iconStyle.bgColor,
        "--icon-text": config.theme.iconStyle.textColor,
        "--icon-hover-border": config.theme.iconStyle.hoverBorderColor,
        "--icon-hover-bg": config.theme.iconStyle.hoverBgColor,
        "--icon-hover-text": config.theme.iconStyle.hoverTextColor,
        "--icon-radius": `${config.theme.iconStyle.radius}px`,
        transitionDuration: `${config.theme.hoverTransitionMs}ms`,
    } as CSSProperties;
    const headerActionClass = `inline-flex size-10 items-center justify-center rounded-[var(--icon-radius)] border border-[color:var(--icon-border)] bg-[color:var(--icon-bg)] text-[color:var(--icon-text)] transition ${hoverAnimation} hover:[border-color:var(--icon-hover-border)] hover:[background-color:var(--icon-hover-bg)] hover:[color:var(--icon-hover-text)]`;
    const headerActions = (
        <>
            {user ? (
                <Link
                    href="/dashboard"
                    style={iconStyleVars}
                    className={headerActionClass}
                    aria-label="Open dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                </Link>
            ) : null}
            <a
                href="https://github.com/bilalabdulhadii/links-nextjs"
                target="_blank"
                rel="noreferrer"
                style={iconStyleVars}
                className={headerActionClass}
                aria-label="View source on GitHub">
                <Github className="h-4 w-4" />
            </a>
            <button
                type="button"
                onClick={() => setShareOpen(true)}
                style={iconStyleVars}
                className={headerActionClass}
                aria-label="Share this page">
                <Share2 className="h-4 w-4" />
            </button>
        </>
    );

    return (
        <>
            <HomeView
                config={config}
                textColor={textColor}
                headerActions={headerActions}
                footer={<HomeFooter />}
            />
            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                background={config.theme.background}
                textColor={textColor}
            />
        </>
    );
}
