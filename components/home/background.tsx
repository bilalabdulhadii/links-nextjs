import type { BackgroundConfig } from "@/lib/app-config";

export function Background({ config }: { config: BackgroundConfig }) {
    if (config.type === "solid") {
        return (
            <div
                className="absolute inset-0"
                style={{ backgroundColor: config.color }}
                aria-hidden="true"
            />
        );
    }

    if (config.type === "gradient") {
        const colors = config.colors.join(", ");
        return (
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(${config.direction}, ${colors})`,
                }}
                aria-hidden="true"
            />
        );
    }

    if (config.type === "image") {
        return (
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${config.url})` }}
                aria-hidden="true"
            />
        );
    }

    return (
        <video
            className="absolute inset-0 h-full w-full object-cover"
            src={config.url}
            poster={config.posterUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
        />
    );
}
