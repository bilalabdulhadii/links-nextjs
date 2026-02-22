"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppConfig, StyleConfig } from "@/lib/app-config";
import { themeTemplates } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, Search } from "lucide-react";

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

function swatchStyle(style: Partial<StyleConfig>, fallback: string) {
    return {
        borderColor: style.borderColor ?? fallback,
        backgroundColor: style.bgColor ?? "#ffffff",
        color: style.textColor ?? fallback,
    };
}

export function TemplatesEditor({
    config,
    onChange,
    cancelSignal,
    saveSignal,
    rememberThemeBackup,
    clearThemeBackupDraft,
    rememberButtonStyleBackup,
    clearButtonStyleBackupDraft,
}: {
    config: AppConfig;
    onChange: (next: AppConfig) => void;
    cancelSignal: number;
    saveSignal: number;
    rememberThemeBackup: (theme: AppConfig["theme"]) => void;
    clearThemeBackupDraft: () => void;
    rememberButtonStyleBackup: (
        backup: Record<
            string,
            {
                useCustomStyle?: boolean;
                customStyle?: Partial<StyleConfig>;
            }
        >,
    ) => void;
    clearButtonStyleBackupDraft: () => void;
}) {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState("");
    const [filter, setFilter] = useState<"all" | "light" | "dark">("all");
    const [query, setQuery] = useState("");

    const selected = useMemo(
        () => themeTemplates.find((template) => template.id === selectedId),
        [selectedId],
    );
    const orderedTemplates = useMemo(() => {
        const order = [
            "default-light",
            "aurora-glass",
            "coastal-blue",
            "lagoon",
            "ice-blue",
            "mint-cloud",
            "emerald-bay",
            "sage-studio",
            "silverline",
            "fog",
            "pebble",
            "graphite-mist",
            "nordic-dawn",
            "mocha-mousse",
            "desert-dune",
            "citrus-mist",
            "citrus-pop",
            "sunrise",
            "peach-studio",
            "sunset-clay",
            "terracotta",
            "ruby-cream",
            "sakura-bloom",
            "lilac-bloom",
            "velvet-plum",
            "orchid-ice",
            "obsidian-dev",
            "night-owl",
            "forest-night",
            "steel",
            "midnight-neon",
            "neon-terminal",
            "mono-ink",
            "noir-paper",
        ];
        const orderIndex = new Map(order.map((id, index) => [id, index]));
        return [...themeTemplates].sort((a, b) => {
            const aIndex = orderIndex.get(a.id) ?? 999;
            const bIndex = orderIndex.get(b.id) ?? 999;
            if (aIndex !== bIndex) {
                return aIndex - bIndex;
            }
            return a.name.localeCompare(b.name);
        });
    }, []);

    const filteredTemplates = useMemo(() => {
        if (filter === "all") {
            return orderedTemplates;
        }
        return orderedTemplates.filter((template) => template.tone === filter);
    }, [filter, orderedTemplates]);

    const searchFilteredTemplates = useMemo(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) {
            return filteredTemplates;
        }
        return filteredTemplates.filter(
            (template) =>
                template.name.toLowerCase().includes(trimmed) ||
                template.description.toLowerCase().includes(trimmed),
        );
    }, [filteredTemplates, query]);

    const totalCount = themeTemplates.length;
    const lightCount = useMemo(
        () =>
            themeTemplates.filter((template) => template.tone === "light")
                .length,
        [],
    );
    const darkCount = useMemo(
        () =>
            themeTemplates.filter((template) => template.tone === "dark")
                .length,
        [],
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedId("");
    }, [cancelSignal]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedId("");
    }, [saveSignal]);

    const applyTemplate = () => {
        if (!selected) {
            return;
        }
        rememberThemeBackup(config.theme);
        const backup = Object.fromEntries(
            config.buttons.map((button) => [
                button.id,
                {
                    useCustomStyle: button.useCustomStyle,
                    customStyle: button.customStyle,
                },
            ]),
        );
        rememberButtonStyleBackup(backup);

        const keepMediaBackground =
            config.theme.background.type === "image" ||
            config.theme.background.type === "video";
        const nextBackground = keepMediaBackground
            ? config.theme.background
            : selected.background;

        const nextCover =
            config.cover.type === "image" ? config.cover : selected.cover;

        const nextButtons = config.buttons.map((button) => {
            const shouldApply =
                Boolean(button.useCustomStyle) || Boolean(button.customStyle);
            if (!shouldApply) {
                return button;
            }
            return {
                ...button,
                useCustomStyle: true,
                customStyle: {
                    ...button.customStyle,
                    ...selected.customButtonStyle,
                },
            };
        });

        onChange({
            ...config,
            cover: nextCover,
            theme: {
                ...config.theme,
                ...selected.theme,
                background: nextBackground,
            },
            buttons: nextButtons,
        });
    };

    return (
        <Card>
            <CardHeader className="sticky top-0 z-30 gap-4 border-b border-border/60 bg-background/90 backdrop-blur">
                <div className="flex items-center justify-between pt-2">
                    <CardTitle>Templates</CardTitle>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                    <span>
                        {selected
                            ? `Selected: ${selected.name}`
                            : "No template selected"}
                    </span>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSelectedId("");
                                clearThemeBackupDraft();
                                clearButtonStyleBackupDraft();
                            }}
                            disabled={!selected}>
                            Reset
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard/preview")}
                            className="gap-2">
                            <Eye className="h-4 w-4" />
                            Preview
                        </Button>
                        <Button
                            type="button"
                            onClick={applyTemplate}
                            disabled={!selected}>
                            Set template
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search templates..."
                            className="pl-9"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: "all", label: "All", count: totalCount },
                            { id: "light", label: "Light", count: lightCount },
                            { id: "dark", label: "Dark", count: darkCount },
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                    setFilter(
                                        item.id as "all" | "light" | "dark",
                                    )
                                }
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition",
                                    filter === item.id
                                        ? "border-foreground/20 bg-foreground/5 text-foreground"
                                        : "border-border/60 text-muted-foreground hover:text-foreground",
                                )}>
                                {item.label}
                                <span className="rounded-full border border-border/60 bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                    {item.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-6">
                {searchFilteredTemplates.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
                        No templates match your search.
                    </div>
                ) : filter === "all" ? (
                    <div className="grid gap-8">
                        {(["light", "dark"] as const).map((tone) => {
                            const group = searchFilteredTemplates.filter(
                                (template) => template.tone === tone,
                            );
                            if (!group.length) {
                                return null;
                            }
                            return (
                                <div key={tone} className="grid gap-3">
                                    <div className="flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        <span>{tone} themes</span>
                                        <span className="ml-2 rounded-full border border-border/60 bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                            {group.length}
                                        </span>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {group.map((template) => {
                                            const isSelected =
                                                template.id === selectedId;
                                            const backgroundStyle =
                                                template.background.type ===
                                                "solid"
                                                    ? {
                                                          backgroundColor:
                                                              template
                                                                  .background
                                                                  .color,
                                                      }
                                                    : {
                                                          backgroundImage: `linear-gradient(${template.background.direction}, ${template.background.colors.join(", ")})`,
                                                      };
                                            const coverStyle =
                                                template.cover.type === "solid"
                                                    ? {
                                                          backgroundColor:
                                                              template.cover
                                                                  .color,
                                                      }
                                                    : template.cover.type ===
                                                        "gradient"
                                                      ? {
                                                            backgroundImage: `linear-gradient(${template.cover.direction}, ${template.cover.colors.join(", ")})`,
                                                        }
                                                      : {
                                                            backgroundColor:
                                                                "transparent",
                                                        };

                                            const cardBg = toRgba(
                                                template.theme.contentCard
                                                    .bgColor,
                                                template.theme.contentCard
                                                    .opacity,
                                            );
                                            const glassStyle = {
                                                backgroundColor: cardBg,
                                                backdropFilter: `blur(${template.theme.contentCard.blur}px)`,
                                                WebkitBackdropFilter: `blur(${template.theme.contentCard.blur}px)`,
                                            };

                                            return (
                                                <button
                                                    key={template.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedId((prev) => {
                                                            if (
                                                                prev ===
                                                                template.id
                                                            ) {
                                                                clearThemeBackupDraft();
                                                                clearButtonStyleBackupDraft();
                                                                return "";
                                                            }
                                                            return template.id;
                                                        })
                                                    }
                                                    className={cn(
                                                        "group rounded-2xl border p-4 text-left transition",
                                                        isSelected
                                                            ? "border-primary ring-2 ring-primary/40"
                                                            : "border-border/60 hover:border-foreground/20 hover:shadow-sm",
                                                    )}>
                                                    <div
                                                        className="relative h-32 overflow-hidden rounded-xl"
                                                        style={backgroundStyle}>
                                                        <div
                                                            className="absolute inset-2 rounded-lg border border-white/60"
                                                            style={glassStyle}
                                                        />
                                                        <div className="relative flex h-full flex-col gap-2 p-3">
                                                            <div
                                                                className="h-4 rounded-md"
                                                                style={
                                                                    coverStyle
                                                                }
                                                            />
                                                            <div className="mt-auto flex flex-col gap-2">
                                                                <div className="flex gap-2">
                                                                    {Array.from(
                                                                        {
                                                                            length: 3,
                                                                        },
                                                                    ).map(
                                                                        (
                                                                            _,
                                                                            index,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="h-6 w-6 rounded-full border"
                                                                                style={swatchStyle(
                                                                                    template
                                                                                        .theme
                                                                                        .iconStyle,
                                                                                    "#0f172a",
                                                                                )}
                                                                            />
                                                                        ),
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className="h-5 rounded-md border"
                                                                    style={swatchStyle(
                                                                        template
                                                                            .theme
                                                                            .buttonStyle,
                                                                        "#0f172a",
                                                                    )}
                                                                />
                                                                <div
                                                                    className="h-5 rounded-md border"
                                                                    style={swatchStyle(
                                                                        template.customButtonStyle,
                                                                        "#0f172a",
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex items-start justify-between gap-3">
                                                        <div>
                                                            <h3 className="text-sm font-semibold">
                                                                {template.name}
                                                            </h3>
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    template.description
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="rounded-full border border-border/60 bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
                                                                {template.tone ===
                                                                "dark"
                                                                    ? "Dark"
                                                                    : "Light"}
                                                            </span>
                                                            {isSelected ? (
                                                                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
                                                                    Selected
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {searchFilteredTemplates.map((template) => {
                            const isSelected = template.id === selectedId;
                            const backgroundStyle =
                                template.background.type === "solid"
                                    ? {
                                          backgroundColor:
                                              template.background.color,
                                      }
                                    : {
                                          backgroundImage: `linear-gradient(${template.background.direction}, ${template.background.colors.join(", ")})`,
                                      };
                            const coverStyle =
                                template.cover.type === "solid"
                                    ? { backgroundColor: template.cover.color }
                                    : template.cover.type === "gradient"
                                      ? {
                                            backgroundImage: `linear-gradient(${template.cover.direction}, ${template.cover.colors.join(", ")})`,
                                        }
                                      : { backgroundColor: "transparent" };

                            const cardBg = toRgba(
                                template.theme.contentCard.bgColor,
                                template.theme.contentCard.opacity,
                            );
                            const glassStyle = {
                                backgroundColor: cardBg,
                                backdropFilter: `blur(${template.theme.contentCard.blur}px)`,
                                WebkitBackdropFilter: `blur(${template.theme.contentCard.blur}px)`,
                            };

                            return (
                                <button
                                    key={template.id}
                                    type="button"
                                    onClick={() =>
                                        setSelectedId((prev) => {
                                            if (prev === template.id) {
                                                clearThemeBackupDraft();
                                                clearButtonStyleBackupDraft();
                                                return "";
                                            }
                                            return template.id;
                                        })
                                    }
                                    className={cn(
                                        "group rounded-2xl border p-4 text-left transition",
                                        isSelected
                                            ? "border-primary ring-2 ring-primary/40"
                                            : "border-border/60 hover:border-foreground/20 hover:shadow-sm",
                                    )}>
                                    <div
                                        className="relative h-32 overflow-hidden rounded-xl"
                                        style={backgroundStyle}>
                                        <div
                                            className="absolute inset-2 rounded-lg border border-white/60"
                                            style={glassStyle}
                                        />
                                        <div className="relative flex h-full flex-col gap-2 p-3">
                                            <div
                                                className="h-4 rounded-md"
                                                style={coverStyle}
                                            />
                                            <div className="mt-auto flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    {Array.from({
                                                        length: 3,
                                                    }).map((_, index) => (
                                                        <span
                                                            key={index}
                                                            className="h-6 w-6 rounded-full border"
                                                            style={swatchStyle(
                                                                template.theme
                                                                    .iconStyle,
                                                                "#0f172a",
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <div
                                                    className="h-5 rounded-md border"
                                                    style={swatchStyle(
                                                        template.theme
                                                            .buttonStyle,
                                                        "#0f172a",
                                                    )}
                                                />
                                                <div
                                                    className="h-5 rounded-md border"
                                                    style={swatchStyle(
                                                        template.customButtonStyle,
                                                        "#0f172a",
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-sm font-semibold">
                                                {template.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {template.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full border border-border/60 bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
                                                {template.tone === "dark"
                                                    ? "Dark"
                                                    : "Light"}
                                            </span>
                                            {isSelected ? (
                                                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
                                                    Selected
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
