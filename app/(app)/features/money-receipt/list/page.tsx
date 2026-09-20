"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { getMoneyReceiptList } from "../api/getMoneyReceiptList";
import { formatCurrency, parseNumber } from "../../invoice/lib/invoice";
import type { MoneyReceiptListItem } from "../api/getMoneyReceiptList";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export default function MoneyReceiptListPage() {
  const { token } = useAuth();
  const [receipts, setReceipts] = useState<MoneyReceiptListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await getMoneyReceiptList(token);
        if (!cancelled) {
          setReceipts(result);
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
  }, [token]);

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><p>Loading...</p></main>;
  if (error) return <main className="min-h-screen bg-slate-50 p-6"><p className="text-red-600">Error: {error}</p></main>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Money Receipt</p>
            <h1 className="text-2xl font-semibold text-slate-900">Saved money receipts</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review all saved money receipts and the amounts received against each invoice.
            </p>
          </div>

          {receipts.length === 0 ? (
            <p className="text-sm text-slate-500">No money receipts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      Receipt Number
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      Date
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      B/L Number
                    </th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Customer</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Vessel</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Total USD
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Total BDT
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Received
                    </th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Payment Term</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      Invoices Covered
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {receipts.map((receipt) => {
                    const id = String(receipt.id);
                    const coveredInvoices = (receipt.invoices ?? []).length;
                    const received =
                      receipt.invoices?.reduce(
                        (sum, invoice) => sum + parseNumber(invoice.paid_amount != null ? String(invoice.paid_amount) : "0"),
                        0
                      ) ?? 0;
                    return (
                      <tr key={id} className="transition hover:bg-slate-50">
                        <td className="whitespace-nowrap px-3 py-2 font-semibold text-sky-600">
                          <Link href={`/features/money-receipt/view/${receipt.id}`} className="hover:underline">
                            {singleLine(receipt.money_receipt_number) || "\u2014"}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(receipt.money_receipt_date) || "\u2014"}</td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(receipt.bl_number) || "\u2014"}</td>
                        <td className="max-w-52 truncate px-3 py-2">{singleLine(receipt.customer_name) || "\u2014"}</td>
                        <td className="max-w-40 truncate px-3 py-2">{singleLine(receipt.vessel) || "\u2014"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">
                          {receipt.total_usd != null
                            ? `$${formatCurrency(parseNumber(String(receipt.total_usd)))}`
                            : "\u2014"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">
                          {receipt.total_bdt != null ? formatCurrency(parseNumber(String(receipt.total_bdt))) : "\u2014"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right text-emerald-700">
                          {received > 0 ? formatCurrency(received) : "\u2014"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(receipt.payment_term) || "\u2014"}</td>
                        <td className="whitespace-nowrap px-3 py-2">{coveredInvoices > 0 ? coveredInvoices : "\u2014"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
