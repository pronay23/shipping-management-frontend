import { apiGet } from "../../../../lib/api-client";
import type { ApPaymentDetail } from "../types";

export async function getApPayment(id: string | number, token?: string): Promise<ApPaymentDetail> {
  const item = await apiGet<Record<string, unknown>>(`/ap-payments/${id}`, token);

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
    vendor: item.vendor as ApPaymentDetail["vendor"],
    invoice_links: item.invoice_links as ApPaymentDetail["invoice_links"],
    created_at: (item.created_at as string | null) ?? null,
    updated_at: (item.updated_at as string | null) ?? null,
  };
}
