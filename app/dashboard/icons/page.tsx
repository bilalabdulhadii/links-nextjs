"use client";

import { IconsEditor } from "@/components/dashboard/icons-editor";
import { useDashboard } from "@/components/dashboard/dashboard-shell";

export default function IconsPage() {
    const { draft, onChange } = useDashboard();
    return <IconsEditor config={draft} onChange={onChange} />;
}
