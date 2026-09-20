import { apiGet } from "../../../../lib/api-client";

export interface MoneyReceiptListInvoiceItem {
  invoice_id: string | number;
  paid_amount?: string | number | null;
}

export interface MoneyReceiptListItem {
  id: string | number;
  title: string | null;
  money_receipt_number: string | null;
  money_receipt_date: string | null;
  bl_number: string | null;
  customer_name: string | null;
  vessel: string | null;
  voyage: string | null;
  total_usd: string | number | null;
  total_bdt: string | number | null;
  payment_term: string | null;
  invoices?: MoneyReceiptListInvoiceItem[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export async function getMoneyReceiptList(token?: string): Promise<MoneyReceiptListItem[]> {
  const rawData = await apiGet<unknown>("/money-receipts", token);

  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData.map((item: Record<string, unknown>) => ({
    id: (item.id as string | number) ?? "",
    title: item.title as string | null,
    money_receipt_number: item.money_receipt_number as string | null,
    money_receipt_date: item.money_receipt_date as string | null,
    bl_number: item.bl_number as string | null,
    customer_name: item.customer_name as string | null,
    vessel: item.vessel as string | null,
    voyage: item.voyage as string | null,
    total_usd: item.total_usd as string | number | null,
    total_bdt: item.total_bdt as string | number | null,
    payment_term: item.payment_term as string | null,
    invoices: (item.invoices as MoneyReceiptListInvoiceItem[] | null | undefined) ?? null,
    created_at: item.created_at as string | null,
    updated_at: item.updated_at as string | null,
  }));
}
