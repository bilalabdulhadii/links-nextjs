"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { useDashboard } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardOverviewPage() {
    const { draft, status, isDirty } = useDashboard();

    return (
        <div className="grid gap-6">
            {!draft.published ? (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <Info className="mt-0.5 size-4" />
                    <div>
                        <p className="font-medium">Site is unpublished.</p>
                        <p className="text-amber-900/80">
                            Go to{" "}
                            <Link
                                href="/dashboard/settings"
                                className="font-medium underline">
                                Settings
                            </Link>{" "}
                            to publish your page.
                        </p>
                    </div>
                </div>
            ) : null}
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Icons</p>
                        <p className="text-2xl font-semibold">
                            {draft.icons.length}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Buttons</p>
                        <p className="text-2xl font-semibold">
                            {draft.buttons.length}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href="/dashboard/profile">Edit Profile</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/buttons">
                                Manage Buttons
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/theme">Customize Theme</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/preview">
                                Live Preview
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/" target="_blank" rel="noreferrer">
                                View Public Site
                            </Link>
                        </Button>
                    </div>
                    <Separator />
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                        <div>
                            {isDirty
                                ? "You have unsaved changes."
                                : "All changes are saved."}
                        </div>
                        {status ? <div>{status}</div> : null}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Shortcuts</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between gap-4">
                        <span>Save changes</span>
                        <div className="flex items-center gap-2">
                            <kbd className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                ⌘S
                            </kbd>
                            <span className="text-xs">/</span>
                            <kbd className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                Ctrl+S
                            </kbd>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span>Open preview</span>
                        <div className="flex items-center gap-2">
                            <kbd className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                ⌘P
                            </kbd>
                            <span className="text-xs">/</span>
                            <kbd className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                Ctrl+P
                            </kbd>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span>Cancel changes</span>
                        <div className="flex items-center gap-2">
                            <kbd className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                Esc
                            </kbd>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span>Open help</span>
                        <div className="flex items-center gap-2">
                            <kbd className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                ⌘H
                            </kbd>
                            <span className="text-xs">/</span>
                            <kbd className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                Ctrl+H
                            </kbd>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span>Jump to page</span>
                        <div className="flex items-center gap-2">
                            <kbd className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                ⌘K
                            </kbd>
                            <span className="text-xs">/</span>
                            <kbd className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                Ctrl+K
                            </kbd>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
