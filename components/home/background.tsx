import type { BackgroundConfig } from "@/lib/app-config";

export function Background({ config }: { config: BackgroundConfig }) {
    const overlay = (
        <>
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_60%)]"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.35))]"
                aria-hidden="true"
            />
        </>
    );

    if (config.type === "solid") {
        return (
            <>
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: config.color }}
                    aria-hidden="true"
                />
                {overlay}
            </>
        );
    }

    if (config.type === "gradient") {
        const colors = config.colors.join(", ");
        return (
            <>
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(${config.direction}, ${colors})`,
                    }}
                    aria-hidden="true"
                />
                {overlay}
            </>
        );
    }

    if (config.type === "image") {
        return (
            <>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${config.url})` }}
                    aria-hidden="true"
                />
                {overlay}
            </>
        );
    }

    return (
        <>
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
            {overlay}
        </>
    );
}
