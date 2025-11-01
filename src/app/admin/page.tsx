// /src/app/admin/page.tsx
/**
 * Admin Index Page
 * ----------------
 * Minimal admin dashboard landing.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminIndexPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is the admin overview. Extend with charts, stats, and management tools.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
