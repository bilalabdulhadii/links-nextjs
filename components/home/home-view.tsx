import type { CSSProperties, ReactNode } from "react";
import type { AppConfig } from "@/lib/app-config";
import { Background } from "@/components/home/background";
import { ButtonsSection } from "@/components/home/buttons-section";
import { IconsRow } from "@/components/home/icons-row";
import { cn } from "@/lib/utils";

export function HomeView({
    config,
    headerActions,
    textColor,
    fullHeight = true,
    showFooter = true,
    footer,
    rootClassName,
    mainClassName,
}: {
    config: AppConfig;
    headerActions?: ReactNode;
    textColor?: string;
    fullHeight?: boolean;
    showFooter?: boolean;
    footer?: ReactNode;
    rootClassName?: string;
    mainClassName?: string;
}) {
    const resolvedTextColor = textColor || config.theme.textColor || "#0f172a";
    const contentCard = config.theme.contentCard;
    const contentOpacity = Math.max(
        0,
        Math.min(100, contentCard?.opacity ?? 100),
    );
    const cardBackground = toRgba(
        contentCard?.bgColor ?? "#ffffff",
        contentOpacity,
    );
    const blurValue = contentCard?.blur ?? 0;
    const blurFilter = blurValue > 0 ? `blur(${blurValue}px)` : undefined;
    const cardStyle: CSSProperties = {
        backgroundColor: cardBackground,
        backdropFilter: blurFilter,
        WebkitBackdropFilter: blurFilter,
    };
    const rootClasses = cn(
        "relative overflow-hidden",
        fullHeight ? "min-h-screen" : "min-h-0",
        rootClassName,
    );
    const mainClasses = cn(
        "relative z-10 flex flex-col items-center px-6 py-10",
        fullHeight ? "min-h-screen" : "min-h-0",
        mainClassName,
    );

    return (
        <div className={rootClasses}>
            <Background config={config.theme.background} />

            <main className={mainClasses}>
                <div className="w-full max-w-md">
                    <div
                        className="relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200/70 shadow-[0_30px_120px_-60px_rgba(15,23,42,0.25)]"
                        style={cardStyle}>
                        <div className="relative h-32 w-full overflow-hidden">
                            {config.cover.type === "image" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={config.cover.url}
                                    alt="Cover"
                                    className="h-full w-full object-cover"
                                    style={{
                                        objectPosition:
                                            config.cover.position ?? "center",
                                    }}
                                />
                            ) : null}
                            {config.cover.type === "solid" ? (
                                <div
                                    className="h-full w-full"
                                    style={{
                                        backgroundColor: config.cover.color,
                                    }}
                                />
                            ) : null}
                            {config.cover.type === "gradient" ? (
                                <div
                                    className="h-full w-full"
                                    style={{
                                        backgroundImage: `linear-gradient(${config.cover.direction}, ${config.cover.colors.join(", ")})`,
                                    }}
                                />
                            ) : null}
                            {config.cover.type === "transparent" ? (
                                <div className="h-full w-full bg-transparent" />
                            ) : null}
                            {config.cover.type !== "transparent" ? (
                                <div
                                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                                    style={{
                                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0), ${toRgba(
                                            contentCard?.bgColor ?? "#ffffff",
                                            contentOpacity,
                                        )})`,
                                    }}
                                />
                            ) : null}
                            
                            {headerActions ? (
                                <div className="absolute right-3 top-3 flex items-center gap-2">
                                    {headerActions}
                                </div>
                            ) : null}
                        </div>

                        <div
                            className={`relative flex flex-col items-center text-center px-6 pb-6 ${config.profile.type === "transparent" ? "mt-4" : "-mt-10"}`}>
                            {config.profile.type !== "transparent" ? (
                                <div
                                    className={`h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-sm ${config.profile.type === "image" ? "bg-white" : ""}`}
                                    style={
                                        config.profile.type === "solid"
                                            ? {
                                                  backgroundColor:
                                                      config.profile.color,
                                              }
                                            : config.profile.type === "gradient"
                                              ? {
                                                    backgroundImage: `linear-gradient(${config.profile.direction}, ${config.profile.colors.join(", ")})`,
                                                }
                                              : undefined
                                    }>
                                    {config.profile.type === "image" ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={config.profile.url}
                                            alt={
                                                config.profileTitle || "Profile"
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : null}
                                </div>
                            ) : null}
                            <h1
                                className="mt-4 text-3xl font-semibold tracking-tight"
                                style={{ color: resolvedTextColor }}>
                                {config.profileTitle || "Your profile"}
                            </h1>
                            <p
                                className="mt-2 text-sm leading-relaxed"
                                style={{ color: resolvedTextColor }}>
                                {config.description}
                            </p>
                        </div>

                        <div className="px-6 pb-6">
                            <IconsRow
                                icons={config.icons}
                                style={config.theme.iconStyle}
                                hoverAnimation={config.theme.hoverAnimation}
                                hoverTransitionMs={
                                    config.theme.hoverTransitionMs
                                }
                            />

                            <div id="links" className="mt-9 space-y-10">
                                <ButtonsSection
                                    buttons={config.buttons}
                                    style={config.theme.buttonStyle}
                                    hoverAnimation={config.theme.hoverAnimation}
                                    hoverTransitionMs={
                                        config.theme.hoverTransitionMs
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {showFooter ? (
                    <footer
                        className="mt-auto pb-4 pt-6 text-center text-[11px]"
                        style={{ color: resolvedTextColor }}>
                        {footer ?? "Built with Links"}
                    </footer>
                ) : null}
            </main>
        </div>
    );
}

function toRgba(color: string, opacity: number) {
    if (!color) {
        return "transparent";
    }
    const raw = color.trim();
    if (!raw || raw.toLowerCase() === "transparent") {
        return "transparent";
    }
    const hex = raw.startsWith("#") ? raw.slice(1) : raw;
    const normalized =
        hex.length === 3
            ? hex
                  .split("")
                  .map((char) => `${char}${char}`)
                  .join("")
            : hex;
    if (normalized.length !== 6) {
        return raw;
    }
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const alpha = Math.max(0, Math.min(100, opacity)) / 100;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
