import defaultConfigJson from "./default-config.json";

export type BackgroundConfig =
    | {
          type: "solid";
          color: string;
      }
    | {
          type: "gradient";
          colors: string[];
          direction: string;
      }
    | {
          type: "image";
          url: string;
          path?: string;
      }
    | {
          type: "video";
          url: string;
          path?: string;
          posterUrl?: string;
          posterPath?: string;
      };

export type CoverConfig =
    | {
          type: "image";
          url: string;
          path?: string;
          position?: string;
      }
    | {
          type: "solid";
          color: string;
      }
    | {
          type: "gradient";
          colors: string[];
          direction: string;
      }
    | {
          type: "transparent";
      };

export type ProfileConfig =
    | {
          type: "image";
          url: string;
          path?: string;
      }
    | {
          type: "solid";
          color: string;
      }
    | {
          type: "gradient";
          colors: string[];
          direction: string;
      }
    | {
          type: "transparent";
      };

export type StyleConfig = {
    borderColor: string;
    textColor: string;
    bgColor: string;
    hoverBorderColor: string;
    hoverTextColor: string;
    hoverBgColor: string;
    radius: number;
    textAlign: "left" | "center" | "right";
};

export type ThemeConfig = {
    background: BackgroundConfig;
    iconStyle: StyleConfig;
    buttonStyle: StyleConfig;
    contentCard: {
        bgColor: string;
        opacity: number;
        blur: number;
        radius: number;
    };
    textColor: string;
    hoverAnimation: "none" | "lift" | "float" | "pulse" | "pop";
    hoverTransitionMs: number;
};

export type UnpublishMode = "coming-soon" | "custom";

export type IconItem = {
    id: string;
    label: string;
    iconId: string;
    url: string;
};

export type ButtonLayout = "card" | "text" | "icon-text" | "icon-only";

export type ButtonItem = {
    id: string;
    layout: ButtonLayout;
    label: string;
    eyebrow?: string;
    url: string;
    iconId?: string;
    imageUrl?: string;
    imagePath?: string;
    useCustomStyle?: boolean;
    customStyle?: Partial<StyleConfig>;
};

export type AppConfig = {
    siteTitle: string;
    profileTitle: string;
    description: string;
    published: boolean;
    unpublishMode: UnpublishMode;
    unpublishTitle: string;
    unpublishDescription: string;
    profile: ProfileConfig;
    cover: CoverConfig;
    theme: ThemeConfig;
    themeBackup?: ThemeConfig;
    buttonStyleBackup?: Record<
        string,
        {
            useCustomStyle?: boolean;
            customStyle?: Partial<StyleConfig>;
        }
    >;
    icons: IconItem[];
    buttons: ButtonItem[];
};

export const defaultConfig: AppConfig = defaultConfigJson as AppConfig;

const defaultBackground = defaultConfig.theme.background;
const defaultCover = defaultConfig.cover;
const defaultProfile = defaultConfig.profile;
const fallbackSolid = "#f8fafc";
const fallbackGradientColors = ["#f8fafc", "#eef2ff", "#e0f2fe"];
const fallbackGradientDirection = "to bottom";
const fallbackCoverSolid =
    defaultCover.type === "solid" ? defaultCover.color : "#e2e8f0";
const fallbackCoverGradientColors =
    defaultCover.type === "gradient"
        ? defaultCover.colors
        : ["#f8fafc", "#e0f2fe", "#dbeafe"];
const fallbackCoverGradientDirection =
    defaultCover.type === "gradient" ? defaultCover.direction : "to bottom";
const fallbackCoverImageUrl =
    defaultCover.type === "image" ? defaultCover.url : "";
const fallbackCoverPosition =
    defaultCover.type === "image" && "position" in defaultCover
        ? defaultCover.position ?? "center"
        : "center";
const fallbackProfileSolid =
    defaultProfile.type === "solid" ? defaultProfile.color : "#e2e8f0";
