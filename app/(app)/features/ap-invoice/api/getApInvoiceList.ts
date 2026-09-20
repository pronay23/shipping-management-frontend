import { apiGet } from "../../../../lib/api-client";
import type { ApInvoiceListItem } from "../types";

export async function getApInvoiceList(token?: string): Promise<ApInvoiceListItem[]> {
  const rawData = await apiGet<unknown>("/ap-invoices", token);

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
