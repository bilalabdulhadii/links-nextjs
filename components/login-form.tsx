"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
    className,
    disabled = false,
    ...props
}: React.ComponentProps<"div"> & { disabled?: boolean }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!auth) {
                setError("Firebase is not configured yet.");
                return;
            }
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your email and password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    disabled={disabled}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    disabled={disabled}
                                    required
                                />
                            </Field>
                            {disabled ? (
                                <FieldDescription>
                                    Firebase isn’t configured yet. Add your
                                    environment variables to enable login.
                                </FieldDescription>
                            ) : null}
                            {error ? (
                                <FieldDescription className="text-destructive">
                                    {error}
                                </FieldDescription>
                            ) : null}
                            <Field>
                                <Button
                                    type="submit"
                                    disabled={loading || disabled}>
                                    {loading ? "Signing in..." : "Login"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                Access is invite-only. Contact an admin if you need access.
            </FieldDescription>
        </div>
    );
}
