"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { HelpDialog } from "@/components/dashboard/help-dialog";
import { JumpCommand } from "@/components/dashboard/jump-command";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { useAppConfig } from "@/hooks/use-app-config";
import { useAuth } from "@/hooks/use-auth";
import { defaultConfig, type AppConfig } from "@/lib/app-config";
import { collectMediaPaths, diffRemovedMediaPaths } from "@/lib/media";
import {
    deleteMediaPath,
    uploadMediaFile,
    type UploadResult,
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Command, Eye, Save, X, Search } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type DashboardContextValue = {
    draft: AppConfig;
    onChange: (next: AppConfig) => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
    resetAndSave: (next: AppConfig) => Promise<void>;
    upload: (
        file: File,
        folder: string,
        onProgress?: (progress: number) => void,
    ) => Promise<UploadResult>;
    saving: boolean;
    status: string | null;
    error: string | null;
    isDirty: boolean;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within DashboardShell");
    }
    return context;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading: authLoading } = useAuth();
    const { config, loading: configLoading, error, save } = useAppConfig();
    const [draft, setDraft] = useState<AppConfig | null>(null);
    const [savedConfig, setSavedConfig] = useState<AppConfig | null>(null);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [pendingPaths, setPendingPaths] = useState<string[]>([]);
    const pendingRef = useRef<string[]>([]);
    const [isDirty, setIsDirty] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [jumpOpen, setJumpOpen] = useState(false);

    useEffect(() => {
        pendingRef.current = pendingPaths;
    }, [pendingPaths]);

    useEffect(() => {
        document.body.classList.add("bg-sidebar");
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("bg-sidebar");
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    useEffect(() => {
        return () => {
            const paths = pendingRef.current;
            if (paths.length) {
                paths.forEach((path) => {
                    void deleteMediaPath(path);
                });
            }
        };
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/login");
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (!config) {
            return;
        }
        if (!draft || !isDirty) {
            setDraft(config);
            setSavedConfig(config);
            setIsDirty(false);
        }
    }, [config, draft, isDirty]);

    const uploadWithTracking = async (
        file: File,
        folder: string,
        onProgress?: (progress: number) => void,
    ): Promise<UploadResult> => {
        const result = await uploadMediaFile(file, folder, { onProgress });
        setPendingPaths((prev) =>
            prev.includes(result.path) ? prev : [...prev, result.path],
        );
        return result;
    };

    const onChange = (next: AppConfig) => {
        setDraft(next);
        setIsDirty(true);
        setStatus(null);
    };

    const onSave = async () => {
        if (!draft) {
            return;
        }
        setSaving(true);
        setStatus(null);

        try {
            await save(draft);
            const removed = diffRemovedMediaPaths(savedConfig, draft);
            const draftPaths = new Set(collectMediaPaths(draft));
            const pendingToDelete = pendingPaths.filter(
                (path) => !draftPaths.has(path),
            );
            const toDelete = [...removed, ...pendingToDelete];
            await Promise.allSettled(
                toDelete.map((path) => deleteMediaPath(path)),
            );
            setPendingPaths([]);
            setSavedConfig(draft);
            setIsDirty(false);
            setStatus("Changes saved.");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to save";
            setStatus(message);
        } finally {
            setSaving(false);
        }
    };

    const resetAndSave = async (next: AppConfig) => {
        if (!draft) {
            return;
        }
        setSaving(true);
        setStatus(null);

        try {
            await save(next);
            const baseline = savedConfig ?? draft ?? defaultConfig;
            const removed = diffRemovedMediaPaths(baseline, next);
            const nextPaths = new Set(collectMediaPaths(next));
            const pendingToDelete = pendingPaths.filter(
                (path) => !nextPaths.has(path),
            );
            const toDelete = [...removed, ...pendingToDelete];
            await Promise.allSettled(
                toDelete.map((path) => deleteMediaPath(path)),
            );
            setPendingPaths([]);
            setSavedConfig(next);
            setDraft(next);
            setIsDirty(false);
            setStatus("Changes saved.");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to reset";
            setStatus(message);
        } finally {
            setSaving(false);
        }
    };

    const onCancel = () => {
        if (!savedConfig || !draft) {
            return;
        }
        setDraft(savedConfig);
        setIsDirty(false);
        setStatus(null);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented) {
                return;
            }
            const target = event.target as HTMLElement | null;
            const tag = target?.tagName?.toLowerCase();
            const isEditable =
                target?.isContentEditable ||
                tag === "input" ||
                tag === "textarea" ||
                tag === "select";
            if (isEditable) {
                return;
            }

            const key = event.key.toLowerCase();
            if (key === "escape") {
                if (isDirty && !saving) {
                    event.preventDefault();
                    onCancel();
                }
                return;
            }

            const isMac = navigator.platform.toLowerCase().includes("mac");
            const modKey = isMac ? event.metaKey : event.ctrlKey;
            if (!modKey) {
                return;
            }
            if (key === "s") {
                event.preventDefault();
                if (!saving && isDirty) {
                    void onSave();
                }
            }
            if (key === "p") {
                event.preventDefault();
                if (isDirty) {
                    router.push("/dashboard/preview");
                }
            }
            if (key === "h") {
                event.preventDefault();
                setHelpOpen(true);
            }
            if (key === "k") {
                event.preventDefault();
                setJumpOpen(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isDirty, onSave, onCancel, router, saving]);

    const loading = authLoading || configLoading || !draft;
    const isPreview = pathname?.startsWith("/dashboard/preview");

    const contextValue = useMemo<DashboardContextValue>(() => {
        if (!draft) {
            return {
                draft: (config ?? defaultConfig) as AppConfig,
                onChange: () => undefined,
                onSave: async () => undefined,
                onCancel: () => undefined,
                resetAndSave: async () => undefined,
                upload: async () => ({ url: "", path: "" }),
                saving: false,
                status: null,
                error: error ?? null,
                isDirty: false,
            };
        }
        return {
            draft,
            onChange,
            onSave,
            onCancel,
            resetAndSave,
            upload: uploadWithTracking,
            saving,
            status,
            error: error ?? null,
            isDirty,
        };
    }, [
        draft,
        saving,
        status,
        error,
        isDirty,
        uploadWithTracking,
        onSave,
        onCancel,
        config,
    ]);

    if (loading) {
        return <DashboardLoading />;
    }

    if (!user || !draft) {
        return null;
    }

    return (
        <DashboardContext.Provider value={contextValue}>
            <SidebarProvider>
                <AppSidebar
                    onHelp={() => setHelpOpen(true)}
                    onJump={() => setJumpOpen(true)}
                />
                <SidebarInset className="h-svh overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex flex-1 items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Button
                                variant="link"
                                className="text-muted-foreground !px-0 font-normal hover:no-underline cursor-pointer"
                                onClick={() => setJumpOpen(true)}>
                                <Search className="size-4" />
                                Search
                                <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium select-none">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </Button>
                            {/* <h1 className="text-base font-medium">Dashboard</h1> */}
                        </div>
                        <TooltipProvider>
                            <div className="mr-4 flex items-center gap-3">
                                {status ? (
                                    <span className="text-xs text-muted-foreground">
                                        {status}
                                    </span>
                                ) : null}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onCancel}
                                            disabled={saving || !isDirty}>
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <span className="inline-flex items-center gap-2">
                                            Cancel changes
                                            <kbd className="rounded border border-background/20 bg-background/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-background">
                                                Esc
                                            </kbd>
                                        </span>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    "/dashboard/preview",
                                                )
                                            }
                                            disabled={!isDirty}
                                            className="gap-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-colors disabled:bg-blue-300 disabled:border-blue-300 disabled:cursor-not-allowed">
                                            <Eye className="h-4 w-4" />
                                            Preview
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <span className="inline-flex items-center gap-2">
                                            Preview
                                            <kbd className="rounded border border-background/20 bg-background/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-background">
                                                ⌘P
                                            </kbd>
                                        </span>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            onClick={onSave}
                                            disabled={saving || !isDirty}>
                                            <Save className="h-4 w-4" />
                                            {saving && isDirty
                                                ? "Saving..."
                                                : "Save"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <span className="inline-flex items-center gap-2">
                                            Save changes
                                            <kbd className="rounded border border-background/20 bg-background/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-background">
                                                ⌘S
                                            </kbd>
                                        </span>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </header>

                    <div
                        className={cn(
                            "flex flex-1 min-h-0 flex-col gap-6 p-4 pt-0",
                            isPreview ? "overflow-hidden" : "overflow-auto",
                        )}>
                        {error ? (
                            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                                {error}
                            </div>
                        ) : null}
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
            <JumpCommand open={jumpOpen} onOpenChange={setJumpOpen} />
        </DashboardContext.Provider>
    );
}
