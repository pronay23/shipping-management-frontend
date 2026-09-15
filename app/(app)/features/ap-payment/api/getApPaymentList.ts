import type { ApPaymentListItem } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function getApPaymentList(): Promise<ApPaymentListItem[]> {
  const response = await fetch(`${API_BASE_URL}/ap-payments`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to load AP payment list (${response.status}): ${message || response.statusText}`);
  }

  const rawData = await response.json();

  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData.map((item: Record<string, unknown>) => ({
    id: (item.id as string | number) ?? "",
    vendor_id: (item.vendor_id as string | number) ?? "",
    ap_payment_number: (item.ap_payment_number as string | null) ?? null,
    payment_date: (item.payment_date as string | null) ?? null,
    payment_method: (item.payment_method as string | null) ?? null,
    bank_account_id: (item.bank_account_id as string | number | null) ?? null,
    reference_number: (item.reference_number as string | null) ?? null,
    amount: (item.amount as string | number | null) ?? null,
    notes: (item.notes as string | null) ?? null,
    vendor: item.vendor as ApPaymentListItem["vendor"],
    invoice_links: item.invoice_links as ApPaymentListItem["invoice_links"],
    created_at: (item.created_at as string | null) ?? null,
    updated_at: (item.updated_at as string | null) ?? null,
  }));
}
