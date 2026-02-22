"use client";

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const COOKIE_NAME = "links_active_theme";
const STORAGE_KEY = "links_active_theme";
const DEFAULT_THEME = "default";

function setThemeCookie(theme: string) {
    if (typeof window === "undefined") return;

    document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${
        window.location.protocol === "https:" ? "Secure;" : ""
    }`;
}

function setThemeStorage(theme: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, theme);
}

type ThemeContextType = {
    activeTheme: string;
    setActiveTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({
    children,
    initialTheme,
}: {
    children: ReactNode;
    initialTheme?: string;
}) {
    const [activeTheme, setActiveTheme] = useState<string>(
        () => {
            if (typeof window !== "undefined") {
                const stored = window.localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    return stored;
                }
            }
            return initialTheme || DEFAULT_THEME;
        },
    );

    useEffect(() => {
        setThemeCookie(activeTheme);
        setThemeStorage(activeTheme);

        Array.from(document.body.classList)
            .filter((className) => className.startsWith("theme-"))
            .forEach((className) => {
                document.body.classList.remove(className);
            });
        document.body.classList.remove("theme-scaled");
        document.body.classList.add(`theme-${activeTheme}`);
        if (activeTheme.endsWith("-scaled")) {
            document.body.classList.add("theme-scaled");
        }
    }, [activeTheme]);

    return (
        <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeConfig() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error(
            "useThemeConfig must be used within an ActiveThemeProvider",
        );
    }
    return context;
}
