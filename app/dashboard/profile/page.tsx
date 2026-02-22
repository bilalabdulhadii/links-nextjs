"use client";

import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { useDashboard } from "@/components/dashboard/dashboard-shell";

export default function ProfilePage() {
    const { draft, onChange, upload } = useDashboard();
    return (
        <ProfileEditor config={draft} onChange={onChange} onUpload={upload} />
    );
}
