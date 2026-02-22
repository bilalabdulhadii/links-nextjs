"use client";

import { useRouter } from "next/navigation";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    ExternalLink,
    LayoutDashboard,
    Link2,
    Monitor,
    Palette,
    Settings2,
    Share2,
    UserCircle2,
} from "lucide-react";

const jumpItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Preview", url: "/dashboard/preview", icon: Monitor },
    { title: "Profile", url: "/dashboard/profile", icon: UserCircle2 },
    { title: "Icons", url: "/dashboard/icons", icon: Share2 },
    { title: "Buttons", url: "/dashboard/buttons", icon: Link2 },
    { title: "Theme", url: "/dashboard/theme", icon: Palette },
    { title: "Settings", url: "/dashboard/settings", icon: Settings2 },
    { title: "Public Site", url: "/", icon: ExternalLink, external: true },
];

export function JumpCommand({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const router = useRouter();

    const handleSelect = (item: (typeof jumpItems)[number]) => {
        onOpenChange(false);
        if (item.external) {
            window.open(item.url, "_blank", "noopener,noreferrer");
            return;
        }
        router.push(item.url);
    };

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Jump to"
            description="Quickly navigate to a dashboard section.">
            <CommandInput placeholder="Type a page name..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                    {jumpItems.map((item) => (
                        <CommandItem
                            key={item.title}
                            value={item.title}
                            onSelect={() => handleSelect(item)}>
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
