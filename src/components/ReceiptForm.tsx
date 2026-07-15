"use client";

import { useState } from "react";
import { uploadReceiptImage } from "@/api/receipts";
import type { ExpenseType, Receipt, ReceiptInput } from "@/api/receipts";
import { EXPENSE_TYPES } from "@/api/receipts";
import { Button } from "@/components/ui/Button";
import { Dropzone } from "@/components/ui/Dropzone";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { computeReceiptAmounts, WTAX_RATES } from "@/utils/receiptMath";

const EMPTY_FORM = {
  date: "",
  type: "FOOD" as ExpenseType,
  companyName: "",
  address: "",
  tinNumber: "",
  gross: "",
  wtaxRate: String(WTAX_RATES[0]),
};

interface ReceiptFormProps {
  editing: Receipt | null;
  onSubmit: (input: ReceiptInput) => Promise<{ ok: boolean; error?: string }>;
  onCancel: () => void;
}

export function ReceiptForm({ editing, onSubmit, onCancel }: ReceiptFormProps) {
  const [form, setForm] = useState(() =>
    editing
      ? {
          date: editing.date.slice(0, 10),
          type: editing.type,
          companyName: editing.companyName,
          address: editing.address,
          tinNumber: editing.tinNumber,
          gross: String(editing.gross),
          wtaxRate: String(editing.wtaxRate),
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(editing?.imageUrl ?? null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { accessToken } = useAuth();

  const gross = Number(form.gross);
  const wtaxRate = Number(form.wtaxRate);
  const preview =
    Number.isFinite(gross) && gross > 0 ? computeReceiptAmounts(gross, wtaxRate) : null;

  const handleFileSelected = async (file: File) => {
    if (!accessToken) return;
    setError(null);
    setUploadingImage(true);
    const result = await uploadReceiptImage(accessToken, file);
    setUploadingImage(false);
    if (result.ok) {
      setImageUrl(result.imageUrl);
    } else {
      setError(result.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await onSubmit({
      date: form.date,
      type: form.type,
      companyName: form.companyName,
      address: form.address,
      tinNumber: form.tinNumber,
      gross,
      wtaxRate,
      imageUrl: imageUrl ?? undefined,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-medium tracking-wide text-(--muted) uppercase">
          Date
          <Input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium tracking-wide text-(--muted) uppercase">
          Type
          <Select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ExpenseType })}
          >
            {Object.entries(EXPENSE_TYPES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium tracking-wide text-(--muted) uppercase">
          Company Name
          <Input
            required
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium tracking-wide text-(--muted) uppercase">
          Address
          <Input
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium tracking-wide text-(--muted) uppercase">
          TIN Number
          <Input
            required
            value={form.tinNumber}
            onChange={(e) => setForm({ ...form, tinNumber: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium tracking-wide text-(--muted) uppercase">
          Gross
          <Input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={form.gross}
            onChange={(e) => setForm({ ...form, gross: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium tracking-wide text-(--muted) uppercase">
          Wtax Rate
          <Select
            value={form.wtaxRate}
            onChange={(e) => setForm({ ...form, wtaxRate: e.target.value })}
          >
            {WTAX_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate * 100}%
              </option>
            ))}
          </Select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-medium tracking-wide text-(--muted) uppercase">
        Receipt image
        <Dropzone
          previewUrl={imageUrl}
          uploading={uploadingImage}
          onFileSelected={handleFileSelected}
          onRemove={() => setImageUrl(null)}
        />
      </label>

      {preview && (
        <div className="grid grid-cols-2 gap-3 rounded-md border border-(--accent)/15 bg-(--accent-soft) p-4 text-xs sm:grid-cols-4">
          <span>
            <span className="block text-(--muted) uppercase">Net of VAT</span>
            <span className="font-mono text-sm font-medium">{preview.netOfVat.toFixed(2)}</span>
          </span>
          <span>
            <span className="block text-(--muted) uppercase">Input Tax</span>
            <span className="font-mono text-sm font-medium">{preview.inputTax.toFixed(2)}</span>
          </span>
          <span>
            <span className="block text-(--muted) uppercase">Wtax</span>
            <span className="font-mono text-sm font-medium">{preview.wtax.toFixed(2)}</span>
          </span>
          <span>
            <span className="block text-(--muted) uppercase">Payment</span>
            <span className="font-mono text-sm font-medium text-(--accent)">
              {preview.payment.toFixed(2)}
            </span>
          </span>
        </div>
      )}

      {error && <p className="text-sm text-(--danger)">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {editing ? "Update" : "Add"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
