"use client";

import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { EXPENSE_TYPES } from "@/api/receipts";
import { AppShell } from "@/components/AppShell";
import { PeriodTotalWidget } from "@/components/dashboard/PeriodTotalWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { RecentReceiptsWidget } from "@/components/dashboard/RecentReceiptsWidget";
import { SpendByTypeWidget } from "@/components/dashboard/SpendByTypeWidget";
import { buttonClasses } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useReceipts } from "@/hooks/useReceipts";
import { ROUTES } from "@/router/routes";
import { formatPeriodLabel, getCurrentPeriodMonth, getPeriodMonth } from "@/utils/period";

export function HomeContent() {
  const { user, loading: authLoading } = useAuth();
  const { receipts, loading: receiptsLoading } = useReceipts();

  if (authLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <Skeleton width={280} height={40} />
        <Skeleton width={360} height={20} count={2} />
      </div>
    );
  }

  if (user) {
    if (receiptsLoading) {
      return (
        <AppShell>
          <h1 className="text-2xl font-semibold">Welcome back, {user.name ?? user.email}</h1>
          <p className="mt-2 max-w-md text-(--muted)">
            Track your collections, attach receipts, and prepare your submissions.
          </p>
          <div className="mt-6 flex flex-col gap-4">
            <Skeleton height={110} borderRadius={8} />
            <Skeleton height={76} borderRadius={8} />
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
              <Skeleton height={200} borderRadius={8} />
              <Skeleton height={200} borderRadius={8} />
            </div>
          </div>
        </AppShell>
      );
    }

    const month = getCurrentPeriodMonth();
    const periodReceipts = receipts.filter((r) => getPeriodMonth(new Date(r.date)) === month);
    const periodTotal = periodReceipts.reduce((sum, r) => sum + r.payment, 0);

    const totalsByType = new Map<string, number>();
    for (const r of periodReceipts) {
      totalsByType.set(r.type, (totalsByType.get(r.type) ?? 0) + r.gross);
    }
    const spendByType = [...totalsByType.entries()]
      .map(([type, total]) => ({ label: EXPENSE_TYPES[type as keyof typeof EXPENSE_TYPES], total }))
      .sort((a, b) => b.total - a.total);

    const recentReceipts = [...receipts]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    return (
      <AppShell>
        <h1 className="text-2xl font-semibold">Welcome back, {user.name ?? user.email}</h1>
        <p className="mt-2 max-w-md text-(--muted)">
          Track your collections, attach receipts, and prepare your submissions.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <PeriodTotalWidget
            periodLabel={formatPeriodLabel(month)}
            total={periodTotal}
            count={periodReceipts.length}
          />
          <QuickActionsWidget month={month} />
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <SpendByTypeWidget data={spendByType} />
            <RecentReceiptsWidget receipts={recentReceipts} />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-(--page-bg) px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-(--accent)">Recivo</h1>
      <p className="max-w-md text-(--muted)">
        Record, monitor, and organize your daily collections — track amounts, attach
        receipts and remittance advice, and prepare accurate records before submitting to
        your supervisor.
      </p>
      <div className="flex gap-4">
        <Link href={ROUTES.SIGNUP} className={buttonClasses("primary")}>
          Sign up
        </Link>
        <Link href={ROUTES.LOGIN} className={buttonClasses("secondary")}>
          Log in
        </Link>
      </div>
    </div>
  );
}
