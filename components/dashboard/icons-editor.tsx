import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconSelect } from "@/components/ui/icon-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { iconOptions } from "@/lib/icons";
import { createId } from "@/lib/id";
import type { AppConfig, IconItem } from "@/lib/app-config";

export function IconsEditor({
    config,
    onChange,
}: {
    config: AppConfig;
    onChange: (next: AppConfig) => void;
}) {
    const updateIcons = (icons: IconItem[]) => {
        onChange({ ...config, icons });
    };

    const addIcon = () => {
        updateIcons([
            ...config.icons,
            {
                id: createId("icon"),
                label: "New icon",
                iconId: iconOptions[0]?.id ?? "fa:link",
                url: "https://",
            },
        ]);
    };

    const moveIcon = (index: number, direction: -1 | 1) => {
        const next = [...config.icons];
        const target = index + direction;
        if (target < 0 || target >= next.length) {
            return;
        }
        const [item] = next.splice(index, 1);
        next.splice(target, 0, item);
        updateIcons(next);
    };

    return (
        <Card id="icons">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Icons</CardTitle>
                <Button type="button" variant="outline" onClick={addIcon}>
                    Add icon
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {config.icons.map((icon, index) => (
                    <div
                        key={icon.id}
                        className="rounded-lg border border-border p-4">
                        <div className="grid gap-4 md:grid-cols-[1fr_1fr_200px]">
                            <div className="grid gap-2">
                                <Label>Label</Label>
                                <Input
                                    value={icon.label}
                                    onChange={(event) => {
                                        const next = [...config.icons];
                                        next[index] = {
                                            ...icon,
                                            label: event.target.value,
                                        };
                                        updateIcons(next);
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>URL</Label>
                                <Input
                                    value={icon.url}
                                    onChange={(event) => {
                                        const next = [...config.icons];
                                        next[index] = {
                                            ...icon,
                                            url: event.target.value,
                                        };
                                        updateIcons(next);
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Icon</Label>
                                <IconSelect
                                    options={iconOptions}
                                    value={icon.iconId}
                                    onChange={(value) => {
                                        const next = [...config.icons];
                                        next[index] = {
                                            ...icon,
                                            iconId: value,
                                        };
                                        updateIcons(next);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => moveIcon(index, -1)}
                                disabled={index === 0}>
                                Move up
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => moveIcon(index, 1)}
                                disabled={index === config.icons.length - 1}>
                                Move down
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                    updateIcons(
                                        config.icons.filter(
                                            (_, idx) => idx !== index,
                                        ),
                                    )
                                }>
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
                {config.icons.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No icons yet. Add one to get started.
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
