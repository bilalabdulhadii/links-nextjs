"use client";

import * as React from "react";
import {
    ExternalLink,
    Command,
    HelpCircle,
    LayoutDashboard,
    LayoutTemplate,
    Link2,
    Monitor,
    Palette,
    SlidersHorizontal,
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
import Image from "next/image";

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
    {
        title: "Templates",
        url: "/dashboard/templates",
        icon: LayoutTemplate,
    },
];

export function AppSidebar({
    onHelp,
    onJump,
    onStyle,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    onHelp?: () => void;
    onJump?: () => void;
    onStyle?: () => void;
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
        ...(onStyle
            ? [
                  {
                      title: "Style",
                      icon: SlidersHorizontal,
                      onClick: onStyle,
                  },
              ]
            : []),
        ...(onJump
            ? [
                  {
                      title: "Jump",
                      icon: Command,
                      onClick: onJump,
                  },
              ]
            : []),
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
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-200/90 text-sidebar-primary-foreground">
                                    <Image
                                        src="/logo.svg"
                                        alt="Links"
                                        width={20}
                                        height={20}
                                        className="h-5 w-5"
                                    />
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
