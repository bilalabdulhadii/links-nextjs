"use client";

import { useDashboard } from "@/components/dashboard/dashboard-shell";
import { PreviewPanel } from "@/components/dashboard/preview-panel";

export default function PreviewPage() {
    const { draft } = useDashboard();

    return (
        <div className="h-[calc(100vh-5rem)] min-h-0">
            <PreviewPanel config={draft} className="h-full" />
        </div>
    );
}
