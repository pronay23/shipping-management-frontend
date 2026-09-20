import type { InvoicePayload } from "../types";
import { apiPost } from "../../../../lib/api-client";

export interface SaveInvoiceResult {
  ok: boolean;
  data: unknown;
}

export async function saveInvoice(payload: InvoicePayload, token?: string): Promise<SaveInvoiceResult> {
  const data = await apiPost<unknown>("/invoices", payload, token);
  return { ok: true, data };
}
