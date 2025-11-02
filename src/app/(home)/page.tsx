// /src/app/(home)/page.tsx
/**
 * Home Page
 * ---------
 * Public landing page at "/".
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Authentication with Auth.js + Prisma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Credentials, Email verification and Google OAuth, with role-based access (USER/ADMIN).
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Protected Areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Access the user dashboard or the admin panel based on your role.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <Link href="/user" prefetch>
                User dashboard
              </Link>
            </Button>
            <Button asChild variant="default">
              <Link href="/admin" prefetch>
                Admin panel
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