const fallbackProfileGradientColors =
    defaultProfile.type === "gradient"
        ? defaultProfile.colors
        : ["#f8fafc", "#e0f2fe", "#dbeafe"];
const fallbackProfileGradientDirection =
    defaultProfile.type === "gradient" ? defaultProfile.direction : "to bottom";
const fallbackProfileImageUrl =
    defaultProfile.type === "image" ? defaultProfile.url : "";

function mergeBackground(
    background?: Partial<BackgroundConfig>,
): BackgroundConfig {
    if (!background || !background.type) {
        return defaultBackground;
    }

    if (background.type === "solid") {
        return {
            type: "solid",
            color:
                "color" in background && background.color
                    ? background.color
                    : fallbackSolid,
        };
    }

    if (background.type === "gradient") {
        return {
            type: "gradient",
            colors:
                "colors" in background && background.colors?.length
                    ? background.colors
                    : fallbackGradientColors,
            direction:
                "direction" in background && background.direction
                    ? background.direction
                    : fallbackGradientDirection,
        };
    }

    if (background.type === "image") {
        return {
            type: "image",
            url: "url" in background && background.url ? background.url : "",
            path: "path" in background ? background.path : undefined,
        };
    }

    return {
        type: "video",
        url: "url" in background && background.url ? background.url : "",
        path: "path" in background ? background.path : undefined,
        posterUrl: "posterUrl" in background ? background.posterUrl : undefined,
        posterPath:
            "posterPath" in background ? background.posterPath : undefined,
    };
}

function mergeCover(
    cover: Partial<CoverConfig> | undefined,
    legacy?: { coverImageUrl?: string; coverImagePath?: string },
): CoverConfig {
    if (!cover || !("type" in cover) || !cover.type) {
        if (legacy?.coverImageUrl) {
            return {
                type: "image",
                url: legacy.coverImageUrl,
                path: legacy.coverImagePath,
                position: fallbackCoverPosition,
            };
        }
        return defaultCover;
    }

    if (cover.type === "image") {
        return {
            type: "image",
            url:
                "url" in cover && cover.url
                    ? cover.url
                    : (legacy?.coverImageUrl ?? fallbackCoverImageUrl),
            path:
                "path" in cover && cover.path
                    ? cover.path
                    : legacy?.coverImagePath,
            position:
                "position" in cover && cover.position
                    ? cover.position
                    : fallbackCoverPosition,
        };
    }

    if (cover.type === "solid") {
        return {
            type: "solid",
            color:
                "color" in cover && cover.color
                    ? cover.color
                    : fallbackCoverSolid,
        };
    }

    if (cover.type === "gradient") {
        return {
            type: "gradient",
            colors:
                "colors" in cover && cover.colors && cover.colors.length >= 2
                    ? cover.colors
                    : fallbackCoverGradientColors,
            direction:
                "direction" in cover && cover.direction
                    ? cover.direction
                    : fallbackCoverGradientDirection,
        };
    }

    return { type: "transparent" };
}

function mergeProfile(
    profile: Partial<ProfileConfig> | undefined,
    legacy?: { profileImageUrl?: string; profileImagePath?: string },
): ProfileConfig {
    if (!profile || !("type" in profile) || !profile.type) {
        if (legacy?.profileImageUrl) {
            return {
                type: "image",
                url: legacy.profileImageUrl,
                path: legacy.profileImagePath,
            };
        }
        return defaultProfile;
    }

    if (profile.type === "image") {
        return {
            type: "image",
            url:
                "url" in profile && profile.url
                    ? profile.url
                    : (legacy?.profileImageUrl ?? fallbackProfileImageUrl),
            path:
                "path" in profile && profile.path
                    ? profile.path
                    : legacy?.profileImagePath,
        };
    }

    if (profile.type === "solid") {
        return {
            type: "solid",
            color:
                "color" in profile && profile.color
                    ? profile.color
                    : fallbackProfileSolid,
        };
    }

    if (profile.type === "gradient") {
        return {
            type: "gradient",
            colors:
                "colors" in profile &&
                profile.colors &&
                profile.colors.length >= 2
                    ? profile.colors
                    : fallbackProfileGradientColors,
            direction:
                "direction" in profile && profile.direction
                    ? profile.direction
                    : fallbackProfileGradientDirection,
        };
    }

    return { type: "transparent" };
}

