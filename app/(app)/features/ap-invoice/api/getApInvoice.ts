import { apiGet } from "../../../../lib/api-client";
import type { ApInvoiceDetail } from "../types";

export async function getApInvoice(id: string | number, token?: string): Promise<ApInvoiceDetail> {
  const item = await apiGet<Record<string, unknown>>(`/ap-invoices/${id}`, token);

  return {
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
    vendor: item.vendor as ApInvoiceDetail["vendor"],
    items: item.items as ApInvoiceDetail["items"],
    payment_links: item.payment_links as ApInvoiceDetail["payment_links"],
    created_at: (item.created_at as string | null) ?? null,
    updated_at: (item.updated_at as string | null) ?? null,
  };
}
