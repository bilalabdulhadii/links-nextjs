"use client";

import { TemplatesEditor } from "@/components/dashboard/templates-editor";
import { useDashboard } from "@/components/dashboard/dashboard-shell";

export default function TemplatesPage() {
    const {
        draft,
        onChange,
        cancelSignal,
        saveSignal,
        rememberThemeBackup,
        clearThemeBackupDraft,
        rememberButtonStyleBackup,
        clearButtonStyleBackupDraft,
    } = useDashboard();
    return (
        <TemplatesEditor
            config={draft}
            onChange={onChange}
            cancelSignal={cancelSignal}
            saveSignal={saveSignal}
            rememberThemeBackup={rememberThemeBackup}
            clearThemeBackupDraft={clearThemeBackupDraft}
            rememberButtonStyleBackup={rememberButtonStyleBackup}
            clearButtonStyleBackupDraft={clearButtonStyleBackupDraft}
        />
    );
}
