import type {
    AppConfig,
    BackgroundConfig,
    CoverConfig,
    ProfileConfig,
} from "@/lib/app-config";

export function collectMediaPaths(config: AppConfig | null | undefined) {
    if (!config) {
        return [] as string[];
    }

    const paths: string[] = [];

    const background = config.theme.background as BackgroundConfig;
    if (background?.type === "image") {
        if (background.path) {
            paths.push(background.path);
        }
    }
    if (background?.type === "video") {
        if (background.path) {
            paths.push(background.path);
        }
        if (background.posterPath) {
            paths.push(background.posterPath);
        }
    }

    for (const button of config.buttons) {
        if (button.imagePath) {
            paths.push(button.imagePath);
        }
    }

    const profile = config.profile as ProfileConfig;
    if (profile?.type === "image" && profile.path) {
        paths.push(profile.path);
    }

    const cover = config.cover as CoverConfig;
    if (cover?.type === "image" && cover.path) {
        paths.push(cover.path);
    }

    return paths;
}

export function diffRemovedMediaPaths(
    previous: AppConfig | null,
    next: AppConfig | null,
) {
    const previousPaths = new Set(collectMediaPaths(previous));
    const nextPaths = new Set(collectMediaPaths(next));
    const removed: string[] = [];

    for (const path of previousPaths) {
        if (!nextPaths.has(path)) {
            removed.push(path);
        }
    }

    return removed;
}
