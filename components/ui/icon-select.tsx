"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { IconOption } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function IconSelect({
    options,
    value,
    onChange,
    placeholder = "Select icon",
    className,
}: {
    options: IconOption[];
    value: string;
    onChange: (next: string) => void;
    placeholder?: string;
    className?: string;
}) {
    const [query, setQuery] = React.useState("");
    const selected =
        options.find((option) => option.id === value) ?? options[0];
    const SelectedIcon = selected?.icon ?? null;
    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            return options;
        }
        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(q) ||
                option.id.toLowerCase().includes(q),
        );
    }, [options, query]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        "flex w-full items-center justify-between gap-2",
                        className,
                    )}>
                    <span className="flex items-center gap-2">
                        {SelectedIcon ? (
                            <SelectedIcon className="size-4" />
                        ) : null}
                        <span className="text-sm">
                            {selected?.label ?? placeholder}
                        </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Change
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="w-80 max-h-80 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-popover p-2">
                    <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search icons"
                        onKeyDown={(event) => event.stopPropagation()}
                    />
                </div>
                {filtered.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-muted-foreground">
                        No icons found.
                    </div>
                ) : null}
                {filtered.map((option) => {
                    const Icon = option.icon;
                    return (
                        <DropdownMenuItem
                            key={option.id}
                            onSelect={() => onChange(option.id)}
                            className={cn(
                                "flex items-center gap-2",
                                option.id === selected?.id && "bg-accent",
                            )}>
                            <Icon className="size-4" />
                            <span className="truncate">{option.label}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
