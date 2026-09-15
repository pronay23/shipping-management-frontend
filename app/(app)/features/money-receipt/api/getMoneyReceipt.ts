import type { MoneyReceiptPayload } from "../types";

export interface MoneyReceiptDetail extends Omit<MoneyReceiptPayload, "items" | "invoices"> {
  id: string | number;
  items: Array<{
    id: string | number;
    key: string | null;
    label: string;
    qty_20: string | number;
    qty_40: string | number;
    rate_usd: string | number;
    rate_bdt: string | number;
    total_usd: string | number;
  }>;
  invoices: Array<{
    invoice_id: string | number;
    paid_amount: string | number;
    invoice?: {
      invoice_number: string | null;
      invoice_date: string | null;
      bl_number: string | null;
      customer_name: string | null;
      vessel: string | null;
      voyage: string | null;
      total_usd: string | number | null;
      total_bdt: string | number | null;
    } | null;
  }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function getMoneyReceipt(id: string | number): Promise<MoneyReceiptDetail> {
  const response = await fetch(`${API_BASE_URL}/money-receipts/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to load money receipt (${response.status}): ${message || response.statusText}`);
  }

  return (await response.json()) as MoneyReceiptDetail;
}
