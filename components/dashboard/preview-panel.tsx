"use client";

import { useEffect, useRef, useState } from "react";
import type { AppConfig } from "@/lib/app-config";
import { HomeView } from "@/components/home/home-view";
import { HomeFooter } from "@/components/home/home-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LayoutGrid, Monitor, Smartphone, Tablet } from "lucide-react";

const devicePresets = [
    { key: "phone", label: "Phone", width: 390, height: 844 },
    { key: "tablet", label: "Tablet", width: 820, height: 1180 },
    { key: "desktop", label: "Desktop", width: 1280, height: 900 },
] as const;

const deviceTabs = [
    { key: "phone", label: "Phone", icon: Smartphone },
    { key: "tablet", label: "Tablet", icon: Tablet },
    { key: "desktop", label: "Desktop", icon: Monitor },
    { key: "all", label: "All devices" },
] as const;

type DeviceKey = (typeof deviceTabs)[number]["key"];

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
                mainClassName="h-full min-h-0 py-8 overflow-y-auto overscroll-contain"
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
    const [view, setView] = useState<DeviceKey>("phone");
    const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
    const boardRef = useRef<HTMLDivElement>(null);
    const isAll = view === "all";
    const active =
        devicePresets.find((item) => item.key === view) ?? devicePresets[0];

    useEffect(() => {
        if (!boardRef.current) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setBoardSize({ width, height });
            }
        });

        observer.observe(boardRef.current);
        return () => observer.disconnect();
    }, []);

    const boardPadding = 20;
    const deviceGap = 24;
    const labelHeight = 20;
    const labelGap = 12;
    const baseWidth = isAll
        ? devicePresets.reduce(
              (sum, device) => sum + device.width,
              0,
          ) +
          deviceGap * Math.max(0, devicePresets.length - 1)
        : active.width;
    const baseHeight = isAll
        ? Math.max(
              ...devicePresets.map(
                  (device) => device.height + labelHeight + labelGap,
              ),
          )
        : active.height;
    const boardWidth = baseWidth + boardPadding * 2;
    const boardHeight = baseHeight + boardPadding * 2;
    const scale =
        boardSize.width && boardSize.height
            ? Math.min(
                  1,
                  boardSize.width / boardWidth,
                  boardSize.height / boardHeight,
              )
            : 1;
    const scaledWidth = boardWidth * scale;
    const scaledHeight = boardHeight * scale;

    return (
        <Card className={cn("flex h-full flex-col", className)}>
            <CardHeader className="flex flex-col gap-4">
                <div>
                    <CardTitle>Live Preview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        See unsaved changes instantly while you edit.
                    </p>
                </div>
                <div className="inline-flex w-fit flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
                    {(
                        deviceTabs as readonly {
                            key: DeviceKey;
                            label: string;
                            icon?: typeof LayoutGrid;
                        }[]
                    ).map((item) => {
                        const Icon = item.icon ?? LayoutGrid;
                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => setView(item.key)}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-md p-2 text-sm font-medium transition",
                                    view === item.key
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                )}>
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-hidden">
                <div className="flex h-full min-h-0 flex-col items-stretch rounded-2xl border border-border/60 bg-muted/30 p-4 overflow-hidden">
                    <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground leading-tight">
                        <span>{isAll ? "All devices" : active.label}</span>
                        <span className="tabular-nums">
                            {isAll
                                ? `${devicePresets.length} devices`
                                : `${active.width}x${active.height}`}
                        </span>
                    </div>
                    <div
                        ref={boardRef}
                        className="flex-1 min-h-0 overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-sm">
                        <div className="flex h-full w-full items-center justify-center">
                            <div
                                style={{
                                    width: scaledWidth,
                                    height: scaledHeight,
                                }}>
                                <div
                                    className="h-full w-full"
                                    style={{
                                        width: boardWidth,
                                        height: boardHeight,
                                        transform: `scale(${scale})`,
                                        transformOrigin: "top left",
                                    }}>
                                    <div
                                        className={cn(
                                            "h-full w-full p-5 flex",
                                            isAll
                                                ? "items-start"
                                                : "items-center justify-center",
                                        )}>
                                        {isAll ? (
                                            <div className="flex items-start gap-6">
                                                {devicePresets.map((device) => (
                                                    <div
                                                        key={device.key}
                                                        className="flex flex-col gap-3">
                                                        <div className="flex h-5 items-center justify-between text-[11px] text-muted-foreground">
                                                            <span>
                                                                {device.label}
                                                            </span>
                                                            <span className="tabular-nums">
                                                                {device.width}x
                                                                {device.height}
                                                            </span>
                                                        </div>
                                                        <DeviceFrame
                                                            device={device}
                                                            config={config}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <DeviceFrame
                                                device={active}
                                                config={config}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
