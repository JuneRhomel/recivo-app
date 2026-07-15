import type { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-(--border) bg-white px-3 py-2 text-sm text-(--foreground) outline-none transition-colors focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 disabled:cursor-not-allowed disabled:bg-black/4 disabled:text-(--muted)",
        className
      )}
      {...props}
    />
  );
}
