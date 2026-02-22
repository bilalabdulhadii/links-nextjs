import type { CSSProperties } from "react";
import type { ButtonItem, StyleConfig, ThemeConfig } from "@/lib/app-config";
import { getIconById } from "@/lib/icons";
import { cn } from "@/lib/utils";

const hoverAnimationClass: Record<ThemeConfig["hoverAnimation"], string> = {
    none: "",
    lift: "hover-lift",
    float: "hover-float",
    pulse: "hover-pulse",
    pop: "hover-pop",
};

function buildStyle(
    base: StyleConfig,
    override?: Partial<StyleConfig>,
    preferSelfHover = false,
) {
    const borderColor = override?.borderColor ?? base.borderColor;
    const textColor = override?.textColor ?? base.textColor;
    const bgColor = override?.bgColor ?? base.bgColor;
    const hoverBorderColor =
        override?.hoverBorderColor ??
        (preferSelfHover ? borderColor : base.hoverBorderColor);
    const hoverTextColor =
        override?.hoverTextColor ??
        (preferSelfHover ? textColor : base.hoverTextColor);
    const hoverBgColor =
        override?.hoverBgColor ??
        (preferSelfHover ? bgColor : base.hoverBgColor);

    return {
        borderColor,
        textColor,
        bgColor,
        hoverBorderColor,
        hoverTextColor,
        hoverBgColor,
        radius: base.radius,
        textAlign: override?.textAlign ?? base.textAlign,
    };
}

export function ButtonsSection({
    buttons,
    style,
    hoverAnimation,
    hoverTransitionMs,
}: {
    buttons: ButtonItem[];
    style: StyleConfig;
    hoverAnimation: ThemeConfig["hoverAnimation"];
    hoverTransitionMs: number;
}) {
    return (
        <div className="flex flex-col gap-4">
            {buttons.map((button) => {
                const finalStyle = buildStyle(
                    style,
                    button.useCustomStyle ? button.customStyle : undefined,
                    Boolean(button.useCustomStyle),
                );
                const vars = {
                    "--btn-border": finalStyle.borderColor,
                    "--btn-text": finalStyle.textColor,
                    "--btn-bg": finalStyle.bgColor,
                    "--btn-hover-border": finalStyle.hoverBorderColor,
                    "--btn-hover-text": finalStyle.hoverTextColor,
                    "--btn-hover-bg": finalStyle.hoverBgColor,
                    "--btn-radius": `${finalStyle.radius}px`,
                } as CSSProperties;
                const Icon = getIconById(button.iconId);
                const isCard = button.layout === "card";
                const isIconOnly = button.layout === "icon-only";
                const isIconText = button.layout === "icon-text";
                const textAlignClass =
                    finalStyle.textAlign === "left"
                        ? "text-left items-start"
                        : finalStyle.textAlign === "right"
                          ? "text-right items-end"
                          : "text-center items-center";

                return (
                    <a
                        key={button.id}
                        href={button.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={button.label}
                        style={{
                            textAlign: finalStyle.textAlign,
                            transitionDuration: `${hoverTransitionMs}ms`,
                            ...vars,
                        }}
                        className={cn(
                            "group relative flex w-full",
                            "border border-[color:var(--btn-border)]",
                            "bg-[color:var(--btn-bg)] text-[color:var(--btn-text)]",
                            "rounded-[var(--btn-radius)]",
                            "transition",
                            "hover:[border-color:var(--btn-hover-border)]",
                            "hover:[background-color:var(--btn-hover-bg)]",
                            "hover:[color:var(--btn-hover-text)]",
                            hoverAnimationClass[hoverAnimation],
                            isCard
                                ? "flex-col items-stretch overflow-hidden"
                                : "items-center gap-4 px-4 py-3",
                            !isCard &&
                                (finalStyle.textAlign === "left"
                                    ? "justify-start"
                                    : finalStyle.textAlign === "right"
                                      ? "justify-end"
                                      : "justify-center"),
                        )}>
                        {isCard ? (
                            <>
                                <div className="relative h-36 w-full bg-white/10">
                                    {button.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={button.imageUrl}
                                            alt={button.label}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-white/60">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "flex flex-col gap-1 px-4 py-3",
                                        textAlignClass,
                                    )}>
                                    {button.eyebrow?.trim() ? (
                                        <span className="text-[11px] uppercase tracking-[0.25em] opacity-60">
                                            {button.eyebrow}
                                        </span>
                                    ) : null}
                                    <span className="text-base font-semibold">
                                        {button.label}
                                    </span>
                                </div>
                            </>
                        ) : null}

                        {isIconOnly ? (
                            <div className="flex w-full items-center justify-center">
                                <Icon className="size-5" aria-hidden="true" />
                            </div>
                        ) : null}

                        {isIconText ? (
                            <div className="flex items-center gap-3">
                                <Icon className="size-5" aria-hidden="true" />
                                <span className="font-medium">
                                    {button.label}
                                </span>
                            </div>
                        ) : null}

                        {button.layout === "text" ? (
                            <span className="font-medium">{button.label}</span>
                        ) : null}
                    </a>
                );
            })}
        </div>
    );
}