export function mergeAppConfig(
    partial?:
        | (Partial<AppConfig> & {
              coverImageUrl?: string;
              coverImagePath?: string;
              profileImageUrl?: string;
              profileImagePath?: string;
          })
        | null,
): AppConfig {
    if (!partial) {
        return defaultConfig;
    }

    const {
        coverImageUrl,
        coverImagePath,
        profileImageUrl,
        profileImagePath,
        ...rest
    } = partial;
    const restTheme = { ...(rest.theme ?? {}) } as Partial<ThemeConfig> & {
        animation?: unknown;
    };
    if ("animation" in restTheme) {
        delete restTheme.animation;
    }
    const hoverTransitionMs =
        typeof restTheme.hoverTransitionMs === "number" &&
        Number.isFinite(restTheme.hoverTransitionMs)
            ? Math.max(0, restTheme.hoverTransitionMs)
            : defaultConfig.theme.hoverTransitionMs;
    const hoverAnimation = (
        ["none", "lift", "float", "pulse", "pop"] as const
    ).includes(restTheme.hoverAnimation as ThemeConfig["hoverAnimation"])
        ? (restTheme.hoverAnimation as ThemeConfig["hoverAnimation"])
        : defaultConfig.theme.hoverAnimation;
    const published =
        typeof rest.published === "boolean"
            ? rest.published
            : defaultConfig.published;
    const unpublishMode = (
        ["coming-soon", "custom"] as const
    ).includes(rest.unpublishMode as UnpublishMode)
        ? (rest.unpublishMode as UnpublishMode)
        : defaultConfig.unpublishMode;
    const unpublishTitle =
        typeof rest.unpublishTitle === "string"
            ? rest.unpublishTitle
            : defaultConfig.unpublishTitle;
    const unpublishDescription =
        typeof rest.unpublishDescription === "string"
            ? rest.unpublishDescription
            : defaultConfig.unpublishDescription;
    const contentCardOpacity = Number.isFinite(restTheme.contentCard?.opacity)
        ? Math.max(0, Math.min(100, restTheme.contentCard?.opacity ?? 0))
        : defaultConfig.theme.contentCard.opacity;
    const contentCardBlur = Number.isFinite(restTheme.contentCard?.blur)
        ? Math.max(0, restTheme.contentCard?.blur ?? 0)
        : defaultConfig.theme.contentCard.blur;
    const contentCardRadius = Number.isFinite(restTheme.contentCard?.radius)
        ? Math.max(0, restTheme.contentCard?.radius ?? 0)
        : defaultConfig.theme.contentCard.radius;

    return {
        ...defaultConfig,
        ...rest,
        published,
        unpublishMode,
        unpublishTitle,
        unpublishDescription,
        theme: {
            ...defaultConfig.theme,
            ...restTheme,
            hoverAnimation,
            hoverTransitionMs,
            background: mergeBackground(partial.theme?.background),
            iconStyle: {
                ...defaultConfig.theme.iconStyle,
                ...rest.theme?.iconStyle,
            },
            buttonStyle: {
                ...defaultConfig.theme.buttonStyle,
                ...rest.theme?.buttonStyle,
            },
            contentCard: {
                ...defaultConfig.theme.contentCard,
                ...rest.theme?.contentCard,
                opacity: contentCardOpacity,
                blur: contentCardBlur,
                radius: contentCardRadius,
            },
        },
        profile: mergeProfile(partial.profile, {
            profileImageUrl,
            profileImagePath,
        }),
        cover: mergeCover(partial.cover, {
            coverImageUrl,
            coverImagePath,
        }),
        icons: rest.icons ?? defaultConfig.icons,
        buttons: rest.buttons ?? defaultConfig.buttons,
    };
}
