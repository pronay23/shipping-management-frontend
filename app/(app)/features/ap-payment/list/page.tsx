"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { getApPaymentList } from "../api/getApPaymentList";
import { formatCurrency, parseNumber } from "../../invoice/lib/invoice";
import type { ApPaymentListItem } from "../types";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export default function ApPaymentListPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<ApPaymentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await getApPaymentList(token);
        if (!cancelled) {
          setPayments(result);
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
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">AP Payment</p>
              <h1 className="text-2xl font-semibold text-slate-900">Saved AP payments</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review all payments made to vendors. Click on an entry to view details.
              </p>
            </div>
            <Link
              href="/features/ap-payment/create"
              className="self-start rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              + Create AP Payment
            </Link>
          </div>

          {payments.length === 0 ? (
            <p className="text-sm text-slate-500">No AP payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Payment #</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Date</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Vendor</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Method</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">Amount</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {payments.map((pmt) => {
                    const id = String(pmt.id);
                    return (
                      <tr key={id} className="transition hover:bg-slate-50">
                        <td className="whitespace-nowrap px-3 py-2 font-semibold text-sky-600">
                          <Link href={`/features/ap-payment/view/${pmt.id}`} className="hover:underline">
                            {singleLine(pmt.ap_payment_number) || "\u2014"}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(pmt.payment_date) || "\u2014"}</td>
                        <td className="max-w-52 truncate px-3 py-2">{singleLine(pmt.vendor?.vendor_name) || "\u2014"}</td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(pmt.payment_method) || "\u2014"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                          {pmt.amount != null ? formatCurrency(parseNumber(String(pmt.amount))) : "\u2014"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(pmt.reference_number) || "\u2014"}</td>
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
