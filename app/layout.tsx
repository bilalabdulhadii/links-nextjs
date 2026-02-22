import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Providers } from "@/app/providers";
import "./globals.css";
import "./theme.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ActiveThemeProvider } from "@/components/active-theme";

export const metadata: Metadata = {
    title: "Links",
    description: "A custom link-in-bio experience.",
    openGraph: {
        images: ["/logo.png"],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/logo.png"],
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const activeThemeValue = cookieStore.get("links_active_theme")?.value;
    const isScaled = activeThemeValue?.endsWith("-scaled");
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "bg-background overscroll-none font-sans antialiased",
                    activeThemeValue ? `theme-${activeThemeValue}` : "",
                    isScaled ? "theme-scaled" : "",
                )}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    storageKey="links_color_mode"
                    enableSystem
                    disableTransitionOnChange
                    enableColorScheme>
                    <ActiveThemeProvider initialTheme={activeThemeValue}>
                        <Providers>{children}</Providers>
                    </ActiveThemeProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
