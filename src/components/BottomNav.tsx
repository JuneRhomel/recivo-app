"use client";

import { Home, LogOut, Receipt } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/router/routes";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { href: ROUTES.HOME, label: "Home", icon: Home },
  { href: ROUTES.RECEIPTS, label: "Receipts", icon: Receipt },
];

export function BottomNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-(--sidebar-border) bg-(--sidebar-bg) pb-[env(safe-area-inset-bottom)] md:hidden">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium",
              active ? "text-(--accent)" : "text-(--muted)"
            )}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={logout}
        className="flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium text-(--muted)"
      >
        <LogOut size={20} />
        Log out
      </button>
    </nav>
  );
}
