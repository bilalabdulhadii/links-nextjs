import { cookies } from "next/headers";
import { defaultConfig, type ThemeConfig } from "@/lib/app-config";
import { HomePageClient } from "@/components/home/home-page-client";

const THEME_COOKIE_KEY = "links_last_theme";

function parseThemeCookie(value: string | undefined): ThemeConfig | null {
    if (!value) {
        return null;
    }
    try {
        const decoded = decodeURIComponent(value);
        const parsed = JSON.parse(decoded);
        if (parsed && typeof parsed === "object") {
            return parsed as ThemeConfig;
        }
    } catch {
        return null;
    }
    return null;
}

export default async function Home() {
    const store = await cookies();
    const raw = store.get(THEME_COOKIE_KEY)?.value;
    const initialTheme = parseThemeCookie(raw) ?? defaultConfig.theme;

    return <HomePageClient initialTheme={initialTheme} />;
}
