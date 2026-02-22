"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const shortcuts = [
    {
        label: "Save changes",
        keys: ["⌘S", "Ctrl+S"],
    },
    {
        label: "Open preview",
        keys: ["⌘P", "Ctrl+P"],
    },
    {
        label: "Cancel changes",
        keys: ["Esc"],
    },
    {
        label: "Open help",
        keys: ["⌘H", "Ctrl+H"],
    },
];

export function HelpDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Help & Shortcuts</DialogTitle>
                    <DialogDescription>
                        Quick commands to keep your edits fast.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="grid gap-3">
                    {shortcuts.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-muted-foreground">
                                {item.label}
                            </span>
                            <div className="flex items-center gap-2">
                                {item.keys.map((key) => (
                                    <kbd
                                        key={key}
                                        className="rounded border border-border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                                        {key}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
