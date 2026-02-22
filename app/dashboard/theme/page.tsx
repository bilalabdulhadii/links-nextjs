"use client";

import { ThemeEditor } from "@/components/dashboard/theme-editor";
import { useDashboard } from "@/components/dashboard/dashboard-shell";

export default function ThemePage() {
    const { draft, onChange, upload } = useDashboard();
    return <ThemeEditor config={draft} onChange={onChange} onUpload={upload} />;
}
