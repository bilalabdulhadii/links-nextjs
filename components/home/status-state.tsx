import type { CSSProperties } from "react";
import type { ThemeConfig } from "@/lib/app-config";
import { Background } from "@/components/home/background";
import Link from "next/link";

type Action =
    | {
          label: string;
          href: string;
      }
    | {
          label: string;
          onClick: () => void;
      };

export function StatusState({
    theme,
    textColor,
    badge,
    title,
    description,
    primaryAction,
    secondaryAction,
}: {
    theme: ThemeConfig;
    textColor: string;
    badge: string;
    title: string;
    description: string;
    primaryAction?: Action;
    secondaryAction?: Action;
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

    const renderAction = (action?: Action) => {
        if (!action) return null;
        if ("href" in action) {
            return (
                <Link
                    href={action.href}
                    style={buttonVars}
                    className={buttonClassName}>
                    {action.label}
                </Link>
            );
        }
        return (
            <button
                type="button"
                onClick={action.onClick}
                style={buttonVars}
                className={buttonClassName}>
                {action.label}
            </button>
        );
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background config={theme.background} />
            <main className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
                <div
                    className="w-full max-w-md space-y-5 rounded-3xl border border-current/15 bg-white/10 px-8 py-10 shadow-[0_30px_120px_-70px_rgba(15,23,42,0.35)] backdrop-blur"
                    style={{ color: textColor }}>
                    <div className="inline-flex items-center justify-center rounded-full border border-current/20 bg-white/20 px-4 py-1 text-[11px] uppercase tracking-[0.35em] opacity-70">
                        {badge}
                    </div>
                    <h1 className="text-3xl font-semibold md:text-4xl">
                        {title}
                    </h1>
                    <p className="text-sm leading-relaxed opacity-75">
                        {description}
                    </p>
                    {primaryAction || secondaryAction ? (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {renderAction(primaryAction)}
                            {renderAction(secondaryAction)}
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
}
