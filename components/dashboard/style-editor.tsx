import { ColorInput } from "@/components/ui/color-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { StyleConfig } from "@/lib/app-config";

export function StyleEditor({
    style,
    onChange,
    className,
}: {
    style: StyleConfig;
    onChange: (next: StyleConfig) => void;
    className?: string;
}) {
    return (
        <div className={cn("grid gap-4 md:grid-cols-2", className)}>
            <div className="grid gap-2">
                <Label>Border color</Label>
                <ColorInput
                    value={style.borderColor}
                    onChange={(value) =>
                        onChange({ ...style, borderColor: value })
                    }
                    placeholder="ffffff (empty = transparent)"
                />
            </div>
            <div className="grid gap-2">
                <Label>Text color</Label>
                <ColorInput
                    value={style.textColor}
                    onChange={(value) =>
                        onChange({ ...style, textColor: value })
                    }
                    placeholder="0f172a (empty = transparent)"
                />
            </div>
            <div className="grid gap-2">
                <Label>Background color</Label>
                <ColorInput
                    value={style.bgColor}
                    onChange={(value) => onChange({ ...style, bgColor: value })}
                    placeholder="0f172a (empty = transparent)"
                />
            </div>
            <div className="grid gap-2">
                <Label>Hover border</Label>
                <ColorInput
                    value={style.hoverBorderColor}
                    onChange={(value) =>
                        onChange({ ...style, hoverBorderColor: value })
                    }
                    placeholder="e2e8f0 (empty = transparent)"
                />
            </div>
            <div className="grid gap-2">
                <Label>Hover text</Label>
                <ColorInput
                    value={style.hoverTextColor}
                    onChange={(value) =>
                        onChange({ ...style, hoverTextColor: value })
                    }
                    placeholder="0b1020 (empty = transparent)"
                />
            </div>
            <div className="grid gap-2">
                <Label>Hover background</Label>
                <ColorInput
                    value={style.hoverBgColor}
                    onChange={(value) =>
                        onChange({ ...style, hoverBgColor: value })
                    }
                    placeholder="f8fafc (empty = transparent)"
                />
            </div>
            <div className="grid gap-2">
                <Label>Radius (px)</Label>
                <Input
                    type="number"
                    min={0}
                    value={style.radius}
                    onChange={(event) =>
                        onChange({
                            ...style,
                            radius: Number(event.target.value),
                        })
                    }
                />
            </div>
            <div className="grid gap-2">
                <Label>Text align</Label>
                <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={style.textAlign}
                    onChange={(event) =>
                        onChange({
                            ...style,
                            textAlign: event.target.value as
                                | "left"
                                | "center"
                                | "right",
                        })
                    }>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </div>
        </div>
    );
}
