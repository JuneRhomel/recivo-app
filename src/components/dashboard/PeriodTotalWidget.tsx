"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface PeriodTotalWidgetProps {
  periodLabel: string;
  total: number;
  count: number;
  target: number;
  onTargetChange: (target: number) => void;
}

export function PeriodTotalWidget({
  periodLabel,
  total,
  count,
  target,
  onTargetChange,
}: PeriodTotalWidgetProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(target));

  const progress = target > 0 ? Math.min(total / target, 1) * 100 : 0;

  const commit = () => {
    const value = Number(draft);
    setEditing(false);
    if (Number.isFinite(value) && value > 0) {
      onTargetChange(value);
    } else {
      setDraft(String(target));
    }
  };

  return (
    <Card className="p-5">
      <span className="text-xs font-medium tracking-wide text-(--muted) uppercase">
        {periodLabel} collections
      </span>
      <p className="mt-1 font-mono text-3xl font-bold text-(--accent)">{total.toFixed(2)}</p>
      <p className="mt-1 text-sm text-(--muted)">
        {count} {count === 1 ? "receipt" : "receipts"} this period
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-(--muted)">
          <span>Target</span>
          {editing ? (
            <Input
              autoFocus
              type="number"
              min={0}
              step="0.01"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              className="w-24 px-2 py-1 text-right"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraft(String(target));
                setEditing(true);
              }}
              className="font-mono text-(--foreground) hover:underline"
              title="Click to change target"
            >
              {target.toFixed(2)}
            </button>
          )}
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-(--border)">
          <div
            className="h-full rounded-full bg-(--accent) transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
