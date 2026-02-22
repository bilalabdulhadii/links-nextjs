import type { ThemeConfig } from "@/lib/app-config";
import { Background } from "@/components/home/background";

const COMING_SOON_TITLE = "Coming soon";
const COMING_SOON_DESCRIPTION =
    "We’re preparing this page for you. Please check back shortly.";
const CUSTOM_FALLBACK_TITLE = "We’ll be right back";
const CUSTOM_FALLBACK_DESCRIPTION =
    "This page is temporarily unavailable. Please try again soon.";

export function UnpublishedState({
    theme,
    textColor,
    mode,
    title,
    description,
}: {
    theme: ThemeConfig;
    textColor: string;
    mode: "coming-soon" | "custom";
    title?: string;
    description?: string;
}) {
    const finalTitle =
        mode === "custom"
            ? title?.trim() || CUSTOM_FALLBACK_TITLE
            : COMING_SOON_TITLE;
    const finalDescription =
        mode === "custom"
            ? description?.trim() || CUSTOM_FALLBACK_DESCRIPTION
            : COMING_SOON_DESCRIPTION;

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background config={theme.background} />
            <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
                <div
                    className="relative flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-current/15 bg-white/10 px-8 py-10 text-center shadow-[0_30px_120px_-70px_rgba(15,23,42,0.35)] backdrop-blur"
                    style={{ color: textColor }}>
                    <div className="flex items-center gap-2 rounded-full border border-current/20 bg-white/20 px-4 py-1 text-[11px] uppercase tracking-[0.35em] opacity-70">
                        In the Studio
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {finalTitle}
                        </h1>
                        <p className="text-sm leading-relaxed opacity-75">
                            {finalDescription}
                        </p>
                    </div>
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/30">
                        <div className="h-full w-full bg-[linear-gradient(90deg,rgba(56,189,248,0)_0%,rgba(56,189,248,0.8)_40%,rgba(99,102,241,0.8)_60%,rgba(99,102,241,0)_100%)] animate-shimmer" />
                    </div>
                </div>
            </div>
        </div>
    );
}
