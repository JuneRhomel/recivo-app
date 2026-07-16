export type ExpenseType = "FOOD" | "GAS" | "SUPPLIES" | "TRANSPORTATION" | "UTILITIES" | "OTHER";

export const EXPENSE_TYPES: Record<ExpenseType, string> = {
  FOOD: "Food",
  GAS: "Gas",
  SUPPLIES: "Supplies",
  TRANSPORTATION: "Transportation",
  UTILITIES: "Utilities",
  OTHER: "Other",
};

export interface Receipt {
  id: number;
  userId: number;
  date: string;
  type: ExpenseType;
  companyName: string;
  address: string;
  tinNumber: string;
  gross: number;
  netOfVat: number;
  inputTax: number;
  wtaxRate: number;
  wtax: number;
  payment: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptInput {
  date: string;
  type: ExpenseType;
  companyName: string;
  address: string;
  tinNumber: string;
  gross: number;
  wtaxRate: number;
  imageUrl?: string;
}

export type ImageUploadResult =
  | { ok: true; key: string; previewUrl: string }
  | { ok: false; status: number; error: string };

export type ReceiptResult =
  | { ok: true; receipt: Receipt }
  | { ok: false; status: number; error: string };

export type ReceiptListResult =
  | { ok: true; receipts: Receipt[] }
  | { ok: false; status: number; error: string };

export type ReceiptDeleteResult = { ok: true } | { ok: false; status: number; error: string };

async function parseError(res: Response): Promise<string> {
  const data = await res.json().catch(() => null);
  return data?.error ?? "Something went wrong. Please try again.";
}

export async function listReceipts(accessToken: string): Promise<ReceiptListResult> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: await parseError(res) };
    }
    return { ok: true, receipts: await res.json() };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Please try again." };
  }
}

export async function createReceipt(
  accessToken: string,
  input: ReceiptInput
): Promise<ReceiptResult> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: await parseError(res) };
    }
    return { ok: true, receipt: await res.json() };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Please try again." };
  }
}

export async function updateReceipt(
  accessToken: string,
  id: number,
  input: ReceiptInput
): Promise<ReceiptResult> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: await parseError(res) };
    }
    return { ok: true, receipt: await res.json() };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Please try again." };
  }
}

export async function uploadReceiptImage(
  accessToken: string,
  file: File
): Promise<ImageUploadResult> {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: await parseError(res) };
    }
    const data = await res.json();
    return { ok: true, key: data.key, previewUrl: data.previewUrl };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Please try again." };
  }
}

export type FileDownloadResult =
  | { ok: true; blob: Blob; filename: string }
  | { ok: false; status: number; error: string };

async function fetchFileDownload(
  path: string,
  accessToken: string,
  fallbackFilename: string
): Promise<FileDownloadResult> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: await parseError(res) };
    }
    const disposition = res.headers.get("Content-Disposition") ?? "";
    const match = /filename="(.+)"/.exec(disposition);
    const filename = match?.[1] ?? fallbackFilename;
    return { ok: true, blob: await res.blob(), filename };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Please try again." };
  }
}

export async function exportReceipts(
  accessToken: string,
  month: string
): Promise<FileDownloadResult> {
  return fetchFileDownload(
    `/receipts/export?month=${encodeURIComponent(month)}`,
    accessToken,
    `${month}.xlsx`
  );
}

export async function downloadReceiptImages(
  accessToken: string,
  month: string
): Promise<FileDownloadResult> {
  return fetchFileDownload(
    `/receipts/images?month=${encodeURIComponent(month)}`,
    accessToken,
    `${month}-images.zip`
  );
}

export async function deleteReceipt(
  accessToken: string,
  id: number
): Promise<ReceiptDeleteResult> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      return { ok: false, status: res.status, error: await parseError(res) };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Please try again." };
  }
}
