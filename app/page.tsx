"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Github, LayoutDashboard, Share2 } from "lucide-react";
import { useAppConfig } from "@/hooks/use-app-config";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/home/loading-state";
import { ShareModal } from "@/components/home/share-modal";
import { TryAgainState } from "@/components/home/try-again-state";
import { UnpublishedState } from "@/components/home/unpublished-state";
import { HomeView } from "@/components/home/home-view";
import { HomeFooter } from "@/components/home/home-footer";
import { defaultConfig } from "@/lib/app-config";
import Link from "next/link";

const hoverAnimationClass = {
    none: "",
    lift: "hover-lift",
    float: "hover-float",
    pulse: "hover-pulse",
    pop: "hover-pop",
} as const;

export default function Home() {
    const { config, loading, error } = useAppConfig({ autoCreate: false });
    const { user } = useAuth();
    const [shareOpen, setShareOpen] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowFallback(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const activeTheme = config?.theme ?? defaultConfig.theme;
    const textColor = activeTheme.textColor || "#0f172a";
    const hoverAnimation =
        hoverAnimationClass[activeTheme.hoverAnimation ?? "none"];

    // Overscroll background is handled globally in globals.css.

    if (!showFallback && (loading || !config)) {
        return <LoadingState theme={activeTheme} textColor={textColor} />;
    }

    if (error || !config) {
        if (!showFallback) {
            return <LoadingState theme={activeTheme} textColor={textColor} />;
        }
        return (
            <TryAgainState
                theme={activeTheme}
                textColor={textColor}
                onRetry={() => window.location.reload()}
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
