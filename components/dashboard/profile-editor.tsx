"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorInput } from "@/components/ui/color-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    defaultConfig,
    type AppConfig,
    type CoverConfig,
    type ProfileConfig,
} from "@/lib/app-config";
import type { UploadResult } from "@/lib/storage";

export function ProfileEditor({
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
    const [profileError, setProfileError] = useState<string | null>(null);
    const [coverError, setCoverError] = useState<string | null>(null);
    const [profileProgress, setProfileProgress] = useState<number | null>(null);
    const [coverProgress, setCoverProgress] = useState<number | null>(null);
    const IMAGE_LIMIT_MB = 5;
    const PROFILE_RECOMMENDED = "500 x 500 (square)";
    const COVER_RECOMMENDED = "1200 x 400 (3:1)";
    const defaultProfileImageUrl =
        defaultConfig.profile.type === "image" ? defaultConfig.profile.url : "";
    const defaultProfileSolid =
        defaultConfig.profile.type === "solid"
            ? defaultConfig.profile.color
            : "#e2e8f0";
    const defaultProfileGradientColors =
        defaultConfig.profile.type === "gradient"
            ? defaultConfig.profile.colors
            : ["#f8fafc", "#e0f2fe", "#dbeafe"];
    const defaultProfileGradientDirection =
        defaultConfig.profile.type === "gradient"
            ? defaultConfig.profile.direction
            : "to bottom";
    const defaultCoverImageUrl =
        defaultConfig.cover.type === "image" ? defaultConfig.cover.url : "";
    const defaultCoverSolid =
        defaultConfig.cover.type === "solid"
            ? defaultConfig.cover.color
            : "#e2e8f0";
    const defaultCoverGradientColors =
        defaultConfig.cover.type === "gradient"
            ? defaultConfig.cover.colors
            : ["#f8fafc", "#e0f2fe", "#dbeafe"];
    const defaultCoverGradientDirection =
        defaultConfig.cover.type === "gradient"
            ? defaultConfig.cover.direction
            : "to bottom";

    const handleProfileUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setProfileError("Please upload an image file.");
            return;
        }
        if (file.size > IMAGE_LIMIT_MB * 1024 * 1024) {
            setProfileError(`Image must be <= ${IMAGE_LIMIT_MB} MB.`);
            return;
        }
        setProfileProgress(0);
        const result = await onUpload(file, "media/profile", (progress) => {
            setProfileProgress(progress);
        });
        setProfileError(null);
        onChange({
            ...config,
            profile: {
                type: "image",
                url: result.url,
                path: result.path,
            },
        });
        setTimeout(() => setProfileProgress(null), 800);
    };

    const handleProfileTypeChange = (nextType: ProfileConfig["type"]) => {
        setProfileError(null);
        if (nextType === "image") {
            if (config.profile.type === "image") {
                return;
            }
            onChange({
                ...config,
                profile: {
                    type: "image",
                    url: defaultProfileImageUrl,
                },
            });
            return;
        }

        if (nextType === "solid") {
            onChange({
                ...config,
                profile: {
                    type: "solid",
                    color:
                        config.profile.type === "solid"
                            ? config.profile.color
                            : defaultProfileSolid,
                },
            });
            return;
        }

        if (nextType === "gradient") {
            onChange({
                ...config,
                profile: {
                    type: "gradient",
                    colors:
                        config.profile.type === "gradient"
                            ? config.profile.colors
                            : defaultProfileGradientColors.slice(0, 2),
                    direction:
                        config.profile.type === "gradient"
                            ? config.profile.direction
                            : defaultProfileGradientDirection,
                },
            });
            return;
        }

        onChange({
            ...config,
            profile: { type: "transparent" },
        });
    };

    const handleCoverUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setCoverError("Please upload an image file.");
            return;
        }
        if (file.size > IMAGE_LIMIT_MB * 1024 * 1024) {
            setCoverError(`Image must be <= ${IMAGE_LIMIT_MB} MB.`);
            return;
        }
        setCoverProgress(0);
        const result = await onUpload(file, "media/cover", (progress) => {
            setCoverProgress(progress);
        });
        setCoverError(null);
        onChange({
            ...config,
            cover: {
                type: "image",
                url: result.url,
                path: result.path,
            },
        });
        setTimeout(() => setCoverProgress(null), 800);
    };

    const handleCoverTypeChange = (nextType: CoverConfig["type"]) => {
        setCoverError(null);
        if (nextType === "image") {
            if (config.cover.type === "image") {
                return;
            }
            onChange({
                ...config,
                cover: {
                    type: "image",
                    url: defaultCoverImageUrl,
                },
            });
            return;
        }

        if (nextType === "solid") {
            onChange({
                ...config,
                cover: {
                    type: "solid",
                    color:
                        config.cover.type === "solid"
                            ? config.cover.color
                            : defaultCoverSolid,
                },
            });
            return;
        }

        if (nextType === "gradient") {
            onChange({
                ...config,
                cover: {
                    type: "gradient",
                    colors:
                        config.cover.type === "gradient"
                            ? config.cover.colors
                            : defaultCoverGradientColors.slice(0, 2),
                    direction:
                        config.cover.type === "gradient"
                            ? config.cover.direction
                            : defaultCoverGradientDirection,
                },
            });
            return;
        }

        onChange({
            ...config,
            cover: { type: "transparent" },
        });
    };

    const profile = config.profile;
    const profileGradientColors =
        profile.type === "gradient"
            ? profile.colors
            : defaultProfileGradientColors.slice(0, 2);
    const profileGradientDirection =
        profile.type === "gradient"
            ? profile.direction
            : defaultProfileGradientDirection;
    const profileHasThirdColor =
        profile.type === "gradient" && profile.colors.length === 3;
    const updateProfileGradient = (
        colors: string[],
        direction = profileGradientDirection,
    ) => {
        onChange({
            ...config,
            profile: {
                type: "gradient",
                colors,
                direction,
            },
        });
    };

    const cover = config.cover;
    const gradientColors =
        cover.type === "gradient"
            ? cover.colors
            : defaultCoverGradientColors.slice(0, 2);
    const gradientDirection =
        cover.type === "gradient"
            ? cover.direction
            : defaultCoverGradientDirection;
    const hasThirdColor =
        cover.type === "gradient" && cover.colors.length === 3;
    const updateGradient = (
        colors: string[],
        direction = gradientDirection,
    ) => {
        onChange({
            ...config,
            cover: {
                type: "gradient",
                colors,
                direction,
            },
        });
    };

    return (
        <Card id="profile">
            <CardHeader>
                <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="siteTitle">Site title</Label>
                    <Input
                        id="siteTitle"
                        value={config.siteTitle}
                        onChange={(event) =>
                            onChange({
                                ...config,
                                siteTitle: event.target.value,
                            })
                        }
                        placeholder="Links"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="profileTitle">Profile title</Label>
                    <Input
                        id="profileTitle"
                        value={config.profileTitle}
                        onChange={(event) =>
                            onChange({
                                ...config,
                                profileTitle: event.target.value,
                            })
                        }
                        placeholder="Your name"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        value={config.description}
                        onChange={(event) =>
                            onChange({
                                ...config,
                                description: event.target.value,
                            })
                        }
                        rows={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="profileType">Profile style</Label>
                            <select
                                id="profileType"
                                value={profile.type}
                                onChange={(event) =>
                                    handleProfileTypeChange(
                                        event.target
                                            .value as ProfileConfig["type"],
                                    )
                                }
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <option value="image">Image</option>
                                <option value="solid">Solid color</option>
                                <option value="gradient">Gradient</option>
                                <option value="transparent">No profile</option>
                            </select>
                        </div>

                        {profile.type === "image" ? (
                            <div className="grid gap-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file =
                                                event.target.files?.[0];
                                            if (file) {
                                                void handleProfileUpload(file);
                                            }
                                        }}
                                    />
                                    {profile.url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={profile.url}
                                            alt="Profile preview"
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    ) : null}
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            onChange({
                                                ...config,
                                                profile: defaultConfig.profile,
                                            })
                                        }>
                                        Reset to default
                                    </Button>
                                </div>
                                {profileProgress !== null ? (
                                    <div className="space-y-1">
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-foreground transition-all"
                                                style={{
                                                    width: `${profileProgress}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Uploading... {profileProgress}%
                                        </p>
                                    </div>
                                ) : null}
                                <p className="text-xs text-muted-foreground">
                                    Recommended size: {PROFILE_RECOMMENDED}. Max{" "}
                                    {IMAGE_LIMIT_MB} MB.
                                </p>
                                {profileError ? (
                                    <p className="text-sm text-destructive">
                                        {profileError}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        {profile.type === "solid" ? (
                            <div className="grid gap-2">
                                <Label htmlFor="profileColor">
                                    Profile color
                                </Label>
                                <div className="flex items-center gap-3">
                                    <ColorInput
                                        value={profile.color}
                                        onChange={(value) =>
                                            onChange({
                                                ...config,
                                                profile: {
                                                    type: "solid",
                                                    color: value,
                                                },
                                            })
                                        }
                                        placeholder="ffffff (empty = transparent)"
                                    />
                                </div>
                            </div>
                        ) : null}

                        {profile.type === "gradient" ? (
                            <div className="grid gap-3">
                                <div className="grid gap-2">
                                    <Label>Gradient colors</Label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <ColorInput
                                            value={profileGradientColors[0]}
                                            onChange={(value) =>
                                                updateProfileGradient([
                                                    value,
                                                    profileGradientColors[1],
                                                    ...(profileHasThirdColor
                                                        ? [
                                                              profileGradientColors[2],
                                                          ]
                                                        : []),
                                                ])
                                            }
                                            placeholder="f8fafc (empty = transparent)"
                                        />
                                        <ColorInput
                                            value={profileGradientColors[1]}
                                            onChange={(value) =>
                                                updateProfileGradient([
                                                    profileGradientColors[0],
                                                    value,
                                                    ...(profileHasThirdColor
                                                        ? [
                                                              profileGradientColors[2],
                                                          ]
                                                        : []),
                                                ])
                                            }
                                            placeholder="e0f2fe (empty = transparent)"
                                        />
                                        {profileHasThirdColor ? (
                                            <ColorInput
                                                value={profileGradientColors[2]}
                                                onChange={(value) =>
                                                    updateProfileGradient([
                                                        profileGradientColors[0],
                                                        profileGradientColors[1],
                                                        value,
                                                    ])
                                                }
                                                placeholder="dbeafe (empty = transparent)"
                                            />
                                        ) : null}
                                        {profileHasThirdColor ? (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    updateProfileGradient([
                                                        profileGradientColors[0],
                                                        profileGradientColors[1],
                                                    ])
                                                }>
                                                Remove third
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    updateProfileGradient([
                                                        profileGradientColors[0],
                                                        profileGradientColors[1],
                                                        defaultProfileGradientColors[2] ??
                                                            profileGradientColors[1],
                                                    ])
                                                }>
                                                Add third
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="profileDirection">
                                        Direction
                                    </Label>
                                    <select
                                        id="profileDirection"
                                        value={profileGradientDirection}
                                        onChange={(event) =>
                                            updateProfileGradient(
                                                profileGradientColors,
                                                event.target.value,
                                            )
                                        }
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                        <option value="to bottom">
                                            Top to Bottom
                                        </option>
                                        <option value="to right">
                                            Left to Right
                                        </option>
                                        <option value="to bottom right">
                                            Top Left to Bottom Right
                                        </option>
                                        <option value="to bottom left">
                                            Top Right to Bottom Left
                                        </option>
                                        <option value="to top">
                                            Bottom to Top
                                        </option>
                                        <option value="to top right">
                                            Bottom Left to Top Right
                                        </option>
                                        <option value="to top left">
                                            Bottom Right to Top Left
                                        </option>
                                    </select>
                                </div>
                            </div>
                        ) : null}

                        {profile.type === "transparent" ? (
                            <p className="text-xs text-muted-foreground">
                                Profile image hidden.
                            </p>
                        ) : null}
                    </div>
                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="coverType">Cover style</Label>
                            <select
                                id="coverType"
                                value={cover.type}
                                onChange={(event) =>
                                    handleCoverTypeChange(
                                        event.target
                                            .value as CoverConfig["type"],
                                    )
                                }
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <option value="image">Image</option>
                                <option value="solid">Solid color</option>
                                <option value="gradient">Gradient</option>
                                <option value="transparent">Transparent</option>
                            </select>
                        </div>

                        {cover.type === "image" ? (
                            <div className="grid gap-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file =
                                                event.target.files?.[0];
                                            if (file) {
                                                void handleCoverUpload(file);
                                            }
                                        }}
                                    />
                                    {cover.url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={cover.url}
                                            alt="Cover preview"
                                            className="h-12 w-20 rounded-md object-cover"
                                        />
                                    ) : null}
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            handleCoverTypeChange("transparent")
                                        }>
                                        Remove cover
                                    </Button>
                                </div>
                                {coverProgress !== null ? (
                                    <div className="space-y-1">
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-foreground transition-all"
                                                style={{
                                                    width: `${coverProgress}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Uploading... {coverProgress}%
                                        </p>
                                    </div>
                                ) : null}
                                <p className="text-xs text-muted-foreground">
                                    Recommended size: {COVER_RECOMMENDED}. Max{" "}
                                    {IMAGE_LIMIT_MB} MB.
                                </p>
                                {coverError ? (
                                    <p className="text-sm text-destructive">
                                        {coverError}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        {cover.type === "solid" ? (
                            <div className="grid gap-2">
                                <Label htmlFor="coverColor">Cover color</Label>
                                <div className="flex items-center gap-3">
                                    <ColorInput
                                        value={cover.color}
                                        onChange={(value) =>
                                            onChange({
                                                ...config,
                                                cover: {
                                                    type: "solid",
                                                    color: value,
                                                },
                                            })
                                        }
                                        placeholder="ffffff (empty = transparent)"
                                    />
                                </div>
                            </div>
                        ) : null}

                        {cover.type === "gradient" ? (
                            <div className="grid gap-3">
                                <div className="grid gap-2">
                                    <Label>Gradient colors</Label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <ColorInput
                                            value={gradientColors[0]}
                                            onChange={(value) =>
                                                updateGradient([
                                                    value,
                                                    gradientColors[1],
                                                    ...(hasThirdColor
                                                        ? [gradientColors[2]]
                                                        : []),
                                                ])
                                            }
                                            placeholder="f8fafc (empty = transparent)"
                                        />
                                        <ColorInput
                                            value={gradientColors[1]}
                                            onChange={(value) =>
                                                updateGradient([
                                                    gradientColors[0],
                                                    value,
                                                    ...(hasThirdColor
                                                        ? [gradientColors[2]]
                                                        : []),
                                                ])
                                            }
                                            placeholder="e0f2fe (empty = transparent)"
                                        />
                                        {hasThirdColor ? (
                                            <ColorInput
                                                value={gradientColors[2]}
                                                onChange={(value) =>
                                                    updateGradient([
                                                        gradientColors[0],
                                                        gradientColors[1],
                                                        value,
                                                    ])
                                                }
                                                placeholder="dbeafe (empty = transparent)"
                                            />
                                        ) : null}
                                        {hasThirdColor ? (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    updateGradient([
                                                        gradientColors[0],
                                                        gradientColors[1],
                                                    ])
                                                }>
                                                Remove third
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    updateGradient([
                                                        gradientColors[0],
                                                        gradientColors[1],
                                                        defaultCoverGradientColors[2] ??
                                                            gradientColors[1],
                                                    ])
                                                }>
                                                Add third
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="coverDirection">
                                        Direction
                                    </Label>
                                    <select
                                        id="coverDirection"
                                        value={gradientDirection}
                                        onChange={(event) =>
                                            updateGradient(
                                                gradientColors,
                                                event.target.value,
                                            )
                                        }
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                        <option value="to bottom">
                                            Top to Bottom
                                        </option>
                                        <option value="to right">
                                            Left to Right
                                        </option>
                                        <option value="to bottom right">
                                            Top Left to Bottom Right
                                        </option>
                                        <option value="to bottom left">
                                            Top Right to Bottom Left
                                        </option>
                                        <option value="to top">
                                            Bottom to Top
                                        </option>
                                        <option value="to top right">
                                            Bottom Left to Top Right
                                        </option>
                                        <option value="to top left">
                                            Bottom Right to Top Left
                                        </option>
                                    </select>
                                </div>
                            </div>
                        ) : null}

                        {cover.type === "transparent" ? (
                            <p className="text-xs text-muted-foreground">
                                Cover is transparent. Your header stays clean
                                and minimal.
                            </p>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
