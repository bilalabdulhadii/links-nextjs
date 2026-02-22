"use client";

export function DashboardLoading() {
    return (
        <div className="min-h-screen bg-sidebar text-sidebar-foreground">
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-sidebar-border bg-sidebar/80 px-8 py-10 shadow-[0_30px_120px_-70px_rgba(15,23,42,0.25)]">
                    <div className="flex items-center gap-2 rounded-full border border-sidebar-border/70 bg-sidebar/60 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-sidebar-foreground/70">
                        Loading
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="relative size-20">
                            <div className="absolute inset-0 rounded-full border-2 border-sidebar-border/40" />
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sidebar-foreground/80 border-r-sidebar-foreground/30 animate-spin" />
                            <div className="absolute inset-1 rounded-full bg-sidebar" />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                                Dashboard
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1 text-center">
                        <p className="text-sm font-medium text-sidebar-foreground/90">
                            Preparing your workspace
                        </p>
                        <p className="text-xs text-sidebar-foreground/60">
                            Loading settings and media
                        </p>
                    </div>
                    <div className="grid w-full gap-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-sidebar-border/40">
                            <div className="h-full w-2/3 rounded-full bg-sidebar-foreground/70 animate-pulse" />
                        </div>
                        <div className="h-2 w-5/6 overflow-hidden rounded-full bg-sidebar-border/30">
                            <div
                                className="h-full w-1/2 rounded-full bg-sidebar-foreground/55 animate-pulse"
                                style={{ animationDelay: "140ms" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
