import type { ApPaymentFormData, ApPaymentListItem } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function saveApPayment(
  form: ApPaymentFormData,
  existingId?: string | number
): Promise<ApPaymentListItem> {
  const payload = {
    vendor_id: Number(form.vendorId),
    ap_payment_number: form.apPaymentNumber,
    payment_date: form.paymentDate,
    payment_method: form.paymentMethod,
    bank_account_id: form.bankAccountId || null,
    reference_number: form.referenceNumber || null,
    amount: Number(form.amount) || 0,
    notes: form.notes || null,
    invoices: form.invoices.map((inv) => ({
      ap_invoice_id: Number(inv.apInvoiceId),
      paid_amount: Number(inv.paidAmount) || 0,
    })),
  };

  const url = existingId ? `${API_BASE_URL}/ap-payments/${existingId}` : `${API_BASE_URL}/ap-payments`;
  const method = existingId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to save AP payment (${response.status}): ${message || response.statusText}`);
  }

  const item = (await response.json()) as Record<string, unknown>;

  return {
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
  };
}
