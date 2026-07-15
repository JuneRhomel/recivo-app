import { Card } from "@/components/ui/Card";

interface PeriodTotalWidgetProps {
  periodLabel: string;
  total: number;
  count: number;
}

export function PeriodTotalWidget({ periodLabel, total, count }: PeriodTotalWidgetProps) {
  return (
    <Card className="p-5">
      <span className="text-xs font-medium tracking-wide text-(--muted) uppercase">
        {periodLabel} collections
      </span>
      <p className="mt-1 font-mono text-3xl font-bold text-(--accent)">{total.toFixed(2)}</p>
      <p className="mt-1 text-sm text-(--muted)">
        {count} {count === 1 ? "receipt" : "receipts"} this period
      </p>
    </Card>
  );
}
