"use client";

import { useState } from "react";
import { StyleEditor } from "@/components/dashboard/style-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorInput } from "@/components/ui/color-input";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultConfig, type AppConfig, type BackgroundConfig } from "@/lib/app-config";
import type { UploadResult } from "@/lib/storage";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const IMAGE_LIMIT_MB = 5;
const VIDEO_LIMIT_MB = 30;

const directions = [
    "to bottom",
    "to right",
    "to bottom right",
    "to top left",
    "to bottom left",
];

export function ThemeEditor({
    config,
    onChange,
    onUpload,
}: {
    config: AppConfig;
    onChange: (next: AppConfig) => void;
    onUpload: (
        file: File,
        folder: string,
        onProgress?: (progress: number) => void,
    ) => Promise<UploadResult>;
}) {
    const [error, setError] = useState<string | null>(null);
    const [openSections, setOpenSections] = useState<string[]>(["background"]);
    const [bgImageProgress, setBgImageProgress] = useState<number | null>(null);
    const [bgVideoProgress, setBgVideoProgress] = useState<number | null>(null);

    const updateTheme = (theme: AppConfig["theme"]) => {
        onChange({ ...config, theme });
    };

    const updateBackground = (background: BackgroundConfig) => {
        updateTheme({ ...config.theme, background });
    };

    const handleBackgroundType = (type: BackgroundConfig["type"]) => {
        if (type === "solid") {
            updateBackground({ type: "solid", color: "#0b1020" });
        }
        if (type === "gradient") {
            updateBackground({
                type: "gradient",
                colors: ["#0b1020", "#16233a", "#1f3148"],
                direction: "to bottom",
            });
        }
        if (type === "image") {
            updateBackground({ type: "image", url: "", path: "" });
        }
        if (type === "video") {
            updateBackground({ type: "video", url: "", path: "" });
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file.");
            return;
        }
        if (file.size > IMAGE_LIMIT_MB * 1024 * 1024) {
            setError(`Image must be <= ${IMAGE_LIMIT_MB} MB.`);
            return;
        }
        setBgImageProgress(0);
        const result = await onUpload(file, "media/background", (progress) => {
            setBgImageProgress(progress);
        });
        setError(null);
        updateBackground({ type: "image", url: result.url, path: result.path });
        setTimeout(() => setBgImageProgress(null), 800);
    };

    const handleVideoUpload = async (file: File) => {
        if (!file.type.startsWith("video/")) {
            setError("Please upload a video file.");
            return;
        }
        if (file.size > VIDEO_LIMIT_MB * 1024 * 1024) {
            setError(`Video must be <= ${VIDEO_LIMIT_MB} MB.`);
            return;
        }
        setBgVideoProgress(0);
        const result = await onUpload(file, "media/background", (progress) => {
            setBgVideoProgress(progress);
        });
        setError(null);
        updateBackground({ type: "video", url: result.url, path: result.path });
        setTimeout(() => setBgVideoProgress(null), 800);
    };

    const background = config.theme.background;
    const contentCard = config.theme.contentCard;
    const sections = [
        {
            id: "background",
            title: "Background",
            content: (
                <CardContent className="space-y-4 pt-0">
                    <div className="grid gap-2">
                        <Label>Type</Label>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={background.type}
                            onChange={(event) =>
                                handleBackgroundType(
                                    event.target.value as BackgroundConfig["type"],
                                )
                            }>
                            <option value="solid">Solid</option>
                            <option value="gradient">Gradient</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </select>
                    </div>

                    {background.type === "solid" ? (
                        <div className="grid gap-2">
                            <Label>Color</Label>
                            <ColorInput
                                value={background.color}
                                onChange={(value) =>
                                    updateBackground({
                                        ...background,
                                        color: value,
                                    })
                                }
                                placeholder="0b1020 (empty = transparent)"
                            />
                        </div>
                    ) : null}

                    {background.type === "gradient" ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Color 1</Label>
                                <ColorInput
                                    value={background.colors[0]}
                                    onChange={(value) => {
                                        const next = [...background.colors];
                                        next[0] = value;
                                        updateBackground({
                                            ...background,
                                            colors: next,
                                        });
                                    }}
                                    placeholder="0b1020 (empty = transparent)"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Color 2</Label>
                                <ColorInput
                                    value={background.colors[1]}
                                    onChange={(value) => {
                                        const next = [...background.colors];
                                        next[1] = value;
                                        updateBackground({
                                            ...background,
                                            colors: next,
                                        });
                                    }}
                                    placeholder="16233a (empty = transparent)"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Color 3 (optional)</Label>
                                <ColorInput
                                    value={background.colors[2] ?? "#1f3148"}
                                    onChange={(value) => {
                                        const next = [...background.colors];
                                        next[2] = value;
                                        updateBackground({
                                            ...background,
                                            colors: next,
                                        });
                                    }}
                                    placeholder="1f3148 (empty = transparent)"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Direction</Label>
                                <select
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    value={background.direction}
                                    onChange={(event) =>
                                        updateBackground({
                                            ...background,
                                            direction: event.target.value,
                                        })
                                    }>
                                    {directions.map((direction) => (
                                        <option key={direction} value={direction}>
                                            {direction}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : null}

                    {background.type === "image" ? (
                        <div className="grid gap-2">
                            <Label>Background image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        void handleImageUpload(file);
                                    }
                                }}
                            />
                            {bgImageProgress !== null ? (
                                <div className="space-y-1">
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-foreground transition-all"
                                            style={{
                                                width: `${bgImageProgress}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Uploading... {bgImageProgress}%
                                    </p>
                                </div>
                            ) : null}
                            {background.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={background.url}
                                    alt="Background"
                                    className="h-32 w-full rounded-lg object-cover"
                                />
                            ) : null}
                        </div>
                    ) : null}

                    {background.type === "video" ? (
                        <div className="grid gap-2">
                            <Label>Background video</Label>
                            <Input
                                type="file"
                                accept="video/*"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        void handleVideoUpload(file);
                                    }
                                }}
                            />
                            {bgVideoProgress !== null ? (
                                <div className="space-y-1">
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-foreground transition-all"
                                            style={{
                                                width: `${bgVideoProgress}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Uploading... {bgVideoProgress}%
                                    </p>
                                </div>
                            ) : null}
                            {background.url ? (
                                <video
                                    src={background.url}
                                    className="h-32 w-full rounded-lg object-cover"
                                    muted
                                    playsInline
                                />
                            ) : null}
                        </div>
                    ) : null}

                    {error ? (
                        <p className="text-sm text-destructive">{error}</p>
                    ) : null}
                </CardContent>
            ),
        },
        {
            id: "text-color",
            title: "Text Color",
            content: (
                <CardContent className="pt-0">
                    <div className="grid gap-2">
                        <Label>Title, description, modal, footer</Label>
                        <ColorInput
                            value={config.theme.textColor ?? ""}
                            onChange={(value) =>
                                updateTheme({
                                    ...config.theme,
                                    textColor: value,
                                })
                            }
                            placeholder="0f172a (empty = transparent)"
                        />
                    </div>
                </CardContent>
            ),
        },
        {
            id: "content-card",
            title: "Content Card",
            content: (
                <CardContent className="pt-0">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Background color</Label>
                            <ColorInput
                                value={contentCard?.bgColor ?? "#ffffff"}
                                onChange={(value) =>
                                    updateTheme({
                                        ...config.theme,
                                        contentCard: {
                                            ...contentCard,
                                            bgColor: value,
                                        },
                                    })
                                }
                                placeholder="e0f2fe (empty = transparent)"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Opacity (0 - 100)</Label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                step={1}
                                value={contentCard?.opacity ?? 100}
                                onChange={(event) => {
                                    const raw = Number(event.target.value);
                                    const next = Number.isFinite(raw)
                                        ? Math.max(0, Math.min(100, raw))
                                        : defaultConfig.theme.contentCard
                                              .opacity;
                                    updateTheme({
                                        ...config.theme,
                                        contentCard: {
                                            ...contentCard,
                                            opacity: next,
                                        },
                                    });
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Blur (px)</Label>
                            <Input
                                type="number"
                                min={0}
                                max={60}
                                step={1}
                                value={contentCard?.blur ?? 0}
                                onChange={(event) => {
                                    const raw = Number(event.target.value);
                                    const next = Number.isFinite(raw)
                                        ? Math.max(0, raw)
                                        : defaultConfig.theme.contentCard.blur;
                                    updateTheme({
                                        ...config.theme,
                                        contentCard: {
                                            ...contentCard,
                                            blur: next,
                                        },
                                    });
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Corner radius (px)</Label>
                            <Input
                                type="number"
                                min={0}
                                max={60}
                                step={1}
                                value={
                                    contentCard?.radius ??
                                    defaultConfig.theme.contentCard.radius
                                }
                                onChange={(event) => {
                                    const raw = Number(event.target.value);
                                    const next = Number.isFinite(raw)
                                        ? Math.max(0, raw)
                                        : defaultConfig.theme.contentCard
                                              .radius;
                                    updateTheme({
                                        ...config.theme,
                                        contentCard: {
                                            ...contentCard,
                                            radius: next,
                                        },
                                    });
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            ),
        },
        {
            id: "button-style",
            title: "Button Style",
            content: (
                <CardContent className="pt-0">
                    <StyleEditor
                        style={config.theme.buttonStyle}
                        onChange={(buttonStyle) =>
                            updateTheme({ ...config.theme, buttonStyle })
                        }
                    />
                </CardContent>
            ),
        },
        {
            id: "icon-style",
            title: "Icon Style",
            content: (
                <CardContent className="pt-0">
                    <StyleEditor
                        style={config.theme.iconStyle}
                        onChange={(iconStyle) =>
                            updateTheme({ ...config.theme, iconStyle })
                        }
                    />
                </CardContent>
            ),
        },
        {
            id: "hover-animation",
            title: "Hover Animation",
            content: (
                <CardContent className="pt-0">
                    <div className="grid gap-4">
                        <Label>Buttons, icons, share button</Label>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                            value={config.theme.hoverAnimation}
                            onChange={(event) =>
                                updateTheme({
                                    ...config.theme,
                                    hoverAnimation: event.target
                                        .value as AppConfig["theme"]["hoverAnimation"],
                                })
                            }>
                            <option value="none">None</option>
                            <option value="lift">Lift (smooth)</option>
                            <option value="float">Float</option>
                            <option value="pulse">Pulse</option>
                            <option value="pop">Pop</option>
                        </select>
                        <div className="grid gap-2">
                            <Label>Transition time (ms)</Label>
                            <Input
                                type="number"
                                min={80}
                                max={1200}
                                step={20}
                                value={config.theme.hoverTransitionMs ?? 0}
                                onChange={(event) => {
                                    const raw = event.target.value;
                                    const next =
                                        raw === ""
                                            ? defaultConfig.theme.hoverTransitionMs
                                            : Number(raw);
                                    updateTheme({
                                        ...config.theme,
                                        hoverTransitionMs:
                                            Number.isFinite(next) && next >= 0
                                                ? next
                                                : defaultConfig.theme
                                                      .hoverTransitionMs,
                                    });
                                }}
                            />
                            <p className="text-xs text-muted-foreground">
                                Set how fast hover animations and transitions
                                feel.
                            </p>
                        </div>
                    </div>
                </CardContent>
            ),
        },
    ];

    return (
        <div id="theme" className="grid gap-6">
            {sections.map((section) => {
                const isOpen = openSections.includes(section.id);
                return (
                    <Collapsible
                        key={section.id}
                        open={isOpen}
                        onOpenChange={(open) =>
                            setOpenSections((prev) =>
                                open
                                    ? [...prev, section.id]
                                    : prev.filter((id) => id !== section.id),
                            )
                        }>
                        <Card>
                            <CardHeader className="p-0">
                                <CollapsibleTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
                                        <CardTitle>{section.title}</CardTitle>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-transform",
                                                isOpen
                                                    ? "rotate-180"
                                                    : "rotate-0",
                                            )}
                                        />
                                    </button>
                                </CollapsibleTrigger>
                            </CardHeader>
                            <CollapsibleContent>
                                {section.content}
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                );
            })}
        </div>
    );
}
