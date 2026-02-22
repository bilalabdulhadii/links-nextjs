"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { BackgroundConfig } from "@/lib/app-config";
import { Background } from "@/components/home/background";
import { cn } from "@/lib/utils";

export function ShareModal({
    open,
    onClose,
    background,
    textColor,
}: {
    open: boolean;
    onClose: () => void;
    background: BackgroundConfig;
    textColor: string;
}) {
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const link = typeof window === "undefined" ? "" : window.location.href;

    useEffect(() => {
        if (!open || !link) {
            return;
        }
        QRCode.toDataURL(link, { width: 512, margin: 2 })
            .then((dataUrl) => setQrDataUrl(dataUrl))
            .catch(() => setQrDataUrl(null));
    }, [open, link]);

    useEffect(() => {
        if (!open) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    const openShare = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-current/20 shadow-2xl"
                style={{ color: textColor }}>
                <Background config={background} />
                <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] opacity-60">
                                Share
                            </p>
                            <h2 className="text-2xl font-semibold">
                                Share this link
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-current/30 px-3 py-2 text-sm">
                            Close
                        </button>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-[200px_1fr]">
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-current/15 bg-white/40 p-4 text-current opacity-80">
                            {qrDataUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={qrDataUrl}
                                    alt="QR code"
                                    className="h-40 w-40 rounded-xl bg-white p-2"
                                />
                            ) : (
                                <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-white/60 text-xs opacity-70">
                                    Generating QR…
                                </div>
                            )}
                            <a
                                href={qrDataUrl ?? "#"}
                                download="links-qr.png"
                                className={cn(
                                    "rounded-full border border-current/30 px-4 py-2 text-xs",
                                    !qrDataUrl &&
                                        "pointer-events-none opacity-50",
                                )}>
                                Download QR
                            </a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="rounded-2xl border border-current/15 bg-white/40 p-4">
                                <p className="text-sm opacity-70">Share link</p>
                                <p className="mt-2 break-all text-sm font-medium">
                                    {link}
                                </p>
                                <button
                                    type="button"
                                    onClick={onCopy}
                                    className="mt-4 rounded-full border border-current/30 px-4 py-2 text-xs">
                                    {copied ? "Copied!" : "Copy link"}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        openShare(
                                            `https://wa.me/?text=${encodeURIComponent(link)}`,
                                        )
                                    }
                                    className="rounded-2xl border border-current/15 bg-white/40 px-4 py-3 text-sm">
                                    WhatsApp
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        openShare(
                                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                link,
                                            )}`,
                                        )
                                    }
                                    className="rounded-2xl border border-current/15 bg-white/40 px-4 py-3 text-sm">
                                    Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
