import { apiGet } from "../../../../lib/api-client";
import type { ApPaymentListItem } from "../types";

export async function getApPaymentList(token?: string): Promise<ApPaymentListItem[]> {
  const rawData = await apiGet<unknown>("/ap-payments", token);

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
