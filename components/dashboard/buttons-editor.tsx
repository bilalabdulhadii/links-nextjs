"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorInput } from "@/components/ui/color-input";
import { IconSelect } from "@/components/ui/icon-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { iconOptions } from "@/lib/icons";
import { createId } from "@/lib/id";
import type { AppConfig, ButtonItem, ButtonLayout } from "@/lib/app-config";
import type { UploadResult } from "@/lib/storage";

const layoutOptions: { value: ButtonLayout; label: string }[] = [
    { value: "card", label: "Card + text" },
    { value: "text", label: "Text only" },
    { value: "icon-text", label: "Icon + text" },
    { value: "icon-only", label: "Icon only" },
];

const IMAGE_LIMIT_MB = 5;

export function ButtonsEditor({
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
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateButtons = (buttons: ButtonItem[]) => {
        onChange({ ...config, buttons });
    };

    const addButton = () => {
        updateButtons([
            ...config.buttons,
            {
                id: createId("btn"),
                layout: "text",
                label: "New button",
                url: "https://",
                iconId: iconOptions[0]?.id ?? "fa:link",
            },
        ]);
    };

    const moveButton = (index: number, direction: -1 | 1) => {
        const next = [...config.buttons];
        const target = index + direction;
        if (target < 0 || target >= next.length) {
            return;
        }
        const [item] = next.splice(index, 1);
        next.splice(target, 0, item);
        updateButtons(next);
    };

    const updateButton = (index: number, patch: Partial<ButtonItem>) => {
        const next = [...config.buttons];
        next[index] = { ...next[index], ...patch };
        updateButtons(next);
    };

    const handleImageUpload = async (index: number, file: File) => {
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
                ...prev,
                [config.buttons[index].id]: "Please upload an image file.",
            }));
            return;
        }

        if (file.size > IMAGE_LIMIT_MB * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                [config.buttons[index].id]:
                    `Image must be <= ${IMAGE_LIMIT_MB} MB.`,
            }));
            return;
        }

        const result = await onUpload(file, "media/buttons");
        setErrors((prev) => ({ ...prev, [config.buttons[index].id]: "" }));
        updateButton(index, { imageUrl: result.url, imagePath: result.path });
    };

    return (
        <Card id="buttons">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Buttons</CardTitle>
                <Button type="button" variant="outline" onClick={addButton}>
                    Add button
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {config.buttons.map((button, index) => (
                    <div
                        key={button.id}
                        className="rounded-lg border border-border p-4">
                        <div className="grid gap-4 md:grid-cols-[1fr_1fr_200px]">
                            <div className="grid gap-2">
                                <Label>Label</Label>
                                <Input
                                    value={button.label}
                                    onChange={(event) =>
                                        updateButton(index, {
                                            label: event.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>URL</Label>
                                <Input
                                    value={button.url}
                                    onChange={(event) =>
                                        updateButton(index, {
                                            url: event.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Layout</Label>
                                <select
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    value={button.layout}
                                    onChange={(event) =>
                                        updateButton(index, {
                                            layout: event.target
                                                .value as ButtonLayout,
                                            iconId:
                                                button.iconId ??
                                                iconOptions[0]?.id ??
                                                "fa:link",
                                        })
                                    }>
                                    {layoutOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {button.layout === "card" ? (
                            <div className="mt-4 grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Top label (optional)</Label>
                                    <Input
                                        value={button.eyebrow ?? ""}
                                        placeholder="Featured"
                                        onChange={(event) =>
                                            updateButton(index, {
                                                eyebrow: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Card image</Label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => {
                                                const file =
                                                    event.target.files?.[0];
                                                if (file) {
                                                    void handleImageUpload(
                                                        index,
                                                        file,
                                                    );
                                                }
                                            }}
                                        />
                                        {button.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={button.imageUrl}
                                                alt="Card preview"
                                                className="h-16 w-24 rounded-lg object-cover"
                                            />
                                        ) : null}
                                        {button.imageUrl ? (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    updateButton(index, {
                                                        imageUrl: "",
                                                        imagePath: "",
                                                    })
                                                }>
                                                Remove image
                                            </Button>
                                        ) : null}
                                    </div>
                                    {errors[button.id] ? (
                                        <p className="text-sm text-destructive">
                                            {errors[button.id]}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        {button.layout !== "text" &&
                        button.layout !== "card" ? (
                            <div className="mt-4 grid gap-2">
                                <Label>Icon</Label>
                                <IconSelect
                                    options={iconOptions}
                                    value={button.iconId ?? iconOptions[0]?.id ?? "fa:link"}
                                    onChange={(value) =>
                                        updateButton(index, {
                                            iconId: value,
                                        })
                                    }
                                />
                            </div>
                        ) : null}

                        <div className="mt-4 grid gap-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={button.useCustomStyle ?? false}
                                    onChange={(event) =>
                                        updateButton(index, {
                                            useCustomStyle:
                                                event.target.checked,
                                        })
                                    }
                                />
                                Custom colors
                            </label>
                        </div>

                        {button.useCustomStyle ? (
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Border color</Label>
                                    <ColorInput
                                        value={
                                            button.customStyle?.borderColor ??
                                            "#ffffff"
                                        }
                                        onChange={(value) =>
                                            updateButton(index, {
                                                customStyle: {
                                                    ...button.customStyle,
                                                    borderColor: value,
                                                },
                                            })
                                        }
                                        placeholder="ffffff (empty = transparent)"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Text color</Label>
                                    <ColorInput
                                        value={
                                            button.customStyle?.textColor ??
                                            "#ffffff"
                                        }
                                        onChange={(value) =>
                                            updateButton(index, {
                                                customStyle: {
                                                    ...button.customStyle,
                                                    textColor: value,
                                                },
                                            })
                                        }
                                        placeholder="0f172a (empty = transparent)"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Background color</Label>
                                    <ColorInput
                                        value={
                                            button.customStyle?.bgColor ??
                                            "#000000"
                                        }
                                        onChange={(value) =>
                                            updateButton(index, {
                                                customStyle: {
                                                    ...button.customStyle,
                                                    bgColor: value,
                                                },
                                            })
                                        }
                                        placeholder="0b1020 (empty = transparent)"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Hover border</Label>
                                    <ColorInput
                                        value={
                                            button.customStyle
                                                ?.hoverBorderColor ?? "#ffffff"
                                        }
                                        onChange={(value) =>
                                            updateButton(index, {
                                                customStyle: {
                                                    ...button.customStyle,
                                                    hoverBorderColor: value,
                                                },
                                            })
                                        }
                                        placeholder="e2e8f0 (empty = transparent)"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Hover text</Label>
                                    <ColorInput
                                        value={
                                            button.customStyle
                                                ?.hoverTextColor ?? "#000000"
                                        }
                                        onChange={(value) =>
                                            updateButton(index, {
                                                customStyle: {
                                                    ...button.customStyle,
                                                    hoverTextColor: value,
                                                },
                                            })
                                        }
                                        placeholder="0b1020 (empty = transparent)"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Hover background</Label>
                                    <ColorInput
                                        value={
                                            button.customStyle?.hoverBgColor ??
                                            "#ffffff"
                                        }
                                        onChange={(value) =>
                                            updateButton(index, {
                                                customStyle: {
                                                    ...button.customStyle,
                                                    hoverBgColor: value,
                                                },
                                            })
                                        }
                                        placeholder="f8fafc (empty = transparent)"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Text align</Label>
                                    <select
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={
                                            button.customStyle?.textAlign ??
                                            "center"
                                        }
                                        onChange={(event) =>
                                            updateButton(index, {
                                                customStyle: {
                                                    ...button.customStyle,
                                                    textAlign: event.target
                                                        .value as
                                                        | "left"
                                                        | "center"
                                                        | "right",
                                                },
                                            })
                                        }>
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => moveButton(index, -1)}
                                disabled={index === 0}>
                                Move up
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => moveButton(index, 1)}
                                disabled={index === config.buttons.length - 1}>
                                Move down
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                    updateButtons(
                                        config.buttons.filter(
                                            (_, idx) => idx !== index,
                                        ),
                                    )
                                }>
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
                {config.buttons.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No buttons yet. Add one to get started.
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
