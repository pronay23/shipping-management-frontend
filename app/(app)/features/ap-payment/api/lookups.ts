import { apiGet } from "../../../../lib/api-client";

export interface ApInvoiceLookup {
  id: number | string;
  ap_invoice_number: string | null;
  vendor_id: number | string;
  due_amount: string | number | null;
  total_bdt: string | number | null;
  net_amount: string | number | null;
  status: string | null;
  vendor?: { id: number | string; vendor_code: string | null; vendor_name: string | null } | null;
}

export async function lookupApInvoiceByNumber(invoiceNumber: string, token?: string): Promise<ApInvoiceLookup> {
  const rawData = await apiGet<unknown>("/ap-payments", token);
  const invoices: ApInvoiceLookup[] = Array.isArray(rawData) ? rawData : [];
  const match = invoices.find(
    (inv) => String(inv.ap_invoice_number).toLowerCase() === String(invoiceNumber).toLowerCase()
  );
  if (!match) {
    throw new Error("Invoice not found");
  }
  return match;
}

export async function getNextApPaymentNumber(token?: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `APP-${year}-`;

  const rawData = await apiGet<unknown>("/ap-payments", token);
  const payments: Array<{ ap_payment_number?: string | null }> = Array.isArray(rawData) ? rawData : [];

  let maxNum = 0;
  for (const p of payments) {
    const num = p.ap_payment_number;
    if (typeof num === "string" && num.startsWith(prefix)) {
      const seq = parseInt(num.slice(prefix.length), 10);
      if (!isNaN(seq) && seq > maxNum) {
        maxNum = seq;
      }
    }
  }

  return `${prefix}${String(maxNum + 1).padStart(4, "0")}`;
}
