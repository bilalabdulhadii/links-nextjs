"use client";

import { ButtonsEditor } from "@/components/dashboard/buttons-editor";
import { useDashboard } from "@/components/dashboard/dashboard-shell";

export default function ButtonsPage() {
    const { draft, onChange, upload } = useDashboard();
    return (
        <ButtonsEditor config={draft} onChange={onChange} onUpload={upload} />
    );
}
