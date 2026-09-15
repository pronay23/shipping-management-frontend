import type { InvoiceDetail } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function getInvoice(id: string | number): Promise<InvoiceDetail> {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to load invoice (${response.status}): ${message || response.statusText}`);
  }

  return (await response.json()) as InvoiceDetail;
}
