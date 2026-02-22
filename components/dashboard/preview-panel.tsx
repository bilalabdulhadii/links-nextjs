"use client";

import { useState } from "react";
import type { AppConfig } from "@/lib/app-config";
import { HomeView } from "@/components/home/home-view";
import { HomeFooter } from "@/components/home/home-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut } from "lucide-react";

const devicePresets = [
    { key: "phone", label: "Phone", width: 390, height: 844 },
    { key: "tablet", label: "Tablet", width: 820, height: 1180 },
    { key: "desktop", label: "Desktop", width: 1280, height: 900 },
] as const;

type DeviceKey = (typeof devicePresets)[number]["key"];

function DeviceFrame({
    device,
    config,
}: {
    device: (typeof devicePresets)[number];
    config: AppConfig;
}) {
    return (
        <div
            className="overflow-hidden rounded-[24px] min-h-0 border border-border/60 bg-background"
            style={{ width: device.width, height: device.height }}>
            <HomeView
                config={config}
                fullHeight={false}
                rootClassName="h-full min-h-0"
                mainClassName="h-full min-h-0 py-8 overflow-y-auto"
                footer={<HomeFooter />}
            />
        </div>
    );
}
export function PreviewPanel({
    config,
    className,
}: {
    config: AppConfig;
    className?: string;
}) {
    const [view] = useState<DeviceKey>("phone");
    const [zoom, setZoom] = useState(1);
    const active =
        devicePresets.find((item) => item.key === view) ?? devicePresets[0];
    const zoomStep = 0.1;
    const minZoom = 0.6;
    const maxZoom = 1.4;
    const zoomedWidth = Math.round(active.width * zoom);
    const zoomedHeight = Math.round(active.height * zoom);

    return (
        <Card className={cn("flex h-full flex-col", className)}>
            <CardHeader className="flex flex-col gap-4">
                <div>
                    <CardTitle>Live Preview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        See unsaved changes instantly while you edit.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 min-h-0 flex-col">
                <div className="relative flex-1 min-h-0 overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-sm">
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full border border-border/60 bg-background/80 p-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                            <button
                                type="button"
                                onClick={() =>
                                    setZoom((value) =>
                                        Math.max(
                                            minZoom,
                                            Number(
                                                (value - zoomStep).toFixed(2),
                                            ),
                                        ),
                                    )
                                }
                                disabled={zoom <= minZoom}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-foreground transition hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Zoom out">
                                <ZoomOut className="h-4 w-4" />
                            </button>
                            <span className="px-2 tabular-nums">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setZoom((value) =>
                                        Math.min(
                                            maxZoom,
                                            Number(
                                                (value + zoomStep).toFixed(2),
                                            ),
                                        ),
                                    )
                                }
                                disabled={zoom >= maxZoom}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-foreground transition hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Zoom in">
                                <ZoomIn className="h-4 w-4" />
                            </button>
                        </div>
                    <div className="h-full w-full overflow-auto [scrollbar-gutter:stable_both-edges]">
                        <div className="min-h-full w-max mx-auto p-6 flex items-center justify-center">
                            <div
                                style={{
                                    width: zoomedWidth,
                                    height: zoomedHeight,
                                }}>
                                <div
                                    style={{
                                        transform: `scale(${zoom})`,
                                        transformOrigin: "top left",
                                    }}>
                                    <DeviceFrame
                                        device={active}
                                        config={config}
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
