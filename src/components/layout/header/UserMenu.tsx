// /src/components/layout/header/UserMenu.tsx  (به‌روزرسانی هندلر Sign out)
"use client";
import { signOutAction } from "@/actions/auth.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogIn, LogOut, Settings, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type UserSummary = {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  role: "USER" | "ADMIN";
};

type UserMenuProps = { user: UserSummary | null };

export default function UserMenu({ user }: UserMenuProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!user) {
    return (
      <Button asChild variant="default">
        <Link href="/auth" prefetch>
          <LogIn className="me-2 h-4 w-4" />
          Sign in / Register
        </Link>
      </Button>
    );
  }

  const initials = (user.name?.charAt(0) || user.email?.charAt(0) || "?").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="inline-flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={undefined} alt={user.name ?? user.email ?? "User"} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline max-w-[160px] truncate">
            {user.name ?? user.email ?? "User"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <User2 className="h-4 w-4" />
          <span className="truncate">{user.email ?? user.name ?? "User"}</span>
        </DropdownMenuLabel>
        <DropdownMenuItem disabled>
          <span className="text-xs text-muted-foreground">Role:</span>
          <span className="ms-2 font-medium">{user.role}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/user/settings" prefetch className="flex items-center w-full">
            <Settings className="me-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            startTransition(async () => {
              const res = await signOutAction("/auth");
              if (res.success) {
                toast.success("Signed out");
                const dest = res.fields?.redirectTo ?? "/auth";
                // Client-side navigation + ensure SSR sees no session
                router.replace(dest);
                router.refresh();
              } else {
                toast.error(res.errors?._form?.[0] ?? "Failed to sign out");
              }
            });
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="me-2 h-4 w-4" />
          {pending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
