import type { InvoiceDetail } from "../types";
import { apiGet } from "../../../../lib/api-client";

export async function getInvoice(id: string | number, token?: string): Promise<InvoiceDetail> {
  return apiGet<InvoiceDetail>(`/invoices/${id}`, token);
}
