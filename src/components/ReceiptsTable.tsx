"use client";

import { useState } from "react";
import { EXPENSE_TYPES, type Receipt } from "@/api/receipts";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

interface ReceiptsTableProps {
  receipts: Receipt[];
  onEdit: (receipt: Receipt) => void;
  onDelete: (id: number) => void;
}

function money(value: number) {
  return value.toFixed(2);
}

function Thumbnail({ receipt, className }: { receipt: Receipt; className: string }) {
  if (!receipt.imageUrl) {
    return <span className="text-(--muted)">—</span>;
  }
  return (
    <a href={receipt.imageUrl} target="_blank" rel="noopener noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element -- external MinIO/S3 URL, not a static app asset */}
      <img
        src={receipt.imageUrl}
        alt={`Receipt from ${receipt.companyName}`}
        className={className}
      />
    </a>
  );
}

export function ReceiptsTable({ receipts, onEdit, onDelete }: ReceiptsTableProps) {
  const [pendingDelete, setPendingDelete] = useState<Receipt | null>(null);

  if (receipts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-(--border) py-12 text-center text-sm text-(--muted)">
        No receipts yet — add one above to get started.
      </div>
    );
  }

  return (
    <>
      {/* Desktop: full table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>TIN Number</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Net of VAT</TableHead>
              <TableHead className="text-right">Input Tax</TableHead>
              <TableHead className="text-right">Wtax</TableHead>
              <TableHead className="text-right">Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>
                  <Thumbnail receipt={receipt} className="h-10 w-10 rounded object-cover" />
                </TableCell>
                <TableCell>{receipt.date.slice(0, 10)}</TableCell>
                <TableCell>{EXPENSE_TYPES[receipt.type]}</TableCell>
                <TableCell>{receipt.companyName}</TableCell>
                <TableCell>{receipt.address}</TableCell>
                <TableCell className="font-mono">{receipt.tinNumber}</TableCell>
                <TableCell className="text-right font-mono">{money(receipt.gross)}</TableCell>
                <TableCell className="text-right font-mono">{money(receipt.netOfVat)}</TableCell>
                <TableCell className="text-right font-mono">{money(receipt.inputTax)}</TableCell>
                <TableCell className="text-right font-mono">{money(receipt.wtax)}</TableCell>
                <TableCell className="text-right font-mono">{money(receipt.payment)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => onEdit(receipt)}>
                      Edit
                    </Button>
                    <Button variant="secondary" onClick={() => setPendingDelete(receipt)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: one card per receipt */}
      <div className="flex flex-col gap-3 md:hidden">
        {receipts.map((receipt) => (
          <Card key={receipt.id} className="p-4">
            <div className="flex items-start gap-3">
              <Thumbnail receipt={receipt} className="h-12 w-12 shrink-0 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{receipt.companyName}</p>
                <p className="text-xs text-(--muted)">{receipt.date.slice(0, 10)}</p>
              </div>
              <p className="shrink-0 font-mono text-lg font-semibold text-(--accent)">
                {money(receipt.payment)}
              </p>
            </div>

            <div className="my-3 border-t border-dashed border-(--border)" />

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <span className="block text-(--muted) uppercase">Type</span>
                <span>{EXPENSE_TYPES[receipt.type]}</span>
              </div>
              <div>
                <span className="block text-(--muted) uppercase">TIN Number</span>
                <span className="font-mono">{receipt.tinNumber}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-(--muted) uppercase">Address</span>
                <span>{receipt.address}</span>
              </div>
              <div>
                <span className="block text-(--muted) uppercase">Gross</span>
                <span className="font-mono">{money(receipt.gross)}</span>
              </div>
              <div>
                <span className="block text-(--muted) uppercase">Net of VAT</span>
                <span className="font-mono">{money(receipt.netOfVat)}</span>
              </div>
              <div>
                <span className="block text-(--muted) uppercase">Input Tax</span>
                <span className="font-mono">{money(receipt.inputTax)}</span>
              </div>
              <div>
                <span className="block text-(--muted) uppercase">Wtax</span>
                <span className="font-mono">{money(receipt.wtax)}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => onEdit(receipt)}>
                Edit
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setPendingDelete(receipt)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete receipt?"
      >
        <p className="text-sm text-(--muted)">
          This will permanently delete the receipt from{" "}
          <span className="font-medium text-(--foreground)">{pendingDelete?.companyName}</span>.
          This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (pendingDelete) onDelete(pendingDelete.id);
              setPendingDelete(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
