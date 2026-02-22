"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "@/components/dashboard/dashboard-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { defaultConfig, type AppConfig } from "@/lib/app-config";
import { cn } from "@/lib/utils";

const COMING_SOON_TITLE = "Coming soon";
const COMING_SOON_DESCRIPTION =
    "We’re preparing this page for you. Please check back shortly.";

function cloneDefaults(): AppConfig {
    if (typeof structuredClone === "function") {
        return structuredClone(defaultConfig) as AppConfig;
    }
    return JSON.parse(JSON.stringify(defaultConfig)) as AppConfig;
}

export default function SettingsPage() {
    const { draft, resetAndSave, saving, onChange } = useDashboard();
    const [tab, setTab] = useState<"reset" | "publishing">("publishing");
    const [unpublishOpen, setUnpublishOpen] = useState(false);
    const [publishOpen, setPublishOpen] = useState(false);
    const [pendingMode, setPendingMode] = useState<"coming-soon" | "custom">(
        draft.unpublishMode ?? "coming-soon",
    );
    const [pendingTitle, setPendingTitle] = useState(
        draft.unpublishTitle ?? "",
    );
    const [pendingDescription, setPendingDescription] = useState(
        draft.unpublishDescription ?? "",
    );

    useEffect(() => {
        if (!unpublishOpen) {
            return;
        }
        setPendingMode(draft.unpublishMode ?? "coming-soon");
        setPendingTitle(draft.unpublishTitle ?? "");
        setPendingDescription(draft.unpublishDescription ?? "");
    }, [unpublishOpen, draft]);

    const resetProfile = () => {
        const defaults = cloneDefaults();
        void resetAndSave({
            ...draft,
            siteTitle: defaults.siteTitle,
            profileTitle: defaults.profileTitle,
            description: defaults.description,
            profile: defaults.profile,
        });
    };

    const resetCover = () => {
        const defaults = cloneDefaults();
        void resetAndSave({
            ...draft,
            cover: defaults.cover,
        });
    };

    const resetIcons = () => {
        const defaults = cloneDefaults();
        void resetAndSave({
            ...draft,
            icons: defaults.icons,
        });
    };

    const resetButtons = () => {
        const defaults = cloneDefaults();
        void resetAndSave({
            ...draft,
            buttons: defaults.buttons,
        });
    };

    const resetTheme = () => {
        const defaults = cloneDefaults();
        void resetAndSave({
            ...draft,
            theme: defaults.theme,
        });
    };

    const resetAll = () => {
        const defaults = cloneDefaults();
        void resetAndSave({
            ...defaults,
            published: draft.published,
            unpublishMode: draft.unpublishMode,
            unpublishTitle: draft.unpublishTitle,
            unpublishDescription: draft.unpublishDescription,
        });
    };

    const handlePublishChange = (next: boolean) => {
        if (next) {
            setPublishOpen(true);
            return;
        }
        setUnpublishOpen(true);
    };

    const applyUnpublish = () => {
        const nextConfig: AppConfig = {
            ...draft,
            published: false,
            unpublishMode: pendingMode,
            unpublishTitle:
                pendingMode === "custom" ? pendingTitle : draft.unpublishTitle,
            unpublishDescription:
                pendingMode === "custom"
                    ? pendingDescription
                    : draft.unpublishDescription,
        };
        setUnpublishOpen(false);
        void resetAndSave(nextConfig);
    };

    const applyPublish = () => {
        const nextConfig: AppConfig = {
            ...draft,
            published: true,
        };
        setPublishOpen(false);
        void resetAndSave(nextConfig);
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
                        {(["publishing", "reset"] as const).map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setTab(item)}
                                className={cn(
                                    "rounded-md px-4 py-2 text-sm font-medium transition",
                                    tab === item
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                )}>
                                {item === "reset" ? "Reset" : "Publishing"}
                            </button>
                        ))}
                    </div>

                    {tab === "reset" ? (
                        <>
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium">Profile</p>
                                        <p className="text-sm text-muted-foreground">
                                            Site title, profile info, and
                                            profile image.
                                        </p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                disabled={saving}>
                                                Reset profile
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Reset profile?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will restore the
                                                    profile fields and profile
                                                    image to their defaults.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={resetProfile}>
                                                    Reset profile
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <Separator />
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium">Cover</p>
                                        <p className="text-sm text-muted-foreground">
                                            Cover style and cover media.
                                        </p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                disabled={saving}>
                                                Reset cover
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Reset cover?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will restore the cover
                                                    style and media to the
                                                    default.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={resetCover}>
                                                    Reset cover
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <Separator />
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium">Icons</p>
                                        <p className="text-sm text-muted-foreground">
                                            Icon links and their order.
                                        </p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                disabled={saving}>
                                                Reset icons
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Reset icons?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will restore the icon
                                                    list and ordering to the
                                                    defaults.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={resetIcons}>
                                                    Reset icons
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <Separator />
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium">Buttons</p>
                                        <p className="text-sm text-muted-foreground">
                                            Link buttons and card data.
                                        </p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                disabled={saving}>
                                                Reset buttons
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Reset buttons?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will restore all
                                                    buttons to the default set.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={resetButtons}>
                                                    Reset buttons
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <Separator />
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium">Theme</p>
                                        <p className="text-sm text-muted-foreground">
                                            Background, button styles, and icon
                                            styles.
                                        </p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                disabled={saving}>
                                                Reset theme
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Reset theme?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will restore the
                                                    background, button styles,
                                                    and icon styles to their
                                                    defaults.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={resetTheme}>
                                                    Reset theme
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="font-medium">
                                        Reset everything
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Restore the entire site to defaults.
                                    </p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            disabled={saving}>
                                            Reset all
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Reset everything?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will restore all settings,
                                                buttons, and icons to the
                                                default configuration.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={resetAll}
                                                className={buttonVariants({
                                                    variant: "destructive",
                                                })}>
                                                Reset all
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium">
                                        Publish site
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Control whether the public page is live
                                        or hidden.
                                    </p>
                                </div>
                                <Switch
                                    checked={draft.published}
                                    onCheckedChange={handlePublishChange}
                                />
                            </div>

                            {!draft.published ? (
                                <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/40 p-4">
                                    <div className="grid gap-2">
                                        <Label>Unpublished page</Label>
                                        <select
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                            value={draft.unpublishMode}
                                            onChange={(event) =>
                                                onChange({
                                                    ...draft,
                                                    unpublishMode: event.target
                                                        .value as "coming-soon" | "custom",
                                                })
                                            }>
                                            <option value="coming-soon">
                                                Coming soon
                                            </option>
                                            <option value="custom">
                                                Custom message
                                            </option>
                                        </select>
                                    </div>
                                    {draft.unpublishMode === "coming-soon" ? (
                                        <div className="rounded-xl border border-border/60 bg-background p-4 text-sm text-muted-foreground">
                                            <p className="font-medium text-foreground">
                                                {COMING_SOON_TITLE}
                                            </p>
                                            <p className="mt-1">
                                                {COMING_SOON_DESCRIPTION}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label>
                                                    Custom title
                                                </Label>
                                                <Input
                                                    value={
                                                        draft.unpublishTitle
                                                    }
                                                    onChange={(event) =>
                                                        onChange({
                                                            ...draft,
                                                            unpublishTitle:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                    placeholder="We’ll be right back"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>
                                                    Custom description
                                                </Label>
                                                <Input
                                                    value={
                                                        draft.unpublishDescription
                                                    }
                                                    onChange={(event) =>
                                                        onChange({
                                                            ...draft,
                                                            unpublishDescription:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                    placeholder="We’re updating the page. Check back soon."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={unpublishOpen} onOpenChange={setUnpublishOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unpublish site?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Visitors will see a temporary page instead of your
                            links until you publish again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Unpublished page</Label>
                            <select
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={pendingMode}
                                onChange={(event) =>
                                    setPendingMode(
                                        event.target.value as
                                            | "coming-soon"
                                            | "custom",
                                    )
                                }>
                                <option value="coming-soon">Coming soon</option>
                                <option value="custom">Custom message</option>
                            </select>
                        </div>
                        {pendingMode === "coming-soon" ? (
                            <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                                <p className="font-medium text-foreground">
                                    {COMING_SOON_TITLE}
                                </p>
                                <p className="mt-1">
                                    {COMING_SOON_DESCRIPTION}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Custom title</Label>
                                    <Input
                                        value={pendingTitle}
                                        onChange={(event) =>
                                            setPendingTitle(event.target.value)
                                        }
                                        placeholder="We’ll be right back"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Custom description</Label>
                                    <Input
                                        value={pendingDescription}
                                        onChange={(event) =>
                                            setPendingDescription(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="We’re updating the page. Check back soon."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={applyUnpublish}>
                            Unpublish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={publishOpen} onOpenChange={setPublishOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Publish site?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your public page will go live immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={applyPublish}
                            disabled={saving}>
                            Publish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
