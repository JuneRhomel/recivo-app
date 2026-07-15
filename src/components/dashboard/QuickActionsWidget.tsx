"use client";

import Link from "next/link";
import { useState } from "react";
import { exportReceipts } from "@/api/receipts";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/router/routes";
import { triggerBlobDownload } from "@/utils/downloadBlob";

interface QuickActionsWidgetProps {
  month: string;
}

export function QuickActionsWidget({ month }: QuickActionsWidgetProps) {
  const { accessToken } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!accessToken) return;
    setError(null);
    setDownloading(true);
    const result = await exportReceipts(accessToken, month);
    setDownloading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    triggerBlobDownload(result.blob, result.filename);
  };

  return (
    <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-sm font-semibold">Quick actions</h2>
      <div className="flex flex-wrap gap-3">
        <Link href={ROUTES.RECEIPTS} className={buttonClasses("primary")}>
          Add Receipt
        </Link>
        <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
          {downloading ? "Downloading…" : "Download This Period's Report"}
        </Button>
      </div>
      {error && <p className="text-sm text-(--danger)">{error}</p>}
    </Card>
  );
}
