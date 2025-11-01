// /src/components/layout/header/Navbar.tsx
/**
 * Navbar (Server Component)
 * -------------------------
 * - Simple navigation links. You can extend conditionals later if needed.
 * - Kept as a server component (no client hooks).
 */

import Link from "next/link";

export default function Navbar() {
  const links: Array<{ href: string; label: string }> = [
    { href: "/", label: "Home" },
    { href: "/user", label: "Dashboard" },
    // add more: docs, pricing, etc.
  ];

  return (
    <nav className="flex items-center gap-4 text-sm">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          prefetch
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
