import type { ApInvoiceFormData, ApInvoiceListItem } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function saveApInvoice(
  form: ApInvoiceFormData,
  existingId?: string | number
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

  const url = existingId ? `${API_BASE_URL}/ap-invoices/${existingId}` : `${API_BASE_URL}/ap-invoices`;
  const method = existingId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to save AP invoice (${response.status}): ${message || response.statusText}`);
  }

  const item = (await response.json()) as Record<string, unknown>;

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
