import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <header className="flex items-center border-b border-(--sidebar-border) bg-(--sidebar-bg) p-4 md:hidden">
        <span className="text-lg font-semibold text-(--accent)">Recivo</span>
      </header>
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white p-4 pb-20 md:p-8">{children}</main>
      <BottomNav />
    </div>
  );
}
