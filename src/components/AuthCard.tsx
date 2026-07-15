import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-(--page-bg) px-4 py-10 sm:px-6 sm:py-16">
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="my-6 border-t border-(--border)" />
        <div className="flex flex-col items-center gap-4">{children}</div>
      </Card>
    </div>
  );
}
