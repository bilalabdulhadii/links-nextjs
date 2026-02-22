import type { ThemeConfig } from "@/lib/app-config";
import { Background } from "@/components/home/background";

export function LoadingState({
    theme,
    textColor,
}: {
    theme: ThemeConfig;
    textColor: string;
}) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background config={theme.background} />
            <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
                <div
                    className="relative flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-current/15 bg-white/10 px-8 py-10 shadow-[0_30px_120px_-70px_rgba(15,23,42,0.35)] backdrop-blur"
                    style={{ color: textColor }}>
                    <div className="flex items-center gap-2 rounded-full border border-current/20 bg-white/20 px-4 py-1 text-[11px] uppercase tracking-[0.35em] opacity-70">
                        Loading
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="relative size-20">
                            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.6),rgba(99,102,241,0.9),rgba(56,189,248,0.35),rgba(255,255,255,0.05))] animate-spin" />
                            <div className="absolute inset-1 rounded-full bg-white/70 backdrop-blur" />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                                Links
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1 text-center">
                        <p className="text-sm font-medium opacity-85">
                            Preparing your page
                        </p>
                        <p className="text-xs opacity-70">
                            Syncing layout and media
                        </p>
                    </div>
                    <div className="grid w-full gap-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
                            <div className="h-full w-2/3 rounded-full bg-white/70 animate-pulse" />
                        </div>
                        <div className="h-2 w-5/6 overflow-hidden rounded-full bg-white/20">
                            <div
                                className="h-full w-1/2 rounded-full bg-white/55 animate-pulse"
                                style={{ animationDelay: "140ms" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
