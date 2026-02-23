import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Page not found</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This dashboard page doesn’t exist or was moved.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm">
                            <Link href="/dashboard">Back to dashboard</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/dashboard/preview">Open preview</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
