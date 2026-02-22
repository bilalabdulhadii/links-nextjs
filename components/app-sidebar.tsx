"use client";

import * as React from "react";
import {
    ExternalLink,
    HelpCircle,
    LayoutDashboard,
    Link2,
    Monitor,
    Palette,
    Settings2,
    Share2,
    UserCircle2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

const navItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Preview",
        url: "/dashboard/preview",
        icon: Monitor,
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: UserCircle2,
    },
    {
        title: "Icons",
        url: "/dashboard/icons",
        icon: Share2,
    },
    {
        title: "Buttons",
        url: "/dashboard/buttons",
        icon: Link2,
    },
    {
        title: "Theme",
        url: "/dashboard/theme",
        icon: Palette,
    },
];

export function AppSidebar({
    onHelp,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    onHelp?: () => void;
}) {
    const { user, signOutUser } = useAuth();
    const secondary = [
        {
            title: "Public Site",
            url: "/",
            external: true,
            icon: ExternalLink,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings2,
        },
        ...(onHelp
            ? [
                  {
                      title: "Help",
                      icon: HelpCircle,
                      onClick: onHelp,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Link2 className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        Links
                                    </span>
                                    <span className="truncate text-xs">
                                        Dashboard
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
                <NavSecondary items={secondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                {user ? (
                    <NavUser
                        user={{
                            name: user.displayName || "Admin",
                            email: user.email || "",
                        }}
                        onSignOut={signOutUser}
                    />
                ) : null}
            </SidebarFooter>
        </Sidebar>
    );
}
