import type { CSSProperties } from "react";
import type { ThemeConfig } from "@/lib/app-config";
import { Background } from "@/components/home/background";

export function TryAgainState({
    theme,
    textColor,
    onRetry,
}: {
    theme: ThemeConfig;
    textColor: string;
    onRetry: () => void;
}) {
    const buttonVars = {
        "--btn-border": theme.buttonStyle.borderColor,
        "--btn-text": theme.buttonStyle.textColor,
        "--btn-bg": theme.buttonStyle.bgColor,
        "--btn-hover-border": theme.buttonStyle.hoverBorderColor,
        "--btn-hover-text": theme.buttonStyle.hoverTextColor,
        "--btn-hover-bg": theme.buttonStyle.hoverBgColor,
        "--btn-radius": `${theme.buttonStyle.radius}px`,
        transitionDuration: `${theme.hoverTransitionMs}ms`,
    } as CSSProperties;

    const buttonClassName =
        "inline-flex items-center justify-center gap-2 rounded-[var(--btn-radius)] border border-[color:var(--btn-border)] bg-[color:var(--btn-bg)] px-5 py-2 text-sm font-medium text-[color:var(--btn-text)] transition hover:[border-color:var(--btn-hover-border)] hover:[background-color:var(--btn-hover-bg)] hover:[color:var(--btn-hover-text)] cursor-pointer";

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background config={theme.background} />
            <main className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
                <div
                    className="max-w-lg space-y-5"
                    style={{ color: textColor }}>
                    <p className="text-xs uppercase tracking-[0.4em] opacity-60">
                        Links
                    </p>
                    <h1 className="text-3xl font-semibold md:text-4xl">
                        Try again
                    </h1>
                    <p className="text-sm leading-relaxed opacity-75">
                        We couldn&apos;t load your links right now. Please try
                        again in a moment.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={onRetry}
                            style={buttonVars}
                            className={buttonClassName}>
                            Try again
                        </button>
                        <a
                            href="mailto:bilalabdulhadi88@gmail.com"
                            style={buttonVars}
                            className={buttonClassName}>
                            Contact us
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
