import Link from "next/link";
import type { Receipt } from "@/api/receipts";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/router/routes";

interface RecentReceiptsWidgetProps {
  receipts: Receipt[];
}

export function RecentReceiptsWidget({ receipts }: RecentReceiptsWidgetProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recent receipts</h2>
        <Link href={ROUTES.RECEIPTS} className="text-xs text-(--accent) underline">
          View all
        </Link>
      </div>
      {receipts.length === 0 ? (
        <p className="mt-3 text-sm text-(--muted)">No receipts yet.</p>
      ) : (
        <ul className="mt-3 flex flex-col divide-y divide-(--border)">
          {receipts.map((receipt) => (
            <li key={receipt.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{receipt.companyName}</p>
                <p className="text-xs text-(--muted)">{receipt.date.slice(0, 10)}</p>
              </div>
              <span className="shrink-0 font-mono">{receipt.payment.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
