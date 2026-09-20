"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { getInvoice } from "../../invoice/api/getInvoice";
import { computeReceivedByInvoice } from "../../invoice/lib/invoice";
import { MoneyReceipt } from "../components/MoneyReceipt";
import { getMoneyReceiptList } from "../api/getMoneyReceiptList";
import type { InvoiceDetail } from "../../invoice/types";
import type { MoneyReceiptListItem } from "../api/getMoneyReceiptList";

export default function MoneyReceiptCreatePage() {
  const searchParams = useSearchParams();
  const invoicesParam = searchParams.get("invoices");
  const paymentTerm = searchParams.get("paymentTerm") ?? undefined;
  const { token } = useAuth();
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>([]);
  const [receivedByInvoice, setReceivedByInvoice] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const ids = (invoicesParam ?? "").split(",").map((id) => id.trim()).filter(Boolean);

        const [details, receipts] = await Promise.all([
          (async () => {
            const result: InvoiceDetail[] = [];
            for (const id of ids) {
              try {
                result.push(await getInvoice(id, token));
              } catch (err) {
                console.error(`Failed to load invoice ${id}:`, err);
              }
            }
            return result;
          })(),
          getMoneyReceiptList(token),
        ]);

        if (!cancelled) {
          setInvoiceDetails(details);
          setReceivedByInvoice(computeReceivedByInvoice(receipts));
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, invoicesParam]);

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><p>Loading...</p></main>;
  if (error) return <main className="min-h-screen bg-slate-50 p-6"><p className="text-red-600">Error: {error}</p></main>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Money Receipt</p>
              <h1 className="text-2xl font-semibold text-slate-900">Generate money receipt</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review the selected invoices, fill in the receipt details, then save the receipt and download
                the money receipt PDF.
              </p>
            </div>
          </div>
          {invoiceDetails.length === 0 ? (
            <p className="text-sm text-slate-500">
              No invoices selected. Go back and check at least one invoice.
            </p>
          ) : (
            <MoneyReceipt
              invoices={invoiceDetails}
              receivedByInvoice={receivedByInvoice}
              initialPaymentTerm={paymentTerm}
            />
          )}
        </section>
      </div>
    </main>
  );
}
