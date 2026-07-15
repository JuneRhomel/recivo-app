"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/router/routes";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.RECEIPTS, label: "Receipts" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-(--sidebar-border) bg-(--sidebar-bg) p-4 md:flex">
      <span className="px-2 text-lg font-semibold text-(--accent)">Recivo</span>
      <nav className="mt-6 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-(--accent-soft) text-(--accent)"
                : "text-(--foreground) hover:bg-black/4"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-2 border-t border-(--sidebar-border) pt-4">
        {user && (
          <span className="truncate px-2 text-xs text-(--muted)">{user.name ?? user.email}</span>
        )}
        <button
          onClick={logout}
          className="rounded-md px-3 py-2 text-left text-sm font-medium text-(--foreground) transition-colors hover:bg-black/4"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
