"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createReceipt,
  deleteReceipt,
  listReceipts,
  updateReceipt,
  type Receipt,
  type ReceiptInput,
} from "@/api/receipts";
import { useAuth } from "./useAuth";

export function useReceipts() {
  const { accessToken, withAuth } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      const result = await withAuth((token) => listReceipts(token));
      if (result.ok) {
        setReceipts(result.receipts);
      } else {
        setError(result.error);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const create = useCallback(
    async (input: ReceiptInput) => {
      const result = await withAuth((token) => createReceipt(token, input));
      if (result.ok) {
        setReceipts((prev) => [result.receipt, ...prev]);
        return { ok: true as const };
      }
      return { ok: false as const, error: result.error };
    },
    [withAuth]
  );

  const update = useCallback(
    async (id: number, input: ReceiptInput) => {
      const result = await withAuth((token) => updateReceipt(token, id, input));
      if (result.ok) {
        setReceipts((prev) => prev.map((r) => (r.id === id ? result.receipt : r)));
        return { ok: true as const };
      }
      return { ok: false as const, error: result.error };
    },
    [withAuth]
  );

  const remove = useCallback(
    async (id: number) => {
      const result = await withAuth((token) => deleteReceipt(token, id));
      if (result.ok) {
        setReceipts((prev) => prev.filter((r) => r.id !== id));
        return { ok: true as const };
      }
      return { ok: false as const, error: result.error };
    },
    [withAuth]
  );

  return { receipts, loading, error, create, update, remove };
}
