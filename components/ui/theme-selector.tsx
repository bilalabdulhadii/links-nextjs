"use client";

import { useThemeConfig } from "@/components/active-theme";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const DEFAULT_THEMES = [
    {
        name: "Default",
        value: "default",
    },
    {
        name: "Blue",
        value: "blue",
    },
    {
        name: "Green",
        value: "green",
    },
    {
        name: "Amber",
        value: "amber",
    },
];

const SCALED_THEMES = [
    {
        name: "Default",
        value: "default-scaled",
    },
    {
        name: "Blue",
        value: "blue-scaled",
    },
];

const MONO_THEMES = [
    {
        name: "Mono",
        value: "mono-scaled",
    },
];

export function ThemeSelector({
    fullWidth = true,
    className,
}: {
    fullWidth?: boolean;
    className?: string;
}) {
    const { activeTheme, setActiveTheme } = useThemeConfig();

    return (
        <div
            className={cn(
                "flex items-center gap-2",
                fullWidth ? "w-full" : null,
                className,
            )}>
            <Label htmlFor="theme-selector" className="sr-only">
                Theme
            </Label>
            <Select value={activeTheme} onValueChange={setActiveTheme}>
                <SelectTrigger
                    id="theme-selector"
                    size="sm"
                    className={cn(
                        "cursor-pointer",
                        fullWidth ? "w-full" : null,
                    )}>
                    <div className="flex flex-1 items-center gap-2">
                        <span className="text-muted-foreground hidden sm:block">
                            Select a theme:
                        </span>
                        <span className="text-muted-foreground block sm:hidden">
                            Theme
                        </span>
                        <SelectValue placeholder="Select a theme" />
                    </div>
                </SelectTrigger>
                <SelectContent align="end">
                    <SelectGroup>
                        <SelectLabel>Default</SelectLabel>
                        {DEFAULT_THEMES.map((theme) => (
                            <SelectItem
                                key={theme.name}
                                value={theme.value}
                                className="cursor-pointer">
                                {theme.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                        <SelectLabel>Scaled</SelectLabel>
                        {SCALED_THEMES.map((theme) => (
                            <SelectItem
                                key={theme.name}
                                value={theme.value}
                                className="cursor-pointer">
                                {theme.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectGroup>
                        <SelectLabel>Monospaced</SelectLabel>
                        {MONO_THEMES.map((theme) => (
                            <SelectItem
                                key={theme.name}
                                value={theme.value}
                                className="cursor-pointer">
                                {theme.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
