"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const MODES = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
] as const;

export function ModeToggle({
    fullWidth = true,
    className,
}: {
    fullWidth?: boolean;
    className?: string;
}) {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const mode = (theme ?? "system") as "light" | "dark" | "system";
    const fallbackMode = mode === "system" ? (resolvedTheme ?? "system") : mode;
    return (
        <div
            className={cn(
                "flex items-center gap-2",
                fullWidth ? "w-full" : null,
                className,
            )}>
            <Label htmlFor="mode-toggle" className="sr-only">
                Mode
            </Label>
            <Select value={mode} onValueChange={setTheme}>
                <SelectTrigger
                    id="mode-toggle"
                    size="sm"
                    className={cn(
                        "cursor-pointer",
                        fullWidth ? "w-full" : null,
                    )}>
                    <div className="flex flex-1 items-center gap-2">
                        <span className="text-muted-foreground hidden sm:block">
                            Select a mode:
                        </span>
                        <span className="text-muted-foreground block sm:hidden">
                            Mode
                        </span>
                        <SelectValue placeholder="Mode" />
                    </div>
                </SelectTrigger>
                <SelectContent
                    align="start"
                    className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]">
                    {MODES.map((item) => {
                        const Icon = item.icon;
                        return (
                            <SelectItem
                                key={item.value}
                                value={item.value}
                                className="cursor-pointer">
                                <span className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </span>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}
