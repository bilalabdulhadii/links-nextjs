import type { CSSProperties } from "react";
import type { IconItem, StyleConfig, ThemeConfig } from "@/lib/app-config";
import { getIconById } from "@/lib/icons";
import { cn } from "@/lib/utils";

const hoverAnimationClass: Record<ThemeConfig["hoverAnimation"], string> = {
    none: "",
    lift: "hover-lift",
    float: "hover-float",
    pulse: "hover-pulse",
    pop: "hover-pop",
};

export function IconsRow({
    icons,
    style,
    hoverAnimation,
    hoverTransitionMs,
}: {
    icons: IconItem[];
    style: StyleConfig;
    hoverAnimation: ThemeConfig["hoverAnimation"];
    hoverTransitionMs: number;
}) {
    const vars = {
        "--icon-border": style.borderColor,
        "--icon-bg": style.bgColor,
        "--icon-text": style.textColor,
        "--icon-hover-border": style.hoverBorderColor,
        "--icon-hover-bg": style.hoverBgColor,
        "--icon-hover-text": style.hoverTextColor,
        "--icon-radius": `${style.radius}px`,
    } as CSSProperties;

    return (
        <div className="flex flex-wrap justify-center gap-3" style={vars}>
            {icons.map((icon) => {
                const Icon = getIconById(icon.iconId);
                return (
                    <a
                        key={icon.id}
                        href={icon.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={icon.label}
                        style={{
                            transitionDuration: `${hoverTransitionMs}ms`,
                        }}
                        className={cn(
                            "group relative flex size-12 items-center justify-center",
                            "border border-[color:var(--icon-border)]",
                            "bg-[color:var(--icon-bg)] text-[color:var(--icon-text)]",
                            "rounded-[var(--icon-radius)]",
                            "transition",
                            "hover:[border-color:var(--icon-hover-border)]",
                            "hover:[background-color:var(--icon-hover-bg)]",
                            "hover:[color:var(--icon-hover-text)]",
                            hoverAnimationClass[hoverAnimation],
                        )}>
                        <Icon className="size-5" aria-hidden="true" />
                        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-3 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                            {icon.label}
                        </span>
                    </a>
                );
            })}
        </div>
    );
}
