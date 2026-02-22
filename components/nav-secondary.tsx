import * as React from "react";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string;
        icon: LucideIcon;
        url?: string;
        onClick?: () => void;
        external?: boolean;
    }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.onClick ? (
                                <SidebarMenuButton
                                    size="sm"
                                    onClick={item.onClick}
                                    type="button">
                                    <item.icon />
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton asChild size="sm">
                                    <Link
                                        href={item.url ?? "#"}
                                        target={
                                            item.external ? "_blank" : undefined
                                        }
                                        rel={
                                            item.external
                                                ? "noreferrer"
                                                : undefined
                                        }>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
