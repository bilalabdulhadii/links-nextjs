"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { user, loading, isConfigured } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="bg-muted flex min-h-svh items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading…</div>
            </div>
        );
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 self-center font-medium">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo.svg"
                        alt="Links"
                        className="size-6"
                    />
                    Links
                </Link>
                <LoginForm disabled={!isConfigured} />
            </div>
        </div>
    );
}
