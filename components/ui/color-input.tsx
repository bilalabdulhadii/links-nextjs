"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ColorInput({
    value,
    onChange,
    placeholder,
    className,
}: {
    value: string;
    onChange: (next: string) => void;
    placeholder?: string;
    className?: string;
}) {
    const [draft, setDraft] = useState(() => formatInputValue(value));
    const lastValueRef = useRef(value);
    const colorValue = toHexColor(value) ?? "#000000";
    const normalized = value?.trim();
    const isTransparent =
        !normalized ||
        normalized.toLowerCase() === "transparent" ||
        hasZeroAlpha(normalized);
    const swatchStyle = isTransparent
        ? {
              backgroundImage:
                  "linear-gradient(45deg,#cbd5f5 25%,transparent 25%),linear-gradient(-45deg,#cbd5f5 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#cbd5f5 75%),linear-gradient(-45deg,transparent 75%,#cbd5f5 75%)",
              backgroundSize: "10px 10px",
              backgroundPosition: "0 0,0 5px,5px -5px,-5px 0px",
          }
        : { backgroundColor: normalized };

    useEffect(() => {
        if (value !== lastValueRef.current) {
            lastValueRef.current = value;
            setDraft(formatInputValue(value));
        }
    }, [value]);

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <label className="relative h-10 w-12 cursor-pointer overflow-hidden rounded-md border border-input bg-background">
                <span
                    className="absolute inset-1 rounded-sm"
                    style={swatchStyle}
                />
                <input
                    type="color"
                    value={colorValue}
                    onChange={(event) => {
                        const next = event.target.value;
                        lastValueRef.current = next;
                        setDraft(formatInputValue(next));
                        onChange(next);
                    }}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Pick a color"
                />
            </label>
            <Input
                value={draft}
                onChange={(event) => {
                    const raw = event.target.value.trim();
                    if (raw.toLowerCase() === "transparent") {
                        lastValueRef.current = "";
                        setDraft("");
                        onChange("");
                        return;
                    }
                    if (raw.toLowerCase().startsWith("rgb")) {
                        const parsed = parseRgb(raw);
                        if (parsed) {
                            const hex = rgbToHex(parsed);
                            lastValueRef.current = `#${hex}`;
                            setDraft(hex);
                            onChange(`#${hex}`);
                            return;
                        }
                    }
                    const cleaned = normalizeHexInput(raw);
                    setDraft(cleaned);
                    if (!cleaned) {
                        lastValueRef.current = "";
                        onChange("");
                        return;
                    }
                    if (cleaned.length === 6) {
                        const next = `#${cleaned}`;
                        lastValueRef.current = next;
                        onChange(next);
                    }
                }}
                onBlur={() => {
                    const cleaned = normalizeHexInput(draft);
                    if (!cleaned) {
                        if (value) {
                            lastValueRef.current = "";
                            onChange("");
                        }
                        return;
                    }
                    if (cleaned.length === 6) {
                        const next = `#${cleaned}`;
                        lastValueRef.current = next;
                        onChange(next);
                        return;
                    }
                    lastValueRef.current = "";
                    setDraft("");
                    onChange("");
                }}
                placeholder={placeholder}
            />
        </div>
    );
}

function normalizeHexInput(value: string): string {
    return value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
}

function formatInputValue(value: string): string {
    if (!value) {
        return "";
    }

    const raw = value.trim();
    if (!raw) {
        return "";
    }

    if (raw.toLowerCase() === "transparent") {
        return "";
    }

    if (raw.startsWith("#")) {
        return normalizeStoredHex(raw.slice(1));
    }

    const parsed = parseRgb(raw);
    if (parsed) {
        return rgbToHex(parsed);
    }

    return normalizeStoredHex(normalizeHexInput(raw));
}

function toHexColor(value: string): string | null {
    if (!value) {
        return null;
    }

    const raw = value.trim().toLowerCase();
    if (!raw || raw === "transparent") {
        return null;
    }

    if (/^[0-9a-f]{3,8}$/i.test(raw)) {
        return toHexColor(`#${raw}`);
    }

    if (raw.startsWith("#")) {
        const hex = raw.slice(1);
        if (hex.length === 3) {
            return `#${hex
                .split("")
                .map((char) => `${char}${char}`)
                .join("")}`;
        }
        if (hex.length === 4) {
            return `#${expandShortHex(hex.slice(0, 3))}`;
        }
        if (hex.length === 6) {
            return `#${hex}`;
        }
        if (hex.length === 8) {
            return `#${hex.slice(0, 6)}`;
        }
    }

    const parsed = parseRgb(raw);
    if (parsed) {
        return `#${rgbToHex(parsed)}`;
    }

    return null;
}

function parseRgb(value: string): { r: number; g: number; b: number } | null {
    const rgbMatch = value.match(/rgba?\(([^)]+)\)/i);
    if (!rgbMatch) {
        return null;
    }
    const parts = rgbMatch[1].split(",").map((part) => part.trim());
    if (parts.length < 3) {
        return null;
    }
    const clamp = (num: number) => Math.max(0, Math.min(255, num));
    const toChannel = (part: string) => {
        if (part.endsWith("%")) {
            return clamp(Math.round(parseFloat(part) * 2.55));
        }
        return clamp(Math.round(parseFloat(part)));
    };
    const r = toChannel(parts[0]);
    const g = toChannel(parts[1]);
    const b = toChannel(parts[2]);
    return { r, g, b };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
    const toHex = (num: number) => num.toString(16).padStart(2, "0");
    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function expandShortHex(value: string): string {
    return value
        .split("")
        .map((char) => `${char}${char}`)
        .join("");
}

function normalizeStoredHex(value: string): string {
    const cleaned = normalizeHexInput(value);
    if (cleaned.length === 3) {
        return expandShortHex(cleaned);
    }
    if (cleaned.length >= 6) {
        return cleaned.slice(0, 6);
    }
    return cleaned;
}

function hasZeroAlpha(value: string): boolean {
    const raw = value.trim().toLowerCase();
    if (raw.startsWith("#")) {
        const hex = raw.slice(1);
        if (hex.length === 4) {
            return hex[3] === "0";
        }
        if (hex.length === 8) {
            return hex.slice(6, 8) === "00";
        }
    }
    const parsed = parseRgb(raw);
    if (parsed && typeof parsed.a === "number") {
        return parsed.a === 0;
    }
    return false;
}
