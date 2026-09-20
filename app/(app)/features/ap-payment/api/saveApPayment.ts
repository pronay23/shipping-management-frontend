import { apiPost, apiPut } from "../../../../lib/api-client";
import type { ApPaymentFormData, ApPaymentListItem } from "../types";

export async function saveApPayment(
  form: ApPaymentFormData,
  existingId?: string | number,
  token?: string
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

  const item = existingId
    ? await apiPut<Record<string, unknown>>(`/ap-payments/${existingId}`, payload, token)
    : await apiPost<Record<string, unknown>>("/ap-payments", payload, token);

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
