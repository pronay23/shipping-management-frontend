import { apiPost, apiPut } from "../../../../lib/api-client";
import type { ApInvoiceFormData, ApInvoiceListItem } from "../types";

export async function saveApInvoice(
  form: ApInvoiceFormData,
  existingId?: string | number,
  token?: string
): Promise<ApInvoiceListItem> {
  const payload = {
    vendor_id: Number(form.vendorId),
    ap_invoice_number: form.apInvoiceNumber,
    invoice_date: form.invoiceDate,
    due_date: form.dueDate || null,
    reference: form.reference || null,
    description: form.description || null,
    discount_amount: Number(form.discountAmount) || 0,
    tax_amount: Number(form.taxAmount) || 0,
    notes: form.notes || null,
    items: form.items.map((item) => ({
      account_id: Number(item.accountId),
      description: item.description,
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unitPrice) || 0,
      total_bdt: Number(item.totalBdt) || 0,
      notes: item.notes || null,
    })),
  };

  const item = existingId
    ? await apiPut<Record<string, unknown>>(`/ap-invoices/${existingId}`, payload, token)
    : await apiPost<Record<string, unknown>>("/ap-invoices", payload, token);

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
    vendor: item.vendor as ApInvoiceListItem["vendor"],
    items: item.items as ApInvoiceListItem["items"],
    created_at: (item.created_at as string | null) ?? null,
    updated_at: (item.updated_at as string | null) ?? null,
  };
}
