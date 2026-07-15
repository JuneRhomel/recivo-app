export interface ReceiptAmounts {
  netOfVat: number;
  inputTax: number;
  wtax: number;
  payment: number;
}

export const WTAX_RATES = [0, 0.01, 0.02, 0.05, 0.1, 0.15] as const;

export function computeReceiptAmounts(gross: number, wtaxRate: number): ReceiptAmounts {
  const netOfVat = gross / 1.12;
  const inputTax = gross - netOfVat;
  const wtax = netOfVat * wtaxRate;
  const payment = gross - wtax;
  return { netOfVat, inputTax, wtax, payment };
}
