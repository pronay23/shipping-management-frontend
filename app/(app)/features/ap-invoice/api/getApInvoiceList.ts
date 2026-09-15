import type { ApInvoiceListItem } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function getApInvoiceList(): Promise<ApInvoiceListItem[]> {
  const response = await fetch(`${API_BASE_URL}/ap-invoices`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to load AP invoice list (${response.status}): ${message || response.statusText}`);
  }

  const rawData = await response.json();

  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData.map((item: Record<string, unknown>) => ({
    id: (item.id as string | number) ?? "",
    vendor_id: (item.vendor_id as string | number) ?? "",
    ap_invoice_number: (item.ap_invoice_number as string | null) ?? null,
    invoice_date: (item.invoice_date as string | null) ?? null,
    due_date: (item.due_date as string | null) ?? null,
    reference: (item.reference as string | null) ?? null,
    description: (item.description as string | null) ?? null,
    total_bdt: (item.total_bdt as string | number | null) ?? null,
    discount_amount: (item.discount_amount as string | number | null) ?? null,
    tax_amount: (item.tax_amount as string | number | null) ?? null,
    net_amount: (item.net_amount as string | number | null) ?? null,
    paid_amount: (item.paid_amount as string | number | null) ?? null,
    due_amount: (item.due_amount as string | number | null) ?? null,
    status: (item.status as string | null) ?? null,
    notes: (item.notes as string | null) ?? null,
    vendor: item.vendor as ApInvoiceListItem["vendor"],
    items: item.items as ApInvoiceListItem["items"],
    created_at: (item.created_at as string | null) ?? null,
    updated_at: (item.updated_at as string | null) ?? null,
  }));
}
