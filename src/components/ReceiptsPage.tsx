"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { downloadReceiptImages, exportReceipts, type Receipt, type ReceiptInput } from "@/api/receipts";
import { AppShell } from "@/components/AppShell";
import { ReceiptForm } from "@/components/ReceiptForm";
import { ReceiptsTable } from "@/components/ReceiptsTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { useReceipts } from "@/hooks/useReceipts";
import { ROUTES } from "@/router/routes";
import { triggerBlobDownload } from "@/utils/downloadBlob";
import { getCurrentPeriodMonth, getPeriodMonth } from "@/utils/period";

export function ReceiptsPage() {
  const { user, loading: authLoading, accessToken } = useAuth();
  const router = useRouter();
  const { receipts, loading, error, create, update, remove } = useReceipts();
  const [editing, setEditing] = useState<Receipt | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [month, setMonth] = useState(getCurrentPeriodMonth);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadingImages, setDownloadingImages] = useState(false);
  const [downloadImagesError, setDownloadImagesError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ROUTES.LOGIN);
    }
  }, [authLoading, user, router]);

  const formOpen = isAdding || editing !== null;
  const closeForm = () => {
    setIsAdding(false);
    setEditing(null);
  };

  const handleSubmit = async (input: ReceiptInput) => {
    if (editing) {
      return update(editing.id, input);
    }
    return create(input);
  };

  const filteredReceipts = useMemo(
    () => (month ? receipts.filter((r) => getPeriodMonth(new Date(r.date)) === month) : receipts),
    [receipts, month]
  );

  const handleDownload = async () => {
    if (!accessToken || !month) return;
    setDownloadError(null);
    setDownloading(true);
    const result = await exportReceipts(accessToken, month);
    setDownloading(false);
    if (!result.ok) {
      setDownloadError(result.error);
      return;
    }
    triggerBlobDownload(result.blob, result.filename);
  };

  const handleDownloadImages = async () => {
    if (!accessToken || !month) return;
    setDownloadImagesError(null);
    setDownloadingImages(true);
    const result = await downloadReceiptImages(accessToken, month);
    setDownloadingImages(false);
    if (!result.ok) {
      setDownloadImagesError(result.error);
      return;
    }
    triggerBlobDownload(result.blob, result.filename);
  };

  if (authLoading || !user || loading) {
    return (
      <AppShell>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton width={120} height={32} />
            <div className="flex flex-wrap gap-3">
              <Skeleton width={160} height={40} />
              <Skeleton width={100} height={40} />
              <Skeleton width={160} height={40} />
              <Skeleton width={120} height={40} />
            </div>
          </div>
          <Skeleton height={220} borderRadius={8} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Receipts</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-40"
              aria-label="Filter by month"
            />
            <Button variant="secondary" onClick={handleDownload} disabled={!month || downloading}>
              {downloading ? "Downloading…" : "Download"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownloadImages}
              disabled={!month || downloadingImages}
            >
              {downloadingImages ? "Downloading…" : "Download Images"}
            </Button>
            <Button onClick={() => setIsAdding(true)}>Add receipt</Button>
          </div>
        </div>

        {error && <p className="text-sm text-(--danger)">{error}</p>}
        {downloadError && <p className="text-sm text-(--danger)">{downloadError}</p>}
        {downloadImagesError && <p className="text-sm text-(--danger)">{downloadImagesError}</p>}
        <ReceiptsTable receipts={filteredReceipts} onEdit={setEditing} onDelete={remove} />
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? "Edit receipt" : "Add receipt"}
        className="max-w-2xl"
      >
        <ReceiptForm
          key={editing?.id ?? "new"}
          editing={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>
    </AppShell>
  );
}
