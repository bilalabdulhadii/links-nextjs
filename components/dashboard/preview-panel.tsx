"use client";

import { useState } from "react";
import type { AppConfig } from "@/lib/app-config";
import { HomeView } from "@/components/home/home-view";
import { HomeFooter } from "@/components/home/home-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const devices = [
    { key: "phone", label: "Phone", width: 390, height: 844 },
    { key: "tablet", label: "Tablet", width: 820, height: 1180 },
    { key: "desktop", label: "Desktop", width: 1280, height: 900 },
] as const;

type DeviceKey = (typeof devices)[number]["key"];
export function PreviewPanel({
    config,
    className,
}: {
    config: AppConfig;
    className?: string;
}) {
    const [view, setView] = useState<DeviceKey>("phone");
    const active = devices.find((item) => item.key === view) ?? devices[0];

    return (
        <Card className={cn("flex h-full flex-col", className)}>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Live Preview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        See unsaved changes instantly while you edit.
                    </p>
                </div>
                <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
                    {(
                        devices as readonly { key: DeviceKey; label: string }[]
                    ).map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => setView(item.key)}
                            className={cn(
                                "rounded-md px-4 py-2 text-sm font-medium transition",
                                view === item.key
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground",
                            )}>
                            {item.label}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-hidden">
                <div className="flex h-full min-h-0 flex-col items-stretch rounded-2xl border border-border/60 bg-muted/30 p-4 overflow-hidden">
                    <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground leading-tight">
                        <span>{active.label}</span>
                        <span className="tabular-nums">
                            {active.width}x{active.height}
                        </span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-sm">
                        <div className="h-full w-full overflow-scroll [scrollbar-gutter:stable_both-edges]">
                            <div className="min-h-full w-max mx-auto p-5 flex items-center justify-center">
                                <div
                                    className="overflow-hidden rounded-[24px] min-h-0 border border-border/60 bg-background"
                                    style={{
                                        width: active.width,
                                        height: active.height,
                                    }}>
                                    <HomeView
                                        config={config}
                                        fullHeight={false}
                                        rootClassName="h-full min-h-0"
                                        mainClassName="h-full min-h-0 py-8"
                                        footer={<HomeFooter />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
