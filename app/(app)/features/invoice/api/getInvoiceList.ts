import type { InvoiceListItem } from "../types";
import { apiGet } from "../../../../lib/api-client";

export async function getInvoiceList(token?: string): Promise<InvoiceListItem[]> {
  const rawData = await apiGet<unknown>("/invoices", token);

  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData.map((item: Record<string, unknown>) => ({
    id: (item.id as string | number) ?? "",
    invoice_number: item.invoice_number as string | null,
    title: item.title as string | null,
    invoice_date: item.invoice_date as string | null,
    customer_name: item.customer_name as string | null,
    bl_number: item.bl_number as string | null,
    vessel: item.vessel as string | null,
    voyage: item.voyage as string | null,
    total_usd: item.total_usd as string | number | null,
    total_bdt: item.total_bdt as string | number | null,
    remarks: item.remarks as string | null,
    status: item.status as string | null,
    status_label: item.status_label as string | null,
    created_at: item.created_at as string | null,
    updated_at: item.updated_at as string | null,
  }));
}
