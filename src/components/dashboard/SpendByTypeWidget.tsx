import { Card } from "@/components/ui/Card";

interface SpendByTypeEntry {
  label: string;
  total: number;
}

interface SpendByTypeWidgetProps {
  data: SpendByTypeEntry[];
}

export function SpendByTypeWidget({ data }: SpendByTypeWidgetProps) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold">Spend by type</h2>
      {data.length === 0 ? (
        <p className="mt-3 text-sm text-(--muted)">No receipts this period yet.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {data.map((entry) => (
            <div key={entry.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>{entry.label}</span>
                <span className="font-mono text-(--muted)">{entry.total.toFixed(2)}</span>
              </div>
              <div className="h-2 rounded-full bg-(--accent-soft)">
                <div
                  className="h-2 rounded-full bg-(--accent)"
                  style={{ width: `${(entry.total / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
